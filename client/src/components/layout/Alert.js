import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeAlert } from '../../actions/alert'

const Alert = ({ alerts, removeAlert }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
  <div key={alert.id} className={`alert alert-${alert.alertType}`}>
    {alert.msg}
    <div className="remove-alert" onClick={(e) => { e.preventDefault(); removeAlert(alert.id) } }>X</div>
  </div>
));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps, { removeAlert })(Alert);
