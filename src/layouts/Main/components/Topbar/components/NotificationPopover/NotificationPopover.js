import React, { useState, useEffect } from 'react';
// import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
  makeStyles,
  // withStyles 
} from '@material-ui/core/styles';
import {
  IconButton, Badge, Popover, Typography, Grid, List, ListItem,
  // ListItemAvatar, Avatar, 
  ListItemText,
  // Divider, ListItemSecondaryAction, 
  CircularProgress
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// import moment from "moment";
import { getTopNotifications, markAsReadNotification, resendFailedFromNotification } from 'actions/api';
import { NotificationBell } from 'icons';
import * as cloneDeep from 'lodash/cloneDeep';
import ResendDialog from 'views/Notifications/ResendDialog';
import NotificationIcon from 'components/NotificationIcon';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: '16px'
  },
  popover: {
    width: '55%',
    [theme.breakpoints.up('lg')]: {
      width: '55%',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: '55%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100% ',
    },
  },
  popoverPaper: {
    width: '470px',
    maxHeight: '800px',
    // height: '800px',
    border: '1px solid rgba(15, 132, 169, 0.8)',
    boxShadow: '0px 0px 14px 8px rgba(15, 132, 169, 0.22)',
    top: '50px !important',
    overflowY: 'hidden',
    [theme.breakpoints.up('xl')]: {
      width: '470px',
      maxHeight: '800px',
    },
    [theme.breakpoints.between('md', 'xl')]: {
      width: '470px',
      height: 'calc(100% - 50px)'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100% ',
      height: 'calc(100% - 50px)'
    },
  },
  customBadge: {
    backgroundColor: theme.palette.brandRed,
    color: theme.palette.white,
    border: `1px solid ${theme.palette.white}`,
  },
  notificationBell: {
    color: theme.palette.blueDark,
  },
  readNotification: {
    backgroundColor: theme.palette.brandGray
  },
  header: {
    color: theme.palette.blueDark,
    backgroundColor: theme.palette.white,
  },
  headerTitle: {
    padding: '16px',
    fontSize: '20px',
    fontWeight: 600,
    color: theme.palette.blueDark,
  },
  closeIconButton: {
    color: theme.palette.brandGray,
    padding: '3px 12px',
    position: 'absolute',
    right: '5px'
  },
  dayContainer: {
    backgroundColor: theme.palette.brandLight,
    color: theme.palette.white,
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Montserrat',
    lineHeight: '27px',
    padding: '4px 12px 0px'
  },
  listRoot: {
    // border: '2px solid rgba(15,132,169,0.8)',
    width: '100%',
    maxHeight: '800px',
    padding: 0,
    overflowY:'scroll'
  },
  divider: {
    width: '90%',
    backgroundColor: 'rgba(15,132,169,0.3)',
    margin: 'auto'
  },
  flexConatiner: {
    display: 'flex'
  },
  headerBellIcon: {
    padding: 0
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #D8D8D8',
    padding: '3px 0px'
  },
  itemIcon: {
    color: '#7094A7',
    margin: '8px'
  },
  itemText: {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    lineHeight: '22px',
    paddingRight: '45px',
    // display: 'flex',
    // alignItems: 'center',
    color: '#000000',
    '& a': {
      color: theme.palette.brandDark,
      textDecoration: 'underline',
      whiteSpace: 'nowrap'
    }
  },
  allNotifiation: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white'
    },
    '& span': {
      color: theme.palette.brand,
    }
  },
  anchorText: {
    color: theme.palette.brandDark,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 16,
  }
}));

