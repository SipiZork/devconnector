import React from 'react'
import { Link } from 'react-router-dom';

const Landing = () => (
  <section className="landing">
    <div className="dark-overlay">
      <div className="landing-inner">
        <h1 className="x-large">Developer Connector</h1>
        <p className="lead">
          Hozz létre egy fejlesztő profilt, oszd meg a posztjaidat és kérj segítséget más fejlesztőktől
        </p>
        <div className="buttons">
          <Link to="/register" className="btn btn-primary">Regisztráció</Link>
          <Link to="/login" className="btn btn-light">Belépés</Link>
        </div>
      </div>
    </div>
  </section>
)

export default Landing;