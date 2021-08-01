import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
// import { withStyles } from '@material-ui/core/styles';
// import { ViewState } from '@devexpress/dx-react-scheduler';
// import {
//   // Scheduler,
//   WeekView,
//   // Toolbar,
//   DateNavigator,
//   Appointments,
//   TodayButton,
// } from '@devexpress/dx-react-scheduler-material-ui';
// import moment from "moment";
import ScheduleButton from '../ScheduleButton';
// import { appointments } from 'views/TestManager/month-appointments';
// import clsx from 'clsx';
//Extra 
// import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
// import MomentUtils from '@date-io/moment';
import WeekViewPage from './WeekViewPage';


const useStyles = makeStyles(theme => ({
  root: {
    // padding: 20,
    // paddingLeft: theme.spacing(2)
  },
  header: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  headerRight: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  sidebar: {
    width: 380
  },
  content: {
    width: 'calc(100% - 380px)'
  },
  pageTitle: {
    color: theme.palette.blueDark,
  },
  pageTitleIcon: {
    paddingRight: 10
  },
  calendar: {
    margin: theme.spacing(2),
  },
  tableRow1: {
    backgroundColor: 'rgba(15,132,169,0.15)',
    "&:hover": {
      backgroundColor: "rgba(15,132,169,0.15) !important"
    }
  },
  tableRow2: {
    backgroundColor: 'white',
  },
  tablehead: {
    color: '#0F84A9',
    fontSize: 17,
    fontWeight: 600,
  },
  tableCell: {
    color: '#0F84A9',
    fontSize: 14,
    fontWeight: 500,
    alignItems: 'center',
  },
  tableCellRed: {
    color: '#f00',
    fontSize: 14,
    fontWeight: 500,
    alignItems: 'center',
  },
  statusCell: {
    color: '#0F84A9',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center'
  },
  statusCellLabel: {
    paddingLeft: 10
  },
  tablePagination: {
  },
  tablePaginationCaption: {
    color: '#0F84A9'
  },
  tablePaginationSelectIcon: {
    color: '#0F84A9'
  },
  tablePaginationSelect: {
    color: '#0F84A9'
  },
  tablePaginationActions: {
    color: '#0F84A9',
  },
  tableActionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: '20px auto'
  },
  searchBar: {
    paddingRight: 20
  },
  settingIconBox: {
    width: '50px',
    height: '50px',
    display: 'block',

    fontFamily: 'verdana',
    fontSize: '22px',
    padding: 0,
    margin: 0,
    border: 'solid 1px rgba(155,155,155,0.5)',
    outline: 0,
    lineHeight: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    background: '#fff',
  },
  settingIcon: {
    fontSize: '2rem',
    marginTop: 8,
    color: 'rgba(155,155,155,0.5)',
  },
  // Chart
  chartContainer: {
    // border:'solid 1px #0F84A9',
    padding: theme.spacing(3),
    margin: '20px auto'
  },

}));

// const styles = ({ spacing, palette }) => ({
//   root: {
//     '& ordinaryLeftPanelBorder': {
//       border: 'solid 1px red'
//     }
//   },
//   weekEnd: {

//     // border:'solid blue 1px',
//     '& p': {
//       // color:'red',
//       // fontSize:22
//     }

//   },
//   dayRow: {
//     backgroundColor: 'rgba(15,132,169,0.6)',
//     border: 'none',
//     '& p': {
//       color: '#fff',
//       textTransform: 'uppercase',
//       fontSize: '16px',
//       '&.Cell-highlightedText': {
//         color: 'red'
//       }
//     },
//     '& div': {
//       color: '#fff',
//       fontSize: '22px'
//     }

//   },
//   dayEmptyCell: {
//     backgroundColor: 'rgba(15,132,169,0.6)',
//     borderRight: 'none',
//     width: '101%',
//     height: '100%',
//     '&:parent': {
//       backgroundColor: 'red'
//     }

//   },
//   TimeTableCell: {
//     border: 'solid #0F84A9 1px',
//     borderTop: 'none',
//     height: 39

//   },
//   timeTableLayout: {
//     border: 'solid #0F84A9 1px',
//     borderTop: 'none',
//     '&:last-child': {
//       borderRight: 'solid #0F84A9 1px'
//     }

