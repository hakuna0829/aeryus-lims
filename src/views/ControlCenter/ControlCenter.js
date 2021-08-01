import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { AppBar, 
  Tabs, Tab 
} from '@material-ui/core';
import clsx from 'clsx';
import AccountManager from './AccountManager';
import RoleManager from './RoleManager';
import AddRoleModules from './RoleManager/AddRoleModules';
import AddAccount from './AccountManager/AddAccount';
import AccountDetails from './AccountManager/AccountDetails';
import EditRoleModules from './RoleManager/EditRoleModules';
import SystemSetting from './SystemSetting/SystemSetting';
import FormSetting from './FormSetting/FormSetting';
import AlertSetting from './AlertSetting/AlertSetting';
import AuditHistory from './AuditHistory';
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
    backgroundColor: '#3F9DBA',
    marginTop: 0,
  },
}));

const ControlCenter = (props) => {
  const { match, history } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [value, setValue] = useState(0);
  const [subTab, setSubTab] = useState('account-manager');

  useEffect(() => {
    const tab = match.params.tab;
    console.log('Selected tab: ' + tab);
    if (tab) {
      switch (tab) {
        case 'account-manager':
          setValue(1);
          setSubTab('account-manager');
          break;
        case 'add-account':
          setValue(1);
          setSubTab('add-account');
          break;
        case 'account-details':
          setValue(1);
          setSubTab('account-details');
          break;
        case 'role-manager':
          setValue(2);
          setSubTab('role-manager');
          break;
        case 'add-role':
          setValue(2);
          setSubTab('add-role');
          break;
        case 'edit-role':
          setValue(2);
          setSubTab('edit-role');
          break;
        case 'alerts':
          setValue(3);
          break;
        case 'system-setting':
          setValue(4);
          break;
        case 'form-setting':
          setValue(5);
          break;
        case 'audit-history':
          setValue(6);
          break;
        default:
          break;
      }
    }
  }, [match.params.tab]);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    switch (newValue) {
      case 1:
        history.push('/control-center/account-manager');
        break;
      case 2:
        history.push('/control-center/role-manager');
        break;
      case 3:
        history.push('/control-center/alerts');
        break;
      case 4:
        history.push('/control-center/system-setting');
        break;
      case 5:
        history.push('/control-center/form-setting');
        break;
      case 6:
        history.push('/control-center/audit-history');
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
          classes={{ indicator: brandClasses.tabsIndicator }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {/* to avoid react warng:  unmounted component && API's calling on first step */}
          <Tab label="" style={{ display: 'none' }} />
          <Tab label="ACCOUNT MANAGER" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="ROLE MANAGER" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="ALERT SETTINGS" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="SYSTEM SETTINGS" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="FORM SETTINGS" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="AUDIT HISTORY" classes={{ root: brandClasses.tabsSelected }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={1}>
        {subTab === 'account-manager' &&
          <AccountManager />
        }
        {subTab === 'add-account' &&
          <AddAccount />
        }
        {subTab === 'account-details' &&
          <AccountDetails />
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        {subTab === 'role-manager' &&
          <RoleManager />
        }
        {subTab === 'add-role' &&
          <AddRoleModules />
        }
        {subTab === 'edit-role' &&
          <EditRoleModules />
        }
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AlertSetting />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SystemSetting />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <FormSetting />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <AuditHistory />
      </TabPanel>
    </div>
  );
};

ControlCenter.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ControlCenter);
