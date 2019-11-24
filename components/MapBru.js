import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "../i18n";
import { convertFeatureCollection } from "../utils/index.js";

import "../node_modules/ol/ol.css";

let lastMove;



class MapBru extends Component {
  constructor(props) {
    super(props);
    this.state = { mapOSM: this.props.mapOSM };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.filter != this.props.filter || nextProps.showCut != this.props.showCut) {
      console.log(`filter has changed to ${nextProps.filter}`);
      this.setVectorSource(nextProps.featureCollection);
    }
    // no re-render needed, map will update life
    return false;
  }

  componentDidMount() {
    console.log("componentDidMount");
    console.log(`language is ${this.props.i18n.language}`);

    const lang = this.props.i18n.language;
    const baseMap = "OMS";

    const wmsOrthoConfig = {
      srs: "EPSG:31370",
      params: {
        LAYERS: `Urbis:urbis${lang === "en" ? "FR" : lang.toUpperCase()}`,
        VERSION: "1.1.1",
      },
      url: "https://geoservices-urbis.irisnet.be/geoserver/ows",
    };
    /*
    proj4.defs('EPSG:31370',
    '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 ' +
    '+x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1 +units=m +no_defs');
    const register = require('ol/proj').register;
    const getProjection = require('ol/proj').get;
    //register(proj4);
    const lambertProjection = getProjection('EPSG:31370');
    */

    const Map = require("ol/Map").default;
    const View = require("ol/View").default;

    const container = this.refs.popup;
    const content = this.refs.popup_content;
    const closer = this.refs.popup_closer;
    const Overlay = require("ol/Overlay").default;

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    const Circle = require("ol/style").Circle;
    const Fill = require("ol/style").Fill;
    const Stroke = require("ol/style").Stroke;
    const OSM = require("ol/source").OSM;
    const proj = require("ol/proj");
    const fromLonLat = require("ol/proj").fromLonLat;

    const Projection = require("ol/proj").Projection;
    const EPSG31370 = new Projection({
      code: "EPSG:31370",
      extent: [14697.3, 22635.8, 291071.84, 246456.18],
      worldExtent: [2.5, 49.5, 6.4, 51.51],
      global: false,
    });

    const bruLonLat = [4.34878, 50.85045];
    const bruWebMercator = fromLonLat(bruLonLat);

    const Tile = require("ol/layer").Tile;
    const TileWMS = require("ol/source").TileWMS;
    let viewProperties;
    if (baseMap === "OMS") {
      this.sourceLayer = new OSM();
      viewProperties = {
        projection: "EPSG:3857", //Mercator
        center: bruWebMercator,
        zoom: 12,
        rotation: 0,
      };
    }
    if (baseMap === "iris") {
      this.sourceLayer = new TileWMS({
        projection: proj.get("EPSG:31370"),
        params: {
          LAYERS: `Urbis:urbis${lang === "en" ? "FR" : lang.toUpperCase()}`,
          VERSION: "1.1.1",
          TILED: true,
        },
        url: "https://geoservices-urbis.irisnet.be/geoserver/ows",
      });
      viewProperties = {
        projection: EPSG31370,
        center: [148651, 170897],
      };
    }

    this.baseLayer = new Tile({
      source: this.sourceLayer,
    });

    this.view = new View(viewProperties);

    this.GeoJSON = require("ol/format").GeoJSON;
    // const TileLayer = require("ol/layer").Tile;
    this.VectorLayer = require("ol/layer").Vector;
    // const Source = require("ol/source");
    this.VectorSource = require("ol/source/Vector").default;
    /*
    var vectorSource = new this.VectorSource({
      features: new this.GeoJSON().readFeatures(this.props.featureCollection, { 
      //dataProjection: lambertProjection,
      featureProjection:'EPSG:3857' })
      });
      */
    //const convertedFeatureCollection = convertFeatureCollection(this.props.featureCollection, true);
    //console.log(convertedFeatureCollection.features);
    const vectorSource = new this.VectorSource({
      features: new this.GeoJSON().readFeatures(this.props.featureCollection),
    });

    const Style = require("ol/style/Style").default;
    this.vectorLayer = new this.VectorLayer({
      source: vectorSource,
      style: function(feature) {
        const circonf = feature.get("CIRCONFERENCE");
        let treeColor = "yellow";
        if (circonf > 500) {
          treeColor = "purple";
        } else if (circonf > 400) {
          treeColor = "red";
        } else if (circonf > 300) {
          treeColor = "orange";
        } else if (circonf > 200) {
          treeColor = "green";
        }
        return new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: treeColor }),
            stroke: new Stroke({ color: "grey", width: 1 }),
          }),
        });
      },
    });
    // style: new Style({ image: image }),
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    this.map = new Map({
      view: this.view,
      target: this.refs.mapContainer,
      overlays: [overlay],
      layers: [this.baseLayer, this.vectorLayer],
    });

    this.map.on("Wpointermove", evt => {
      /*
      const coordinate = evt.coordinate;
      console.log(coordinate);
      console.log(toStringHDMS(proj.toLonLat(coordinate)));
      */
      const t = performance.now();
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
        const cName = feature.get(`TAX_${lang.toUpperCase()}`);
        const cNameLatin = feature.get("TAX_LA");
        
        if (cName) {
          content.innerHTML = `<p>${cNameLatin}<br/>${cName}`;
        } else {
          content.innerHTML = `<p>${cNameLatin}`;
        }
        
        overlay.setPosition(coord1[0]);
      } else {
        overlay.setPosition(undefined);
      }
    });

    this.map.on("click", evt => {
      const pixel = evt.pixel !== undefined ? evt.pixel : [0, 0];
      const feature = this.map.getFeaturesAtPixel(pixel);
      let cName = "";
      if (feature && feature.length > 0) {
        this.props.onTreeSelected(feature[0].values_);
      }
    });
  }

  setVectorSource = featureCollection => {
    console.log(featureCollection.features.length);

    const newVectorSource = new this.VectorSource({
      features: new this.GeoJSON().readFeatures(featureCollection),
    });
    console.log(this.map.getLayers());
    const layer = this.map.getLayers().getArray()[1];
    console.log(layer);
    layer.setSource(newVectorSource);
  };

  render() {
    console.log("-> render MapBru");
    return (
      <div>
        <div className="row">
          <div id="mapContainer" ref="mapContainer"></div>
          <div id="popup" className="ol_popup" ref="popup">
            <button
              id="popup_closer"
              type="button"
              className="ol_popup_closer"
              aria-label="Close"
              ref="popup_closer"
            ></button>
            <div id="popup_content" ref="popup_content"></div>
          </div>
          <style jsx>{`
            .ol_popup {
              position: absolute;
              background-color: lightgreen;
              -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
              filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
              padding: 5px;
              border-radius: 10px;
              border: 1px solid #cccccc;
              bottom: 12px;
              left: -50px;
              min-width: 280px;
            }
            .ol_popup:after,
            .ol_popup:before {
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
              border: solid 1px;
            }
          `}</style>
        </div>
      </div>
    );
  }
}

MapBru.propTypes = {
  featureCollection: PropTypes.object.isRequired,
  onTreeSelected: PropTypes.func.isRequired,
  filter: PropTypes.string,
  showCut: PropTypes.bool.isRequired,
  mapOSM: PropTypes.bool.isRequired
};

MapBru.defaultProps = {
  "featureCollection": {type: "featureCollection", features: []},
  "onTreeSelected": ()=>{},
  "filter": null,
  "showCut": true,
  "mapOSM": false

}

export default withTranslation()(MapBru);
