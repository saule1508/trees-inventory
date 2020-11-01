import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withTranslation } from '../i18n'
import { getStyleForFeature } from '../utils'
import "../node_modules/ol/ol.css"

let lastMove;
const event = new Event('treeSelected');

class MapBru extends Component {
  constructor(props) {
    super(props);
    this.state = {'filter': this.props.filter, 'projection': this.props.projection}
  } 
  
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.filter != this.props.filter){
      console.log(`filter has changed to ${nextProps.filter}`);
      this.setVectorSource(nextProps.featureCollection);
    }
    if (nextProps.projection != this.props.projection){
      console.log('shouldComponentupdate: new projection, so return true');
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.addEventListener('treeSelected', this.onTreeSelected);
    console.log(`language is ${this.props.i18n.language}`);
    // Open Street Map (projection 4326) or irisnet (projection 31370)
    const mapName = this.state.projection ===  '31370' ? 'irisnet' : 'osm';
    console.log(`componentDidMount, projection is ${this.state.projection} and mapName is ${mapName}`);
    console.log(this.props.featureCollection);
    const lang = this.props.i18n.language;
    const wmsOrthoConfig = {
      srs: 'EPSG:31370',
      params: {
        LAYERS: `Urbis:urbis${lang === 'en' ? 'FR' : lang.toUpperCase()}`,
        VERSION: "1.1.1",
      },
      url: "https://geoservices-urbis.irisnet.be/geoserver/ows",
    };
    
    const Map = require("ol/Map").default
    const View = require("ol/View").default;

    const container = this.refs.popup;
    const content = this.refs.popup_content;
    const closer = this.refs.popup_closer;
    const Overlay = require("ol/Overlay").default;
    const OSM = require("ol/source").OSM;

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    // const Circle = require("ol/style").Circle;
    // const Fill = require("ol/style").Fill;
    // const Stroke = require("ol/style").Stroke;

    const proj = require("ol/proj");
    const Projection = require("ol/proj").Projection;
    const fromLonLat = require("ol/proj").fromLonLat;
    const EPSG31370 = new Projection({
      code: 'EPSG:31370',
      extent: [14697.30, 22635.80, 291071.84, 246456.18],
      worldExtent: [2.5, 49.5, 6.4, 51.51],
      global: false,
    });
    const bruLonLat = [4.34878, 50.85045];
    const bruWebMercator = fromLonLat(bruLonLat);
    console.log(bruWebMercator);
    // const bruWebMercator = [155255,166013];
    const Tile = require('ol/layer').Tile;
    const TileWMS = require('ol/source').TileWMS;
    
    this.baseLayers = {
      "irisnet": new Tile({
        source: new TileWMS({
          projection: proj.get(wmsOrthoConfig.srs),
          params: {
              ...wmsOrthoConfig.params,
              'TILED': true,
          },
          url: wmsOrthoConfig.url,
        }),
      }),
      "osm": new Tile({
        source: new OSM()
      })
    }
    this.views = {
      'osm': new View ({
        projection: "EPSG:3857",
        //projection: 'EPSG:4326',
        //center: bruLonLat,
        center: bruWebMercator,
        zoom: 12,
        rotation: 0
      }),
      'irisnet': new View({
        projection: EPSG31370,
        center: [148651, 170897],
        zoom: 6,
        rotation: 0,
      })
    }
    /*
    this.view = new View({
      projection: EPSG31370,
      center: [148651, 170897],
      zoom: 6,
      rotation: 0,
    });
    */
    this.GeoJSON = require("ol/format").GeoJSON;
    // const TileLayer = require("ol/layer").Tile;
    this.VectorLayer = require("ol/layer").Vector;
    // const Source = require("ol/source");
    this.VectorSource = require("ol/source/Vector").default;

    this.vectorSources = {
      'irisnet': new this.VectorSource({
        features: new this.GeoJSON().readFeatures(this.props.featureCollection),
      }),
      'osm': new this.VectorSource({
        features: new this.GeoJSON().readFeatures(this.props.featureCollection, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        }),
      })
    }

    const Style = require("ol/style/Style").default; 
    this.vectorLayers = {
      'irisnet':  new this.VectorLayer({
        source: this.vectorSources['irisnet'],
        style: getStyleForFeature
      }),
      'osm': new this.VectorLayer({
        source: this.vectorSources['osm'],
        style: getStyleForFeature
      })
    }

    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    }
    /*
    this.map =  new Map({
      view: this.views[mapName],
      target: this.refs.mapContainer,
      overlays: [overlay],
      layers: [this.baseLayers[mapName], this.vectorLayers[mapName]],
    });
    */
   this.map =  new Map({
    view: this.views[mapName],
    target: this.refs.mapContainer,
    overlays: [overlay],
    layers: [this.baseLayers[mapName],this.vectorLayers[mapName]],
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
    
    this.map.on('click', (evt) => {

      const pixel = evt.pixel !== undefined ? evt.pixel : [0, 0];
      const feature = this.map.getFeaturesAtPixel(pixel);
      let cName = '';
      if (feature && feature.length > 0) {
        this.props.onTreeSelected(feature[0].values_);
      } 
      console.log(cName);

    });
    
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
  componentWillUnmount(){
    window.removeEventListener('treeSelected');
  }

  render() {
      console.log('-> render MapBru')
      return (
        <div>
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
  featureCollection: PropTypes.object.isRequired,
  projection: PropTypes.oneOf(['31370', '4326']).isRequired
}

Map.defaultProps = {
  projection: '31370'
}



export default withTranslation()(MapBru)