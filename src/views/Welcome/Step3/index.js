import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Typography, Button, CircularProgress, Grid, TextField, Select, FormControl, MenuItem, InputLabel, Checkbox, FormControlLabel, Link } from '@material-ui/core';
import brandStyles from 'theme/brand';
import { getStates } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import DialogAlert from 'components/DialogAlert';
import { addLocation } from 'actions/api';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import * as appConstants from 'constants/appConstants';

const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  locationRoot: {
    margin: theme.spacing(6)
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
    padding: theme.spacing(4),
  },
  dayCheckbox: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(2),
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark,
    },
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
    '& .MuiSelect-icon': {
      // width: 21%;
      height: '100%',
      borderRadius: '0 10px 10px 0',
      backgroundColor: theme.palette.brandDark,
      right: 0,
      top: 'auto'
    }
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
}));

const startTime = moment('2020-02-20 09:00');
const endTime = moment('2020-02-20 17:00');

const operationDays = [
  {
    day_name: 'Sunday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
  {
    day_name: 'Monday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
  {
    day_name: 'Tuesday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
  {
    day_name: 'Wedneday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
  {
    day_name: 'Thursday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
  {
    day_name: 'Friday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
  {
    day_name: 'Saturday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0
  },
]

const Step3 = (props) => {
  const { showErrorDialog, updateStep } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formState, setFormState] = useState({});
  const [operationState, setOperationState] = useState(operationDays);

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

  const handle24HoursChange = event => {
    event.persist();
    let operations = [...operationState];
    let index = operationState.findIndex(o => o.day_name === event.target.name);
    operations[index].opens24hours = event.target.checked;
    setOperationState(operations);
  };

  const handleOperationChange = event => {
    event.persist();
    let operations = [...operationState];
    let index = operationState.findIndex(o => o.day_name === event.target.name);
    if (event.target.type === 'checkbox')
      operations[index].active = event.target.checked;
    else
      operations[index].stations = event.target.value;
    setOperationState(operations);
  };

  const handleStartTimeChange = dayName => (date) => {
    let operations = [...operationState];
    let index = operationState.findIndex(o => o.day_name === dayName);
    operations[index].displayStartTime = date; // moment(date).toString()
    operations[index].start_time = moment(date).format('HH:mm');
    setOperationState(operations);
  };

  const handleEndTimeChange = dayName => (date) => {
    let operations = [...operationState];
    let index = operationState.findIndex(o => o.day_name === dayName);
    operations[index].displayEndTime = date; // moment(date).toString()
    operations[index].end_time = moment(date).format('HH:mm');
    setOperationState(operations);
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

  const handleLocationSubmit = event => {
    event.preventDefault();
    setDisplayError(null);
    setDisplaySuccess(null);
    if (operationState.every(x => !x.active)) {
      setDisplayError(`Please select the Operation days.`);
      return;
    } else {
      if (operationState.some(x => x.active && !x.stations)) {
        setDisplayError(`Please add the stations for selected Operation days.`);
        return;
      } else {
        formState.operations = operationState;
        setLoading(true);
        addLocation(formState).then(res => {
          setLoading(false);
          if (res.data.success) {
            clearMessage();
            setDialogOpen(true);
          } else {
            setDisplayError(res.data.message);
          }
        }).catch(error => {
          setLoading(false);
          showErrorDialog(error);
        });
      }
    }
  };

  return (
    <div className={classes.locationRoot}>
      <Grid item>
        <Typography
          className={classes.text}
          variant="h2"
        >
          {'LOCATION MANAGER'}
        </Typography>
      </Grid>
      <div className={classes.header}>
        <Typography variant="h3" className={classes.headerTitle}>
          {'+ ADD LOCATION'}
        </Typography>
        <Link
          className={clsx(classes.skipButton, brandClasses.brandGrayText)}
          component={Button}
          onClick={handleSkip}
          variant="h6"
        >
          {'Skip for now'}
        </Link>
      </div>
      <form
        onSubmit={handleLocationSubmit}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Location Name"
              placeholder="Enter location"
              name="name"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.name || ''}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Administrator"
              placeholder="Enter admin name"
              name="administrator"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.administrator || ''}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Address"
              placeholder="Enter address"
              name="address"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.address || ''}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item container spacing={3} xs={12} sm={5}>
            <Grid item xs={12} sm={8}>
              <TextField
                type="number"
                label="Office Phone"
                placeholder="Enter office number"
                name="office_phone"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.office_phone || ''}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item container xs={12} sm={4}>
              <TextField
                type="text"
                label="Ext."
                placeholder="Enter ext."
                name="ext"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.ext || ''}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="City"
              placeholder="Enter city"
              name="city"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.city || ''}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="email"
              label="Email"
              placeholder="Enter email address"
              name="email"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.email || ''}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item container spacing={3} xs={12} sm={5}>
            <Grid item xs={12} sm={6}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel>State</InputLabel>
                <Select
                  onChange={handleChange}
                  label="State"
                  name="state"
                  value={formState.state || ''}
                >
                  {getStates.map((state, index) => (
                    <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item container xs={12} sm={6}>
              <TextField
                type="text"
                label="Zip Code"
                placeholder="Enter zip"
                name="zip_code"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.zip_code || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                style={{ height: 52 }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="EOC"
              placeholder="Enter EOC name"
              name="eoc"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.eoc || ''}
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Phone Number"
              placeholder="Enter phone number"
              name="phone"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.phone || ''}
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="h3" className={classes.operationTitle}>
          {'Operation Details'}
        </Typography>
        <Typography variant="h5" className={classes.operationDescription}>
          {'Select days that your organization is open and provide the correct operating hours'}
        </Typography>

        {operationState.map((day, index) => (
          <Accordion key={index}>
            <AccordionSummary
              className={index % 2 !== 0 ? '' : brandClasses.tableRow2}
            >
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={<Checkbox onChange={handleOperationChange} name={day.day_name} checked={day.active} />}
                  label={day.day_name}
                  className={classes.dayCheckbox}
                />
                <Typography variant="h6" className={classes.timeText}>
                  {day.active
                    ? day.opens24hours
                      ? 'Opens 24 Hours'
                      : moment(day.displayStartTime).format('LT') + ' - ' + moment(day.displayEndTime).format('LT')
                    : 'Closed'
                  }
                </Typography>
                <Typography variant="h6" className={classes.stationsText}>
                  Stations: {day.stations}
                </Typography>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item style={{ width: 130 }}></Grid>
                <Grid item>
                  {!day.opens24hours && (
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                        <KeyboardTimePicker
                          value={day.displayStartTime}
                          onChange={handleStartTimeChange(day.day_name)}
                          className={classes.timeField}
                        />
                        <Typography variant="h4" className={classes.operationDescription}>
                          {'-'}
                        </Typography>
                        <KeyboardTimePicker
                          value={day.displayEndTime}
                          onChange={handleEndTimeChange(day.day_name)}
                          className={classes.timeField}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                  )}
                  <FormControlLabel
                    control={<Checkbox onChange={handle24HoursChange} name={day.day_name} value={day.opens24hours} />}
                    label="Open 24 hours"
                    className={classes.dayCheckbox}
                  />
                </Grid>
                <FormControl
                  className={clsx(classes.stationSelect, brandClasses.shrinkTextField)}
                  variant="outlined"
                >
                  <Select
                    onChange={handleOperationChange}
                    name={day.day_name}
                    value={day.stations || 0}
                  >
                    <MenuItem value={0}>
                      <Typography className={classes.stateSelect}>{'<1-20>'}</Typography>
                    </MenuItem>
                    {[...Array(20)].map((_, item) => (
                      <MenuItem value={item + 1} key={item}>{item + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

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
            DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </div>
      </form>

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Location saved successfully.'}
        message={`Do you want to Add another Location details ?`}
        onClose={handleDialogClose}
        onAction={handleDialogAction}
      />
    </div>
  );
};

Step3.propTypes = {
  showErrorDialog: PropTypes.func.isRequired,
  updateStep: PropTypes.func.isRequired
};

export default Step3;