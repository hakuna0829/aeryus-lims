import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Subject } from 'rxjs';
import { makeStyles } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import { Grid, Typography, Paper, CircularProgress } from '@material-ui/core';
// import { Chart } from "react-google-charts";
import ScheduleButton from '../ScheduleButton';
import { getScheduleMonth, getScheduleTests } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import BarChart from 'components/BarChart';
// import { ViewState } from '@devexpress/dx-react-scheduler';
// import {
//   Scheduler,
//   MonthView,
//   Appointments,
// } from '@devexpress/dx-react-scheduler-material-ui';
// import clsx from 'clsx';
import DateSchedule from '../components/DateSchedule';
import CustomScheduler from 'components/Scheduler';

const dateClickSubject = new Subject();
const dateClickObservable = dateClickSubject.asObservable();

const scrollToRef = ref =>
  ref.current
    ? ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    : null;

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px`
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  // Calendar
  calendarGrid: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`
  },
  monthLabelGrid: {
    marginTop: theme.spacing(6)
  },
  monthItem: {
    textAlign: 'center',
    cursor: 'pointer'
  },
  monthLabel: {
    color: theme.palette.brandGray,
    fontSize: '1.5vw',
    paddingBottom: 10
  },
  monthActive: {
    color: theme.palette.brandDark,
    fontSize: '1.7vw'
  },
  monthViewHeaderLabel: {
    color: theme.palette.brandDark,
    textTransform: 'uppercase'
  },
  calendar: {
    // margin: theme.spacing(4),
    padding: theme.spacing(4),
    border: `solid 1px ${theme.palette.brandDark}`,
    borderRadius: 5
  },
  // Chart
  chartContainer: {
    // border:'solid 1px #0F84A9',
    padding: theme.spacing(3),
    margin: '20px auto'
  },
  chartWrap: {
    padding: theme.spacing(4),
    border: `solid 1px ${theme.palette.brandDark}`
  },
  chartHeader: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& h4, h5': {
      color: theme.palette.brandDark,
      fontWeight: 600
    }
  },
  barChart: {
    width: '100%',
    height: '400px'
  }
}));

// const styles = theme => ({
//   cell: {
//     color: '#78909C !important',
//     position: 'relative',
//     verticalAlign: 'top',
//     padding: 0,
//     border: `1px solid ${theme.palette.brandGray}`,
//     '&:hover': {
//       backgroundColor: 'white',
//     },
//     '&:focus': {
//       backgroundColor: fade(theme.palette.brandGray, 0.15),
//       outline: 0,
//     },
//   },
//   text: {
//     padding: '0.5em',
//     textAlign: 'right',
//     color: theme.palette.brandGray
//   },
//   countText: {
//     textAlign: 'center',
//     color: theme.palette.white,
//     backgroundColor: theme.palette.brand,
//     lineHeight: '1vw',
//     padding: '.5vw',
//     marginLeft: '1.5vw',
//     marginRight: '1.5vw',
//     borderRadius: '1vw',
//     fontSize: '1.5vw',
//   },
//   appointmentDate: {
//     cursor: 'pointer',
//   }
// });

// const TimeTableCell = withStyles(styles)(({
//   classes,
//   startDate,
//   endDate,
//   formatDate,
//   otherMonth,
//   data,
//   groupingInfo,
//   ...restProps
// }) => {
//   console.log('restprops data', startDate, endDate, restProps)
//   const isFirstMonthDay = startDate.getDate() === 1;
//   const formatOptions = isFirstMonthDay
//     ? { day: 'numeric', month: 'long' }
//     : { day: 'numeric' };
//   const tableCellRef = React.useRef();
//   const [cellSize, setCellSize] = useState({
//     width: undefined,
//     height: undefined,
//   });

//   useEffect(() => {
//     function handleResize() {
//       const tempWidth = tableCellRef.current.offsetWidth;
//       setCellSize({
//         width: tempWidth,
//         height: tempWidth,
//       });
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <TableCell
//       tabIndex={0}
//       className={clsx({
//         [classes.cell]: true,
//       })}
//       style={{ height: cellSize.height }}
//       ref={tableCellRef}
//     >
//       <div className={classes.text}>
//         {formatDate(startDate, formatOptions)}
//       </div>
//     </TableCell>
//   );
// });

// const Appointment = withStyles(styles, { name: 'Appointment' })(({ classes, ...restProps }) => {
//   console.log('appointment', restProps)
//   const clickedDay = (date) => {
//     if (moment(date).isValid())
//       dateClickSubject.next(moment(date).format('YYYY-MM-DD'));
//   };
//   return (
//     <div className={classes.appointmentDate} onClick={() => clickedDay(restProps.data.startDate)}>

//       <Typography variant="h3" className={classes.countText}>{restProps.data.title}</Typography>
//       {/* <Typography variant="h6" className={classes.desc}>{'Appointments'}</Typography> */}
//     </div>
//   )
// });

const stColors = ['#25DD83', '#3ECCCD'];

