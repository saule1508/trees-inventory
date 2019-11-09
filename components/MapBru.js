import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Circle from './Circle';

import "../node_modules/ol/ol.css"

let lastMove;

const Legend = () => {
  return (
    <div className="row">
      <div className="col-md-12">
        <strong>Circonference (cm): </strong> 
        <span style={{"marginRight": "10px"}}><Circle bgColor="yellow"/> {"< 200"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="green" /> {"200 - 400"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="orange" /> {"400 - 600"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="red" /> {"> 600"}</span>
      </div>
    </div>
  )
}

const lang = 'FR';
const wmsOrthoConfig = {
  srs: 'EPSG:31370',
  params: {
    LAYERS: `Urbis:urbis${lang === 'en' ? 'FR' : lang.toUpperCase()}`,
    VERSION: "1.1.1",
  },
  url: "https://geoservices-urbis.irisnet.be/geoserver/ows",
};

class MapBru extends Component {
  constructor(props) {
    super(props);
    this.state = {'filter': this.props.filter}
  } 
  
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.filter != this.props.filter){
      console.log(`filter has changed to ${nextProps.filter}`);
      this.setVectorSource(nextProps.featureCollection);
    }
    return false;
  }

  componentDidMount() {

    console.log("componentDidMount");

    const Map = require("ol/Map").default
    const View = require("ol/View").default;

    const container = this.refs.popup;
    const content = this.refs.popup_content;
    const closer = this.refs.popup_closer;
    const Overlay = require("ol/Overlay").default;

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    const Circle = require("ol/style").Circle;
    const Fill = require("ol/style").Fill;
    const Stroke = require("ol/style").Stroke;
    
    const proj = require("ol/proj");
    const Projection = require("ol/proj").Projection;
    const EPSG31370 = new Projection({
      code: 'EPSG:31370',
      extent: [14697.30, 22635.80, 291071.84, 246456.18],
      worldExtent: [2.5, 49.5, 6.4, 51.51],
      global: false,
    });
    const Tile = require('ol/layer').Tile;
    const TileWMS = require('ol/source').TileWMS;

    this.baseLayer = new Tile({
      source: new TileWMS({
          projection: proj.get(wmsOrthoConfig.srs),
          params: {
              ...wmsOrthoConfig.params,
              'TILED': true,
          },
          url: wmsOrthoConfig.url,
      }),
    });
    
    this.view = new View({
      projection: EPSG31370,
      center: [148651, 170897],
      zoom: 6,
      rotation: 0,
    });

    this.GeoJSON = require("ol/format").GeoJSON;
    // const TileLayer = require("ol/layer").Tile;
    this.VectorLayer = require("ol/layer").Vector;
    // const Source = require("ol/source");
    this.VectorSource = require("ol/source/Vector").default;

    const vectorSource = new this.VectorSource({
      features: new this.GeoJSON().readFeatures(this.props.featureCollection),
    })

    const Style = require("ol/style/Style").default; 
    this.vectorLayer = new this.VectorLayer({
      source: vectorSource,
      style: function(feature) {
        const circonf = feature.get('CIRCONFERENCE');
        let treeColor = "yellow";
        if (circonf > 600){
          treeColor = "red";
        } else if (circonf > 400){
          treeColor = "orange";
        } else if (circonf > 200){
          treeColor = "green";
        };
        return new Style({
          image: new Circle({
            "radius": 5,
            "fill": new Fill({ color: treeColor }),
            "stroke": new Stroke({ color: "grey", width: 1 })
          })
        })
      }
    })
      // style: new Style({ image: image }),
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    }
    
    this.map =  new Map({
      view: this.view,
      target: this.refs.mapContainer,
      overlays: [overlay],
      layers: [this.baseLayer, this.vectorLayer],
    });

    this.map.on("pointermove", (evt) => {
      /*
      const coordinate = evt.coordinate;
      console.log(coordinate);
      console.log(toStringHDMS(proj.toLonLat(coordinate)));
      */
     const t = performance.now()
     if (t - lastMove < 100) {
         return;
     }
     lastMove = t;



      const feature = this.map.forEachFeatureAtPixel(evt.pixel, feature => {
        // console.log(feature);
        return feature;
      });
      if (feature) {
        var geometry = feature.getGeometry();
        var coord1 = geometry.getCoordinates();
        // console.log(coord1[0]);
        const cName = feature.get(`TAX_${lang === 'EN' ? 'FR' : lang.toUpperCase()}`);
        const cNameLatin = feature.get('TAX_LA');
        
        content.innerHTML = `<p>${cNameLatin}<br/>(${cName})</p>`;
        overlay.setPosition(coord1[0]);
      } else {
        overlay.setPosition(undefined);
      }
    });
    /*
    this.map.on('click', (evt) => {

      const pixel = evt.pixel !== undefined ? evt.pixel : [0, 0];
      const feature = this.map.getFeaturesAtPixel(pixel);
      let cName = '';
      // if (feature && feature.length > 0) {
      //  this.props.onClick(feature[0]);
      //} 
      console.log(cName);

    });
    */
  }

  setVectorSource = (featureCollection) => {
    // change the vectorSource, for ex. after filtering
    console.log(featureCollection.features.length);
    
    const newVectorSource = new this.VectorSource({
      features: new this.GeoJSON().readFeatures(featureCollection),
    })
    console.log(this.map.getLayers());
    const layer=this.map.getLayers().getArray()[1];
    console.log(layer)
    layer.setSource(newVectorSource);
    
  }

  render() {
      console.log('-> render MapBru')
      return (
        <div>
          <Legend />
          <div className="row">
            <div id="mapContainer" ref="mapContainer"> 
            </div>
              <div id="popup" className="ol_popup" ref="popup">
              <button id="popup_closer" type="button" className="ol_popup_closer" aria-label="Close" ref="popup_closer">
              </button>
              <div id="popup_content" ref="popup_content"></div>
            </div>
            <style jsx>{`
            .ol_popup {
              position: absolute;
              background-color: lightgreen;
              -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
              filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
              padding: 5px;
              border-radius: 10px;
              border: 1px solid #cccccc;
              bottom: 12px;
              left: -50px;
              min-width: 280px;
            }
            .ol_popup:after, .ol_popup:before {
              top: 100%;
              border: solid transparent;
              content: " ";
              height: 0;
              width: 0;
              position: absolute;
              pointer-events: none;
            }
            .ol_popup:after {
              border-top-color: white;
              border-width: 10px;
              left: 48px;
              margin-left: -10px;
            }
            .ol_popup:before {
              border-top-color: #cccccc;
              border-width: 11px;
              left: 48px;
              margin-left: -11px;
            }
            .ol_popup_closer {
              text-decoration: none;
              position: absolute;
              top: 2px;
              right: 8px;
            }
            .ol_popup_closer:after {
              content: "✖";
            }
            
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

Map.propTypes = {
  featureCollection: PropTypes.object.isRequired
}

export default MapBru