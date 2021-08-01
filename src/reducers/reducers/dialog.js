import * as types from 'constants/reduxTypeContants';
import * as appConstants from 'constants/appConstants';

const initialState = {
  open: false,
  type: null,
  title: null,
  subTitle: null,
  message: null,
  onClose: null,
  onAction: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_DIALOG:
      return {
        ...state,
        open: true,
        title: action.title,
        message: action.message,
        onClose: action.onClose,
        onAction: action.onAction
      }
    case types.SHOW_ALERT_DIALOG:
      let subTitle = null, onClose = null;
      if (action.payload.message === appConstants.SESSION_EXPIRED_ERROR_MESSAGE) {
        onClose = 'LOGOUT';
        subTitle = 'Logging out';
      }
      return {
        ...state,
        open: true,
        type: appConstants.DIALOG_TYPE_ALERT,
        title: `Error ${action.status}`,
        subTitle,
        message: action.payload.message ? action.payload.message : JSON.stringify(action.payload),
        onClose,
      }
    case types.SHOW_CONFIRMATION_DIALOG:
      return {
        ...state,
        open: true,
        type: appConstants.DIALOG_TYPE_CONFIRMATION,
        title: action.payload.title,
        message: action.payload.message,
        onAction: action.payload.onAction
      }
    case types.CLOSE_DIALOG:
      return initialState;
    default:
      return state;
  }
}