import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getStates } from 'helpers';
import {
  Grid,
  Button,
  Checkbox,
  Select,
  FormControl,
  MenuItem,
  Tooltip,
  FormControlLabel
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import HelpIcon from '@material-ui/icons/Help';
/*import SimpleReactValidator from 'simple-react-validator';*/
import {
  ValidatorForm,
  TextValidator,
  // SelectValidator
} from 'react-material-ui-form-validator';
import { IconButton, CircularProgress } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Edit } from 'icons';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { addLocation, apiUrl } from 'actions/api';
import brandStyles from 'theme/brand';

// import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider'
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
  // KeyboardDatePicker,
} from '@material-ui/pickers';
import clsx from 'clsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { clearLocations } from 'actions/clear';

const protocols = [
  { "text": "24 hours", "value": "24 hours" },
  { "text": "48 hours", "value": "48 hours" },
  { "text": "72 hours", "value": "72 hours" },
  { "text": "Weekly", "value": "Weekly" },
  { "text": "Bi Weekly", "value": "Bi Weekly" }
];

// const providers =[
//   { "text": "Provider 1", "value": "provider1" },
//   { "text": "Provider 2", "value": "provider2" }
// ];

const useStyles = makeStyles(theme => ({
  root: {
    //padding: '16px !important'
    // padding: theme.spacing(0),
    padding: theme.spacing(0)
  },
  header: {
    margin: theme.spacing(3)
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  validationForm: {
    padding: theme.spacing(0)
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(3)
  },
  spaceHolder: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 !important',
      margin: '0 !important'
    }
  },
  autoInput: {
    padding: '3.5px 4px'
  },
  autoCompleteRoot: {
    '& .MuiAutocomplete-inputRoot': {
      padding: '3.5px 4px'
    }
  },
  formError: {
    textAlign: 'left',
    color: '#ef5350'
  },
  loader: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  content: {
    textAlign: 'center'
  },
  subTitle: {
    color: '#043B5D',
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '43px',
    marginLeft: 20
  },
  labelRoot: {
    fontSize: '14px'
  },
  textfield: {
    width: '500px'
  },
  label2: {
    width: '100% !important',
    marginRight: 20
  },
  label3: {
    // marginLeft:20,
    width: '180px !important'
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat'
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center'
  },
  accordionDetails: {
    display: 'flex',
    alignItems: 'center',
    padding:`0px ${theme.spacing(2)}px`,
  },
  accExpanded: {
    margin: '0 !important',
    borderBottom: '1px solid #0F84A9'
  },
  checkBoxColor: {
    color: `${theme.palette.brandDark} !important`
  },
  heading: {
    flexBasis: '40%',
    paddingLeft: theme.spacing(3),
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    display: 'flex',
    alignItems: 'center',
    '& img': {
      marginRight: 20
    }
  },
  secondaryHeading: {
    flexBasis: '40%',
    color: '#0F84A9'
  },
  thirdHeading: {
    flexBasis: '20%',
    color: '#0F84A9'
  },
  detail: {
    flexBasis: '40%'
  },
  secondDetail: {
    flexBasis: '40%',
    color: '#0F84A9'
  },
  thirdDetail: {
    flexBasis: '20%',
    color: '#0F84A9'
  },
  stationList: {
    border: '1px solid #0F84A9',
    borderRadius: '10px',
    color: '#0F84A9',
    '& .MuiOutlinedInput-input': {
      padding: '15px 35px 15px 15px'
    }
  },
  rowSky: {
    backgroundColor: 'rgba(15,132,169,0.15)'
  },
  marTop10: {
    margin: '10px 0'
  },
  chk24: {
    '& svg': {
      color: '#0F84A9'
    }
  },
  operationTitle: {
    backgroundColor: 'rgba(15,132,169,0.8)',
    color: theme.palette.white,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginTop: theme.spacing(4)
  },
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(4)
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
    marginRight: theme.spacing(2)
  },
  stationSelect: {
    
    '& .MuiOutlinedInput-input':{
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
    '& p':{
      color:'#9B9B9B'
    },
  },
  timeField: {
    '& input': {
      color: theme.palette.brandDark,
      width: '115px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark
    }
  },

  submitButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(4)
  }
}));

