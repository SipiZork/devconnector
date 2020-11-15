import { SET_ALERT, REMOVE_ALERT, REMOVE_ALL_ALERTS } from './types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType, timeout = 0) => dispatch => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      msg,
      alertType
    }
  });
  if (timeout > 0) {
    setTimeout(() => dispatch({
      type: REMOVE_ALERT,
      payload: id
    }), timeout);
  }
};

export const removeAlert = (id) => dispatch => {
  dispatch({
    type: REMOVE_ALERT,
    payload: id
  })
};

export const removeAllAlerts = () => dispatch => {
  dispatch({
    type: REMOVE_ALL_ALERTS
  })
}