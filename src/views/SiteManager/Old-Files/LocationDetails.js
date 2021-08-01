import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Paper,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { getStates } from 'helpers';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import brandStyles from 'theme/brand';
import { Edit } from 'icons';
import { IconButton, CircularProgress } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { updateLocation } from '../../actions/api';
import { showErrorDialog, showFailedDialog } from '../../actions/dialogAlert';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(3)
  },
  greenBtnContainer: {
    padding: '12px 5px !important',
    '@media (max-width:620px)': {
      justifyContent: 'center'
    }
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline'
  },
  title: {
    color: '#043B5D',
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '43px',
    marginLeft: 20
  },
  content: {
    textAlign: 'center',
    width: '100%'
  },
  item: {
    // width: '1000px',
    // border:'solid 1px blue',
    margin: '20px auto'
  },
  itemPaper: {
    border: '1px solid #3ECCCD',
    padding: '20px',
    position: 'relative',
    marginBottom: '40px'
  },
  itemPaper2: {
    border: '1px solid #3ECCCD',
    // padding: '20px',
    position: 'relative',
    marginBottom: '40px'
  },
  greenBtn: {
    background: theme.palette.brandGreen,
    color: theme.palette.white,
    fontSize: 16,
    borderRadius: '10px',
    textTransform: 'capitalize'
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    '& .MuiTypography-h4': {
      color: theme.palette.white,
      fontSize: '16px'
    }
  },
  submitBtnOperations: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent:'flex-end',
    alignItems: 'center',
    '& .MuiTypography-h4': {
      color: theme.palette.white,
      fontSize: '16px'
    }
  },
  locationLogo: {
    // margin: '40px auto 20px'
    width: 50
  },
  propertyLabel: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    fontSize: '22px',
    fontWeight: 500,

    textAlign: 'left',
    [theme.breakpoints.up('lg')]: {
      fontSize: '22px',
      lineHeight: '37px'
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '20px',
      lineHeight: '30px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '24px'
    }
  },
  propertyValue: {
    color: theme.palette.brandGray,
    fontSize: '22px',
    '&:last-child': {
      marginBottom: 0
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '22px',
      lineHeight: '37px'
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '20px',
      lineHeight: '30px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '24px'
    }
  },
  inputField: {
    width: '100%'
  },
  editAddressField: {
    marginTop: '10px'
  },
  sectionData: {
    marginTop: '10px'
  },
  operationsTitle: {
    padding: '10px 20px'
  },
  firstPropertyLabel: {
    marginBottom: '-10px'
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
    textAlign: 'left'
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
      width: '70px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark
    }
  },
  lastRow: {
    borderBottom: 'none'
  },
  checkBoxColor: {
    color: `${theme.palette.brandDark} !important`
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
  }
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
  const { history, location } = props;
  const { locationDetails } = location.state;
  console.log('location props', location)
  const classes = useStyles();
  const brandClasses = brandStyles();
  const [locationDetailsState, setLocationDetailsState] = useState(
    locationDetails
  );
  const [setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [daysData, setDaysData] = useState([...locationDetails.operations]);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [editSection, setEditSection] = useState({});
  const [expanded, setExpanded] = useState(false);
  const ActionButton = data => {
    const isActive = data.row && data.row.active;
    return (
      <div className={classes.actionButtonRow}>
        <ActiveButton
          variant="outlined"
          disabled={isActive}
          style={{ marginRight: 15 }}
          onClick={() => toggleLocationStatus({ ...data.row, active: true })}>
          Activate
        </ActiveButton>
        <ActiveButton
          variant="outlined"
          disabled={!isActive}
          className={isActive ? classes.buttonRed : ''}
          style={{ marginLeft: 15 }}
          onClick={() => toggleLocationStatus({ ...data.row, active: false })}>
          Deactivate
        </ActiveButton>
      </div>
    );
  };
  const handleEdit = (field, isEditing) => {
    let fieldEdit = { ...editSection };
    //setIsDetailsEdited(true);
    fieldEdit[field] = isEditing;
    setEditSection(fieldEdit);
  };
  const changeHandler = e => {
    e.persist();
    console.log('locationDetailsState',locationDetailsState)
    console.log('e.target',e.target)
    setLocationDetailsState(locationDetailsState => ({
      ...locationDetailsState,
      [e.target.name]: e.target.value
    }));
  };

  const toggleLocationStatus = async location => {
    debugger;
    try {
      await changeLocationDetails(location);
    } catch (e) { }
  };

  const handleAccordianChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDayActive = index => event => {
    let prevDaysData = [...daysData];
    prevDaysData[index].active = !prevDaysData[index].active;
    setDaysData(prevDaysData);
    event.stopPropagation();
  };
  const handle24Hours = (indx) => {
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

  const updateLocationDetails = async event => {
    const locationData = {
      ...locationDetailsState,
      operations: [...daysData]
    };
    try {
      await changeLocationDetails(locationData);
      history.push('/site-manager/location-manager');
    } catch (e) { }
  };
  const changeLocationDetails = async modifiedLocation => {
    setIsLoading(true);
    updateLocation(modifiedLocation._id, modifiedLocation)
      .then(res => {
        setIsLoading(false);
        if (res.data.success) {
          setLocationDetailsState(modifiedLocation);
        } else {
          showFailedDialog(res);
          // throw 'Unable to save';
        }
      })
      .catch(error => {
        setIsLoading(true);
        setIsLoading(false);
        showErrorDialog(error);
        console.error(error);
        throw error;
      });
  };
  const handleFormErrors = () => {
    setFormError(true);
    window.scrollTo(0, 0);
  };

  const handleStartTimeChange = (index, date) => {
    let prevDaysData = [...daysData];
    prevDaysData[index].active = true;
    prevDaysData[index].start_time = moment(date)
      .format('HH:mm A')
      .toString();
    setDaysData(prevDaysData);
  };

  const handleEndTimeChange = (index, date) => {
    let prevDaysData = [...daysData];
    prevDaysData[index].active = true;
    prevDaysData[index].end_time = moment(date)
      .format('HH:mm A')
      .toString();
    setDaysData(prevDaysData);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item container xs={12} sm={6} className="titleContainer">
          <img
            src="/images/svg/status/building_icon_turquoise.svg"
            className={classes.locationLogo}
            alt=""
          />
          <Typography variant="h5" className={classes.title}>
            Location Details
          </Typography>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={6}
          justify="flex-end"
          className={classes.greenBtnContainer}>
          <Button
            variant="contained"
            className={classes.greenBtn}
            startIcon={<AddIcon />}
            component={Link}
            to="/site-manager/add-location">
            ADD LOCATION
          </Button>
        </Grid>
      </Grid>
      <div className={classes.content}>
        <div className={classes.item}>
          {isLoading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
          <Grid container spacing={matches ? 5 : 0} alignItems="flex-start">
            <Grid item xs={12} sm={12} md={4}>
              <Paper variant="outlined" className={classes.itemPaper}>
                <ValidatorForm
                  onSubmit={() => {
                    editSection.name = false;
                    updateLocationDetails();
                  }}
                  onError={() => handleFormErrors()}>
                  <div>
                    <Grid
                      container
                      alignItems="baseline"
                      justify="space-between">
                      <Grid
                        item
                        className={clsx(
                          classes.propertyLabel,
                          classes.firstPropertyLabel
                        )}>
                        {' '}
                        Location Name{' '}
                      </Grid>
                      <Grid item>
                        {editSection.name ? (
                          <IconButton onClick={() => handleEdit('name', false)}>
                            <CancelOutlinedIcon />
                          </IconButton>
                        ) : (
                            <IconButton onClick={() => handleEdit('name', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          )}
                      </Grid>
                    </Grid>
                  </div>
                  <Grid container alignItems="flex-start">
                    {editSection.name ? (
                      <Grid item xs>
                        <TextValidator
                          className={clsx(
                            brandClasses.shrinkTextField,
                            classes.inputField
                          )}
                          placeholder="Enter Location"
                          validators={['required']}
                          variant="outlined"
                          value={locationDetailsState.name}
                          classes={{ root: classes.labelRoot }}
                          name="name"
                          onChange={changeHandler}
                          errorMessages={['']}
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                        <div style={{ float: 'right' }}>
                          <Button
                            type="submit"
                            className={clsx(
                              classes.submitBtn,
                              brandClasses.button
                            )}>
                            <Typography variant="h4">{'Save'}</Typography>
                          </Button>
                        </div>
                      </Grid>
                    ) : (
                        <Grid
                          item
                          container
                          justify="flex-start"
                          alignItems="center">
                          {' '}
                          <Typography
                            variant="h5"
                            className={classes.propertyValue}>
                            {locationDetailsState.name || `< name >`}
                          </Typography>
                        </Grid>
                      )}
                  </Grid>
                </ValidatorForm>
              </Paper>
              <Paper variant="outlined" className={classes.itemPaper}>
                <ValidatorForm
                  onSubmit={() => {
                    editSection.address = false;
                    updateLocationDetails();
                  }}
                  onError={() => handleFormErrors()}>
                  <Grid container alignItems="flex-start">
                    <Grid item xs={12}>
                      <div>
                        <Grid
                          container
                          alignItems="baseline"
                          justify="space-between">
                          <Grid
                            item
                            className={clsx(
                              classes.propertyLabel,
                              classes.firstPropertyLabel
                            )}>
                            {' '}
                            Address{' '}
                          </Grid>
                          <Grid item>
                            {editSection.address ? (
                              <IconButton
                                onClick={() => handleEdit('address', false)}>
                                <CancelOutlinedIcon />
                              </IconButton>
                            ) : (
                                <IconButton
                                  onClick={() => handleEdit('address', true)}>
                                  <Edit className={classes.editIcon} />
                                </IconButton>
                              )}
                          </Grid>
                        </Grid>
                        {editSection.address ? (
                          <Grid
                            container
                            item
                            className={classes.editAddressField}>
                            <Grid item xs>
                              <TextValidator
                                className={clsx(
                                  brandClasses.shrinkTextField,
                                  classes.inputField
                                )}
                                placeholder="Enter address"
                                validators={['required']}
                                variant="outlined"
                                value={locationDetailsState.address}
                                classes={{ root: classes.labelRoot }}
                                name="address"
                                onChange={changeHandler}
                                errorMessages={['']}
                                InputProps={{
                                  classes: { root: classes.inputLabel }
                                }}
                                InputLabelProps={{ shrink: true }}
                                required
                              />
                            </Grid>
                          </Grid>
                        ) : (
                            <Grid
                              item
                              container
                              justify="flex-start"
                              alignItems="center">
                              <Grid container>
                                <Grid>
                                  <Typography
                                    variant="h5"
                                    className={classes.propertyValue}>
                                    {locationDetailsState.address ||
                                      `< address >`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                      </div>
                    </Grid>
                    <Grid item xs={12} className={classes.sectionData}>
                      <div className={classes.sectionData}>
                        <Grid
                          container
                          alignItems="center"
                          justify="space-between">
                          <Grid item className={classes.propertyLabel}>
                            {' '}
                            City{' '}
                          </Grid>
                        </Grid>
                        {editSection.address ? (
                          <Grid
                            container
                            item
                            className={classes.editAddressField}>
                            <Grid item xs>
                              <TextValidator
                                className={clsx(
                                  brandClasses.shrinkTextField,
                                  classes.inputField
                                )}
                                placeholder="Enter city"
                                validators={['required']}
                                variant="outlined"
                                value={locationDetailsState.city}
                                classes={{ root: classes.labelRoot }}
                                name="city"
                                onChange={changeHandler}
                                errorMessages={['']}
                                InputProps={{
                                  classes: { root: classes.inputLabel }
                                }}
                                InputLabelProps={{ shrink: true }}
                                required
                              />
                            </Grid>
                          </Grid>
                        ) : (
                            <Grid
                              item
                              container
                              justify="flex-start"
                              alignItems="center">
                              <Grid container>
                                <Grid>
                                  <Typography
                                    variant="h5"
                                    className={classes.propertyValue}>
                                    {locationDetailsState.city || `< city >`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                      </div>
                    </Grid>

                    <Grid item xs={12} className={classes.sectionData}>
                      <Grid item xs={12} md={6}>
                        <div>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between">
                            <Grid item className={classes.propertyLabel}>
                              {' '}
                              State{' '}
                            </Grid>
                          </Grid>
                          {editSection.address ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <SelectValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  style={{ width: '100%' }}
                                  placeholder="Enter state"
                                  validators={['required']}
                                  variant="outlined"
                                  value={locationDetailsState.state}
                                  classes={{ root: classes.labelRoot }}
                                  name="name"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required>
                                  {getStates.map((state, index) => (
                                    <MenuItem key={index} value={state.text}>
                                      {state.text}
                                    </MenuItem>
                                  ))}
                                </SelectValidator>
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                container
                                item
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.state || `< state >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div className={classes.sectionData}>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between">
                            <Grid item className={classes.propertyLabel}>
                              Zip Code
                            </Grid>
                          </Grid>
                          {editSection.address ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter Zip code"
                                  validators={[
                                    'required',
                                    'matchRegexp:[0-9]$'
                                  ]}
                                  variant="outlined"
                                  value={locationDetailsState.zip_code}
                                  classes={{ root: classes.labelRoot }}
                                  name="zip_code"
                                  type="tel"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.zip_code ||
                                        `< Zip_code >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>
                    </Grid>
                    {editSection.address && (
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          style={{ float: 'right' }}
                          className={clsx(
                            classes.submitBtn,
                            brandClasses.button
                          )}>
                          <Typography variant="h4">{'Save'}</Typography>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </ValidatorForm>
              </Paper>
            </Grid>
            <Grid
              item
              container
              spacing={matches ? 4 : 0}
              xs={12}
              sm={12}
              md={8}>
              <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.itemPaper}>
                  <ValidatorForm
                    onSubmit={() => {
                      editSection.contact_details = false;
                      updateLocationDetails();
                    }}
                    onError={() => handleFormErrors()}>
                    <Grid container alignItems="flex-start">
                      <Grid item xs={12}>
                        <div>
                          <Grid
                            container
                            alignItems="baseline"
                            justify="space-between">
                            <Grid
                              item
                              className={clsx(
                                classes.propertyLabel,
                                classes.firstPropertyLabel
                              )}>
                              {' '}
                              Administrator Contact{' '}
                            </Grid>
                            <Grid item>
                              {editSection.contact_details ? (
                                <IconButton
                                  onClick={() =>
                                    handleEdit('contact_details', false)
                                  }>
                                  <CancelOutlinedIcon />
                                </IconButton>
                              ) : (
                                  <IconButton
                                    onClick={() =>
                                      handleEdit('contact_details', true)
                                    }>
                                    <Edit className={classes.editIcon} />
                                  </IconButton>
                                )}
                            </Grid>
                          </Grid>
                          {editSection.contact_details ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter name"
                                  validators={['required']}
                                  variant="outlined"
                                  value={locationDetailsState.administrator}
                                  classes={{ root: classes.labelRoot }}
                                  name="administrator"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.administrator ||
                                        `< name >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>

                      <Grid item xs={12} className={classes.sectionData}>
                        <div className={classes.sectionData}>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between">
                            <Grid item className={classes.propertyLabel}>
                              Phone Number
                            </Grid>
                          </Grid>
                          {editSection.contact_details ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter phone number"
                                  validators={[
                                    'required',
                                    'matchRegexp:[0-9]$'
                                  ]}
                                  variant="outlined"
                                  value={locationDetailsState.phone}
                                  classes={{ root: classes.labelRoot }}
                                  name="phone"
                                  type="tel"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.phone || `< Phone >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>

                      <Grid item xs={12} className={classes.sectionData}>
                        <div>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between">
                            <Grid item className={classes.propertyLabel}>
                              {' '}
                              Email address{' '}
                            </Grid>
                          </Grid>
                          {editSection.contact_details ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter email"
                                  validators={['required', 'isEmail']}
                                  variant="outlined"
                                  value={locationDetailsState.email}
                                  classes={{ root: classes.labelRoot }}
                                  name="email"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.email || `< email >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>
                      {editSection.contact_details && (
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            style={{ float: 'right' }}
                            className={clsx(
                              classes.submitBtn,
                              brandClasses.button
                            )}>
                            <Typography variant="h4">{'Save'}</Typography>
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </ValidatorForm>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.itemPaper}>
                  <ValidatorForm
                    onSubmit={() => {
                      editSection.eoc_details = false;
                      updateLocationDetails();
                    }}
                    onError={() => handleFormErrors()}>
                    <Grid container alignItems="flex-start">
                      <Grid item xs={12}>
                        <div>
                          <Grid
                            container
                            alignItems="baseline"
                            justify="space-between">
                            <Grid
                              item
                              className={clsx(
                                classes.propertyLabel,
                                classes.firstPropertyLabel
                              )}>
                              {' '}
                              EOC Contact{' '}
                            </Grid>
                            <Grid item>
                              {editSection.eoc_details ? (
                                <IconButton
                                  onClick={() =>
                                    handleEdit('eoc_details', false)
                                  }>
                                  <CancelOutlinedIcon />
                                </IconButton>
                              ) : (
                                  <IconButton
                                    onClick={() =>
                                      handleEdit('eoc_details', true)
                                    }>
                                    <Edit className={classes.editIcon} />
                                  </IconButton>
                                )}
                            </Grid>
                          </Grid>
                          {editSection.eoc_details ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter eoc"
                                  validators={['required']}
                                  variant="outlined"
                                  value={locationDetailsState.eoc}
                                  classes={{ root: classes.labelRoot }}
                                  name="eoc"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.eoc || `< EOC >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>

                      <Grid item xs={12}>
                        <div className={classes.sectionData}>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between">
                            <Grid item className={classes.propertyLabel}>
                              Office Phone Number
                            </Grid>
                          </Grid>
                          {editSection.eoc_details ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter office phone number"
                                  validators={[
                                    'required',
                                    'matchRegexp:[0-9]$'
                                  ]}
                                  variant="outlined"
                                  value={locationDetailsState.eoc_office_phone}
                                  classes={{ root: classes.labelRoot }}
                                  name="eoc_office_phone"
                                  type="phone"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.eoc_office_phone ||
                                        `< 000.000.00000 >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>

                      <Grid item xs={12} className={classes.sectionData}>
                        <div>
                          <Grid
                            container
                            alignItems="center"
                            justify="space-between">
                            <Grid item className={classes.propertyLabel}>
                              {' '}
                              Email address{' '}
                            </Grid>
                          </Grid>
                          {editSection.eoc_details ? (
                            <Grid
                              container
                              item
                              className={classes.editAddressField}>
                              <Grid item xs>
                                <TextValidator
                                  className={clsx(
                                    brandClasses.shrinkTextField,
                                    classes.inputField
                                  )}
                                  placeholder="Enter state"
                                  validators={['required', 'isEmail']}
                                  variant="outlined"
                                  value={locationDetailsState.eoc_email}
                                  classes={{ root: classes.labelRoot }}
                                  name="eoc_email"
                                  onChange={changeHandler}
                                  errorMessages={['']}
                                  InputProps={{
                                    classes: { root: classes.inputLabel }
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  required
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Grid
                                item
                                container
                                justify="flex-start"
                                alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography
                                      variant="h5"
                                      className={classes.propertyValue}>
                                      {locationDetailsState.eoc_email ||
                                        `< name@company.com >`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                        </div>
                      </Grid>
                      {editSection.eoc_details && (
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            style={{ float: 'right' }}
                            className={clsx(
                              classes.submitBtn,
                              brandClasses.button
                            )}>
                            <Typography variant="h4">{'Save'}</Typography>
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </ValidatorForm>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Paper variant="outlined" className={classes.itemPaper2}>
                  <Grid
                    container
                    alignItems="baseline"
                    justify="space-between"
                    className={classes.operationsTitle}>
                    <Grid item className={classes.propertyLabel}>
                      Operation Details
                    </Grid>
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
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    container
                    alignItems="center"
                    justify="space-between"
                    className={clsx(
                      classes.dayHeaderRow,
                      classes.operationRow
                    )}>
                    <Grid item xs={12} sm={4}>
                      Day
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      Hours
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      className={classes.textAlignCenter}>
                      Stations
                    </Grid>
                  </Grid>

                  {!editSection.operations &&
                    daysData.map((day, indx) => (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        container
                        className={classes.operationRow}
                        key={indx}>
                        <Grid
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant="h6"
                              className={classes.timeText}>
                              {day.day_name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Typography
                              variant="h6"
                              className={classes.timeText}>
                              {day.active
                                ? day.opens24hours
                                  ? 'Opens 24 Hours'
                                  : moment(day.start_time, 'HH:mm').format(
                                    'hh:mm A'
                                  ) +
                                  ' - ' +
                                  moment(day.end_time, 'HH:mm').format(
                                    'hh:mm A'
                                  )
                                : 'Closed'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography
                              variant="h6"
                              className={classes.stationsText}>
                              {day.stations}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}

                  {editSection.operations &&
                    daysData.map((day, indx) => (
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
                            <Grid item xs={12} sm={4}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleDayActive(indx)}
                                    name={day.day_name}
                                    checked={day.active}
                                  />
                                }
                                label={day.day_name}
                                className={classes.dayCheckbox}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <Typography
                                variant="h6"
                                className={classes.timeText}>
                                {day.active
                                  ? day.opens24hours
                                    ? 'Opens 24 Hours'
                                    : moment(day.start_time, 'HH:mm').format(
                                      'hh:mm A'
                                    ) +
                                    ' - ' +
                                    moment(day.end_time, 'HH:mm').format(
                                      'hh:mm A'
                                    )
                                  : 'Closed'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography
                                variant="h6"
                                className={classes.stationsText}>
                                {day.stations}
                              </Typography>
                            </Grid>
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
                            <Grid item xs={1}></Grid>
                            <Grid item xs={12} sm={7}>
                              {!day.opens24hours && (
                                <Grid
                                  container
                                  direction="row"
                                  justify="space-between"
                                  alignItems="center">
                                  <MuiPickersUtilsProvider
                                    libInstance={moment}
                                    utils={MomentUtils}>
                                    <KeyboardTimePicker
                                      value={moment(day.start_time, 'HH:mm')}
                                      onChange={date =>
                                        handleStartTimeChange(indx, date)
                                      }
                                      className={classes.timeField}
                                    />
                                    <Typography
                                      variant="h4"
                                      className={classes.operationDescription}>
                                      {'-'}
                                    </Typography>
                                    <KeyboardTimePicker
                                      value={moment(day.end_time, 'HH:mm')}
                                      onChange={date =>
                                        handleEndTimeChange(indx, date)
                                      }
                                      className={classes.timeField}
                                    />
                                  </MuiPickersUtilsProvider>
                                </Grid>
                              )}
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={() => handle24Hours(indx)}
                                    name={day.day_name}
                                    checked={day.opens24hours}
                                  />
                                }
                                label="Open 24 hours"
                                className={classes.dayCheckbox}
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
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
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}

                  {editSection.operations && (
                    <Grid container justify={'flex-end'}>
                      <Grid
                        className={classes.submitBtnOperations}
                        item
                        xs={12}>
                        <Button
                          onClick={() => {
                            editSection.operations = false;
                            updateLocationDetails();
                          }}
                          className={brandClasses.button}>
                          <Typography variant="h4">{'Save'}</Typography>
                        </Button>
                      </Grid>
                    </Grid>

                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} sm={12}>
                <ActionButton row={locationDetailsState} />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default withRouter(LocationDetails);
