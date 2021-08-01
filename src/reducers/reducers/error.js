import * as types from 'constants/reduxTypeContants';

const initialState = {
  error: null,
  message: null,
  status: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.API_ERROR:
      return {
        error: action.payload,
        message: action.payload.message || 'Unknown Error',
        status: action.status,
      }
    case types.CLEAR_ERROR:
      return {
        error: null,
        message: null,
        status: null,
      }
    default:
      return state;
  }
}