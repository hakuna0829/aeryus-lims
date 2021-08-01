import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Button, Paper, Checkbox, Select, MenuItem, FormControl, FormControlLabel, Typography, IconButton, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Tooltip, TextField, InputLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { getStates, handleImage } from 'helpers';
import { Link, withRouter } from 'react-router-dom';
import brandStyles from 'theme/brand';
import { Edit } from 'icons';
import clsx from 'clsx';
import * as qs from 'qs';
import moment from 'moment';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import MomentUtils from '@date-io/moment';
import HelpIcon from '@material-ui/icons/Help';
import { getLocation, updateLocation1, uploadImage, apiUrl } from 'actions/api';
import { clearLocations } from 'actions/clear';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import ZipCodeInput from 'components/ZipCodeInput';
import NpiInput from 'components/NpiInput';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(3)
  },
  item: {
    // width: '1000px',
    // border:'solid 1px blue',
    margin: '20px auto'
  },
  itemPaper: {
    width: '100%',
    border: '1px solid #0F84A9',
    padding: '16px',
    position: 'relative',
    marginBottom: '20px',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
  },
  itemPaper2: {
    border: '1px solid #0F84A9',
    // padding: '20px',
    position: 'relative',
    marginBottom: '40px',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
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
  submitBtnOperations: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '& .MuiTypography-h5': {
      color: theme.palette.white,
      fontSize: '16px'
    }
  },
  fieldKey: {
    color: theme.palette.brandDark,
    fontWeight: 500,
  },
  labelValue: {
    color: theme.palette.brandGray,
  },
  editAddressField: {
    marginTop: '10px',
    padding: theme.spacing(1),
  },
  sectionData: {
    marginTop: '10px'
  },
  operationsTitle: {
    padding: '10px 20px'
  },
  firstPropertyLabel: {
    // marginBottom: '-10px'
  },
  operationRow: {
    padding: theme.spacing(1),
    paddingLeft: '20px',
    paddingRight: '20px',
    lineHeight: '30px',
    borderBottom: `1px solid ${theme.palette.brand}`,
    fontFamily: 'Montserrat',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat',
    '&.MuiAccordionSummary-root': {
      padding: '0px 20px'
    }
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center',
    // textAlign: 'left'
  },
  accordionDetails: {
    display: 'flex',
    alignItems: 'center'
  },
  accExpanded: {
    margin: '0 !important',
    borderBottom: '1px solid #0F84A9'
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
    textAlign: 'left'
  },
  stationsText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    marginRight: theme.spacing(2)
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
      color: theme.palette.brandDark
    }
  },
  textAlignCenter: {
    textAlign: 'left',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    }
  },
  dayHeaderRow: {
    backgroundColor: theme.palette.brandDark,
    color: theme.palette.white,
    textAlign: 'left',
    fontFamily: 'Montserrat',
    fontWeight: '500'
  },
  marginLeft: {
    marginLeft: '50px !important'
  },
  buttonRed: {
    color: '#DD2525 !important',
    borderColor: '#DD2525 !important'
  },
  actionButtonRow: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    '& div': {
      display: 'flex',
      alignItems: 'center'
    }
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
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(3),
  },
}));

const ActiveButton = withStyles(theme => ({
  root: {
    color: '#25DD83',
    borderColor: '#25DD83',
    borderRadius: 20,
    textTransform: 'Capitalize',
    fontSize: '26px',
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: '35px',
    '&:hover': {},
    [theme.breakpoints.up('lg')]: {
      fontSize: '26px'
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      fontSize: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    }
  }
}))(Button);

