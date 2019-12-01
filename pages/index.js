import Layout from '../components/MyLayout';
import Map from '../components/Map';
import PropTypes from 'prop-types'
import { server } from '../config/config.js'
import { withTranslation } from '../i18n'
import fetch from 'isomorphic-unfetch'
import { getFilters } from '../utils/index.js'

const Index = props => (
  <Layout>
    <Map featureCollection={props.featureCollection} taxa={props.taxa} 
      status={props.status} rarete={props.rarete} mapOSM={props.mapOSM} />
  </Layout>
);

const emptyFeatureCollection = {
  "type":"FeatureCollection",
  "features":[],
  "totalFeatures": 0,
  "numberMatched": 0,
  "numberReturned": 0,
  "timeStamp":"2019-11-06T20:26:47.313Z",
  "crs": {
          "type":"name",
          "properties":{"name":"urn:ogc:def:crs:EPSG::31370"}
         }
}


Index.getInitialProps = async ({req}) => {
  const mapOSM= false;
  let onServer = req ? 'yes' : 'no'
  console.log(`getInitialProps, onServer is ${onServer}`);
  const start = new Date();
  try {
    const response = await fetch(`${server}/api/remarkable_feature?mapOSM=${mapOSM}`);
    let t1 = new Date() - start;
    console.log(`before json ${t1} ms`);
    const featureCollection = await response.json();
    t1 = new Date() - start;
    console.log(`After json ${t1} ms`);
    const { taxaSorted, status, rarete } = getFilters(featureCollection);
    t1 = new Date() - start;
    console.log(`After getFilters ${t1} ms`);
    return {
      featureCollection,
      taxa : taxaSorted,
      status,
      rarete,
      mapOSM,
      namespacesRequired: ['common'],
    };
  } catch (e){
    console.log(e);
    return {
      error: e
    }
  }
}

Index.propTypes = {
  featureCollection: PropTypes.object.isRequired,
  taxa: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  rarete: PropTypes.object.isRequired,
  mapOSM: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

Index.defaultProps = {
  featureCollection: emptyFeatureCollection,
  taxa : [],
  status: {},
  rarete: {},
  mapOSM: false
}
export default withTranslation('common')(Index)
