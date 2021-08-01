import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Box, Typography, Button, CircularProgress, Grid, TextField, Select, FormControl, MenuItem, InputLabel, Checkbox, FormControlLabel, Tooltip, IconButton } from '@material-ui/core';
import brandStyles from 'theme/brand';
import { getStates, handleImage } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import DialogAlert from 'components/DialogAlert';
import SignaturePad from 'react-signature-canvas';
import { addLocation, uploadImage, apiUrl } from 'actions/api';
import { clearLocations } from 'actions/clear';
import HelpIcon from '@material-ui/icons/Help';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import * as appConstants from 'constants/appConstants';
import { Location, Edit } from 'icons';
// import CheckButton from 'components/CheckButton';
import ZipCodeInput from 'components/ZipCodeInput';
import NpiInput from 'components/NpiInput';
import LineStepProgressBar from "components/LineStepProgressBar";

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
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    '& span' : {
      fontWeight: 500
    }
  },
  skipButton: {
    textTransform: 'none',
    marginBottom: theme.spacing(4)
  },
  backTitle:{
    color: '#788081',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'center',
  },
  subTitle:{
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '34px',
    color: '#043B5D'
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
  uploadDesc:{
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '10px',
    lineHeight: '12px',
    textAlign: 'center',
    color: '#D8D8D8'
  },
  uploadImageContainer:{
    textAlign:'center',
    '& img' :{
      width: '50px'
    },
    '& p' :{
      fontFamily: 'Montserrat',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '17px',
      textAlign: 'center',
      color: '#0F84A9'
    }
  }
}));

const startTime = moment('2020-02-20 09:00');
const endTime = moment('2020-02-20 17:00');

let providerSigPad = {};

