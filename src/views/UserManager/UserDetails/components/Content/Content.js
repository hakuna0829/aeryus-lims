import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import TestingHistory from './components/TestingHistory';
import WorkPlace from './components/WorkPlace';
import ContactTracing from './components/ContactTracing';
import PatientIntake from './components/PatientIntake';
import Testing from './components/Testing';
import * as qs from 'qs';
import Dependents from './components/Dependents';
import VisitTracker from './components/VisitTracker';
import SideBarInfo from 'views/UserManager/UserDetails/components/SideBarInfo';

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
  root: {
    paddingBottom: theme.spacing(12),
  },
  appBar: {
    backgroundColor: '#3F9DBA',
  },
  tabsIndicator: {
    backgroundColor: '#3F9DBA',
  },
  wrapper: {
    minWidth: 80,
    '& .MuiTouchRipple-root': {
      borderRight: 'solid #043B5D 1px',
      height: '60%',
      marginTop: 10,
    },
    '&:last-child .MuiTouchRipple-root': {
      borderRight: 'solid #043B5D 0px',
      height: '60%',
      marginTop: 10,
    },
    '&.Mui-selected .MuiTab-wrapper': {
      borderBottom: 'solid white 2px'
    }
  }
}));

const Content = (props) => {
  const { location, history, user, setUser, modules } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [value, setValue] = useState(0);
  const [isOnlyTechnician] = useState(!modules.some(m => m.name === 'UserManager') && modules.some(m => m.name === 'TestTechnician'));
  const [isOnlyManager] = useState(modules.some(m => m.name === 'UserManager') && !modules.some(m => m.name === 'TestTechnician'));

  const tab = qs.parse(location.search, { ignoreQueryPrefix: true }).tab;
  useEffect(() => {
    if (isOnlyTechnician) {
      history.push(`/user-details/${user._id}?tab=testing`);
      setValue(5);
      return;
    }
    if (isOnlyManager) {
      if (tab === 'testing') {
        history.push(`/user-details/${user._id}?tab=testing_history`);
        return;
      }
    }
    if (tab) {
      switch (tab) {
        case 'testing_history':
          setValue(1);
          break;
        case 'workplace_entry':
          setValue(2);
          break;
        case 'contact_tracing':
          setValue(3);
          break;
        case 'patient_intake':
          setValue(4);
          break;
        case 'testing':
          setValue(5);
          break;
        case 'visit_tracker':
          setValue(6);
          break;
        case 'dependents':
          setValue(7);
          break;

        default:
          history.push(`/user-details/${user._id}?tab=testing_history`);
          break;
      }
    } else {
      if (history.action === "POP") {
        history.goBack();
      } else {
        history.push(`/user-details/${user._id}?tab=testing_history`);
      }
    }
    // eslint-disable-next-line
  }, [tab]);

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 1:
        history.push(`/user-details/${user._id}?tab=testing_history`);
        break;
      case 2:
        history.push(`/user-details/${user._id}?tab=workplace_entry`);
        break;
      case 3:
        history.push(`/user-details/${user._id}?tab=contact_tracing`);
        break;
      case 4:
        history.push(`/user-details/${user._id}?tab=patient_intake`);
        break;
      case 5:
        history.push(`/user-details/${user._id}?tab=testing`);
        break;
      case 6:
        history.push(`/user-details/${user._id}?tab=visit_tracker`);
        break;
      case 7:
        history.push(`/user-details/${user._id}?tab=dependents`);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={classes.root}
    >
      <AppBar
        position="static"
        className={classes.appBar}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{ indicator: classes.tabsIndicator }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {/* to avoid react warng:  unmounted component && API's calling on first step */}
          <Tab label="" style={{ display: 'none' }} />
          <Tab label="TESTING HISTORY" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected, isOnlyTechnician && brandClasses.hideElement) }} />
          <Tab label="WORKPLACE ENTRY" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected, isOnlyTechnician && brandClasses.hideElement) }} />
          <Tab label="CONTACT TRACING" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected, isOnlyTechnician && brandClasses.hideElement) }} />
          <Tab label="PATIENT INTAKE" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected, isOnlyTechnician && brandClasses.hideElement) }} />
          <Tab label="TESTING" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected, isOnlyManager && brandClasses.hideElement) }} />
          <Tab label="VISIT TRACKER" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected, isOnlyManager && brandClasses.hideElement) }} />
          <Tab label="DEPENDENTS" classes={{ root: clsx(brandClasses.tabsSelected, isOnlyTechnician && brandClasses.hideElement) }} />
        </Tabs>
        <SideBarInfo user={user} />
      </AppBar>
      <TabPanel value={value} index={1}>
        <TestingHistory user={user} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <WorkPlace />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ContactTracing />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PatientIntake user={user} setUser={setUser} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Testing user={user} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <VisitTracker user={user} />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <Dependents user={user} />
      </TabPanel>
    </div>
  );
};

const mapStateToProps = state => ({
  modules: state.auth.modules
});

Content.propTypes = {
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(withRouter(Content));
