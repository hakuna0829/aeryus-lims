import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, CircularProgress, RadioGroup } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import moment from "moment";
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import LineStepProgressBar from "components/LineStepProgressBar";
import SignaturePad from 'react-signature-canvas';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import RadioCheckButton from 'components/RadioCheckButton';
import { apiUrl, uploadImage, updateUserTesting, clientServer } from 'actions/api';

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
    width: '50%',
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
  // checklist
  gridItem: {
    margin: '55px 0'
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right",
    marginRight: 20
  },
  // print
  printRoot: {
    paddingTop: 400
  },
  printPage: {
    padding: 1,
    paddingTop: 22,
  },
  printPageDiv: {
    float: 'left',
    textAlign: 'left',
    paddingLeft: 1
  },
  printPageKey: {
    color: theme.palette.black,
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 'inherit',
  },
  printPageValue: {
    color: theme.palette.black,
    fontSize: 28,
  }
}));

let patientSigPad = {};
let medicalSigPad = {};
const labelArray = ['Patient Approval', 'Checklist'];

const TestTracker = (props) => {
  const { user, testing, setTesting, type, uploadImage, updateUserTesting } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const componentRef = useRef();

  const history = useHistory();

  const [step, setStep] = useState(0);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formState, setFormState] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [disablenext, setDisableNext] = useState(true);

  useEffect(() => {
    if (testing.patient_signature && testing.medical_technician) {
      setDisableNext(false);
      setFormState({ is_guardian_signature: testing.is_guardian_signature });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (formState.specimen_taken === 'Yes' && formState.test_ready === 'Yes') {
      setDisableNext(false);
    } else if (formState.specimen_taken === 'No' || formState.test_ready === 'No') {
      setDisableNext(true);
    }
    // eslint-disable-next-line
  }, [formState]);

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

  const onStepBack = () => {
    setStep(step => step - 1);
    setDisableNext(false);
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

  const onStepChange = () => {
    if (step === 0) {
      handleApprovalNext();
      setDisableNext(true);
    } else {
      // print label
      setIsPrinting(true);
      // 500 ms to load barcode
      setTimeout(() => {
        printQR();
        // 1 sec to load printer option
        setTimeout(() => {
          // setIsPrinting(false);
          setShowDialog(true);
        }, 1000);
      }, 500);
    }
  };

  const printQR = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleApprovalNext = async () => {
    if (testing.patient_signature && testing.medical_technician) {
      setStep(step => step + 1);
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
          setStep(step => step + 1);
        else
          setDisplayError('Please make Patient and Medical Technician Signature.');
      }
    }
  };

  const handleComplete = () => {
    updateTesting({
      completed: true,
      is_guardian_signature: formState.is_guardian_signature ? true : false
    });
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
      if (step === 0)
        setStep(step => step + 1);
      else {
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
          <div className={clsx(classes.printPageDiv)}>
            <Typography className={clsx(classes.printPageKey)}>
              {'Patient: '}
              {testing.dependent_id
                ?
                <span style={{ fontWeight: 100 }}>
                  {testing.dependent_id.first_name}, {testing.dependent_id.last_name}
                </span>
                :
                <span style={{ fontWeight: 100 }}>
                  {user.last_name}, {user.first_name}
                </span>
              }
              {' | '}
              <br />
              {'DOB: '}
              <span style={{ fontWeight: 100 }}>
                {testing.dependent_id
                  ?
                  moment.utc(testing.dependent_id.dob).format('MM/DD/YYYY')
                  :
                  moment.utc(user.dob).format('MM/DD/YYYY')
                }
              </span>
              {' | '}
              {'DOS: '} <span style={{ fontWeight: 100 }}>{moment().format('MM/DD/YYYY')}</span>
            </Typography>
            <Barcode
              value={testing.testkit_id}
              font={'Montserrat'}
              width={2}
              height={85}
              fontSize={20}
            // marginLeft={10}
            />
          </div>
        </div>
      );
    }
  }

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
        <Typography variant="h4" className={classes.headerSubTitle}>Patient approval</Typography>
      </div>

      <Grid container >
        <Grid item xs={12}>
          <LineStepProgressBar activeIndex={step} labels={labelArray} totalCount={2} />
        </Grid>
      </Grid>

      {step === 0 && (
        <Grid container direction="column" justify="center" alignitems="center">
          <Grid container direction="row" justify="center" alignitems="center">
            <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '20px' }}>
              We need the patient and technician’s signatures for consent to administer the {type} Test
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

      {step === 1 && (
        <Grid container direction="column" justify="center" alignitems='center'>
          <Grid container direction="row" justify="center" alignitems="center" spacing={3}>
            <Grid item xs={3}></Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
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
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {'LABEL FOR'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {type}
              </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
          <Divider className={classes.divider} style={{ margin: '5px auto' }} flexItem={true} />
          <Grid container direction="row" justify="center" alignitems="center" spacing={3} >
            <Grid item xs={3}></Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography variant="h6" >
                {'SESSION ID'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {testing.test_session_id}
              </Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {'TEST KIT ID'}
              </Typography>
              <Typography variant="h6" style={{ color: '#043B5D' }}>
                {testing.testkit_id}
              </Typography>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>

          <Grid container>
            <Grid item lg={9} md={9} sm={10} className={classes.gridItem}>
              <div className={classes.radioGroup}>
                <Typography variant="h5" className={classes.label}>
                  {'Specimen taken?'}
                </Typography>
                <RadioGroup
                  value={formState.specimen_taken || ''}
                  onChange={handleChange}
                  name="specimen_taken"
                  style={{ flexDirection: 'unset' }}
                >
                  <RadioCheckButton label='Yes' value='Yes' required={true} />
                  <RadioCheckButton label='No' value='No' required={true} />
                </RadioGroup>
              </div>
              <div className={classes.radioGroup}>
                <Typography variant="h5" className={classes.label}>
                  {'Is test in package ready to send to the lab?'}
                </Typography>
                <RadioGroup
                  value={formState.test_ready || ''}
                  onChange={handleChange}
                  name="test_ready"
                  style={{ flexDirection: 'unset' }}
                >
                  <RadioCheckButton label='Yes' value='Yes' required={true} />
                  <RadioCheckButton label='No' value='No' required={true} />
                </RadioGroup>
              </div>
            </Grid>
          </Grid>

          {/* <Grid container xs={12} direction="row" justify="flex-start" alignItems="center" style={{ marginTop: '10px' }}>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={6} >
                <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>{'Specimen taken'}</Typography></Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox onChange={handleChange} name="specimen_taken_yes" checked={formState.specimen_taken_yes} />}
                  label="Yes"
                  className={classes.dialogCheckbox}
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleChange} name="specimen_taken_no" checked={formState.specimen_taken_no} />}
                  label="no"
                  className={classes.dialogCheckbox}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={6} >
                <Typography variant="h6" style={{ textAlign: 'right', marginRight: '10px' }}>{'Is test in package ready to send to the lab?'}</Typography></Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox onChange={handleChange} name="package_readyto_send_yes" checked={formState.package_readyto_send_yes} />}
                  label="Yes"
                  className={classes.dialogCheckbox}
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleChange} name="package_readyto_send_no" checked={formState.package_readyto_send_no} />}
                  label="no"
                  className={classes.dialogCheckbox}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Grid> */}
        </Grid>
      )}

      <div className={brandClasses.footerButton}>
        <Grid>
          {displayError ? <Alert severity="error">{displayError}</Alert> : null}
          <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={onStepBack}
              >
                {'BACK'}
              </Button>
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

      {/* <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <div className={brandClasses.footerButton} style={{ marginBottom: 10 }}>
          {step !== 0 && (
            <Button
              className={clsx(classes.nextbutton, brandClasses.whiteButton)}
              onClick={onStepBack}
            >
              BACK
            </Button>
          )}
          &ensp;
          <Button
            className={classes.nextbutton}
            classes={{ disabled: brandClasses.buttonDisabled }}
            type="submit"
            onClick={onStepChange}
            disabled={disablenext}
          >
            NEXT
          </Button>
        </div>
      </Grid> */}

      <Dialog
        open={showDialog}
        onClose={closeDialog}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>
        </DialogTitle>
        <DialogContent>
          <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
            <Typography variant="h2" style={{ color: '#25DD83' }}>
              {'Success'}&ensp;
            </Typography>
            <img src="/images/svg/status/check_green.svg" alt="" style={{ width: '5%' }} />
          </Grid>
          <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
            <Typography variant="h4" style={{ color: '#043B5D' }}>
              Double check these items below:
            </Typography>
          </Grid>
          <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
            <Typography variant="h5" >
              • Did you label the specimen?
            </Typography>
          </Grid>
          <Grid container direction="row" justify="center" alignitems="center" style={{ marginBottom: '10px' }}>
            <Typography variant="h5" >
              • Is the test label legible?
            </Typography>
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
    </div>
  )
}

TestTracker.propTypes = {
  testing: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  updateUserTesting: PropTypes.func.isRequired,
}

export default connect(null, { uploadImage, updateUserTesting })(TestTracker);