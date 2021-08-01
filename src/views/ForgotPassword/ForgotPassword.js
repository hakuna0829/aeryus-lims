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
  Typography,
  CircularProgress
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { forgotPassword } from 'actions/api';
import { clearErrors } from 'actions/error';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  confirm_email: {
    presence: { allowEmpty: false, message: 'is required' },
    equality: 'email'
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
  addCredential: {
    position: 'absolute',
    marginTop: theme.spacing(1)
  },
}));

const Forgot = props => {
  const { forgotPassword, history, error, clearErrors, modules } = props;

  // styles
  const classes = useStyles();
  const brandClasses = brandStyles();

  // hooks
  const [loading, setLoading] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [formState, setFormState] = useState({
    isValid: false,
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
  }, [formState.values, error, history, modules]);



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
  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  }

  const handleLogon = async event => {
    event.preventDefault();
    setFormState(formState => ({
      ...formState,
      touched: {
        email: true,
        confirm_email: true
      }
    }));
    if (formState.isValid) {
      setLoading(true);
      clearErrors();
      let body = {
        email: formState.values.email
      };
      let res = await forgotPassword(body);
      setLoading(false);
      if (res.success) {
        setDisplaySuccess(res.message);
        setFormState(formState => ({
          ...formState,
          isValid: false,
          values: {},
          touched: {},
          errors: {}
        }));
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
                  FORGOT PASSWORD
                </Typography>

                <Box className={clsx(classes.box, brandClasses.logonBox)}>
                  <Typography className={classes.title}
                    variant="h6">
                    enter your email address below and we'll send you instructions on how to change password
                  </Typography>
                  <Typography></Typography>
                  <TextField
                    label="Email"
                    placeholder="Enter email"
                    name="email"
                    className={brandClasses.shrinkTextField}
                    error={hasError('email')}
                    required
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    helperText={
                      hasError('email') ? formState.errors.email[0] : null
                    }
                    onChange={handleChange}
                    type="email"
                    value={formState.values.email || ''}
                    variant="outlined"
                  />

                  <br /><br />
                  <TextField
                    label="Confirm Email"
                    placeholder="Confirm email address"
                    name="confirm_email"
                    className={brandClasses.shrinkTextField}
                    error={hasError('confirm_email')}
                    required
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    helperText={
                      hasError('confirm_email') ? formState.errors.confirm_email[0] : null
                    }
                    onChange={handleChange}
                    type="email"
                    value={formState.values.confirm_email || ''}
                    variant="outlined"
                  />


                  <Box p={1}></Box>

                  <Button
                    className={clsx(classes.logonButton, brandClasses.loginButton)}
                    classes={{ disabled: classes.logonButtonDisabled }}
                    disabled={loading}
                    type="submit"
                  >
                    SEND {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </Button>

                  {error.message ? <Alert severity="error" onClose={() => { clearErrors() }}>{error.message}</Alert> : null}
                  {displaySuccess ? <Alert severity="success" onClose={closeSuccessMessage}>{displaySuccess}</Alert> : null}

                </Box>
                {/* <Typography
                  className={clsx(classes.title, brandClasses.brandText)}
                  variant="h6"
                >
                   Don't have a log-in?
                </Typography>
                <Typography  className={clsx(classes.title, brandClasses.brandText)}
                  variant="h6">
                <Link
                    className={classes.addCredential}
                    component={RouterLink}
                    to="/add-credentials"
                    variant="h6"
                    
                  >
                    Sign up
                  </Link></Typography> */}
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

Forgot.propTypes = {
  history: PropTypes.object,
  forgotPassword: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired
};

export default connect(mapStateToProps, { forgotPassword, clearErrors })(withRouter(Forgot));