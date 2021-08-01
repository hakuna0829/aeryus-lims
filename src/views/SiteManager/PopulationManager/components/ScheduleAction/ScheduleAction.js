import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import {
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  withStyles,
  Grid,
} from '@material-ui/core';
import moment from 'moment';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import brandStyles from 'theme/brand';
import { getLocations1, getAllPopulationSetting, getScheduleAvailableDates, getScheduleAvailableTimeByDate, confirmSchedule } from 'actions/api';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div variant="h6">{children}</div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    color: theme.palette.brandDark,
    // textAlign: 'center',
    fontWeight: 600,
  },
  birthday: {
    paddingTop: 10,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > div ': {
      marginRight: 15,
      marginBottom: 15,
      '&:last-child': {
        marginRight: 0,
      }
    }
  },
  scheduleBox: {
    margin: 10,
    boxSizing: 'border-box',
    borderRadius: 12,
    // border: '1.2px solid #0F84A9',
    backgroundColor: '#FFFFFF',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.2)',
    width: '150px',
    height: '150px',
    cursor: 'pointer',
  },
  activeScheduleBox: {
    margin: 10,
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1.2px solid #0F84A9',
    backgroundColor: '#0F84A9',
    boxShadow: '2px 2px 6px 1px rgba(15,132,169,0.2)',
    width: '150px',
    height: '150px',
    '&:hover': {
      backgroundColor: '#0F84A9',
    },
    cursor: 'pointer',
  },
  displaytext: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  activeDisplaytext: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    marginBottom: 5
  },
  editIcon: {
    color: theme.palette.blueDark,
  },
  displayDay: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1.2px solid #0F84A9',
    backgroundColor: '#FFFFFF',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.2)',
    cursor: 'pointer',
  },

  activeDisplayDay: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    boxShadow: '2px 2px 6px 1px rgba(15,132,169,0.2)',
    margin: 10,
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1.2px solid #0F84A9',
    backgroundColor: '#0F84A9',
    '&:hover': {
      backgroundColor: '#0F84A9',
    },
    cursor: 'pointer',
  },
  hide: {
    display: 'none'
  },
  emptyIcon: {
    width: 49
  },
  displayTime: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1.2px solid #0F84A9',
    backgroundColor: '#FFFFFF',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.2)',
    cursor: 'pointer',
  },

  activeDisplayTime: {
    color: '#3ECCCD',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    boxShadow: '2px 2px 6px 1px rgba(15,132,169,0.2)',
    // margin: 10,
    boxSizing: 'border-box',
    borderRadius: 12,
    // border: '1.2px solid #0F84A9',
    backgroundColor: '#3ECCCD',
    '&:hover': {
      backgroundColor: '#3ECCCD',
    },
    cursor: 'pointer',
  },
  divider: {
    width: '80%',
    color: '#0F84A9',
    border: 'solid 1px',
    margin: '5px auto'
  },
  backButton: {
    border: '1px solid #0F84A9',
    borderRadius: '1px',
    background: '#FFFFFF',
    color: '#0F84A9',
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
    margin: 6
  },
  doneButton: {
    color: '#FFFFFF',
    backgroundColor: '#3ECCCD',
    border: 'none',
    borderRadius: '1px',
    '&:hover': {
      backgroundColor: '#3ECCCD',
    },
    margin: 6
  },
  successtitle: {
    fontWeight: 600,
    fontSize: '30px',
    lineHeight: '40px',
    textAlign: 'center',
    color: theme.palette.brandGreen
  },
  checkMark: {
    margin: '18px 0px',
  },
  dialogHeader: {
    fontSize: "20px"
  }
}));

