import Layout from '../components/MyLayout';
import Map from '../components/Map';
import PropTypes from 'prop-types'
import { server } from '../config/config.js'
import { withTranslation } from '../i18n'
import fetch from 'isomorphic-unfetch'

const Index = props => (
  <Layout>
    <Map featureCollection={props.featureCollection} taxa={props.taxa} />
  </Layout>
);

Index.getInitialProps = async ({req}) => {
  let onServer = req ? 'yes' : 'no'
  console.log(`getInitialProps, onServer is ${onServer}`);
  const start = new Date();
  try {
    const response = await fetch(`${server}/api/remarkable_feature`);
    let t1 = new Date() - start;
    console.log(`before json ${t1} ms`);
    const featureCollection = await response.json();
    t1 = new Date() - start;
    console.log(`After json ${t1} ms`);
    const taxa = {};
    featureCollection.features.forEach((e)=> {
      const taxon = e.properties['TAX_LA'] 
      if (taxon in taxa){
        taxa[taxon] = taxa[taxon]+1;
      } else {
        taxa[taxon] = 0;
      }
    })
    t1 = new Date() - start;
    console.log(`After taxa ${t1} ms`);
    const taxaSorted = Object.keys(taxa).sort((a,b) => {
        if (a < b){
        return -1;
      }
      if (a === b){
        return 0;
      }
      return 1
    })
    t1 = new Date() - start;
    console.log(`After taxa sort ${t1} ms`);
    return {
      featureCollection,
      taxa : taxaSorted,
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
  t: PropTypes.func.isRequired,
}

export default withTranslation('common')(Index)
