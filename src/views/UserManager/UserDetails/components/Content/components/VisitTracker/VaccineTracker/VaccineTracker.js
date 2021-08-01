import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, RadioGroup, Divider, Button, TextField, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, CircularProgress, InputLabel } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import brandStyles from 'theme/brand';
import LineStepProgressBar from "components/LineStepProgressBar";
import BlueBox from "components/BlueBox";
import CheckCircleButton from 'components/CheckCircleButton';
import clsx from 'clsx';
import moment from "moment";
import QRCode from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { getVaccineProtocols, getVaccineLocation } from 'helpers';
import SignaturePad from 'react-signature-canvas';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import RadioRoundCheckButton from 'components/RadioRoundCheckButton';
import RadioCheckButton from 'components/RadioCheckButton';
import { apiUrl, getPatient, upsertPatient, uploadImage, updateUserTesting, clientServer } from 'actions/api';

const useStyles = makeStyles(theme => ({
  root: {
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  headerTitle: {
    color: theme.palette.brandText,
    display: 'flex',
    '& img': {
      marginRight: 8
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  heading: {
    font: 'Montserrat',
    color: '#0F84A9',
    fontSize: '16px',
    fontWeigth: 600

  },
  symptoms: {
    font: 'Montserrat',
    color: '#0F84A9',
    fontSize: '12px',
    fontWeigth: 400,
    padding: 5,
    border: '0.834148px solid #0F84A9',
    margin: 5,
    borderRadius: '13.9025px',
    lineHeight: '32px'
  },
  box: {
    font: 'Montserrat',
    color: '#0F84A9',
    fontSize: '12px',
    fontWeigth: 400,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px',
    margin: 5,
    borderRadius: '13.9025px',
    lineHeight: '32px',
    boxShadow: 'none'
  },
  divider: {
    width: '90%',
    color: '#D8D8D8',
    border: 'solid 1px #D8D8D8',
    margin: '20px auto'
  },
  nextbutton: {
    color: ' #FFFFFF',
    display: 'flex',
    minWidth: '120px',
    fontWeight: '600',
    lineHeight: '2',
    paddingLeft: '8px',
    paddingRight: '8px',
    letterpacing: '1px',
    textTransform: 'none',
    backgroundColor: '#3ECCCD',
    '&:hover': {
      backgroundColor: '#3ECCCD',
      color: ' #FFFFFF',
    },
  },
  signatureBox: {
    // height: 218,
    width: '50%',
    border: `solid 1px`,
    borderColor: theme.palette.brandDark,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
    '& img': {
      width: '100%'
    }
  },
  dialogHeader: {
    color: "#25DD83"
  },
  dialogCheckbox: {
    color: theme.palette.brandDark,
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  // print
  printRoot: {
    paddingTop: 400
  },
  printPage: {
    padding: 1,
    paddingTop: 2,
    width: 500,
    // display: 'flex',
    // justifyContent: 'space-between',
  },
  printPageKey: {
    color: theme.palette.black,
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 'inherit',
  },
}));

const VaccineInitialValues = [
  {
    checked: false,
    value: '',
    question: 'Fever, chills, or sweating',
    unique_question_id: 'Fever_Or_Chills',
  },
  {
    checked: false,
    value: '',
    question: 'New loss of taste or smell',
    unique_question_id: 'Loss_Of_Smell_Taste',
  },
  {
    checked: false,
    value: '',
    question: 'Difficulty breathing (not severe)',
    unique_question_id: 'Difficulty_Breathing',
  },
  {
    checked: false,
    value: '',
    question: 'Headaches',
    unique_question_id: 'Headache',
  },
  {
    checked: false,
    value: '',
    question: 'New or worsening cough',
    unique_question_id: 'Cough',
  },
  {
    checked: false,
    value: '',
    question: 'Muscle or body aches',
    unique_question_id: 'Muscle_Or_Body_Aches',
  },
  {
    checked: false,
    value: '',
    question: 'Sore throat?',
    unique_question_id: 'Sore_Throat',
  },
  {
    checked: false,
    value: '',
    question: 'Congestion or runny nose',
    unique_question_id: 'Congestion_Runny_Nose',
  },
  {
    question: 'Have you tested positive for and/or been diagnosed with COVID-19 infection in the last 10 days?',
    checked: '',
    value: '',
    unique_question_id: 'Postive_last_10_Days',
  }, {
    question: 'Have you had a severe allergic reaction (e.g. needed apinephrine or hospital care) to a previous dose of this vaccine or to any of the ingredients to this vaccine?',
    checked: '',
    value: '',
    unique_question_id: 'Allergic_Reaction_Previous_Dose',
  },
  {
    question: 'Have you had any other vaccinations in the last 14 days (e.g. influenza vaccine, etc.)?',
    checked: '',
    value: '',
    unique_question_id: 'Vaccination_Last_14_Days',
  },
  {
    question: 'Have you had any COVID-19 Antibody therapy within the last 90 days (e.g. Regenerson, Bamlanvimab, COVID Convalescent Plasma, etc.)',
    checked: '',
    value: '',
    unique_question_id: 'Antibody_Therapy_Last_90_Days',
  },
];

const OtherScreeningInit = [
  {
    value: '',
    question: 'Do you carry an Epi-pen for emergency treatment of anaphylaxis and/or have allergies or reactions to any medications, food, vaccines or latex?',
    unique_question_id: 'Epipen_Emergency_Treatment',
  },
  {
    value: '',
    question: 'For women, are you pregnant or is there a chance you could become pregnant?',
    unique_question_id: 'Pregnant',
  },
  {
    value: '',
    question: 'For women, are you currently breastfeeding?',
    unique_question_id: 'Breast_Feeding',
  },
  {
    value: '',
    question: 'Are you immunocompromised or on medication that affects your immune system?',
    unique_question_id: 'Immunicompromised_Medication',
  },
  {
    value: '',
    question: 'Do you have a bleeding disorder or are you on blood thinner/blood-thinning medication?',
    unique_question_id: 'Bleeding_Disorder',
  },
  {
    value: '',
    question: 'Have you received a previous dose of any COVID-19 vaccine?',
    unique_question_id: 'Recived_Previous_Dose',
  },
  {
    value: '',
    question: 'Epipen emergency treatment value',
    unique_question_id: 'Epipen_Emergency_Treatment_Value',
  },
];

let patientSigPad = {};
let medicalSigPad = {};

const labelArray = ['Vaccine Eligibility', 'Vaccine Verification', 'Patient Approval', 'Checklist'];

const VaccineTracker = (props) => {
  const { user, testing, setTesting, type, uploadImage, updateUserTesting, getPatient, upsertPatient } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const componentRef = useRef();

  const history = useHistory();

  const [step, setStep] = useState(0);
  const [step0Page, setStep0Page] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [disablenext, setDisableNext] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [formState, setFormState] = useState({ covid_19_screening: [...VaccineInitialValues], other_screening: [...OtherScreeningInit] });
  const [responseCovidScreening, setResponseCovidScreening] = useState([]);

  useEffect(() => {
    if (user._id) {
      (async () => {
        const res = await getPatient(user._id);
        if (res.success && res.data) {
          // covid_19_screening
          if (res.data.covid_19_screening && res.data.covid_19_screening.length) {
            setResponseCovidScreening(res.data.covid_19_screening);
            let valueAdded = VaccineInitialValues.map(viv => {
              let i = res.data.covid_19_screening.findIndex(c19s => c19s.unique_question_id === viv.unique_question_id);
              if (i > -1) {
                return {
                  ...viv,
                  value: res.data.covid_19_screening[i].value.toUpperCase(),
                  checked: res.data.covid_19_screening[i].value.toUpperCase() === "YES" ? true : false
                }
              } else {
                return viv;
              }
            });
            setFormState(formState => ({ ...formState, covid_19_screening: valueAdded }));
          }
          // other_screening
          if (res.data.other_screening && res.data.other_screening.length) {
            let valueAdded = OtherScreeningInit.map(viv => {
              let i = res.data.other_screening.findIndex(c19s => c19s.unique_question_id === viv.unique_question_id);
              if (i > -1) {
                return {
                  ...viv,
                  value: res.data.other_screening[i].value.toUpperCase(),
                  checked: res.data.other_screening[i].value.toUpperCase() === "YES" ? true : false
                }
              } else {
                return viv;
              }
            });
            setFormState(formState => ({ ...formState, other_screening: valueAdded }));
          }
        }
      })();
      // set formstate
      setFormState(formState => ({
        ...formState,
        is_guardian_signature: testing.is_guardian_signature,
        vaccine_type: testing.vaccine_type,
        vaccine_location: testing.vaccine_location,
        lot_number: testing.lot_number,
      }));
    }
    // eslint-disable-next-line
  }, [user._id])

  useEffect(() => {
    if (step === 0) {
      setDisableNext(false);
    } else if (step === 1) {
      if (formState.vaccine_type && formState.vaccine_location && formState.lot_number) {
        setDisableNext(false);
      } else {
        setDisableNext(true);
      }
    }
  }, [formState, step]);

  const handleChange = e => {
    e.persist();
    if (e.target.type === 'checkbox') {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: e.target.checked
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSymptomsChange = index => e => {
    e.persist();
    let temp = formState.covid_19_screening;
    temp[index].value = e.target.value.length ? e.target.value : e.target.checked ? 'YES' : 'NO';
    temp[index].checked = e.target.checked;
    setFormState({ ...formState, temp });
  };

  const handleOthersChange = index => e => {
    e.persist();
    let temp = formState.other_screening;
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const onStepChange = async () => {
    if (step === 0 && step0Page === 1) {
      setStep0Page(step0Page + 1);
    } else if (step === 0 && step0Page === 2) {
      // save patient 
      updatePatient();
    } else if (step === 1) {
      // save testing vaccine values
      updateTesting({
        vaccine_type: formState.vaccine_type,
        vaccine_location: formState.vaccine_location,
        lot_number: formState.lot_number
      });
    } else if (step === 2) {
      handleApprovalNext();
    } else {
      setStep(step => step + 1);
    }
  };

  const onStepBack = () => {
    if (step0Page === 2 && step === 0) {
      setStep0Page(step0Page - 1);
    } else {
      setStep(step - 1);
    }
  };

  const patientSigClear = () => {
    patientSigPad.clear();
    checkPatientSig();
  };

  const medicalSigClear = () => {
    medicalSigPad.clear();
    checkPatientSig();
  };

  const checkPatientSig = () => {
    if (!patientSigPad.isEmpty() && !medicalSigPad.isEmpty()) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setIsPrinting(false);
  };

  const handleReprint = () => {
    printQR();
  };

  const printQR = useReactToPrint({
    content: () => componentRef.current,
  });

  const displayPrintOption = () => {
    // print label
    setIsPrinting(true);
    setSaveLoading(true);
    // 500 ms to load barcode
    setTimeout(() => {
      printQR();
      // 1 sec to load printer option
      setTimeout(() => {
        // setIsPrinting(false);
        setSaveLoading(false);
        setShowDialog(true);
      }, 1000);
    }, 500);
  };

  const handleComplete = () => {
    updateTesting({
      completed: true,
      is_guardian_signature: formState.is_guardian_signature ? true : false
    });
  };

  const updatePatient = async () => {
    setSaveLoading(true);
    let covid_19_screening = [];
    if (responseCovidScreening.length)
      responseCovidScreening.forEach(cs => {
        let index = formState.covid_19_screening.findIndex(c19s => cs.unique_question_id === c19s.unique_question_id);
        if (index > -1)
          covid_19_screening.push(formState.covid_19_screening[index]);
        else
          covid_19_screening.push(cs);
      });
    else
      covid_19_screening = formState.covid_19_screening;
    let other_screening = formState.other_screening.map(os => ({
      ...os,
      value: os.value.length ? os.value : 'NO'
    }));
    let body = { covid_19_screening, other_screening };
    const res = await upsertPatient(user._id, body);
    setSaveLoading(false);
    if (res.success) {
      setStep(step => step + 1);
    }
  };

  const handleApprovalNext = async () => {
    if (testing.patient_signature && testing.medical_technician) {
      displayPrintOption();
    } else {
      if (!patientSigPad.isEmpty() && !medicalSigPad.isEmpty()) {
        setSaveLoading(true);
        let body = {
          patient_signature: '',
          medical_technician: ''
        }
        const patientBlob = dataURLtoBlob(patientSigPad.getTrimmedCanvas().toDataURL('image/png'));
        const medicalBlob = dataURLtoBlob(medicalSigPad.getTrimmedCanvas().toDataURL('image/png'));
        // Form Data
        const patientFormData = new FormData();
        patientFormData.append('uploadImage', patientBlob, 'patient-signature.png');
        const resPatient = await uploadImage(patientFormData);
        if (resPatient.success) {
          let medicalFormData = new FormData();
          medicalFormData.append('uploadImage', medicalBlob, 'medical-signature.png');
          const resMedical = await uploadImage(medicalFormData);
          if (resMedical.success) {
            body.patient_signature = '/images/' + resPatient.data;
            body.medical_technician = '/images/' + resMedical.data;
            body.is_guardian_signature = formState.is_guardian_signature ? true : false;
            updateTesting(body);
          } else {
            setSaveLoading(false);
          }
        } else {
          setSaveLoading(false);
        }
      } else {
        if (clientServer === 'prod002' || clientServer === 'prod003')
          displayPrintOption();
        else
          setDisplayError('Please make Patient and Medical Technician Signature.');
      }
    }
  };

  const updateTesting = async (body) => {
    setSaveLoading(true);
    console.log('update body', body);
    const res = await updateUserTesting(testing._id, body);
    setSaveLoading(false);
    if (res.success) {
      setTesting(testing => ({
        ...testing,
        ...body
      }));
      if (step === 1)
        setStep(step => step + 1);
      else if (step === 2 && !showDialog)
        displayPrintOption();
      else if (step === 2 && showDialog) {
        setDisplaySuccess(res.message);
        setTimeout(() => {
          history.push('/appointment-manager/monthly');
        }, 1000);
      }
    }
  };

  class PrintingPage extends React.Component {
    render() {
      return (
        <div className={clsx(classes.printPage)}>
          <div style={{ float: 'left' }}>
            <Typography className={clsx(classes.printPageKey)}>
              {testing.dependent_id
                ?
                `${testing.dependent_id.first_name}, ${testing.dependent_id.last_name}`
                :
                `${user.last_name}, ${user.first_name}`
              }
            </Typography>
          </div>
          <div style={{ float: 'right' }}>
            <Typography className={clsx(classes.printPageKey)}>
              {'Date: '} <span style={{ fontWeight: 100 }}>{moment().format('MM/DD/YYYY')}</span>
            </Typography>
          </div>
          <br />
          <hr style={{ border: 'solid 1px #000', margin: '12px auto' }} />
          <div style={{ float: 'left' }}>
            <Typography className={clsx(classes.printPageKey)}>
              {'DOB: '}
              <span style={{ fontWeight: 100 }}>
                {testing.dependent_id
                  ?
                  moment.utc(testing.dependent_id.dob).format('MM/DD/YYYY')
                  :
                  moment.utc(user.dob).format('MM/DD/YYYY')
                }
              </span>
            </Typography>
            <Typography className={clsx(classes.printPageKey)}>
              {'Dose 1: '} <span style={{ fontWeight: 100 }}>{'Covid - 19'}</span>
            </Typography>
            <Typography className={clsx(classes.printPageKey)}>
              {'Mfr: '} <span style={{ fontWeight: 100 }}>{formState.vaccine_type}</span>
            </Typography>
            <Typography className={clsx(classes.printPageKey)}>
              {'Lot#: '} <span style={{ fontWeight: 100 }}>{formState.lot_number}</span>
            </Typography>
            <Typography className={clsx(classes.printPageKey)}>
              {'Loc: '} <span style={{ fontWeight: 100 }}>{user.location_id.name}</span>
            </Typography>
            <Typography className={clsx(classes.printPageKey)}>
              {'Provider: '} <span style={{ fontWeight: 100 }}>{user.location_id.provider ? `${user.location_id.provider.last_name} ${user.location_id.provider.first_name}` : ''}</span>
            </Typography>
            <Typography className={clsx(classes.printPageKey)}>
              {'Next Appointment: '} <span style={{ fontWeight: 100 }}>{''}</span>
            </Typography>
          </div>
          <div style={{ float: 'right', textAlign: 'center' }}>
            <QRCode
              value={testing.testkit_id}
              size={170}
            />
            <br />
            <Typography className={clsx(classes.printPageKey)}>
              {testing.testkit_id}
            </Typography>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <img src="/images/svg/status/users_icon.svg" alt="" />
          {testing.dependent_id
            ?
            <span>{testing.dependent_id.first_name}, {testing.dependent_id.last_name}</span>
            :
            <span>{user.last_name}, {user.first_name}</span>
          }
          {' | '}
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>Vaccine Eligibility</Typography>
      </div>

      <Grid container >
        <Grid item xs={12} className="text-left d-flex">
          <LineStepProgressBar activeIndex={step} labels={labelArray} totalCount={3} />
        </Grid>
      </Grid>

      {step === 0 && (
        <Grid container justify="center" alignItems="center">
          <Grid item lg={2} xs={12}>
            <Typography variant="h6" className={classes.heading} style={{ marginLeft: '50px' }}> {step0Page} of 2 pages</Typography>
          </Grid>
          <Grid item lg={8} xs={12}>
            {step0Page === 1 && (
              <Typography variant="h6" className={classes.heading}>{'Have you had or have any of these symptoms in the last 10 days?'}</Typography>
            )}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          {step0Page === 1 && (
            <>
              <Grid item xs={8}>
                <Grid container>
                  {formState.covid_19_screening.slice(0, 8).map((value, index) => (
                    <Grid item lg={6} xs={12} key={index}>
                      <BlueBox class={classes.box} >
                        <CheckCircleButton
                          checked={value.checked}
                          label={value.question}
                          name={value.index}
                          onChange={handleSymptomsChange(index)}
                        />
                      </BlueBox>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={2}></Grid>
              {formState.covid_19_screening.slice(8, 12).map((value, index) => (
                <Grid item container xs={12} direction="row" justify="flex-start" alignItems="center" key={index}>
                  <Grid container justify="flex-start" alignItems="center">
                    <Grid item xs={8} >
                      <Typography variant="h6" style={{ marginLeft: '50px' }}>{value.question}</Typography></Grid>
                    <Grid item xs={4}>
                      <RadioGroup
                        row
                        value={value.value}
                        onChange={handleSymptomsChange(index + 8)}
                      >
                        <RadioRoundCheckButton value="YES" label="Yes" labelPlacement="start" required={true} className={classes.radioRoot} />
                        <RadioRoundCheckButton value="NO" label="No" labelPlacement="start" required={true} className={classes.radioRoot} />
                      </RadioGroup>
                    </Grid>
                    <Divider className={classes.divider} flexItem />
                  </Grid>
                </Grid>
              ))}
            </>
          )}
          {step0Page === 2 && (
            formState.other_screening.slice(0, 6).map((value, index) => (
              <Grid item container xs={12} direction="row" justify="flex-start" alignItems="center" key={index}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item xs={8} >
                    <Typography variant="h6" style={{ marginLeft: '50px' }}>{value.question}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <RadioGroup
                      row
                      value={value.value}
                      onChange={handleOthersChange(index)}
                    >
                      <RadioRoundCheckButton value="YES" label="YES" labelPlacement="start" required={true} className={classes.radioRoot} />
                      <RadioRoundCheckButton value="NO" label="No" labelPlacement="start" required={true} className={classes.radioRoot} />
                    </RadioGroup>
                    {(value.unique_question_id === 'Epipen_Emergency_Treatment' && formState.other_screening[0].value === 'YES') && (
                      <Grid container direction="row" justify="center" alignitems="flex-end">
                        <TextField
                          type="text"
                          label=""
                          placeholder=""
                          className={brandClasses.shrinkTextField}
                          onChange={handleOthersChange(index + 6)}
                          value={formState.other_screening[6].value || ''}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          style={{ width: '50%' }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Divider className={classes.divider} flexItem />
                </Grid>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {step === 1 && (
        <Grid container spacing={3} style={{ paddingTop: 50 }}>
          <Grid item md={4}>
            <FormControl
              className={brandClasses.shrinkTextField}
              required
              fullWidth
              variant="outlined"
            >
              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Vaccine Type</InputLabel>
              <Select
                onChange={handleChange}
                label="Vaccine Type"
                name="vaccine_type"
                displayEmpty
                required
                value={formState.vaccine_type || ''}
              >
                <MenuItem value=''>
                  <Typography className={brandClasses.selectPlaceholder}>Select vaccine type</Typography>
                </MenuItem>
                {getVaccineProtocols.filter(v => v !== 'None').map((value, indx) => (
                  <MenuItem key={indx} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl
              className={brandClasses.shrinkTextField}
              required
              fullWidth
              variant="outlined"
            >
              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Vaccine Location</InputLabel>
              <Select
                onChange={handleChange}
                label="Vaccine Location "
                name="vaccine_location"
                displayEmpty
                required
                value={formState.vaccine_location || ''}
              >
                <MenuItem value=''>
                  <Typography className={brandClasses.selectPlaceholder}>Select vaccine location</Typography>
                </MenuItem>
                {getVaccineLocation.map((value, indx) => (
                  <MenuItem key={indx} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <TextField
              type="number"
              label="Lot Number"
              placeholder="Enter Lot Number"
              name="lot_number"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.lot_number || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
      )}

      {step === 2 && (
        <Grid container direction="column" justify="center" alignitems="center">
          <Grid container direction="row" justify="center" alignitems="center">
            <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '20px' }}>
              We need the patient and technician’s signatures for consent to administer the shot.
            </Typography>
          </Grid>
          <Grid container direction="row" justify="center" alignitems="center">
            <div className={classes.signatureBox}>
              <Typography variant="h5" className={brandClasses.signBoxTitle}> Patient Signature </Typography>
              <Typography variant="h5" className={brandClasses.signBoxDesc}>Patient sign here</Typography>
              {testing.patient_signature
                ?
                <img src={apiUrl + testing.patient_signature} alt="img" />
                :
                <SignaturePad
                  penColor='#0F84A9'
                  canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
                  // canvasProps={{ className: brandClasses.sigPad }}
                  clearOnResize={false}
                  ref={(ref) => { patientSigPad = ref }}
                  onEnd={checkPatientSig}
                />
              }
              <Grid container direction="row" alignitems="center">
                <Grid item xs={8}>
                  <Typography variant="h6">All medical information is encrypted and private</Typography></Grid>
                <Grid item xs={4}>
                  {!testing.patient_signature && (
                    <Button
                      className={clsx(brandClasses.button, brandClasses.whiteButton)}
                      style={{ margin: 'auto', float: 'right' }}
                      onClick={patientSigClear}
                    >
                      {'Clear Signature'}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '20px' }}>
            <Typography variant="h6" style={{ fontSize: '10px' }}>
              You will be notified of your test results 24-48 hours on the<br></br> TESTD | ID app or via email.
            </Typography>&ensp;
            <FormControlLabel
              control={<Checkbox onChange={handleChange} name="is_guardian_signature" checked={formState.is_guardian_signature || false} />}
              label="Guardian signature"
              className={classes.dialogCheckbox}
            />
          </Grid>

          <Grid container direction="row" justify="center" alignitems="center" style={{ marginTop: '10px', marginBottom: '20px' }}>
            <div className={classes.signatureBox}>
              <Typography variant="h5" className={brandClasses.signBoxTitle}> Medical Technician</Typography>
              <Typography variant="h5" className={brandClasses.signBoxDesc}>Medical Technician sign here</Typography>
              {testing.medical_technician
                ?
                <img src={apiUrl + testing.medical_technician} alt="img" />
                :
                <SignaturePad
                  penColor='#0F84A9'
                  canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
                  // canvasProps={{ className: brandClasses.sigPad }}
                  clearOnResize={false}
                  ref={(ref) => { medicalSigPad = ref }}
                  onEnd={checkPatientSig}
                />
              }
              <Grid container direction="row" alignitems="center">
                <Grid item xs={8}>
                  <Typography variant="h6">All medical information is encrypted and private</Typography></Grid>
                <Grid item xs={4}>
                  {!testing.medical_technician && (
                    <Button
                      className={clsx(brandClasses.button, brandClasses.whiteButton)}
                      style={{ margin: 'auto', float: 'right' }}
                      onClick={medicalSigClear}
                    >
                      {'Clear Signature'}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      )}

      {/* <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      > <div className={brandClasses.footerButton} style={{ marginBottom: 10 }}>
          {step0Page !== 1 ?
            <Button className={clsx(classes.nextbutton, brandClasses.whiteButton)} onClick={onStepBack}>
              BACK</Button> : ''}  &ensp;
          <Button className={classes.nextbutton} classes={{ disabled: brandClasses.buttonDisabled }} type="submit" onClick={onStepChange}
            disabled={disablenext}
          >NEXT</Button>
        </div>
      </Grid> */}

      <div className={brandClasses.footerButton}>
        <Grid>
          {displayError ? <Alert severity="error">{displayError}</Alert> : null}
          <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              {step0Page !== 1 &&
                <Button
                  className={clsx(brandClasses.button, brandClasses.whiteButton)}
                  onClick={onStepBack}
                >
                  {'BACK'}
                </Button>
              }
            </Grid>
            <Grid item>
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={saveLoading || disablenext}
                onClick={onStepChange}
              >
                {'NEXT'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={showDialog}
        onClose={closeDialog}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>
          <Grid container direction="row" justify="center" alignitems="center">
            <Typography variant="h2" className={classes.dialogHeader}>
              {'Label Printed '}
            </Typography>
          </Grid>
          <Grid container direction="row" justify="center" alignitems="center">
            <Typography variant="h4" style={{ color: '#043B5D' }}>
              {'Please Check'}
            </Typography>
          </Grid>
          <Grid container direction="row" justify="center" alignitems="center">
            <Typography variant="h6" >
              {'Is the label legible?'}
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container direction="row" justify="center" alignitems="center" spacing={3}>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {'PATIENT NAME:'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {testing.dependent_id
                  ?
                  <span>{testing.dependent_id.first_name}, {testing.dependent_id.last_name}</span>
                  :
                  <span>{user.last_name}, {user.first_name}</span>
                }
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {'LABEL FOR'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {formState.vaccine_type} {type}
              </Typography>
            </Grid>
            <Divider className={classes.divider} style={{ margin: '5px auto' }} flexItem={true} />
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Typography variant="h6" >
                {'SESSION ID'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {testing.test_session_id}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {'VACCINE ID'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {testing.testkit_id}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} container direction="row" justify="flex-start" alignItems="center" style={{ marginTop: '10px' }}>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={8} >
                <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>
                  {'Did you ask the patient all pre-vaccine health screening questions?'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <RadioGroup
                  value={formState.health_screening_questions_asked || ''}
                  onChange={handleChange}
                  name="health_screening_questions_asked"
                  style={{ flexDirection: 'unset' }}
                >
                  <RadioCheckButton label='Yes' value='Yes' required={true} />
                  <RadioCheckButton label='No' value='No' required={true} />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={8} >
                <Typography variant="h6" style={{ color: '#043B5D', textAlign: 'right', marginRight: '10px' }}>
                  {'Does the patient have a smart phone?'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <RadioGroup
                  value={formState.have_smart_phone || ''}
                  onChange={handleChange}
                  name="have_smart_phone"
                  style={{ flexDirection: 'unset' }}
                >
                  <RadioCheckButton label='Yes' value='Yes' required={true} />
                  <RadioCheckButton label='No' value='No' required={true} />
                </RadioGroup>
              </Grid>
            </Grid>
            {formState.have_smart_phone === 'Yes' && (
              <>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item xs={8} >
                    <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>
                      {'1. Check this the correct email and cell phone number for this patient? '}
                      <br></br>
                    </Typography>
                    <Typography variant="h6" style={{ color: '#043B5D', textAlign: 'right', marginRight: '10px' }}>
                      {user.email}
                    </Typography>
                    <Typography variant="h6" style={{ color: '#043B5D', textAlign: 'right', marginRight: '10px' }}>
                      {user.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <RadioGroup
                      value={formState.correct_email_phone || ''}
                      onChange={handleChange}
                      name="correct_email_phone"
                      style={{ flexDirection: 'unset' }}
                    >
                      <RadioCheckButton label='Yes' value='Yes' required={true} />
                      <RadioCheckButton label='No' value='No' required={true} />
                    </RadioGroup>
                  </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item xs={8} >
                    <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>
                      {'2. Inform them that they will receive a text and/or email with the official details to their 2nd appointment?'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <RadioGroup
                      value={formState.inform_receive_email_sms || ''}
                      onChange={handleChange}
                      name="inform_receive_email_sms"
                      style={{ flexDirection: 'unset' }}
                    >
                      <RadioCheckButton label='Yes' value='Yes' required={true} />
                      <RadioCheckButton label='No' value='No' required={true} />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          <Grid container direction="row" justify="flex-end" alignitems="flex-end" style={{ paddingRight: '20px' }}>
            {displaySuccess ? <Alert severity="success">{displaySuccess}</Alert> : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <div className={brandClasses.footerButton} style={{ marginBottom: 10 }}>
              <Button
                onClick={handleReprint}
                className={brandClasses.blueBtn}
                color="primary"
              >
                REPRINT
              </Button> &ensp;
              <Button
                className={classes.nextbutton}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={saveLoading}
                // type="submit"
                onClick={handleComplete}
              >
                {'COMPLETE'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </div>
          </Grid>
        </DialogActions>
      </Dialog>

      {/* <PrintingPage ref={componentRef} /> */}
      {isPrinting &&
        <div className={classes.printRoot}>
          <PrintingPage ref={componentRef} />
        </div>
      }
    </div >
  )
};

VaccineTracker.propTypes = {
  getPatient: PropTypes.func.isRequired,
  upsertPatient: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  updateUserTesting: PropTypes.func.isRequired,
};

export default connect(null, { getPatient, upsertPatient, uploadImage, updateUserTesting })(VaccineTracker);