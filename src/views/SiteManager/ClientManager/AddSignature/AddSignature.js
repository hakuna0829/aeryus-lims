import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  Typography, CircularProgress
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { getLocationSignature, addLocationSignature, apiUrl, uploadLocationSignature } from 'actions/api';
import SignaturePad from 'react-signature-canvas';
import dataURLtoBlob from 'blueimp-canvas-to-blob';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.white,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  logoContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  logo: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/svg/splash_bg_new.svg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentBody: {
    margin: 'auto',
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 50,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    fontWeight: '600',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  inputHeader: {
    fontWeight: '600',
  },
  textField: {
    marginBottom: theme.spacing(2)
  },
  box: {
    padding: 40
  },
  logonButton: {
    width: '150px',
    height: '35px',
    fontWeight: '600',
    display: 'flex',
    margin: 'auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  logonButtonDisabled: {
    backgroundColor: theme.palette.white,
    border: `1.5px solid ${theme.palette.brand}`
  },
  forgotPassword: {
    float: 'right',
  },
  addCredential: {
    position: 'absolute',
    marginTop: theme.spacing(1)
  },
}));

let providerSigPad = {};

const AddSignature = props => {
  const { getLocationSignature, uploadLocationSignature, addLocationSignature } = props;

  // styles
  const classes = useStyles();
  const brandClasses = brandStyles();
  // hooks
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({ 'signature': '' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const locationId = props.match.params.location_id;
  const token = props.match.params.token;

  useEffect(() => {
    if (locationId) {
      async function fetchData() {
        const res = await getLocationSignature(locationId, token);
        if (res.success) {
          if (res.data) {
            setFormState(formState => ({ ...formState, ...res.data }));
          }
        }
      }
      fetchData();
    }
  }, [locationId, successMsg, token, getLocationSignature]);

  const providerSigClear = () => {
    providerSigPad.clear();
  };

  const handleLogon = async event => {
    event.preventDefault();
    setLoading(true);
    if (!providerSigPad.isEmpty()) {
      let providerSigFormData = new FormData();
      let providerSigBlob = dataURLtoBlob(providerSigPad.getTrimmedCanvas().toDataURL('image/png'));
      providerSigFormData.append('uploadImage', providerSigBlob, 'provider-signature.png');
      const resProviderSig = await uploadLocationSignature(token, providerSigFormData);
      if (resProviderSig.success) {
        formState.signature = '/images/' + resProviderSig.data;
        const res = await addLocationSignature(locationId, token, formState);
        if (res.success) {
          setLoading(false);
          setSuccessMsg('Signature Added Sucessfully');
        }
      } else {
        setLoading(false);
      }
    } else {
      setErrorMsg('Please Add Signature');
      setLoading(false);
    }
  };

  const closeSuccessMessage = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.logoContainer}
          item
          lg={6}
        >
          <div className={classes.logo}></div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleLogon}
              >
                <Typography
                  className={clsx(classes.title, brandClasses.brandText)}
                  variant="h2"
                >
                  ADD SIGNATURE
                </Typography>

                <Grid item xs={12} >
                  <div className={brandClasses.signBoxContanier}>
                    {!formState.signature
                      ?
                      <>
                        <Typography variant="h5" className={brandClasses.signBoxTitle}> Provider Signature </Typography>
                        <Typography variant="h5" className={brandClasses.signBoxDesc}>Provider sign here</Typography>

                        <SignaturePad
                          canvasProps={{ className: brandClasses.sigPad }}
                          clearOnResize={false}
                          ref={(ref) => { providerSigPad = ref }}
                        />
                        <Button
                          className={clsx(brandClasses.button, brandClasses.whiteButton)}
                          style={{ margin: 'auto' }}
                          onClick={providerSigClear}
                        >
                          {'Clear Signature'}
                        </Button>
                        <Button
                          className={clsx(classes.logonButton, brandClasses.loginButton)}
                          classes={{ disabled: classes.logonButtonDisabled }}
                          disabled={loading}
                          type="submit"
                        >
                          SEND {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                        </Button>
                      </>
                      :
                      <>
                        <img src={apiUrl + formState.signature} alt="img" />
                      </>
                    }
                  </div>
                  {errorMsg ? <Alert severity="error" onClose={closeSuccessMessage}>{errorMsg}</Alert> : null}
                  {successMsg ? <Alert severity="success" onClose={closeSuccessMessage}>{successMsg}</Alert> : null}
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
      </Grid >
    </div >
  );
};

const mapStateToProps = state => ({
  error: state.error,
  modules: state.auth.modules,
});

AddSignature.propTypes = {
  history: PropTypes.object,
  getLocationSignature: PropTypes.func.isRequired,
  addLocationSignature: PropTypes.func.isRequired,
  uploadLocationSignature: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getLocationSignature, addLocationSignature, uploadLocationSignature })(withRouter(AddSignature));