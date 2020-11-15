import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setAlert, removeAllAlerts } from '../../actions/alert';
import { register } from '../../actions/auth';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const Register = ({ setAlert, removeAllAlerts, register, isAuthenticated }) => {

  useEffect(() => {
    removeAllAlerts();
    // eslint-disable-next-line
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const onSubmit = async e => {
    e.preventDefault();
    removeAllAlerts();
    if (password !== password2) {
      setAlert('A két jelszó nem egyezik meg', 'danger');
    } else {
      register({ name, email, password, password2 });
    }
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Regisztráció</h1>
      <p className="lead"><i className="fas fa-user"></i> Hozd létre a saját fiókodat</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Név" name="name" value={name} onChange={e => onChange(e)} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email cím" name="email" value={email} onChange={e => onChange(e)} />
          <small className="form-text">
            Ez az oldal Gravatart használ, amennyiben szeretnél profil képet, használd a Gravatart
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Jelszó"
            name="password"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Jelszó megerősítése"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Regisztráció" />
      </form>
      <p className="my-1">
        Már van fiókod? <Link to="/login">Jelentkezz be</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  removeAllAlerts: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { setAlert, removeAllAlerts, register })(Register);