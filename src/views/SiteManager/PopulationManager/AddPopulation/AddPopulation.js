import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Link, useHistory } from 'react-router-dom';
import {
  Typography, Button, CircularProgress, Grid, Select, FormControl, MenuItem, InputLabel,
  FormControlLabel, TextField, Box
} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as cloneDeep from 'lodash/cloneDeep';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import Alert from '@material-ui/lab/Alert';
import { getLocations1, addPopulationSetting } from 'actions/api';
import { getTestingProtocols, getPopulationManagerInit, getVaccineProtocols, getTestingProtocolsType, getPopulationsTypes } from 'helpers';
import IOSSwitch2 from 'components/IOSSwitch2';
import CheckButton2 from 'components/CheckButton2';
import validate from 'validate.js';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { clearPopulationSettings } from 'actions/clear';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LineStepProgressBar from "components/LineStepProgressBar";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
// import palette from 'theme/palette';

const useStyles = makeStyles(theme => ({
  locationRoot: {
    margin: '32px 16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 30
    }
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  stepOneDiv: {
    margin: theme.spacing(4),
  },
  upContent: {
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
    borderBottom: `solid 1px ${theme.palette.brandDark}`,
    '&:last-child': {
      borderBottom: 'solid 0px',
    }
  },
  backTitle: {
    color: '#788081',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'center',
  },
  clrSettings: {
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  clrSettingsDesc: {
    fontSize: '14px',
    margin: '8px 0px'
  },
  leftExpandIcon: {
    order: -1,
    marginRight: 0,
    marginLeft: '-12px'
  },
  accordionRoot: {
    boxShadow: 'none',
    borderBottom: 'solid 1px rgb(63 63 68 / 5%)'
  },
  accordionExpanded: {
    margin: '0px !important'
  },
  accordionDetailsRoot: {
    display: 'block'
  },
  accordionDetailsContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  accordionSummaryContent: {
    '&.Mui-expanded': {
      margin: '12px 0'
    }
  },
  addLinkButton: {
    color: theme.palette.blueDark,
    fontWeight: 600
  },
  redBtn: {
    color: theme.palette.brandRed,
    fontWeight: 600,
    marginLeft: 10,
    textTransform: 'none',
  },
  greenTitle: {
    color: theme.palette.brandGreen,
    fontSize: '32px',
    fontWeight: 500,
    textAlign: 'center',
    paddingBottom: 24
  },
  dlgGrayTxt: {
    color: theme.palette.brandDisableGray,
    fontWeight: 400,
  },
}));

const formSettingsData = [
  { id: 'sms_validation', label: 'SMS Validation', hidefield: "sms_validation", hide: true, },
  {
    id: 'scheduling', label: 'Scheduling', hidefield: "scheduling_hide", hide: false,
    children: [
      { id: 'rapid', label: 'Rapid', hidefield: "scheduling_rapid_hide", hide: false },
      { id: 'vaccine', label: 'Vaccine', hidefield: "scheduling_vaccine_hide", hide: false },
      { id: 'pcr', label: 'PCR', hidefield: "scheduling_pcr_hide", hide: false }
    ]
  },
  { id: 'symptom_checker', label: 'Covid Symptoms', hidefield: "health_screening_hide", hide: false, requiredfield: "health_screening_required", required: true, },
  { id: 'covid_travel_question', label: 'Covid Travel Questions', hidefield: "last_14days_contact_hide", hide: false, requiredfield: "last_14days_contact_required", required: true, },
  {
    id: 'demographics', label: 'Demographics', hidefield: "contact_information_hide", hide: false, requiredfield: "contact_information_required", required: true,
    children: [
      { id: 'name', label: 'Name', hidefield: "name_hide", hide: false, requiredfield: "name_required", required: true },
      { id: 'dob', label: 'Date Of Birth', hidefield: "date_of_birth_hide", hide: false, requiredfield: "date_of_birth_required", required: true },
      { id: 'address', label: 'Address', hidefield: "address_hide", hide: false, requiredfield: "address_required", required: true },
      { id: 'demographics_ssn', label: 'Last 4 SSN', hidefield: "demographics_ssn_hide", hide: false, requiredfield: "demographics_ssn_required", required: true },
      { id: 'gender', label: 'Gender', hidefield: "gender_hide", hide: false, requiredfield: "gender_required", required: true },
      { id: 'race', label: 'Race', hidefield: "race_hide", hide: false, requiredfield: "race_required", required: true },
      { id: 'ethnicity', label: 'Ethnicity', hidefield: "ethnicity_hide", hide: false, requiredfield: "ethnicity_required", required: true },
    ]
  },
  {
    id: 'dependents', label: 'Dependents', hidefield: "dependents_hide", hide: false, requiredfield: "dependents_required", required: true,
    children: [
      { id: 'name', label: 'Name', hidefield: "dependents_name_hide", hide: false, requiredfield: "dependents_name_required", required: true },
      { id: 'dob', label: 'Date Of Birth', hidefield: "dependents_date_of_birth_hide", hide: false, requiredfield: "dependents_date_of_birth_required", required: true },
      // { id: 'address', label: 'Address', hidefield: "dependents_address_hide", hide: false, requiredfield: "dependents_address_required", required: true },
      { id: 'dependents_ssn', label: 'Last 4 SSN', hidefield: "dependents_ssn_hide", hide: false, requiredfield: "dependents_ssn_required", required: true },
      { id: 'gender', label: 'Gender', hidefield: "dependents_gender_hide", hide: false, requiredfield: "dependents_gender_required", required: true },
      { id: 'relationship', label: 'Relationship', hidefield: "dependents_relationship_hide", hide: false, requiredfield: "dependents_relationship_required", required: true },
    ]
  },
  { id: 'insurance_information', label: 'Insurance Information', hidefield: "insurance_information_hide", hide: false, requiredfield: "insurance_information_required", required: true, },
  { id: 'personal_identity', label: 'Personal ID', hidefield: "personal_identity_hide", hide: false, requiredfield: "personal_identity_required", required: true, },
];

const initTestingProtocol = { type: '', duration: '' };

const protocolSchema = {
  type: { presence: { allowEmpty: false } },
  duration: { presence: { allowEmpty: false } }
};
const labelArray = ['Population Information', 'Web Form Settings', 'Protocol Selection'];

const AddPopulation = (props) => {
  const { getLocations1, locations, addPopulationSetting, clearPopulationSettings } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const history = useHistory();

  const [step, setStep] = useState(0);
  const [subStepIn3, setSubStepIn3] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [displayError, setDisplayError] = useState(null);
  const [populationSettings, setPopulationSettings] = useState(formSettingsData);
  const [formState, setFormState] = useState({ ...getPopulationManagerInit, testing_type: [], vaccine_type: [] });
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [addedDlgOpen, setAddedDlgOpen] = useState(false);
  const [locationDetails, setLocationDetails] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!locations)
        await getLocations1();
    }
    fetchData();
    // eslint-disable-next-line
  }, [locations]);

  const handleChangeSettingAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (formState.location_id && locations) {
      let locationinfo = locations.find(e => e._id === formState.location_id);
      setLocationDetails(locationinfo);
    }
  }, [locations, formState.location_id])

  const handleChange = e => {
    e.persist();
    if (e.target.name === 'endpoint') {
      setFormState(formState => ({
        ...formState,
        endpoint_encoded: encodeURIComponent(e.target.value)
      }));
    }
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  const handleChangeOp = (index, type, e) => {
    e.persist();
    if (displayError) { setDisplayError(null) };
    let tempArray = cloneDeep(populationSettings);
    if (type === 'switch') {
      tempArray[index].hide = e.target.name === 'sms_validation' ? e.target.checked : !e.target.checked;
      // tempArray[index].required = e.target.checked;
      if (tempArray[index].children) {
        tempArray[index].children.forEach((element, intex) => {
          tempArray[index].children[intex].hide = !e.target.checked;
          // tempArray[index].children[intex].required = e.target.checked;
        })
      }
    } else {
      tempArray[index].required = e.target.checked;
      if (tempArray[index].children) {
        tempArray[index].children.forEach((element, intex) => {
          tempArray[index].children[intex].required = e.target.checked;
        })
      }
    }
    setPopulationSettings(tempArray);
  };

  const handleChangeSub = (index, indx, type, e) => {
    e.persist();
    let tempArray = cloneDeep(populationSettings);
    if (type === 'switch') {
      tempArray[index].children[indx].hide = !e.target.checked;
      if (tempArray[index].children) {
        // check any children has been enabled
        if (!tempArray[index].children[indx].hide) {
          tempArray[index].hide = tempArray[index].children[indx].hide
        } else {
          //check any all childrens has been disabled
          let isDisabled = tempArray[index].children.filter(e => e.hide === true);
          if (isDisabled.length === tempArray[index].children.length) {
            tempArray[index].hide = true;
          }

        }
      }
      // tempArray[index].children[indx].required = e.target.checked;
    } else {
      tempArray[index].children[indx].required = e.target.checked;
      if (tempArray[index].children) {
        // check any children has been enabled
        if (tempArray[index].children[indx].required) {
          tempArray[index].required = tempArray[index].children[indx].required
        } else {
          let isDisabled = tempArray[index].children.filter(e => e.required === false);
          if (isDisabled.length === tempArray[index].children.length) {
            tempArray[index].required = false;
          }
        }
      }
    }
    // let allEnabled = tempArray[index].children.filter((item) => item.hide === false);
    // let allChecked = tempArray[index].children.filter((item) => item.required === false);

    // if( !allEnabled.length ) {
    //   tempArray[index].hide = true;
    // } else {
    //   tempArray[index].hide = false;
    // }

    // if( !allChecked.length ) {
    //   tempArray[index].required = true;
    // }else{
    //   tempArray[index].required = false;
    // }
    setPopulationSettings(tempArray);
  }

  const handleChangeProtocol = (index, e, type) => {
    e.preventDefault();
    let tempArray = cloneDeep(formState);
    if (type === 'testing') {
      if (tempArray.testing_type.length) {
        tempArray.testing_type[index][e.target.name] = e.target.value;
      } else {
        tempArray.testing_type.push(cloneDeep(initTestingProtocol));
        tempArray.testing_type[0][e.target.name] = e.target.value;
      }
    } else {
      if (tempArray.vaccine_type.length) {
        tempArray.vaccine_type[index][e.target.name] = e.target.value;
      } else {
        tempArray.vaccine_type.push(cloneDeep(initTestingProtocol));
        tempArray.vaccine_type[0][e.target.name] = e.target.value;
      }
    }
    setFormState(tempArray);
  };

  const clearMessage = () => {
    setDisplaySuccess(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const closeErrorMessage = () => {
    setDisplayError(null)
  };

  const handleBack = event => {
    event.preventDefault();
    if (step === 1) {
      clearMessage();
      setFormState({ ...getPopulationManagerInit, testing_type: [], vaccine_type: [] });
    }
    setStep(step => step - 1);
  };

  const handleClearSettings = event => {
    setPopulationSettings(formSettingsData)
  };

  const addProtocol = (type, e) => {
    e.preventDefault();
    let isInvalid = false;
    if (type === 'testing') {
      isInvalid = validate(formState.testing_type[formState.testing_type.length - 1], protocolSchema);
    } else {
      isInvalid = validate(formState.vaccine_type[formState.vaccine_type.length - 1], protocolSchema);
    }
    if (isInvalid) {
      setAlertDialogOpen(true);
      setAlertDialogMessage('Please select all the Protocol fields to add a new Protocol');
    } else {
      let tempFormState = cloneDeep(formState);
      if (type === 'testing') {
        tempFormState.testing_type.push(initTestingProtocol);
      } else {
        tempFormState.vaccine_type.push(initTestingProtocol);
      }
      setFormState(tempFormState);
    }
  };

  const handleRemoveProtocol = (type) => {
    let temp = type === 'testing' ? formState.testing_type : formState.vaccine_type;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
    setAlertDialogMessage('');
  };

  const closeAddedDlg = () => {
    setAddedDlgOpen(false);
    history.push('/site-manager/population-manager');
  };

  const handleSubmit = async (event, index) => {
    event.preventDefault();
    if (index === 1) {
      // population settings
      let populationdata = formState;
      populationSettings.forEach(element => {
        populationdata[element.hidefield] = element.hide;
        if (element.requiredfield) {
          populationdata[element.requiredfield] = element.required;
        }
        if (element.children) {
          element.children.forEach(child => {
            populationdata[child.hidefield] = child.hide;
            if (child.requiredfield) {
              populationdata[child.requiredfield] = child.required;
            }
          })
        }
      });
      if (populationdata.scheduling_vaccine_hide && populationdata.scheduling_pcr_hide && populationdata.scheduling_rapid_hide) {
        setDisplayError("Need to Select Alteast One Scheduling Type")
        return
      }
      //check at least one demographics  selected  
      if (populationdata.contact_information_hide || !populationdata.contact_information_required) {
        setDisplayError("Need to Select Alteast One Demographics and check it as required");
        setLoading(false);
        return
      }
      if (populationdata.contact_information_required) {
        let demographics = populationSettings.find(e => e.hidefield === 'contact_information_hide');
        // check selected demographics is required or not
        let demographicsChecked = demographics.children.find(e => e.hide === false && e.required === true)
        if (!demographicsChecked) {
          setDisplayError("Make Selected Demographics as required");
          setLoading(false);
          return
        }
      }
      setFormState(populationdata);
      setStep(step => step + 1);
    } else if (index === 2 && subStepIn3 === 0) {
      // testing protocol
      setSubStepIn3(1)
    } else if (index === 2 && subStepIn3 === 1) {
      // vaccine protocol
      setLoading(true);
      const res = await addPopulationSetting(formState);
      setLoading(false);
      if (res.success) {
        clearPopulationSettings();
        setDisplaySuccess(res.message);
        setAddedDlgOpen(true);
      }
    } else {
      setStep(step => step + 1);
    }
  };

  return (
    <div>
      <Box className={classes.locationRoot}>
        <div className={classes.header} >
          <div className={classes.subHeader}>
            <img src="/images/svg/status/users_icon.svg" alt="" />&ensp;
            <Typography variant="h2" className={brandClasses.headerTitle}>
              {'POPULATION MANAGER | '}
            </Typography>
            <Typography variant="h4" className={classes.headerSubTitle}>
              {'ADD POPULATION'}
            </Typography>
          </div>
        </div>
        <Grid container >
          <Box display="flex" padding="12px 0px 16px" >
            <Button component={Link} to="/site-manager/population-manager">
              <ChevronLeftIcon style={{ color: "#788081" }} />
              <Typography className={classes.backTitle}>Back to population manager</Typography>
            </Button>
          </Box>
          <Grid item xs={12} className="text-left d-flex">
            <LineStepProgressBar activeIndex={step} labels={labelArray} totalCount={3} handleStep={setStep} />
          </Grid>
        </Grid>
      </Box>

      {step === 0 && (
        <div>
          <form
            onSubmit={(e) => handleSubmit(e, 0)}
          >
            <div className={classes.locationRoot}>
              <Grid container spacing={3}>
                <Grid item md={3}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Type</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Population Type* "
                      name="type"
                      displayEmpty
                      value={formState.type || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Select Population type</Typography>
                      </MenuItem>
                      {getPopulationsTypes.map((pt, index) => (
                        <MenuItem key={index} value={pt}>{pt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  {locations
                    ?
                    <FormControl
                      className={brandClasses.shrinkTextField}
                      required
                      fullWidth
                      variant="outlined"
                    >
                      <InputLabel shrink className={brandClasses.selectShrinkLabel}>Select a Location</InputLabel>
                      <Select
                        onChange={handleChange}
                        label="Select a location "
                        name="location_id"
                        displayEmpty
                        value={formState.location_id || ''}
                      >
                        <MenuItem value=''>
                          <Typography className={brandClasses.selectPlaceholder}>Select a location</Typography>
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
              </Grid>
            </div>
            <div className={brandClasses.footerButton}>
              <Button
                className={brandClasses.button}
                type="submit"
              >
                NEXT
              </Button>
            </div>
          </form>
          <div className={brandClasses.footerButton}>
            {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={classes.locationRoot}>
          <form
            onSubmit={(e) => handleSubmit(e, 1)}
          >
            <div className={classes.header} >
              <Typography variant="h4" className={classes.headerSubTitle}>
                SET POPULATIONS TESTD GO INTAKE FORM
              </Typography>
            </div>
            <br />
            <Box marginLeft="8px">
              <Typography className={brandClasses.brandDarkText} variant="h4">Set TESTD GO URL</Typography>
            </Box>

            <Box margin="12px auto">
              <Grid container>
                <Grid item xs={1}></Grid>
                <Grid item xs={4}>
                  <Box alignItems="center" display="flex">
                    <Typography variant="h5">{`${window.location.host}/go/`} </Typography>&nbsp;&ensp;
                    <TextField
                      type="text"
                      label=""
                      placeholder="Enter custom text"
                      name="endpoint"
                      className={brandClasses.shrinkTextField}
                      onChange={handleChange}
                      value={formState.endpoint || ''}
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}></Grid>
              </Grid>
            </Box>

            <Box margin="24px 0px">
              <Grid container>
                <Grid item md={8} xs={12}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography className={brandClasses.brandDarkText} variant="h4">Set Populations form settings</Typography>
                    <Typography variant="h5" className={classes.clrSettings} onClick={() => handleClearSettings()}>clear all settings</Typography>
                  </Box>
                  <Typography variant="h5" className={classes.clrSettingsDesc}>Customize below what information you need from this population to schedule an appointment.</Typography>
                </Grid>
                <Grid item md={4} xs={12}></Grid>
              </Grid>
            </Box>

            <Box margin="12px 0px">
              <Grid container>
                <Grid item md={8} xs={12}>
                  {populationSettings.map((setting, index) =>
                    <Accordion
                      key={index}
                      expanded={expanded === 'panel' + index}
                      onChange={handleChangeSettingAccordion('panel' + index)}
                      classes={{ expanded: classes.accordionExpanded, root: classes.accordionRoot }}
                    >
                      <AccordionSummary
                        expandIcon={setting.children ? expanded === 'panel' + index ? <ExpandLessIcon /> : setting.children ? <img src="/images/svg/chevron_blue_right.svg" alt="" /> : '' : <span>&ensp;</span>}
                        aria-controls={'panel-content' + index}
                        id={'panel-content' + index}
                        classes={{ expandIcon: classes.leftExpandIcon, content: classes.accordionSummaryContent }} aria-label={`Expand-${index}`}
                      >
                        <Grid container direction="row" justify="center" alignitems="center" className={classes.container} aria-label={`Expanddata-${index}`}>
                          <Grid item md={4} ><Typography variant="h5">
                            {setting.label}</Typography>
                          </Grid>
                          <Grid item md={6}>
                            <FormControlLabel
                              control={<IOSSwitch2
                                checked={setting.hidefield === 'sms_validation' ? setting.hide : !setting.hide}
                                onChange={(e) => handleChangeOp(index, 'switch', e)}
                                name={setting.hidefield}
                              />}
                              required
                              classes={{ label: classes.label }}
                              label={setting.hidefield === 'sms_validation' ? setting.hide ? "ON" : "OFF" : !setting.hide ? "ON" : "OFF"}
                              labelPlacement={"end"}
                              onClick={(event) => event.stopPropagation()}
                              onFocus={(event) => event.stopPropagation()}
                            />
                            {setting.requiredfield && (
                              <FormControlLabel
                                control={<CheckButton2
                                  checked={setting.required}
                                  label="Required"
                                  name={setting.requiredfield}
                                  onChange={(e) => handleChangeOp(index, 'check', e)}
                                />} required
                                classes={{ label: classes.label }}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                              />


                            )}
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      {setting.children &&
                        <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
                          {setting.children.map((item, indx) =>
                            <Grid container direction="row" justify="center" alignitems="center" className={classes.accordionDetailsContainer} key={indx}>
                              <Grid item md={2} ></Grid>
                              <Grid item md={5} >
                                <Typography variant="h5">{item.label}</Typography>
                              </Grid>
                              <Grid item md={5}>
                                <FormControlLabel
                                  control={<IOSSwitch2
                                    checked={!item.hide}
                                    onChange={(e) => handleChangeSub(index, indx, 'switch', e)}
                                    name={item.hidefield}
                                  />}
                                  required
                                  // labelPlacement="top"
                                  classes={{ label: classes.label }}
                                  label={!item.hide ? "ON" : "OFF"}
                                  labelPlacement={"end"}
                                />
                                {item.requiredfield && (
                                  <CheckButton2
                                    checked={item.required}
                                    label="Required"
                                    name={item.requiredfield}
                                    onChange={(e) => handleChangeSub(index, indx, 'check', e)}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          )}
                        </AccordionDetails>
                      }
                    </Accordion>
                  )}
                  {/* <Accordion expanded={expanded === 'panel2'} classes={{expanded:classes.accordionExpanded, root:classes.accordionRoot}}>
                  <AccordionSummary>
                    <Typography className={classes.heading}>Users</Typography>
                    <Typography className={classes.secondaryHeading}>
                      You are currently not an owner
                    </Typography>
                  </AccordionSummary>
                </Accordion> */}
                </Grid>
              </Grid>
            </Box>

            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
            </div>

            <div className={brandClasses.footerButton}>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={handleBack}
              >
                BACK
              </Button>
              &ensp;
              <Button
                className={brandClasses.button}
                type="submit"
              >
                NEXT
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => handleSubmit(e, 2)}
        >
          {subStepIn3 === 0 && (
            <>
              <Box marginLeft="16px">
                <Typography variant="h5">Select Populations testing protocols</Typography>
              </Box>
              <br />
              {(formState.testing_type && formState.testing_type.length)
                ?
                formState.testing_type.map((protocol, index) =>
                  <Box margin="16px" key={index}>
                    <Typography >Testing Protocol</Typography>
                    <br />
                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <FormControl
                          className={brandClasses.shrinkTextField}
                          required
                          fullWidth
                          variant="outlined"
                        >
                          {/* <InputLabel shrink className={brandClasses.selectShrinkLabel}>Testing type</InputLabel> */}
                          <Select
                            onChange={(e) => handleChangeProtocol(index, e, 'testing')}
                            // label=""
                            name="type"
                            displayEmpty
                            value={protocol.type || ''}
                          >
                            <MenuItem value=''>
                              <Typography className={brandClasses.selectPlaceholder}>Select a testing type</Typography>
                            </MenuItem>
                            {getTestingProtocolsType.map((value, indx) => (
                              <MenuItem key={indx} value={value}>{value}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={4}>
                        <FormControl
                          className={brandClasses.shrinkTextField}
                          required
                          fullWidth
                          variant="outlined"
                        >
                          {/* <InputLabel shrink className={brandClasses.selectShrinkLabel}>Testing Protocol</InputLabel> */}
                          <Select
                            onChange={(e) => handleChangeProtocol(index, e, 'testing')}
                            // label="Testing Protocol* "
                            name="duration"
                            displayEmpty
                            value={protocol.duration || ''}
                          >
                            <MenuItem value=''>
                              <Typography className={brandClasses.selectPlaceholder}>Select a testing protocol</Typography>
                            </MenuItem>
                            {getTestingProtocols.map((value, indx) => (
                              <MenuItem key={indx} value={value}>{value}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                      </Grid>
                    </Grid>
                  </Box>
                )
                :
                <Box margin="16px">
                  <Typography >Testing Protocol</Typography>
                  <br />
                  <Grid container spacing={3}>
                    <Grid item md={4}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        required
                        fullWidth
                        variant="outlined"
                      >
                        {/* <InputLabel shrink className={brandClasses.selectShrinkLabel}>Testing type</InputLabel> */}
                        <Select
                          onChange={(e) => handleChangeProtocol(0, e, 'testing')}
                          // label=""
                          name="type"
                          displayEmpty
                          value={''}
                        >
                          <MenuItem value=''>
                            <Typography className={brandClasses.selectPlaceholder}>Select a testing type</Typography>
                          </MenuItem>
                          {getTestingProtocolsType.map((value, index) => (
                            <MenuItem key={index} value={value}>{value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={4}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        required
                        fullWidth
                        variant="outlined"
                      >
                        {/* <InputLabel shrink className={brandClasses.selectShrinkLabel}>Testing Protocol</InputLabel> */}
                        <Select
                          onChange={(e) => handleChangeProtocol(0, e, 'testing')}
                          // label="Testing Protocol* "
                          name="duration"
                          displayEmpty
                          value={''}
                        >
                          <MenuItem value=''>
                            <Typography className={brandClasses.selectPlaceholder}>Select a testing protocol</Typography>
                          </MenuItem>
                          {getTestingProtocols.map((value, index) => (
                            <MenuItem key={index} value={value}>{value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              }

              <div className={classes.upContent}>
                <Button
                  // variant=""
                  className={classes.addLinkButton}
                  startIcon={<AddIcon />}
                  onClick={(e) => addProtocol('testing', e)}
                >
                  ADD A TESTING PROTOCOL
                </Button>
                {formState.testing_type.length > 1 && (
                  <Button onClick={() => handleRemoveProtocol('testing')} className={classes.redBtn}>
                    <RemoveIcon />
                    {' REMOVE'}
                  </Button>
                )}
              </div>
              <div className={brandClasses.footerButton}>
                {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
              </div>
            </>
          )}

          {subStepIn3 === 1 && (
            <>
              <Box marginLeft="16px">
                <Typography variant="h5">Select Populations vaccine protocols</Typography>
              </Box>
              <br />
              {(formState.vaccine_type && formState.vaccine_type.length)
                ?
                formState.vaccine_type.map((protocol, index) =>
                  <Box margin="16px" key={index}>
                    <Typography >Vaccine Protocol</Typography>
                    <br />
                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <FormControl
                          className={brandClasses.shrinkTextField}
                          required
                          fullWidth
                          variant="outlined"
                        >
                          <Select
                            onChange={(e) => handleChangeProtocol(index, e, 'vaccine')}
                            name="type"
                            displayEmpty
                            value={protocol.type || ''}
                          >
                            <MenuItem value=''>
                              <Typography className={brandClasses.selectPlaceholder}>Select a vaccine type</Typography>
                            </MenuItem>
                            {getVaccineProtocols.map((value, indx) => (
                              <MenuItem key={indx} value={value}>{value}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={4}>
                        <FormControl
                          className={brandClasses.shrinkTextField}
                          required
                          fullWidth
                          variant="outlined"
                        >
                          {/* <InputLabel shrink className={brandClasses.selectShrinkLabel}>Testing Protocol</InputLabel> */}
                          <Select
                            onChange={(e) => handleChangeProtocol(index, e, 'vaccine')}
                            name="duration"
                            displayEmpty
                            value={protocol.duration || ''}
                          >
                            <MenuItem value=''>
                              <Typography className={brandClasses.selectPlaceholder}>Select a vaccine protocol</Typography>
                            </MenuItem>
                            {getTestingProtocols.map((value, indx) => (
                              <MenuItem key={indx} value={value}>{value}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )
                :
                <Box margin="16px">
                  <Typography >Vaccine Protocol</Typography>
                  <br />
                  <Grid container spacing={3}>
                    <Grid item md={4}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        required
                        fullWidth
                        variant="outlined"
                      >
                        <Select
                          onChange={(e) => handleChangeProtocol(0, e, 'vaccine')}
                          name="type"
                          displayEmpty
                          value={''}
                        >
                          <MenuItem value=''>
                            <Typography className={brandClasses.selectPlaceholder}>Select a vaccine  type</Typography>
                          </MenuItem>
                          {getVaccineProtocols.map((value, indx) => (
                            <MenuItem key={indx} value={value}>{value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={4}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        required
                        fullWidth
                        variant="outlined"
                      >
                        <Select
                          onChange={(e) => handleChangeProtocol(0, e, 'vaccine')}
                          name="duration"
                          displayEmpty
                          value={''}
                        >
                          <MenuItem value=''>
                            <Typography className={brandClasses.selectPlaceholder}>Select a vaccine protocol</Typography>
                          </MenuItem>
                          {getTestingProtocols.map((value, indx) => (
                            <MenuItem key={indx} value={value}>{value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              }

              <div className={classes.upContent}>
                <Button
                  // variant=""
                  className={classes.addLinkButton}
                  startIcon={<AddIcon />}
                  onClick={(e) => addProtocol('vaccine', e)}
                >
                  ADD A VACCINE PROTOCOL
                </Button>
                {formState.vaccine_type.length > 1 && (
                  <Button onClick={() => handleRemoveProtocol('vaccine')} className={classes.redBtn}>
                    <RemoveIcon />
                    {' REMOVE'}
                  </Button>
                )}
              </div>
              <div className={brandClasses.footerMessage}>
                {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
              </div>
            </>
          )}

          <div className={brandClasses.footerButton}>
            <Button
              className={brandClasses.button}
              classes={{ disabled: brandClasses.buttonDisabled }}
              disabled={loading}
              type="submit"
            >
              {subStepIn3 === 1 ? 'DONE' : 'NEXT'}
              {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            </Button>
          </div>
        </form>
      )}

      <DialogAlert
        open={alertDialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleAlertDialogClose}
      />

      <Dialog
        open={addedDlgOpen}
        onClose={closeAddedDlg}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          <div className={classes.header} >
            <div className={classes.subHeader}>
              <img src="/images/svg/status/users_icon.svg" alt="" />&ensp;
              <Typography variant="h2" className={brandClasses.headerTitle}>
                {'POPULATION MANAGER | '}
              </Typography>
              <Typography variant="h4" className={classes.headerSubTitle}>
                {'ADDED POPULATION SUMMARY'}
              </Typography>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <Box padding="0px 24px">
            <Typography className={classes.greenTitle}>You have successfully created {formState.name}:</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h4">Populations Name</Typography>
                <Typography variant="h4" className={classes.dlgGrayTxt}>{formState.type}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="h4">Testing Protocol</Typography>
                {formState.testing_type.map((protocol, index) =>
                  <Typography variant="h4" className={classes.dlgGrayTxt} key={index}>{protocol.type + ': ' + protocol.duration}</Typography>
                )}
              </Grid>
              <Grid item md={6}>
                <Typography variant="h4">Populations Assigned Location</Typography>
                <Typography variant="h4" className={classes.dlgGrayTxt}>{formState.location_id && locationDetails && locationDetails.name}</Typography>
                <Typography variant="h4" className={classes.dlgGrayTxt}>{formState.location_id && locationDetails && locationDetails.address}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="h4">Vaccine Protocol</Typography>
                {formState.vaccine_type.map((protocol, index) =>
                  <Typography variant="h4" className={classes.dlgGrayTxt} key={index}>{protocol.type + ': ' + protocol.duration}</Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box marginRight="24px" padding="24px">
            <Button onClick={closeAddedDlg} className={brandClasses.blueBtn} color="primary">
              DONE
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
});

AddPopulation.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  addPopulationSetting: PropTypes.func.isRequired,
  clearPopulationSettings: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, addPopulationSetting, clearPopulationSettings })(AddPopulation);