const operationDays = [
  {
    day_name: 'Sunday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
  {
    day_name: 'Monday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
  {
    day_name: 'Tuesday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
  {
    day_name: 'Wedneday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
  {
    day_name: 'Thursday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
  {
    day_name: 'Friday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
  {
    day_name: 'Saturday',
    active: false,
    opens24hours: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    stations: 0,
    edit: false
  },
]

const AddLocation = (props) => {
  const { updateStep, isWelcomePage, addLocation, uploadImage, clearLocations } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imgState, setImgState] = useState({});
  const [expanded, setExpanded] = useState(false);

  const [formState, setFormState] = useState({ provider: {} });
  const [operationState, setOperationState] = useState([...operationDays]);
  const labelArray = ['Location Information', 'Administrator Contact Details', 'Provider Information', 'Operation Details'];
  const history = useHistory();

  // const handleSkip = () => {
  //   updateStep();
  // }

  const handleDialogClose = () => {
    setDialogOpen(false);
    updateStep();
  }

  const handleDialogAction = () => {
    setDialogOpen(false);
    setFormState({ provider: {} });
    // setOperationState(operationDays);
    window.scrollTo(0, 0);
  }

  // const handleNotApplicableChange = e => {
  //   e.persist();
  //   let temp = formState.provider;
  //   ['name', 'phone', 'npi', 'email', 'address', 'city', 'state', 'zip_code']
  //     .forEach(key => {
  //       if (key !== '_id')
  //         if (e.target.checked)
  //           temp[key] = 'n/a';
  //         else
  //           temp[key] = '';
  //     });
  //   setFormState({ ...formState, temp });
  // };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleProviderChange = e => {
    e.persist();
    let temp = formState.provider;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  }

  const handleOperationChange = index => event => {
    event.persist();
    let operations = [...operationState];
    // let index = operationState.findIndex(o => o.day_name === event.target.name);
    if (event.target.type === 'checkbox')
      operations[index].active = event.target.checked;
    else
      operations[index].stations = event.target.value;
    setOperationState(operations);
  };

  const handleStartTimeChange = index => (date) => {
    let operations = [...operationState];
    operations[index].displayStartTime = date; // moment(date).toString()
    operations[index].start_time = moment(date).format('HH:mm');
    setOperationState(operations);
  };

  const handleEndTimeChange = index => (date) => {
    let operations = [...operationState];
    operations[index].displayEndTime = date; // moment(date).toString()
    operations[index].end_time = moment(date).format('HH:mm');
    setOperationState(operations);
  };

  const handleDayEdit = (index, value) => {
    let operations = [...operationState];
    operations[index].edit = value;
    setOperationState(operations);
  };

  const handleClosedChange = index => event => {
    event.persist();
    let operations = [...operationState];
    operations[index].active = !event.target.checked;
    setOperationState(operations);
  };

  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
  }

  const providerSigClear = () => {
    providerSigPad.clear();
  };

  const handleAccordianChange = index => (event, isExpanded) => {
    setExpanded(isExpanded ? `panel${index}` : false);
    if (isExpanded) {
      let operations = [...operationState];
      operations[index].active = true;
      setOperationState(operations);
    }
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
    if (!/^\d{5}[-\s]?(?:\d{4})?$/.test(formState.zip_code.trim()))
      return setDisplayError(`Invalid Zip code ${formState.zip_code}.`);
    if (formState.provider.npi.trim().length < 10)
      return setDisplayError(`Invalid Provider NPI number.`);

    if (operationState.every(x => !x.active)) {
      setDisplayError(`Please select the Operation days.`);
      return;
    } else {
      if (operationState.some(x => x.active && !x.stations)) {
        setDisplayError(`Please add the stations for selected Operation days.`);
        return;
      } else {
        setLoading(true);
        // check if image uploaded
        if (imgState.imagePath) {
          const locationLogoData = new FormData();
          locationLogoData.append('uploadImage', imgState.imagePath);
          const resLocationLogo = await uploadImage(locationLogoData);
          if (resLocationLogo.success) {
            formState.site_logo = '/images/' + resLocationLogo.data;
            // check is signature added
            if (!providerSigPad.isEmpty()) {
              let providerSigFormData = new FormData();
              let providerSigBlob = dataURLtoBlob(providerSigPad.getTrimmedCanvas().toDataURL('image/png'));
              providerSigFormData.append('uploadImage', providerSigBlob, 'provider-signature.png');
              const resProviderSig = await uploadImage(providerSigFormData);
              if (resProviderSig.success) {
                formState.provider.signature = '/images/' + resProviderSig.data;
                createLocation();
              } else {
                setLoading(false);
              }
            } else {
              createLocation();
            }
          } else {
            setLoading(false);
          }
        } else {
          createLocation();
        }
      }
    }
  };

  const createLocation = async () => {
    formState.operations = operationState;
    const res = await addLocation(formState);
    setLoading(false);
    if (res.success) {
      clearLocations();
      clearMessage();
      if (isWelcomePage)
        setDialogOpen(true);
      else
        history.push('/site-manager/location-manager');
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
                {'LOCATION MANAGER'}
              </Typography>
            </Grid>
          )}
          <div className={classes.header}>
            <Typography variant="h3" className={classes.headerTitle}>
              <Location /> LOCATION MANAGER  |  <span>ADD LOCATION</span>
              <sup>
                <Tooltip title="Add Locaition" placement="right-start">
                  <HelpIcon />
                </Tooltip>
              </sup>
            </Typography>
            
          </div>
          <Grid container >
            <Box display="flex" padding="12px 0px 16px" > 
              <Button component={Link} to="/site-manager/location-manager">
                <ChevronLeftIcon style={{color:"#788081"}}/> 
                <Typography className={classes.backTitle}>Back to location manager</Typography>
              </Button>
            </Box>
            <Grid item xs={12} className="text-left d-flex">
              <LineStepProgressBar activeIndex={0} labels={labelArray} totalCount={4} />
            </Grid>
          </Grid>
          <Box margin="8px 0px 16px">
            <Typography className={classes.subTitle}>Input location details</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box >
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
                <br /><br />
                <TextField
                  type="text"
                  label="Admin Office Phone"
                  placeholder="Enter phone number"
                  name="admin_office_phone"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.admin_office_phone || ''}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box height="100%">
                <div className={brandClasses.uploadContanier} style={{height:'100%'}}>
                  <Typography className={brandClasses.uploadTitle}>Site Logo</Typography>
                  <Typography className={brandClasses.uploadDesc}>Select your file or drag and drop it here</Typography>
                  <div className={classes.uploadImageContainer}>
                    <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file" onChange={handlePhotoChange} />
                    <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                      <img src="/images/svg/upload_cloud.svg" alt="" />
                      <Typography>UPLOAD<br />PHOTO</Typography>
                      {imgCompressionLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                    </label>
                  </div>
                </div>
              </Box>              
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box border="dotted 1px #D8D8D8" width="110px" height="110px" display="flex" alignItems="center" justifyContent="center">
                {imgState.imgURL
                  ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" width="100%" />
                  : formState.site_logo
                    ? <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" width="100%" />
                    : <Typography className={classes.uploadDesc}>PHOTO<br /> PREVIEW</Typography>
                }
              </Box>
              
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <TextField
                type="text"
                label="Address 2"
                placeholder="Enter address"
                name="address2"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.address2 || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
          </Grid>
{/* -------- */}


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
                  type="text"
                  label="Admin Office Phone"
                  placeholder="Enter phone number"
                  name="admin_office_phone"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.admin_office_phone || ''}
                  required
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
                  name="admin_office_ext"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.admin_office_ext || ''}
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
            <Grid item container spacing={2} xs={12} sm={5}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  required
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>State</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="State* "
                    name="state"
                    displayEmpty
                    value={formState.state || ''}
                  >
                    <MenuItem value=''>
                      <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                    </MenuItem>
                    {getStates.map((state, index) => (
                      <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item container xs={12} sm={6}>
                <ZipCodeInput
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
                label="County"
                placeholder="Enter County"
                name="county"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.county || ''}
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
                  label="EOC Office Phone"
                  placeholder="Enter phone number"
                  name="eoc_office_phone"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.eoc_office_phone || ''}
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
                  name="eoc_ext"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.eoc_ext || ''}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                type="text"
                label="Office Phone Number"
                placeholder="Enter phone number"
                name="office_phone"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.office_phone || ''}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                type="email"
                label="EOC Email"
                placeholder="Enter email address"
                name="eoc_email"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.eoc_email || ''}
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Is Location Healthcare Related</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Is Location Healthcare Related* "
                  name="is_healthcare_related"
                  displayEmpty
                  value={formState.is_healthcare_related || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select Option</Typography>
                  </MenuItem>
                  <MenuItem value={'Yes'}>Yes</MenuItem>
                  <MenuItem value={'No'}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Is this a resident congregate setting</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Is this a resident congregate setting* "
                  name="is_resident_congregate_setting"
                  displayEmpty
                  value={formState.is_resident_congregate_setting || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select Option</Typography>
                  </MenuItem>
                  <MenuItem value={'Yes'}>Yes</MenuItem>
                  <MenuItem value={'No'}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={5}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Testing Protocol</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Testing Protocol* "
                  name="testing_protocol"
                  displayEmpty
                  value={formState.testing_protocol || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select Testing Protocol</Typography>
                  </MenuItem>
                  {getTestingProtocols.map((protocol, index) => (
                    <MenuItem key={index} value={protocol}>{protocol}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} sm={5}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Vaccine Protocol</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Vaccine Protocol* "
                  name="vaccine_protocol"
                  displayEmpty
                  value={formState.vaccine_protocol || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select Vaccine Protocol</Typography>
                  </MenuItem>
                  {getVaccineProtocols.map((protocol, index) => (
                    <MenuItem key={index} value={protocol}>{protocol}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={5}>
              <div className={brandClasses.uploadContanier}>
                <Typography className={brandClasses.uploadTitle}>Site Logo</Typography>
                {imgState.imgURL
                  ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                  : formState.site_logo
                    ? <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                    : <Typography className={brandClasses.uploadDesc}>Upload Site Logo</Typography>
                }
                <div className={brandClasses.uploadImageContainer}>
                  <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file" onChange={handlePhotoChange} />
                  <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                    <img src="/images/svg/UploadPhoto.svg" alt="" />
                    <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                    {imgCompressionLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </label>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div variant="h3" className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5">{'Provider Details'}</Typography>
          {/* <Typography variant="h5" className={brandClasses.naTitle}>{'Provider Details'}</Typography>
          <CheckButton
            label={"Not Applicable"}
            name={'provider'}
            className={brandClasses.naCheckbox}
            onChange={handleNotApplicableChange}
          />
          <Typography></Typography> */}
        </div>

        <div className={classes.locationRoot}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <TextField
                type="text"
                label="Provider First Name"
                placeholder="Enter provider’s first name"
                name="first_name"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.first_name || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="text"
                label="Provider Last Name"
                placeholder="Enter provider’s last name"
                name="last_name"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.last_name || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="text"
                label="Phone"
                placeholder="Enter phone number"
                name="phone"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.phone || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NpiInput
                label="NPI"
                placeholder="Enter NPI"
                name="npi"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.npi || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="text"
                label="Email Address"
                placeholder="Enter email"
                name="email"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.email || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="text"
                label="Address"
                placeholder="Enter address"
                name="address"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.address || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                type="text"
                label="City"
                placeholder="Enter city"
                name="city"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.city || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>State</InputLabel>
                <Select
                  onChange={handleProviderChange}
                  label="State* "
                  name="state"
                  displayEmpty
                  value={formState.provider.state || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                  </MenuItem>
                  {getStates.map((state, index) => (
                    <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <ZipCodeInput
                label="Zip Code"
                placeholder="Enter zip code"
                name="zip_code"
                className={brandClasses.shrinkTextField}
                onChange={handleProviderChange}
                value={formState.provider.zip_code || ''}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={brandClasses.signBoxContanier}>
                <Typography variant="h5" className={brandClasses.signBoxTitle}> Provider Signature </Typography>
                <Typography variant="h5" className={brandClasses.signBoxDesc}>Provider sign here</Typography>
                <SignaturePad
                  canvasProps={{ className: brandClasses.sigPad }}
                  clearOnResize={false}
                  ref={(ref) => { providerSigPad = ref }}
                />
              </div>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                style={{ margin: 'auto' }}
                onClick={providerSigClear}
              >
                {'Clear Signature'}
              </Button>
            </Grid>
          </Grid>
        </div>

        <Typography variant="h3" className={classes.operationTitle}>
          {'Operation Details'}
        </Typography>
        <Typography variant="h5" className={classes.operationDescription}>
          {'Select days that your organization is open, provide the correct operating hours, and select the number of stations needed. Each station allows for 5 tests per hour to be scheduled.'}
        </Typography>

        {operationState.map((day, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleAccordianChange(index)}
            classes={{ expanded: classes.accExpanded }}
          >
            <AccordionSummary
              className={clsx(classes.accordion, index % 2 === 0 && brandClasses.tableRow2)}
              classes={{ content: classes.accordionSummary }}
            >
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                {/* <FormControlLabel
                  control={<Checkbox onChange={handleOperationChange(index)} name={day.day_name} checked={day.active} />}
                  label={day.day_name}
                  className={classes.dayCheckbox}
                /> */}
                <div className={classes.dayCheckbox}>
                  {day.day_name}
                  {expanded === `panel${index}`
                    ? <img src="/images/svg/chevron_blue_down.svg" style={{ height: 6 }} alt="" />
                    : <img src="/images/svg/chevron_blue_right.svg" style={{ height: 10 }} alt="" />
                  }
                </div>
                <Typography variant="h5" className={classes.timeText}>
                  {day.active
                    ? day.opens24hours
                      ? 'Opens 24 Hours'
                      : moment(day.displayStartTime).format('LT') + ' - ' + moment(day.displayEndTime).format('LT')
                    : 'Closed'
                  }
                </Typography>
                <Typography variant="h5" className={classes.stationsText}>
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
                  {day.edit
                    ?
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                        <KeyboardTimePicker
                          value={day.displayStartTime}
                          onChange={handleStartTimeChange(index)}
                          className={classes.timeField}
                        />
                        <Typography variant="h5" className={classes.operationDescription}>
                          {'-'}
                        </Typography>
                        <KeyboardTimePicker
                          value={day.displayEndTime}
                          onChange={handleEndTimeChange(index)}
                          className={classes.timeField}
                        // minDate={day.displayStartTime}
                        />
                      </MuiPickersUtilsProvider>
                      <IconButton onClick={() => handleDayEdit(index, false)}>
                        <CancelOutlinedIcon className={classes.editIcon} />
                      </IconButton>
                    </Grid>
                    :
                    <Typography
                      variant="h5"
                      className={classes.timeDuration}
                      style={{ textDecoration: 'underline' }}
                    >
                      {moment(day.displayStartTime).format('LT') + ' - ' + moment(day.displayEndTime).format('LT')}
                      <IconButton onClick={() => handleDayEdit(index, true)}>
                        <Edit className={classes.editIcon} />
                      </IconButton>
                    </Typography>
                  }
                  <FormControlLabel
                    control={<Checkbox onChange={handleClosedChange(index)} checked={!day.active} />}
                    label="Closed"
                    className={classes.dayCheckbox}
                  />
                </Grid>
                <FormControl
                  className={clsx(classes.stationSelect, brandClasses.shrinkTextField)}
                  variant="outlined"
                >
                  <Select
                    onChange={handleOperationChange(index)}
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

AddLocation.propTypes = {
  updateStep: PropTypes.func,
  isWelcomePage: PropTypes.bool,
  addLocation: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  clearLocations: PropTypes.func.isRequired,
};

export default connect(null, { addLocation, uploadImage, clearLocations })(AddLocation);