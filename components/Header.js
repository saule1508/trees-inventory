// import Link from 'next/link'
import { withTranslation, i18n, Link } from '../i18n'

const linkStyle = {
  marginRight: 15
}
/*
const Header = function(props) {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="Nav">
        <h1>{props.t('h1')}</h1>
        <Link href="/">
          <a style={linkStyle}>Map</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
        <button className="btn btn-link" onClick={() => i18n.changeLanguage("fr")}>Français</button>
        <button className="btn btn-link" onClick={() => i18n.changeLanguage("nl")}>Dutch</button>
        <button className="btn btn-link" onClick={() => i18n.changeLanguage("en")}>English</button>       
      </div>
      </div>
    </div>
  )
}
*/
const Header = function(props){
  return (

<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="#">{props.t('h1')}</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link href="/"><a className="nav-link">{props.t('map')}</a></Link>
      </li>
      <li className="nav-item">
        <Link href="/about"><a className="nav-link">{props.t('about')}</a></Link>
      </li>
    </ul>
    <ul className="navbar-nav">
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {props.t('language')}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" onClick={() => i18n.changeLanguage("fr")} href="#">Français</a>
          <a className="dropdown-item" onClick={() => i18n.changeLanguage("nl")} href="#">Dutch</a>
          <a className="dropdown-item" onClick={() => i18n.changeLanguage("en")} href="#">English</a>
        </div>
      </li>
    </ul>
    {/*
    <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
    */}
    </div>
  </nav>
)
}
export default withTranslation('common')(Header)
