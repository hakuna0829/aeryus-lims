/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Clients {
  name?: string;
  partner_id: string;
  addedARG?: boolean;
  type?: string;
  form_settings?: FormSettings;
  system_settings?: SystemSettings;
}

export interface FormSettings {
  demographic_patient_info_required?: boolean;
  demographic_patient_info_mandatory?: boolean;
  provider_info_providers_required?: boolean;
  provider_info_providers_mandatory?: boolean;
  provider_info_pharmacy_required?: boolean;
  provider_info_pharmacy_mandatory?: boolean;
  provider_info_insurance_required?: boolean;
  provider_info_insurance_mandatory?: boolean;
  medical_history_covid_19_screening_required?: boolean;
  medical_history_covid_19_screening_mandatory?: boolean;
  medical_history_current_health_required?: boolean;
  medical_history_current_health_mandatory?: boolean;
  medical_history_personal_medical_history_required?: boolean;
  medical_history_personal_medical_history_mandatory?: boolean;
  medical_history_family_medical_history_required?: boolean;
  medical_history_family_medical_history_mandatory?: boolean;
  medical_history_surgical_procedure_required?: boolean;
  medical_history_surgical_procedure_mandatory?: boolean;
  medical_history_medications_required?: boolean;
  medical_history_medications_mandatory?: boolean;
  support_service_support_services_required?: boolean;
  support_service_support_services_mandatory?: boolean;
  support_service_support_questions_required?: boolean;
  support_service_support_questions_mandatory?: boolean;
  employment_verification_required?: boolean;
  employment_verification_mandatory?: boolean;
  privacy_practices_hipaa_notice_of_privacy_required?: boolean;
  privacy_practices_hipaa_notice_of_privacy_mandatory?: boolean;
  privacy_practices_consent_for_services_required?: boolean;
  privacy_practices_consent_for_services_mandatory?: boolean;
  privacy_practices_financial_responsibilities_required?: boolean;
  privacy_practices_financial_responsibilities_mandatory?: boolean;
  privacy_practices_patient_rules_responsibilities_required?: boolean;
  privacy_practices_patient_rules_responsibilities_mandatory?: boolean;
  privacy_practices_health_info_release_auth_required?: boolean;
  privacy_practices_health_info_release_auth_mandatory?: boolean;
  privacy_practices_receipt_of_documents_required?: boolean;
  privacy_practices_receipt_of_documents_mandatory?: boolean;
  privacy_practices_result_delivery_required?: boolean;
  privacy_practices_result_delivery_mandatory?: boolean;
}

export interface SystemSettings {
  rapid_pairing_mode: boolean;
}

export interface Roles {
  type: string;
  name: string;
  active: boolean;

  /** Date and time */
  last_updated: any;

  /** String or object */
  client_id: any;
  modules: RoleModule[];
}

export interface RoleModule {
  name: string;
  access: ("Read" | "Write" | "Delete")[];
}

export interface Accounts {
  username?: string;
  password?: string;
  first_name: string;
  last_name: string;
  active?: boolean;
  email: string;

  /** String or object */
  role_id: any;

  /** String or object */
  client_id: any;
  access_to_locations?: string[];

  /** Date and time */
  created_date?: any;
  phone?: string;
  title?: string;
  department?: string;
  ext?: string;
  office_phone?: string;
  location?: string;
  address?: string;
  unit?: string;
  city?: string;
  state?: string;
  photo?: string;
}

export interface Sessions {
  /** String or object */
  account_id: any;
  ip_address: string;
  user_agent: string;
  device: string;

  /** Date and time */
  login_time: any;
  status: "Online" | "Terminated" | "Session Expired" | "Logged Out";
}

export interface Users {
  password?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  active?: boolean;
  email: string;

  /** String or object */
  client_id: any;

  /** String or object */
  location_id: any;

  /** String or object */
  department_id: any;
  verification_id: string;
  created_date?: string;
  phone?: string;
  phone_verified?: boolean;
  ext?: string;
  office_phone?: string;
  address?: string;
  address2?: string;
  unit?: string;
  city?: string;
  state?: string;
  county?: string;
  photo?: string;
  zip_code?: string;
  social_digits?: string;
  dob?: string;
  gender?: string;
  ethnicity?: string;
  race?: string;
  location_sharing?: boolean;
  contact_tracing?: boolean;
  have_insurance?: boolean;
  signature?: string;
  personal_id_front?: string;
  personal_id_back?: string;
  latest_test_result?: {
    result?: "Pending" | "Negative" | "Positive" | "Inconclusive";
    date?: string;
    time?: string;
    date_time?: any;
  };
}

export interface Locations {
  /** String or object */
  client_id: any;
  name: string;
  active: boolean;
  administrator: string;
  admin_office_phone: string;
  admin_office_ext?: string;
  address: string;
  office_phone: string;
  ext?: string;
  city: string;

  /** Date and time */
  created_date?: any;
  email: string;
  state: string;
  zip_code: string;
  county: string;
  latitude?: number;
  longitude?: number;
  eoc: string;
  eoc_office_phone?: string;
  eoc_ext?: string;
  eoc_email?: string;
  phone: string;
  testing_protocol: string;
  is_healthcare_related: string;
  is_resident_congregate_setting: string;
  site_logo?: string;
  provider: LocationProvider;

  /** Slot difference should be number in minutes */
  slot_difference: number;
  operations: LocationOperations[];
}

export interface LocationOperations {
  day_name: string;
  active: boolean;
  opens24hours: boolean;

  /** Time */
  start_time: string;

