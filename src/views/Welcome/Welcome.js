import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import Step1 from './Step1';
import Step2 from './Step2';
// import Step3 from './Step3';
import Step4 from './Step4';
import AddLocation from 'views/SiteManager/LocationManager/AddLocation';
import AddDepartment from 'views/SiteManager/DepartmentManager/AddDepartment';

const Welcome = (props) => {
  const { showErrorDialog, showFailedDialog, history, match } = props;

  const [step, setStep] = useState(1);

  useEffect(() => {
    const step = match.params.step;
    if (step) {
      switch (step) {
        case 'welcome':
          setStep(1);
          break;
        case 'add-company':
          setStep(2);
          break;
        case 'add-location':
          setStep(3);
          break;
        case 'add-department':
          setStep(4);
          break;
        case 'bulk-upload-users':
          setStep(5);
          break;
        default:
          break;
      }
    }
  }, [match.params.step]);

  const updateStep = () => {
    if (step === 5) {
      history.push('/dashboard');
    } else if (step === 4) {
      history.push('/welcome/bulk-upload-users');
    } else if (step === 3) {
      history.push('/welcome/add-department');
    } else if (step === 2) {
      history.push('/welcome/add-location');
    } else if (step === 1) {
      history.push('/welcome/add-company');
    } else {
      history.push('/welcome');
    }
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: '90vh' }}
      >
        {step === 1 && (
          <Step1 updateStep={updateStep} />
        )}

        {step === 2 && (
          <Step2 showErrorDialog={showErrorDialog} showFailedDialog={showFailedDialog} updateStep={updateStep} />
        )}

        {step === 3 && (
          <AddLocation isWelcomePage={true} updateStep={updateStep} />
        )}

        {step === 4 && (
          <AddDepartment isWelcomePage={true} updateStep={updateStep} />
        )}

        {step === 5 && (
          <Step4 showErrorDialog={showErrorDialog} showFailedDialog={showFailedDialog} updateStep={updateStep} />
        )}
      </Grid>
    </div>
  );
};

Welcome.propTypes = {
  showErrorDialog: PropTypes.func.isRequired,
  showFailedDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(null, { showFailedDialog, showErrorDialog })(withRouter(Welcome));