//   },
//   TimeScaleLabel: {
//     height: 39,
//     lineHeight: '57px',
//     // background:'yellow',
//     '& span': {
//       color: '#043B5D',
//       fontSize: '12px',
//       borderBottom: 'solid 1px #0F84A9'
//     },
//     '&:first-child': {
//       height: 39,
//       border: 0,
//       padding: 0,
//       overflow: 'hidden',
//       textAlign: 'right',
//       lineHeight: '55px',
//       userSelect: 'none',
//       paddingLeft: '2px',
//       paddingRight: '8px',
//       textOverflow: 'ellipsis',
//     },
//     '&:last-child': {
//       height: 0,
//       display: 'none'
//     }
//     // '&.emptyLabel':{
//     //   border:'solid red 1px'
//     // },
//   },
//   TimeScaleExactLabel: {
//     height: 39,
//     lineHeight: '57px',
//     '& span': {
//       color: '#043B5D',
//       fontSize: '18px',
//       borderBottom: 'solid 1px #0F84A9'
//     }
//   },
//   weekview: {
//     '& ordinaryLeftPanelBorder': {
//       border: 'solid red 1px'
//     }
//   },
//   navigationRoot: {
//     position: 'relative'
//   },
//   navigationBtn: {
//     boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
//     border: '1px solid #0F84A9',
//     '& .MuiButton-label': {
//       color: '#043B5D'
//     }
//   },

//   navigationPrevWeekBtn: {
//     // border:'solid red 1px',

//   },
//   navigationNextWeekBtn: {
//     // border:'solid blue 1px',
//     position: 'absolute',
//     right: '-50px'
//   }
// });

