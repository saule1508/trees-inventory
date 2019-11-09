import Layout from '../components/MyLayout';
import Map from '../components/Map';
import PropTypes from 'prop-types'
import { server } from '../config/config.js'

const Index = props => (
  <Layout>
    <Map featureCollection={props.featureCollection} taxa={props.taxa} />
  </Layout>
);

Index.getInitialProps = async () => {
  console.log('getInitialProps');
  try {
    const response = await fetch(`${server}/api/remarkable_feature`);
    const featureCollection = await response.json();
    const taxa = {};
    featureCollection.features.forEach((e)=> {
      const taxon = e.properties['TAX_LA'] 
      if (taxon in taxa){
        taxa[taxon] = taxa[taxon]+1;
      } else {
        taxa[taxon] = 0;
      }
    })
    return {
      featureCollection,
      taxa : Object.keys(taxa).sort((a,b) => {
        if (a < b){
          return -1;
        }
        if (a === b){
          return 0;
        }
        return 1
      })
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
  taxa: PropTypes.array.isRequired
}

export default Index;
