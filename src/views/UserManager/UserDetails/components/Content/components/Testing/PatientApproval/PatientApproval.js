import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, CircularProgress } from '@material-ui/core';
import brandStyles from 'theme/brand';
// import { Print } from 'icons';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import SignaturePad from 'react-signature-canvas';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import { uploadImage, apiUrl, clientServer } from 'actions/api';

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
  gridBody: {
    marginTop: theme.spacing(4)
  },
  boxGrid: {
    paddingLeft: theme.spacing(2)
  },
  boxContanier: {
    // height: 218,
    width: '100%',
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
  boxContanier2: {
    marginTop: theme.spacing(4),
    '& img': {
      width: '100%'
    }
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
    // paddingTop: 180,
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  labelTitle: {
    color: theme.palette.brandDark,
    padding: theme.spacing(4),
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(8),
  },
  printLabel: {
    marginTop: theme.spacing(2),
    color: theme.palette.brandDark,
    fontWeight: 600,
    textAlign: 'center'
  },
  sigPad: {
    width: '100%',
    height: '100%'
  },
}));

let patientSigPad = {};
let medicalSigPad = {};

const PatientApproval = (props) => {
  const { testing, nextTab, previousTab, saveLoading, updateTesting, uploadImage } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const patientSigClear = () => {
    patientSigPad.clear();
  };

  const medicalSigclear = () => {
    medicalSigPad.clear()
  };

  const handleNext = async () => {
    if (testing.patient_signature && testing.medical_technician) {
      nextTab();
    } else {
      if (!patientSigPad.isEmpty() && !medicalSigPad.isEmpty()) {
        setLoading(true);
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
            updateTesting(body);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } else {
        if (clientServer === 'prod002' || clientServer === 'prod003')
          nextTab();
        else
          setDisplayError('Please make Patient and Medical Technician Signature.');
      }
    }
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <>
            <img src="/images/svg/status/users_icon.svg" alt="" />
            {'User Manager'} |
          </>
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>
          {'PATIENT APPROVAL TO BE TESTED'}
        </Typography>
      </div>

      <Grid
        container
        className={classes.gridBody}
      >
        <Grid item xs={12} sm={6}>
          <Grid container direction="column" justify="center" className={classes.boxGrid}>
            <div className={classes.boxContanier}>
              <Typography variant="h5" className={classes.boxTitle}> Patient Signature </Typography>
              <Typography variant="h5" className={classes.boxDesc}>Patient sign here</Typography>
              {testing.patient_signature
                ?
                <img src={apiUrl + testing.patient_signature} alt="img" />
                :
                <SignaturePad
                  canvasProps={{ className: classes.sigPad }}
                  clearOnResize={false}
                  ref={(ref) => { patientSigPad = ref }}
                />
              }
              <Typography className={classes.boxInnerText}>All medical information is encrypted and private</Typography>
            </div>
            {!testing.patient_signature && (
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={patientSigClear}
              >
                {'Clear Signature'}
              </Button>
            )}
            <div className={clsx(classes.boxContanier, classes.boxContanier2)}>
              <Typography variant="h5" className={classes.boxTitle}> Medical Technician </Typography>
              <Typography variant="h5" className={classes.boxDesc}>Medical technician sign here</Typography>
              {testing.medical_technician
                ?
                <img src={apiUrl + testing.medical_technician} alt="img" />
                :
                <SignaturePad
                  canvasProps={{ className: classes.sigPad }}
                  clearOnResize={false}
                  ref={(ref) => { medicalSigPad = ref }}
                />
              }
              <Typography className={classes.boxInnerText}>All medical information is encrypted and private</Typography>
            </div>
            {!testing.medical_technician && (
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={medicalSigclear}
              >
                {'Clear Signature'}
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" className={classes.labelTitle}>
            By signing this you give the medical technician permission to draw your blood for testing.
              <br></br><br></br>
            You will be notified of your test results 24-48 hours on the TESTD | ID app. Please make sure you download it.
            </Typography>
        </Grid>
      </Grid>

      <div className={classes.footer}>
        <Grid>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={previousTab}
              >
                {'BACK'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading || saveLoading}
                onClick={handleNext}
              >
                {'TRANSMIT'} {loading || saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>

    </div>
  );
};

PatientApproval.prototype = {
  nextTab: PropTypes.func.isRequired,
  previousTab: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  testing: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  updateTesting: PropTypes.func.isRequired,
};

export default connect(null, { uploadImage })(PatientApproval);