const WeekSchedule = (props) => {
  const { submitScheduleAction } = props;

  const classes = useStyles();
  // const [data] = useState(appointments);
  // const [currentDate, setCurrentDate] = useState(moment());

  // const DayScaleRow = withStyles(styles, { name: 'DayScaleRow' })(({ classes, ...restProps }) => {
  //   // console.log('dayscale - ', restProps)
  //   return <WeekView.DayScaleRow {...restProps} className={classes.dayRow} />
  // });

  // const DayScaleCell = withStyles(styles, { name: 'DayScaleCell' })(({ classes, ...restProps }) => {
  //   const { startDate } = restProps;
  //   if (startDate.getDay() === 0 || startDate.getDay() === 6) {
  //     return <WeekView.DayScaleCell {...restProps} className={classes.weekEnd} >
  //     </WeekView.DayScaleCell>;
  //   } return <WeekView.DayScaleCell {...restProps} />;
  // });

  // // first empty cell in the head row
  // const DayScaleEmptyCell = withStyles(styles, { name: 'DayScaleEmptyCell' })(({ classes, ...restProps }) => {

  //   return <div className={classes.dayEmptyCell} ></div>;
  // });

  // //each time cell
  // const TimeTableCellComponent = withStyles(styles, { name: 'TimeTableCell' })(({ classes, ...restProps }) => {
  //   // console.log('TimeTableCellComponent - ', restProps)
  //   return <WeekView.TimeTableCell {...restProps} className={classes.TimeTableCell} >
  //   </WeekView.TimeTableCell>
  // });

  // //time row
  // const TimeTableLayout = withStyles(styles, { name: 'TimeTableLayout' })(({ classes, ...restProps }) => {
  //   return <WeekView.TimeTableLayout {...restProps} className={classes.timeTableLayout} >
  //     {/* <div>11</div> */}
  //   </WeekView.TimeTableLayout>
  // });

  // const TimeTableRow = withStyles(styles, { name: 'TimeTableRow' })(({ classes, ...restProps }) => {

  //   return <WeekView.TimeTableRow {...restProps} className={classes.timeTableLayout} >
  //     {/* <div>11</div> */}
  //   </WeekView.TimeTableRow>
  // });
  // const TimeScaleLabel = withStyles(styles, { name: 'TimeScaleLabel' })(({ classes, ...restProps }) => {
  //   // console.log('restProps--', restProps)
  //   // console.log('mins - ', moment(restProps.time).get('minute'));
  //   const isExact = moment(restProps.time).get('minute') === 0 ? true : false;
  //   return !restProps.time ?
  //     <div className={clsx(classes.TimeScaleExactLabel, classes.TimeScaleLabel)} >
  //       <span >7:00 AM</span>
  //     </div>
  //     :
  //     <WeekView.TimeScaleLabel {...restProps} className={isExact ? classes.TimeScaleExactLabel : classes.TimeScaleLabel} >
  //     </WeekView.TimeScaleLabel>

  // });

  // const TodayBtnComponent = withStyles(styles)(({ classes, ...restProps }) => {
  //   return <TodayButton.Button {...restProps} className={classes.navigationBtn}></TodayButton.Button>
  // });

  // const NavRootComponent = withStyles(styles)(({ classes, ...restProps }) => {
  //   return <DateNavigator.Root {...restProps} className={classes.navigationRoot} />
  // });

  // const openCalendarComponent = withStyles(styles)(({ classes, ...restProps }) => {
  //   return <DateNavigator.OpenButton {...restProps} className={classes.navigationBtn} />
  // });

  // const navigationButtonComponent = withStyles(styles)(({ classes, ...restProps }) => {
  //   if (restProps.type === 'back')
  //     return <DateNavigator.NavigationButton {...restProps} className={classes.navigationPrevWeekBtn} />
  //   else
  //     return <DateNavigator.NavigationButton {...restProps} className={classes.navigationNextWeekBtn} />
  // });

  // const Appointment = withStyles(styles, { name: 'Appointment' })(({ classes, ...restProps }) => {
  //   console.log('appointment', restProps)

  //   return (
  //     <div className={classes.appointmentDate} >
  //       <Typography variant="h3" className={classes.countText}>{restProps.data.title}</Typography>
  //     </div>
  //   )
  // });

  // const AppointContent = withStyles(styles, { name: 'Appointment' })(({ classes, ...restProps }) => {
  //   console.log('appointment content', restProps)

  //   return <Appointments.AppointmentContent className={classes.countText} {...restProps} />
  // });


  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.header} >
        <Grid item>
          <Grid item container direction="row" justify="flex-start" alignItems="center">
            <Typography variant="h3" className={classes.pageTitle}>WEEKLY VIEW</Typography>
          </Grid>
        </Grid>
        <Grid item >
          <ScheduleButton
            submitScheduleAction={submitScheduleAction}
          />
        </Grid>
      </Grid>
      <WeekViewPage
        refetch={props.refetch}
        submitScheduleAction={submitScheduleAction}
      />
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={12} className={classes.calendar}>
          {/* <div onClick={prevWeek}>Left</div>
          <div>Right</div> */}
          {/* <MuiPickersUtilsProvider utils={MomentUtils} >
            <DatePicker
              label="Weekly"
              value={empDate}
              showTodayButton={true}
              onChange={handleEmpDateChange}
              className={classes.utilRoot}
            />
          </MuiPickersUtilsProvider> */}


          {/* <Scheduler
            data={data}
            selectedDate={currentDate}
          >
            <ViewState
              // defaultCurrentDate={currentDate}
              onCurrentDateChange={setCurrentDate}
            />

            <WeekView
              startDayHour={7}
              endDayHour={16.25}
              cellDuration={15}
              className={classes.weekview}
              // startDate={}
              // intervalCount={2}
              // dayScaleLayoutComponent={dayLayout}
              dayScaleCellComponent={DayScaleCell}
              dayScaleEmptyCellComponent={DayScaleEmptyCell}
              dayScaleRowComponent={DayScaleRow}
              timeTableCellComponent={TimeTableCellComponent}
              timeScaleLabelComponent={TimeScaleLabel}
              timeTableLayoutComponent={TimeTableLayout}
              timeTableRowComponent={TimeTableRow}
            />

            <Toolbar />
            <DateNavigator
              rootComponent={NavRootComponent}
              openButtonComponent={openCalendarComponent}
              navigationButtonComponent={navigationButtonComponent}
              className={classes.navigationRoot}
            />
            <TodayButton buttonComponent={TodayBtnComponent} />
            <Appointments
              appointmentComponent={Appointment}
              appointmentContentComponent={AppointContent}
            />
          </Scheduler> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default WeekSchedule;