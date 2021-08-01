import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import clsx from 'clsx';
import Compliance from './Compliance';
import Site from './Site';
import Lab from './Lab';
import User from './User';
import CustomReport from './CustomReport';
// import Inventory from './Inventory';

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
    marginTop: 0
  },
  tabsWrapper: {
    '& .MuiTouchRipple-root': {
      // borderRight: 'solid #043B5D 1px',
      height: '60%',
      marginTop: 10,
    },
    '&.Mui-selected .MuiTab-wrapper': {
      borderBottom: 'solid white 2px'
    }
  }
}));

const Reporting = (props) => {
  const { history } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [value, setValue] = useState(6);

  const tab = props.match.params.tab;

  useEffect(() => {
    console.log('Reporting tab:', tab);
    if (tab) {
      switch (tab) {
        case 'compliance':
          setValue(0);
          break;
        case 'site':
          setValue(1);
          break;
        case 'lab':
          setValue(2);
          break;
        case 'user':
          setValue(3);
          break;
        case 'inventory':
          setValue(4);
          break;
        case 'custom':
          setValue(5);
          break;

        default:
          setValue(0);
          break;
      }
    }
  }, [tab]);

  const handleChange = (event, newValue) => {
    // setValue(newValue);
    switch (newValue) {
      case 0:
        history.push('/reporting/compliance');
        break;
      case 1:
        history.push('/reporting/site');
        break;
      case 2:
        history.push('/reporting/lab');
        break;
      case 3:
        history.push('/reporting/user');
        break;
      case 4:
        history.push('/reporting/inventory');
        break;
      case 5:
        history.push('/reporting/custom');
        break;

      default:
        break;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        className={brandClasses.appBar}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{ indicator: brandClasses.tabsIndicator }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="COMPLIANCE" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="SITE STATISTICS" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="LAB MANAGER" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="USER MANAGER" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="INVENTORY MANAGER" classes={{ root: classes.tabsSelected }} />
          <Tab label="CUSTOM MANAGER" style={{display:'none'}} />
          {/* to avoid react warng:  unmounted component && API's calling on first step */}
          <Tab label="" style={{display:'none'}} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Compliance />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Site />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Lab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <User />
      </TabPanel>
      <TabPanel value={value} index={4}>
        {/* <Inventory /> */}
        Inventory manager
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CustomReport />
      </TabPanel>

    </div>
  );
};

Reporting.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Reporting);
