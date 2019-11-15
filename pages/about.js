import PropTypes from "prop-types";
import Layout from "../components/MyLayout.js";
import { withTranslation } from "../i18n";

const AboutEn = () => {
  return (
    <div>
      <p>
        This Map of remarkable trees of Brussels is build using the data
        published on the Brussels-Capital Region Open Data portal:{' '}  
        <a href="http://opendatastore.brussels/en/">http://opendatastore.brussels/en/</a>
      </p>
      <p>
        The site of irisnet is very useful,{' '}
        <a href="https://arbres-inventaire.irisnet.be/">arbres-inventaire.irisnet.be</a>, but there is no map. It is
        actually possible to find a map of the inventory on urbis online,{' '}
        <a href="https://urbisonline.brussels/">urbisonline.brussels</a>, but it is very tedious and not easy to
        understand.
      </p>
      <p>
        There is also a very cool site, <a href="www.woodwideweb.be">www.woodwideweb.be</a>, which displays a map
        of the trees. The trees of the Brussel's inventory are mapped but unfortunately not all species (and
        the species I am most interested in are not included). Also the
        filtering on the site is not specific enough to be useful, for example one can filter on "Acer", but not further down the family.
      </p>
    </div>
  );
};

const About = ({ t, i18n }) => {
  const { language } = i18n;
  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h3>{t("apropostexte")}</h3>

          <AboutEn />
        </div>
      </div>
    </Layout>
  );
};

About.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

About.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(About);
