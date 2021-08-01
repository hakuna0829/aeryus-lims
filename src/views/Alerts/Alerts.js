import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import brandStyles from 'theme/brand';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';
// import Notifications from './Notifications';
import AppointmentAlerts from './Appointment';
import SystemAlerts from './System';
import ReportingAlerts from './Reporting';
// import clsx from 'clsx';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'rgba(155, 155, 155, 0.9)',
    opacity: '1'
  },
  // tabsIndicator: {
  //   backgroundColor: 'rgba(155, 155, 155, 0.9)',
  //   opacity:'1'
  // },
  wrapper: {
    oppacity: 1,
    '& .MuiTouchRipple-root': {
      borderRight: 'solid #fff 1px',
    },
    '&:last-child .MuiTouchRipple-root': {
      borderRight: 'solid #fff 0px',
      height: '60%',
      marginTop: 10,
    },
    '&.Mui-selected .MuiTab-wrapper': {
      // borderBottom: 'solid white 2px'
    }
  },
  greenColor: {
    backgroundColor: '#25DD83'
  },
  blueColor: {
    backgroundColor: '#0F84A9'
  },
  yellowColor: {
    backgroundColor: '#FBB040'
  },
}));

const Alerts = (props) => {
  const { match, history } = props;

  const classes = useStyles();
  // const brandClasses = brandStyles();

  // set to 5, as it won't go to 0 tab always
  const [value, setValue] = useState(0);
  // const [subTab, setSubTab] = useState('notifications');

  useEffect(() => {
    const tab = match.params.tab;
    console.log('Selected tab: ' + tab);
    if (tab) {
      switch (tab) {
        case 'appointment':
          setValue(0);
          // setSubTab('user-detail');
          break;
        case 'system':
          setValue(1);
          // setSubTab('sessions');
          break;
        case 'reporting':
          setValue(2);
          // setSubTab('notifications');
          break;

        default:
          break;
      }
    }
  }, [match.params.tab]);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    switch (newValue) {
      case 0:
        history.push('/alerts/appointment');
        break;
      case 1:
        history.push('/alerts/system');
        break;
      case 2:
        history.push('/alerts/reporting');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <AppBar
        position="static"
        className={classes.appBar}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{ indicator: classes.tabsIndicator }}
          // variant="scrollable"
          scrollButtons="auto"
          variant="fullWidth"
        >
          <Tab label="APPOINTMENT ALERTS" classes={{
            root: classes.wrapper,
            selected: classes.greenColor
          }} />
          <Tab label="SYSTEM ALERTS" classes={{
            root: classes.wrapper,
            selected: classes.blueColor
          }} />
          <Tab label="REPORTING ALERTS" classes={{
            root: classes.wrapper,
            selected: classes.yellowColor
          }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <AppointmentAlerts />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SystemAlerts />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReportingAlerts />
      </TabPanel>

    </div>
  );
};

Alerts.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Alerts);