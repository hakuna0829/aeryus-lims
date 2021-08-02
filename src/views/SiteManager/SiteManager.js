import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import brandStyles from 'theme/brand';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
// import clsx from 'clsx';
import ClientManager from './ClientManager';
import AddLocation from './ClientManager/AddLocation';
// import LocationDetails from './LocationManager/LocationDetails';
import LocationDetailsNew from './ClientManager/LocationDetailsNew';
import DepartmentManager from './DepartmentManager';
import AddDepartment from './DepartmentManager/AddDepartment';
import DepartmentDetails from './DepartmentManager/DepartmentDetails';
import DepartmentStaff from './DepartmentManager/DepartmentStaff/DepartmentStaff';
import PopulationManager from './PopulationManager';
import AddPopulation from './PopulationManager/AddPopulation';
import PopulationDetails from './PopulationManager/PopulationDetails';
import PopulationUsers from './PopulationManager/PopulationUsers';

const useStyles = makeStyles(theme => ({
  root:{
    padding:'24px 0px',
  },
  appBar: {
    backgroundColor: '#3F9DBA',
    marginTop: theme.spacing(0),
  },
  tabsIndicator: {
    // backgroundColor: theme.palette.white,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 100,
      width: '100%',
      backgroundColor: theme.palette.white
    }
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`nav-tab-${index}`}
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      role="tabpanel"
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
  const { match, 
  //  history 
  } = props;

  const classes = useStyles();
  // const brandClasses = brandStyles();

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

  
  return (
    <div className={classes.root}>
      
      <TabPanel
        index={0}
        value={value}
      >
        {subTab === 'location-manager' &&
          <ClientManager />
        }
        {subTab === 'add-location' &&
          <AddLocation />
        }
        {subTab === 'location-details' &&
          <LocationDetailsNew />
        }
      </TabPanel>
      <TabPanel
        index={1}
        value={value}
      >
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
      <TabPanel
        index={2}
        value={value}
      >
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
