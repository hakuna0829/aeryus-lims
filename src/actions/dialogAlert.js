import * as types from 'constants/reduxTypeContants';

export const showDialog = (title, message) => dispatch => {
  dispatch({
    type: types.SHOW_DIALOG,
    title,
    message,
    onAction: () => console.log("fire at action event")
  });
}

export const showErrorDialog = (error) => dispatch => {
  console.log('showErrorDialog Error:', error);
  dispatch({
    type: types.SHOW_ALERT_DIALOG,
    payload: error.response ? error.response.data : error,
    status: error.response ? error.response.status : error.status
  });
}

export const showFailedDialog = (res) => dispatch => {
  dispatch({
    type: types.SHOW_ALERT_DIALOG,
    payload: res.data,
    status: res.status
  });
}

export const showConfirmationDialog = (title, message, onAction) => dispatch => {
  dispatch({
    type: types.SHOW_CONFIRMATION_DIALOG,
    payload: { title, message, onAction }
  });
}

export const closeDialog = () => dispatch => {
  dispatch({
    type: types.CLOSE_DIALOG
  });
}