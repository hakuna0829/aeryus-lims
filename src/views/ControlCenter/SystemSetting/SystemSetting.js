import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  FormControlLabel,
  // Tooltip
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import moment from "moment";
// import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import IOSSwitch from 'components/IOSSwitch';
import { getSystemSettings, updateSystemSettings } from 'actions/api';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: `${theme.spacing(2)}px 0px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end'
  },
  upContent: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5)
    },
    paddingTop: '0px'
  },
  upContent1: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(3)
    },
    paddingTop: '0px'
  },
  container: {
    alignItems: 'center',
    paddingLeft: 30,
    borderBottom: `solid 1px ${theme.palette.brandDark}`,
    '&:last-child': {
      borderBottom: 'solid 0px',
    }
  },
  backup: {
    display: 'flex',
    // justifyContent:'',
    alignItems: 'center'
  }
}));

const SystemSettingsInit = {
  rapid_pairing_mode: false,
};

const backupDate = moment();

const SystemSetting = (props) => {
  const { getSystemSettings, updateSystemSettings } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [formState, setFormState] = useState({ ...SystemSettingsInit });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getSystemSettings();
      setLoading(false);
      if (res.success && res.data) {
        setFormState(res.data);
      } else {
        setDidModified(true);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const handleCheckChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.checked
    }));
  };

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!didModified) return setDisplayError('No changes found');
    setLoading(true);
    const res = await updateSystemSettings(formState);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      setDidModified(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeErrorMessage();
        closeSuccessMessage();
      }, 2000);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <img src="/images/svg/settings_icon-1.svg" alt="" />&ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Control Center |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>SYSTEM SETTINGS</Typography>
          {loading && <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />}
        </div>

        {/* <Typography variant="h2" className={brandClasses.headerTitle}>
          {'SYSTEM SETTINGS'}
          <sup>
            {' '}
            <Tooltip title="System settings" placement="right-start">
              <HelpIcon />
            </Tooltip>{' '}
          </sup>
        </Typography> */}
      </div>

      <form
        onSubmit={handleSubmit}
      >
        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5">TESTING TAB</Typography>
        </div>
        <div className={classes.upContent1}>
          <Grid container spacing={4} className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5">Rapid Pairing Mode</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.rapid_pairing_mode}
                  onChange={handleCheckChange}
                  name="rapid_pairing_mode"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >EMAIL SETTINGS</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Sparkpost API Key"
                placeholder="Enter"
                name="sparkpost_key"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.sparkpost_key || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >SMS SETTINGS</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Twilio Account SID"
                placeholder="Enter"
                name="sms_twilio_sid"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.sms_twilio_sid || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Twilio Auth Token "
                placeholder="Enter"
                name="sms_twilio_token"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.sms_twilio_token || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Twilio Phone Number"
                placeholder="Enter"
                name="sms_twilio_number"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.sms_twilio_number || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={8}></Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >VOICE SETTINGS</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Twilio Account SID"
                placeholder="Enter"
                name="vocie_twilio_sid"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.vocie_twilio_sid || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Twilio Auth Token "
                placeholder="Enter"
                name="vocie_twilio_token"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.vocie_twilio_token || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <TextField
                type="text"
                label="Twilio Phone Number"
                placeholder="Enter"
                name="vocie_twilio_number"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.vocie_twilio_number || ''}
                required
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={8}></Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderDark}>
          <Typography variant="h5" >BACKUP SCHEDULE</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4}>
            <Grid item md={12} className={classes.backup}>
              <img src="/images/svg/status/check_green.svg" alt="" width={40}></img> &ensp;
              <Typography variant="h5" >
                System backup completed as of:  {moment(backupDate).format('DD/MM/YYYY | h:mm A')}
              </Typography>
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.footerMessage}>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
        </div>

        <div className={brandClasses.footerButton}>
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
            type="submit"
          >
            {'SAVE'} {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </div>

      </form>
    </div>
  );
};

SystemSetting.propTypes = {
  getSystemSettings: PropTypes.func.isRequired,
  updateSystemSettings: PropTypes.func.isRequired,
};

export default connect(null, { getSystemSettings, updateSystemSettings })(SystemSetting);