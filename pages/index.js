import Layout from '../components/MyLayout';
import Map from '../components/Map';
import PropTypes from 'prop-types'
import { server } from '../config/config.js'
import { withTranslation } from '../i18n'
import { getFilters, getFeatureCollection } from '../utils/index.js'

const myProjection = '4326'; // this is OSM default projection, equals to WGS 84. Lambert is EPSG:31370

const Index = props => (
  <Layout>
    <Map featureCollection={props.featureCollection} filters={props.filters} projection={props.projection} />
  </Layout>
);

Index.getInitialProps = async ({req}) => {
  let onServer = req ? 'yes' : 'no'
  console.log(`getInitialProps, onServer is ${onServer} and server is ${server}`);
  const start = new Date();
  try {
    const featureCollection = await getFeatureCollection(myProjection);
    const filters = getFilters(featureCollection); 
    console.log(featureCollection);
    return {
      projection: myProjection,
      featureCollection,
      filters : filters,
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
  filters: PropTypes.shape({
    taxa: PropTypes.shape().isRequired,
    taxaSorted: PropTypes.array.isRequired,
    status: PropTypes.shape().isRequired,
    rarete: PropTypes.shape().isRequired
  }).isRequired,
  projection: PropTypes.oneOf(['31370', '3857', '4326']), // not 4326 because it is distorted
  t: PropTypes.func.isRequired,
}
Index.defaultProps = {
  projection: "4326" // "31370" is Lambert 
}

export default withTranslation('common')(Index)
