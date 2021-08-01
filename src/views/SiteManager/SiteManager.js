import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import clsx from 'clsx';
import LocationManager from './LocationManager';
import AddLocation from './LocationManager/AddLocation';
// import LocationDetails from './LocationManager/LocationDetails';
import LocationDetailsNew from './LocationManager/LocationDetailsNew';
import DepartmentManager from './DepartmentManager';
import AddDepartment from './DepartmentManager/AddDepartment';
import DepartmentDetails from './DepartmentManager/DepartmentDetails';
import DepartmentStaff from './DepartmentManager/DepartmentStaff/DepartmentStaff';
import PopulationManager from './PopulationManager';
import AddPopulation from './PopulationManager/AddPopulation';
import PopulationDetails from './PopulationManager/PopulationDetails';
import PopulationUsers from './PopulationManager/PopulationUsers';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: '#3F9DBA',
    marginTop: theme.spacing(0),
  },
  tabsIndicator: {
    // backgroundColor: theme.palette.white,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 100,
      width: "100%",
      backgroundColor: theme.palette.white
    }
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
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

// eslint-disable-next-line react/no-multi-comp
const SiteManager = (props) => {
  const { match, history } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [value, setValue] = useState(2);
  const [subTab, setSubTab] = useState('account-manager');

  useEffect(() => {
    const tab = match.params.tab;
    if (tab) {
      switch (tab) {
        case 'location-manager':
          setValue(0);
          setSubTab('location-manager');
          break;
        case 'add-location':
          setValue(0);
          setSubTab('add-location');
          break;
        case 'location-details':
          setValue(0);
          setSubTab('location-details');
          break;
        case 'department-manager':
          setValue(1);
          setSubTab('department-manager');
          break;
        case 'add-department':
          setValue(1);
          setSubTab('add-department');
          break;
        case 'department-details':
          setValue(1);
          setSubTab('department-details');
          break;
        case 'department-staff':
          setValue(1);
          setSubTab('department-staff');
          break;
        case 'population-manager':
          setValue(2);
          setSubTab('population-manager');
          break;
        case 'add-population':
          setValue(2);
          setSubTab('add-population');
          break;
        case 'population-details':
          setValue(2);
          setSubTab('population-details');
          break;
        case 'population-users':
          setValue(2);
          setSubTab('population-users');
          break;
        default:
          break;
      }
    }
  }, [match.params.tab]);

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        history.push('/site-manager/location-manager');
        break;
      case 1:
        history.push('/site-manager/department-manager');
        break;
      case 2:
        history.push('/site-manager/population-manager');
        break;
      default:
        break;
    }
  };

  return (
    <div className={classes.root}>
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
          <Tab label="SITES" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="DEPARTMENTS" classes={{ root: clsx(brandClasses.tabsWrapper, brandClasses.tabsSelected) }} />
          <Tab label="POPULATIONS" classes={{ root: brandClasses.tabsSelected }} />
          {/* to avoid react warng:  unmounted component && API's calling on first step */}
          <Tab label="" style={{ display: 'none' }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {subTab === 'location-manager' &&
          <LocationManager />
        }
        {subTab === 'add-location' &&
          <AddLocation />
        }
        {subTab === 'location-details' &&
          <LocationDetailsNew />
        }
      </TabPanel>
      <TabPanel value={value} index={1}>
        {subTab === 'department-manager' &&
          <DepartmentManager />
        }
        {subTab === 'add-department' &&
          <AddDepartment />
        }
        {subTab === 'department-details' &&
          <DepartmentDetails />
        }
        {subTab === 'department-staff' &&
          <DepartmentStaff />
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        {subTab === 'population-manager' &&
          <PopulationManager />
        }
        {subTab === 'add-population' &&
          <AddPopulation />
        }
        {subTab === 'population-details' &&
          <PopulationDetails />
        }
        {subTab === 'population-users' &&
          <PopulationUsers />
        }
      </TabPanel>
    </div>
  );
}

export default withRouter(SiteManager);
