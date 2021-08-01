import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Button,
  CircularProgress,
  // Tooltip
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckButton from 'components/CheckButton';
import brandStyles from 'theme/brand';
// import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import { getFormSettings, updateFormSettings } from 'actions/api';
import IOSSwitch from 'components/IOSSwitch';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: `${theme.spacing(2)}px 0px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  container: {
    alignItems: 'center',
    borderBottom: `solid 1px ${theme.palette.brandDark}`,
    '&:last-child': {
      borderBottom: 'solid 0px',
    }
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end'
  },
  upContent: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(3)
    },
    paddingTop: '0px'
  },
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

const FormSetting = (props) => {
  const { getFormSettings, updateFormSettings } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({ ...FormSettingsInit });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getFormSettings();
      setLoading(false);
      if (res.success && res.data) {
        setFormState(res.data);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.checked
    }));
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!didModified) return setDisplayError('No changes found');
    setLoading(true);
    const res = await updateFormSettings(formState);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      setDidModified(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeErrorMessage();
        closeSuccessMessage();
      }, 2000);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <img src="/images/svg/settings_icon-1.svg" alt="" />&ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Control Center |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>FORM SETTINGS</Typography>
          {loading && <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
      >
        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >DEMOGRAPHICS</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >PATIENT INFORMATION</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.demographic_patient_info_required}
                  onChange={handleChange}
                  name="demographic_patient_info_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.demographic_patient_info_mandatory}
                label="MANDATORY"
                name="demographic_patient_info_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >PROVIDER INFORMATION</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >OTHER PROVIDERS</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.provider_info_providers_required}
                  onChange={handleChange}
                  name="provider_info_providers_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.provider_info_providers_mandatory}
                label="MANDATORY"
                name="provider_info_providers_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >PHARMACY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.provider_info_pharmacy_required}
                  onChange={handleChange}
                  name="provider_info_pharmacy_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.provider_info_pharmacy_mandatory}
                label="MANDATORY"
                name="provider_info_pharmacy_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >INSURANCE</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.provider_info_insurance_required}
                  onChange={handleChange}
                  name="provider_info_insurance_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.provider_info_insurance_mandatory}
                label="MANDATORY"
                name="provider_info_insurance_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >MEDICAL HISTORY</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >COVID-19 SCREENING</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.medical_history_covid_19_screening_required}
                  onChange={handleChange}
                  name="medical_history_covid_19_screening_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.medical_history_covid_19_screening_mandatory}
                label="MANDATORY"
                name="medical_history_covid_19_screening_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >CURRENT HEALTH</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.medical_history_current_health_required}
                  onChange={handleChange}
                  name="medical_history_current_health_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.medical_history_current_health_mandatory}
                label="MANDATORY"
                name="medical_history_current_health_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >PERSONAL MEDICAL HISTORY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.medical_history_personal_medical_history_required}
                  onChange={handleChange}
                  name="medical_history_personal_medical_history_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.medical_history_personal_medical_history_mandatory}
                label="MANDATORY"
                name="medical_history_personal_medical_history_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >FAMILY HISTORY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.medical_history_family_medical_history_required}
                  onChange={handleChange}
                  name="medical_history_family_medical_history_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.medical_history_family_medical_history_mandatory}
                label="MANDATORY"
                name="medical_history_family_medical_history_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >SURGICAL HISTORY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.medical_history_surgical_procedure_required}
                  onChange={handleChange}
                  name="medical_history_surgical_procedure_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.medical_history_surgical_procedure_mandatory}
                label="MANDATORY"
                name="medical_history_surgical_procedure_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >CURRENT MEDICATIONS LIST</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.medical_history_medications_required}
                  onChange={handleChange}
                  name="medical_history_medications_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.medical_history_medications_mandatory}
                label="MANDATORY"
                name="medical_history_medications_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >SUPPORT SERVICES</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >RECEIVE INFORMATION/REFERRALS</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.support_service_support_services_required}
                  onChange={handleChange}
                  name="support_service_support_services_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.support_service_support_services_mandatory}
                label="MANDATORY"
                name="support_service_support_services_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >PERSONAL LIFE QUESTIONS</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.support_service_support_questions_required}
                  onChange={handleChange}
                  name="support_service_support_questions_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.support_service_support_questions_mandatory}
                label="MANDATORY"
                name="support_service_support_questions_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >EMPLOYMENT VERIFICATION</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >EMPLOYMENT VERIFICATION</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.employment_verification_required}
                  onChange={handleChange}
                  name="employment_verification_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.employment_verification_mandatory}
                label="MANDATORY"
                name="employment_verification_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >PRIVACY PRACTICES</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >HIPAA NOTICE OF PRIVACY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_hipaa_notice_of_privacy_required}
                  onChange={handleChange}
                  name="privacy_practices_hipaa_notice_of_privacy_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_hipaa_notice_of_privacy_mandatory}
                label="MANDATORY"
                name="privacy_practices_hipaa_notice_of_privacy_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >CONSENT FOR SERVICES</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_consent_for_services_required}
                  onChange={handleChange}
                  name="privacy_practices_consent_for_services_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_consent_for_services_mandatory}
                label="MANDATORY"
                name="privacy_practices_consent_for_services_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >FINANCIAL RESPONSIBILITY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_financial_responsibilities_required}
                  onChange={handleChange}
                  name="privacy_practices_financial_responsibilities_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_financial_responsibilities_mandatory}
                label="MANDATORY"
                name="privacy_practices_financial_responsibilities_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >PATIENT RULES/RESPONSIBILITIES</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_patient_rules_responsibilities_required}
                  onChange={handleChange}
                  name="privacy_practices_patient_rules_responsibilities_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_patient_rules_responsibilities_mandatory}
                label="MANDATORY"
                name="privacy_practices_patient_rules_responsibilities_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >AUTHORIZATION FOR RELEASE OF HEALTH INFORMATION</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_health_info_release_auth_required}
                  onChange={handleChange}
                  name="privacy_practices_health_info_release_auth_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_health_info_release_auth_mandatory}
                label="MANDATORY"
                name="privacy_practices_health_info_release_auth_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >RECEIPT OF DOCUMENTS</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_receipt_of_documents_required}
                  onChange={handleChange}
                  name="privacy_practices_receipt_of_documents_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_receipt_of_documents_mandatory}
                label="MANDATORY"
                name="privacy_practices_receipt_of_documents_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >METHOD FOR TEST RESULTS DELIVERY</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.privacy_practices_result_delivery_required}
                  onChange={handleChange}
                  name="privacy_practices_result_delivery_required"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
              <CheckButton
                checked={formState.privacy_practices_result_delivery_mandatory}
                label="MANDATORY"
                name="privacy_practices_result_delivery_mandatory"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.footerMessage}>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
        </div>

        <div className={brandClasses.footerButton}>
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
            type="submit"
          >
            {'SAVE'} {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </div>
      </form>
    </div>
  );
};

FormSetting.propTypes = {
  getFormSettings: PropTypes.func.isRequired,
  updateFormSettings: PropTypes.func.isRequired,
};

export default connect(null, { getFormSettings, updateFormSettings })(FormSetting);