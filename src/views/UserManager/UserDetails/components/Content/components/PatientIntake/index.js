import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
// import { AppBar, Tabs, Tab } from '@material-ui/core';
import { AppBar, Tabs, Tab, Button, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import DemoGraphics from './DemoGraphics';
import ProviderInformation from './ProviderInformation';
import MedicalHistoryPage1 from './MedicalHistory/MedicalHistoryPage1';
import MedicalHistoryPage2 from './MedicalHistory/MedicalHistoryPage2';
import SupportService from './SupportService';
import EmploymentVerification from './EmploymentVerification';
import { getPatient, upsertPatient, getUserFormSettings } from 'actions/api';
import TermPrivacy from './TermPrivacy';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: '#043B5D',
  },
  tabsIndicator: {
    backgroundColor: '#043B5D',
  },
  wrapper: {
    '& .MuiTouchRipple-root': {
      borderRight: 'solid #fff 1px',
      height: '60%',
      marginTop: 10,

    },
    '&:last-child .MuiTouchRipple-root': {
      borderRight: 'solid #fff 0px',
      height: '60%',
      marginTop: 10,
    },
    '&.Mui-selected .MuiTab-wrapper': {
      borderBottom: 'solid white 2px'
    }
  }
}));

const FormSettingsInit = {
  demographic_patient_info_required: true,
  demographic_patient_info_mandatory: true,
  provider_info_providers_required: true,
  provider_info_providers_mandatory: true,
  provider_info_pharmacy_required: true,
  provider_info_pharmacy_mandatory: true,
  provider_info_insurance_required: true,
  provider_info_insurance_mandatory: true,
  medical_history_covid_19_screening_required: true,
  medical_history_covid_19_screening_mandatory: true,
  medical_history_current_health_required: true,
  medical_history_current_health_mandatory: true,
  medical_history_personal_medical_history_required: true,
  medical_history_personal_medical_history_mandatory: true,
  medical_history_family_medical_history_required: true,
  medical_history_family_medical_history_mandatory: true,
  medical_history_surgical_procedure_required: true,
  medical_history_surgical_procedure_mandatory: true,
  medical_history_medications_required: true,
  medical_history_medications_mandatory: true,
  support_service_support_services_required: true,
  support_service_support_services_mandatory: true,
  support_service_support_questions_required: true,
  support_service_support_questions_mandatory: true,
  employment_verification_required: true,
  employment_verification_mandatory: true,
  privacy_practices_hipaa_notice_of_privacy_required: true,
  privacy_practices_hipaa_notice_of_privacy_mandatory: true,
  privacy_practices_consent_for_services_required: true,
  privacy_practices_consent_for_services_mandatory: true,
  privacy_practices_financial_responsibilities_required: true,
  privacy_practices_financial_responsibilities_mandatory: true,
  privacy_practices_patient_rules_responsibilities_required: true,
  privacy_practices_patient_rules_responsibilities_mandatory: true,
  privacy_practices_health_info_release_auth_required: true,
  privacy_practices_health_info_release_auth_mandatory: true,
  privacy_practices_receipt_of_documents_required: true,
  privacy_practices_receipt_of_documents_mandatory: true,
  privacy_practices_result_delivery_required: true,
  privacy_practices_result_delivery_mandatory: true,
};

