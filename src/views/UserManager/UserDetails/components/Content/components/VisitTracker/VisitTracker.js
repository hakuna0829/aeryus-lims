import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import Alert from '@material-ui/lab/Alert';
import VaccineTracker from './VaccineTracker';
import { withRouter } from 'react-router-dom';
import TestTracker from './TestTracker';
import { getUserTesting } from 'actions/api';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const VisitTracker = (props) => {
  const { user, getUserTesting, history, match } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [type, setType] = useState('');
  const [testing, setTesting] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const userId = match.params.id;

  useEffect(() => {
    (async () => {
      if (userId) {
        setFetchLoading(true);
        const res = await getUserTesting(userId);
        setFetchLoading(false);
        if (res.success) {
          if (res.data) {
            setTesting(res.data);
            setType(res.data.type);
          } else {
            setAlertMessage('Please make sure User completed Scheduling process and Checked-In from Appointment Manager module.');
          }
        }
      } else {
        setFetchLoading(false);
        setAlertMessage('User ID is missing in Params');
      }
    })();
    // eslint-disable-next-line
  }, [userId, history, getUserTesting]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={classes.root}>
      {fetchLoading
        ? <CircularProgress className={brandClasses.fetchProgressSpinner} />
        : testing
          ?
          <>
            {type === 'Vaccine'
              ?
              <VaccineTracker
                type={type}
                user={user}
                setTesting={setTesting}
                testing={testing}
              />
              :
              <TestTracker
                type={type}
                user={user}
                setTesting={setTesting}
                testing={testing}
              />
            }
          </>
          :
          <Alert severity="error">
            {alertMessage}
            <Button
              onClick={goBack}
            >
              {'Go Back'}
            </Button>
          </Alert>
      }
    </div>
  )
}

VisitTracker.propTypes = {
  location: PropTypes.object.isRequired,
  getUserTesting: PropTypes.func.isRequired,
}

export default connect(null, { getUserTesting })(withRouter(VisitTracker));