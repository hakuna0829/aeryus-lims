import * as types from 'constants/reduxTypeContants';

export const clearReportingCompliance = () => dispatch => {
  dispatch({ type: types.CLEAR_REPORTING_COMPLIANCE });
}

export const clearComplianceList = () => dispatch => {
  dispatch({ type: types.CLEAR_COMPLIANCE_LIST });
}

export const clearLocations = () => dispatch => {
  dispatch({ type: types.CLEAR_LOCATIONS });
}

export const clearDepartments = () => dispatch => {
  dispatch({ type: types.CLEAR_DEPARTMENTS });
}

export const clearPopulationSettings = () => dispatch => {
  dispatch({ type: types.CLEAR_POPULATION_SETTINGS });
}

