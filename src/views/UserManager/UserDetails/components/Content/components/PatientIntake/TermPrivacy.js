import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, RadioGroup, TextField, Button, CircularProgress, InputLabel, FormControl } from '@material-ui/core';
import BlueBox from "components/BlueBox";
import brandStyles from 'theme/brand';
import GreenButton from "layouts/Main/components/Button/GreenButton";
import WhiteButton from "layouts/Main/components/Button/WhiteButton";
import RadioCheckButton from 'components/RadioCheckButton';
import PrintIcon from '@material-ui/icons/Print';
import SignaturePad from 'react-signature-canvas';
import clsx from 'clsx';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from '@date-io/moment';
import * as appConstants from 'constants/appConstants';
import DialogAlert from 'components/DialogAlert';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import { uploadImage, apiUrl } from 'actions/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px 0px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(1)}px`,
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  title: {
    color: theme.palette.brandDark,
    // textAlign: 'center',
    fontWeight: 600
  },
  description: {
    color: theme.palette.brandDark,
    fontWeight: 500,
    '& span': {
      fontWeight: 600,
    }
  },
  content: {
    padding: theme.spacing(2),
    width: '100%'
  },
  subContent: {
    width: 790,
    margin: '0 auto'
  },
  privacyRoot: {
    width: '60%',
    margin: '30px auto',
    padding: '30px 20px',
    height: '500px',
    overflow: 'auto',
  },
  privacyLabelingContainer: {
    display: 'flex',
  },
  privacy: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    // font- size: 16px;
    fontWeight: 500,
    '& span': {
      fontWeight: 600,
    }
  },
  privacyIndent: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    marginLeft: 10,
    // font- size: 16px;
    fontWeight: 500,
    '& span': {
      fontWeight: 600,
    }
  },
  noteRoot: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    width: '70%',
    margin: '30px auto',
    fontWeight: 500,
  },
  termsRoot: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    width: '80%',
    margin: '30px auto',
    fontWeight: 500,
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',

    // justifyContent: 'flex-end'
  },
  radioItem2: {
    minWidth: 158
  },
  radioItem1: {
    minWidth: '40%',
    margin: '0 auto'
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end'
  },
  actionBar: {
    display: 'flex',
    width: '80%',
    margin: '15px auto',
    justifyContent: 'flex-end',
    '& Button': {
      marginRight: 20,
      '&:last-child': {
        marginRight: 0,
      }
    }
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    borderRadius: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  //
  boxGrid: {
    padding: theme.spacing(4)
  },
  boxContanier: {
    // height: 218,
    border: `solid 1px`,
    borderColor: theme.palette.brandDark,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  boxContanier2: {
    marginTop: theme.spacing(4)
  },
  boxContanierHeight: {
    height: 150,
  },
  boxTitle: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    position: 'absolute',
    top: -10,
    background: '#fff',
    padding: '0 4px'
  },
  boxDesc: {
    color: theme.palette.brandGray,
    padding: '4px 10px',
  },
  boxInnerText: {
    paddingTop: 180,
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  buttonSkyBlue: {
    color: '#3ECCCD',
    '&:hover': {
      color: '#0F84A9',
    }
  },
  sigPad: {
    width: '100%',
    height: '100%'
  },
  dateLabel: {
    marginTop: '-23px',
    fontSize: '10px',
    backgroundColor: 'white',
    padding: '0 3px'
  },
  utilRoot: {
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    '& input': {
      padding: '13px 13px',
    },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    }
  },
}));

const SignatureAndTimestampInit = {
  signature: '',
  submitted_timestamp: moment(),
};

const HealthInfoReleaseAuthInit = {
  organization: '',
  phone: '',
  address: '',
  dates_of_medical_record_requested: moment(),
  city: '',
  reason_for_disclosure: '',
  authorize_to_release: '',
  submitted_timestamp: moment(),
};

const ResultDeliveryInit = {
  receive_results: '',
  disclosure: '',
  date: '',
  patient_signature: '',
  guardian_signature: '',
  submitted_timestamp: moment(),
};

const FinancialResponsibilitiesInit = {
  last_name: '',
  first_name: '',
  signature: '',
  submitted_timestamp: moment(),
};

let patientRulesAndResponsibleSignaturePad = {};
let hipaaNoticeOfPrivacySignaturePad = {};
let consentServiceSignaturePad = {};
let financialResponsibilitiesSignaturePad = {};

