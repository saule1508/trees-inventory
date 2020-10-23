// import fetch from 'isomorphic-unfetch';

export default function handle(req, res) {
  try {
    // espg : 31370 or 3857 (not 4326 as it is distorted)
    const epsg = req.query.epsg || '31370';
    console.log(req.query);
    /*
    const response = await fetch(`https://mybrugis.irisnet.be/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=BDU_DMS_PROT:Arbres_remarquables&srsName=EPSG:${epsg}&outputFormat=json`);
    const featureCollection = await response.json();
    res.status(200).end(JSON.stringify(featureCollection))
    */
    const t = new Date();
    const featureCollection = require(`../../data/features_epsg${epsg}.json`);
    let t1 = new Date() - t;
    console.log(`time ${t1} ms, epsg is ${epsg}`);
    const str = JSON.stringify(featureCollection);
    t1 = new Date() - t;
    console.log(`time ${t1} ms`);
    res.status(200).end(str)   
  } catch(e){
    console.log(e);
    res.status(500).end(e.toString());
  }

}