const NotificationPopover = props => {
  const { getTopNotifications, markAsReadNotification, resendFailedFromNotification } = props;

  const classes = useStyles();

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [count, setCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ notification_id: '', success: false, message: '' });
  // const [notificationData, setNotificationData] = useState(staticData);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let res = await getTopNotifications();
      setLoading(false);
      if (res.success) {
        setNotificationsList(res.data);
        setCount(res.count);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResend = async (notification_id) => {
    setSaveLoading(true);
    let res = await resendFailedFromNotification({ notification_id });
    setSaveLoading(false);
    if (res.success) {
      setDialogOpen(false);
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const NotificationItem = (props) => {
    const { notification, index, subIndex } = props;

    const classes = useStyles();
    const [show, setShow] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(false);

    const markAsRead = async () => {
      setShow(false);
      var tempArray = cloneDeep(notificationsList);
      tempArray[index].data.splice(subIndex, 1);
      setNotificationsList(tempArray);
      // call mark as read api
      if (notification._id) {
        await markAsReadNotification(notification._id);
      }
    }

    const getHref = () => {
      switch (true) {
        case /location/.test(notification.type):
          return `/site-manager/location-details?location_id=${notification.db_id}`;
        case /department/.test(notification.type):
          return `/site-manager/department-details?department_id=${notification.db_id}`;
        case /populationsetting/.test(notification.type):
          return `/site-manager/population-details?population_id=${notification.db_id}`;
        case /user/.test(notification.type):
          return `/user-details/${notification.db_id}`;
        case /result/.test(notification.type):
          return `/results-manager/Positive?testing_id=${notification.db_id}`;
        case /order/.test(notification.type):
          return `/order-tracker?order_id=${notification.db_id}`;
        case /schedule/.test(notification.type):
          return `/appointment-manager/today`;
        case /inventory/.test(notification.type):
          return `/inventory-manager?inventory_id=${notification.db_id}`;

        default:
          return '';
      }
    };

    const onHrefClick = async () => {
      if (notification.resend) {
        setFetchLoading(true);
        let res = await resendFailedFromNotification({ notification_id: notification._id });
        setFetchLoading(false);
        setDialogOpen(true);
        if (res.success) {
          markAsRead();
          setDialogContent({ notification_id: notification._id, success: true, message: `You have re-sent the ${notification.resend_phone ? 'SMS' : 'Mail'} to \n ${notification.resend_phone ? notification.resend_phone : notification.resend_mail}` });
        } else {
          setDialogContent({ notification_id: notification._id, success: false, message: `We were unable to send the ${notification.resend_phone ? 'SMS' : 'Mail'} to \n ${notification.resend_phone ? notification.resend_phone : notification.resend_mail}` });
        }
      } else {
        handleClose();
        history.push(getHref());
      }
    }

    return (
      show ?
        <div className={classes.item}>
          <NotificationIcon
            type={notification.type}
            classes={classes.itemIcon}
          />
          <div className={classes.itemText}>
            {notification.title} &nbsp;
            {fetchLoading
              ?
              <CircularProgress size={20} />
              :
              <span className={classes.anchorText} onClick={() => onHrefClick()}>
                {notification.resend ? 'try again' : 'view here'}
              </span>
            }
          </div>
          <IconButton className={classes.closeIconButton} onClick={() => markAsRead()}>
            <CloseIcon />
          </IconButton>
        </div>
        :
        <></>
    )
  }

  return (
    <div className={classes.root}>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Badge
          badgeContent={count}
          classes={{ badge: classes.customBadge }}
        >
          <NotificationBell className={classes.notificationBell} />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className={classes.popover}
        classes={{
          paper: classes.popoverPaper
        }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <div className={classes.flexConatiner}>
            <Typography className={classes.headerTitle}>Notifications</Typography>
            <IconButton className={classes.headerBellIcon}>
              <Badge
                variant="dot"
                classes={{ badge: classes.customBadge }}
              >
                <NotificationBell className={classes.notificationBell} />
              </Badge>
            </IconButton>
          </div>
          <IconButton className={classes.closeIconButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <List className={classes.listRoot}>
          {loading
            ?
            <CircularProgress size={20} />
            :
            <>
              {notificationsList.map((notification, index) => (
                <div key={index}>
                  <div className={classes.dayContainer}>
                    {notification.label}
                  </div>
                  {notification.data.length
                    ?
                    notification.data.map((item, subIndex) => (
                      <NotificationItem
                        key={subIndex}
                        notification={item}
                        index={index}
                        subIndex={subIndex}
                      // data={notificationData}
                      // setNotificationData={setNotificationData}
                      />
                    ))
                    :
                    <Typography style={{ textAlign: 'center' }}>{'No data to display...'}</Typography>
                  }
                </div>
              ))}
              {/* {notifications.map((notification, index) => (
                  <div key={index}>
                    <ListItem
                      className={clsx(notification.read && classes.readNotification)}
                      button
                      component={RouterLink}
                      to={`/notification/${notification._id}`}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <NotificationBell />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        secondary={moment(notification.date).fromNow()}
                      />
                      <ListItemSecondaryAction>
                        <DotSeverity severity={notification.severity} />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider className={classes.divider} />
                  </div>
                ))} */}
            </>
          }
        </List>
        <ListItem
          button
          component={RouterLink}
          to={`/all-notifications`}
          className={classes.allNotifiation}
        >
          <ListItemText primary="See all recent activity" style={{ textAlign: 'center' }} />
        </ListItem>
      </Popover>

      <ResendDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
        success={dialogContent.success}
        message={dialogContent.message}
        handleResend={handleResend}
        notification_id={dialogContent.notification_id}
        saveLoading={saveLoading}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  notifications: state.data.notifications,
});

NotificationPopover.propTypes = {
  getTopNotifications: PropTypes.func.isRequired,
  markAsReadNotification: PropTypes.func.isRequired,
  resendFailedFromNotification: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { getTopNotifications, markAsReadNotification, resendFailedFromNotification })(NotificationPopover);
