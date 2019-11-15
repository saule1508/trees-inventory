import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapFilter from './MapFilter'
import TreeModal from './TreeModal'
import MapBru from './MapBru'
import MapLegend from './MapLegend';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {'filter': null, modalOpened: false, selectedTree: null,featureCollection: this.props.featureCollection}
  } 

  onTreeSelected = (t) =>{
    console.log(t);
    this.setState({modalOpened: true, selectedTree: t});
  }
  onModalClose = () =>{
    this.setState({modalOpened: false, selectedTree: null});
   
  }

  onFilterSelected = (newFilter) => {
    console.log('onFilterSelected');
    console.log(newFilter);
    const newFeatures = this.props.featureCollection.features.filter((e)=>{
      if (! newFilter){
        return true;
      }
      return (e.properties.TAX_LA === newFilter)
    })

    console.log(`In onFilterSelected, length is ${newFeatures.length}`);
    this.setState({'filter': newFilter, 'featureCollection': {"type":"FeatureCollection","features": newFeatures}});
  }

  render() {
      console.log('-> render Map')
      return (
        <div>
          <TreeModal onClose={this.onModalClose} isOpen={this.state.modalOpened} values={this.state.selectedTree} />
          <MapFilter onSelect={this.onFilterSelected} filter={this.state.filter} taxa={this.props.taxa} />
          <MapLegend />
          <MapBru filter={this.state.filter} featureCollection={this.state.featureCollection} onTreeSelected={this.onTreeSelected} />
        </div>
    );
  }
}

Map.propTypes = {
  featureCollection: PropTypes.object.isRequired,
  taxa: PropTypes.array.isRequired,
  error: PropTypes.string
}

export default Map;