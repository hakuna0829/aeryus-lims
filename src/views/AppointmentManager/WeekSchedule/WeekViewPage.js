import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  // Dialog,
  Button,
  //    DialogTitle,
  CircularProgress
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from '@date-io/moment';
import clsx from 'clsx';
import { getScheduleWeek } from 'actions/api';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DateSchedule from '../components/DateSchedule';

const popupWidth = 400;
const useStyles = makeStyles(theme => ({
  root: {
    // padding: 20,
    // paddingLeft: theme.spacing(2)
  },
  container: {
    display: 'flex',

  },
  tableHead: {
    backgroundColor: 'rgba(15,132,169,0.6)',
    color: 'white',
    padding: 0,
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 500,
    '& h3': {
      color: 'white'
    }
  },
  tableHeadToday: {
    backgroundColor: 'rgba(15,132,169,0.6)',
    color: 'white',
    padding: 0,
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 600,
    '& h3': {
      color: 'white',
      fontWeight: 600
    }
  },
  TimeScaleLabel: {

    padding: 0,
    '& div': {
      height: 39,
      lineHeight: '62px',
      textAlign: 'right',
      paddingRight: 10,
    },
    '& span': {
      color: '#043B5D',
      fontSize: '12px',
      borderBottom: 'solid 1px #0F84A9'
    },
  },
  TimeTableCell: {
    border: 'solid #0F84A9 1px',
    borderTop: 'none',
    height: 39,
    padding: 0,
    position: 'relative',
    // zIndex: 1

  },
  TimeTableCellActive: {
    backgroundColor: 'rgba(15,132,169,0.15)'
  },
  ScheduleListContainer: {
    // position:'absolute',
    bottom: '-20px',
    display: 'none',
    width: 100,
    border: 'solid 1px',
    zIndex: 10
  },
  TimeScaleExactLabel: {
    padding: 0,
    '& div': {
      height: 39,
      lineHeight: '57px',
      textAlign: 'right',
      paddingRight: 10,
    },
    '& span': {
      color: '#043B5D',
      fontSize: '18px',
      borderBottom: 'solid 1px #0F84A9'
    },
  },
  dialogRoot: {
    padding: 0,
    paddingTop: 10,
  },
  dialogPaper: {
    borderRadius: 4,
    border: 'solid 1px',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  scheduleRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0px',
    paddingLeft: 10,
    borderBottom: 'solid 1px #0F84A9',
    width: popupWidth,
    '&:last-child': {
      borderBottom: 'solid 0px #0F84A9',
    }
  },
  dialogRoot1: {
    padding: 0,
    paddingTop: 10,
    position: 'absolute',
    marginTop: 40,
    display: 'none',
    boxShadow: '0 0 5px 0 #0F84A9',
    background: 'white'
  },
  sheduleDlgTimeLabel: {
    color: '#043B5D'
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 12,
    color: '#9B9B9B',
    cursor: 'pointer'
  },
  navContaioner: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16
  },
  utilRoot: {
    marginBottom: 10,
    width: 130
  },
  todayBtn: {
    border: `solid 1px ${theme.palette.brandDark}`,
    margin: 'auto 16px'
  },
  schedulePopupContainer: {
    display: 'none',
    position: 'absolute',
    // width: '200px',
    border: 'solid 1px',
    // height: '100px',
    zIndex: 10,
    background: 'white',
    top: '40px',
    left: 0
  },
  loader: {
    display: 'flex',
  },
}));


