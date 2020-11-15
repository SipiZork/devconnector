import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

  const authLinks = (
    <ul>
      <li>
        <a onClick={logout} className="pointer">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Kilépés</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
     <ul>
      <li><Link to="/profiles">Fejlesztők</Link></li>
      <li><Link to="/register">Regisztráció</Link></li>
      <li><Link to="/login">Belépés</Link></li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);