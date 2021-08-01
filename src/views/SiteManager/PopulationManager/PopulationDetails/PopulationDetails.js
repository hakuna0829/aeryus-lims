import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Button, Paper, Select, MenuItem, FormControl, Typography, IconButton, CircularProgress, InputLabel, FormControlLabel, TextField, InputAdornment } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Link, withRouter } from 'react-router-dom';
import brandStyles from 'theme/brand';
import { Edit } from 'icons';
import clsx from 'clsx';
import * as qs from 'qs';
import QRCode from 'qrcode.react';
import Alert from '@material-ui/lab/Alert';
import { getLocations1, getPopulationSetting, updatePopulationSettings } from 'actions/api';
import { clearPopulationSettings } from 'actions/clear';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import { getTestingProtocols } from 'helpers';
import getWebIntakeTypes from 'helpers/getWebIntakeTypes';
import getVaccineProtocols from 'helpers/getVaccineProtocols';
import CheckButton from 'components/CheckButton';
import IOSSwitch from 'components/IOSSwitch';
import getPopulationManagerInit from 'helpers/getPopulationManagerInit';

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
    margin: '40px auto'
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
  deleteButton: {
    marginTop: 16,
    margin: 'auto',
    backgroundColor: theme.palette.brandRed,
    border: 'none',
  },
  qrcode: {
    margin: theme.spacing(4),
    height: 180,
    width: 180
  },
  qrSubText: {
    color: theme.palette.brand,
    textTransform: 'none',
    textAlign: 'center',
    fontWeight: 600
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
}));

