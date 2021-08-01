import axios from 'axios';
import * as types from 'constants/reduxTypeContants';
import * as appConstants from 'constants/appConstants';

// get env from process if start or build mode && from window if docker or kubernetes
const { REACT_APP_CLIENT, REACT_APP_API_URL, REACT_APP_EXPLORER_URL, REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY } = { ...process.env, ...window._env_ };

console.log('Client Server:', REACT_APP_CLIENT);
console.log('API URL:', REACT_APP_API_URL);
console.log('Blockchain Explorer URL:', REACT_APP_EXPLORER_URL);

export const clientServer = REACT_APP_CLIENT;

export const apiUrl = REACT_APP_API_URL;
export const explorerUrl = REACT_APP_EXPLORER_URL;
export const reCaptchaSiteKey = REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY;

const setToken = () => {
  axios.defaults.headers.common['testd-jwt-auth'] = localStorage.getItem(appConstants.LS_TOKEN);
}
// set token when page refreshes 
axios.defaults.headers.common['testd-jwt-auth'] = localStorage.getItem(appConstants.LS_TOKEN);

const dispatchError = (dispatch, type, error) => {
  dispatch({
    type: type,
    payload: error.response ? error.response.data : error,
    status: error.response ? error.response.status : error.status
  });
}

export const login = reqPayload => dispatch =>
  axios.post(`${apiUrl}/login`, reqPayload).then(res => {
    dispatch({ type: types.LOGIN_SUCCESS, payload: res.data });
    axios.defaults.headers.common['testd-jwt-auth'] = localStorage.getItem(appConstants.LS_TOKEN);
    return { success: true, promptWelcome: res.data.promptWelcome };
  }).catch(error => {
    dispatchError(dispatch, types.API_ERROR, error);
    return { success: false };
  });

export const logout = () => dispatch => {
  delete axios.defaults.headers.common['testd-jwt-auth'];
  dispatch({ type: types.LOGOUT_SUCCESS });
  dispatch({ type: types.CLEAR_ALL_DATA });
}

// export const getAccounts = () => (dispatch, getState) => {
//   setToken(getState);
//   dispatch({ type: types.API_START_LOADING });
//   axios.get(`${apiUrl}/account`).then(res => {
//     dispatch({ type: types.API_STOP_LOADING });
//     if (res.data.success) {
//       dispatch({ type: types.GET_ACCOUNTS, payload: res.data });
//     } else {
//       dispatch({ type: types.SHOW_DIALOG, payload: res.data, status: res.status });
//     }
//   }).catch(error => {
//     dispatch({ type: types.API_STOP_LOADING });
//     dispatchError(dispatch, types.SHOW_DIALOG, error);
//   });
// }

export const addCredential = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/add-credentials`, reqPayload);
}

export const getAddPassword = (id) => dispatch =>
  axios.get(`${apiUrl}/add-password/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const addPassword = (id, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/add-password/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const uploadCsv = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/upload-csv`, reqPayload);
}

export const uploadPhoto = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/upload-image`, reqPayload);
}

export const uploadImage = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/upload-image`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getAccounts = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/account${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const searchAccounts = (reqPayload, queryParams) => dispatch =>
  axios.post(`${apiUrl}/account/search${queryParams ? '?' + queryParams : ''}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateAccount = (id, reqPayload) => {
  setToken();
  return axios.put(`${apiUrl}/account/${id}`, reqPayload);
}

