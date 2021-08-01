import * as types from 'constants/reduxTypeContants';
import * as appConstants from 'constants/appConstants';

const initialState = {
  isAuthenticated: false,
  isSuperAdmin: false,
  token: null,
  account: null,
  modules: [],
  promptWelcome: false
};

try {
  initialState.isAuthenticated = localStorage.getItem(appConstants.LS_TOKEN) ? true : false;
  initialState.isSuperAdmin = localStorage.getItem(appConstants.LS_ACCOUNT_TYPE) === 'ADMIN';
  initialState.token = localStorage.getItem(appConstants.LS_TOKEN);
  initialState.account = JSON.parse(localStorage.getItem(appConstants.LS_ACCOUNT));
  initialState.modules = JSON.parse(localStorage.getItem(appConstants.LS_MODULES)) || [];
} catch (error) {
  console.log("Auth Reducer Error:", error);
  initialState.isAuthenticated = false;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      localStorage.setItem(appConstants.LS_TOKEN, action.payload.token);
      localStorage.setItem(appConstants.LS_ACCOUNT_TYPE, action.payload.data.role_type);
      localStorage.setItem(appConstants.LS_ACCOUNT, JSON.stringify(action.payload.data.account));
      localStorage.setItem(appConstants.LS_MODULES, JSON.stringify(action.payload.data.modules));
      return {
        isAuthenticated: true,
        isSuperAdmin: action.payload.data.role_type === 'ADMIN',
        token: action.payload.token,
        account: action.payload.data.account,
        modules: action.payload.data.modules,
        promptWelcome: action.payload.data.promptWelcome
      }
    case types.LOGOUT_SUCCESS:
      localStorage.removeItem(appConstants.LS_TOKEN);
      localStorage.removeItem(appConstants.LS_ACCOUNT_TYPE);
      localStorage.removeItem(appConstants.LS_ACCOUNT);
      localStorage.removeItem(appConstants.LS_MODULES);
      return {
        isAuthenticated: false,
        isSuperAdmin: false,
        token: null,
        user: null,
        modules: [],
        promptWelcome: false
      }
    default:
      return state;
  }
}