const PopulationDetails = props => {
  const { history, location, getLocations1, locations, getPopulationSetting, updatePopulationSettings, clearPopulationSettings } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [populationSettingsDetails, setPopulationSettingsDetails] = useState(null);
  const [formState, setFormState] = useState({ ...getPopulationManagerInit });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [editSection, setEditSection] = useState({});
  const [alertMessage, setAlertMessage] = useState(0);

  const populationId = qs.parse(location.search, { ignoreQueryPrefix: true }).population_id;

  // const hvtURL = `${window.location.protocol}//${window.location.host}/testd-appointment-calendar/authenticate?id=${populationId}`;
  const hvtURL = `${window.location.protocol}//${window.location.host}/go/${populationSettingsDetails && populationSettingsDetails.endpoint ? encodeURIComponent(populationSettingsDetails.endpoint) : ''}`;

  useEffect(() => {
    
    if (populationId) {
      // eslint-disable-next-line no-inner-declarations
      async function fetchData() {
        if (!locations)
          await getLocations1();
        const res = await getPopulationSetting(populationId);
        setFetchLoading(false);
        if (res.success) {
          if (res.data) {
            setPopulationSettingsDetails(populationSettingsDetails => ({
              ...populationSettingsDetails,
              ...res.data,
              endpoint_encoded: encodeURIComponent(res.data.endpoint)
            }));
            setFormState(formState => ({
              ...formState,
              ...res.data,
              endpoint_encoded: encodeURIComponent(res.data.endpoint)
            }));
          } else {
            setAlertMessage('Population ID is Invalid.');
          }
        }
      }
      fetchData();
    } else {
      setFetchLoading(false);
      setAlertMessage('Population ID is missing in Params');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchPopulation = async () => {
    setFetchLoading(true);
    const res = await getPopulationSetting(populationId);
    setFetchLoading(false);
    if (res.success) {
      if (res.data) {
        setPopulationSettingsDetails(populationSettingsDetails => ({ ...populationSettingsDetails, ...res.data }));
        setFormState(formState => ({ ...formState, ...res.data }));
      } else {
        setAlertMessage('Population ID is Invalid.');
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

  const handleChangeOp = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.type === 'checkbox' ? !e.target.checked : e.target.value
    }));
  };

  const keyToObject = (key) => {
    switch (key) {
      case 'location_id':
        return { location_id: formState.location_id };
      case 'testing_protocol':
        return { testing_protocol: formState.testing_protocol };
      case 'vaccine_protocol':
        return { vaccine_protocol: formState.vaccine_protocol };
      case 'web_intake_type':
        return { web_intake_type: formState.web_intake_type };
      case 'endpoint':
        return { endpoint: formState.endpoint };
      case 'form_settings':
        return {
          sms_validation: formState.sms_validation,
          health_screening_hide: formState.health_screening_hide,
          health_screening_required: formState.health_screening_required,
          health_condition_hide: formState.health_condition_hide,
          health_condition_required: formState.health_condition_required,
          contact_information_hide: formState.contact_information_hide,
          contact_information_required: formState.contact_information_required,
          last_14days_contact_hide: formState.last_14days_contact_hide,
          last_14days_contact_required: formState.last_14days_contact_required,
          home_address_hide: formState.home_address_hide,
          home_address_required: formState.home_address_required,
          demographics_ssn_hide: formState.demographics_ssn_hide,
          demographics_ssn_required: formState.demographics_ssn_required,
          insurance_information_hide: formState.insurance_information_hide,
          insurance_information_required: formState.insurance_information_required,
          personal_identity_hide: formState.personal_identity_hide,
          personal_identity_required: formState.personal_identity_required,
        };
      default:
        return;
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();
    let key = Object.keys(editSection)[0];
    let body = keyToObject(key);
    setSaveLoading(true);
    modifyPopulation(body);
  };

  const modifyPopulation = async (body) => {
    const res = await updatePopulationSettings(populationSettingsDetails._id, body);
    setSaveLoading(false);
    if (res.success) {
      clearPopulationSettings();
      setEditSection({});
      refetchPopulation();
    }
  };

  return (
    <div className={classes.root}>
      {fetchLoading
        ? <CircularProgress />
        : populationSettingsDetails
          ?
          <div>
            <div className={classes.header} >
              <div className={classes.subHeader}>
                <img src="/images/svg/building_icon.svg" alt="" />&ensp;
                <Typography variant="h2" className={brandClasses.headerTitle}>
                  {'POPULATION MANAGER |'}
                </Typography>
                <Typography variant="h4" className={classes.headerSubTitle}>
                  {'EDIT POPULATION'}
                  {/* <sup>
                    {' '}
                    <Tooltip title="Edit Population" placement="right-start">
                      <HelpIcon />
                    </Tooltip>{' '}
                  </sup> */}
                </Typography>
              </div>
              <Button
                variant="contained"
                className={classes.greenBtn}
                startIcon={<AddIcon />}
                component={Link}
                to="/site-manager/add-population">
                {'ADD POPULATION'}
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
                          {'Location'}
                        </Typography>
                        <Grid item>
                          {editSection.location_id
                            ?
                            <IconButton onClick={() => handleEdit('location_id', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('location_id', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.location_id
                          ?
                          <Grid item xs>
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
                                  <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locations && locations.find(l => l._id === populationSettingsDetails.location_id) ? locations.find(l => l._id === populationSettingsDetails.location_id).name : null}
                          </Typography>
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
                            {populationSettingsDetails.testing_protocol}
                          </Typography>
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
                            {populationSettingsDetails.vaccine_protocol}
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
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Web Intake type'}
                        </Typography>
                        <Grid item>
                          {editSection.web_intake_type
                            ?
                            <IconButton onClick={() => handleEdit('web_intake_type', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('web_intake_type', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.web_intake_type
                          ?
                          <Grid item xs>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              required
                              fullWidth
                              variant="outlined"
                            >
                              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Web Intake type</InputLabel>
                              <Select
                                onChange={handleChange}
                                label="Web Intake type* "
                                name="web_intake_type"
                                displayEmpty
                                value={formState.web_intake_type || ''}
                              >
                                <MenuItem value=''>
                                  <Typography className={brandClasses.selectPlaceholder}>Select type</Typography>
                                </MenuItem>
                                {getWebIntakeTypes.map((value, index) => (
                                  <MenuItem key={index} value={value}>{value}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {populationSettingsDetails.web_intake_type}
                          </Typography>
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
                          {'Endpoint'}
                        </Typography>
                        <Grid item>
                          {editSection.endpoint
                            ?
                            <IconButton onClick={() => handleEdit('endpoint', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('endpoint', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.endpoint
                          ?
                          <Grid item xs>
                            <TextField
                              type="text"
                              label="Endpoint"
                              placeholder="Enter endpoint"
                              name="endpoint"
                              className={brandClasses.shrinkTextField}
                              onChange={handleChange}
                              value={formState.endpoint || ''}
                              required
                              fullWidth
                              InputProps={{
                                startAdornment: <InputAdornment position="start">/go/</InputAdornment>,
                              }}
                              helperText={`URL: ${window.location.protocol}//${window.location.host}/go/${formState.endpoint_encoded ? formState.endpoint_encoded : ''}`}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                            />
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {hvtURL}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>


                <Grid item xs={12} sm={4} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <Grid container alignItems="baseline" justify="space-between">
                      <Typography variant="h5" className={classes.fieldKey}>
                        {'Web Registration Details'}
                      </Typography>
                    </Grid>
                    <Grid container direction="column" justify="center" alignItems="center" >
                      <QRCode
                        renderAs="svg"
                        value={hvtURL}
                        // fgColor="#3ECCCD"
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
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={2}></Grid>
              </Grid>

              {populationSettingsDetails.web_intake_type === 'High Volume Intake' && (
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <Paper variant="outlined" className={classes.itemPaper2}>
                      <form
                        onSubmit={handleSubmit}
                      >
                        <Grid container alignItems="baseline" justify="space-between" className={classes.operationsTitle}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'FORM SETTINGS'}
                          </Typography>
                          <Grid item>
                            {editSection.form_settings ? (
                              <IconButton
                                onClick={() => handleEdit('form_settings', false)}>
                                <CancelOutlinedIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => handleEdit('form_settings', true)}>
                                <Edit className={classes.editIcon} />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} container alignItems="center" justify="space-between" className={clsx(classes.dayHeaderRow, classes.operationRow)}></Grid>

                        {editSection.form_settings
                          ?
                          <div className={classes.upContent}>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">SMS Validation</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={formState.sms_validation}
                                    onChange={handleChange}
                                    name="sms_validation"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Health Screening</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.health_screening_hide}
                                    onChange={handleChangeOp}
                                    name="health_screening_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.health_screening_required}
                                  label="Required"
                                  name="health_screening_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Health Condition</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.health_condition_hide}
                                    onChange={handleChangeOp}
                                    name="health_condition_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.health_condition_required}
                                  label="Required"
                                  name="health_condition_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Last 14 Day Exposure</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.last_14days_contact_hide}
                                    onChange={handleChangeOp}
                                    name="last_14days_contact_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.last_14days_contact_required}
                                  label="Required"
                                  name="last_14days_contact_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Contact Information</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.contact_information_hide}
                                    onChange={handleChangeOp}
                                    name="contact_information_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.contact_information_required}
                                  label="Required"
                                  name="contact_information_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Home Address</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.home_address_hide}
                                    onChange={handleChangeOp}
                                    name="home_address_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.home_address_required}
                                  label="Required"
                                  name="home_address_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Demographics +PIN</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.demographics_ssn_hide}
                                    onChange={handleChangeOp}
                                    name="demographics_ssn_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.demographics_ssn_required}
                                  label="Required"
                                  name="demographics_ssn_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Insurance Information</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.insurance_information_hide}
                                    onChange={handleChangeOp}
                                    name="insurance_information_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.insurance_information_required}
                                  label="Required"
                                  name="insurance_information_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Personal Identification</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!formState.personal_identity_hide}
                                    onChange={handleChangeOp}
                                    name="personal_identity_hide"
                                  />}
                                  required
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={formState.personal_identity_required}
                                  label="Required"
                                  name="personal_identity_required"
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </div>
                          :
                          <div className={classes.upContent}>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">SMS Validation</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={formState.sms_validation}
                                    onChange={handleChange}
                                    name="sms_validation"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Health Screening</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.health_screening_hide}
                                    onChange={handleChangeOp}
                                    name="health_screening_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.health_screening_required}
                                  label="Required"
                                  name="health_screening_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Health Condition</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.health_condition_hide}
                                    onChange={handleChangeOp}
                                    name="health_condition_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.health_condition_required}
                                  label="Required"
                                  name="health_condition_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Last 14 Day Exposure</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.last_14days_contact_hide}
                                    onChange={handleChangeOp}
                                    name="last_14days_contact_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.last_14days_contact_required}
                                  label="Required"
                                  name="last_14days_contact_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Contact Information</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.contact_information_hide}
                                    onChange={handleChangeOp}
                                    name="contact_information_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.contact_information_required}
                                  label="Required"
                                  name="contact_information_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Home Address</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.home_address_hide}
                                    onChange={handleChangeOp}
                                    name="home_address_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.home_address_required}
                                  label="Required"
                                  name="home_address_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Demographics +PIN</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.demographics_ssn_hide}
                                    onChange={handleChangeOp}
                                    name="demographics_ssn_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.demographics_ssn_required}
                                  label="Required"
                                  name="demographics_ssn_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Insurance Information</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.insurance_information_hide}
                                    onChange={handleChangeOp}
                                    name="insurance_information_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.insurance_information_required}
                                  label="Required"
                                  name="insurance_information_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={4} className={classes.container}>
                              <Grid item md={4}>
                                <Typography variant="h5">Personal Identification</Typography>
                              </Grid>
                              <Grid item md={8}>
                                <FormControlLabel
                                  control={<IOSSwitch
                                    checked={!populationSettingsDetails.personal_identity_hide}
                                    onChange={handleChangeOp}
                                    name="personal_identity_hide"
                                  />}
                                  required
                                  disabled
                                  labelPlacement="top"
                                  classes={{ label: classes.label }}
                                />
                                <CheckButton
                                  checked={populationSettingsDetails.personal_identity_required}
                                  label="Required"
                                  name="personal_identity_required"
                                  onChange={handleChange}
                                  disabled
                                />
                              </Grid>
                            </Grid>
                          </div>
                        }

                        {editSection.form_settings && (
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
              )}
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

const mapStateToProps = state => ({
  locations: state.data.locations,
});

PopulationDetails.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getPopulationSetting: PropTypes.func.isRequired,
  updatePopulationSettings: PropTypes.func.isRequired,
  clearPopulationSettings: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, getPopulationSetting, updatePopulationSettings, clearPopulationSettings })(withRouter(PopulationDetails));