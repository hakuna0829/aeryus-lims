import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TestTracker from './TestTracker';
import SerologyTestPage from './Serology';
import PCRTestPage from './PCR';
// import ResultsTestPage from './ResultsManager/components/Results';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
        marginTop:0
    },
    content: {
        textAlign: 'center'
    },
    pageBar:{
        backgroundColor:'rgba(15,132,169,0.8)'
    },
    tabTitle:{
        color: '#FFFFFF',
        fontFamily: 'Montserrat',
        // fontSize: 18,
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '24px',
        // paddingTop: 34,
        // paddingBottom: 34,
    },
    tabPanel: {
        padding: '0 !important',
        // border:'solid 1px red',
        '& > div':{
            padding : '0 !important'
        }
    },
    tabsIndicator: {
        backgroundColor: '#3F9DBA',
    },
    tabsDivider:{
        borderRight:'solid 1px #043B5D'
    },
    wrapper: {
        minWidth:80,
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
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default function LabManager() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.pageBar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    classes={{ indicator: classes.tabsIndicator }}
                >
                    {/* <LinkTab label="ORDER MANAGER" className={classes.tabTitle} href="/" {...a11yProps(0)} />
                    <LinkTab label="SEROLOGY" className={classes.tabTitle} href="/" {...a11yProps(1)} />
                    <LinkTab label="PCR" className={classes.tabTitle} href="/" {...a11yProps(2)} />
                    <LinkTab label="RESULTS MANAGER" className={classes.tabTitle} href="/" {...a11yProps(3)} /> */}
                    <Tab label="ORDER MANAGER" classes={{ root: classes.wrapper }} />
                    <Tab label="SEROLOGY" classes={{ root: classes.wrapper }} />
                    <Tab label="PCR" classes={{ root: classes.wrapper }} />
                    <Tab label="RESULTS MANAGER" classes={{ root: classes.wrapper }} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} className={classes.tabPanel} index={0}>
                <TestTracker />
            </TabPanel>
            <TabPanel value={value} className={classes.tabPanel} index={1}>
                 <SerologyTestPage />
            </TabPanel>
            <TabPanel value={value} className={classes.tabPanel} index={2}>
                <PCRTestPage />
            </TabPanel>
            <TabPanel value={value} className={classes.tabPanel} index={3}>
                {/* <ResultsTestPage /> */}
            </TabPanel>
        </div>
    );
}