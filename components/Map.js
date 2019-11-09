import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapFilter from './MapFilter'
import MapBru from './MapBru'
import fetch from 'isomorphic-unfetch';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {'filter': null, featureCollection: this.props.featureCollection}
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
          <MapFilter onSelect={this.onFilterSelected} filter={this.state.filter} taxa={this.props.taxa} />
          <MapBru filter={this.state.filter} featureCollection={this.state.featureCollection} />
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