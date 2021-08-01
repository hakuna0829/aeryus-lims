import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Grid,
  Button,
  TextField,
  Link,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import ReCAPTCHA from "react-google-recaptcha";
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import * as md5 from 'md5';
import brandStyles from 'theme/brand';
import { login, reCaptchaSiteKey } from 'actions/api';
import { clearErrors } from 'actions/error';
import pages from 'NavItems';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

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
  captchaError: {
    color: theme.palette.brandRed,
    paddingTop: 20
  },
  addCredential: {
    position: 'absolute',
    marginTop: theme.spacing(1)
  },
}));

const Logon = props => {
  const { login, history, isAuthenticated, promptWelcome, error, clearErrors, modules } = props;

  // styles
  const classes = useStyles();
  const brandClasses = brandStyles();
  // Ref
  const recaptchaRef = useRef();

  // hooks
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    captchaVerified: false,
    captchaError: null,
    values: {},
    touched: {},
    errors: {}
  });

  // on component changes
  useEffect(() => {
    const errors = validate(formState.values, schema);
    // check errors on user entering keys
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
    // login success will update isAuthenticated value to true
    if (isAuthenticated) {
      if (promptWelcome) {
        history.push('/welcome');
      } else {
        let route = pages.find(page => page.module_name === modules[0].name);
        history.push(route.href ? route.href : route.children[0].href);
      }
    }
  }, [formState.values, isAuthenticated, promptWelcome, error, history, modules]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleReCaptchaChange = (value) => {
    setFormState(formState => ({
      ...formState,
      captchaVerified: true,
      captchaError: null,
      values: {
        ...formState.values,
        captcha_token: value
      },
    }));
  };

  const handleLogon = async event => {
    event.preventDefault();
    // mark as touched
    setFormState(formState => ({
      ...formState,
      touched: {
        email: true,
        password: true
      }
    }));
    // validate captcha
    if (!formState.captchaVerified) {
      setFormState(formState => ({
        ...formState,
        captchaError: 'Please enter captcha!',
      }));
      return;
    }
    // validate form
    if (formState.isValid) {
      setLoading(true);
      clearErrors();
      let body = {
        email: formState.values.email,
        password: md5(formState.values.password),
        captcha_token: formState.values.captcha_token,
      };
      let res = await login(body);
      setLoading(false);
      if (!res.success) {
        recaptchaRef.current.reset();
      }
    }
  };

  const hasError = field => formState.touched[field] && formState.errors[field] ? true : false;

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
                  LOGON
                </Typography>

                <Box className={clsx(classes.box, brandClasses.logonBox)}>
                  <Typography
                    className={clsx(classes.inputHeader, brandClasses.brandDarkText)}
                    variant="h5"
                  >
                    Email
                  </Typography>
                  <TextField
                    className={clsx(classes.textField, brandClasses.textField)}
                    error={hasError('email')}
                    fullWidth
                    helperText={
                      hasError('email') ? formState.errors.email[0] : null
                    }
                    placeholder="Type your email"
                    name="email"
                    onChange={handleChange}
                    type="email"
                    value={formState.values.email || ''}
                    variant="outlined"
                  />

                  <Typography
                    className={clsx(classes.inputHeader, brandClasses.brandDarkText)}
                    variant="h5"
                  >
                    Password
                  </Typography>
                  <TextField
                    className={brandClasses.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    placeholder="Type your password"
                    name="password"
                    onChange={handleChange}
                    value={formState.values.password || ''}
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Link
                    className={clsx(classes.forgotPassword, brandClasses.brandGrayText)}
                    component={RouterLink}
                    to="/forgot-password"
                    variant="h6"
                  >
                    Forgot password?
                  </Link>

                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={reCaptchaSiteKey || '123'}
                    onChange={handleReCaptchaChange}
                  />
                  {formState.captchaError && (
                    <Typography className={classes.captchaError} variant="h6">
                      {formState.captchaError}
                    </Typography>
                  )}

                  <Box p={1}></Box>

                  <Button
                    className={clsx(classes.logonButton, brandClasses.loginButton)}
                    classes={{ disabled: classes.logonButtonDisabled }}
                    disabled={loading}
                    type="submit"
                  >
                    LOGON {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </Button>

                  {error.message ? <Alert severity="error" onClose={() => { clearErrors() }}>{error.message}</Alert> : null}

                  <Link
                    className={classes.addCredential}
                    component={RouterLink}
                    to="/add-credentials"
                    variant="h6"
                    style={{ display: 'none' }}
                  >
                    Do not have Email or Password?
                  </Link>
                </Box>
              </form>
            </div>
          </div>
        </Grid>
      </Grid >
    </div >
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  promptWelcome: state.auth.promptWelcome,
  error: state.error,
  modules: state.auth.modules,
});

Logon.propTypes = {
  history: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  promptWelcome: PropTypes.bool,
  error: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired
};

export default connect(mapStateToProps, { login, clearErrors })(withRouter(Logon));
