import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import brandStyles from 'theme/brand';
import { Grid, Button, Typography, FormControl, FormControlLabel, InputLabel, Select, TextField, Box, CircularProgress } from '@material-ui/core';
import { getTestingProtocols, getPopulationManagerInit, getVaccineProtocols, getTestingProtocolsType, getPopulationsTypes } from 'helpers';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import IOSSwitch2 from 'components/IOSSwitch2';
import CheckButton2 from 'components/CheckButton2';
import * as cloneDeep from 'lodash/cloneDeep';
import { updatePopulationSettings, getLocations1 } from 'actions/api';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { clearPopulationSettings } from 'actions/clear';
import Alert from '@material-ui/lab/Alert';
import QRCode from 'qrcode.react';
import { Edit } from 'icons';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import TextButton from 'components/Button/TextButton';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
    padding: `0px ${theme.spacing(2)}px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 30
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  title: {
    color: '#0F84A9',
    lineHeight: '27px'
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    textTransform: 'capitalize',
    fontSize: '16px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  subMenu: {
    color: theme.palette.brandLightGray,
    fontSize: '22px',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      fontSize: '20px'
    }
  },
  subMenuActive: {
    color: theme.palette.brand
  },
  divider: {
    fontSize: '20px',
    color: theme.palette.brandDark
  },
  fieldKey: {
    color: theme.palette.brandDark,
    fontWeight: 500,
    marginBottom: 12
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
  qrSubText: {
    color: theme.palette.brand,
    textTransform: 'none',
    textAlign: 'center',
    fontWeight: 600,
    textDecoration: 'underline'
  },
  qrcode: {
    margin: theme.spacing(4),
    height: 180,
    width: 180
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(2)
  },

  nextbutton: {
    color: ' #FFFFFF',
    /* border: 1px solid #0F84A9; */
    display: 'flex',
    minWidth: '120px',
    fontWeight: '600',
    lineHeight: '2',
    paddingLeft: '8px',
    /* border-radius: 10px; */
    paddingRight: '8px',
    letterpacing: '1px',
    textTransform: 'none',
    backgroundColor: '#3ECCCD',
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: '#3ECCCD',
    }
  },
  populationButton: {
    color: ' #FFFFFF',
    /* border: 1px solid #0F84A9; */
    display: 'flex',
    minWidth: '120px',
    fontWeight: '600',
    lineHeight: '2',
    paddingLeft: '8px',
    /* border-radius: 10px; */
    paddingRight: '8px',
    letterpacing: '1px',
    textTransform: 'none',
    backgroundColor: '#0F84A9',
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: '#0F84A9',
    }
  }

}));
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  const classes2 = useStyles();
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes2.dlgTitle}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: `0px ${theme.spacing(3)}px ${theme.spacing(2)}px`,
  },
}))(MuiDialogContent);
const formSettingsData = [
  {
    id: 'symptom_checker', label: 'SMS Validation', hidefield: "sms_validation", hide: true,
  },
  {
    id: 'scheduling', label: 'Scheduling', hidefield: "scheduling_hide", hide: false,
    children: [
      { id: 'rapid', label: 'Rapid', hidefield: "scheduling_rapid_hide", hide: false },
      { id: 'vaccine', label: 'Vaccine', hidefield: "scheduling_vaccine_hide", hide: false },
      { id: 'pcr', label: 'PCR', hidefield: "scheduling_pcr_hide", hide: false }
    ]
  },
  {
    id: 'symptom_checker', label: 'Covid Symptoms', hidefield: "health_screening_hide", hide: false, requiredfield: "health_screening_required", required: true,
  },
  {
    id: 'covid_travel_question', label: 'Covid Travel Questions', hidefield: "last_14days_contact_hide", hide: false, requiredfield: "last_14days_contact_required", required: true,
  },
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
      { id: 'demographics_ssn', label: 'Last 4 SSN', hidefield: "dependents_ssn_hide", hide: false, requiredfield: "dependents_ssn_required", required: true },
      { id: 'gender', label: 'Gender', hidefield: "dependents_gender_hide", hide: false, requiredfield: "dependents_gender_required", required: true },
      { id: 'relationship', label: 'Relationship', hidefield: "dependents_relationship_hide", hide: false, requiredfield: "dependents_relationship_required", required: true },
    ]

  },
  {
    id: 'insurance_information', label: 'Insurance Information', hidefield: "insurance_information_hide", hide: false, requiredfield: "insurance_information_required", required: true,
  },
  {
    id: 'personal_identity', label: 'Personal ID', hidefield: "personal_identity_hide", hide: false, requiredfield: "personal_identity_required", required: true,
  },
];

const initTestingProtocol = { type: '', duration: '' };
// const protocolSchema = {
//   type: { presence: { allowEmpty: false } },
//   duration: { presence: { allowEmpty: false } }
// };
const PopulationView = (props) => {
  const { selectedPopulation, openView, handleViewClose, getLocations1, locations, updatePopulationSettings, clearPopulationSettings } = props;

  const [formState, setFormState] = useState({ ...getPopulationManagerInit, vaccine_type: [], testing_type: [], location: '', endpoint: '' });
  // const [formButtonDisable, setFormButtonDisable] = useState(true);
  const [currentMenu, setCurrentMenu] = useState('information');
  const [populationSettings, setPopulationSettings] = useState(formSettingsData);
  const classes = useStyles();
  const brandClasses = brandStyles();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [displayError, setDisplayError] = useState();
  const [editEndpoint, setEditEndPoint] = useState(false);

  const hvtURL = `${window.location.protocol}//${window.location.host}/go/${selectedPopulation && selectedPopulation.endpoint ? encodeURIComponent(selectedPopulation.endpoint) : ''}`;

  const handleChangeSettingAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    async function fetchData() {
      if (!locations) {
        await getLocations1();
      }

      let populationData = selectedPopulation;
      populationData.location_id = selectedPopulation.location_id._id;
      setFormState(formState => ({ ...formState, ...populationData, endpoint: selectedPopulation.endpoint ? selectedPopulation.endpoint : '' }));
    }
    fetchData()
  }, [locations, selectedPopulation, getLocations1])

  // useEffect(() => {
  //   if (formState.type && formState.testing_type && formState.testing_protocol && formState.location && formState.vaccine_type && formState.vaccine_protocol) {
  //     setFormButtonDisable(false);
  //   } else {
  //     setFormButtonDisable(true)
  //   }
  // }, [formState])

  // const handleDuplicatedClickOpen = () => {
  //   setOpenDuplicated(true);
  // };

  const handleClose = () => {
    handleViewClose(false);
    clearMessage();
    closeErrorMessage();
    setLoading(false);
    // clearPopulationSettings();
    // setFormState(formState => ({ ...formState, ...getPopulationManagerInit, vaccine_type: [], testing_type: [], location: '', endpoint: '' }));
    setEditEndPoint(false);
    setCurrentMenu('information');
    setExpanded(false);
  };

  const handleMenuChange = (menu) => {
    let populationSettingsdata = [...populationSettings]
    populationSettingsdata.forEach(element => {
      element.hide = selectedPopulation[element.hidefield] === undefined ? false : selectedPopulation[element.hidefield];
      if (element.requiredfield) {
        element.required = selectedPopulation[element.requiredfield] === undefined ? true : selectedPopulation[element.requiredfield];
      }
      if (element.children) {
        element.children.forEach(child => {
          child.hide = selectedPopulation[child.hidefield] === undefined ? false : selectedPopulation[child.hidefield];
          if (child.requiredfield) {
            child.required = selectedPopulation[child.requiredfield] === undefined ? true : selectedPopulation[child.requiredfield];
          }
        })
      }
    });
    setPopulationSettings(populationSettingsdata)
    setCurrentMenu(menu);
  }

  const clearMessage = () => {
    setDisplaySuccess(null);
  };

  const closeErrorMessage = () => {
    setDisplayError(null)
  }

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

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
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (currentMenu === 'information') {
      setCurrentMenu('settings');
      let populationSettingsdata = [...populationSettings]
      populationSettingsdata.forEach(element => {
        element.hide = selectedPopulation[element.hidefield];
        if (element.requiredfield) {
          element.required = selectedPopulation[element.requiredfield];
        }
        if (element.children) {
          element.children.forEach(child => {
            child.hide = selectedPopulation[child.hidefield]
            if (child.requiredfield) {
              child.required = selectedPopulation[child.requiredfield];
            }
          })
        }
      });
      setPopulationSettings(populationSettingsdata)
    } else {
      populationSettings.forEach(element => {
        formState[element.hidefield] = element.hide;
        if (element.requiredfield) {
          formState[element.requiredfield] = element.required;
        }
        if (element.children) {
          element.children.forEach(child => {
            formState[child.hidefield] = child.hide;
            if (child.requiredfield) {
              formState[child.requiredfield] = child.required;
            }
          })
        }
      });
      setLoading(true);
      if (formState.scheduling_vaccine_hide && formState.scheduling_pcr_hide && formState.scheduling_rapid_hide) {
        setDisplayError("Need to Select Alteast One Scheduling Type");
        setLoading(false);
        return
      }
      //check at least one demographics  selected  
      if (formState.contact_information_hide || !formState.contact_information_required) {
        setDisplayError("Need to Select Alteast One Demographics and check it as required");
        setLoading(false);
        return
      }
      if (formState.contact_information_required) {
        let demographics = populationSettings.find(e => e.hidefield === 'contact_information_hide');
        // check selected demographics is required or not
        let demographicsChecked = demographics.children.find(e => e.hide === false && e.required === true)
        if (!demographicsChecked) {
          setDisplayError("Make Selected Demographics as required");
          setLoading(false);
          return
        }
      }
      const res = await updatePopulationSettings(formState._id, formState);
      setLoading(false);
      if (res.success) {
        setDisplaySuccess(res.message);
        setTimeout(() => {
          handleViewClose(false);
          clearMessage();
          clearPopulationSettings();
          setFormState(formState => ({ ...formState, ...getPopulationManagerInit, vaccine_type: [], testing_type: [], location: '', endpoint: '' }));
          setCurrentMenu('information');
          setEditEndPoint(false);
          setExpanded(false);
          // setSelectedLocation(null);
        }, 500);
      }

    }
  }

  const handleChangeProtocol = (index, e, type) => {
    e.preventDefault();

    var tempArray = cloneDeep(formState);
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
  }

  const handleChangeOp = (index, type, e) => {
    e.persist();
    if (displayError) { setDisplayError(null) };
    var tempArray = cloneDeep(populationSettings);
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
    var tempArray = cloneDeep(populationSettings);
    if (displayError) { setDisplayError(null) };
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
            tempArray[index].hide = true
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
          //check any all childrens has been disabled
          let isDisabled = tempArray[index].children.filter(e => e.required === false);
          if (isDisabled.length === tempArray[index].children.length) {
            tempArray[index].required = false
          }
        }
      }
    }

    setPopulationSettings(tempArray);
  }

  const handleEdit = (event) => {
    setEditEndPoint(event)
  }
  // const handleChangeOp = (index, type, e) => {
  //   e.persist();
  //   var tempArray = cloneDeep(populationSettings);
  //   if (type === 'switch') {
  //     tempArray[index].enabled = e.target.checked;
  //   } else {
  //     tempArray[index].checked = e.target.checked;
  //   }
  //   setPopulationSettings(tempArray);
  // };

  // const handleChangeSub = (index, indx, type, e) => {
  //   e.persist();
  //   var tempArray = cloneDeep(populationSettings);

  //   if (type === 'switch') {
  //     tempArray[index].children[indx].enabled = e.target.checked;
  //   } else {
  //     tempArray[index].children[indx].checked = e.target.checked;
  //   }
  //   var allEnabled = tempArray[index].children.filter((item) => item.enabled === false);
  //   var allChecked = tempArray[index].children.filter((item) => item.checked === false);

  //   if (!allEnabled.length) {
  //     tempArray[index].enabled = true;
  //   } else {
  //     tempArray[index].enabled = false;
  //   }

  //   if (!allChecked.length) {
  //     tempArray[index].checked = true;
  //   } else {
  //     tempArray[index].checked = false;
  //   }

  //   setPopulationSettings(tempArray);
  // }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openView} maxWidth={'md'} fullWidth={true}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        <div className={classes.header} >
          <div className={classes.subHeader}>
            <img src="/images/svg/status/users_icon.svg" alt="" />&ensp;
            <Typography variant="h2" className={brandClasses.headerTitle}>
              {'POPULATION MANAGER | '}
            </Typography>
            <Typography variant="h4" className={classes.headerSubTitle}>
              {selectedPopulation.type}
            </Typography>
          </div>

        </div>
      </DialogTitle>
      <DialogContent >
        <form onSubmit={(e) => handleSubmit(e)}>
          <Box display="flex" marginBottom="24px">
            <Typography className={currentMenu === 'information' ? clsx(classes.subMenuActive, classes.subMenu) : classes.subMenu} onClick={() => handleMenuChange('information')}>
              POPULATION INFORMATION
          </Typography>
            <Typography className={classes.divider}>&ensp;|&ensp; </Typography>
            <Typography className={currentMenu === 'settings' ? clsx(classes.subMenuActive, classes.subMenu) : classes.subMenu} onClick={() => handleMenuChange('settings')}>
              FORM SETTINGS
          </Typography>
          </Box>
          <Box>

            {
              currentMenu === 'information' &&
              <Grid container spacing={2}>

                <Grid item md={4}>
                  {/* <Typography variant="h5" className={classes.fieldKey}>
                    {'Populations Type'}
                  </Typography> */}
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
                <Grid item md={4}>
                  {/* <Typography variant="h5" className={classes.fieldKey}>
                    {'Populations Location'}
                  </Typography> */}
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
                <Grid item md={4}></Grid>
                <Grid item md={12}>
                  <Typography variant="h5" className={classes.fieldKey}>
                    {'Testing Protocol'}
                  </Typography>
                  {
                    formState.testing_type && formState.testing_type.length ?
                      formState.testing_type.map((protocol, index) =>
                        <>
                          <Grid container spacing={2} key={index}>
                            <Grid item md={4}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                required
                                fullWidth
                                variant="outlined"
                              >
                                <Select
                                  onChange={(e) => handleChangeProtocol(index, e, 'testing')}
                                  name="type"
                                  displayEmpty
                                  value={protocol.type || ''}
                                >
                                  <MenuItem value=''>
                                    <Typography className={brandClasses.selectPlaceholder}>Select  Type</Typography>
                                  </MenuItem>
                                  {getTestingProtocolsType.map((value, indx) => (
                                    <MenuItem key={indx} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item md={3}>
                              {/* <Typography variant="h5" className={classes.fieldKey}>
                      &nbsp;
                </Typography> */}
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                required
                                fullWidth
                                variant="outlined"
                              >
                                <Select
                                  onChange={(e) => handleChangeProtocol(index, e, 'testing')}
                                  name="duration"
                                  displayEmpty
                                  value={protocol.duration || ''}
                                >
                                  <MenuItem value=''>
                                    <Typography className={brandClasses.selectPlaceholder}>Select Protocol</Typography>
                                  </MenuItem>
                                  {getTestingProtocols.map((value, indx) => (
                                    <MenuItem key={indx} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item md={5}></Grid>
                          </Grid>
                        </>
                      )
                      :
                      <><Grid container spacing={2}>
                        <Grid item md={4}>
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            required
                            fullWidth
                            variant="outlined"
                          >
                            <Select
                              onChange={(e) => handleChangeProtocol(0, e, 'testing')}
                              name="type"
                              displayEmpty
                              value={''}
                            >
                              <MenuItem value=''>
                                <Typography className={brandClasses.selectPlaceholder}>Select Type</Typography>
                              </MenuItem>
                              {getTestingProtocolsType.map((value, indx) => (
                                <MenuItem key={indx} value={value}>{value}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={3}>
                          {/* <Typography variant="h5" className={classes.fieldKey}>
                &nbsp;
          </Typography> */}
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            required
                            fullWidth
                            variant="outlined"
                          >
                            <Select
                              onChange={(e) => handleChangeProtocol(0, e, 'testing')}
                              name="duration"
                              displayEmpty
                              value={''}
                            >
                              <MenuItem value=''>
                                <Typography className={brandClasses.selectPlaceholder}>Select Protocol</Typography>
                              </MenuItem>
                              {getTestingProtocols.map((value, indx) => (
                                <MenuItem key={indx} value={value}>{value}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={5}></Grid>
                      </Grid>
                      </>}

                </Grid>



                <Grid item md={12}>
                  <Typography variant="h5" className={classes.fieldKey}>
                    {'Vaccine Protocol'}
                  </Typography>
                  {
                    formState.vaccine_type && formState.vaccine_type.length ?
                      formState.vaccine_type.map((protocol, index) =>
                        <>
                          <Grid container spacing={2} key={index}>
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
                                    <Typography className={brandClasses.selectPlaceholder}>Select Type</Typography>
                                  </MenuItem>
                                  {getVaccineProtocols.map((value, indx) => (
                                    <MenuItem key={indx} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item md={3}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                required
                                fullWidth
                                variant="outlined"
                              >
                                <Select
                                  onChange={(e) => handleChangeProtocol(index, e, 'vaccine')}
                                  name="duration"
                                  displayEmpty
                                  value={protocol.duration || ''}
                                >
                                  <MenuItem value=''>
                                    <Typography className={brandClasses.selectPlaceholder}>Select Protocol</Typography>
                                  </MenuItem>
                                  {getTestingProtocols.map((value, indx) => (
                                    <MenuItem key={indx} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item md={5}></Grid>
                          </Grid>
                        </>) : <>
                        <Grid container spacing={2}>
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
                                  <Typography className={brandClasses.selectPlaceholder}>Select Type</Typography>
                                </MenuItem>
                                {getVaccineProtocols.map((value, indx) => (
                                  <MenuItem key={indx} value={value}>{value}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={3}>
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
                                  <Typography className={brandClasses.selectPlaceholder}>Select Protocol</Typography>
                                </MenuItem>
                                {getTestingProtocols.map((value, indx) => (
                                  <MenuItem key={indx} value={value}>{value}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={5}></Grid>
                        </Grid>
                      </>}
                </Grid>

              </Grid>
            }
            {
              currentMenu === 'settings' &&
              <Grid container spacing={1}>
                <Grid item md={7}>
                  {
                    populationSettings.map((setting, index) =>
                      <Accordion expanded={expanded === 'panel' + index} onChange={handleChangeSettingAccordion('panel' + index)}
                        classes={{ expanded: classes.accordionExpanded, root: classes.accordionRoot }} key={index}>
                        <AccordionSummary
                          expandIcon={setting.children ? expanded === 'panel' + index ? <ExpandLessIcon />
                            : setting.children ? <img src="/images/svg/chevron_blue_right.svg" alt="" /> : '' : <span>&ensp;</span>}
                          aria-controls={'panel-content' + index}
                          id={'panel-content' + index}
                          classes={{ expandIcon: classes.leftExpandIcon, content: classes.accordionSummaryContent }} aria-label={`Expand-${index}`}
                        >
                          <Grid container direction="row" justify="center" alignitems="center" className={classes.container} aria-label={`Expanddata-${index}`}>
                            <Grid item md={4} ><Typography variant="h5">
                              {setting.label}</Typography>
                            </Grid>
                            <Grid item md={8}>
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

                        {
                          setting.children &&
                          <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
                            {
                              setting.children.map((item, indx) =>
                                <Grid container direction="row" justify="center" alignitems="center" className={classes.accordionDetailsContainer} key={indx}>
                                  <Grid item md={1} ></Grid>
                                  <Grid item md={4} >
                                    <Typography variant="h5">{item.label}</Typography>
                                  </Grid>
                                  <Grid item md={6}>
                                    <FormControlLabel
                                      control={<IOSSwitch2
                                        checked={!item.hide}
                                        onChange={(e) => handleChangeSub(index, indx, 'switch', e)}
                                        name={item.hidefield}
                                      />}
                                      required
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
                              )
                            }
                          </AccordionDetails>
                        }
                      </Accordion>
                    )
                  }
                </Grid>
                <Grid item md={1}></Grid>
                <Grid item md={4}>
                  {/* <Grid container alignItems="baseline" justify="space-between">

                  </Grid> */}
                  <Grid container direction="column" justify="center" alignItems="center" spacing={1} >
                    <Grid item container direction="row" justify="flex-start" alignItems="flex-start" >
                      <Typography variant="h5">Endpoint  {editEndpoint ? <IconButton onClick={() => handleEdit(false)} classes={{ root: classes.editIcon }}>
                        <CancelOutlinedIcon />
                      </IconButton> : <IconButton onClick={() => handleEdit(true)}>
                        <Edit className={classes.editIcon} />
                      </IconButton>}
                      </Typography>

                    </Grid>
                    {editEndpoint ?
                      <>
                        <Box alignItems="center" display="flex" className={classes.fieldKey} style={{ marginLeft: 5 }}>
                          <Typography variant="h6">{`${window.location.host}/go/`}</Typography>&nbsp;&ensp;
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
                        </Box></> :
                      <Grid item container direction="row" justify="flex-start" alignItems="flex-start" className={classes.fieldKey} >
                        <Typography variant="h6">{`${window.location.host}/go/`}<span style={{ color: '#D8D8D8' }}>{formState.endpoint}</span></Typography>

                      </Grid>

                    }
                    {selectedPopulation.endpoint ? <>
                      <Grid item container direction="row" justify="flex-start" alignItems="flex-start" >
                        <Typography variant="h5" align="left" >
                          {'Endpoint QR code'}
                        </Typography>
                      </Grid>

                      <QRCode
                        renderAs="svg"
                        value={hvtURL}
                        fgColor="#0F84A9"
                        className={classes.qrcode}
                      />
                      <Grid item container direction="row" justify="center" alignItems="center" >
                        <Button
                          className={classes.qrSubText}
                          component="a"
                          href={hvtURL}
                          target="_blank"
                        >
                          {'Open Link'}
                        </Button>
                        <Button
                          className={classes.qrSubText}
                          onClick={() => { navigator.clipboard.writeText(hvtURL) }}
                        >
                          {'Copy Link'}
                        </Button>
                      </Grid>
                    </> : ''}
                  </Grid>
                </Grid>
              </Grid>
            }
            {/* </form> */}

          </Box>
          <div className={brandClasses.footerButton}>
            {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
          </div>
          <div className={brandClasses.footerButton}>
            {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          </div>
          <div className={brandClasses.footerButton} style={{ marginBottom: 0 }}>
            {/* <Button
              component={Link}
              to={`/site-manager/population-users?population_id=${selectedPopulation._id}&population_type=${selectedPopulation.type}`}
              className={clsx(classes.populationButton, brandClasses.whiteButton)}
            >
              VIEW POPULATION
            </Button>
            &ensp;
            <Button
              className={classes.nextbutton}
              classes={{ disabled: brandClasses.buttonDisabled }}
              disabled={loading}
              type="submit"
            >
              {currentMenu === 'information' ? 'NEXT' : 'UPDATE'}  {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            </Button> */}
            <TextButton
              component={Link}
              to={`/site-manager/population-users?population_id=${selectedPopulation._id}&population_type=${selectedPopulation.type}`}
            >
              VIEW POPULATION
            </TextButton>
            &ensp;
            <TextButton
              disabled={loading}
              type="submit"
            >
              {currentMenu === 'information' ? 'NEXT' : 'UPDATE'}  {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            </TextButton>
          
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}
const mapStateToProps = state => ({
  locations: state.data.locations
});

PopulationView.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  openView: PropTypes.bool.isRequired,
  handleViewClose: PropTypes.func.isRequired,
  selectedPopulation: PropTypes.object.isRequired,
  updatePopulationSettings: PropTypes.func.isRequired,
  clearPopulationSettings: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { getLocations1, updatePopulationSettings, clearPopulationSettings })(PopulationView);
