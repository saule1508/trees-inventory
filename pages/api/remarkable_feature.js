// import fetch from 'isomorphic-unfetch';

export default function handle(req, res) {
  try {
    /*
    const response = await fetch('https://mybrugis.irisnet.be/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:31370&outputFormat=json&_ga=2.19194872.1942172544.1572781976-2110654057.1572781976');
    const featureCollection = await response.json();
    res.status(200).end(JSON.stringify(featureCollection))
    
    const response = await fetch('https://mybrugis.irisnet.be/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:4326&outputFormat=json&_ga=2.160549944.460743687.1587221579-1535751375.1586501021')
    
    */
    const t = new Date();
    const featureCollection = require('../../data/geoserver_getfeature.json');
    let t1 = new Date() - t;
    console.log(`time ${t1} ms`);
    const str = JSON.stringify(featureCollection);
    t1 = new Date() - t;
    console.log(`time ${t1} ms`);
    res.status(200).end(str)   
  } catch(e){
    console.log(e);
    res.status(500).end(e.toString());
  }

}
