import Head from 'next/head'
import Header from './Header'

export default function Layout(props) {
  return (
    <div>
      <Head>
        <title>Trees Brussels</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
      </Head>
      <div className="container-fluid">
      <Header />
      {props.children}
      </div>
    </div>
  )
}
