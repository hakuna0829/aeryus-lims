import * as types from 'constants/reduxTypeContants';

export const showErrors = (error) => dispatch => {
  dispatch({
    type: types.API_ERROR,
    payload: error,
    status: error.status
  });
}

export const clearErrors = () => dispatch => {
  dispatch({
    type: types.CLEAR_ERROR,
  });
}