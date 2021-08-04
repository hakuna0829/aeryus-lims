import React, { useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box, Typography, Button, CircularProgress, Grid, TextField, Checkbox, FormControlLabel, Link as RouterLink
}
  from '@material-ui/core';
import brandStyles from 'theme/brand';
import { handleImage } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import DialogAlert from 'components/DialogAlert';
import DialogAlertOperationConfirmation from 'components/DialogAlert';
import IOSSwitch from 'components/IOSSwitch';
// import SignaturePad from 'react-signature-canvas';
import { addLocation, uploadImage, apiUrl } from 'actions/api';
import { clearLocations } from 'actions/clear';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
// import moment from 'moment';
import * as appConstants from 'constants/appConstants';
import { Users } from 'icons';
// import CheckButton from 'components/CheckButton';
// import ZipCodeInput from 'components/ZipCodeInput';
import NpiInput from 'components/NpiInput';
import TextButton from 'components/Button/TextButton';
import CloseIcon from '@material-ui/icons/Close';
import LineStepProgressBar from 'components/LineStepProgressBar';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import NumberFormat from 'react-number-format';
const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  locationRoot: {
    margin: '32px 16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: theme.palette.brand,
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '& span': {
      fontWeight: 500
    }
  },
  skipButton: {
    textTransform: 'none',
    marginBottom: theme.spacing(4)
  },
  backTitle: {
    color: theme.palette.brandDisableGray,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'center',
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '34px',
    color: theme.palette.brand
  },
  operationTitle: {
    backgroundColor: 'rgba(15,132,169,0.8)',
    color: theme.palette.white,
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(2),
  },
  timeDuration: {
    color: theme.palette.brandDark,
    display: 'flex',
    alignItems: 'center'
    // padding: theme.spacing(1),
  },
  slotSubHeader: {
    marginLeft: '30px',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#D8D8D8',//'#043B5D',
    fontWeight: 600,
    textAlign: 'center',
  },
  slotSubHeaderChecked: {
    marginLeft: '30px',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#043B5D',
    fontWeight: 600,
    textAlign: 'center',
  },
  slotSubHeaderError: {
    marginLeft: '30px',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#DD2525;',
    fontWeight: 600,
    textAlign: 'center',
  },
  slotSubHeaderErrorContent: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    color: '#DD2525'
  },
  filledInputRoot: {
    background: '#FFFFFF',
    border: '1px solid #D8D8D8',
    boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    marginBottom: '8px',
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&::before': {
      borderBottom: 'none'
    },
    '&:hover': {
      borderBottom: '1px solid #D8D8D8',
      background: '#FFFFFF',
      '&::before': {
        borderBottom: 'none'
      },
    },
    '& input': {
      padding: '5px 8px',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: '14px',
      '&:focus': {
        background: '#FFFFFF',
        borderRadius: '5px',
        '&::before': {
          borderBottom: 'none'
        },
      },
      '&:hover': {
        // borderBottom:'none',
        // background: '#FFFFFF',
      },
    }
  },
  filledInputRootChecked: {
    background: '#FFFFFF',
    border: '1px solid #043B5D',
    boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    marginBottom: '8px',
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&::before': {
      borderBottom: 'none'
    },
    '&:hover': {
      borderBottom: '1px solid #043B5D',
      background: '#FFFFFF',
      '&::before': {
        borderBottom: 'none'
      },
    },
    '& input': {
      padding: '5px 8px',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: '14px',
      '&:focus': {
        background: '#FFFFFF',
        borderRadius: '5px',
        '&::before': {
          borderBottom: 'none'
        },
      },
      '&:hover': {
        // borderBottom:'none',
        // background: '#FFFFFF',
      },
    }
  },
  filledInputRootError: {
    background: '#FFFFFF',
    border: '1px solid #e53935',
    boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    marginBottom: '8px',
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&::before': {
      borderBottom: 'none'
    },
    '&:hover': {
      borderBottom: '1px solid #043B5D',
      background: '#FFFFFF',
      '&::before': {
        borderBottom: 'none'
      },
    },
    '& input': {
      padding: '5px 8px',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: '14px',
      '&:focus': {
        background: '#FFFFFF',
        borderRadius: '5px',
        '&::before': {
          borderBottom: 'none'
        },
      },
      '&:hover': {
        // borderBottom:'none',
        // background: '#FFFFFF',
      },
    }
  },
  providerCheckbox: {
    color: theme.palette.brand,
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brand
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brand
    }
  },
  dayCheckboxChecked: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(0),
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
  dayCheckbox: {
    color: '#D8D8D8',
    marginLeft: theme.spacing(0),
    width: 150,
    alignItems: 'center',
    display: 'flex',
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: '#D8D8D8'
    },
    '& .MuiSvgIcon-root': {
      color: '#0F84A9'
    }
  },
  daySlotCheckbox: {
    color: '#0f84a959',
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: '#0F84A9'
    }
  },
  daySlotCheckboxhecked: {
    color: theme.palette.brandDark,
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  timeText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    '& p': {
      color: theme.palette.blueDark,
      fontSize: '16px',
      fontWeight: 500
    }
  },
  daySlotCheckboxError: {
    color: '#e53935',
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: '#e53935'
    }
  },
  stationsText: {
    color: '#e53935',
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
      width: '75px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark,
    },
    '& button': {
      padding: 0
    }
  },
  accExpanded: {
    margin: '0 !important',
    // borderBottom: '1px solid #0F84A9'
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
    fontSize: '1rem',
    padding: '12px 0px 12px 12px',
    '& svg': {
      fontSize: '1.2rem',
    }
  },
  uploadDesc: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '10px',
    lineHeight: '12px',
    textAlign: 'center',
    color: '#D8D8D8'
  },
  uploadImageContainer: {
    textAlign: 'center',
    '& img': {
      width: '50px'
    },
    '& p': {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '17px',
      textAlign: 'center',
      color: theme.palette.brand
    }
  },
  greenBtn: {
    backgroundColor: '#016A73',
    color: theme.palette.white,
    textTransform: 'uppercase',
    fontSize: '16px',
    borderRadius: '10px',
    // '&:hover': {
    //   backgroundColor: theme.palette.brandDark
    // }
  },
  sendIcon: {
    '& svg': {
      width: '20px'
    }
  },
  operationContainer: {
    border: `solid ${theme.palette.brand} 1px`,
    borderRadius: '8px',
    boxShadow: '6.35934px 2.54374px 11.4468px 2.54374px rgba(4, 59, 93, 0.15)',
    padding: '0px 0 12px'
  },
  operationTimes: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '22px',
    lineHeight: '27px',
    color: '#0F84A9',
    margin: '0 0 12px 32px'
  },
  operationHeader: {
    fontFamily: 'Montserrat',
    background: '#5E89A2', color: 'white', fontSize: '20px', lineHeight: '29px', padding: '8px 32px',
    borderRadius: '8px 8px 0px 0px'
  },
  dayRow: {
    width: 200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eoc_closeIcon: {
    color: '#788081',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '& svg': {
      cursor: 'pointer'
    }
  },
  interfaceBtnRow:{
    display:'flex', 
    justifyContent:'space-around',
    '& .endpoint.MuiButton-contained': {
      backgroundColor: theme.palette.brandGreen,
      color: theme.palette.white
    },
    '& .username.MuiButton-contained': {
      backgroundColor: theme.palette.brandYellow,
      color: theme.palette.white
    },
    '& .password.MuiButton-contained': {
      backgroundColor: theme.palette.brandBlue,
      color: theme.palette.white
    },
    
  }
}));

