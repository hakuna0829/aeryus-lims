import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import * as qs from 'qs';
import Alert from '@material-ui/lab/Alert';
import { AppBar, Tabs, Tab, Button, CircularProgress } from '@material-ui/core';
import UserDetails from './UserDetails';
import Sessions from './Sessions';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { getAccount } from 'actions/api';
import NotificationSettings from './NotificationSettings';

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
    backgroundColor: '#043B5D',
  },
  tabsIndicator: {
    backgroundColor: '#043B5D',
  },
  wrapper: {
    '& .MuiTouchRipple-root': {
      borderRight: 'solid #fff 1px',
      height: '60%',
      marginTop: 10,
    },
    '&:last-child .MuiTouchRipple-root': {
      borderRight: 'solid #fff 0px',
      height: '60%',
      marginTop: 10,
    },
    '&.Mui-selected .MuiTab-wrapper': {
      borderBottom: 'solid white 2px'
    }
  },
  alert: {
    marginTop: theme.spacing(2),
  }
}));

const AccountDetails = (props) => {
  const { showFailedDialog, showErrorDialog, location, history, selftAccount, isSelfDetails } = props;

  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  let accountId = qs.parse(location.search, { ignoreQueryPrefix: true }).account_id;

  useEffect(() => {
    if (isSelfDetails) {
      // eslint-disable-next-line
      accountId = selftAccount._id;
      setValue(2);
    }
    console.log('AccountDetails useEffect id:', accountId);
    if (accountId) {
      setLoading(true);
      getAccount(accountId).then(res => {
        setLoading(false);
        if (res.data.success) {
          setAccount(res.data.data);
        } else {
          showFailedDialog(res);
        }
      }).catch(error => {
        setLoading(false);
        showErrorDialog(error);
      });
    } else {
      setLoading(false);
    }
  }, [accountId, history, showFailedDialog, showErrorDialog, isSelfDetails]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const goBack = () => {
    history.goBack();
  }

  return (
    <div>
      {loading
        ? <CircularProgress />
        : account
          ? <div>
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
                <Tab label="USER DETAIL" classes={{ root: classes.wrapper }} />
                <Tab label="SESSIONS" classes={{ root: classes.wrapper }} />
                <Tab label="NOTIFICATIONS" classes={{ root: classes.wrapper }} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <UserDetails accountData={account} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Sessions account_id={account._id} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <NotificationSettings account_id={account._id} />
            </TabPanel>
          </div>
          : <div className={classes.alert}>
            <Alert severity="error">
              {'Unknown Account ID passed as params. '}
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

const mapStateToProps = state => ({
  selftAccount: state.auth.account
});

AccountDetails.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { showFailedDialog, showErrorDialog })(withRouter(AccountDetails));