export const createAccount = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/account`, reqPayload);
}

export const getAccount = (id) => {
  setToken();
  return axios.get(`${apiUrl}/account/${id}`);
}

export const getSessionsByAccountId = (account_id, queryParams) => dispatch =>
  axios.get(`${apiUrl}/sessions/${account_id}${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getNotificationSettingsByAccountId = (account_id) => dispatch =>
  axios.get(`${apiUrl}/notification-settings/${account_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const upsertNotificationSettingsByAccountId = (account_id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/notification-settings/${account_id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getUsers = (queryParams) => {
  setToken();
  return axios.get(`${apiUrl}/user${queryParams ? '?' + queryParams : ''}`);
}

export const getUsers1 = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/user${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const searchUsers = (reqPayload, queryParams) => dispatch =>
  axios.post(`${apiUrl}/user/search${queryParams ? '?' + queryParams : ''}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const createUser = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/user`, reqPayload);
}

export const getUser = (id) => {
  // setToken();
  return axios.get(`${apiUrl}/user/${id}`);
}

export const updateUser = (id, reqPayload) => {
  setToken();
  return axios.put(`${apiUrl}/user/${id}`, reqPayload);
}

export const updateUser2 = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/user/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const deleteUser = (id) => dispatch =>
  axios.delete(`${apiUrl}/user/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const restoreUser = (reqPayload) => dispatch =>
  axios.put(`${apiUrl}/user/restore`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const deleteForeverUser = (id) => dispatch =>
  axios.delete(`${apiUrl}/user/delete-forever/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getUserActivityHistory = (user_id) => dispatch =>
  axios.get(`${apiUrl}/user/activity-history/${user_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const addClientName = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/add-client-name`, reqPayload);
}

export const getMyClient = () => {
  setToken();
  return axios.get(`${apiUrl}/client/my`);
}

export const getSystemSettings = () => dispatch =>
  axios.get(`${apiUrl}/client/system-settings`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateSystemSettings = (reqPayload) => dispatch =>
  axios.put(`${apiUrl}/client/system-settings`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getFormSettings = () => dispatch =>
  axios.get(`${apiUrl}/client/form-settings`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateFormSettings = (reqPayload) => dispatch =>
  axios.put(`${apiUrl}/client/form-settings`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getUserFormSettings = (user_id) => dispatch =>
  axios.get(`${apiUrl}/user/form-settings/${user_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getRoles = () => {
  setToken();
  return axios.get(`${apiUrl}/role`);
}

export const addRole = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/role`, reqPayload);
}

export const getRole = (id) => {
  setToken();
  return axios.get(`${apiUrl}/role/${id}`);
}

export const updateRole = (id, reqPayload) => {
  setToken();
  return axios.put(`${apiUrl}/role/${id}`, reqPayload);
}

export const deleteRole = (id) => {
  setToken();
  return axios.delete(`${apiUrl}/role/${id}`);
}

export const addLocation = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/location`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getLocations = () => {
  setToken();
  return axios.get(`${apiUrl}/location`);
}

export const getLocation = (id) => dispatch =>
  axios.get(`${apiUrl}/location/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getLocations1 = () => dispatch =>
  axios.get(`${apiUrl}/location`).then(res => {
    dispatch({ type: types.FETCH_LOCATIONS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateLocation = (id, reqPayload) => {
  setToken();
  return axios.put(`${apiUrl}/location/${id}`, reqPayload);
}

export const updateLocation1 = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/location/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const addLocationSignature = (id, token, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/location/${id}/add-signature`, reqPayload, {
    headers: {
      'testd-jwt-common': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getLocationSignature = (id, token) => dispatch =>
  axios.get(`${apiUrl}/location/${id}/add-signature`, {
    headers: {
      'testd-jwt-common': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const uploadLocationSignature = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/upload-common-image`, reqPayload, {
    headers: {
      'testd-jwt-common': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const addPopulationSetting = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/population-settings`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getPopulationSetting = (id) => dispatch =>
  axios.get(`${apiUrl}/population-settings/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getAllPopulationSetting = () => dispatch =>
  axios.get(`${apiUrl}/population-settings`).then(res => {
    dispatch({ type: types.FETCH_POPULATION_SETTINGS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getPopulationSettingsByLocationId = (location_id) => dispatch =>
  axios.get(`${apiUrl}/population-settings/location/${location_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updatePopulationSettings = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/population-settings/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const deletePopulationSettings = (id) => dispatch =>
  axios.delete(`${apiUrl}/population-settings/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const addDepartment = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/department`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDepartment = (id) => dispatch =>
  axios.get(`${apiUrl}/department/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDepartments = () => dispatch =>
  axios.get(`${apiUrl}/department`).then(res => {
    dispatch({ type: types.FETCH_DEPARTMENTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateDepartment = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/department/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const deleteDepartment = (id) => dispatch =>
  axios.delete(`${apiUrl}/department/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// Inventory
export const addInventory = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/inventory`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getAllInventory = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/inventory${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getInventoryCounts = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/inventory/counts${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getInventory = (id) => dispatch =>
  axios.get(`${apiUrl}/inventory/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateInventory = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/inventory/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const deleteInventory = (id) => dispatch =>
  axios.delete(`${apiUrl}/inventory/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getInventoryManufacturer = (id) => dispatch =>
  axios.get(`${apiUrl}/inventory/manufacturer`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getInventoryAvailable = (id) => dispatch =>
  axios.get(`${apiUrl}/inventory/available`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const searchInventory = (reqPayload, queryParams) => dispatch =>
  axios.post(`${apiUrl}/inventory/search${queryParams ? '?' + queryParams : ''}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getInventoryCountsByLocation = (location_id) => dispatch =>
  axios.get(`${apiUrl}/inventory/location/${location_id}/count`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const addSchedule = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/schedule`, reqPayload);
}

export const getSchedules = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/schedule${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getScheduleCounts = (queryParams) => {
  setToken();
  return axios.get(`${apiUrl}/schedule/counts${queryParams ? '?' + queryParams : ''}`);
}

export const getScheduleMonth = (queryParams) => {
  setToken();
  return axios.get(`${apiUrl}/schedule/month${queryParams ? '?' + queryParams : ''}`);
}

export const getScheduleWeek = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/schedule/week${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const scheduleAction = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/schedule/action`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getScheduleTests = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/schedule/tests${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getScheduleSearch = (queryParams, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/schedule/search${queryParams ? '?' + queryParams : ''}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTestings = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/testing${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const searchTestings = (reqPayload, queryParams) => dispatch =>
  axios.post(`${apiUrl}/testing/search${queryParams ? '?' + queryParams : ''}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTestingsCount = () => dispatch =>
  axios.get(`${apiUrl}/testing/count`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateTestingResult = (reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/testing/result`, reqPayload);
}

export const getUserTesting = (user_id) => dispatch =>
  axios.get(`${apiUrl}/testing/user/${user_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateUserTesting = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/testing/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const generateTestKit = (id) => dispatch =>
  axios.get(`${apiUrl}/testing/generate-testkit/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTestingResultsSummary = (id) => dispatch =>
  axios.get(`${apiUrl}/testing/results-summary/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateTestingPostResulted = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/testing/modify-testing-post-resulted/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const deleteTesting = (id) => dispatch =>
  axios.delete(`${apiUrl}/testing/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// Orders
export const getOrders = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/order${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getOrdersCounts = () => dispatch =>
  axios.get(`${apiUrl}/order/counts`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getOrder = (id) => dispatch =>
  axios.get(`${apiUrl}/order/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const searchOrders = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/order/search`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const submitOrder = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/order/submit`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// Audits
export const getAudits = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/audit${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const searchAudits = (reqPayload, queryParams) => dispatch =>
  axios.post(`${apiUrl}/audit/search${queryParams ? '?' + queryParams : ''}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getAuditById = (id) => dispatch =>
  axios.get(`${apiUrl}/audit/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getPatient = (user_id) => dispatch =>
  axios.get(`${apiUrl}/patient/${user_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const upsertPatient = (user_id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/patient/${user_id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDashboardCounts = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/dashboard/counts${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_DASHBOARD_COUNTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDashboardAgeRisk = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/dashboard/age-risk${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_DASHBOARD_AGE_RISK, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDashboardSymptomTracker = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/dashboard/symptom-tracker${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_DASHBOARD_SYMPTOM_TRACKER, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDashboardLocationRisk = () => dispatch =>
  axios.get(`${apiUrl}/dashboard/location-risk`).then(res => {
    dispatch({ type: types.FETCH_DASHBOARD_LOCATION_RISK, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingComplianceCounts = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/compliance/counts${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_COMPLIANCE_COUNTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingComplianceTests = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/compliance/tests${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_COMPLIANCE_TESTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingComplianceLinear = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/compliance/linear${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_COMPLIANCE_LINEAR, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingComplianceList = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/compliance/list${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_COMPLIANCE_LIST, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingUserLinear = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/user/linear${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_USER_LINEAR, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingUserList = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/user/list${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_USER_LIST, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingSiteCounts = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/site/counts${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_SITE_COUNTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingSiteTests = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/site/tests${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_SITE_TESTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingSiteLinear = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/site/linear${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_SITE_LINEAR, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingLabCounts = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/lab/counts${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_LAB_COUNTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingLabTests = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/lab/tests${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_LAB_TESTS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingLabLinear = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/lab/linear${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_LAB_LINEAR, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingLabList = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/lab/list${queryParams ? '?' + queryParams : ''}`).then(res => {
    dispatch({ type: types.FETCH_REPORTING_LAB_LIST, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getReportingCustom = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/reporting/custom${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getUserAllTesting = (user_id) => dispatch =>
  axios.get(`${apiUrl}/user/all-testings/${user_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getUserDependents = (user_id) => dispatch =>
  axios.get(`${apiUrl}/user/dependents/${user_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDependentTestings = (dependent_id) => dispatch =>
  axios.get(`${apiUrl}/dependent/testings/${dependent_id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getDependent = (id) => dispatch =>
  axios.get(`${apiUrl}/dependent/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateDependent = (id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/dependent/${id}`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getMyNotifications = () => dispatch =>
  axios.get(`${apiUrl}/account/my-notifications`).then(res => {
    dispatch({ type: types.FETCH_NOTIFICATIONS, payload: res.data });
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTopNotifications = () => dispatch =>
  axios.get(`${apiUrl}/top-notification`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const markAsReadNotification = (id) => dispatch =>
  axios.put(`${apiUrl}/notification-markread/${id}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getNotifications = (queryParams) => dispatch =>
  axios.get(`${apiUrl}/notification${queryParams ? '?' + queryParams : ''}`).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const resendFailedFromNotification = (reqPayload) => dispatch =>
  axios.post(`${apiUrl}/notification/resend-failed`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// Rapid Pass API's
export const getScheduleRapidPass = (token, id) => dispatch =>
  axios.get(`${apiUrl}/schedule/rapid-pass/${id}`, {
    headers: {
      'testd-jwt-schedule': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// Results PDF
export const getScheduleResultsPdf = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/schedule/results-pdf`, reqPayload, {
    headers: {
      'testd-jwt-schedule': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// Testd AC API's
export const validateLocationDepartment = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/validate-loc-dep`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const findTestdAcUser = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/find-user`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const fetchEndpointDetails = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/fetch-endpoint-details`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const resendOtp = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/resend-otp`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const verifyCheckOtp = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/verify-check-otp`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTestdAcUser = (token, id) => dispatch =>
  axios.get(`${apiUrl}/testd-ac/user/${id}`, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateTestdAcUser = (token, id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/testd-ac/user/${id}`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const createTestdAcUser = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/user`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const createTestdAcDependent = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/dependent`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTestdAcDependent = (token, id) => dispatch =>
  axios.get(`${apiUrl}/testd-ac/dependent/${id}`, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateTestdAcDependent = (token, id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/testd-ac/dependent/${id}`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getTestdAcPatient = (token, user_id) => dispatch =>
  axios.get(`${apiUrl}/testd-ac/patient/${user_id}`, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const updateTestdAcPatient = (token, user_id, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/testd-ac/patient/${user_id}`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const uploadTestdAcImage = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/testd-ac/upload-image`, reqPayload, {
    headers: {
      'testd-jwt-ac': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

// forgot password
export const forgotPassword = reqPayload => dispatch =>
  axios.post(`${apiUrl}/account/forgot-password`, reqPayload).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.API_ERROR, error);
    return { success: false };
  });

export const updatePassword = (token, reqPayload) => dispatch =>
  axios.put(`${apiUrl}/account/forgot-password`, reqPayload, {
    headers: {
      'testd-jwt-common': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const uploadFile = (url, reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/upload-${url}`, reqPayload
  );
}

export const resendTestingResultsSummary = (id, reqPayload) => {
  setToken();
  return axios.post(`${apiUrl}/testing/resend-results-summary/${id}`, reqPayload);
}

//schedule
export const getScheduleAvailableDates = (id, token, type) => dispatch =>
  axios.get(`${apiUrl}/schedule/available-dates/${id}/${type}`, {
    headers: {
      'testd-jwt-schedule': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const getScheduleAvailableTimeByDate = (id, date, type, token) => dispatch =>
  axios.get(`${apiUrl}/schedule/available-timeslots/${id}/${date}/${type}`, {
    headers: {
      'testd-jwt-schedule': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });

export const confirmSchedule = (token, reqPayload) => dispatch =>
  axios.post(`${apiUrl}/schedule/confirm`, reqPayload, {
    headers: {
      'testd-jwt-schedule': token
    }
  }).then(res => {
    return res.data;
  }).catch(error => {
    dispatchError(dispatch, types.SHOW_ALERT_DIALOG, error);
    return { success: false };
  });
