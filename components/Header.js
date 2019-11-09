import Link from 'next/link'

const linkStyle = {
  marginRight: 15
}

export default function Header() {
  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Remarkable trees Brussels</h1>
        <Link href="/">
          <a style={linkStyle}>Map</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
      </div>
    </div>
  )
}