const LocationDetails = props => {
  const { history, location, getLocation, updateLocation1, uploadImage, clearLocations } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [formState, setFormState] = useState({ provider: {} });
  const [imgState, setImgState] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [editSection, setEditSection] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [alertMessage, setAlertMessage] = useState(0);

  const locationId = qs.parse(location.search, { ignoreQueryPrefix: true }).location_id;

  useEffect(() => {
    console.log('LocationDetails useEffect id:', locationId);
    if (locationId) {
      async function fetchData() {
        const res = await getLocation(locationId);
        setFetchLoading(false);
        if (res.success) {
          if (res.data) {
            setLocationDetails(locationDetails => ({ ...locationDetails, ...res.data }));
            setFormState(formState => ({ ...formState, ...res.data }));
          } else {
            setAlertMessage('Location ID is Invalid.');
          }
        }
      }
      fetchData();
    } else {
      setFetchLoading(false);
      setAlertMessage('Location ID is missing in Params');
    }
  }, [locationId, getLocation]);

  const refetchLocation = async () => {
    setFetchLoading(true);
    const res = await getLocation(locationId);
    setFetchLoading(false);
    if (res.success) {
      if (res.data) {
        setLocationDetails(locationDetails => ({ ...locationDetails, ...res.data }));
        setFormState(formState => ({ ...formState, ...res.data }));
      } else {
        setAlertMessage('Location ID is Invalid.');
      }
    }
  }

  const goBack = () => {
    history.goBack();
  }

  const handleEdit = (field, isEditing) => {
    let fieldEdit = {};
    fieldEdit[field] = isEditing;
    setEditSection(fieldEdit);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAlertDialogMessage('');
  };

  const toggleLocationStatus = body => {
    modifyLocation(body);
  };

  const handleAccordianChange = index => (event, isExpanded) => {
    setExpanded(isExpanded ? `panel${index}` : false);
    if (isExpanded) {
      let operations = [...formState.operations];
      operations[index].active = true;
      setFormState(formState => ({ ...formState, ...operations }));
    }
  };

  const handleStartTimeChange = index => (date) => {
    let operations = [...formState.operations];
    operations[index].displayStartTime = date;
    operations[index].start_time = moment(date).format('HH:mm');
    setFormState(formState => ({ ...formState, ...operations }));
  };

  const handleEndTimeChange = index => (date) => {
    let operations = [...formState.operations];
    operations[index].displayEndTime = date;
    operations[index].end_time = moment(date).format('HH:mm');
    setFormState(formState => ({ ...formState, ...operations }));
  };

  const handleDayEdit = (index, value) => {
    let operations = [...formState.operations];
    operations[index].edit = value;
    setFormState(formState => ({ ...formState, ...operations }));
  };

  const handleClosedChange = index => event => {
    event.persist();
    let operations = [...formState.operations];
    operations[index].active = !event.target.checked;
    setFormState(formState => ({ ...formState, ...operations }));
  };

  const handleOperationChange = index => event => {
    event.persist();
    let operations = [...formState.operations];
    if (event.target.type === 'checkbox')
      operations[index].active = event.target.checked;
    else
      operations[index].stations = event.target.value;
    setFormState(formState => ({ ...formState, ...operations }));
  };

  const handlePhotoChange = event => {
    handleImage(event, setAlertDialogMessage, setImgState, setImgCompressionLoading, setDialogOpen);
  }

  const SaveButton = () => {
    return (
      <Button
        className={brandClasses.button}
        classes={{ disabled: brandClasses.buttonDisabled }}
        style={{ marginTop: 16, float: 'right' }}
        disabled={saveLoading}
        type="submit"
      >
        Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
      </Button>
    );
  };

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

  const keyToObject = (key) => {
    switch (key) {
      case 'name':
        return { name: formState.name };
      // case 'testing_protocol':
      //   return { testing_protocol: formState.testing_protocol };
      // case 'vaccine_protocol':
      //   return { vaccine_protocol: formState.vaccine_protocol };
      case 'office_phone':
        return { office_phone: formState.office_phone };
      case 'contact_details':
        return {
          administrator: formState.administrator,
          admin_office_phone: formState.admin_office_phone,
          email: formState.email
        };
      case 'eoc_details':
        return {
          eoc: formState.eoc,
          eoc_office_phone: formState.eoc_office_phone,
          eoc_email: formState.eoc_email
        };
      case 'address':
        return {
          address: formState.address,
          city: formState.city,
          state: formState.state,
          zip_code: formState.zip_code,
          county: formState.county,
        };
      case 'site_logo':
        return { site_logo: formState.site_logo };
      case 'provider':
        return {
          provider: {
            first_name: formState.provider.first_name,
            last_name: formState.provider.last_name,
            npi: formState.provider.npi,
            phone: formState.provider.phone,
            email: formState.provider.email,
            address: formState.provider.address,
            city: formState.provider.city,
            state: formState.provider.state,
            zip_code: formState.provider.zip_code,
          }
        };
      case 'operations':
        return { operations: formState.operations };
      case 'is_healthcare_related':
        return { is_healthcare_related: formState.is_healthcare_related };
      case 'is_resident_congregate_setting':
        return { is_resident_congregate_setting: formState.is_resident_congregate_setting };

      default:
        return;
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();
    let key = Object.keys(editSection)[0];
    let body = keyToObject(key);
    setSaveLoading(true);
    if (key === 'site_logo') {
      if (imgState.imagePath) {
        const locationLogoData = new FormData();
        locationLogoData.append('uploadImage', imgState.imagePath);
        const resLocationLogo = await uploadImage(locationLogoData);
        if (resLocationLogo.success) {
          body.site_logo = '/images/' + resLocationLogo.data;
          modifyLocation(body);
        }
      } else {
        setEditSection({});
      }
    } else if (key === 'operations') {
      if (formState.operations.every(x => !x.active)) {
        setDialogOpen(true);
        setAlertDialogMessage('Please select the Operation days.');
        return;
      } else {
        if (formState.operations.some(x => x.active && !x.stations)) {
          setDialogOpen(true);
          setAlertDialogMessage('Please add the stations for selected Operation days.');
          return;
        } else {
          modifyLocation(body);
        }
      }
    } else {
      modifyLocation(body);
    }
  };

  const modifyLocation = async (body) => {
    const res = await updateLocation1(locationDetails._id, body);
    setSaveLoading(false);
    if (res.success) {
      clearLocations();
      setEditSection({});
      refetchLocation();
    }
  };

  return (
    <div className={classes.root}>
      {fetchLoading
        ? <CircularProgress />
        : locationDetails
          ?
          <div>
            <div className={classes.header} >
              <div className={classes.subHeader}>
                <img src="/images/svg/building_icon.svg" alt="" />&ensp;
                <Typography variant="h2" className={brandClasses.headerTitle}>
                  {'LOCATION MANAGER |'}
                </Typography>
                <Typography variant="h4" className={classes.headerSubTitle}>
                  {'EDIT LOCATION'}
                  <sup>
                    {' '}
                    <Tooltip title="Edit Locaition" placement="right-start">
                      <HelpIcon />
                    </Tooltip>{' '}
                  </sup>
                </Typography>
              </div>
              <Button
                variant="contained"
                className={classes.greenBtn}
                startIcon={<AddIcon />}
                component={Link}
                to="/site-manager/add-location">
                {'ADD LOCATION'}
              </Button>
            </div>

            <div className={classes.item}>
              <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
                <Grid item xs={12} sm={4} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Location Name'}
                        </Typography>
                        {/* <Grid item className={clsx(classes.propertyLabel, classes.firstPropertyLabel)}>
                          {'Location Name'}
                        </Grid> */}
                        <Grid item>
                          {editSection.name
                            ?
                            <IconButton onClick={() => handleEdit('name', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('name', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.name
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          // <Grid item container justify="flex-start" alignItems="center">
                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.name}
                          </Typography>
                          // </Grid>
                        }
                      </Grid>
                    </form>
                  </Paper>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Office Phone Number'}
                        </Typography>
                        <Grid item>
                          {editSection.office_phone
                            ?
                            <IconButton onClick={() => handleEdit('office_phone', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('office_phone', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.office_phone
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.office_phone}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>
                  {/* <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Testing Protocol'}
                        </Typography>
                        <Grid item>
                          {editSection.testing_protocol
                            ?
                            <IconButton onClick={() => handleEdit('testing_protocol', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('testing_protocol', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.testing_protocol
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.testing_protocol}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper> */}
                  {/* <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Vaccine Protocol'}
                        </Typography>
                        <Grid item>
                          {editSection.vaccine_protocol
                            ?
                            <IconButton onClick={() => handleEdit('vaccine_protocol', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('vaccine_protocol', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.vaccine_protocol
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.vaccine_protocol}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper> */}
                </Grid>

                <Grid item xs={12} sm={4} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <Grid container alignItems="baseline" justify="space-between">
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Administrator Contact'}
                            </Typography>
                            <Grid item>
                              {editSection.contact_details
                                ?
                                <IconButton onClick={() => handleEdit('contact_details', false)}>
                                  <CancelOutlinedIcon />
                                </IconButton>
                                :
                                <IconButton onClick={() => handleEdit('contact_details', true)}>
                                  <Edit className={classes.editIcon} />
                                </IconButton>
                              }
                            </Grid>
                          </Grid>
                          {editSection.contact_details ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
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
                            </Grid>
                          ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.administrator}
                              </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div className={classes.sectionData}>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Phone Number'}
                              </Typography>
                            </Grid>
                            {editSection.contact_details ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                              </Grid>
                            ) : (
                                <Grid container justify="flex-start" alignItems="center">
                                  <Grid container>
                                    <Grid>
                                      <Typography variant="h5" className={classes.labelValue}>
                                        {locationDetails.admin_office_phone}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )}
                          </div>
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Email address'}
                              </Typography>
                            </Grid>
                            {editSection.contact_details ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                              </Grid>
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {locationDetails.email}
                                </Typography>
                              )}
                          </div>
                        </Grid>
                        {editSection.contact_details && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Is Location Healthcare Related'}
                        </Typography>
                        <Grid item>
                          {editSection.is_healthcare_related
                            ?
                            <IconButton onClick={() => handleEdit('is_healthcare_related', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('is_healthcare_related', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.is_healthcare_related
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.is_healthcare_related}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <div>
                            <Grid container alignItems="baseline" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'EOC Contact'}
                              </Typography>
                              <Grid item>
                                {editSection.eoc_details
                                  ?
                                  <IconButton onClick={() => handleEdit('eoc_details', false)}>
                                    <CancelOutlinedIcon />
                                  </IconButton>
                                  :
                                  <IconButton onClick={() => handleEdit('eoc_details', true)}>
                                    <Edit className={classes.editIcon} />
                                  </IconButton>
                                }
                              </Grid>
                            </Grid>
                            {editSection.eoc_details ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                              </Grid>
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {locationDetails.eoc}
                                </Typography>
                              )}
                          </div>
                        </Grid>

                        <Grid item xs={12}>
                          <div className={classes.sectionData}>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Phone Number'}
                              </Typography>
                            </Grid>
                            {editSection.eoc_details ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                              </Grid>
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {locationDetails.eoc_office_phone}
                                </Typography>
                              )}
                          </div>
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Email address'}
                              </Typography>
                            </Grid>
                            {editSection.eoc_details ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                              </Grid>
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {locationDetails.eoc_email}
                                </Typography>
                              )}
                          </div>
                        </Grid>
                        {editSection.eoc_details && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Is this a resident congregate setting'}
                        </Typography>
                        <Grid item>
                          {editSection.is_resident_congregate_setting
                            ?
                            <IconButton onClick={() => handleEdit('is_resident_congregate_setting', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('is_resident_congregate_setting', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.is_resident_congregate_setting
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.is_resident_congregate_setting}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
                <Grid item xs={12} sm={8}>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <Grid container alignItems="baseline" justify="space-between">
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Address'}
                            </Typography>
                            <Grid item>
                              {editSection.address ? (
                                <IconButton onClick={() => handleEdit('address', false)}>
                                  <CancelOutlinedIcon />
                                </IconButton>
                              ) : (
                                  <IconButton onClick={() => handleEdit('address', true)}>
                                    <Edit className={classes.editIcon} />
                                  </IconButton>
                                )}
                            </Grid>
                          </Grid>
                          {editSection.address ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
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
                            </Grid>
                          ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.address}
                              </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={3} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'City'}
                          </Typography>
                          {editSection.address ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
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
                            </Grid>
                          ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.city}
                              </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={3} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'State'}
                          </Typography>
                          {editSection.address ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
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
                            </Grid>
                          ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.state}
                              </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <div className={classes.sectionData}>
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Zip Code'}
                            </Typography>
                            {editSection.address ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {locationDetails.zip_code}
                                </Typography>
                              )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <div className={classes.sectionData}>
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'County'}
                            </Typography>
                            {editSection.address ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
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
                              </Grid>
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {locationDetails.county}
                                </Typography>
                              )}
                          </div>
                        </Grid>
                        {editSection.address && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          Site Logo
                        </Typography>
                        <Grid item>
                          {editSection.site_logo
                            ?
                            <IconButton onClick={() => handleEdit('site_logo', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('site_logo', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.site_logo
                          ?
                          <Grid item xs>
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
                            <SaveButton />
                          </Grid>
                          :
                          <Grid item container justify="flex-start" alignItems="center">
                            {formState.site_logo && (
                              <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                            )}
                          </Grid>
                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container>
                <Paper variant="outlined" className={classes.itemPaper}>
                  <form
                    onSubmit={handleSubmit}
                  >
                    <Grid container alignItems="baseline" justify="space-between">
                      <Typography variant="h5" className={classes.fieldKey}>
                        {'Provider'}
                      </Typography>
                      <Grid item>
                        {editSection.provider
                          ?
                          <IconButton onClick={() => handleEdit('provider', false)}>
                            <CancelOutlinedIcon />
                          </IconButton>
                          :
                          <IconButton onClick={() => handleEdit('provider', true)}>
                            <Edit className={classes.editIcon} />
                          </IconButton>
                        }
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12} sm={3} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Provider First Name'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.first_name}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={3} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Provider Last Name'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.last_name}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={3} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'NPI'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
                              <NpiInput
                                type="text"
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.npi}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={3} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Phone Number'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.phone}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={3} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Email Address'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.email}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={3} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Address'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.address}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={2} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'City'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.city}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={2} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'State'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.state}
                            </Typography>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={2} className={classes.sectionData}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Zip Code'}
                        </Typography>
                        {editSection.provider ? (
                          <Grid container item className={classes.editAddressField}>
                            <Grid item xs>
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
                          </Grid>
                        ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.zip_code}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                    {editSection.provider && (
                      <Grid item xs={12}>
                        <SaveButton />
                      </Grid>
                    )}
                  </form>
                </Paper>
              </Grid>

              <Grid container>
                <Grid item xs={12} sm={12}>
                  <Paper variant="outlined" className={classes.itemPaper2}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between" className={classes.operationsTitle}>
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Operation Details'}
                        </Typography>
                        <Grid item>
                          {editSection.operations ? (
                            <IconButton
                              onClick={() => handleEdit('operations', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                          ) : (
                              <IconButton
                                onClick={() => handleEdit('operations', true)}>
                                <Edit className={classes.editIcon} />
                              </IconButton>
                            )}
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} container alignItems="center" justify="space-between" className={clsx(classes.dayHeaderRow, classes.operationRow)}>
                        <Grid item xs={12} sm={4}>{'Day'}</Grid>
                        <Grid item xs={12} sm={5}>{'Hours'}</Grid>
                        <Grid item xs={12} sm={3} className={classes.textAlignCenter}>{'Stations'}</Grid>
                      </Grid>

                      {editSection.operations
                        ?
                        formState.operations.map((day, index) => (
                          <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={handleAccordianChange(index)}
                            classes={{ expanded: classes.accExpanded }}>
                            <AccordionSummary
                              className={clsx(classes.accordion, index % 2 === 0 && brandClasses.tableRow2)}
                              classes={{ content: classes.accordionSummary }}
                            >
                              <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center">
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
                                <Grid item xs={12} sm={5}>
                                  <Typography variant="h5" className={classes.timeText}>
                                    {day.active
                                      ? day.opens24hours
                                        ? 'Opens 24 Hours'
                                        : moment(day.start_time, 'HH:mm').format('hh:mm A') + ' - ' + moment(day.end_time, 'HH:mm').format('hh:mm A')
                                      : 'Closed'
                                    }
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <Typography variant="h5" className={classes.stationsText}>
                                    {day.stations}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails className={classes.root} classes={{ root: classes.accordionDetails }}>
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
                                          value={moment(day.start_time, 'HH:mm')}
                                          onChange={handleStartTimeChange(index)}
                                          className={classes.timeField}
                                        />
                                        <Typography variant="h5" className={classes.operationDescription}>
                                          {'-'}
                                        </Typography>
                                        <KeyboardTimePicker
                                          value={moment(day.end_time, 'HH:mm')}
                                          onChange={handleEndTimeChange(index)}
                                          className={classes.timeField}
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
                                      {moment(day.start_time, 'HH:mm').format('hh:mm A') + ' - ' + moment(day.end_time, 'HH:mm').format('hh:mm A')}
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
                        ))
                        :
                        locationDetails.operations.map((day, index) => (
                          <Grid item xs={12} sm={12} container className={classes.operationRow} key={index}>
                            <Grid container direction="row" justify="space-between" alignItems="center">
                              <Grid item xs={12} sm={4}>
                                <Typography variant="h5" className={classes.timeText}>
                                  {day.day_name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={5}>
                                <Typography variant="h5" className={classes.timeText}>
                                  {day.active
                                    ? day.opens24hours
                                      ? 'Opens 24 Hours'
                                      : moment(day.start_time, 'HH:mm').format('hh:mm A') + ' - ' + moment(day.end_time, 'HH:mm').format('hh:mm A')
                                    : 'Closed'
                                  }
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Typography variant="h5" className={classes.stationsText}>
                                  {day.stations}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))
                      }

                      {editSection.operations && (
                        <Grid container justify={'flex-end'}>
                          <Grid className={classes.submitBtnOperations} item xs={12}>
                            <SaveButton />
                          </Grid>
                        </Grid>
                      )}
                    </form>
                  </Paper>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <div className={classes.actionButtonRow}>
                  <ActiveButton
                    variant="outlined"
                    disabled={locationDetails.active || saveLoading}
                    style={{ marginRight: 15 }}
                    onClick={() => toggleLocationStatus({ active: true })}>
                    {'Activate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </ActiveButton>
                  <ActiveButton
                    variant="outlined"
                    disabled={!locationDetails.active || saveLoading}
                    className={locationDetails.active ? classes.buttonRed : ''}
                    style={{ marginLeft: 15 }}
                    onClick={() => toggleLocationStatus({ active: false })}>
                    {'Deactivate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </ActiveButton>
                </div>
              </Grid>
            </div>
          </div>
          : <div className={classes.alert}>
            <Alert severity="error">
              {alertMessage}
              <Button
                onClick={goBack}
              >
                {'Go Back'}
              </Button>
            </Alert>
          </div>
      }

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

LocationDetails.propTypes = {
  getLocation: PropTypes.func.isRequired,
  updateLocation1: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  clearLocations: PropTypes.func.isRequired,
};

export default connect(null, { getLocation, updateLocation1, uploadImage, clearLocations })(withRouter(LocationDetails));