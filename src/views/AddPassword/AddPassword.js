import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  LinearProgress
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import zxcvbn from 'zxcvbn';
import clsx from 'clsx';
import * as md5 from 'md5';
import brandStyles from 'theme/brand';
import { getAddPassword, addPassword } from 'actions/api';
import { clearErrors } from 'actions/error';
import CheckButton from 'components/CheckButton';

const schema = {
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    },
    format: {
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&^a-zA-Z0-9].{5,20}$",
      flags: "i",
      message: "should contain atleast one number,symbol,6-20 length"
    }
  },
  confirm_password: {
    presence: { allowEmpty: false, message: 'is required' },
    equality: "password"
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
    marginBottom: theme.spacing(3),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  passwordStrengthGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  passwordStrength: {
    color: theme.palette.brandGray,
    textAlign: 'center'
  },
  passwordTips: {
    color: theme.palette.brandDark,
    marginBottom: theme.spacing(3),
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
  termContainer:{
    display:'flex',
    alignItems:'center',
  },
  labelTerms: {
    fontSize: '14px',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    lineHeight: '21px',    
  },
  checkboxLabelRoot:{
    marginRight:'6px'
  }

}));

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.brandGray,
  },
  bar: props => ({
    borderRadius: 8,
    backgroundColor: props.score === 1 ? theme.palette.brandRed : props.score === 2 ? theme.palette.brandOrange : props.score === 3 ? theme.palette.brand : theme.palette.brandGreen
  }),
}))(LinearProgress);

const AddPassword = props => {
  const { history, getAddPassword, addPassword } = props;

  // styles
  const classes = useStyles();
  const brandClasses = brandStyles();

  // hooks
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isAccountValid, setIsAccountValid] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const accountId = props.match.params.id;

  useEffect(() => {
    if (accountId) {
      (async () => {
        let res = await getAddPassword(accountId);
        setFetchLoading(false);
        if (res.success) {
          setIsAccountValid(true);
        }
      })();
    } else {
      history.goBack();
    }
    // eslint-disable-next-line
  }, []);

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

  const goBack = () => {
    history.goBack();
  }

  const createPasswordLabel = (result) => {
    switch (result.score) {
      case 0:
        return 'Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Weak';
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setFormState(formState => ({
      ...formState,
      touched: {
        password: true,
        confirm_password: true,
      }
    }));
    if (formState.isValid) {
      clearErrors(null);
      closeSuccessMessage(null);
      setLoading(true);
      let body = {
        password: md5(formState.values.password)
      };
      let res = await addPassword(accountId, body);
      setLoading(false);
      if (res.success) {
        setDisplaySuccess(res.message);
        setTimeout(() => {
          history.push('/logon');
        }, 2000);
      }
    }
  };

  const hasError = field => formState.touched[field] && formState.errors[field] ? true : false;

  const testedResult = zxcvbn(formState.values.password || '');

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
              {fetchLoading
                ?
                <CircularProgress className={brandClasses.progressSpinner} />
                :
                isAccountValid ?
                  <form
                    className={classes.form}
                    onSubmit={handleSubmit}
                  >
                    <Box className={clsx(classes.box, brandClasses.logonBox)}>
                      <Typography
                        className={classes.title}
                        variant="h6"
                      >
                        Please create a secure password to finish <br />
                        setting up your dashboard account
                      </Typography>

                      <TextField
                        label="Create Password"
                        placeholder="Enter your password"
                        name="password"
                        className={brandClasses.shrinkTextField}
                        onChange={handleChange}
                        value={formState.values.password || ''}
                        required
                        fullWidth
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        error={hasError('password')}
                        helperText={
                          hasError('password') ? formState.errors.password[0] : null
                        }
                        type={showPassword ? "text" : "password"}
                        // eslint-disable-next-line
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        className={classes.passwordStrengthGrid}
                      >
                        <Grid item xs={3} sm={2}>
                          <Typography
                            className={classes.passwordStrength}
                          >
                            {createPasswordLabel(testedResult)}
                          </Typography>
                        </Grid>
                        <Grid item xs={8} sm={6}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={testedResult.score * 25}
                            score={testedResult.score}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}></Grid>
                      </Grid>

                      <Typography
                        className={classes.passwordTips}
                        variant="h6"
                      >
                        • Use 6-20 characters. <br />
                        • Use at least one number and symbol <br />
                        • Password is case sensitive <br />
                        • Avoid using the same password for multiple sites <br />
                      </Typography>

                      <TextField
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        name="confirm_password"
                        className={brandClasses.shrinkTextField}
                        onChange={handleChange}
                        value={formState.values.confirm_password || ''}
                        required
                        fullWidth
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        error={hasError('confirm_password')}
                        helperText={
                          hasError('confirm_password') ? formState.errors.confirm_password[0] : null
                        }
                        type={showPassword ? "text" : "password"}
                        // eslint-disable-next-line
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <br /><br />

                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <span className={classes.termContainer}>
                          <CheckButton
                            required={true}
                            // checked={formState.values.terms}
                            label={'I agree to'}
                            name={'terms'}
                            onChange={handleChange}
                            className={classes.checkboxLabelRoot}
                          />
                          <Link href="https://testd.com/Terms.html" className={classes.labelTerms} target="_blank">TESTD Terms</Link>
                        </span>
                        <Button
                          className={clsx(classes.logonButton, brandClasses.loginButton)}
                          classes={{ disabled: classes.logonButtonDisabled }}
                          disabled={loading}
                          type="submit"
                        >
                          Submit {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                        </Button>
                      </Grid>

                      {apiError ? <Alert severity="error" onClose={clearErrors}>{apiError}</Alert> : null}
                      {displaySuccess ? <Alert severity="success" onClose={closeSuccessMessage}>{displaySuccess}</Alert> : null}
                    </Box>
                  </form>
                  :
                  <Alert severity="error">
                    <Button
                      onClick={goBack}
                    >
                      {'Go Back'}
                    </Button>
                  </Alert>
              }
            </div>
          </div>
        </Grid>
      </Grid >
    </div >
  );
};

const mapStateToProps = state => ({
  error: state.error
});

AddPassword.propTypes = {
  history: PropTypes.object,
  getAddPassword: PropTypes.func.isRequired,
  addPassword: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getAddPassword, addPassword, clearErrors })(withRouter(AddPassword));
