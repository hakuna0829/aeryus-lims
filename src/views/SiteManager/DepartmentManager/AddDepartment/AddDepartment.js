import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Typography, Button, CircularProgress, Grid, TextField, Select, FormControl, MenuItem, InputLabel, Link } from '@material-ui/core';
import brandStyles from 'theme/brand';
import Alert from '@material-ui/lab/Alert';
import DialogAlert from 'components/DialogAlert';
import TextButton from 'components/Button/TextButton'
// import HelpIcon from '@material-ui/icons/Help';
import * as appConstants from 'constants/appConstants';
import { Department } from 'icons';
import { clearDepartments } from 'actions/clear';
import { getLocations1, addDepartment } from 'actions/api';

const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  locationRoot: {
    margin: theme.spacing(4)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: theme.palette.blueDark,
    marginBottom: theme.spacing(4)
  },
  skipButton: {
    textTransform: 'none',
    marginBottom: theme.spacing(4)
  },
  operationTitle: {
    backgroundColor: 'rgba(15,132,169,0.8)',
    color: theme.palette.white,
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(3),
  },
  timeDuration: {
    color: theme.palette.brandDark,
    padding: theme.spacing(1),
  },
  dayCheckbox: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(2),
    width: 150,
    alignItems: 'center',
    display: 'flex',
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
  timeText: {
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  stationsText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    marginRight: theme.spacing(2),
  },
  stationSelect: {
    '& .MuiOutlinedInput-input': {
      padding: '6px 10px !important',
      marginRight: 17,
      width: 42,
      textAlign: 'center',
    },
    '& .MuiSelect-icon': {
      // width: 21%;
      height: '100%',
      borderRadius: '0 10px 10px 0',
      // backgroundColor: theme.palette.brandDark,
      right: 0,
      top: 'auto'
    },
    '& p': {
      color: '#9B9B9B'
    },
  },
  timeField: {
    '& input': {
      color: theme.palette.brandDark,
      width: '115px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark,
    }
  },
  accExpanded: {
    margin: '0 !important',
    borderBottom: '1px solid #0F84A9'
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center'
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat'
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: '1rem'
  },
}));

const AddDepartment = (props) => {
  const { updateStep, isWelcomePage, getLocations1, locations, addDepartment, clearDepartments } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState({});

  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      if (!locations)
        await getLocations1();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = () => {
    updateStep();
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    updateStep();
  }

  const handleDialogAction = () => {
    setDialogOpen(false);
    setFormState({});
    // setOperationState(operationDays);
    window.scrollTo(0, 0);
  }

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const clearMessage = () => {
    setDisplayError(null);
    setDisplaySuccess(null);
  }

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    clearMessage();
    setLoading(true);
    const res = await addDepartment(formState);
    setLoading(false);
    if (res.success) {
      clearDepartments();
      clearMessage();
      if (isWelcomePage)
        setDialogOpen(true);
      else
        history.push('/site-manager/department-manager');
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
      >
        <div className={classes.locationRoot}>
          {isWelcomePage && (
            <Grid item>
              <Typography
                className={classes.text}
                variant="h2"
              >
                {'DEPARTMENT MANAGER'}
              </Typography>
            </Grid>
          )}
          <div className={classes.header}>
            <Typography variant="h3" className={classes.headerTitle}>
              <Department />
              {'+ ADD DEPARTMENT'}
              {/* <sup>
                {' '}
                <Tooltip title="Add Department" placement="right-start">
                  <HelpIcon />
                </Tooltip>{' '}
              </sup> */}
            </Typography>
            {isWelcomePage && (
              <Link
                className={clsx(classes.skipButton, brandClasses.brandGrayText)}
                component={Button}
                onClick={handleSkip}
                variant="h6"
              >
                {'Skip for now'}
              </Link>
            )}
          </div>

          <Grid container spacing={3}>
            <Grid item md={3}>
              {locations
                ?
                <FormControl
                  className={brandClasses.shrinkTextField}
                  required
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Locations</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Locations* "
                    name="location_id"
                    displayEmpty
                    value={formState.location_id || ''}
                  >
                    <MenuItem value=''>
                      <Typography className={brandClasses.selectPlaceholder}>Select Location</Typography>
                    </MenuItem>
                    {locations.map((location, index) => (
                      <MenuItem key={index} value={location._id}>
                        {location.name}
                        {location.client_id.name && `  –  (${location.client_id.name})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                :
                <CircularProgress size={20} className={brandClasses.progressSpinner} />
              }
            </Grid>
            <Grid item md={9}></Grid>
            <Grid item sm={4}>
              <TextField
                type="text"
                label="Department Name"
                placeholder="Enter department"
                name="name"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.name || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                type="text"
                label="Department Head"
                placeholder="Enter Department Head Name"
                name="head"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.head || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={4}></Grid>
            <Grid item sm={4}>
              <TextField
                type="text"
                label="Phone Number"
                placeholder="Enter phone number"
                name="phone"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.phone || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                type="text"
                label="Extension Number"
                placeholder="Enter extension number"
                name="extension_number"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.extension_number || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={4}></Grid>
            <Grid item sm={4}>
              <TextField
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                name="email"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.email || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={8}></Grid>
          </Grid>
        </div>

        <div className={brandClasses.footerMessage}>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
        </div>

        <div className={brandClasses.footerButton}>
          {/* <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
            type="submit"
          >
            DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button> */}
          <TextButton disabled={loading}
            type="submit">
          DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </TextButton>
        </div>
      </form>

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Department saved successfully.'}
        message={`Do you want to Add another Department details ?`}
        onClose={handleDialogClose}
        onAction={handleDialogAction}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
});

AddDepartment.propTypes = {
  updateStep: PropTypes.func,
  isWelcomePage: PropTypes.bool,
  getLocations1: PropTypes.func.isRequired,
  addDepartment: PropTypes.func.isRequired,
  clearDepartments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, addDepartment, clearDepartments })(AddDepartment);