// const startTime = moment('2020-02-20 09:00');
// const endTime = moment('2020-02-20 10:00');

const OperationValuesInit = [
  {
    name: 'Interface 1',
    active: true,
  },
  {
    name: 'Interface 2',
    active: false,
  },
  {
    name: 'Interface 3',
    active: false,
  },
  {
    name: 'Interface 4',
    active: false,
  }
];

const OperationErrorsInit = [...Array(7)].map((e) => (
  {
    error: false,
    timeSlotError: [
      {
        vaccine: false,
        pcr: false,
        antigen: false,
        error: null,
      }
    ]
  }
));

const labelArray = ['Client Information', 'Client Contact Details', 'Provider Information', 'Interface Details'];

const AddLocation = (props) => {
  const { isWelcomePage, updateStep, clearLocations, addLocation, uploadImage, 
    // getInventoryAvailable 
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const history = useHistory();

  const [step, setStep] = useState(3);
  const [eocView, setEocView] = useState(false);
  const [timeSlotError] = useState(null);
  // const [inventory, setInventory] = useState([]);
  const [selectedInventory] = useState([]);
  const [inventoryError] = useState(null);

  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOperationOpen, setDialogOperationOpen] = useState(false);
  const [imgState, setImgState] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [formState, setFormState] = useState({ provider: { send_signature_request_email: true, send_signature_request_sms: false } });

  const [operationState, setOperationState] = useState([...OperationValuesInit]);
  const [operationErrorsState] = useState(JSON.parse(JSON.stringify(OperationErrorsInit)));
 

  const handleChange = e => {
    e.persist();
    if (e.target.type === 'checkbox') {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: !e.target.checked
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleProviderChange = e => {
    e.persist();
    let temp = formState.provider;
    if (e.target.type === 'checkbox') {
      temp[e.target.name] = e.target.checked;
      setFormState({ ...formState, temp });
    } else {
      temp[e.target.name] = e.target.value;
      setFormState({ ...formState, temp });
    }
  };


  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
  };

  const handleAccordianChange = index => (event, isExpanded) => {
    setExpanded(isExpanded ? `panel${index}` : false);
    // if (isExpanded) {
    //   let operations = [...operationState];
    //   operations[index].active = true;
    //   operations[index].time_slots[0].checked = true;
    //   setOperationState(operations);
    // }
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

  
  const toggleEocView = () => {
    setEocView(!eocView);
  };

  const handleSkip = () => {
    updateStep();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    updateStep();
  };

  const handleDialogAction = () => {
    setDialogOpen(false);
    setFormState({ provider: { send_signature_request_email: false, send_signature_request_sms: false } });
    setStep(0);
    setOperationState(OperationValuesInit);
    window.scrollTo(0, 0);
  };

  const handleDialogOperationAction = () => {
    setDialogOperationOpen(false);
    saveLocation(true);
  };

  const handleDialogOperationClose = () => {
    setDialogOperationOpen(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    saveLocation();
  };

  const saveLocation = async (isForce) => {
    clearMessage();
    if (step === 0) {
      // if (!/^\d{5}[-\s]?(?:\d{4})?$/.test(formState.zip_code.trim()))
      //   return setDisplayError(`Invalid Zip code ${formState.zip_code}.`);
      setStep(step + 1);
    } else if (step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      if (!formState.provider.send_signature_request_email && !formState.provider.send_signature_request_sms)
        return setDisplayError('Please check Email or Text to Send signature request');
      if (formState.provider.npi.trim().length < 10)
        return setDisplayError('Invalid Provider NPI number.');
      setStep(step + 1);
    } else {
      if (inventoryError && !isForce) {
        setDisplayError('Please check the inventory errors');
        setDialogOperationOpen(true);
        return;
      }
      if (timeSlotError) {
        setDisplayError('Please check all time slots for overlap of timings.');
        return;
      }
      if (operationErrorsState.some(e => e.error)) {
        setDisplayError('Please check all time slots for any errors');
        return;
      }
      formState.inventory_ids = selectedInventory.map(i => i._id);
      setLoading(true);
      // check if image uploaded
      if (imgState.imagePath) {
        const locationLogoData = new FormData();
        locationLogoData.append('uploadImage', imgState.imagePath);
        const resLocationLogo = await uploadImage(locationLogoData);
        if (resLocationLogo.success) {
          formState.site_logo = '/images/' + resLocationLogo.data;
          createLocation();
        } else {
          setLoading(false);
        }
      } else {
        createLocation();
      }
    }
  };

  const createLocation = async () => {
    formState.hours_of_operations = operationState;
    setLoading(true);
    const res = await addLocation(formState);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      clearLocations();
      clearMessage();
      if (isWelcomePage)
        setDialogOpen(true);
      else
        history.push('/site-manager/location-manager');
    }
  };

  const handleCheckChange = e => {
    e.persist();
    var tempInterfaces = operationState;
    tempInterfaces.map((inter) => {
      if(inter.name === e.target.name) 
        inter.active = !inter.active;
      return inter;
    })
    console.log('tempInterfaces', tempInterfaces)
    setOperationState(tempInterfaces);
  };

  // eslint-disable-next-line react/no-multi-comp
  const InterfaceBtnRow = (props) => {

    return (
      <div className={classes.interfaceBtnRow} >
        <Button variant="contained" className={props.active ? 'endpoint' : '' } disabled={!props.active}>End point</Button>
        <Button variant="contained" className={props.active ? "username" : '' } disabled={!props.active}>User Name</Button>
        <Button variant="contained" className={props.active ? "password" : '' } disabled={!props.active}>Password</Button>
      </div>
    );    
  }

  return (
    <div>
      {/* <form onSubmit={handleSubmit} > */}
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
          <Typography
            className={classes.headerTitle}
            variant="h3"
          >
            <Users /> &nbsp; CLIENT MANAGER  | &nbsp;  <span>ADD CLIENT</span>
          </Typography>
          {isWelcomePage && (
            <RouterLink
              className={clsx(classes.skipButton, brandClasses.brandGrayText)}
              component={Button}
              onClick={handleSkip}
              variant="h6"
            >
              {'Skip for now'}
            </RouterLink>
          )}
        </div>

        <Grid container >
          <Box
            display="flex"
            padding="12px 0px 16px"
          >
            <Button
              component={Link}
              to="/site-manager/location-manager"
            >
              <ChevronLeftIcon style={{ color: '#788081' }} />
              <Typography className={classes.backTitle}>Back to location manager</Typography>
            </Button>
          </Box>
          <Grid
            className="text-left d-flex"
            item
            xs={12}
          >
            <LineStepProgressBar
              activeIndex={step}
              handleStep={setStep}
              labels={labelArray}
              totalCount={4}
            />
          </Grid>
        </Grid>

        {step === 0 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography
                className={classes.subTitle}
                variant="h6"
              >Input Client Details</Typography>
            </Box>
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                sm={4}
                xs={12}
              >
                <Box >
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    label="Client Name"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter client name"
                    required
                    type="text"
                    value={formState.name || ''}
                    variant="outlined"
                  />
                  <br /><br />
                  
                  <NumberFormat
                    InputLabelProps={{ shrink: true }}
                    className={brandClasses.shrinkTextField}
                    customInput={TextField}
                    fullWidth
                    label="Client Phone Number"
                    mask=" "
                    name="phone"
                    onChange={handleChange}
                    placeholder="Enter client phone number"
                    required
                    type="tel"
                    value={formState.phone || ''}
                    variant="outlined"
                  />
                  <br /><br />
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    label="Client Email Address"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                    type="email"
                    value={formState.email || ''}
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <Box >
                  <div
                    className={brandClasses.uploadContanier}
                    style={{ height: '100%' }}
                  >
                    <Typography className={brandClasses.uploadTitle}>Upload Client Logo</Typography>
                    <Typography
                      className={brandClasses.uploadDesc}
                      display="inline"
                      style={{ padding: '4px' }}
                    >Select your file or drag and drop it here</Typography>
                    <div className={classes.uploadImageContainer}>
                      <input
                        accept="image/*"
                        className={brandClasses.uploadInput}
                        id="icon-button-file"
                        onChange={handlePhotoChange}
                        type="file"
                      />
                      <label
                        htmlFor="icon-button-file"
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          alt=""
                          src="/images/svg/upload_cloud.svg"
                        />
                        <Typography className={brandClasses.uploadPhotoLabel}>UPLOAD<br />PHOTO</Typography>
                        {imgCompressionLoading ? <CircularProgress
                          className={brandClasses.progressSpinner}
                          size={20}
                        /> : ''}
                      </label>
                    </div>
                  </div>
                </Box>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <Box
                  alignItems="center"
                  border="dotted 1px #D8D8D8"
                  display="flex"
                  height="110px"
                  justifyContent="center"
                  width="110px"
                >
                  {imgState.imgURL
                    ? <img
                      src={imgState.imgURL}
                        className={brandClasses.uploadedPhoto}
                        alt="img"
                        width="100%"
                      />
                    : formState.site_logo
                      ? <img
                        src={apiUrl + formState.site_logo}
                          className={brandClasses.uploadedPhoto}
                          alt="img"
                          width="100%"
                        />
                      : <Typography className={classes.uploadDesc}>PHOTO<br /> PREVIEW</Typography>
                  }
                </Box>
              </Grid>
              <Grid
                item
                  xs={12}
                  sm={8}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                  type="text"
                  value={formState.address || ''}
                  variant="outlined"
                />
              </Grid>
            
            </Grid>
            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert
                onClose={() => { closeErrorMessage() }}
                severity="error"
              >{displayError}</Alert> : null}
              {displaySuccess ? <Alert
                onClose={() => { closeSuccessMessage() }}
                severity="success"
              >{displaySuccess}</Alert> : null}
            </div>
            <div className={brandClasses.footerButton}>
              <TextButton
                disabled={loading}
                type="submit"
              >
                NEXT {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography className={classes.subTitle}>Input Client Details</Typography>
            </Box>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Location Name"
                  name="location_name"
                  onChange={handleChange}
                  placeholder="Enter location name"
                  required
                  type="text"
                  value={formState.location_name || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <NumberFormat
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  customInput={TextField}
                  fullWidth
                  label="Location Phone Number"
                  mask=" "
                  name="admin_office_phone"
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  type="tel"
                  value={formState.admin_office_phone || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              />
              
              <Grid
                className="mb-1"
                item
                sm={12}
              >
                <TextButton
                  category="Icon"
                  disabled={eocView}
                  onClick={toggleEocView}
                >
                  <AddIcon />
                  ADD Client location
                </TextButton>
              </Grid>
            </Grid>

            {eocView && (
              <>
                <Box margin="8px 0px 16px">
                  <Typography className={classes.subTitle} />
                </Box>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    sm={4}
                    xs={12}
                  >
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      className={brandClasses.shrinkTextField}
                      fullWidth
                      label="Location Name"
                      name="eoc_location_name"
                      onChange={handleChange}
                      placeholder="Enter location name"
                      required
                      type="text"
                      value={formState.eoc_location_name || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                  >
                    <NumberFormat
                      InputLabelProps={{ shrink: true }}
                      className={brandClasses.shrinkTextField}
                      customInput={TextField}
                      fullWidth
                      label="Location Phone Number"
                      mask=" "
                      name="eoc_office_phone"
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      type="tel"
                      value={formState.eoc_office_phone || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    className={classes.eoc_closeIcon}
                    item
                    sm={2}
                    xs={12}
                  >
                    <CloseIcon onClick={toggleEocView} />
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    xs={12}
                  />
                  <Grid
                    item
                    sm={8}
                    xs={12}
                  >
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      className={brandClasses.shrinkTextField}
                      fullWidth
                      label="Address"
                      name="eoc_address"
                      onChange={handleChange}
                      placeholder="Enter address"
                      required
                      type="text"
                      value={formState.eoc_address || ''}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid
                    item
                    sm={4}
                    xs={12}
                  />
                </Grid>
              </>
            )}
            <div className={brandClasses.footerButton}>
              <TextButton
                disabled={loading}
                type="submit"
              >
                NEXT {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography className={classes.subTitle}>Input Provider Information</Typography>
            </Box>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Provider Name"
                  name="name"
                  onChange={handleProviderChange}
                  placeholder="Enter name"
                  required
                  type="text"
                  value={formState.provider.name || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <NumberFormat
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  customInput={TextField}
                  fullWidth
                  label="Provider Phone Number"
                  mask=" "
                  name="phone"
                  onChange={handleProviderChange}
                  placeholder="Enter phone number"
                  required
                  type="tel"
                  value={formState.provider.phone || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              />

              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Provider Email"
                  name="email"
                  onChange={handleProviderChange}
                  placeholder="Enter email"
                  required
                  type="email"
                  value={formState.provider.email || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <NpiInput
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Provider NPI Number"
                  name="npi"
                  onChange={handleProviderChange}
                  placeholder="Enter NPI"
                  required
                  value={formState.provider.npi || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              />

              <Grid
                item
                sm={8}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleProviderChange}
                  placeholder="Enter address"
                  required
                  type="text"
                  value={formState.provider.address || ''}
                  variant="outlined"
                />
              </Grid>
             
              <Grid
                item
                sm={4}
                xs={12}
              />
              <Grid
                className="mb-1"
                item
                sm={12}
              >
                <Button
                  className={classes.greenBtn}
                  onClick={toggleEocView}
                  variant="contained"
                >
                  <img
                    alt="send"
                    src="/images/svg/send.svg"
                    style={{ width: 25, marginRight: '8px' }}
                  />
                  Send signature request
                </Button>
                {/* <TextButton onClick={toggleEocView}>
                  <img src="/images/svg/send.svg" alt="send" style={{ width: 25, marginRight: '8px' }} />
                  Send signature request
                </TextButton> */}
              </Grid>
              <Grid
                item
                sm={12}
              >
                <FormControlLabel
                  className={classes.providerCheckbox}
                  control={<Checkbox
                    checked={formState.provider.send_signature_request_email}
                    name="send_signature_request_email"
                    onChange={handleProviderChange}
                           />}
                  label="Email"
                />
                <FormControlLabel
                  className={classes.providerCheckbox}
                  control={<Checkbox
                    checked={formState.provider.send_signature_request_sms}
                    name="send_signature_request_sms"
                    onChange={handleProviderChange}
                           />}
                  label="Text message"
                />
              </Grid>
            </Grid>
            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert
                onClose={() => { closeErrorMessage() }}
                severity="error"
              >{displayError}</Alert> : null}
            </div>
            <div className={brandClasses.footerButton}>
              {/* <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
                style={{ borderRadius: '4px' }}
              >
                NEXT {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button> */}
              <TextButton
                disabled={loading}
                type="submit"
              >
                NEXT {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography className={classes.subTitle}>Add Interface</Typography>
            </Box>
            
            <Box className={classes.operationContainer}>
             
              <Grid
                className={classes.operationHeader}
                container
              >
                <Grid
                  item
                  xs={12}
                >INTERFACE OPTIONS</Grid>
              </Grid>
              {timeSlotError ? <Typography
                style={{ color: 'red', textAlign: 'center' }}
                variant="h6"
              >{timeSlotError}</Typography> : ''}
              {operationState.map((day, day_index) => (
                <Accordion
                  classes={{ expanded: classes.accExpanded }}
                  expanded={expanded === `panel${day_index}`}
                  key={day_index}
                  onChange={handleAccordianChange(day_index)}
                >
                  <AccordionSummary
                    className={clsx(classes.accordion)}
                    classes={{ content: classes.accordionSummary }}
                  >
                    <Grid
                      alignItems="center"
                      container
                      direction="row"
                      justify="space-between"
                    >
                      <Grid
                        item
                        style={{ paddingLeft: '24px' }}
                        xs={2}
                      >
                        <div className={classes.dayRow}>
                          {day.name} &ensp;
                          {
                            expanded === `panel${day_index}`
                              ? 
                              <img
                                src="/images/svg/chevron_blue_down.svg"
                                style={{ height: 12, width: 18 }}
                                alt=""
                              />
                              : 
                              <img
                                src="/images/svg/chevron_blue_right.svg"
                                style={{ height: 18, width: 12 }}
                                alt=""
                              />
                          }
                        </div>
                      </Grid>
                      <Grid
                        className={classes.timeText}
                        item
                        style={{ textAlign: 'center' }}
                        xs={7}
                      >
                        <InterfaceBtnRow active={day.active}/>
                        {/* {day.active
                          ? <Typography>Valid</Typography>
                          : <Typography style={{ color: '#D8D8D8', fontWeight: '600' }}>Closed</Typography>
                        } */}
                      </Grid>
                      <Grid
                        className={classes.timeText}
                        item
                        style={{ textAlign: 'center' }}
                        xs={3}
                      >
                        <FormControlLabel
                          control={<IOSSwitch
                            checked={day.active}
                            onChange={handleCheckChange}
                            name={day.name}
                          />}
                          required
                          labelPlacement="top"
                          classes={{ label: classes.label }}
                        />
                      </Grid>
                      
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails style={{ backgroundColor: '#F1F6F8' }}>
                    <Grid container  >
                      
                      <Grid
                        item
                        xs={12}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </Grid>
                      
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert
                onClose={() => { closeErrorMessage() }}
                severity="error"
              >{displayError}</Alert> : null}
              {displaySuccess ? <Alert
                onClose={() => { closeSuccessMessage() }}
                severity="success"
              >{displaySuccess}</Alert> : null}
            </div>
            <div className={brandClasses.footerButton}>
              {/* <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
                style={{ borderRadius: '4px' }}
              >
                DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button> */}
              <TextButton
                disabled={loading}
                type="submit"
              >
                DONE {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}
      </div>

      <DialogAlert
        message={'Do you want to Add another Location details ?'}
        onAction={handleDialogAction}
        onClose={handleDialogClose}
        open={dialogOpen}
        title={'Location saved successfully.'}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
      />

      <DialogAlertOperationConfirmation
        message={'Do you want to save without adding operation details ?'}
        onAction={handleDialogOperationAction}
        onClose={handleDialogOperationClose}
        open={dialogOperationOpen}
        title={'Are you sure?'}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
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

export default connect(null, { addLocation, uploadImage, clearLocations})(AddLocation);
