import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Typography, Button, Dialog, DialogContent, withStyles, Grid, TextField, Box, Tooltip, InputLabel,
  Select, MenuItem, FormControl, FormControlLabel, RadioGroup, Radio, Chip
}
  from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IOSSwitch from 'components/IOSSwitch';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import brandStyles from 'theme/brand';
// import Popover from '@material-ui/core/Popover';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import LineStepProgressBar from 'components/LineStepProgressBar';

const oftenData = [
  {
    label: 'Daily', value: 'Daily',
  },
  {
    label: 'Weekly', value: 'Weekly',
  },
  {
    label: 'Monthly', value: 'Monthly',
  },
  {
    label: 'Yearly', value: 'Yearly',
  },
  {
    label: 'Custom', value: 'Custom',
  },
  {
    label: 'Specific Date', value: 'specific_date',
  },
]

// const frequencyData = [
//   {
//     label: 'Daily', value: 'Daily',
//   },
//   {
//     label: 'Weekly', value: 'Weekly',
//   },
//   {
//     label: 'Monthly', value: 'Monthly',
//   },
//   {
//     label: 'Yearly', value: 'Yearly',
//   }
// ];

const dayFrequencyOrderData = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Last'];
const dayFrequencyData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Day', 'Weekday', 'Weekend'];
const customRepeatData = ['Day', 'Week', 'Month', 'Year'];
const workDayArr = [1, 2, 3, 4, 5];
const monthDayArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

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
    <MuiDialogTitle
      className={classes.root}
      disableTypography
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: `0px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  headerTitle: {
    marginLeft: theme.spacing(4),
    color: theme.palette.brandText,
    fontSize: 24,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px`,
    // marginBottom: theme.spacing(2),
    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  headerSubTitle: {
    fontSize: '24px',
    color: theme.palette.brandText,
    textTransform: 'uppercase',
    marginLeft: 8
  },
  description: {
    color: theme.palette.brandGreen,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '24px',
    paddingBottom: 24
  },
  addedLabel: {
    fontWeight: 500,
    fontSize: '22px',
    lineHeight: '26px',
    textTransform: 'uppercase',
    color: '#0F84A9',
  },
  label: {
    fontSize: '18px',
    lineHeight: '27px',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#0F84A9',
    marginBottom: '0.3rem'
  },
  notificationRoot: {
    marginLeft: 0,
  },
  notificationLabel: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: '26px',
    color: '#043B5D',
  },
  switchStatus: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '24px',
    color: '#0F84A9',
    marginLeft: '12px'
  },
  disabled: {
    color: '#D8D8D8'
  },
  menuRoot: {
    color: '#788081'
  },
  menuSelected: {
    color: '#043B5D'
  },
  radioRoot: {
    color: theme.palette.brandDark,
    padding: '0px 9px !important'
  },
  radioLabel: {
    color: theme.palette.blueDark,
    fontWeight: 600
  },
  weekDay: {
    color: theme.palette.brandDark,
    fontSize: '16px',
    border: `${theme.palette.brandDark} 1px solid`,
    borderRight: 0,
    padding: '8px 2px',
    width: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    fontWeight: 600,
    '&:last-child': {
      borderRight: 'solid 1px'
    }
  },
  daySelected: {
    color: theme.palette.white,
    background: theme.palette.brandDark,
    borderLeftColor: '#fff'
  },
  monthCalendar: {
    borderSpacing: 0,
    borderLeft: 'solid 1px',
    '& .calendar-day': {
      border: `solid 1px ${theme.palette.brandDark}`,
      width: '30px',
      textAlign: 'center',
      padding: '5px 8px',
      borderLeft: 0,
      borderBottom: 0,
      color: theme.palette.blueDark,
      cursor: 'pointer',
      '&.bottomOutsideCell': {
        borderBottom: `solid 1px ${theme.palette.brandDark}`,
      },
      '&.lastRowCell': {
        borderTop: '0px',
        borderBottom: `solid 1px ${theme.palette.brandDark}`,
      },
      '&.checked': {
        color: theme.palette.white,
        background: theme.palette.brandDark,
        borderColor: 'white'
      }
    }
  },
  customTitle: {
    fontSize: '22px',
    lineHeight: 1.5,
    fontWeight: 600,
    color: theme.palette.blueDark
  },
  timepicker: {
    border: 'solid 1px',
    padding: '4px 0px 4px 8px',
    borderRadius: 8,
    margin: '8px 0',
    '& .MuiInput-underline:before': {
      border: '0px !important',

    },
    '& .MuiInput-underline:after': {
      border: '0px !important',
    },
  },
  frequencyLabel1: {
    fontWeight: 600,
    fontSize: '16px'
  },
  chipRoot: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#DBECF2',
    color: theme.palette.blueDark,
    height: '24px',
    borderRadius: '5px',
    '& .MuiChip-label': {
      fontWeight: 500
    }
  },
  selectedDeleteIcon: {
    color: theme.palette.blueDark,
  }
}));

