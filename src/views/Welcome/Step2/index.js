import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Typography, Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import brandStyles from 'theme/brand';
import Alert from '@material-ui/lab/Alert';
import { addClientName, getMyClient } from 'actions/api';

const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  getStartedButton: {
    margin: theme.spacing(4),
  },
  companyName: {
    margin: theme.spacing(2),
    width: 332,
    '& .MuiInputLabel-root': {
      color: theme.palette.brandGray,
      // paddingLeft: theme.spacing(10)
    },
    '& .MuiInput-underline:after': {
      // borderBottom: `2px solid ${theme.palette.brandDark}`,
      borderColor: theme.palette.brandGray,
    },
  },
}));

const Step2 = (props) => {
  const { showFailedDialog, showErrorDialog, updateStep } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [companyPartnerId, setCompanyPartnerId] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Welcome Step2 useEffect');
    setLoading(true);
    getMyClient().then(res => {
      setLoading(false);
      if (res.data.success) {
        setCompanyName(res.data.data.name);
        setCompanyPartnerId(res.data.data.partner_id);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }, [showFailedDialog, showErrorDialog]);

  const handleChange = e => {
    e.persist();
    setCompanyName(e.target.value);
  };

  const handleCompanyConfirm = () => {
    if (!companyName) {
      setDisplayError('Please enter a company name');
      return;
    }
    setLoading(true);
    addClientName({ clientName: companyName }).then(res => {
      setLoading(false);
      if (res.data.success) {
        clearMessage();
        updateStep();
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  };

  const clearMessage = () => {
    setDisplayError(null);
    setDisplaySuccess(null);
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  return (
    <>
      <Grid item>
        <Typography
          className={classes.text}
          variant="h2"
        >
          {'LOCATION MANAGER'}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.text}
          variant="h3"
        >
          {'1. What is the name of your company'}
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          type="text"
          label="Enter company name"
          name="companyName"
          className={classes.companyName}
          onChange={handleChange}
          value={companyName || ''}
          required
        />
      </Grid>
      <Grid item>
        <Typography
          className={classes.text}
          variant="h5"
        >
          {'Note your Partner ID: '} {companyPartnerId}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          className={clsx(classes.getStartedButton, brandClasses.button)}
          classes={{ disabled: brandClasses.buttonDisabled }}
          disabled={loading}
          onClick={handleCompanyConfirm}
        >
          CONFIRM {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
        </Button>
      </Grid>

      <Grid item>
        {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
        {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
      </Grid>
    </>
  );
};

Step2.propTypes = {
  showErrorDialog: PropTypes.func.isRequired,
  updateStep: PropTypes.func.isRequired
};

export default Step2;