  /** Time */
  end_time: string;
  stations: number;
}

export interface LocationProvider {
  first_name: string;
  last_name: string;
  phone: string;
  npi: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  signature?: string;
}

export interface Departments {
  /** String or object */
  client_id: any;

  /** String or object */
  location_id: any;
  active: boolean;
  name: string;
  head: string;
  phone: string;
  extension_number: string;
  email: string;
}

export interface Schedules {
  /** String or object */
  location_id: any;

  /** String or object */
  user_id: any;

  /** String or object */
  client_id: any;

  /** Date and time */
  date_time: any;

  /** Date format - YYYY-MM-DD */
  date: any;
  time: string;
}

export interface Testings {
  /** String or object */
  location_id: any;

  /** String or object */
  user_id: any;

  /** String or object */
  client_id: any;
  testkit_id?: string;
  test_session_id?: string;
  test_type?: string;
  paired: boolean;

  /** Date and time */
  schedule_date_time: any;

  /** Date format - YYYY-MM-DD */
  schedule_date: any;
  schedule_time: string;

  /** Date and time */
  date_time?: any;

  /** Date format - YYYY-MM-DD */
  date?: any;
  time?: string;

  /** Covid-19 result status */
  result: "Pending" | "Negative" | "Positive" | "Inconclusive";
  patient_signature?: string;
  medical_technician?: string;
  testkit_front?: string;
  testkit_back?: string;
  completed: boolean;
  protocol_email_sent: boolean;
  specimen_information?: string;

  /** Date and time */
  lab_submitted_timestamp?: any;

  /** Date and time */
  collected_timestamp?: any;

  /** Date and time */
  received_timestamp?: any;

  /** Date and time */
  reported_timestamp?: any;
  rna?: "Not Detected" | "Non Reactive" | "Inconclusive";
}

export interface Notifications {
  /** String or object */
  user_id?: any;

  /** String or object */
  account_id?: any;

  /** Date and time */
  date: any;
  title?: string;
  message: string;
  severity?: "Emergency" | "Alert" | "Critical" | "Error" | "Warning" | "Notification" | "Informational" | "Debugging";
  read: boolean;
  type?: "Test results" | "Schedule" | "Contact tracing" | "Contact tracing" | "Test expiration" | "Shipping";
}

export interface Activities {
  /** String or object */
  user_id: any;

  /** Date and time */
  date: any;
  activity: string;
}

export interface Patients {
  /** String or object */
  user_id: any;

  /** Date and time */
  created_date: any;
  height?: string;
  weight?: string;
  bp_sys?: string;
  bp_dia?: string;
  temperature?: string;
  providers?: Providers[];
  pharmacy?: Pharmacy[];
  insurance?: Insurance;
  covid_19_screening?: Question[];
  other_screening?: Question[];
  personal_medical_history?: Question[];
  family_medical_history?: Question[];
  surgical_procedure?: SurgicalProcedure[];
  medications?: Medications[];
  support_services?: Question;
  support_questions?: Question[];
  employment_verification?: EmploymentVerification;
  patient_rules_responsibilities?: SignatureAndTimestamp;
  hipaa_notice_of_privacy?: SignatureAndTimestamp;
  consent_for_services?: SignatureAndTimestamp;
  receipt_of_documents?: SignatureAndTimestamp;
  health_info_release_auth?: HealthInfoReleaseAuth;
  result_delivery?: ResultDelivery;
  financial_responsibilities?: FinancialResponsibilites;
}

export interface SignatureAndTimestamp {
  signature: string;

  /** Date and time */
  submitted_timestamp: any;
}

export interface Question {
  question: string;
  value: string;
}

export interface Providers {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  policy_number: string;
  group_number: string;
}

export interface Pharmacy {
  primary_pharmacy: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Insurance {
  name_of_insured: string;
  insureds_workplace: string;
  primary_insurance: string;
  primary_pcn: string;
  primary_id_number: string;
  primary_rx_group: string;
  primary_bin: string;
  primary_insurance_card_front: string;
  primary_insurance_card_back: string;
  secondary_insurance: string;
  secondary_pcn: string;
  secondary_id_number: string;
  secondary_rx_group: string;
  secondary_bin: string;
  secondary_insurance_card_front: string;
  secondary_insurance_card_back: string;
}

export interface SurgicalProcedure {
  procedure: string;
  year: string;
}

export interface Medications {
  medication: string;
  reason_prescribed: string;
  dosage: string;
}

export interface EmploymentVerification {
  type: string;
  explain_other?: string;
  employer_name: string;
  address: string;
  city: string;
  suite: string;
  state: string;
  zip_code: string;
  office_phone: string;
  gross_wages: string;
  frequency_of_pay: string;
}

export interface HealthInfoReleaseAuth {
  organization: string;
  phone: string;
  address: string;

  /** Date and time */
  dates_of_medical_record_requested: any;
  city: string;
  reason_for_disclosure: string;
  authorize_to_release: string;

  /** Date and time */
  submitted_timestamp?: any;
}

export interface ResultDelivery {
  receive_results: string;
  disclosure?: string;
  date: string;
  patient_signature?: string;
  guardian_signature?: string;

  /** Date and time */
  submitted_timestamp?: any;
}

export interface FinancialResponsibilites {
  last_name: string;
  first_name: string;
  signature?: string;

  /** Date and time */
  submitted_timestamp?: any;
}

export interface Sftp {
  filename: string;
  patient_name: string;
  status: "Completed" | "Unknown_Order_ID";
  order_id: string;
  result: string;
}