let weekDefaultData = [
  {
    label: 'Mon', checked: false,
  },
  {
    label: 'Tue', checked: false,
  },
  {
    label: 'Wed', checked: false,
  },
  {
    label: 'Thu', checked: false,
  },
  {
    label: 'Fri', checked: false,
  },
  {
    label: 'Sat', checked: false,
  },
  {
    label: 'Sun', checked: false,
  }
];
let daysInMonthData = [];
let monthsInYearData = [];
let daysPerMonth = 31;
var i = 0;
while (i < daysPerMonth) {
  daysInMonthData.push({ checked: false })
  i++;
}
i = 0;
// var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; //short name
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // long name
while (i < 12) {
  monthsInYearData.push({ label: months[i], checked: false })
  i++;
}

const AddAlert = (props) => {
  const { dialogOpen, onDialogClose } = props;
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  // const [monthData, setMonthData] = useState(daysInMonthData);
  // const [yearData, setyearData] = useState(monthsInYearData);
  const [weekData, setWeekData] = React.useState(weekDefaultData);
  const [customOnDate, setCustomOnDate] = React.useState(new Date());
  const [specificDate, setSpecificDate] = React.useState(new Date());
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [arrReceiveData, setArrReceiveData] = useState([]);
  const [formStep, setFormStep] = useState(0); //form step
  const labelArray = ['Subject', 'Frequency', 'Notification Type', 'Recipients'];

  const handleCustomOnDateChange = (date) => {
    setCustomOnDate(date);
  };

  const handleSpecificDateChange = (date) => {
    setSpecificDate(date);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  }

  const handleEndDate = (date) => {
    setEndDate(date);
  }

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleCloseDlg = () => {
  //   setOpen(false);
  // };

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({});

  React.useEffect(() => {

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    if (open) {
      let timer1 = setTimeout(() => onClose(), 1500);
      return () => {
        clearTimeout(timer1);
      };
    }
    // eslint-disable-next-line
  }, [open])

  const onClose = () => {
    setOpen(false);
    onDialogClose();
    setFormStep(0);
  }

  const keyPress = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      var tempData = arrReceiveData;
      tempData.push(e.target.value);
      setArrReceiveData(tempData);
      setFormState(formState => ({
        ...formState,
        'reciver': '',
        reciverError: ''
      }));
      e.preventDefault();
    }
  }

  const removeFilterConditionItem = (id) => {
    var currentGroup = arrReceiveData.filter(item => item !== id);
    setArrReceiveData(currentGroup);
  }

  const handleChange = (e) => {
    e.persist();
    if (e.target.type !== 'checkbox') {
      if (e.target.name === 'reciver') {
        // handleClickOpen()
        arrReceiveData.length < 1 ?
          setFormState(formState => ({
            ...formState,
            [e.target.name]: e.target.value,
            // reciverError: 'Please enter email address'
          })) :
          setFormState(formState => ({
            ...formState,
            [e.target.name]: e.target.value,
            reciverError: ''
          }));
      } else {
        setFormState(formState => ({
          ...formState,
          [e.target.name]: e.target.value
        }));
      }
    } else {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: e.target.checked
      }));
    }
  };

  const handleFrquencyChange = (e) => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  const handleSubmit = event => {
    event.preventDefault();
    if (formStep === 3) {
      if (arrReceiveData.length < 1) {
        setFormState(formState => ({
          ...formState,
          reciverError: 'Please enter email address'
        }));
        return;
      }
      setFormState(formState => ({
        ...formState,
        reciverError: ''
      }));
      setOpen(true);
    }
    setFormStep(formStep + 1);
  };

  const handleClose = () => {
    onDialogClose();
  };

  const toggleWeekDay = (index) => {
    // var tempWeekData = weekData;
    var tempWeekData = weekData.map((day, i) => {
      if (i === index) {
        day.checked = !day.checked;
      }
      return day;
    });
    setWeekData(tempWeekData);
  }

  // const handleMonthly = (index) => {
  //   var tempData = monthData.map((day, i) => {
  //     if (i === index) {
  //       day.checked = !day.checked;
  //     }
  //     return day;
  //   });
  //   setMonthData(tempData);
  // }

  // const drawMonthDay = () => {

  //   let daysInMonth = [];

  //   for (let d = 0; d < monthData.length; d++) {
  //     daysInMonth.push(
  //       <td
  //         className={
  //           monthData[d] && monthData[d].checked ?
  //             d < 21 ?
  //               'calendar-day checked'
  //               : d < 28 ? 'calendar-day bottomOutsideCell checked' : 'calendar-day lastRowCell checked'
  //             :
  //             d < 21 ?
  //               'calendar-day'
  //               : d < 28 ? 'calendar-day bottomOutsideCell' : 'calendar-day lastRowCell'
  //         }
  //         key={d}
  //         onClick={() => handleMonthly(d)}
  //       >
  //         {d + 1}
  //       </td>
  //     );
  //   }
  //   var totalSlots = [...daysInMonth];
  //   let rows = [];
  //   let cells = [];

  //   totalSlots.forEach((row, i) => {
  //     if (i % 7 !== 0) {
  //       cells.push(row); // if index not equal 7 that means not go to next week
  //     } else {
  //       rows.push(cells); // when reach next week we contain all td in last week to rows 
  //       cells = []; // empty container 
  //       cells.push(row); // in current loop we still push current row to new container
  //     }
  //     if (i === totalSlots.length - 1) { // when end loop we add remain date
  //       rows.push(cells);
  //     }
  //   });
  //   let daysinmonth = rows.map((d, i) => {
  //     return <tr key={i}>{d}</tr>;
  //   });
  //   console.log('daysInMonth', daysInMonth);
  //   return (
  //     <table className={classes.monthCalendar}>
  //       <tbody>{daysinmonth}</tbody>
  //     </table>
  //   )
  // }

  // const drawYearMonth = () => {
  //   let monthsInYear = [];

  //   console.log('drawYearMonth', monthsInYearData)
  //   for (let m = 0; m < monthsInYearData.length; m++) {
  //     monthsInYear.push(
  //       <td
  //         className={
  //           monthsInYearData[m] && monthData[m].checked ?
  //             m < 8 ?
  //               'calendar-day checked'
  //               : 'calendar-day bottomOutsideCell checked'
  //             :
  //             m < 8 ?
  //               'calendar-day'
  //               : 'calendar-day bottomOutsideCell'
  //         }
  //         key={m}
  //         onClick={() => handleMonthly(m)}
  //       >
  //         {monthsInYearData[m].label}
  //       </td>
  //     )
  //   }
  //   var totalSlots = [...monthsInYear];
  //   let rows = [];
  //   let cells = [];

  //   totalSlots.forEach((row, i) => {
  //     if (i % 4 !== 0) {
  //       cells.push(row); // if index not equal 7 that means not go to next week
  //     } else {
  //       rows.push(cells); // when reach next week we contain all td in last week to rows 
  //       cells = []; // empty container 
  //       cells.push(row); // in current loop we still push current row to new container
  //     }
  //     if (i === totalSlots.length - 1) { // when end loop we add remain date
  //       rows.push(cells);
  //     }
  //   });
  //   let monthinYear = rows.map((d, i) => {
  //     return <tr key={i}>{d}</tr>;
  //   });
  //   console.log('monthinYear', monthinYear);
  //   return (
  //     <table className={classes.monthCalendar}>
  //       <tbody>{monthinYear}</tbody>
  //     </table>
  //   )
  // }

  return (
    <Dialog
      fullWidth
      maxWidth={'md'}
      onClose={handleClose}
      open={dialogOpen}
    >
      <DialogTitle onClose={handleClose}>
        <div className={classes.header}>
          <Box >
            <Typography
              className={brandClasses.headerTitle2}
              variant="h2"
            >
              <img
                alt=""
                src="/images/svg/mailbox.svg"
                style={{ width: 35 }}
              />
              TESTD ALERTS |
            </Typography>
            <Typography
              className={classes.headerSubTitle}
              variant="h4"
            >CREATE AN ALERT</Typography>
            <sup>
              <Tooltip
                placement="right-start"
                style={{ margin: '-10px 0 0 10px', color: '#043B5D' }}
                title="Create An Alert"
              >
                <HelpIcon />
              </Tooltip>
            </sup>
          </Box>
        </div>
      </DialogTitle>
      <DialogContent>
        <form
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <Box
            alignItems="center"
            display="flex"
            mb={2}
          >
            <img
              alt=""
              src="/images/svg/alerts/system/new_department_added.svg"
              width={60}
            />
            <Typography className={classes.addedLabel}>A new department  has been added</Typography>
          </Box>
          <Grid container >
            <Grid item xs={12} className="text-left d-flex">
              <LineStepProgressBar activeIndex={formStep} labels={labelArray} totalCount={4} handleStep={setFormStep} />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={5}
          >
            {
              formStep === 0 && (
                <Grid
                  item
                  sm={6}
                  xs={12}
                >
                  <InputLabel className={classes.label}>Subject</InputLabel>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    name="subject"
                    onChange={handleChange}
                    placeholder="A New Department has been added"
                    required
                    type="text"
                    value={formState.subject || ''}
                    variant="outlined"
                  />
                </Grid>

              )
            }

            {
              formStep === 1 && (
                <Grid
                  item
                  sm={6}
                  xs={12}
                >
                  <InputLabel className={classes.label}>HOW OFTEN?</InputLabel>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    required
                    variant="outlined"
                  >

                    <Select
                      displayEmpty
                      name="schedule"
                      onChange={handleChange}
                      value={formState.schedule || ''}
                    >
                      <MenuItem value="">
                        <Typography classes={{ root: classes.menuRoot }}>Select how often</Typography>
                      </MenuItem>
                      {oftenData.map((item, index) => (
                        <MenuItem
                          classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                          key={index}
                          style={item.label !== 'Custom' ? { border: '0px' } : { borderTop: '2px solid #D8D8D8' }}
                          value={item.value}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/*  frequency layout  */}
                  {
                    formState.schedule === 'Daily' &&
                    <>
                      <RadioGroup
                        name="daily"
                        onChange={handleChange}
                        row
                      >
                        <Grid
                          alignItems="center"
                          container
                          spacing={1}
                          style={{ marginTop: '16px' }}
                        >
                          <Grid item xs={4}>
                            <Typography className={classes.frequencyLabel1}>Start: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                fullWidth
                                required
                                variant="outlined"
                              >
                                <KeyboardDatePicker
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  className={classes.timepicker}
                                  format="MMM dd, yyyy"
                                  margin="normal"
                                  onChange={handleStartDate}
                                  value={startDate}
                                />
                              </FormControl>
                            </MuiPickersUtilsProvider>
                          </Grid>

                          <Grid
                            item
                            xs={4}

                          >
                            <FormControlLabel
                              classes={{ label: classes.frequencyLabel1 }}
                              control={
                                <Radio
                                  classes={{ root: classes.radioRoot }}
                                  color="primary"
                                  required
                                />
                              }
                              label="Every Day"
                              value="1"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required={formState.daily === '1' ? true : false}
                              variant="outlined"
                            >
                              <Select
                                displayEmpty
                                name="weekFreequncyOrder"
                                onChange={handleFrquencyChange}
                                value={formState.weekFreequncyOrder || ''}
                              >
                                {workDayArr.map((item) => (
                                  <MenuItem
                                    classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                    key={item}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <Typography
                              className={classes.frequencyLabel1}
                            >
                              day(s)
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                          >
                            <FormControlLabel
                              classes={{ label: classes.frequencyLabel1 }}
                              control={
                                <Radio
                                  classes={{ root: classes.radioRoot }}
                                  color="primary"
                                  required
                                />
                              }
                              label="Every weekday"
                              value="2"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Typography className={classes.frequencyLabel1}>End: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                fullWidth
                                required
                                variant="outlined"
                              >
                                <KeyboardDatePicker
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  className={classes.timepicker}
                                  format="MMM dd, yyyy"
                                  margin="normal"
                                  onChange={handleEndDate}
                                  value={endDate}
                                />
                              </FormControl>
                            </MuiPickersUtilsProvider>
                          </Grid>

                        </Grid>
                      </RadioGroup>
                    </>
                  }

                  {
                    formState.schedule === 'Weekly' &&
                    <>
                      <RadioGroup
                        // aria-label="position"
                        // defaultValue="top"
                        style={{ marginTop: 12 }}
                        name="weekly"
                        row
                      >
                        <Grid
                          alignItems="center"
                          container
                          spacing={2}
                        >
                          <Grid item xs={4}>
                            <Typography className={classes.frequencyLabel1}>Start: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                fullWidth
                                required
                                variant="outlined"
                              >
                                <KeyboardDatePicker
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  className={classes.timepicker}
                                  format="MMM dd, yyyy"
                                  margin="normal"
                                  onChange={handleStartDate}
                                  value={startDate}
                                />
                              </FormControl>
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <Typography className={classes.frequencyLabel1}>Every</Typography>
                          </Grid>
                          <Grid
                            item
                            xs={3}
                          >
                            <TextField
                              InputProps={{
                                inputProps: {
                                  max: 5, min: 1
                                }
                              }}
                              classes={{ root: brandClasses.brandInputFieldOutlined }}
                              defaultValue="1"
                              label=""
                              size="small"
                              type="number"
                              variant="outlined"
                            />

                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <Typography className={classes.frequencyLabel1}>week(s) on:</Typography>
                          </Grid>

                          <Grid
                            item
                            xs="12"
                          >
                            <div style={{ display: 'flex' }}>
                              {
                                weekData.map((day, index) => (
                                  <Typography
                                    className={day.checked ? clsx(classes.weekDay, classes.daySelected) : classes.weekDay}
                                    key={index}
                                    onClick={() => toggleWeekDay(index)}
                                  >
                                    {day.label}
                                  </Typography>
                                ))
                              }
                            </div>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography className={classes.frequencyLabel1}>End: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                fullWidth
                                required
                                variant="outlined"
                              >
                                <KeyboardDatePicker
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  className={classes.timepicker}
                                  format="MMM dd, yyyy"
                                  margin="normal"
                                  onChange={handleEndDate}
                                  value={endDate}
                                />
                              </FormControl>
                            </MuiPickersUtilsProvider>
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </>
                  }

                  {
                    formState.schedule === 'Monthly' &&
                    <RadioGroup
                      name="monthly"
                      onChange={handleChange}
                      row
                    >
                      <Grid
                        alignItems="center"
                        container
                        spacing={1}
                        style={{ marginTop: '18px' }}
                      >
                        <Grid item xs={4}>
                          <Typography className={classes.frequencyLabel1}>Start: </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required
                              variant="outlined"
                            >
                              <KeyboardDatePicker
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                className={classes.timepicker}
                                format="MMM dd, yyyy"
                                margin="normal"
                                onChange={handleStartDate}
                                value={startDate}
                              />
                            </FormControl>
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <Typography
                            className={classes.frequencyLabel1}
                          >
                            Every
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                        >
                          <TextField
                            InputProps={{
                              inputProps: {
                                max: 5, min: 1
                              }
                            }}
                            classes={{ root: brandClasses.brandInputFieldOutlined }}
                            defaultValue="1"
                            label=""
                            size="small"
                            type="number"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={5}
                        >
                          <Typography className={classes.frequencyLabel1}>month(s)</Typography>
                        </Grid>

                        <Grid
                          item
                          xs={4}
                        >
                          <FormControlLabel
                            classes={{ label: classes.frequencyLabel1 }}
                            control={
                              <Radio
                                classes={{ root: classes.radioRoot }}
                                color="primary"
                                required
                              />
                            }
                            label="On day"
                            value="1"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={8}
                        >

                          <TextField
                            InputProps={{
                              inputProps: {
                                max: 31, min: 1
                              }
                            }}
                            classes={{ root: brandClasses.brandInputFieldOutlined }}
                            defaultValue="1"
                            label=""
                            size="small"
                            type="number"
                            variant="outlined"
                          />


                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <FormControlLabel
                            classes={{ label: classes.frequencyLabel1 }}
                            control={
                              <Radio
                                classes={{ root: classes.radioRoot }}
                                color="primary"
                                required
                              />
                            }
                            label="On the"
                            value="2"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            required={formState.monthly === '2' ? true : false}
                            variant="outlined"
                          >
                            <Select
                              displayEmpty
                              name="weekFreequncyOrder"
                              onChange={handleFrquencyChange}
                              value={formState.weekFreequncyOrder || ''}
                            >
                              {dayFrequencyOrderData.map((item, index) => (
                                <MenuItem
                                  classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                  key={index}
                                  style={item !== 'Last' ? { border: '0px' } : { borderTop: '1px solid #D8D8D8' }}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                        </Grid>

                        <Grid
                          item
                          xs={4}
                        >
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            required={formState.monthly === '2' ? true : false}
                            variant="outlined"
                          >
                            <Select
                              displayEmpty
                              name="weekFreequncyDay"
                              onChange={handleFrquencyChange}
                              value={formState.weekFreequncyDay || ''}
                            >
                              {dayFrequencyData.map((item, index) => (
                                <MenuItem
                                  classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                  key={index}
                                  style={item !== 'Day' ? { border: '0px' } : { borderTop: '1px solid #D8D8D8' }}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography className={classes.frequencyLabel1}>End: </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required
                              variant="outlined"
                            >
                              <KeyboardDatePicker
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                className={classes.timepicker}
                                format="MMM dd, yyyy"
                                margin="normal"
                                onChange={handleEndDate}
                                value={endDate}
                              />
                            </FormControl>
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  }

                  {
                    formState.schedule === 'Yearly' &&
                    <RadioGroup
                      name="yearly"
                      onChange={handleChange}
                      row
                    >
                      <Grid
                        alignItems="center"
                        container
                        spacing={1}
                        style={{ marginTop: '18px' }}
                      >
                        <Grid item xs={4}>
                          <Typography className={classes.frequencyLabel1}>Start: </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required
                              variant="outlined"
                            >
                              <KeyboardDatePicker
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                className={classes.timepicker}
                                format="MMM dd, yyyy"
                                margin="normal"
                                onChange={handleStartDate}
                                value={startDate}
                              />
                            </FormControl>
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <Typography
                            className={classes.frequencyLabel1}
                          >
                            Every
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                        >
                          <TextField
                            InputProps={{
                              inputProps: {
                                max: 5, min: 1
                              }
                            }}
                            classes={{ root: brandClasses.brandInputFieldOutlined }}
                            defaultValue="1"
                            label=""
                            size="small"
                            type="number"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={5}
                        >
                          <Typography className={classes.frequencyLabel1}>year(s)</Typography>
                        </Grid>

                        <Grid
                          item
                          xs={4}
                        >
                          <Typography className={classes.frequencyLabel1}>in</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            required
                            variant="outlined"
                          >
                            <Select
                              displayEmpty
                              name="weekFreequncyOrder"
                              onChange={handleFrquencyChange}
                              value={formState.weekFreequncyOrder || ''}
                            >
                              {months.map((item, index) => (
                                <MenuItem
                                  classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                  key={index}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs="4"
                        >&nbsp;</Grid>
                        {/* <Grid
                      item
                      xs="12"
                    >
                      <div style={{ display: 'flex' }}>
                        {
                          drawYearMonth()
                        }
                      </div>
                    </Grid> */}
                        <Grid
                          item
                          xs={4}
                        >
                          <FormControlLabel
                            classes={{ label: classes.frequencyLabel1 }}
                            control={
                              <Radio
                                classes={{ root: classes.radioRoot }}
                                color="primary"
                                required
                              />
                            }
                            label="On day"
                            value="1"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                        >
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            required={formState.yearly === '1' ? true : false}
                            variant="outlined"
                          >
                            <Select
                              displayEmpty
                              name="yearlyOnDay"
                              onChange={handleFrquencyChange}
                              value={formState.yearlyOnDay || ''}
                            >
                              {monthDayArr.map((item, index) => (
                                <MenuItem
                                  classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                  key={index}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={5}
                        >&nbsp;</Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <FormControlLabel
                            classes={{ label: classes.frequencyLabel1 }}
                            control={
                              <Radio
                                classes={{ root: classes.radioRoot }}
                                color="primary"
                                required
                              />
                            }
                            label="On the"
                            value="2"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            required={formState.yearly === '2' ? true : false}
                            variant="outlined"
                          >
                            <Select
                              displayEmpty
                              name="weekFreequncyOrder"
                              onChange={handleFrquencyChange}
                              value={formState.weekFreequncyOrder || ''}
                            >
                              {dayFrequencyOrderData.map((item, index) => (
                                <MenuItem
                                  classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                  key={index}
                                  style={item !== 'Last' ? { border: '0px' } : { borderTop: '1px solid #D8D8D8' }}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={4}
                        >
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            required={formState.yearly === '2' ? true : false}
                            variant="outlined"
                          >
                            <Select
                              displayEmpty
                              name="weekFreequncyDay"
                              onChange={handleFrquencyChange}
                              value={formState.weekFreequncyDay || ''}
                            >
                              {dayFrequencyData.map((item, index) => (
                                <MenuItem
                                  classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                  key={index}
                                  style={item !== 'Day' ? { border: '0px' } : { borderTop: '1px solid #D8D8D8' }}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                          <Typography className={classes.frequencyLabel1}>End: </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required
                              variant="outlined"
                            >
                              <KeyboardDatePicker
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                className={classes.timepicker}
                                format="MMM dd, yyyy"
                                margin="normal"
                                onChange={handleEndDate}
                                value={endDate}
                              />
                            </FormControl>
                          </MuiPickersUtilsProvider>
                        </Grid>

                      </Grid>
                    </RadioGroup>
                  }

                  {
                    formState.schedule === 'Custom' &&
                    <div>
                      <RadioGroup
                        name="custom"
                        onChange={handleChange}
                        row
                      >
                        <Grid
                          alignItems="center"
                          container
                          spacing={1}
                          style={{ marginTop: '16px' }}
                        >
                          <Grid
                            item
                            xs={4}
                          >
                            <Typography className={classes.frequencyLabel1}>Repeat every</Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                          >
                            <FormControlLabel
                              control={
                                <TextField
                                  InputProps={{
                                    inputProps: {
                                      max: 10, min: 1
                                    }
                                  }}
                                  classes={{ root: brandClasses.brandInputFieldOutlined }}
                                  defaultValue="1"
                                  label=""
                                  size="small"
                                  type="number"
                                  variant="outlined"
                                />
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={3}
                          >
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required
                              variant="outlined"
                            >
                              <Select
                                displayEmpty
                                name="customRepeat"
                                onChange={handleFrquencyChange}
                                value={formState.customRepeat || ''}
                              >
                                {customRepeatData.map((item, index) => (
                                  <MenuItem
                                    classes={{ root: classes.menuRoot, selected: classes.menuSelected }}
                                    key={index}
                                    // style={item !== 'Last' ? { border: '0px' } : { borderTop: '1px solid #D8D8D8' }}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={3}
                          >
                            &nbsp;
                          </Grid>

                        </Grid>

                        <Grid
                          alignItems="center"
                          container
                          spacing={1}
                          style={{ marginTop: '16px' }}
                        >
                          <Grid
                            item
                            xs={12}
                          >
                            <Typography className={classes.frequencyLabel1}>Ends</Typography>
                          </Grid>

                        </Grid>

                        <Grid
                          alignItems="center"
                          container
                          style={{ marginTop: '8px' }}
                        >
                          <Grid
                            item
                            xs={12}
                          >
                            <FormControlLabel
                              classes={{ label: classes.radioLabel }}
                              control={
                                <Radio
                                  classes={{ root: classes.radioRoot }}
                                  color="primary"
                                  required
                                />
                              }
                              label="Never"
                              value="0"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <FormControlLabel
                              classes={{ label: classes.radioLabel }}
                              control={
                                <Radio
                                  classes={{ root: classes.radioRoot }}
                                  color="primary"
                                  required
                                />
                              }
                              label="On"
                              value="1"
                            />
                          </Grid>

                          <Grid
                            item
                            xs={5}
                          > <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <FormControl
                                className={brandClasses.shrinkTextField}
                                fullWidth
                                required={formState.custom === '1' ? true : false}
                                variant="outlined"
                              >
                                <KeyboardDatePicker
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  className={classes.timepicker}
                                  format="MMM dd, yyyy"
                                  margin="normal"
                                  onChange={handleCustomOnDateChange}
                                  value={customOnDate}
                                />
                              </FormControl>
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                          >
                            &nbsp;
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <FormControlLabel
                              classes={{ label: classes.radioLabel }}
                              control={
                                <Radio
                                  classes={{ root: classes.radioRoot }}
                                  color="primary"
                                  required
                                />
                              }
                              label="After"
                              value="2"
                            />
                          </Grid>

                          <Grid
                            item
                            xs={2}
                          >
                            <FormControlLabel
                              control={
                                <TextField
                                  InputProps={{
                                    inputProps: {
                                      max: 10, min: 1
                                    }
                                  }}
                                  classes={{ root: brandClasses.brandInputFieldOutlined }}
                                  defaultValue="1"
                                  label=""
                                  size="small"
                                  type="number"
                                  variant="outlined"
                                />
                              }
                              style={{ marginLeft: 0 }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                          >
                            <Typography className={classes.radioLabel} style={{ fontWeight: 500 }}>occurances</Typography>

                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </div>
                  }

                  {
                    formState.schedule === 'specific_date' && (
                      <Grid
                        alignItems="center"
                        container
                        style={{ marginTop: '8px' }}
                      >
                        <Grid
                          item
                          xs={5}
                        >
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              fullWidth
                              required
                              variant="outlined"
                            >
                              <KeyboardDatePicker
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                className={classes.timepicker}
                                format="MMM dd, yyyy"
                                margin="normal"
                                onChange={handleSpecificDateChange}
                                value={specificDate}
                              />
                            </FormControl>
                          </MuiPickersUtilsProvider>

                        </Grid>
                      </Grid>
                    )
                  }
                </Grid>

              )
            }

            {
              formStep === 2 && (
                <Grid
                  item
                  xs={12}
                >
                  <InputLabel className={classes.label}>Type of notification</InputLabel>
                  <Grid container>
                    <Grid item xs={3}>
                      <Box
                        alignItems="center"
                        display="flex"
                      >
                        <FormControlLabel
                          classes={{ root: classes.notificationRoot, label: classes.notificationLabel }}
                          control={<IOSSwitch
                            checked={formState.email || false}
                            name="email"
                            onChange={handleChange}
                          />}
                          label="Email"
                          labelPlacement="start"
                          required
                        />
                        <span className={formState.email ? classes.switchStatus : clsx(classes.switchStatus, classes.disabled)}>
                          {formState.email ? 'On' : 'Off'}
                        </span>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        alignItems="center"
                        display="flex"
                      >
                        <FormControlLabel
                          classes={{ root: classes.notificationRoot, label: classes.notificationLabel }}
                          control={<IOSSwitch
                            checked={formState.sms || false}
                            name="sms"
                            onChange={handleChange}
                          />}
                          label="SMS"
                          labelPlacement="start"
                          required
                        />
                        <span className={formState.sms ? classes.switchStatus : clsx(classes.switchStatus, classes.disabled)}>
                          {formState.sms ? 'On' : 'Off'}
                        </span>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        alignItems="center"
                        display="flex"
                      >
                        <FormControlLabel
                          classes={{ root: classes.notificationRoot, label: classes.notificationLabel }}
                          control={<IOSSwitch
                            checked={formState.badge || false}
                            name="badge"
                            onChange={handleChange}
                          />}
                          label="BADGE"
                          labelPlacement="start"
                          required
                        />
                        <span className={formState.badge ? classes.switchStatus : clsx(classes.switchStatus, classes.disabled)}>
                          {formState.badge ? 'On' : 'Off'}
                        </span>
                      </Box>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                </Grid>
              )
            }

            {
              formStep === 3 && (
                <Grid
                  item
                  xs={12}
                ><InputLabel className={classes.label}>Who should receive it?</InputLabel>
                  <div className={classes.selectedContainer}>
                    {arrReceiveData.map((child) => (

                      <Chip
                        classes={{ root: classes.chipRoot, deleteIcon: classes.selectedDeleteIcon }}
                        key={child}
                        label={child}
                        onDelete={() => removeFilterConditionItem(child)}
                      />
                    ))}
                  </div>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    className={brandClasses.shrinkTextField}
                    error={formState.reciverError}
                    fullWidth
                    helperText={formState.reciverError}
                    name="reciver"
                    onChange={handleChange}
                    onKeyPress={(ev) => {
                      keyPress(ev);
                    }}
                    placeholder="Recipient name or department"
                    // required
                    type="text"
                    value={formState.reciver || ''}
                    variant="outlined"
                  />
                </Grid>
              )
            }

          </Grid>
          <br />
          <br />
          <br />
          <div className={brandClasses.footerButton}>
            <Button
              className={brandClasses.button}
              classes={{ disabled: brandClasses.buttonDisabled }}
              type="submit"
            >
              {
                formStep !== 3 ? 'NEXT' : 'DONE'
              }
            </Button>
          </div>
        </form>
        <Grid container>
          <Grid
            item
            sm={6}
            xs={12}
          >


            <br />

          </Grid>

        </Grid>


      </DialogContent>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={'sm'} fullWidth={true}
      >
        <DialogContent>
          {/* <Typography className={classes.title}>SUCCESS!</Typography> */}
          <Typography align="center" className={classes.checkMark}>
            <img src="/images/svg/status/check_green.svg" alt="" width="110" />
          </Typography>

          <Typography className={classes.description}>
            Success!
          </Typography>

        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

AddAlert.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
};

export default AddAlert;