const MonthSchedule = props => {
  const {
    location_id,
    getScheduleTests,
    showFailedDialog,
    showErrorDialog,
    refetch,
    submitScheduleAction,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const calendarDateSchedulesRef = useRef(null);

  let [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [monthData, setMonthData] = useState([]);
  const [testsLabels, setTestsLabels] = useState([]);
  const [testsData, setTestsData] = useState([]);

  useEffect(() => {
    console.log('MonthSchedule useEffect');
    dateClickObservable.subscribe(date => {
      scrollToRef(calendarDateSchedulesRef);
      if (selectedCalendarDate !== date) {
        console.log('Calendar date onClick', date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selectedCalendarDate = date;
        setSelectedCalendarDate(date);
      }
    });
    let queryParams = `month=${selectedMonth}`;
    if (location_id) {
      queryParams += `&location_id=${location_id}`;
      setSelectedCalendarDate(null);
    }
    // get month data
    getScheduleMonth(queryParams)
      .then(res => {
        if (res.data.success) {
          let monthDates = res.data.data.map(x => ({
            title: x.count,
            startDate: moment(`${x.date}T10:00:00Z`).format(),
            endDate: moment(`${x.date}T10:30:00Z`).format()
          }));
          setMonthData(monthDates);
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        showErrorDialog(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location_id, selectedMonth, refetch]);

  useEffect(() => {
    const fetchScheduleTest = async () => {
      let res = await getScheduleTests(`date=${selectedCalendarDate}`);
      if (res.success) {
        let labels = [];
        let sData = [];
        let tData = [];
        res.data.forEach(r => {
          labels.push(r.time);
          sData.push(r.schedules);
          tData.push(r.testings);
        });
        setTestsLabels(labels);
        setTestsData([
          { name: 'Patients Scheduled', data: sData },
          { name: 'Patients Tested', data: tData }
        ]);
      }
    };
    if (selectedCalendarDate) fetchScheduleTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCalendarDate, refetch]);

  const handleMonthChange = month => {
    setSelectedMonth(month);
  };

  // const todayDate = moment();
  // const [currentDate, setCurrentDate] = useState(todayDate);
  // const [activeMonth, setActiveMonth] = useState(moment(todayDate).month());

  // const clickMonth = (index) => {
  //   setCurrentDate(moment().year() + '/' + (index + 1) + '/01');
  //   setActiveMonth(index)
  // }

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center">
        <Grid item>
          <Typography variant="h3" className={classes.headerTitle}>
            MONTHLY VIEW
          </Typography>
        </Grid>
        <Grid item>
          <ScheduleButton
            submitScheduleAction={submitScheduleAction}
          />
        </Grid>
      </Grid>

      <Grid item className={classes.calendarGrid}>
        <CustomScheduler
          data={monthData}
          dateClickSubject={dateClickSubject}
          handleMonthChange={handleMonthChange}
        />
        {/* <Grid container className={classes.monthLabelGrid}>
          {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, index) => {
            return (
              <Grid item xs={1} sm={1} className={classes.monthItem} key={index}>
                <Typography
                  onClick={() => clickMonth(index)}
                  className={clsx(classes.monthLabel, activeMonth === index && classes.monthActive)}
                >
                  {month}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
        <div className={classes.calendar}>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Typography variant="h2" className={classes.monthViewHeaderLabel}>{moment().month(activeMonth).format('MMMM')}</Typography>
            <Typography variant="h2" className={classes.monthViewHeaderLabel}>{moment(currentDate).format('YYYY')}</Typography>
          </Grid>
          <Scheduler data={data} >
            <ViewState currentDate={currentDate} />
            <MonthView timeTableCellComponent={TimeTableCell} />
            <Appointments appointmentComponent={Appointment} />
          </Scheduler>
        </div> */}
      </Grid>

      <div ref={calendarDateSchedulesRef}>
        {selectedCalendarDate && (
          <DateSchedule
            location_id={location_id}
            submitScheduleAction={submitScheduleAction}
            refetch={refetch}
            momentDate={moment(selectedCalendarDate)}
            scheduleTitle={`TEST SCHEDULE`}
            showScheduleButton={false}
          />
        )}
      </div>

      {selectedCalendarDate && (
        <div className={classes.chartContainer}>
          <Paper className={classes.chartWrap}>
            <div className={classes.chartHeader}>
              <Typography variant="h5">Patients Scheduled</Typography>
              <Typography variant="h4">Daily by Hour</Typography>
              <Typography variant="h5">Patients Tested</Typography>
            </div>
            {testsData.length ? (
              <BarChart
                colors={stColors}
                seriesData={testsData}
                label={testsLabels}
                height={405}
              />
            ) : (
                <CircularProgress className={brandClasses.fetchProgressSpinner} />
              )}
            {/* <Chart
            // width={'500px'}
            // height={'300px'}
            className={classes.barChart}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={[
              ['Time', 'Scheduled', 'Tested'],
              ['7 AM', 75, 90],
              ['8 AM', 85, 140],
              ['9 AM', 80, 120],
              ['10 AM', 120, 270],
              ['11 AM', 120, 420],
              ['12 PM', 110, 320],
              ['1 PM', 460, 270],
              ['2 PM', 370, 210],
              ['3 PM', 310, 160],
              ['4 PM', 220, 120],

            ]}
            options={{
              // Material design options
              chart: {
                // title: 'Company Performance',
                // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
              },
              colors: ['#25DD83', '#3ECCCD'],
            }}
            // For tests
            rootProps={{ 'data-testid': '2' }}
          /> */}
          </Paper>
        </div>
      )}
    </div>
  );
};

MonthSchedule.propTypes = {
  getScheduleTests: PropTypes.func.isRequired,
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  location_id: PropTypes.any,
  refetch: PropTypes.any.isRequired,
};

export default connect(null, {
  getScheduleTests,
  showFailedDialog,
  showErrorDialog
})(MonthSchedule);
