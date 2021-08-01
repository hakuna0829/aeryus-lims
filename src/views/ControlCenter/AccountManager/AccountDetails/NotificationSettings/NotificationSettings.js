import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Tooltip, Button, CircularProgress } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import brandStyles from 'theme/brand';
import HelpIcon from '@material-ui/icons/Help';
import IOSSwitch from 'components/IOSSwitch';
import Alert from '@material-ui/lab/Alert';
import { getNotificationSettingsByAccountId, upsertNotificationSettingsByAccountId } from 'actions/api';

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
  container: {
    alignItems: 'center',
    borderBottom: `solid 1px ${theme.palette.brandDark}`,
    padding: '8px 0',
    '&:last-child': {
      borderBottom: 'solid 0px',
    }
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end'
  },
  upContent: {
    padding: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.up('md')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    [theme.breakpoints.up('lg')]: {
      padding: `0 ${theme.spacing(3)}px`,
    },
    paddingTop: '0px'
  },
}));

const NotificationSettingsInit = {
  new_location: true,
  location_updates: true,
  new_department: true,
  department_updates: true,
  new_populationsettings: true,
  populationsettings_updates: true,
  new_user: true,
  user_updates: true,
  user_failed_sms: true,
  user_failed_mails: true,
  new_inventory: true,
  inventory_updates: true,
  positive_results: true,
  failed_orders: true,
  daily_schedules: true,
};

const NotificationSettings = (props) => {
  const { account_id, getNotificationSettingsByAccountId, upsertNotificationSettingsByAccountId } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({ ...NotificationSettingsInit, account_id });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getNotificationSettingsByAccountId(account_id);
      setLoading(false);
      if (res.success && res.data) {
        setFormState(res.data);
      }
    })();
    // eslint-disable-next-line
  }, [account_id]);

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.checked
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
    closeErrorMessage();
    closeSuccessMessage();
    if (!didModified) return setDisplayError('No changes found');
    setLoading(true);
    const res = await upsertNotificationSettingsByAccountId(account_id, formState);
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
      <div className={classes.header} >
        <div className={classes.subHeader}>
          {/* <img src="/images/svg/building_icon.svg" alt="" />&ensp; */}
          <Typography variant="h2" className={brandClasses.headerTitle}>
            {'NOTIFICATIONS '}
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>
            {loading && <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />}
            {/* {'EDIT LOCATION'} */}
            <sup>
              {' '}
              <Tooltip title="NOTIFICATIONS" placement="right-start">
                <HelpIcon />
              </Tooltip>{' '}
            </sup>
          </Typography>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
      >
        <div className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5" >SITE MANAGER</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >New Location</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.new_location}
                  onChange={handleChange}
                  name="new_location"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Location Updates</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.location_updates}
                  onChange={handleChange}
                  name="location_updates"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5">New Department</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.new_department}
                  onChange={handleChange}
                  name="new_department"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5">Department Updates</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.department_updates}
                  onChange={handleChange}
                  name="department_updates"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5">New Population</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.new_populationsettings}
                  onChange={handleChange}
                  name="new_populationsettings"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5">Population Updates</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.populationsettings_updates}
                  onChange={handleChange}
                  name="populationsettings_updates"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          {/* <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Testing Protocol</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch checked={formState.checkedTestingProtocol} onChange={handleChange} name="checkedTestingProtocol" />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Provider Information</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch checked={formState.checkedProviderInfomation} onChange={handleChange} name="checkedProviderInfomation" />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid> */}
        </div>

        <div className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5" >USER MANAGER</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >New User</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.new_user}
                  onChange={handleChange}
                  name="new_user"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >User Updates</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.user_updates}
                  onChange={handleChange}
                  name="user_updates"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Failed SMS</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.user_failed_sms}
                  onChange={handleChange}
                  name="user_failed_sms"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Failed Emails</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.user_failed_mails}
                  onChange={handleChange}
                  name="user_failed_mails"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          {/* <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Testing History</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch checked={formState.checkedTestingHistory} onChange={handleChange} name="checkedTestingHistory" />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Workplace Entry</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch checked={formState.checkedWorkplaceHistory} onChange={handleChange} name="checkedWorkplaceHistory" />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid> */}
        </div>

        <div className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5" >LAB MANAGER</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >New Inventory</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.new_inventory}
                  onChange={handleChange}
                  name="new_inventory"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Inventory Updates</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.inventory_updates}
                  onChange={handleChange}
                  name="inventory_updates"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              {/* <Typography variant="h5" >Test Tracker</Typography> */}
              <Typography variant="h5" >Positive Results</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.positive_results}
                  onChange={handleChange}
                  name="positive_results"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              {/* <Typography variant="h5" >Resulted Tests</Typography> */}
              <Typography variant="h5" >Failed Orders</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.failed_orders}
                  onChange={handleChange}
                  name="failed_orders"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>
        </div>

        <div className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5" >APPOINTMENT MANAGER</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5">Daily Schedules</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch
                  checked={formState.daily_schedules}
                  onChange={handleChange}
                  name="daily_schedules"
                />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />
            </Grid>
          </Grid>

          {/* <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Department</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch checked={formState.checkedDepartment} onChange={handleChange} name="checkedDepartment" />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />

            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item md={4}>
              <Typography variant="h5" >Site</Typography>
            </Grid>
            <Grid item md={8}>
              <FormControlLabel
                control={<IOSSwitch checked={formState.checkedSite} onChange={handleChange} name="checkedSite" />}
                required
                labelPlacement="top"
                classes={{ label: classes.label }}
              />

            </Grid>
          </Grid> */}

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
        </div>

        <div className={classes.footer}>
          <br />
          <br />
          <br />
        </div>
      </form>
    </div>
  );
};

NotificationSettings.propTypes = {
  getNotificationSettingsByAccountId: PropTypes.func.isRequired,
  upsertNotificationSettingsByAccountId: PropTypes.func.isRequired,
};

export default connect(null, { getNotificationSettingsByAccountId, upsertNotificationSettingsByAccountId })(NotificationSettings);