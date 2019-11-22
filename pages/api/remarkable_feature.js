import fetch from 'isomorphic-unfetch';

export default async function handle(req, res) {
  try {
    /*
    const response = await fetch('https://mybrugis.irisnet.be/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:31370&outputFormat=json&_ga=2.19194872.1942172544.1572781976-2110654057.1572781976');
    const featureCollection = await response.json();
    res.status(200).end(JSON.stringify(featureCollection))
    
   const response = await fetch('https://mybrugis.irisnet.be/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:3857&outputFormat=json&_ga=2.19194872.1942172544.1572781976-2110654057.1572781976');
   const featureCollection = await response.json();
   console.log(featureCollection);
   res.status(200).end(JSON.stringify(featureCollection))
    */
    
    const t = new Date();
    const featureCollection = require('../../data/mercator.json');
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
