import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { removeAllAlerts } from '../../actions/alert';

const Login = ({ login, removeAllAlerts, isAuthenticated }) => {

  useEffect(() => {
    removeAllAlerts();
    // eslint-disable-next-line
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const onSubmit = async e => {
    e.preventDefault();
    removeAllAlerts();
    login(email, password);
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Belépés</h1>
      <p className="lead"><i className="fas fa-user"></i> Jelentkezz be a fiókodba</p>
      <form className="form" onSubmit={ e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email cím" name="email" value={email} onChange={e => onChange(e)} required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Jelszó"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Belépés" />
      </form>
      <p className="my-1">
        Még nincs van fiókod? <Link to="/register">Regisztrálj</Link>
      </p>
    </Fragment>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{ login, removeAllAlerts })(Login);