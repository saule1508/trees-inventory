import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import MapFilter from './MapFilter'
import TreeModal from './TreeModal'
// import MapBru from './MapBru'
import dynamic from 'next/dynamic'
import MapLegend from './MapLegend';
import { getFeatureCollection } from '../utils/index.js'


const MapBruLeaf = dynamic(() => import('./MapBruLeaf'))


function renderCompleted() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true)

      return () => {
          setMounted(false)
      }
  });

  return mounted;
}

const canUseDOM = !!(
  typeof window !== 'undefined' &&
          window.document &&
          window.document.createElement
  );



class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {'filter': null, 
      modalOpened: false, 
      selectedTree: null,
      featureCollection: this.props.featureCollection,
      projection: this.props.projection
    }
  } 

  onTreeSelected = (t) =>{
    console.log(t);
    this.setState({modalOpened: true, selectedTree: t});
  }
  onModalClose = () =>{
    this.setState({modalOpened: false, selectedTree: null});
   
  }
  /* toggle between projections
    epsg: 31370 for Lambert
    epsg: 4326 for OSM
  */

  onProjectionChange = async (newProjection) => {
    console.log(`onProjectionChange: new is ${newProjection}, state is ${this.state.projection}`);
    // now we need another featureCollection
    const newCollection = await getFeatureCollection(newProjection);
    console.log('got new projection');
    this.setState({ featureCollection: newCollection, projection: newProjection})
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
          <MapFilter onSelect={this.onFilterSelected} onProjectionChange={this.onProjectionChange} 
            filter={this.state.filter} filters={this.props.filters} projection={this.state.projection} />
          <MapLegend />
          {canUseDOM && <MapBruLeaf key={this.state.projection} filter={this.state.filter} 
            featureCollection={this.state.featureCollection} 
            projection={this.state.projection}
            onTreeSelected={this.onTreeSelected} />}
        </div>
    );
  }
}

Map.propTypes = {
  featureCollection: PropTypes.object.isRequired,
  filters: PropTypes.shape({
    taxa: PropTypes.shape.isRequired,
    status: PropTypes.shape.isRequired,
    rarete: PropTypes.shape.isRequired
  }).isRequired,
  projection: PropTypes.oneOf(['31370', '4326']),
  error: PropTypes.string
}

Map.defaultProps = {
  projection: '4326'
}

export default Map;