import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/styles';
import { CircularProgress, IconButton, Typography } from '@material-ui/core';
import moment from "moment";
// import { Site, Users, TestManager, Departiment, Test, NotificationBell } from 'icons';
// import Results from 'icons/Results';
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { getNotifications, markAsReadNotification, resendFailedFromNotification } from 'actions/api';
import CustomTable from 'components/CustomTable';
import NotificationIcon from 'components/NotificationIcon';
import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(3),
  },
  headerTitle: {
    color: theme.palette.brandText,
  },
  inActive: {
    color: '#D8D8D8 !important'
  },
  closeIconButton: {
    color: theme.palette.brandGray,
    padding: '3px 12px',
    right: '5px'
  },
  itemIcon: {
    color: '#7094A7',
    margin: '8px'
  },
}));

const DotSeverity = withStyles((theme) => ({
  root: {
    color: props => {
      switch (props.severity) {
        case 'Emergency':
          return '#ad0000';
        case 'Alert':
          return '#ff0000';
        case 'Critical':
          return '#ff0000';
        case 'Error':
          return theme.palette.brandRed;
        case 'Warning':
          return '#fc7a00';
        case 'Notification':
          return theme.palette.brand;
        case 'Informational':
          return theme.palette.brandBlue;
        case 'Debugging':
          return '#fc7a00';

        default:
          return theme.palette.brandGray;
      }
    }
  },
}))(FiberManualRecordIcon);

const Notifications = (props) => {
  const { account, getNotifications, markAsReadNotification, resendFailedFromNotification } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');

  const metaData = [
    { key: 'severity', label: '', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
    { key: 'icon', label: 'Icon', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
    { key: 'date', label: 'Date', align: 'left', minWidth: 200, sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'title', label: 'Notification', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'message', label: 'Message', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'action', label: 'Action', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
  ];

  useEffect(() => {
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      setLoading(true);
      let res = await getNotifications(queryParams);
      setLoading(false);
      if (res.success) {
        setNotificationsList(res.data);
        setCount(res.count);
      }
    })();
    // eslint-disable-next-line
  }, [page, rowsPerPage, order, orderBy, refetch]);

  const markAsRead = async (notification_id) => {
    setFetchLoading(true);
    let res = await markAsReadNotification(notification_id);
    setFetchLoading(false);
    if (res.success) {
      setRefetch(refetch => refetch + 1);
    }
    console.log(resendFailedFromNotification)
  };

  // const NotificationIcon = (type, isRead) => {
  //   type = type ? type : '';
  //   if (type.includes('location'))
  //     return <Site className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   if (type.includes('department'))
  //     return <Departiment className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   if (type.includes('populationsetting'))
  //     return <Users className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   else if (type.includes('user'))
  //     return <Users className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   else if (type.includes('result'))
  //     return <Results className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   else if (type.includes('order'))
  //     return <Test className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   else if (type.includes('schedule'))
  //     return <TestManager className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  //   else
  //     return <NotificationBell className={clsx(classes.itemIcon, isRead && classes.inActive)} />;
  // }

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'date') {
      return (
        <div>{value && moment.utc(value).format('MMM DD, YYYY HH:mm')}</div>
      );
    }
    if (column.key === 'severity') {
      return (
        <DotSeverity severity={row.severity} />
      );
    }
    if (column.key === 'icon') {
      return (
        <NotificationIcon
          type={row.type}
          classes={classes.itemIcon}
        />
        // NotificationIcon(row.type, (row.reads_by && row.reads_by.find(r => r === account._id)))
      );
    }
    if (column.key === 'action') {
      return (
        row.reads_by && !row.reads_by.find(r => r === account._id) 
        ?
        <IconButton className={classes.closeIconButton} onClick={() => markAsRead(row._id)}>
          <CloseIcon />
        </IconButton>
        :
        <div></div>
      );
    }
    return (
      <div className={clsx((row.reads_by && row.reads_by.find(r => r === account._id)) ? classes.inActive : '')}>{value}</div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h3" className={classes.headerTitle}>
          All Notifications
        </Typography>
        {fetchLoading &&
          <CircularProgress size={20} />
        }
      </div>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={notificationsList}
        count={count}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  account: state.auth.account,
});

Notifications.propTypes = {
  account: PropTypes.object.isRequired,
  getNotifications: PropTypes.func.isRequired,
  markAsReadNotification: PropTypes.func.isRequired,
  resendFailedFromNotification: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getNotifications, markAsReadNotification, resendFailedFromNotification })(Notifications);