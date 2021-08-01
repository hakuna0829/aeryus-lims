import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LocationOverview from './Location';
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'react-router-dom';
import LocationDetails from './LocationDetails';
import AddLocation from './AddLocation';
import AddDepartment from './AddDepartment';
import DepartmentOverview from './Department';
import DepartmentDetails from './DepartmentDetails';
import DepartmentStaff from './DepartmentStaff';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: '#3F9DBA',
    marginTop: theme.spacing(2),
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

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            // component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const SiteOverview = (props) => {
    const { match, history, location } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
  const [subTab, setSubTab] = useState('account-manager');

  useEffect(() => {
    const tab = match.params.tab;
    if (tab) {
      switch (tab) {
        case 'location-manager':
          setValue(0);
          setSubTab('location-manager');
          break;
        case 'location-details':
          setValue(0);
          setSubTab('location-details');
          break;
        case 'add-location':
          setValue(0);
          setSubTab('add-location');
          break;
        case 'add-department':
          setValue(2);
          setSubTab('add-department');
          break;
        case 'department-manager':
          setValue(2);
          setSubTab('department-manager');
          break;
        case 'department-details':
          setValue(2);
          setSubTab('department-details');
          break;
        case 'department-staff':
          setValue(2);
          setSubTab('department-staff');
          break;
        default:
          break;
      }
    }
  }, [match.params.tab]);

    const handleChange = (event, newValue) => {
        //setValue(newValue);
        console.log(newValue)
        switch (newValue) {
        case 0:
          history.push('/control-center/location-manager');
          break;
        case 2:
          history.push('/control-center/department-manager');
          break;
        default:
          break;
      }
    };
    const VSeparator = () => <Divider orientation="vertical" flexItem style={{margin: 10, background:'#043B5D'}}/> ;
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    TabIndicatorProps={{ children: <div /> }}
                    classes={{
                        indicator: classes.tabsIndicator
                    }}
                >
                    <LinkTab label="LOCATION MANAGER" className={classes.tabTitle} {...a11yProps(0)} style={{marginRight: 10}}/>
                    <VSeparator/>
                    <LinkTab label="DEPARTMENT MANAGER" className={classes.tabTitle} {...a11yProps(1)} style={{marginLeft: 10}}/>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              {subTab === 'location-manager' &&
              <LocationOverview />
              }
              {subTab === 'add-location' && <AddLocation/> }
              {subTab === 'location-details' && location.state && <LocationDetails />
              }
            </TabPanel>
            <TabPanel value={value} index={2}>
              
              {subTab === 'department-manager' &&
                <DepartmentOverview />
              }
              {subTab === 'add-department' && <AddDepartment /> }
              {subTab === 'department-staff' && <DepartmentStaff /> }
              {subTab === 'department-details' && location.state && <DepartmentDetails /> }
            </TabPanel>
        </div>
    );
}

export default withRouter(SiteOverview);
