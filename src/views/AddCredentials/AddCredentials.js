import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import * as md5 from 'md5';
import brandStyles from 'theme/brand';
import { login, addCredential } from 'actions/api';
import { clearErrors } from 'actions/error';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
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
  contactAdmin: {
    float: 'right',
  },
}));

const AddCredentials = props => {
  const { history } = props;

  // styles
  const classes = useStyles();
  const brandClasses = brandStyles();

  // hooks
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const clearErrors = () => {
    setApiError(null);
  }

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  }

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

  const handleSubmit = event => {
    event.preventDefault();
    setFormState(formState => ({
      ...formState,
      touched: {
        email:true,
        username: true,
        password: true
      }
    }));
    if (formState.isValid) {
      clearErrors(null);
      closeSuccessMessage(null);
      setLoading(true);
      let body = {
        email: formState.values.email,
        username: formState.values.username,
        password: md5(formState.values.password)
      };
      addCredential(body).then(res => {
        setLoading(false);
        if (res.data.success) {
          setDisplaySuccess(res.data.message);
          setTimeout(() => {
            history.push('/logon');
          }, 2000);
        } else {
          setApiError(res.data.message);
        }
      }).catch(error => {
        setLoading(false);
        setApiError(error.response ? error.response.data.message : error.message);
      });
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
                onSubmit={handleSubmit}
              >
                <Typography
                  className={clsx(classes.title, brandClasses.brandText)}
                  variant="h2"
                >
                  Add Credentials
                </Typography>

                <Box className={clsx(classes.box, brandClasses.logonBox)}>
                  <Typography
                    className={clsx(classes.inputHeader, brandClasses.brandDarkText)}
                    variant="h5"
                  >
                    Registered Email
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
                    type="text"
                    value={formState.values.email || ''}
                    variant="outlined"
                  />

                  <Typography
                    className={clsx(classes.inputHeader, brandClasses.brandDarkText)}
                    variant="h5"
                  >
                    Username
                  </Typography>
                  <TextField
                    className={clsx(classes.textField, brandClasses.textField)}
                    error={hasError('username')}
                    fullWidth
                    helperText={
                      hasError('username') ? formState.errors.username[0] : null
                    }
                    // label="Username"
                    placeholder="Type your username"
                    name="username"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.username || ''}
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
                    className={clsx(classes.contactAdmin, brandClasses.brandGrayText)}
                    variant="h6"
                  >
                    Not registered? Contact Administrator.
                  </Link>

                  <Box p={1}></Box>

                  <Button
                    className={clsx(classes.logonButton, brandClasses.loginButton)}
                    classes={{ disabled: classes.logonButtonDisabled }}
                    disabled={loading}
                    type="submit"
                  >
                    Submit {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </Button>

                  {apiError ? <Alert severity="error" onClose={clearErrors}>{apiError}</Alert> : null}
                  {displaySuccess ? <Alert severity="success" onClose={closeSuccessMessage}>{displaySuccess}</Alert> : null}
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
  error: state.error
});

AddCredentials.propTypes = {
  history: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { login, clearErrors })(withRouter(AddCredentials));