const PatientIntake = (props) => {
  const { getPatient, upsertPatient, getUserFormSettings, user, setUser, history } = props;
  const classes = useStyles();

  const [tab, setTab] = useState(0);
  const [medicalStep, setMedicalStep] = useState(1);
  const [termPrivacyStep, setTermPrivacyStep] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [completedTab, setCompletedTab] = useState(0);

  const [formSettings, setFormSettings] = useState(null);
  const [showTabs, setShowTabs] = useState({});
  const [medicalPages, setMedicalPages] = useState('both');
  const [tpcPages, setTpcPages] = useState([]);

  const userId = props.match.params.id;

  useEffect(() => {
    console.log('PatientIntake useEffect id:', userId);
    if (userId) {
      async function fetchData() {
        const fsRes = await getUserFormSettings(userId);
        if (fsRes.success) {
          if (fsRes.data)
            setFormSettings(fsRes.data);
          else
            setFormSettings({ ...FormSettingsInit });
        }
        const pRes = await getPatient(userId);
        if (pRes.success) {
          setPatient(pRes.data || {});
        }
      }
      fetchData();
    } else {
      history.goBack();
    }
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (formSettings && patient && !Object.keys(showTabs).length) {
      let completedShowTab = {};
      if (formSettings.demographic_patient_info_required) {
        setShowTabs(showTabs => ({ ...showTabs, demographics: true }));
        completedShowTab['demographics'] = true;
      }
      if (formSettings.provider_info_providers_required || formSettings.provider_info_pharmacy_required || formSettings.provider_info_insurance_required) {
        setShowTabs(showTabs => ({ ...showTabs, providerInfo: true }));
        completedShowTab['providerInfo'] = true;
      }
      if (formSettings.medical_history_covid_19_screening_required || formSettings.medical_history_current_health_required || formSettings.medical_history_personal_medical_history_required || formSettings.medical_history_family_medical_history_required || formSettings.medical_history_surgical_procedure_required || formSettings.medical_history_medications_required) {
        setShowTabs(showTabs => ({ ...showTabs, medicalHistory: true }));
        completedShowTab['medicalHistory'] = true;
        let mp = 'both';
        if (!formSettings.medical_history_covid_19_screening_required && !formSettings.medical_history_current_health_required && !formSettings.medical_history_personal_medical_history_required)
          mp = 'second';
        if (!formSettings.medical_history_family_medical_history_required && !formSettings.medical_history_surgical_procedure_required && !formSettings.medical_history_medications_required)
          mp = 'first';
        setMedicalPages(mp);
      }
      if (formSettings.support_service_support_services_required || formSettings.support_service_support_questions_required) {
        setShowTabs(showTabs => ({ ...showTabs, supportService: true }));
        completedShowTab['supportService'] = true;
      }
      if (formSettings.employment_verification_required) {
        setShowTabs(showTabs => ({ ...showTabs, employmentVerification: true }));
        completedShowTab['employmentVerification'] = true;
      }
      if (formSettings.privacy_practices_hipaa_notice_of_privacy_required || formSettings.privacy_practices_consent_for_services_required || formSettings.privacy_practices_financial_responsibilities_required || formSettings.privacy_practices_patient_rules_responsibilities_required || formSettings.privacy_practices_health_info_release_auth_required || formSettings.privacy_practices_receipt_of_documents_required || formSettings.privacy_practices_result_delivery_required) {
        setShowTabs(showTabs => ({ ...showTabs, termPrivacyConsent: true }));
        completedShowTab['termPrivacyConsent'] = true;
        let tpcArray = [];
        if (formSettings.privacy_practices_financial_responsibilities_required) {
          tpcArray.push('financialPage');
          setTermPrivacyStep(4);
        }
        if (formSettings.privacy_practices_health_info_release_auth_required || formSettings.privacy_practices_receipt_of_documents_required || formSettings.privacy_practices_result_delivery_required) {
          tpcArray.push('authReceiptDeliveryPage');
          setTermPrivacyStep(3);
        }
        if (formSettings.privacy_practices_hipaa_notice_of_privacy_required || formSettings.privacy_practices_consent_for_services_required) {
          tpcArray.push('hipaaConsentPage');
          setTermPrivacyStep(2);
        }
        if (formSettings.privacy_practices_patient_rules_responsibilities_required) {
          tpcArray.push('patientRulesPage');
          setTermPrivacyStep(1);
        }
        setTpcPages(tpcArray);
      }
      // stop loading
      setFetchLoading(false);
      // TODO: not perfect
      let ct = 1;
      Object.keys(completedShowTab).reverse().forEach((tab) => {
        if (tab === 'providerInfo' && patient.providers && patient.pharmacy && patient.insurance)
          ct = ct + 1;
        if (tab === 'medicalHistory' && patient.covid_19_screening && patient.other_screening && patient.personal_medical_history && patient.family_medical_history && patient.surgical_procedure && patient.medications)
          ct = ct + 1;
        if (tab === 'supportService' && patient.support_services && patient.support_questions)
          ct = ct + 1;
        if (tab === 'employmentVerification' && patient.employment_verification)
          ct = ct + 1;
        if (tab === 'termPrivacyConsent' && patient.health_info_release_auth && patient.result_delivery && patient.financial_responsibilities)
          ct = ct + 1;
      });
      setCompletedTab(ct);
    }
    // eslint-disable-next-line
  }, [formSettings, patient]);

  const goBack = () => {
    history.goBack();
  }

  const nextTab = () => {
    let tabObjs = Object.keys(showTabs);
    if (tabObjs.length === (tab + 1) && termPrivacyStep === 4) {
      history.push(`/user-details/${userId}?tab=testing`);
    } else if (tabObjs.length === (tab + 1) && !showTabs.termPrivacyConsent) {
      history.push(`/user-details/${userId}?tab=testing`);
    } else if (tabObjs[tab] === 'termPrivacyConsent') {
      switch (termPrivacyStep) {
        case 1:
          if (tpcPages.includes('hipaaConsentPage'))
            setTermPrivacyStep(2);
          else if (tpcPages.includes('authReceiptDeliveryPage'))
            setTermPrivacyStep(3);
          else if (tpcPages.includes('financialPage'))
            setTermPrivacyStep(4);
          else
            history.push(`/user-details/${userId}?tab=testing`);
          break;
        case 2:
          if (tpcPages.includes('authReceiptDeliveryPage'))
            setTermPrivacyStep(3);
          else if (tpcPages.includes('financialPage'))
            setTermPrivacyStep(4);
          else
            history.push(`/user-details/${userId}?tab=testing`);
          break;
        case 3:
          if (tpcPages.includes('financialPage'))
            setTermPrivacyStep(4);
          else
            history.push(`/user-details/${userId}?tab=testing`);
          break;

        default:
          setTermPrivacyStep(termPrivacyStep => termPrivacyStep + 1);
          break;
      }
    } else if (tabObjs[tab] === 'medicalHistory' && medicalStep === 1 && medicalPages === 'both') {
      setMedicalStep(medicalStep => medicalStep + 1);
    } else {
      setTab(tab => tab + 1);
      setCompletedTab(completedTab => completedTab + 1);
    }
    // if (tab === 5 && termPrivacyStep === 4) {
    //   history.push(`/user-details/${userId}?tab=testing`);
    // } else if (tab === 5) {
    //   setTermPrivacyStep(termPrivacyStep => termPrivacyStep + 1);
    // } else if (tab === 2 && medicalStep === 1) {
    //   setMedicalStep(medicalStep => medicalStep + 1);
    // } else {
    //   setTab(tab => tab + 1);
    //   setCompletedTab(completedTab => completedTab + 1);
    // }
  };

  const backTab = () => {
    let tabObjs = Object.keys(showTabs);
    if (tabObjs[tab] === 'termPrivacyConsent' && termPrivacyStep !== 1) {
      switch (termPrivacyStep) {
        case 4:
          if (tpcPages.includes('authReceiptDeliveryPage'))
            setTermPrivacyStep(3);
          else if (tpcPages.includes('hipaaConsentPage'))
            setTermPrivacyStep(2);
          else if (tpcPages.includes('patientRulesPage'))
            setTermPrivacyStep(1);
          else
            setTab(tab => tab - 1);
          break;
        case 3:
          if (tpcPages.includes('hipaaConsentPage'))
            setTermPrivacyStep(2);
          else if (tpcPages.includes('patientRulesPage'))
            setTermPrivacyStep(1);
          else
            setTab(tab => tab - 1);
          break;
        case 2:
          if (tpcPages.includes('patientRulesPage'))
            setTermPrivacyStep(1);
          else
            setTab(tab => tab - 1);
          break;

        default:
          setTermPrivacyStep(termPrivacyStep => termPrivacyStep - 1);
          break;
      }
    } else if (tabObjs[tab] === 'medicalHistory' && medicalStep !== 1 && medicalPages === 'both') {
      setMedicalStep(medicalStep => medicalStep - 1);
    } else {
      if (tab !== 0)
        setTab(tab => tab - 1);
    }

    // if (tab === 1 && termPrivacyStep !== 1) {
    //   setTermPrivacyStep(termPrivacyStep => termPrivacyStep - 1);
    // } else if (tab === 2 && medicalStep !== 1) {
    //   setMedicalStep(medicalStep => medicalStep - 1);
    // } else {
    //   setTab(tab => tab - 1);
    // }
  }

  const handleChange = (event, newValue) => {
    if (newValue <= completedTab) {
      setTab(newValue);
    }
  }

  const updatePatient = async (body) => {
    setSaveLoading(true);
    const res = await upsertPatient(userId, body);
    setSaveLoading(false);
    if (res.success) {
      setPatient(patient => ({
        ...patient,
        ...body
      }));
      nextTab();
    }
  }

  const GetShowTab = (props) => {
    if (props.showTab === 'demographics') {
      return (
        <DemoGraphics
          nextTab={nextTab}
          user={user}
          setUser={setUser}
          isMandatory={formSettings.demographic_patient_info_mandatory}
        />
      )
    }
    if (props.showTab === 'providerInfo') {
      return (
        <ProviderInformation
          nextTab={nextTab}
          saveLoading={saveLoading}
          updatePatient={updatePatient}
          patient={patient}
          backTab={backTab}
          isProviderRequired={formSettings.provider_info_providers_required}
          isPharmacyRequired={formSettings.provider_info_pharmacy_required}
          isInsuranceRequired={formSettings.provider_info_insurance_required}
          isProviderMandatory={formSettings.provider_info_providers_mandatory}
          isPharmacyMandatory={formSettings.provider_info_pharmacy_mandatory}
          isInsuranceMandatory={formSettings.provider_info_insurance_mandatory}
        />
      )
    }
    if (props.showTab === 'medicalHistory') {
      if (medicalPages === 'first') {
        return (
          <MedicalHistoryPage1
            nextTab={nextTab}
            saveLoading={saveLoading}
            updatePatient={updatePatient}
            patient={patient}
            backTab={backTab}
            isCovidScreeningRequired={formSettings.medical_history_covid_19_screening_required}
            isCurrentHealthRequired={formSettings.medical_history_current_health_required}
            isMedicalHistoryRequired={formSettings.medical_history_personal_medical_history_required}
            isCovidScreeningMandatory={formSettings.medical_history_covid_19_screening_mandatory}
            isCurrentHealthMandatory={formSettings.medical_history_current_health_mandatory}
            isMedicalHistoryMandatory={formSettings.medical_history_personal_medical_history_mandatory}
          />
        )
      } else if (medicalPages === 'second') {
        return (
          <MedicalHistoryPage2
            nextTab={nextTab}
            saveLoading={saveLoading}
            updatePatient={updatePatient}
            patient={patient}
            backTab={backTab}
            isFamilyMedicalHistoryRequired={formSettings.medical_history_family_medical_history_required}
            isSurgicalProcedureRequired={formSettings.medical_history_surgical_procedure_required}
            isMedicationsRequired={formSettings.medical_history_medications_required}
            isFamilyMedicalHistoryMandatory={formSettings.medical_history_family_medical_history_mandatory}
            isSurgicalProcedureMandatory={formSettings.medical_history_surgical_procedure_mandatory}
            isMedicationsMandatory={formSettings.medical_history_medications_mandatory}
          />
        )
      } else {
        return (
          <>
            {medicalStep === 1 && (
              <MedicalHistoryPage1
                nextTab={nextTab}
                saveLoading={saveLoading}
                updatePatient={updatePatient}
                patient={patient}
                backTab={backTab}
                isCovidScreeningRequired={formSettings.medical_history_covid_19_screening_required}
                isCurrentHealthRequired={formSettings.medical_history_current_health_required}
                isMedicalHistoryRequired={formSettings.medical_history_personal_medical_history_required}
                isCovidScreeningMandatory={formSettings.medical_history_covid_19_screening_mandatory}
                isCurrentHealthMandatory={formSettings.medical_history_current_health_mandatory}
                isMedicalHistoryMandatory={formSettings.medical_history_personal_medical_history_mandatory}
              />
            )}
            {medicalStep === 2 && (
              <MedicalHistoryPage2
                nextTab={nextTab}
                saveLoading={saveLoading}
                updatePatient={updatePatient}
                patient={patient}
                backTab={backTab}
                isFamilyMedicalHistoryRequired={formSettings.medical_history_family_medical_history_required}
                isSurgicalProcedureRequired={formSettings.medical_history_surgical_procedure_required}
                isMedicationsRequired={formSettings.medical_history_medications_required}
                isFamilyMedicalHistoryMandatory={formSettings.medical_history_family_medical_history_mandatory}
                isSurgicalProcedureMandatory={formSettings.medical_history_surgical_procedure_mandatory}
                isMedicationsMandatory={formSettings.medical_history_medications_mandatory}
              />
            )}
          </>
        )
      }
    }
    if (props.showTab === 'supportService') {
      return (
        <SupportService
          nextTab={nextTab}
          saveLoading={saveLoading}
          updatePatient={updatePatient}
          patient={patient}
          backTab={backTab}
          isSupportServiceRequired={formSettings.support_service_support_services_required}
          isSupportQuesionsRequired={formSettings.support_service_support_questions_required}
          isSupportServiceMandatory={formSettings.support_service_support_services_mandatory}
          isSupportQuesionsMandatory={formSettings.support_service_support_questions_mandatory}
        />
      )
    }
    if (props.showTab === 'employmentVerification') {
      return (
        <EmploymentVerification
          nextTab={nextTab}
          saveLoading={saveLoading}
          updatePatient={updatePatient}
          patient={patient}
          user={user}
          backTab={backTab}
          isEmploymentRequired={formSettings.employment_verification_required}
          isEmploymentMandatory={formSettings.employment_verification_mandatory}
        />
      )
    }
    if (props.showTab === 'termPrivacyConsent') {
      return (
        <TermPrivacy
          nextTab={nextTab}
          saveLoading={saveLoading}
          updatePatient={updatePatient}
          patient={patient}
          user={user}
          termPrivacyStep={termPrivacyStep}
          setTermPrivacyStep={setTermPrivacyStep}
          backTab={backTab}
          tpcPages={tpcPages}
          isHipaaRequired={formSettings.privacy_practices_hipaa_notice_of_privacy_required}
          isConsentRequired={formSettings.privacy_practices_consent_for_services_required}
          isFinancialRequired={formSettings.privacy_practices_financial_responsibilities_required}
          isPatientRulesRequired={formSettings.privacy_practices_patient_rules_responsibilities_required}
          isAuthHealthRequired={formSettings.privacy_practices_health_info_release_auth_required}
          isReceiptRequired={formSettings.privacy_practices_receipt_of_documents_required}
          isResultDeliveryRequired={formSettings.privacy_practices_result_delivery_required}
          isHipaaMandatory={formSettings.privacy_practices_hipaa_notice_of_privacy_mandatory}
          isConsentMandatory={formSettings.privacy_practices_consent_for_services_mandatory}
          isFinancialMandatory={formSettings.privacy_practices_financial_responsibilities_mandatory}
          isPatientRulesMandatory={formSettings.privacy_practices_patient_rules_responsibilities_mandatory}
          isAuthHealthMandatory={formSettings.privacy_practices_health_info_release_auth_mandatory}
          isReceiptMandatory={formSettings.privacy_practices_receipt_of_documents_mandatory}
          isResultDeliveryMandatory={formSettings.privacy_practices_result_delivery_mandatory}
        />
      )
    }
  }

  return (
    <div>
      {fetchLoading
        ? <CircularProgress />
        : patient
          ?
          <>
            <AppBar
              position="static"
              className={classes.appBar}
            >
              <Tabs
                value={tab}
                onChange={handleChange}
                classes={{ indicator: classes.tabsIndicator }}
                variant="scrollable"
                scrollButtons="auto"
              >
                {showTabs.demographics && <Tab label="DEMOGRAPHICS" classes={{ root: classes.wrapper }} />}
                {showTabs.providerInfo && <Tab label="PROVIDER INFORMATION" classes={{ root: classes.wrapper }} />}
                {showTabs.medicalHistory && <Tab label="MEDICAL HISTORY" classes={{ root: classes.wrapper }} />}
                {showTabs.supportService && <Tab label="SUPPORT SERVICES" classes={{ root: classes.wrapper }} />}
                {showTabs.employmentVerification && <Tab label="EMPLOYMENT VERIFICATION" classes={{ root: classes.wrapper }} />}
                {showTabs.termPrivacyConsent && <Tab label="TERMS/PRIVACY/CONSENT" classes={{ root: classes.wrapper }} />}
              </Tabs>
            </AppBar>
            {Object.keys(showTabs).map((st, i) => (
              <TabPanel key={st} value={tab} index={i}>
                <GetShowTab
                  showTab={st}
                />
              </TabPanel>
            ))}
            {/* <TabPanel value={tab} index={0}>
              <DemoGraphics
                nextTab={nextTab}
                user={user}
                setUser={setUser}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <ProviderInformation
                nextTab={nextTab}
                saveLoading={saveLoading}
                updatePatient={updatePatient}
                patient={patient}
                backTab={backTab}
              />
            </TabPanel>
            {/* <TabPanel value={tab} index={2}>
              {medicalStep === 1 && (
                <MedicalHistoryPage1
                  nextTab={nextTab}
                  saveLoading={saveLoading}
                  updatePatient={updatePatient}
                  patient={patient}
                  backTab={backTab}
                />
              )}
              {medicalStep === 2 && (
                <MedicalHistoryPage2
                  nextTab={nextTab}
                  saveLoading={saveLoading}
                  updatePatient={updatePatient}
                  patient={patient}
                  backTab={backTab}
                />
              )}
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <SupportService
                nextTab={nextTab}
                saveLoading={saveLoading}
                updatePatient={updatePatient}
                patient={patient}
                backTab={backTab}
              />
            </TabPanel>
            <TabPanel value={tab} index={4}>
              <EmploymentVerification
                nextTab={nextTab}
                saveLoading={saveLoading}
                updatePatient={updatePatient}
                patient={patient}
                user={user}
                backTab={backTab}
              />
            </TabPanel>
            <TabPanel value={tab} index={5}>
              <TermPrivacy
                nextTab={nextTab}
                saveLoading={saveLoading}
                updatePatient={updatePatient}
                patient={patient}
                user={user}
                termPrivacyStep={termPrivacyStep}
                setTermPrivacyStep={setTermPrivacyStep}
                backTab={backTab}
              />
            </TabPanel> */}
          </>
          : <div className={classes.alert}>
            <Alert severity="error">
              {'Unknown User ID passed as params. '}
              <Button
                onClick={goBack}
              >
                {'Go Back'}
              </Button>
            </Alert>
          </div>
      }
    </div>
  );
};

PatientIntake.propTypes = {
  getPatient: PropTypes.func.isRequired,
  upsertPatient: PropTypes.func.isRequired,
  getUserFormSettings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default connect(null, { getPatient, upsertPatient, getUserFormSettings })(withRouter(PatientIntake));