const WeekViewPage = (props) => {
  const { getScheduleWeek, location_id, refetch, submitScheduleAction } = props;

  const classes = useStyles();
  const [todayDate] = useState(moment());

  const [loading, setLoading] = useState(true);
  const [empDate, setEmpDate] = useState(moment());
  const [weekData, setWeekData] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [weekStartDay, setWeekStartDay] = useState(moment());
  const [weekEndDay, setWeekEndDay] = useState(moment());
  const [open, setOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  const [columns] = useState([
    { id: '0', align: 'center', label: 'SUN', minWidth: 100 },
    { id: '1', align: 'center', label: 'MON', minWidth: 100 },
    { id: '2', align: 'center', label: 'TUE', minWidth: 100 },
    { id: '3', align: 'center', label: 'WED', minWidth: 100 },
    { id: '4', align: 'center', label: 'THU', minWidth: 100 },
    { id: '5', align: 'center', label: 'FRI', minWidth: 100 },
    { id: '6', align: 'center', label: ' SAT', minWidth: 100 }
  ]);
  const [timeRows] = useState([
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ]);

  var activeWeekDataIndex = 0;

  useEffect(() => {
    (async () => {
      handleClose();
      setLoading(true);
      let date = moment().format('YYYY-MM-DD');
      if (weekStartDay)
        date = moment(weekStartDay).format('YYYY-MM-DD');
      let res = await getScheduleWeek(`date=${date}`);
      if (res.success) {
        setWeekData(res.data);
        setLoading(false);
      }
    })();
  }, [weekStartDay, getScheduleWeek, refetch]);

  useEffect(() => {
    // handleEmpDateChange(empDate);
    var weekStart = empDate.clone().startOf('week');
    var weekEnd = empDate.clone().endOf('week');

    setWeekStartDay(weekStart);
    setWeekEndDay(weekEnd);
    var days = [];

    for (var i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days'));
      // days.push(moment(weekStart).add(i, 'days').format("DD"));
    }
    // console.log(todayDate.format("DD"));
    setWeekDates(days);
  }, [empDate]);

  const handleEmpDateChange = (date) => {
    setEmpDate(date);

    setWeekStartDay(date.clone().startOf('week'));
    setWeekEndDay(date.clone().endOf('week'));
    // var days = [];

    // for (var i = 0; i <= 6; i++) {
    //     days.push(moment(weekStart).add(i, 'days').format("DD"));
    // }

    // console.log(todayDate.format("DD"));
    // setWeekDates(days);
  };

  const isIncludeSchedule = (timeRow, day) => {
    let hour = moment(timeRow, 'h:mm A').format('HH');
    const index = weekData.findIndex(i =>
      i.timeLabel.split(':')[0] === hour && i.dates.some(date => moment(date).format("YYYY MM DD") === moment(day).format("YYYY MM DD"))
    );
    // const index = weekData.findIndex((item) => (
    //     item.timeLabel === timeRow && moment(item.dates[0]).format("YYYY MM DD") === moment(day).format("YYYY MM DD")
    // ));
    activeWeekDataIndex = index;
    return index;
  }

  const showScheduleList = (inx, day) => async (e) => {
    var selectedCell = document.getElementById('cell' + inx);
    var dialogContainer = document.getElementById('dialogContainer');

    if (window.innerWidth - selectedCell.offsetLeft < 400) {
      dialogContainer.style.right = '0px';
      dialogContainer.style.left = 'inherit';
    } else {
      dialogContainer.style.left = selectedCell.offsetLeft + 'px';
      dialogContainer.style.right = 'inherit';
    }

    dialogContainer.style.top = selectedCell.offsetTop + 'px';
    dialogContainer.style.display = 'inline-table';

    setSelectedCalendarDate(moment(day).format('YYYY-MM-DD'));
    setOpen(true);
  }

  const handleClose = (e) => {
    setOpen(false);
    var dialogContainer = document.getElementById('dialogContainer');
    dialogContainer.style.display = 'none';
    // var selectedPopup = document.getElementById('content' + inx);
    // selectedPopup.style.display = "none";
  };

  const toggleWeeklyCanlendar = () => {
    document.getElementById('weekCalendar').click();
  }

  const clickPrevWeek = () => {
    setEmpDate(moment(empDate).day(-7));
    var dialogContainer = document.getElementById('dialogContainer');
    dialogContainer.style.display = 'none';
  }

  const clickNextWeek = () => {
    setEmpDate(moment(empDate).day(7));
    var dialogContainer = document.getElementById('dialogContainer');
    dialogContainer.style.display = 'none';
  }

  // const clickDiv = () => {
  //     console.log('div clicked ')
  // }

  return (
    <>
      <div className={classes.navContaioner}>
        <Button onClick={() => handleEmpDateChange(todayDate)} className={classes.todayBtn}>Today</Button>
        <Button onClick={clickPrevWeek}><ChevronLeftIcon /></Button>
        <Button onClick={toggleWeeklyCanlendar}>
          {moment(weekStartDay).format('MMM DD')}
          &ensp;-&ensp;
          {moment(weekEndDay).format('MMM DD YYYY')}
        </Button>
        <Button onClick={clickNextWeek}><ChevronRightIcon /></Button>

        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}

        <MuiPickersUtilsProvider utils={MomentUtils} >
          <DatePicker
            label="Weekly"
            value={empDate}
            // {moment(empDate).weekday(0), moment(empDate).weekday(6) }
            showTodayButton={true}
            onChange={handleEmpDateChange}
            className={classes.utilRoot}
            id="weekCalendar"
            style={{ display: 'none' }}
          />
        </MuiPickersUtilsProvider> 
      </div>

      <TableContainer >
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHead} style={{ minWidth: 100 }}>
                &nbsp;
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.id === 'time' ? 'center' : column.align}
                  style={{ minWidth: column.minWidth }}
                  className={moment(weekDates[index]).format("DD") === todayDate.format("DD") ? classes.tableHeadToday : classes.tableHead}
                >
                  {column.label}<br />
                  <Typography variant="h3">{moment(weekDates[index]).format("DD")}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <div className={classes.container}>
        <div className="timeSideBar">

        </div>
        <TableContainer >
          <Table className={classes.table} >
            <TableBody>
              {timeRows.map((timeRow, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{ minWidth: 100 }}
                    className={index % 4 === 0 ? classes.TimeScaleExactLabel : classes.TimeScaleLabel}
                  >
                    <div >
                      <span>{timeRow}</span>
                    </div>
                  </TableCell>
                  {
                    weekDates.map((day, inx) => (
                      isIncludeSchedule(timeRow, day) > -1 ?
                        <TableCell
                          align='center'
                          style={{ minWidth: 100 }}
                          className={clsx(classes.TimeTableCell, classes.TimeTableCellActive)}
                          key={inx}
                          id={'cell' + index + inx}
                          data-value={activeWeekDataIndex}
                          onClick={showScheduleList(index + '' + inx, day)}
                        >
                          {''}
                          {/* <div id={'content' + index + inx} className={classes.schedulePopupContainer} >
                            <DialogContent classes={{ root: classes.dialogRoot }}>
                                <Typography variant="h4" onClick={handleClose} className={classes.closeIcon}>X</Typography>
                                {
                                  weekData[activeWeekDataIndex] ?
                                    weekData[activeWeekDataIndex].data.map((item, c) => (
                                      <Grid key={c} container className={classes.scheduleRow}>
                                        <Grid item sm={3}>
                                          <Typography variant="h5" className={classes.sheduleDlgTimeLabel}>
                                            {moment(item.startDate).format("hh:mm A")}
                                          </Typography>
                                        </Grid>
                                        <Grid item sm={4}>
                                          <Typography variant="h5" > {item.fullName}</Typography>
                                        </Grid>
                                        <Grid item sm={5}>
                                          <Actions
                                            handleCheck={() => handleCheck(1)}
                                            handleReschedule={() => handleReschedule(1)}
                                            handleDelete={() => handleDelete(1)}
                                          />
                                        </Grid>
                                      </Grid>
                                    ))
                                    :
                                    ''
                                }
                            </DialogContent>
                        </div> */}
                        </TableCell>
                        :
                        <TableCell
                          // key={column.id}
                          align='center'
                          style={{ minWidth: 100 }}
                          className={classes.TimeTableCell}
                          key={inx}
                        >
                          <Typography variant="h3"></Typography>
                        </TableCell>
                    ))
                  }

                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* <Dialog onClose={handleClose} open={open} classes={{ paper: classes.dialogPaper }} id="dialogContainer"> */}
      {/* <DialogTitle id="simple-dialog-title">Schedule</DialogTitle> */}
      <div
        // classes={{ root: classes.dialogRoot }}
        className={classes.dialogRoot1}
        open={open}
        id="dialogContainer"
      >
        <Typography variant="h4" onClick={handleClose} className={classes.closeIcon}>X</Typography>
        {selectedCalendarDate && (
          <DateSchedule
            location_id={location_id}
            refetch={refetch}
            momentDate={moment(selectedCalendarDate)}
            scheduleTitle={`TEST SCHEDULE`}
            showScheduleButton={false}
            isWeekView={true}
            submitScheduleAction={submitScheduleAction}
          />
        )}
      </div>

      <br />
      <br />
      <br />
      <br />

    </>
  );
}

WeekViewPage.propTypes = {
  getScheduleWeek: PropTypes.func.isRequired,
  location_id: PropTypes.any,
  refetch: PropTypes.any.isRequired,
  submitScheduleAction: PropTypes.func.isRequired,
}

export default connect(null, { getScheduleWeek })(WeekViewPage);