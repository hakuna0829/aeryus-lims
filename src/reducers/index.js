import { combineReducers } from 'redux';
import auth from './reducers/auth';
import error from './reducers/error';
import dialog from './reducers/dialog';
import data from './reducers/data';

export default combineReducers({
  auth: auth,
  error: error,
  dialog: dialog,
  data: data,
});