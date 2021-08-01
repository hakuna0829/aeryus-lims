import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import { AppBar, Tabs, Tab, Button, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import GeneratePairingLabel from './GeneratePairingLabel';
import PatientApproval from './PatientApproval';
import SpecimenCollection from './SpecimenCollection';
import CheckList from './CheckList';
import { getUserTesting, updateUserTesting } from 'actions/api';

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
    backgroundColor: theme.palette.blueDark,
  },
  tabsIndicator: {
    backgroundColor: theme.palette.blueDark,
  },
}));

const Testing = (props) => {
  const { history, user, getUserTesting, updateUserTesting } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [tab, setTab] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [testing, setTesting] = useState(null);
  const [completedTab, setCompletedTab] = useState(0);
  const [alertMessage, setAlertMessage] = useState(0);
  const [generateStep, setGenerateStep] = useState(0);

  const userId = props.match.params.id;

  useEffect(() => {
    console.log('Testing useEffect id:', userId);
    if (userId) {
      async function fetchData() {
        const res = await getUserTesting(userId);
        setFetchLoading(false);
        if (res.success) {
          if (res.data) {
            setTesting(res.data);
            // set completed tab
            if (res.data.testkit_front && res.data.testkit_back) {
              setCompletedTab(3);
            } else if (res.data.patient_signature && res.data.medical_technician) {
              setCompletedTab(2);
            } else if (res.data.paired) {
              setCompletedTab(1);
            }
          } else {
            setAlertMessage('Please make sure User completed Scheduling process and Submitted from Appointment Manager module.');
          }
        }
      }
      fetchData();
    } else {
      setFetchLoading(false);
      setAlertMessage('User ID is missing in Params');
    }
  }, [userId, history, getUserTesting]);

  const goBack = () => {
    history.goBack();
  }

  const nextTab = () => {
    if (tab === 3) {
      history.push('/appointment-manager/monthly');
    } else if (tab === 0 && generateStep < 2) {
      setGenerateStep(generateStep => generateStep + 1);
    } else {
      setTab(tab => tab + 1);
    }
  };

  const previousTab = () => {
    if (tab === 0 && generateStep >= 0) {
      setGenerateStep(generateStep => generateStep - 1);
    } else {
      setTab(tab => tab - 1);
    }
  };

  const handleChange = (event, newValue) => {
    if (newValue <= completedTab) {
      setTab(newValue);
    }
  };

  const updateTesting = async (body) => {
    setSaveLoading(true);
    console.log('update body', body);
    const res = await updateUserTesting(testing._id, body);
    setSaveLoading(false);
    if (res.success) {
      setTesting(testing => ({
        ...testing,
        ...body
      }));
      nextTab();
      setCompletedTab(completedTab => completedTab + 1);
    }
  };

  return (
    <div>
      {fetchLoading
        ? <CircularProgress />
        : testing
          ?
          <>
            <AppBar
              position="static"
              className={classes.appBar}
            >
              <Tabs
                value={tab}
                onChange={handleChange}
                classes={{ indicator: classes.tabsIndicator }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="GENERATE PAIRING LABEL" classes={{ root: brandClasses.subTabWrapper }} />
                <Tab label="PATIENT APPROVAL" classes={{ root: brandClasses.subTabWrapper }} />
                <Tab label="SPECIMEN COLLECTION" classes={{ root: brandClasses.subTabWrapper }} />
                <Tab label="CHECK LIST" classes={{ root: brandClasses.subTabWrapper }} />
              </Tabs>
            </AppBar>
            <TabPanel value={tab} index={0}>
              <GeneratePairingLabel
                nextTab={nextTab}
                previousTab={previousTab}
                generateStep={generateStep}
                testing={testing}
                setTesting={setTesting}
                user={user}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <PatientApproval
                nextTab={nextTab}
                previousTab={previousTab}
                saveLoading={saveLoading}
                updateTesting={updateTesting}
                testing={testing}
                setTesting={setTesting}
              />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <SpecimenCollection
                nextTab={nextTab}
                previousTab={previousTab}
                saveLoading={saveLoading}
                updateTesting={updateTesting}
                testing={testing}
                user={user}
              />
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <CheckList
                nextTab={nextTab}
                previousTab={previousTab}
                saveLoading={saveLoading}
                updateTesting={updateTesting}
              />
            </TabPanel>
          </>
          : <div className={classes.alert}>
            <Alert severity="error">
              {alertMessage}
              <Button
                onClick={goBack}
              >
                {'Go Back'}
              </Button>
            </Alert>
          </div>
      }
    </div>
  );
};

Testing.propTypes = {
  getUserTesting: PropTypes.func.isRequired,
  updateUserTesting: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(null, { getUserTesting, updateUserTesting })(withRouter(Testing));
