import Header from './Header'
import 'bootstrap-css-only/css/bootstrap.min.css';

const layoutStyle = {
  margin: 20,
  padding: 20,
 }

export default function Layout(props) {
  return (
    <div className="container-fluid">
      <Header />
      {props.children}
    </div>
  )
}
