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

const AboutFr = () => {
  return (
    <div>
      <p>
        La carte des arbres remarquables est basée sur les données <i>Opendata</i> publiées par la région de Bruxelles. 
        Voir sur leur site ou ils expliquent le concept de Smart City :
        <br/>
        <a href="http://opendatastore.brussels/en/">http://opendatastore.brussels/fr/</a>
      </p>
      <p>
        L'inventaire des arbres remarquables est consultable sur le site <a href="https://arbres-inventaire.irisnet.be/">arbres-inventaire.irisnet.be</a>, 
        mais pour l'instant il n'y a pas de carte et je ne pense pas que ça va venir.. Il y a bien une carte disponible sur urbis online, mais son utilisation 
        est plutôt difficile et je pense que ça s'addresse aux pro plus qu'aun grand piblic.
        <br/>
        <a href="https://urbisonline.brussels/">urbisonline.brussels</a>
      </p>
      <p>
        Il y a un site que j'aime beaucoup, <a href="www.woodwideweb.be">www.woodwideweb.be</a>, qui m'a donné l'idée d'afficher une carte dynamiquement 
        et l'envie d'apprendre à le faire.
        Cependant sur woodwideweb tout les arbres de l'inventaire ne sont pas repris 
        (les espèces moins communes ne sont pas chargées dans leur base de données) et le filtrage sur une espèce particulière n'est pas possible.
      </p>
      <p>
        L'intérêt principal de ce site est d'aider à reconnaître les arbres, en indiquant ou aller pour trouver une espèce particulière par exemple.
        L'idéal serait d'avoir les arbres d'alignement, ces arbres sont normalement pourvu d'un numéro d'inventaire mais il est actuellement difficile de 
        trouver l'information correspondante à ce numéro sur internel (c'est possible quoique difficile sur un des sites de urbisonline, il faut trouver 
        la bonne couche à ajouter à la carte).
      </p>
    </div>
  );
};

const AboutText = ({ lang } ) => {
  if (lang === 'fr'){
    return (<AboutFr />)
  }
  return (<AboutEn />)
}

const About = ({ t, i18n }) => {
  const { language } = i18n;
  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h3>{t("apropostexte")}</h3>
          <AboutText lang={i18n.language} />
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