const ScheduleAction = (props) => {
  const { history, getLocations1, locations, getAllPopulationSetting, populationSettings, dialogOpen, onDialogClose, user, getScheduleAvailableDates, getScheduleAvailableTimeByDate, confirmSchedule, populationId } = props;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3IiOiJTY2hlZHVsZSIsImlhdCI6MTU5NzI0NzY2MX0.3tRBEgvdIlKADm7kTagLLbzNxm1Gnc70VA49MX406xM';

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [type, setType] = useState(null);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [scheduleType, setScheduleType] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingDate, setLoadingDate] = useState(false);
  // const [display, setDisplayError] = useState(null);
  // const [ampm, setAmPm] = useState('AM');
  const [page, setPage] = useState(0);
  const [selectedTime, setSelectedTime] = useState();
  const [selectDate, setSelectDate] = useState();
  const [locationData, setLocationData] = useState({});

  const fetchData = async () => {
    if (!populationSettings) {
      await getAllPopulationSetting();
    }
    if (!locations) {
      await getLocations1();
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      setUserData(user);
      fetchData();
    }// eslint-disable-next-line
  }, [dialogOpen, user, getAllPopulationSetting, getLocations1, populationSettings, locations]);

  const handleClose = () => {
    setPage(0);
    setScheduleType(null);
    setStep(0);
    setAvailableDates([]);
    setAvailableTimeSlots([]);
    setType(null)
    onDialogClose();
    setSelectedDate();
    setSelectDate();
  };

  const handleChange = async (e) => {
    if (step === 0) {
      setType(e);
      setStep(step + 1);
    } else if (step === 1) {
      if (type === 'checkin') {
        setScheduleType(e);
        history.push(`/user-details/${user._id}?tab=visit_tracker`);
      } else {
        setScheduleType(e);
        setStep(step + 1);
      }

    } else if (step === 2) {
      setSelectedDate(e);
      setPage(0);
      if (e === 'today') {
        await handleDateChange(moment().format('YYYY-MM-DD'));
      } else if (e === 'tomorrow') {
        await handleDateChange(moment().add(1, 'days').format('YYYY-MM-DD'));
      } else if (e === 'more') {
        await getScheduledates();
      }
    }
  }

  const handleConfirmSchedule = async () => {
    setLoading(true);
    let body = {
      phone: userData._id,
      date: selectDate,
      time: selectedTime,
      multiple_appointments: [userData._id],
      type: scheduleType,
      vaccine_type: scheduleType
    }
    let res = await confirmSchedule(token, body);
    if (res.success) {
      setLoading(false);
      setStep(step + 1);
    } else {
      setLoading(false);
      handleClose();
    }
  }

  const handleBack = () => {
    setScheduleType(null);
    setStep(0);
    setAvailableDates([]);
    setAvailableTimeSlots([]);
    setType(null)
    onDialogClose();
    setSelectedDate();
    setSelectDate();
  }

  const handleSchedule = () => {
    setStep(step + 1);
    let populationData = populationSettings.find(e => e._id === populationId);
    if (populationData) {
      let locationData = locations.find(e => e._id === populationData.location_id._id);
      setLocationData(locationData)
    }
    handleChange(step)
  }

  const handleDateChange = async (date) => {
    setLoading(true);
    setSelectDate(date);
    setAvailableDates([]);
    setAvailableTimeSlots([]);
    setSelectedTime(null)
    let res = await getScheduleAvailableTimeByDate(userData._id, date, scheduleType, token)
    if (res.success) {
      if (res.data.length !== 0) {
        setAvailableTimeSlots(res.data);
        setLoading(false);
      } else {
        setLoading(false);
        // setDisplayError('Slots Unavailable');
      }
    } else {
      setLoading(false);
    }
  }

  const getScheduledates = async () => {
    setLoadingDate(true);
    setAvailableTimeSlots([]);
    setAvailableDates([]);
    setSelectedTime(null)
    let res = await getScheduleAvailableDates(userData._id, token, scheduleType);
    if (res.success) {
      if (res.data.dates.length !== 0) {
        setAvailableDates(res.data.dates);
        setLoadingDate(false);
      }
      else {
        setLoadingDate(false);
        // setDisplayError('Location is Closed'); 
      }
    }
    else {
      setLoadingDate(false);
      // setDisplayError('Location is Closed');
    }
  }

  const handleChangePage = (newPage) => {
    if (newPage === 'add') {
      setPage(page => page + 1);
    } else {
      setPage(page => page - 1);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time)
  }

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      maxWidth={'sm'}
    >
      <DialogTitle onClose={handleClose} className={brandClasses.headerContainer} style={{ textAlign: 'center', margin: '16px' }}>
        {step === 0 && <Typography component={'span'} className={clsx(brandClasses.headerTitle, classes.dialogHeader)}>
          What would do like to do for <br></br>{user.first_name} {user.last_name}
        </Typography>}
        {step === 1 && <Typography component={'span'} className={clsx(brandClasses.headerTitle, classes.dialogHeader)}>What Kind of appointment are you  <br></br>
          scheduling for ?  </Typography>}
        {step === 2 && type === "schedule" && <Typography component={'span'} className={clsx(brandClasses.headerTitle, classes.dialogHeader)}>Please Choose a day to schedule<br></br>
          An appointment  </Typography>}
        {step === 3 && <Typography component={'span'} className={clsx(brandClasses.headerTitle, classes.dialogHeader)}>Confirm appointment</Typography>}
      </DialogTitle>
      <DialogContent>
        {step === 0 && (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item onClick={() => handleChange('schedule')} className={type === 'schedule' ? classes.activeScheduleBox : classes.scheduleBox}>
              {/* <Button
                className={classes.dateBox}
                // className={selectedDate === dateObj.date ? classes.activeDateBox : classes.dateBox}
                onClick={() => handleChange('schedule')}
              > */}

              <Grid container xs={12} direction="row" justify="center" alignItems="center" >
                <img
                  src={type === 'schedule' ? "/images/svg/Schedule_white.svg" : "/images/svg/Schedule.svg"}
                  style={{ height: 100, width: 100, paddingTop: '16px' }}
                  alt=""
                />
              </Grid><Grid xs={12} container direction="row" justify="center" alignItems="center" >
                <Typography
                  variant="h5"
                  style={{ marginTop: 5 }}
                  className={type === 'schedule' ? classes.activeDisplaytext : classes.displaytext}
                >
                  {'SCHEDULE'}
                </Typography>
              </Grid>
            </Grid>
            <Grid item onClick={() => handleChange('checkin')} className={type === 'checkin' ? classes.activeScheduleBox : classes.scheduleBox}>

              <Grid container xs={12} direction="row" justify="center" alignItems="center" >
                <img
                  src={type === 'checkin' ? "/images/svg/checkin_white.svg" : "/images/svg/Checkin.svg"}
                  style={{ height: 100, width: 100, paddingTop: '16px' }}
                  alt=""
                />
              </Grid><Grid xs={12} container direction="row" justify="center" alignItems="center" >
                <Typography
                  variant="h5"
                  style={{ marginTop: 5 }}
                  className={type === 'checkin' ? classes.activeDisplaytext : classes.displaytext}
                >
                  {'CHECK IN'}
                </Typography>
              </Grid>
            </Grid>
            {/* </Button> */}
          </Grid>
        )}

        {step === 1 && (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item onClick={() => handleChange('Rapid')} className={type === 'Rapid' ? classes.activeScheduleBox : classes.scheduleBox}>

              <Grid container xs={12} direction="row" justify="center" alignItems="center" >
                <img
                  src={type === 'Rapid' ? "/images/svg/Rapid_Icon_active.svg" : "/images/svg/Rapid_Icon.svg"}
                  style={{ height: 100, width: 100, paddingTop: '16px' }}
                  alt=""
                />
              </Grid><Grid xs={12} container direction="row" justify="center" alignItems="center" >
                <Typography
                  variant="h5"
                  style={{ marginTop: 5 }}
                  className={type === 'Rapid' ? classes.activeDisplaytext : classes.displaytext}
                >
                  {'RAPID'}
                </Typography>
              </Grid>
            </Grid>
            <Grid item onClick={() => handleChange('Vaccine')} className={type === 'Vaccine' ? classes.activeScheduleBox : classes.scheduleBox}>

              <Grid container xs={12} direction="row" justify="center" alignItems="center" >
                <img
                  src={type === 'Vaccine' ? "/images/svg/vaccine_background_active.svg" : "/images/svg/vaccine_background.svg"}
                  style={{ height: 100, width: 100, paddingTop: '16px' }}
                  alt=""
                />
              </Grid><Grid xs={12} container direction="row" justify="center" alignItems="center" >
                <Typography
                  variant="h5"
                  style={{ marginTop: 5 }}
                  className={type === 'Vaccine' ? classes.activeDisplaytext : classes.displaytext}
                >
                  {'VACCINE'}
                </Typography>
              </Grid>
            </Grid>
            <Grid item onClick={() => handleChange('PCR')} className={type === 'PCR' ? classes.activeScheduleBox : classes.scheduleBox}>

              <Grid container xs={12} direction="row" justify="center" alignItems="center" >
                <img
                  src={type === 'PCR' ? "/images/svg/Test_PCR_active.svg" : "/images/svg/Test_PCR.svg"}
                  style={{ height: 100, width: 100, paddingTop: '16px' }}
                  alt=""
                />
              </Grid><Grid xs={12} container direction="row" justify="center" alignItems="center" >
                <Typography
                  variant="h5"
                  style={{ marginTop: 5 }}
                  className={type === 'PCR' ? classes.activeDisplaytext : classes.displaytext}
                >
                  {'LAB/PCR'}
                </Typography>
              </Grid>
            </Grid>
            {/* </Button> */}
          </Grid>
        )}
        {step === 2 && type === "schedule" && (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            {/* </Button> */}
            <Grid item style={{ marginTop: 20 }}>
              <Grid container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item style={{ padding: 10 }}>
                  <Button
                    className={selectedDate === 'today' ? classes.activeDisplayDay : classes.displayDay}
                    onClick={() => handleChange('today')}
                  >
                    <Typography
                      variant="h5"
                      style={{ marginTop: 5, color: selectedDate === 'today' ? '#FFFFFF' : '#0F84A9' }}
                    >TODAY</Typography>
                  </Button>
                </Grid>
                <Grid item style={{ padding: 10 }}>
                  <Button
                    className={selectedDate === 'tomorrow' ? classes.activeDisplayDay : classes.displayDay}
                    onClick={() => handleChange('tomorrow')}
                  >
                    <Typography
                      variant="h5"
                      style={{ marginTop: 5, color: selectedDate === 'tomorrow' ? '#FFFFFF' : '#0F84A9' }}
                    >TOMORROW</Typography>
                  </Button>
                </Grid>
                <Grid item style={{ padding: 10 }}>
                  <Button
                    className={selectedDate === 'more' ? classes.activeDisplayDay : classes.displayDay}
                    onClick={() => handleChange('more')}
                  >
                    <Typography
                      variant="h5"
                      style={{ marginTop: 5, color: selectedDate === 'more' ? '#FFFFFF' : '#0F84A9' }}
                    >MORE OPTIONS</Typography>
                  </Button>
                </Grid>

              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >

              <Grid item >
                {/* {selectedDate === 'more' && availableDates.length === 0 && <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                ><CircularProgress className={classes.spinner} /></Grid>} */}
                {selectedDate === 'more' && availableDates.length !== 0 ? <>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center" style={{ mariginBottom: '10px' }}
                    ><Typography display="block"
                      variant="h5" style={{ paddingBottom: '16px' }}>{`Please choose an avalible day for your ${scheduleType}:`}
                      </Typography></Grid>
                    <Grid item>
                      <IconButton
                        className={page === 0 ? classes.hide : ''}
                        onClick={() => handleChangePage('minus')}
                      >
                        <img src='/images/svg/chevron_left.svg' alt='chevron_left' width="25" />
                      </IconButton>
                      <div className={page === 0 ? classes.emptyIcon : classes.hide}></div>
                    </Grid>

                    {availableDates.slice(page * 4, page * 4 + 4).map((dateObj, index) => (
                      <Grid item key={index} style={{ padding: 5 }}  >
                        <Button
                          className={selectDate === dateObj.date ? classes.activeDisplayDay : classes.displayDay}
                          onClick={() => handleDateChange(dateObj.date)}
                        >
                          <Grid container justify="center" alignItems="center" >
                            <Typography display="block"
                              variant="h6" style={{ color: selectDate === dateObj.date ? '#FFFFFF' : '#0F84A9' }}>
                              {moment(dateObj.date).format('ddd')} <br></br>
                              {moment(dateObj.date).format('MMMM DD')}
                            </Typography>
                          </Grid>
                        </Button>
                      </Grid>
                    ))}

                    <Grid item>
                      <IconButton
                        className={(availableDates.length / (4)) <= (page + 1) ? classes.hide : ''}
                        onClick={() => handleChangePage('add')}
                      >
                        {(availableDates.length / (4)) === page}
                        <img src='/images/svg/chevron_right.svg' alt='chevron_right' width="25" />
                      </IconButton>
                      <div className={(availableDates.length / (4)) <= (page + 1) ? classes.emptyIcon : classes.hide}></div>
                    </Grid>
                  </Grid>
                  {/* ) */}
                </> : <>{loadingDate ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}</>
                }
              </Grid>

              <Grid item >
                {/* {selectedDate && availableTimeSlots.length !== 0 && <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                ><CircularProgress className={classes.spinner} /></Grid>} */}
                {selectedDate && availableTimeSlots.length !== 0 ? <>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center" style={{ mariginBottom: '10px' }}
                    ><Typography display="block"
                      variant="h5" style={{ paddingBottom: '16px' }}>{`Please choose an avalible time slot for your ${scheduleType}:`}
                      </Typography></Grid>
                    <Grid item>
                      <IconButton
                        className={page === 0 ? classes.hide : ''}
                        onClick={() => handleChangePage('minus')}
                      >
                        <img src='/images/svg/chevron_left.svg' alt='chevron_left' width="25" />
                      </IconButton>
                      <div className={page === 0 ? classes.emptyIcon : classes.hide}></div>
                    </Grid>

                    {availableTimeSlots.slice(page * 4, page * 4 + 4).map((dateObj, index) => (
                      <Grid item key={index} style={{ padding: 5 }}  >
                        <Button
                          className={selectedTime === dateObj.time ? classes.activeDisplayTime : classes.displayTime}
                          onClick={() => handleTimeChange(dateObj.time)}
                        >
                          <Grid container justify="center" alignItems="center" >
                            <Typography display="block"
                              variant="h6" style={{ color: selectedTime === dateObj.time ? '#FFFFFF' : '#0F84A9' }} >
                              {moment(dateObj.time, 'HH:mm').format('h:mm A')} <br></br>
                              <span style={{ fontSize: '8px' }}>{`${dateObj.count} slots Available`}</span>
                            </Typography>
                          </Grid>
                        </Button>
                      </Grid>
                    ))}

                    <Grid item>
                      <IconButton
                        className={(availableTimeSlots.length / (4)) <= (page + 1) ? classes.hide : ''}
                        onClick={() => handleChangePage('add')}
                      >
                        {(availableTimeSlots.length / (4)) === page}
                        <img src='/images/svg/chevron_right.svg' alt='chevron_right' width="25" />
                      </IconButton>
                      <div className={(availableTimeSlots.length / (4)) <= (page + 1) ? classes.emptyIcon : classes.hide}></div>
                    </Grid>
                    {selectedDate && availableTimeSlots.length !== 0 && (
                      <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="flex-end">

                        <div className={brandClasses.footerButton}>
                          <Button
                            className={brandClasses.button}
                            classes={{ disabled: brandClasses.buttonDisabled }}
                            disabled={!selectedTime}
                            type="submit"
                            onClick={() => handleSchedule()}
                          >
                            DONE
                          </Button>
                        </div>
                      </Grid>

                    )}
                  </Grid>
                  {/* ) */}
                </> : <>{loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}</>
                }


              </Grid>

            </Grid>
          </Grid>


        )}
        {step === 3 && (
          <Grid container spacing={4}>
            <Grid item xs={12} style={{ padding: '1px' }}>
              <Typography align="center"
                variant="h5"
                style={{ marginTop: 10, padding: '6px', color: '#043B5D' }}
              >Date Created:<span style={{ color: '#0F84A9' }}>{moment(selectDate).format('ddd')} {moment(selectDate).format('MMMM DD')},{moment(selectDate).format('YYYY')}</span></Typography>
            </Grid>
            <Grid item xs={12} style={{ padding: '1px' }}>
              <Typography align="center"
                variant="h5" style={{ padding: '6px', color: '#043B5D' }}
              >Time Selected:<span style={{ color: '#0F84A9' }}>{moment(selectedTime, 'HH:mm').format('h:mm A')}</span> </Typography>
            </Grid>
            <hr className={classes.divider} />
            <Grid item xs={12} style={{ padding: '6px' }}>
              <Typography align="center"
                variant="h5"
                style={{ color: '#043B5D' }}>Site Address</Typography>
            </Grid>
            <Grid item xs={12} style={{ padding: '6px' }}>
              <Typography align="center"
                variant="h5" style={{ color: '#0F84A9' }}
              >{locationData.address} <br />
                {/* {locationData.city}, {locationData.state} {locationData.zip_code} */}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ padding: '6px' }}>
              <Grid container
                direction="row"
                justify="flex-end"
                alignItems="flex-end">
                <Button
                  className={clsx(brandClasses.button, classes.backButton)}
                  type="submit"
                  onClick={() => handleBack()}
                >
                  BACK
                </Button>
                <Button
                  className={clsx(brandClasses.button, classes.doneButton)}
                  type="submit"
                  onClick={() => handleConfirmSchedule()}
                >
                  DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {step === 4 && (
          <Grid container spacing={4}>
            <Grid item xs={12} style={{ padding: '1px', width: '480px' }}>
              <Typography align="center" variant="h5" className={classes.successtitle}>SUCCESS!</Typography>
              <Typography align="center" className={classes.checkMark}>
                <img src="/images/svg/status/check_green.svg" alt="" width="110" />
              </Typography>
              <Typography align="center" variant="h5" style={{ marginBottom: '20px' }}>
                You have succesfully scheduled <br></br>
                {userData.first_name} {userData.last_name} <br></br>an SMS and/or email has been sent
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>

  );

}

const mapStateToProps = state => ({
  locations: state.data.locations,
  populationSettings: state.data.populationSettings,
});
ScheduleAction.propTypes = {
  location: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  getScheduleAvailableDates: PropTypes.func.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  getScheduleAvailableTimeByDate: PropTypes.func.isRequired,
  confirmSchedule: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
  getAllPopulationSetting: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, getAllPopulationSetting, getScheduleAvailableDates, getScheduleAvailableTimeByDate, confirmSchedule })(withRouter(ScheduleAction))