const ValidationTextField = withStyles({
  root: {
    width: '100%',
    marginBottom: '20px',

    /*'& label.Mui-focused': {
            color: '#0F84A9',
        },
        '&:focus': {
          outline: '0'
        },
        '& input ': {
            fontFamily: 'Montserrat',
            fontSize: '14px',
            fontWeight: 500
        },
        '& input + fieldset': {
            borderRadius: '10px',
            fontFamily: 'Montserrat',
            fontWeight: 500

        },*/
    //placeholder style if not input text
    /*        '& .MuiInputLabel-outlined': {
            fontFamily: 'Montserrat',
            fontSize: '14px',
            fontWeight: 500,
            color: '#9B9B9B'
        },*/
    /*        '& input:valid + fieldset': {
            borderColor: '#0F84A9',
            borderWidth: 2,
            width: '100%'
        },
        '& input:invalid + fieldset': {
            borderColor: '#0F84A9',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderColor: '#0F84A9',
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
        '& input:invalid:focus + fieldset': {
            borderColor: '#0F84A9',
        },*/
    '::placeholder': {
      color: 'red',
      fontSize: '14px'
    }
  }
})(TextValidator);

const currentTime = '09:00 AM';
const endTime = '05:00 PM';
const initialDaysData = [
  {
    day_name: 'Sunday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  },
  {
    day_name: 'Monday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  },
  {
    day_name: 'Tuesday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  },
  {
    day_name: 'Wednesday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  },
  {
    day_name: 'Thursday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  },
  {
    day_name: 'Friday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  },
  {
    day_name: 'Saturday',
    active: false,
    opens24hours: false,
    start_time: currentTime,
    end_time: endTime,
    stations: 0,
    editable: false
  }
];
const AddLocation = (props) => {
  const { clearLocations } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [expanded, setExpanded] = useState(false);
  const [daysData, setDaysData] = useState(initialDaysData);
  const [siteLogoState, setSiteLogoState] = useState({});
  const [imgState, setImgState] = useState({});
  const history = useHistory();
  const [allValues, setAllValues] = useState({
    name: '',
    active: true,
    administrator: '',
    address: '',
    office_phone: '',
    ext: '',
    city: '',
    created_date: moment(new Date()).toString(),
    email: '',
    state: '',
    zip_code: '',
    eoc: '',
    eoc_office_phone: '',
    eoc_ext: '',
    eoc_email: '',
    phone: '',
    operations: [],
    testing_protocol: '',
    site_logo: '',
    provider: '',
    provider_name: '',
    provider_phone: '',
    provider_npi: '',
    provider_address: '',
    provider_city: '',
    provider_state: '',
    provider_zip_code: '',
    provider_photo: ''
  });
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  // const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading] = useState(false);
  // const [stations] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

  const handleSitePhotoChange = event => {
    console.log('site logo');

    let files = event.target.files;
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      setDisplayError('Only images are supported.');
      return;
    } else {
      setDisplayError(null);
    }

    let reader = new FileReader();
    setSiteLogoState(siteLogoState => ({
      ...siteLogoState,
      imagePath: files[0]
    }));
    reader.readAsDataURL(files[0]);

    reader.onload = (_event) => {
      setSiteLogoState(siteLogoState => ({
        ...siteLogoState,
        imgURL: reader.result
      }));
    }
  }

  const handlePhotoChange = event => {
    console.log('provider photo')
    let files = event.target.files;
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      setDisplayError('Only images are supported.');
      return;
    } else {
      setDisplayError(null);
    }

    let reader = new FileReader();
    setImgState(imgState => ({
      ...imgState,
      imagePath: files[0]
    }));
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      setImgState(imgState => ({
        ...imgState,
        imgURL: reader.result
      }));
    }
  }

  const handleAutoCompleteStateChange = (event, values) => {
    const value = values ? values.value : '';
    if (displayError)
      setDisplayError(null);
    setAllValues({ ...allValues, state: value });
  }

  const handleAutoCompleteProviderStateChange = (event, values) => {
    const value = values ? values.value : '';
    if (displayError)
      setDisplayError(null);
    setAllValues({ ...allValues, provider_state: value });
  }

  const handleAutoCompleteProtocolChange = (event, values) => {
    const value = values ? values.value : '';
    if (displayError)
      setDisplayError(null);
    setAllValues({ ...allValues, testing_protocol: value });
  }

  // const handleAutoCompleteStationsChange = (event, values) => {
  //   const value = values ? values.value : '';
  //   if (displayError)
  //     setDisplayError(null);
  //   setAllValues({ ...allValues, stations: value });
  // }
  

  // const handleAutoCompleteProviderChange = (event, values) => {
  //   const value = values ? values.value : '';
  //   if (displayError)
  //     setDisplayError(null);
  //   setAllValues({ ...allValues, provider: value });
  // }

  const handleStartTimeChange = (index, date) => {
    let prevDaysData = [...daysData];
    prevDaysData[index].active = true;
    prevDaysData[index].start_time = moment(date)
      .format('hh:mm A')
      .toString();
    setDaysData(prevDaysData);
  };

  const handleEndTimeChange = (index, date) => {
    let prevDaysData = [...daysData];
    prevDaysData[index].active = true;
    prevDaysData[index].end_time = moment(date)
      .format('hh:mm A')
      .toString();
    setDaysData(prevDaysData);
  };

  const handleAccordianChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    console.log(panel, isExpanded)
  };

  // const handleDayActive = index => event => {
  //   let prevDaysData = [...daysData];
  //   prevDaysData[index].active = !prevDaysData[index].active;
  //   setDaysData(prevDaysData);
  //   event.stopPropagation();
  // };
  const handle24Hours = indx => ev => {
    let prevDaysData = [...daysData];
    prevDaysData[indx].active = true;
    prevDaysData[indx].opens24hours = !prevDaysData[indx].opens24hours;
    setDaysData(prevDaysData);
  };
  const handleStationChange = index => event => {
    let prevDaysData = [...daysData];
    prevDaysData[index].stations = event.target.value;
    setDaysData(prevDaysData);
  };

  const changeHandler = e => {
    e.persist();
    console.log(e.target.value)
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const handleDaysData = (property, index, value) => {
    console.log(property, index, value)
    let prevDaysData = [...daysData];
    prevDaysData[index][property] = value;
    setDaysData(prevDaysData);
  };

  const addNewLocation = event => {
    const locationData = {
      ...allValues,
      operations: [...daysData]
    };
    setIsLoading(true);
    addLocation(locationData)
      .then(res => {
        setIsLoading(false);
        clearLocations();
        if (res.data.success) {
          history.push('/site-manager/location-manager');
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        setIsLoading(false);
        showErrorDialog(error);
        console.error(error);
      });
    event.preventDefault();
  };
  const handleFormErrors = () => {
    setFormError(true);
    window.scrollTo(0, 0);
  };
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h3" className={classes.headerTitle}>
          + ADD LOCATION{' '}
          <sup>
            {' '}
            <Tooltip title="Add Location" placement="right-start">
              <HelpIcon />
            </Tooltip>{' '}
          </sup>
        </Typography>
      </div>
      <ValidatorForm
        className={classes.validationForm}
        noValidate
        autoComplete="off"
        onSubmit={ev => addNewLocation(ev)}
        onError={() => handleFormErrors()}>
        <div className={classes.upContent}>
          <Grid container spacing={4}>
            {formError && (
              <Grid item sm={12}>
                <Typography className={classes.formError}>
                  {' '}
                  Please provide required data
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="Location Name"
                placeholder="Enter Location"
                validators={['required']}
                variant="outlined"
                value={allValues.name}
                classes={{ root: classes.labelRoot }}
                name="name"
                onChange={changeHandler}
                errorMessages={['']}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="Administrator"
                placeholder="Enter admin name"
                validators={['required']}
                value={allValues.administrator}
                name="administrator"
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              // className={classes.textfield}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="Address"
                placeholder="Enter address"
                validators={['required']}
                value={allValues.address}
                name="address"
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                classes={{ root: classes.labelRoot }}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <ValidationTextField
                    className={brandClasses.shrinkTextField}
                    label="Office Phone"
                    placeholder="Enter phone number"
                    validators={['required', 'matchRegexp:[0-9]$']}
                    value={allValues.office_phone}
                    name="office_phone"
                    onChange={changeHandler}
                    type="tel"
                    errorMessages={['']}
                    variant="outlined"
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ValidationTextField
                    className={brandClasses.shrinkTextField}
                    label="Ext."
                    placeholder="Enter ext."
                    validators={['required', 'matchRegexp:[0-9]$']}
                    value={allValues.ext}
                    name="ext"
                    onChange={changeHandler}
                    errorMessages={['']}
                    variant="outlined"
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="City"
                placeholder="Enter city"
                validators={['required']}
                value={allValues.city}
                name="city"
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="Email"
                placeholder="Enter email address"
                type="email"
                validators={['required', 'isEmail']}
                value={allValues.email}
                name="email"
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {/* <SelectValidator
                    className={brandClasses.shrinkTextField}
                    style={{ width: '100%' }}
                    label="State"
                    placeholder="Enter state"
                    validators={['required']}
                    value={allValues.state}
                    name="state"
                    onChange={changeHandler}
                    errorMessages={['']}
                    variant="outlined"
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    required>
                    {getStates.map((state, index) => (
                      <MenuItem key={index} value={state.text}>
                        {state.text}
                      </MenuItem>
                    ))}
                  </SelectValidator> */}

                  <Autocomplete
                    options={getStates}
                    loading={loading}
                    getOptionLabel={(option) => option.text}
                    classes={{ inputRoot: classes.autoInput }}
                    className={classes.autoCompleteRoot}
                    onChange={handleAutoCompleteStateChange}

                    renderInput={(params) => (
                      <ValidationTextField
                        {...params}
                        className={brandClasses.shrinkTextField}
                        style={{ width: '100%' }}
                        label="State"
                        placeholder="Enter state"
                        variant="outlined"
                        validators={['required']}
                        name="state"
                        // onChange={changeHandler}
                        errorMessages={['']}
                        value={allValues.state}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />


                  {/*                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                  <Select
                    onChange={handleChange}
                    label="State"
                    name="state"
                    value={allValues.state || ''}
                  >
                    {getStates.map((state, index) => (
                      <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                    ))}
                  </Select>
                  </FormControl>*/}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ValidationTextField
                    className={brandClasses.shrinkTextField}
                    label="Zip Code"
                    placeholder="Enter zipcode"
                    validators={['required', 'matchRegexp:[0-9]$']}
                    value={allValues.zip_code}
                    onChange={changeHandler}
                    name="zip_code"
                    type="tel"
                    errorMessages={['']}
                    variant="outlined"
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="EOC"
                placeholder="Enter eoc name"
                validators={['required']}
                value={allValues.eoc}
                name="eoc"
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid className={classes.spaceHolder} item sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="Phone Number"
                placeholder="Enter phone number"
                validators={['required', 'matchRegexp:[0-9]$']}
                value={allValues.phone}
                name="phone"
                type="tel"
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <ValidationTextField
                    className={brandClasses.shrinkTextField}
                    label="Office Phone"
                    placeholder="Enter phone number"
                    validators={['required', 'matchRegexp:[0-9]$']}
                    value={allValues.eoc_office_phone}
                    name="eoc_office_phone"
                    type="tel"
                    onChange={changeHandler}
                    errorMessages={['']}
                    variant="outlined"
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ValidationTextField
                    className={brandClasses.shrinkTextField}
                    label="Ext."
                    placeholder="Enter ext."
                    validators={['required', 'matchRegexp:[0-9]$']}
                    value={allValues.eoc_ext}
                    name="eoc_ext"
                    onChange={changeHandler}
                    errorMessages={['']}
                    variant="outlined"
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={protocols}
                loading={loading}
                getOptionLabel={(option) => option.text}
                classes={{ inputRoot: classes.autoInput }}
                className={classes.autoCompleteRoot}
                onChange={handleAutoCompleteProtocolChange}

                renderInput={(params) => (
                  <ValidationTextField
                    {...params}
                    className={brandClasses.shrinkTextField}
                    style={{ width: '100%' }}
                    label="Testing Protocol"
                    placeholder="Enter protocol"
                    variant="outlined"
                    validators={['required']}
                    name="testing_protocol"
                    // onChange={changeHandler}
                    errorMessages={['']}
                    value={allValues.testing_protocol}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ValidationTextField
                className={brandClasses.shrinkTextField}
                label="Email"
                placeholder="Enter email address"
                type="email"
                name="eoc_email"
                validators={['required', 'isEmail']}
                value={allValues.eoc_email}
                onChange={changeHandler}
                errorMessages={['']}
                variant="outlined"
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Autocomplete
                options={providers}
                loading={loading}
                getOptionLabel={(option) => option.text}
                classes={{ inputRoot: classes.autoInput }}
                className={classes.autoCompleteRoot}
                onChange={handleAutoCompleteProviderChange}

                renderInput={(params) => (
                  <ValidationTextField
                    {...params}
                    className={brandClasses.shrinkTextField}
                    style={{ width: '100%' }}
                    label="Provider"
                    placeholder="Enter provider"
                    variant="outlined"
                    validators={['required']}
                    name="provider"
                    // onChange={changeHandler}
                    errorMessages={['']}
                    value={allValues.provider}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={brandClasses.uploadContanier}>
                <Typography className={brandClasses.uploadTitle}>Site Logo</Typography>
                {siteLogoState.imgURL
                  ? <img src={siteLogoState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                  : allValues.site_logo
                    ? <img src={apiUrl + allValues.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                    :
                    <>&ensp;</>
                  // <Typography className={brandClasses.uploadDesc}>Upload profile image</Typography>
                }
                <div className={brandClasses.uploadImageContainer}>
                  <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file" onChange={handleSitePhotoChange} />
                  <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                    <img src="/images/svg/UploadPhoto.svg" alt="" />
                    <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                  </label>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div>
          <Typography variant="h4" className={classes.operationTitle}>
            {'Provider Details'}
          </Typography>
          <div className={classes.upContent}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <ValidationTextField
                  className={brandClasses.shrinkTextField}
                  label="Provider Name"
                  placeholder="Provider Name"
                  validators={['required']}
                  variant="outlined"
                  value={allValues.provider_name}
                  classes={{ root: classes.labelRoot }}
                  name="provider_name"
                  onChange={changeHandler}
                  errorMessages={['']}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <ValidationTextField
                  className={brandClasses.shrinkTextField}
                  label="Phone"
                  placeholder="Enter phone number"
                  validators={['required']}
                  variant="outlined"
                  value={allValues.provider_phone}
                  classes={{ root: classes.labelRoot }}
                  name="provider_phone"
                  onChange={changeHandler}
                  errorMessages={['']}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <ValidationTextField
                  className={brandClasses.shrinkTextField}
                  label="NPI"
                  placeholder="Enter NPI"
                  validators={['required']}
                  variant="outlined"
                  value={allValues.provider_npi}
                  classes={{ root: classes.labelRoot }}
                  name="provider_npi"
                  onChange={changeHandler}
                  errorMessages={['']}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <ValidationTextField
                  className={brandClasses.shrinkTextField}
                  label="Address"
                  placeholder="Enter address"
                  validators={['required']}
                  variant="outlined"
                  value={allValues.provider_address}
                  classes={{ root: classes.labelRoot }}
                  name="provider_address"
                  onChange={changeHandler}
                  errorMessages={['']}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <ValidationTextField
                  className={brandClasses.shrinkTextField}
                  label="City"
                  placeholder="Enter city"
                  validators={['required']}
                  variant="outlined"
                  value={allValues.provider_city}
                  classes={{ root: classes.labelRoot }}
                  name="provider_city"
                  onChange={changeHandler}
                  errorMessages={['']}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Autocomplete
                  options={getStates}
                  loading={loading}
                  getOptionLabel={(option) => option.text}
                  classes={{ inputRoot: classes.autoInput }}
                  className={classes.autoCompleteRoot}
                  onChange={handleAutoCompleteProviderStateChange}

                  renderInput={(params) => (
                    <ValidationTextField
                      {...params}
                      className={brandClasses.shrinkTextField}
                      style={{ width: '100%' }}
                      label="State"
                      placeholder="Enter state"
                      variant="outlined"
                      validators={['required']}
                      name="provider_state"
                      // onChange={changeHandler}
                      errorMessages={['']}
                      value={allValues.provider_state}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <ValidationTextField
                  className={brandClasses.shrinkTextField}
                  label="Zip Code"
                  placeholder="Enter zip code"
                  validators={['required']}
                  variant="outlined"
                  value={allValues.provider_zip_code}
                  classes={{ root: classes.labelRoot }}
                  name="provider_zip_code"
                  onChange={changeHandler}
                  errorMessages={['']}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <div className={brandClasses.uploadContanier}>
                  <Typography className={brandClasses.uploadTitle}>Provider Signature</Typography>
                  {imgState.imgURL
                    ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                    : allValues.provider_photo
                      ? <img src={apiUrl + allValues.provider_photo} className={brandClasses.uploadedPhoto} alt="img" />
                      :
                      <>&ensp;</>
                    // <Typography className={brandClasses.uploadDesc}>Upload profile image</Typography>
                  }
                  <div className={brandClasses.uploadImageContainer}>
                    <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file2" onChange={handlePhotoChange} />
                    <label htmlFor="icon-button-file2" style={{ cursor: 'pointer' }}>
                      <img src="/images/svg/UploadPhoto.svg" alt="" />
                      <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file2" />
                    </label>
                  </div>
                </div>

              </Grid>


            </Grid>
          </div>


        </div>

        <div>
          <Typography variant="h4" className={classes.operationTitle}>
            {'Operation Details'}
          </Typography>
          <Typography className={classes.operationDescription}>
            Select days that your organization is open and provide the correct
            operating hours
          </Typography>
          {daysData.map((day, indx) => (
            <Accordion
              expanded={expanded === `panel${indx}`}
              key={indx}
              onChange={handleAccordianChange(`panel${indx}`)}
              classes={{ expanded: classes.accExpanded }}>
              <AccordionSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                className={
                  indx % 2 === 0
                    ? classes.accordion
                    : clsx(classes.accordion, classes.rowSky)
                }
                classes={{ content: classes.accordionSummary }}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center">
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleDayActive(indx)}
                        name={day.day_name}
                        checked={day.active}
                      />
                    }
                    label={day.day_name}
                    className={classes.dayCheckbox}
                  /> */}
                  <div className={classes.dayCheckbox}>
                    {day.day_name}
                    {
                      expanded === `panel${indx}` ?
                        <img src="/images/svg/chevron_blue_down.svg" style={{ height: 6 }} alt="" />
                        :
                        <img src="/images/svg/chevron_blue_right.svg" style={{ height: 10 }} alt="" />
                    }

                  </div>
                  <Typography variant="h6" className={classes.timeText}>
                    {day.active
                      ? day.opens24hours
                        ? 'Opens 24 Hours'
                        : moment(day.start_time, 'hh:mm A').format('hh:mm A') +
                        ' - ' +
                        moment(day.end_time, 'hh:mm A').format('hh:mm A')
                      : 'Closed'}
                  </Typography>
                  <Typography variant="h6" className={classes.stationsText}>
                    Stations: {day.stations}
                  </Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails
                className={classes.root}
                classes={{ root: classes.accordionDetails }}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center">
                  <Grid item style={{ width: 130 }}></Grid>
                  <Grid item>
                    {/* {!day.opens24hours && ( */}
                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center">
                        {day.editable ? (
                          <>
                            <Grid
                              container
                              direction="row"
                              justify="center"
                              alignItems="center">
                                {!day.opens24hours && (
                              <MuiPickersUtilsProvider
                                libInstance={moment}
                                utils={MomentUtils}>
                                <KeyboardTimePicker
                                  value={moment(day.start_time, 'HH:mm A')}
                                  onChange={date => handleStartTimeChange(indx, date)}
                                  className={classes.timeField}
                                />
                                <Typography
                                  variant="h4"
                                  className={classes.operationDescription}>
                                  {'-'}
                                </Typography>
                                <KeyboardTimePicker
                                  value={moment(day.end_time, 'HH:mm A')}
                                  onChange={date => handleEndTimeChange(indx, date)}
                                  className={classes.timeField}
                                />
                              </MuiPickersUtilsProvider>
                                )}
                              <IconButton
                                onClick={() => handleDaysData('editable', indx, false)}>
                                <CancelOutlinedIcon />
                              </IconButton>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justify="center"
                              alignItems="center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handle24Hours(indx)}
                                    name={day.day_name}
                                    checked={day.opens24hours}
                                  />
                                }
                                label="Open 24 hours"
                                className={classes.dayCheckbox}
                              />
                            </Grid>

                          </>

                        ) : (
                            <>
                              <Typography
                                variant="h4"
                                className={classes.operationDescription}>
                                {day.start_time} - {day.end_time}

                              </Typography>
                              <IconButton
                                onClick={() => handleDaysData('editable', indx, true)}>
                                <Edit className={classes.editIcon} />
                              </IconButton>
                            </>
                          )}

                        {/* {day.editable ? (
                          <IconButton
                            onClick={() => handleDaysData('editable', indx, false)}>
                            <CancelOutlinedIcon />
                          </IconButton>
                        ) : (
                            <IconButton
                              onClick={() => handleDaysData('editable', indx, true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          )} */}
                      </Grid>
                    {/* )} */}



                  </Grid>
                  <FormControl
                    className={clsx(
                      classes.stationSelect,
                      brandClasses.shrinkTextField
                    )}
                    variant="outlined">
                    <Select
                      onChange={handleStationChange(indx)}
                      name={day.day_name}
                      value={day.stations || 0}>
                      <MenuItem value={0}>
                        <Typography className={classes.stateSelect}>
                          {'<1-20>'}
                        </Typography>
                      </MenuItem>
                      {[...Array(20)].map((_, item) => (
                        <MenuItem value={item + 1} key={item}>
                          {item + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {/* <Autocomplete
                    options={stations}
                    loading={loading}
                    getOptionLabel={(option) => option.text}
                    classes={{ inputRoot: classes.autoInput }}
                    className={classes.autoCompleteRoot}
                    onChange={handleAutoCompleteStationsChange}

                    renderInput={(params) => (
                      <ValidationTextField
                        {...params}
                        className={brandClasses.shrinkTextField}
                        style={{ width: '100%' }}
                        label="State"
                        placeholder="Enter state"
                        variant="outlined"
                        validators={['required']}
                        name="state"
                        // onChange={changeHandler}
                        errorMessages={['']}
                        value={allValues.state}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  /> */}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
          <div className={classes.footer}>
            <Button
              className={clsx(classes.submitButton, brandClasses.button)}
              //  disabled={!formState.isValid}
              //onClick={(ev) => addNewLocation(ev)}
              type="submit">
              DONE
            </Button>
          </div>
        </div>
      </ValidatorForm>
      {isLoading && (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

AddLocation.prototype = {
  clearLocations: PropTypes.func.isRequired,
};

export default connect(null, { clearLocations })(AddLocation);