import { withTranslation } from '../i18n'
import Circle from './Circle';

const MapLegend = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div>
          <strong>{props.t('circonference')} (cm): </strong> 
        </div>
        <span style={{"marginRight": "10px"}}><Circle bgColor="yellow"/> {"< 200"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="green" /> {"200 - 300"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="orange" /> {"300 - 400"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="red" /> {"400 > 500"}</span>
        <span style={{"marginRight": "10px"}}><Circle bgColor="purple" /> {"> 500"}</span>
        <div><small>({props.t('map')} source: urbisonline.brussels, data: Brussels Planning and Heritage)</small></div>        
      </div>
    </div>
  )
}

export default withTranslation()(MapLegend)