const TermPrivacy = (props) => {
  const {
    uploadImage,
    saveLoading,
    updatePatient,
    patient,
    user,
    nextTab,
    termPrivacyStep,
    backTab,
    isHipaaRequired,
    isConsentRequired,
    // isFinancialRequired,
    // isPatientRulesRequired,
    isAuthHealthRequired,
    isReceiptRequired,
    isResultDeliveryRequired,

    // isHipaaMandatory,
    // isConsentMandatory,
    isFinancialMandatory,
    isPatientRulesMandatory,
    isAuthHealthMandatory,
    // isReceiptMandatory,
    isResultDeliveryMandatory,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [formState, setFormState] = useState({
    patient_rules_responsibilities: { ...SignatureAndTimestampInit },
    hipaa_notice_of_privacy: { ...SignatureAndTimestampInit },
    consent_for_services: { ...SignatureAndTimestampInit },
    receipt_of_documents: { ...SignatureAndTimestampInit },
    health_info_release_auth: { ...HealthInfoReleaseAuthInit },
    result_delivery: { ...ResultDeliveryInit },
    financial_responsibilities: { ...FinancialResponsibilitiesInit }
  });
  const [loading, setLoading] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  useEffect(() => {
    console.log('TermPrivacy useEffect');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (patient) {
      console.log(patient, '------------------patient')
      if (patient.patient_rules_responsibilities)
        setFormState(formState => ({ ...formState, patient_rules_responsibilities: patient.patient_rules_responsibilities }));
      if (patient.hipaa_notice_of_privacy)
        setFormState(formState => ({ ...formState, hipaa_notice_of_privacy: patient.hipaa_notice_of_privacy }));
      if (patient.consent_for_services)
        setFormState(formState => ({ ...formState, consent_for_services: patient.consent_for_services }));
      if (patient.receipt_of_documents)
        setFormState(formState => ({ ...formState, receipt_of_documents: patient.receipt_of_documents }));
      if (patient.health_info_release_auth)
        setFormState(formState => ({ ...formState, health_info_release_auth: patient.health_info_release_auth }));
      if (patient.result_delivery)
        setFormState(formState => ({ ...formState, result_delivery: patient.result_delivery }));
      if (patient.financial_responsibilities)
        setFormState(formState => ({ ...formState, financial_responsibilities: patient.financial_responsibilities }));
    }
  }, [patient]);

  // const handleChange = e => {
  //   e.persist();
  //   setFormState(formState => ({
  //     ...formState,
  //     [e.target.name]: e.target.value
  //   }));
  // };

  const handleDateChange = e => {
    if (!didModified) setDidModified(true);
    let temp = formState.health_info_release_auth;
    temp.dates_of_medical_record_requested = e;
    setFormState({ ...formState, temp });
  };

  const handleHealthChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.health_info_release_auth;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleResultChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.result_delivery;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleFinancialChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.financial_responsibilities;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (termPrivacyStep === 1) {
      if (!isPatientRulesMandatory) {
        nextTab();
      } else if (patient.patient_rules_responsibilities && patient.patient_rules_responsibilities.signature) {
        nextTab();
      } else {
        if (!patientRulesAndResponsibleSignaturePad.isEmpty()) {
          setLoading(true);
          const sigBlob = dataURLtoBlob(patientRulesAndResponsibleSignaturePad.getTrimmedCanvas().toDataURL('image/png'));
          // Form Data
          const sigFormData = new FormData();
          sigFormData.append('uploadImage', sigBlob, 'patient-rules-responsible-signature.png');
          const res = await uploadImage(sigFormData);
          setLoading(false);
          if (res.success) {
            updatePatient({
              patient_rules_responsibilities: {
                signature: '/images/' + res.data
              }
            });
          }
        } else {
          setAlertDialogMessage('Please put the signature.');
          setAlertDialogOpen(true);
          return;
        }
      }
    }
    if (termPrivacyStep === 2) {
      if (patient.hipaa_notice_of_privacy && patient.hipaa_notice_of_privacy.signature && patient.consent_for_services && patient.consent_for_services.signature) {
        nextTab();
      } else {
        if (!hipaaNoticeOfPrivacySignaturePad.isEmpty() && !consentServiceSignaturePad.isEmpty()) {
          setLoading(true);
          const sigBlob = dataURLtoBlob(hipaaNoticeOfPrivacySignaturePad.getTrimmedCanvas().toDataURL('image/png'));
          // Form Data
          const sigFormData = new FormData();
          sigFormData.append('uploadImage', sigBlob, 'hipaa-privacy-signature.png');
          const res1 = await uploadImage(sigFormData);
          // consent
          const sigBlob2 = dataURLtoBlob(consentServiceSignaturePad.getTrimmedCanvas().toDataURL('image/png'));
          // Form Data
          const sigFormData2 = new FormData();
          sigFormData2.append('uploadImage', sigBlob2, 'consent-service-signature.png');
          const res2 = await uploadImage(sigFormData2);
          setLoading(false);
          if (res1.success && res2.success) {
            updatePatient({
              hipaa_notice_of_privacy: {
                signature: '/images/' + res1.data
              },
              consent_for_services: {
                signature: '/images/' + res2.data
              },
            });
          }
        } else {
          setAlertDialogMessage('Please put the signature.');
          setAlertDialogOpen(true);
          return;
        }
      }
    }
    if (termPrivacyStep === 3) {
      if (!didModified) return nextTab();
      updatePatient({
        health_info_release_auth: formState.health_info_release_auth,
        result_delivery: formState.result_delivery,
      });
    }
    if (termPrivacyStep === 4) {
      // if (!didModified) return nextTab();
      if (!isFinancialMandatory) {
        nextTab();
      } else if (!didModified && patient.financial_responsibilities && patient.financial_responsibilities.signature) {
        nextTab();
      } else {
        if (!financialResponsibilitiesSignaturePad.isEmpty()) {
          setLoading(true);
          const sigBlob = dataURLtoBlob(financialResponsibilitiesSignaturePad.getTrimmedCanvas().toDataURL('image/png'));
          // Form Data
          const sigFormData = new FormData();
          sigFormData.append('uploadImage', sigBlob, 'financial-responsibilities-signature.png');
          const res = await uploadImage(sigFormData);
          setLoading(false);
          if (res.success) {
            updatePatient({
              financial_responsibilities: {
                ...formState.financial_responsibilities,
                signature: '/images/' + res.data
              }
            });
          }
        } else {
          setAlertDialogMessage('Please put the signature.');
          setAlertDialogOpen(true);
          return;
        }
      }
      // updatePatient({
      //   financial_responsibilities: formState.financial_responsibilities,
      // });
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  };

  const clickBackBtn = e => {
    backTab();
  };

  return (
    <div className={classes.root}>
      {termPrivacyStep === 1 && (
        <div>
          <div className={classes.header}>
            <Typography variant="h2" className={brandClasses.headerTitle}>
              <img src="/images/svg/status/users_icon.svg" alt="" />
              {'User Manager'} |
              </Typography>
            <Typography variant="h4" className={classes.headerSubTitle}>PATIENT RULES AND RESPONSIBILITIES</Typography>
          </div>

          <div className={brandClasses.subHeaderBlueDark}>
            <Typography variant="h5" >PATIENT RULES AND RESPONSIBILITIES</Typography>
          </div>
          <div>
            <BlueBox class={classes.privacyRoot} >
              <Typography variant='h5' className={classes.privacy}>
                <span><b>TESTD | MD</b> Staff very much wants to make your experience a safe and comfortable one. This begins with the relationship between the patient and staff, which is based on mutual respect. The following rules must be adhered to whenever you visit the Clinic.</span>
                <br /><br />
                <span>In order to ensure the safety and welfare of all our participants, we ask that all patients, staff and volunteers comply with the following:</span>
                <br /><br />
              </Typography>
              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy} >
                  Conduct yourself in an appropriate, non-disruptive and non-threatening manner.
                  Physical violence, threats of physical violence or sexual harassment will not be tolerated.
                </Typography>
              </div><br />
              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy} >
                  Do not use discriminatory statements regarding gender, race, color, creed, religious
                  affiliation, ancestry, national origin, physical handicap, medical condition, marital status,
                  age, and sexual orientation.
                </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Do not come to the Clinic under the influence of alcohol or other non-prescribed substances.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Do not bring alcohol and/or illegal drugs or drug paraphernalia on-site.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Do not come to the Clinic with weapons on your person.
              </Typography>
              </div><br />

              <Typography variant='h5' className={classes.privacy}>
                <span>To maximize <b>TESTD | MD</b> services and operations, please adhere to the following:</span>
              </Typography><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Be honest when answering questions. Do not give false information regarding identity, HIV
                  status, residency, or income.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Supply requested documentation in a timely manner in order to verify your eligibility and
                  inform staff of any changes in a timely manner.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Arrive on time for all appointments and call to cancel or reschedule appointments.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Actively participate in the development of the Medical Treatment Plan/Care Plan
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  If you miss more than three (3) consecutive appointments, your provider may decide that it
                  is unsound medically to continue your course of treatment without adequate follow up visits
                  and, therefore, may discontinue your enrollment, with referral to another facility.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  If we do not hear from you within six-month period, your file may be considered inactive,
              necessitating reprocessing as a new patient should you decide to return to <b>TESTD | MD</b>.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Make sure that you have enough medication to last until your next appointment.
              </Typography>
              </div><br />

              <Typography variant='h5' className={classes.privacy}>
                <span>While a patient is at <b>TESTD | MD</b>, it is necessary to adhere to the rules of our medical office building.</span>
              </Typography><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  There is no smoking anywhere including hallways and restrooms.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Patients are responsible for their own property. The office shall not be liable for loss or
                  damage to personal property.
              </Typography>
              </div><br />

              <div className={classes.privacyLabelingContainer} >
                <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
                <Typography variant='h5' className={classes.privacy}>
                  Patients are to refrain from eating or drinking anything not provided by the office in the
                  waiting room.
              </Typography>
              </div><br />

            </BlueBox>
            <Typography variant="h5" className={classes.noteRoot}>
              Note: If you have any questions regarding these rules<br />
              and responsibilities, please contact the Clinic Manager at: {user.location_id.office_phone}
            </Typography>
            <Typography variant="h5" className={classes.termsRoot}>
              I UNDERSTAND THAT FAILURE TO ADHERE TO THEM MAY RESULT<br />
              IN SUSPENSION OR DISCONTINUATION OF SERVICES AT <b>TESTD | MD</b> <br />
              AND PROSECUTION MAY BE PURSUED.
              </Typography>
          </div>
          <form
            onSubmit={handleSubmit}
          >
            <div className={classes.footer}>
              {/* <TextField
                type="text"
                label="Initial"
                placeholder="Enter Initial"
                name="step1Initial"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.step1Initial || ''}
                required
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              /> */}
              <div className={clsx(classes.boxContanier, classes.boxContanierHeight)}>
                <Typography variant="h5" className={classes.boxTitle}> Initial </Typography>
                {patient.patient_rules_responsibilities && patient.patient_rules_responsibilities.signature
                  ?
                  <img src={apiUrl + patient.patient_rules_responsibilities.signature} alt="img" />
                  :
                  <>
                    <Typography variant="h5" className={classes.boxDesc}>Enter Initial</Typography>
                    <SignaturePad
                      canvasProps={{ className: classes.sigPad }}
                      clearOnResize={false}
                      ref={(ref) => { patientRulesAndResponsibleSignaturePad = ref }}
                    />
                  </>
                }
              </div>
            </div>
            <br></br>
            <div className={classes.footer}>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={clickBackBtn}
              >
                BACK
              </Button>
              &ensp;
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={saveLoading || loading}
                type="submit"
              >
                {'NEXT'} {saveLoading || loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>

            </div>
          </form>
        </div>
      )}

      {termPrivacyStep === 2 && (
        <div>
          <div className={classes.header}>
            <Typography variant="h2" className={brandClasses.headerTitle}>
              <img src="/images/svg/status/users_icon.svg" alt="" />
              {'User Manager'} |
              </Typography>
            <Typography variant="h4" className={classes.headerSubTitle}>PRIVACY PRACTICES</Typography>
          </div>
          <form
            onSubmit={handleSubmit}
          >
            {isHipaaRequired && (
              <>
                <div className={brandClasses.subHeaderBlueDark}>
                  <Typography variant="h5" >HIPAA NOTICE OF PRIVACY PRACTICES</Typography>
                </div>
                <BlueBox class={classes.privacyRoot} >
                  <Typography variant='h5' className={classes.privacy}>
                    I have received or been provided the opportunity to review a copy of HIPAA Notice of Privacy Practices. I understand <b>TESTD|MD</b> and staff may use and disclose my protected health information (PHI) to carry out treatment and payment for the purpose of continuity of my care health care operations.
                  <br /><br />
                This authorization permits <b>TESTD | MD</b> to use and/or disclose individually identifiable health information about me.
                </Typography>
                  <br /><br />

                  <div style={{ display: 'flex' }} >
                    <Typography variant='h5' className={classes.privacy}>1.&ensp; </Typography>

                    <Typography variant='h5' className={classes.privacy}>
                      <b>TESTD | MD, Inc.</b> is authorized to disclose my individually identifiable health
                  information to partnering agencies. This information will be kept confidential with the following
                  exceptions :
                    <div className={classes.privacyLabelingContainer} >
                        <Typography variant='h5' className={classes.privacyIndent}>{'a)'}&ensp; </Typography>
                        <Typography variant='h5' className={classes.privacy}>
                          If I am deemed to present a danger to myself or others;
                      </Typography>
                      </div>
                      <div className={classes.privacyLabelingContainer} >
                        <Typography variant='h5' className={classes.privacyIndent}>{'b)'}&ensp; </Typography>
                        <Typography variant='h5' className={classes.privacy}>
                          If concerns about possible abuse or neglect arise;
                      </Typography>
                      </div>
                      <div className={classes.privacyLabelingContainer} >
                        <Typography variant='h5' className={classes.privacyIndent}>{'c)'}&ensp; </Typography>
                        <Typography variant='h5' className={classes.privacy}>
                          If a court order is issued to obtain records.
                      </Typography>
                      </div>
                    </Typography>

                  </div><br />

                  <div style={{ display: 'flex' }} >
                    <Typography variant='h5' className={classes.privacy}>2.&ensp; </Typography>
                    <Typography variant='h5' className={classes.privacy}>
                      I understand that I may inspect or copy the information to be disclosed.
                    </Typography>
                  </div><br />

                  <div style={{ display: 'flex' }} >
                    <Typography variant='h5' className={classes.privacy}>3.&ensp; </Typography>
                    <Typography variant='h5' className={classes.privacy}>
                      I understand that I may revoke this authorization at any time by notifying <b>TESTD | MD</b> in writing.
                    </Typography>
                  </div><br />

                  <div style={{ display: 'flex' }} >
                    <Typography variant='h5' className={classes.privacy}>4.&ensp; </Typography>
                    <Typography variant='h5' className={classes.privacy}>
                      I have the right for someone to accompany me as long as I have disclosed my condition to
                      the unknown, and make it known to <b>TESTD | MD</b> staff.
                    </Typography>
                  </div><br />

                  <Typography variant='h5' className={classes.privacy}>

                  </Typography>
                </BlueBox>
                <div className={classes.footer}>
                  {/* <TextField
                type="text"
                label="Initial"
                placeholder="Enter Initial"
                name="step2Initial1"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.step2Initial1 || ''}
                required
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              /> */}
                  <div className={clsx(classes.boxContanier, classes.boxContanierHeight)}>
                    <Typography variant="h5" className={classes.boxTitle}> Initial </Typography>
                    {patient.hipaa_notice_of_privacy && patient.hipaa_notice_of_privacy.signature
                      ?
                      <img src={apiUrl + patient.hipaa_notice_of_privacy.signature} alt="img" />
                      :
                      <>
                        <Typography variant="h5" className={classes.boxDesc}>Enter Initial</Typography>
                        <SignaturePad
                          canvasProps={{ className: classes.sigPad }}
                          clearOnResize={false}
                          ref={(ref) => { hipaaNoticeOfPrivacySignaturePad = ref }}
                        />
                      </>
                    }
                  </div>
                </div>
                <br></br>
              </>
            )}

            {isConsentRequired && (
              <>
                <div className={brandClasses.subHeaderBlueDark}>
                  <Typography variant="h5" >CONSENT FOR SERVICES</Typography>
                </div>
                <BlueBox class={classes.privacyRoot} >
                  <Typography variant='h5' className={classes.privacy}>
                    Benefits to the Intake Questionnaire: Intake may be administered by a Medical Case Manager (MCM) or Non-Medical Case Manager (NMCM) to evaluate the area of needs, treatment and medications management. It may be beneficial to you, as well as the referring professional, to understand the cause of any difficulties affecting my daily Functioning, so that appropriate recommendations and services may be offered.
                <br /> <br />
                Uses of this questionnaire: Referral to Specialists, Evaluation for Support Services, Mental Health and/or Substance Abuse Planning and Education.
                <br /> <br />
                Possible benefits of services: include improved socio-economic status, job performance, health status, quality of life and awareness of spreading any diseases.
                <br /> <br />
                Right to Withdraw Consent: I have the right to withdraw my consent for services and/or treatment at any time verbally or in writing.
                <br /> <br />
                Right to Treatment: I also attest that I have the right to consent for treatment.
                <br /> <br />
                I understand that this authorization is voluntary and that I may refuse to sign this authorization. My refusal to sign will not affect my ability to obtain treatment, or eligibility for benefits, unless allowed by law.
                <br /> <br />
                I have read and understand the above, I have had an opportunity to ask questions about this information, and I consent to the service, referral,
                follow-up and treatment if offered.
            </Typography>
                </BlueBox>

                <div className={classes.footer}>
                  {/* <TextField
                type="text"
                label="Initial"
                placeholder="Enter Initial"
                name="step2Initial2"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.step2Initial2 || ''}
                required
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              /> */}
                  <div className={clsx(classes.boxContanier, classes.boxContanierHeight)}>
                    <Typography variant="h5" className={classes.boxTitle}> Initial </Typography>
                    {patient.consent_for_services && patient.consent_for_services.signature
                      ?
                      <img src={apiUrl + patient.consent_for_services.signature} alt="img" />
                      :
                      <>
                        <Typography variant="h5" className={classes.boxDesc}>Enter Initial</Typography>
                        <SignaturePad
                          canvasProps={{ className: classes.sigPad }}
                          clearOnResize={false}
                          ref={(ref) => { consentServiceSignaturePad = ref }}
                        />
                      </>
                    }
                  </div>
                </div>
                <br></br>
              </>
            )}

            <div className={classes.footer}>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                classes={{ disabled: brandClasses.buttonDisabled }}
                onClick={clickBackBtn}
              >
                BACK
              </Button>
              &ensp;
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={saveLoading || loading}
                type="submit"
              >
                {'NEXT'} {saveLoading || loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </div>
          </form>
        </div>
      )}

      {termPrivacyStep === 3 && (
        <div>
          <div className={classes.header}>
            <Typography variant="h2" className={brandClasses.headerTitle}>
              <img src="/images/svg/status/users_icon.svg" alt="" />
              {'User Manager'} |
            </Typography>
            <Typography variant="h4" className={classes.headerSubTitle}>PATIENT CONSENT</Typography>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            {isAuthHealthRequired && (
              <>
                <div className={brandClasses.subHeaderBlueDark}>
                  <Typography variant="h5" >AUTHORIZATION FOR THE RELEASE OF HEALTH INFORMATION</Typography>
                </div>
                <div className={classes.header}>
                  <div className={classes.content}>
                    <Typography variant='h5' align='center' className={classes.title}>
                      I Authorize Complete Health Records be Released and Provided to:
                    </Typography>
                    <Grid container className={classes.content} spacing={4}>
                      <Grid item md={6}>
                        <TextField
                          type="text"
                          label="Organization"
                          placeholder="Enter orgnaization"
                          name="organization"
                          className={brandClasses.shrinkTextField}
                          onChange={handleHealthChange}
                          value={formState.health_info_release_auth.organization || ''}
                          required={isAuthHealthMandatory}
                          fullWidth
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6}>
                        <TextField
                          type="tel"
                          label="Phone"
                          placeholder="Enter phone number"
                          name="phone"
                          className={brandClasses.shrinkTextField}
                          onChange={handleHealthChange}
                          value={formState.health_info_release_auth.phone || ''}
                          required={isAuthHealthMandatory}
                          fullWidth
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item md={6}>
                        <TextField
                          type="text"
                          label="Address"
                          placeholder="Enter address"
                          name="address"
                          className={brandClasses.shrinkTextField}
                          onChange={handleHealthChange}
                          value={formState.health_info_release_auth.address || ''}
                          required={isAuthHealthMandatory}
                          fullWidth
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6}>
                        {/* <TextField
                          type="text"
                          label="Dates of Medical Record Requested"
                          placeholder="00/00/0000"
                          name="dates_of_medical_record_requested"
                          className={brandClasses.shrinkTextField}
                          onChange={handleHealthChange}
                          value={formState.health_info_release_auth.dates_of_medical_record_requested || ''}
                          required={isAuthHealthMandatory}
                          fullWidth
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                        /> */}
                        <FormControl
                          className={brandClasses.shrinkTextField}
                          fullWidth
                          required
                          variant="outlined"
                        >
                          <InputLabel className={classes.dateLabel}>Dates of Medical Record Requested</InputLabel>
                          <MuiPickersUtilsProvider utils={MomentUtils} >
                            <DatePicker
                              value={formState.health_info_release_auth.dates_of_medical_record_requested || ''}
                              format="MM/DD/yyyy"
                              onChange={handleDateChange}
                              maxDate={moment()}
                              className={classes.utilRoot}
                              required={isAuthHealthMandatory}
                            />
                          </MuiPickersUtilsProvider>
                        </FormControl>
                      </Grid>
                      <Grid item md={6}>
                        <TextField
                          type="text"
                          label="City"
                          placeholder="Enter city"
                          name="city"
                          className={brandClasses.shrinkTextField}
                          onChange={handleHealthChange}
                          value={formState.health_info_release_auth.city || ''}
                          required={isAuthHealthMandatory}
                          fullWidth
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={6}>
                        <Typography variant="h5" className={classes.title}>
                          Reason for disclosure:
                        </Typography>
                        <div className={classes.radioGroup}>
                          <RadioGroup
                            value={formState.health_info_release_auth.reason_for_disclosure}
                            onChange={handleHealthChange}
                            name={'reason_for_disclosure'}
                            style={{ flexDirection: 'unset' }}
                          >
                            <RadioCheckButton label='Continuing Care' value='Continuing Care' className={classes.radioItem2} required={isAuthHealthMandatory} />
                            <RadioCheckButton label='Insurance' value='Insurance' className={classes.radioItem2} required={isAuthHealthMandatory} />
                            <RadioCheckButton label='Legal' value='Legal' className={classes.radioItem2} required={isAuthHealthMandatory} />
                            <RadioCheckButton label='Personal Use' value='Personal Use' className={classes.radioItem2} required={isAuthHealthMandatory} />
                            <RadioCheckButton label='Other Reason' value='Other Reason' className={classes.radioItem2} required={isAuthHealthMandatory} />
                          </RadioGroup>
                        </div>
                      </Grid>
                    </Grid>
                    <div className={classes.subContent}>
                      <Typography variant="h5" className={classes.title} align='center'>
                        The following information will not be released<br />
                        unless you specifically authorize it by marking the relevant box(es) below:
                      </Typography>
                      <br />
                      <RadioGroup
                        value={formState.health_info_release_auth.authorize_to_release}
                        onChange={handleHealthChange}
                        name={'authorize_to_release'}
                        style={{ flexDirection: 'unset' }}
                      >
                        <RadioCheckButton label='Drug/Alcohol abuse or treatment' value='Drug/Alcohol abuse or treatment' className={classes.radioItem1} required={isAuthHealthMandatory} />
                        <RadioCheckButton label='HIV/AIDS Test Results or Diagnoses' value='HIV/AIDS Test Results or Diagnoses' className={classes.radioItem1} required={isAuthHealthMandatory} />
                        <RadioCheckButton label='Genetic Testing Information' value='Genetic Testing Information' className={classes.radioItem1} required={isAuthHealthMandatory} />
                        <RadioCheckButton label='COVID-19 Test Results' value='COVID-19 Test Results' className={classes.radioItem1} required={isAuthHealthMandatory} />
                      </RadioGroup>
                      <br />
                      <Typography variant="h5" className={classes.description} align='center'>
                        This consent is subject to revocation at any time to the extent the action has been taken thereon.
                    <br />
                    This authorization and consent <span>will expire one year from the date of authorization written below</span>.
                    <br /><br />
                    Your health care (or payment for care) will not be affected by whether or not you sign this authorization. Once your health care information is released, redisclosure of your health care
                    information by the Recipient may no longer be protected by law.
                    </Typography>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isReceiptRequired && (
              <>
                <div className={brandClasses.subHeaderBlueDark}>
                  <Typography variant="h5" >RECEIPT OF DOCUMENTS</Typography>
                </div>
                <div className={classes.subContent}>
                  <br />
                  <Typography variant='h5' align='center' className={classes.description}>
                    The patient/legal guardian acknowledges receipt of <b>TESTD | MD</b> Policies and Procedures.<br />
                    In addition, it is the responsibility of the patient/legal guardian to keep monthly<br />
                    contact with my Medical Case Manager or when a change occurs.<br />
                    The client/legal guardian ACCEPTS or REJECTS copies.
                  </Typography>
                  <br />
                  <div className={classes.actionBar}>
                    <GreenButton label="ACCEPT" />
                    <WhiteButton label="REJECT" />
                  </div>
                </div>
              </>
            )}

            {isResultDeliveryRequired && (
              <>
                <div className={brandClasses.subHeaderBlueDark}>
                  <Typography variant="h5" >METHOD FOR TEST RESULTS DELIVERY</Typography>
                </div>
                <div className={classes.content}>
                  <br />
                  <Typography variant='h5' className={classes.description}>
                    How do you prefer to receive your test results?
                 </Typography>
                  <br />

                  <RadioGroup
                    value={formState.result_delivery.receive_results}
                    onChange={handleResultChange}
                    name={'receive_results'}
                    style={{ flexDirection: 'unset' }}
                    className={classes.radioGroup}
                  >
                    <Typography variant='h5' className={classes.description}>
                      Check all that apply:
                    </Typography>
                    <RadioCheckButton label='Email' value='Email' required={isResultDeliveryMandatory} className={classes.radioItem2} />
                    <RadioCheckButton label='SMS' value='SMS' required={isResultDeliveryMandatory} className={classes.radioItem2} />
                    <RadioCheckButton label='Phone Call' value='Phone Call' required={isResultDeliveryMandatory} className={classes.radioItem2} />
                  </RadioGroup>
                  <br />
                  <br />
                  <Typography variant='h5' className={classes.description}>
                    Discloser:
                  </Typography>
                  <br />
                  <br />
                  <Typography variant='h5' className={classes.title}>
                    I ACKNOWLEDGE ALL OF THE ABOVE
                  </Typography>
                  <br /><br />
                  <Grid container spacing={2}>
                    <Grid item md={7}>
                      <Grid container direction="column" justify="center" className={classes.boxGrid}>
                        <div className={classes.boxContanier}>
                          <Typography variant="h5" className={classes.boxTitle}> Patient Signature </Typography>
                          <Typography variant="h5" className={classes.boxDesc}>Patient sign here</Typography>
                          <Typography className={classes.boxInnerText}></Typography>
                        </div>
                        <div className={clsx(classes.boxContanier, classes.boxContanier2)}>
                          <Typography variant="h5" className={classes.boxTitle}> Legal Guardian if Patient is under 18/Companion </Typography>
                          <Typography variant="h5" className={classes.boxDesc}>Sign here</Typography>
                          <Typography className={classes.boxInnerText}></Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item md={5}>
                      {/* <Typography variant='h5' >Today's Date</Typography> */}
                      <br />
                    </Grid>
                  </Grid>
                </div>
              </>
            )}

            <div className={classes.actionBar}>
              <WhiteButton label="PRINT" startIcon={<PrintIcon />} />
              <WhiteButton
                label={'TRANSMIT'}
                className={classes.buttonSkyBlue}
                type="submit"
              />
            </div>
            <div className={classes.actionBar}>
              <WhiteButton
                label={'BACK'}
                className={classes.buttonSkyBlue}
                onClick={clickBackBtn}
              />
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={saveLoading}
                type="submit"
              >
                NEXT {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
              {/* &ensp; */}
            </div>
          </form>
        </div>
      )}

      {termPrivacyStep === 4 && (
        <div>
          <div className={classes.header}>
            <Typography variant="h2" className={brandClasses.headerTitle}>
              <img src="/images/svg/status/users_icon.svg" alt="" />
              {'User Manager'} |
            </Typography>
            <Typography variant="h4" className={classes.headerSubTitle}>FINANCIAL RESPONSIBILITIES</Typography>
          </div>

          <div className={brandClasses.subHeaderBlueDark}>
            <Typography variant="h5" >FINANCIAL RESPONSIBILITIES</Typography>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            <div className={classes.header}>
              <div className={classes.content}>
                <Typography variant='h5' className={classes.title}>
                  1. Patient is required to provide us with the most correct and updated information about their insurance.
                    </Typography>
                <br />
                <Typography variant='h5' className={classes.title}>
                  2. The Patient is required to report any loss of employment and income change to Case Managers.
                    </Typography>
                <br />
                <Grid container className={classes.content} spacing={4}>
                  <Grid item md={6}>
                    <TextField
                      type="text"
                      label="Last Name"
                      placeholder="Enter last name"
                      name="last_name"
                      className={brandClasses.shrinkTextField}
                      onChange={handleFinancialChange}
                      value={formState.financial_responsibilities.last_name || ''}
                      required={isFinancialMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      type="text"
                      label="First Name"
                      placeholder="Enter first name"
                      name="first_name"
                      className={brandClasses.shrinkTextField}
                      onChange={handleFinancialChange}
                      value={formState.financial_responsibilities.first_name || ''}
                      required={isFinancialMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </div>
            </div>

            <div className={classes.actionBar}>
              {/* <TextField
                type="text"
                label="Initial"
                placeholder="Enter Initial"
                name="step4Initial"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.step4Initial || ''}
                required
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              /> */}
              <div className={clsx(classes.boxContanier, classes.boxContanierHeight)}>
                <Typography variant="h5" className={classes.boxTitle}> Initial </Typography>
                {patient.financial_responsibilities && patient.financial_responsibilities.signature
                  ?
                  <img src={apiUrl + patient.financial_responsibilities.signature} alt="img" />
                  :
                  <>
                    <Typography variant="h5" className={classes.boxDesc}>Enter Initial</Typography>
                    <SignaturePad
                      canvasProps={{ className: classes.sigPad }}
                      clearOnResize={false}
                      ref={(ref) => { financialResponsibilitiesSignaturePad = ref }}
                    />
                  </>
                }
              </div>
            </div>
            <div className={classes.actionBar}>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                classes={{ disabled: brandClasses.buttonDisabled }}
                onClick={clickBackBtn}
              >
                BACK {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
              &ensp;
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={saveLoading || loading}
                type="submit"
              >
                NEXT {saveLoading || loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </div>
          </form>
        </div>
      )}

      <DialogAlert
        open={alertDialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleAlertDialogClose}
      />
    </div>
  );
};

TermPrivacy.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  updatePatient: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  backTab: PropTypes.func,
  isHipaaRequired: PropTypes.bool.isRequired,
  isConsentRequired: PropTypes.bool.isRequired,
  isFinancialRequired: PropTypes.bool.isRequired,
  isPatientRulesRequired: PropTypes.bool.isRequired,
  isAuthHealthRequired: PropTypes.bool.isRequired,
  isReceiptRequired: PropTypes.bool.isRequired,
  isResultDeliveryRequired: PropTypes.bool.isRequired,
  isHipaaMandatory: PropTypes.bool.isRequired,
  isConsentMandatory: PropTypes.bool.isRequired,
  isFinancialMandatory: PropTypes.bool.isRequired,
  isPatientRulesMandatory: PropTypes.bool.isRequired,
  isAuthHealthMandatory: PropTypes.bool.isRequired,
  isReceiptMandatory: PropTypes.bool.isRequired,
  isResultDeliveryMandatory: PropTypes.bool.isRequired,
};

export default connect(null, { uploadImage })(TermPrivacy);