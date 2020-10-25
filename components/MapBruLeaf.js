import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withTranslation } from '../i18n'
// import { getStyleForFeature } from '../utils'
import L from 'leaflet';
// Markers will not appear, so I linked directly in MyLayout.js
// import "../node_modules/leaflet/dist/leaflet.css"

let lastMove;

const wmsOptions = {
  LAYERS: "Urbis:urbisFR",
  VERSION: "1.1.1",
  attribution: "CIRB Brussels"

};
const bruCenterLatLon = [50.85045, 4.34878]; // latLong in decimal degrees (DD)

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

const pToLayer = (feature, latlng) => {
  const circonf = feature.properties['CIRCONFERENCE'];
  const status = feature.properties['STATUS'];
  let treeColor;
  let myRadius;
  if (status === '1' || status === '7' || status === '9' || status === '13' || status === '15') {
    treeColor = "black";
    myRadius = 5;
  } else {
    treeColor = "yellow";
    myRadius = 8;
    if (circonf > 500) {
      treeColor = "purple";
    } else if (circonf > 400) {
      treeColor = "red";
    } else if (circonf > 300) {
      treeColor = "orange";
    } else if (circonf > 200) {
      treeColor = "green";
    }
  };
  const style = {
    radius: myRadius,
    fillColor: treeColor,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  return L.circleMarker(latlng, style);
}


class MapBruLeaf extends Component {
  constructor(props) {
    super(props);
    this.state = { 'filter': this.props.filter, 'projection': this.props.projection }
  }

  componentDidMount() {

    console.log(`language is ${this.props.i18n.language}`);
    const can = canUseDOM;
    console.log(`can is ${can}`);

    this.map = L.map('mapContainer').setView(bruCenterLatLon, 13);
    this.wmsLayer = L.tileLayer.wms('https://geoservices-urbis.irisnet.be/geoserver/ows?', wmsOptions).addTo(this.map);

    /*
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    */
    //var marker = L.marker([50.85045, 4.34878]).addTo(map);
    // const marker = L.marker([50.84127762,4.40460134]).addTo(this.map);
    this.geoLayer = L.geoJSON(this.props.featureCollection, {
      pointToLayer: pToLayer
    });  
    this.geoLayer.addTo(this.map);

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.filter != this.props.filter){
      console.log(`filter has changed to ${nextProps.filter}`);
      this.geoLayer.removeFrom(this.map);
      this.geoLayer.clearLayers();
      this.geoLayer = L.geoJSON(nextProps.featureCollection,{ pointToLayer: pToLayer}).addTo(this.map) 
    }
    if (nextProps.projection != this.props.projection){
      console.log('shouldComponentupdate: new projection, so return true');
      return true;
    }
    return false;
  }

  render() {
    console.log('-> render MapBruLeaf')
    return (
      <div>
        <div className="row">
          <div id="mapContainer" ref="mapContainer" />
          <style jsx>{`
            #mapContainer {
              
              height: 90vh;
              width: 90%;
              margin: 5px;
              padding: 3px;
              border: solid 1px
            }
            `}</style>
        </div>
      </div>
    );
  }


}


export default withTranslation()(MapBruLeaf)