import * as types from 'constants/reduxTypeContants';

const initialState = {
  dashboardCounts: null,
  dashboardSymptomTracker: null,
  dashboardAgeRisk: null,
  dashboardLocationRisk: null,
  locations: null,
  departments: null,
  populationSettings: null,
  notifications: null,
  reportingComplianceCounts: null,
  reportingComplianceLinear: null,
  reportingComplianceTests: null,
  reportingComplianceList: null,
  reportingUserLinear: null,
  reportingUserList: null,
  reportingSiteCounts: null,
  reportingSiteLinear: null,
  reportingSiteTests: null,
  reportingLabCounts: null,
  reportingLabLinear: null,
  reportingLabTests: null,
  reportingLabList: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DASHBOARD_COUNTS:
      return {
        ...state,
        dashboardCounts: action.payload.data,
      }
    case types.FETCH_DASHBOARD_SYMPTOM_TRACKER:
      return {
        ...state,
        dashboardSymptomTracker: action.payload.data,
      }
    case types.FETCH_DASHBOARD_AGE_RISK:
      return {
        ...state,
        dashboardAgeRisk: action.payload.data,
      }
    case types.FETCH_DASHBOARD_LOCATION_RISK:
      return {
        ...state,
        dashboardLocationRisk: action.payload.data,
      }
    case types.FETCH_LOCATIONS:
      return {
        ...state,
        locations: action.payload.data,
      }
    case types.FETCH_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload.data,
      }
    case types.FETCH_POPULATION_SETTINGS:
      return {
        ...state,
        populationSettings: action.payload.data,
      }
    case types.FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.data,
      }
    // Compliance
    case types.FETCH_REPORTING_COMPLIANCE_COUNTS:
      return {
        ...state,
        reportingComplianceCounts: action.payload.data,
      }
    case types.FETCH_REPORTING_COMPLIANCE_LINEAR:
      return {
        ...state,
        reportingComplianceLinear: action.payload.data,
      }
    case types.FETCH_REPORTING_COMPLIANCE_TESTS:
      return {
        ...state,
        reportingComplianceTests: action.payload.data,
      }
    case types.FETCH_REPORTING_COMPLIANCE_LIST:
      return {
        ...state,
        reportingComplianceList: action.payload.data,
      }
    // User    
    case types.FETCH_REPORTING_USER_LINEAR:
      return {
        ...state,
        reportingUserLinear: action.payload.data,
      }
    case types.FETCH_REPORTING_USER_LIST:
      return {
        ...state,
        reportingUserList: action.payload.data,
      }
    // Site
    case types.FETCH_REPORTING_SITE_COUNTS:
      return {
        ...state,
        reportingSiteCounts: action.payload.data,
      }
    case types.FETCH_REPORTING_SITE_LINEAR:
      return {
        ...state,
        reportingSiteLinear: action.payload.data,
      }
    case types.FETCH_REPORTING_SITE_TESTS:
      return {
        ...state,
        reportingSiteTests: action.payload.data,
      }
    // Lab
    case types.FETCH_REPORTING_LAB_COUNTS:
      return {
        ...state,
        reportingLabCounts: action.payload.data,
      }
    case types.FETCH_REPORTING_LAB_LINEAR:
      return {
        ...state,
        reportingLabLinear: action.payload.data,
      }
    case types.FETCH_REPORTING_LAB_TESTS:
      return {
        ...state,
        reportingLabTests: action.payload.data,
      }
    case types.FETCH_REPORTING_LAB_LIST:
      return {
        ...state,
        reportingLabList: action.payload.data,
      }
    // clear
    case types.CLEAR_REPORTING_COMPLIANCE:
      return {
        ...state,
        reportingComplianceCounts: null,
        reportingComplianceLinear: null,
        reportingComplianceTests: null,
        reportingComplianceList: null,
      }
    case types.CLEAR_COMPLIANCE_LIST:
      return {
        ...state,
        reportingComplianceList: null,
      }
    case types.CLEAR_LOCATIONS:
      return {
        ...state,
        locations: null
      }
    case types.CLEAR_DEPARTMENTS:
      return {
        ...state,
        departments: null
      }
    case types.CLEAR_POPULATION_SETTINGS:
      return {
        ...state,
        populationSettings: null
      }
    case types.CLEAR_ALL_DATA:
      return {
        dashboardCounts: null,
        dashboardSymptomTracker: null,
        dashboardAgeRisk: null,
        dashboardLocationRisk: null,
        locations: null,
        departments: null,
        populationSettings: null,
        reportingComplianceCounts: null,
        reportingComplianceLinear: null,
        reportingComplianceTests: null,
        reportingComplianceList: null,
        reportingSiteCounts: null,
        reportingSiteLinear: null,
        reportingSiteTests: null,
        reportingLabCounts: null,
        reportingLabLinear: null,
        reportingLabTests: null,
      }
    default:
      return state;
  }
}