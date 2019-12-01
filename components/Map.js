import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapFilter from './MapFilter'
import TreeModal from './TreeModal'
import MapBru from './MapBru'
import MapLegend from './MapLegend';
import { filterFeatures } from '../utils/index.js'

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'filters': {'taxa': null, 'rarete': [], status: []}, 
      modalOpened: false, 
      selectedTree: null,
      featureCollection: this.props.featureCollection, showCut: true, mapOSM: false
    }
  } 

  onTreeSelected = (t) =>{
    console.log(t);
    this.setState({modalOpened: true, selectedTree: t});
  }
  onModalClose = () =>{
    this.setState({modalOpened: false, selectedTree: null});
  }
  onToggleCut = () => {
    this.setState(state=>{showCut : ! state.showCut});
  }

  onFilterSelected = (newFilter) => {
    console.log('onFilterSelected');
    console.log(newFilter);
    
    const newFeatures = filterFeatures({features: this.props.featureCollection.features, filters: newFilter});
    console.log(`In onFilterSelected, length is ${newFeatures.length}`);
    
    this.setState({'filters': newFilter, 'featureCollection': {"type":"FeatureCollection","features": newFeatures}});    
  }

  render() {
      console.log('-> render Map')
      return (
        <div>
          <TreeModal onClose={this.onModalClose} isOpen={this.state.modalOpened} values={this.state.selectedTree} />
          <MapFilter onSelect={this.onFilterSelected} filters={this.state.filters} 
            taxa={this.props.taxa} status={this.props.status} rarete={this.props.rarete} />
          <MapLegend />
          
          <MapBru filters={this.state.filters} 
            featureCollection={this.state.featureCollection} 
            onTreeSelected={this.onTreeSelected}
            mapOSM={this.props.mapOSM} />
          
        </div>
    );
  }
}

Map.propTypes = {
  featureCollection: PropTypes.object.isRequired,
  taxa: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  rarete: PropTypes.object.isRequired,
  mapOSM: PropTypes.bool.isRequired
}

Map.defaultProps = {
  featureCollection: {type: "FeatureCollection", features:[]},
  taxa : [],
  status: {},
  rarete: {},
  mapOSM: false
}
export default Map;