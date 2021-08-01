import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import { Grid, Typography, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@material-ui/core';
import clsx from 'clsx';
import moment from "moment";
import { getSchedules } from 'actions/api';
import * as appConstants from 'constants/appConstants';
import CalendarIcon from './CalendarIcon';
import ScheduleButton from '../ScheduleButton';
import Actions from './Actions';
import DialogAlert from 'components/DialogAlert';

const popupWidth = 400;
const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(4),
  },
  header: {
    padding: theme.spacing(2),
  },
  testScheduleTitle: {
    color: theme.palette.blueDark
  },
  timeWidth: {
    width: '100px'
  },
  tableHead: {
    backgroundColor: 'rgba(15,132,169,0.6)',
    color: 'white'
  },
  timeCell: {
    backgroundColor: theme.palette.white,
    color: theme.palette.blueDark,
    borderRight: `solid 1px ${theme.palette.blueDark}`,
    borderBottom: `solid 1px ${theme.palette.blueDark}`,
    padding: 0,
    fontSize: '14px',
    fontWeight: 600
  },
  tableCell: {
    color: theme.palette.brandDark,
    borderBottom: `solid 1px ${theme.palette.blueDark}`,
    fontWeight: 500,
    padding: 0
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
  sheduleDlgTimeLabel: {
    color: '#043B5D'
  },
}))

const columns = [
  { id: 'time', align: 'center', label: 'Time', minWidth: 50 },
  { id: 'lastName', align: 'center', label: 'Last Name', minWidth: 100 },
  { id: 'firstName', align: 'center', label: 'First Name', minWidth: 100 },
  { id: 'location', align: 'center', label: 'Location', minWidth: 100 },
  { id: 'phone', align: 'center', label: 'Phone Number' },
  { id: 'type', align: 'center', label: 'Appointment Type', minWidth: 100 },
  { id: 'action', align: 'center', label: ' Action', minWidth: 100 }
];

const DateSchedule = (props) => {
  const { momentDate, scheduleTitle, getSchedules, location_id, refetch, showScheduleButton, submitScheduleAction, isWeekView } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [action, setAction] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [dateRefetch, setDateRefetch] = useState(null);

  useEffect(() => {
    console.log('DateSchedule useEffect');
    (async () => {
      if (date !== momentDate.format('YYYY-MM-DD') || dateRefetch !== refetch) {
        setDate(momentDate.format('YYYY-MM-DD'));
        setDateRefetch(refetch);
        let queryParams = `date=${momentDate.format('YYYY-MM-DD')}`;
        if (location_id)
          queryParams += `&location_id=${location_id}`;
        setLoading(true);
        let res = await getSchedules(queryParams);
        setLoading(false);
        if (res.success)
          setSchedules(res.data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [momentDate, location_id, refetch]);

  const handleCheck = (id) => {
    let body = {
      action: 'Check',
      schedule_id: id,
      message: "Do you want to Submit."
    }
    setAction(body);
    setConfirmDialogOpen(true);
  }

  const handleReschedule = (id) => {
    let body = {
      action: 'Reschedule',
      schedule_id: id,
      message: "Do you want to Reschedule."
    }
    setAction(body);
    setConfirmDialogOpen(true);

  }

  const handleDelete = (id) => {
    let body = {
      action: 'Delete',
      schedule_id: id,
      message: "Do you want to Delete."
    }
    setAction(body);
    setConfirmDialogOpen(true);

  }

  const handleDialogAction = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    await submitScheduleAction(action);
    setLoading(false);
  }

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  }

  return (
    <div className={classes.root}>
      {!isWeekView && (
        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.header} >
          <Grid item>
            <Grid item container direction="row" justify="flex-start" alignItems="center">
              <CalendarIcon day={momentDate.date()} month={momentDate.format('MMMM')} />
              <Typography variant="h3" className={classes.testScheduleTitle}>{scheduleTitle}</Typography>
            </Grid>
          </Grid>
          <Grid item >
            {showScheduleButton && (
              <ScheduleButton
                submitScheduleAction={submitScheduleAction}
              />
            )}
          </Grid>
        </Grid>
      )}

      {isWeekView
        ?
        loading
          ?
          <CircularProgress />
          :
          !schedules.length
            ?
            <Typography>{'No data to display...'}</Typography>
            :
            schedules.map((schedule, index) => (
              <Grid key={index} container className={classes.scheduleRow}>
                <Grid item sm={3}>
                  <Typography variant="h5" className={classes.sheduleDlgTimeLabel}>
                    {moment(schedule.time, 'HH:mm').format("hh:mm A")}
                    {/* - {moment(schedule.date).format("MM/DD/YYYY")} */}
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography variant="h5" >
                    {schedule.dependent_id ? schedule.dependent_id.last_name : schedule.user_id.last_name}
                    &nbsp;
                    {schedule.dependent_id ? schedule.dependent_id.first_name : schedule.user_id.first_name}
                  </Typography>
                </Grid>
                <Grid item sm={5}>
                  <Actions
                    handleCheck={() => handleCheck(schedule._id)}
                    handleReschedule={() => handleReschedule(schedule._id)}
                    handleDelete={() => handleDelete(schedule._id)}
                  />
                </Grid>
              </Grid>
            ))
        :
        <TableContainer >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.id === 'time' ? 'center' : column.align}
                    style={{ minWidth: column.minWidth }}
                    className={column.id === 'time' ? clsx(classes.tableHead, classes.timeWidth) : classes.tableHead}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ?
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
                :
                !schedules.length
                  ?
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  :
                  schedules.map((schedule, index) => (
                    <TableRow
                      key={index}
                      hover
                      className={index % 2 !== 0 ? '' : brandClasses.tableRow2}
                    >
                      <TableCell align="center" className={classes.timeCell}>
                        {moment(schedule.time, 'HH:mm').format('h:mm A')}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        {schedule.dependent_id ? schedule.dependent_id.last_name : schedule.user_id.last_name}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        {schedule.dependent_id ? schedule.dependent_id.first_name : schedule.user_id.first_name}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        {schedule.location_id.name}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        {schedule.user_id.phone}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        {schedule.type}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="center">
                        <Actions
                          handleCheck={() => handleCheck(schedule._id)}
                          handleReschedule={() => handleReschedule(schedule._id)}
                          handleDelete={() => handleDelete(schedule._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      }


      <DialogAlert
        open={confirmDialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Are you sure ?'}
        message={action.message || ''}
        onClose={handleDialogClose}
        onAction={handleDialogAction}
      />
    </div>
  )
}

DateSchedule.propTypes = {
  momentDate: PropTypes.any.isRequired,
  scheduleTitle: PropTypes.string.isRequired,
  location_id: PropTypes.any,
  refetch: PropTypes.any.isRequired,
  showScheduleButton: PropTypes.bool.isRequired,
  getSchedules: PropTypes.func.isRequired,
  submitScheduleAction: PropTypes.func.isRequired,
  isWeekView: PropTypes.bool
};

export default connect(null, { getSchedules })(withRouter(DateSchedule));
