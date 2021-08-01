import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, useParams } from 'react-router-dom';
import { Grid, CircularProgress, AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Helmet from 'react-helmet';
import decodeUriComponent from 'decode-uri-component';
import {
  validateLocationDepartment,
  fetchEndpointDetails,
  findTestdAcUser,
  resendOtp,
  verifyCheckOtp,
  getTestdAcUser,
  updateTestdAcUser,
  createTestdAcUser,
  getTestdAcPatient,
  updateTestdAcPatient,
  createTestdAcDependent
} from 'actions/api';
import * as appConstants from 'constants/appConstants';
import Authenticate from './Authenticate';
import PhoneVerify from './PhoneVerify';
import GotIt from './GotIt';
import Welcome from './Welcome';
import {
  Question1,
  Question2,
  Question3,
  Question4,
  Question5,
  Question6,
  Question7,
  Question8,
  Question9,
  Question10
  // Question11,
  // Question12,
  // Question13,
  // Question14,
} from './Questions';
import {
  // Insurance,
  InsuranceFrontPhoto,
  // InsuranceBackPhoto,
  ReviewInsurance,
  Inputs
} from './Insurance';
import {
  // PersonalID,
  PersonalIDFrontPhoto,
  // PersonalIDBackPhoto,
  ReviewPersonalID
} from './PersonalID';
import { ScheduleTest, ScheduleBooking, Schedule } from './Schedule';
import AddDependent from './AddDependent';

const testdAcToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDMzNTQ0MDZ9.31BgsjfTAtph4s9k7cTs4DaK78qDMSwg8MndggSUbrk';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  header: {
    backgroundColor: '#0F84A9',
    boxShadow: 'none',
    height: 65,
    alignItems: 'center',
    [theme.breakpoints.up(415)]: {
      height: 80
    }
  },
  footer: {
    backgroundColor: '#0F84A9',
    top: 'auto',
    bottom: 0,
    height: 32,
    [theme.breakpoints.up(415)]: {
      height: 48
    }
  },
  toolbar: {
    justifyContent: 'center'
  },
  spinner: {
    color: '#0F84A9'
  },
  error: {
    paddingTop: 20,
    zIndex: 10
  },
  alertBody: {
    backgroundColor: 'rgb(218 241 255)'
  },
}));

const TestdAppointmentCalendar = props => {
  const {
    location,
    history,
    validateLocationDepartment,
    fetchEndpointDetails,
    findTestdAcUser,
    resendOtp,
    verifyCheckOtp,
    // getTestdAcUser,
    createTestdAcUser,
    updateTestdAcUser,
    // getTestdAcPatient,
    updateTestdAcPatient,
    createTestdAcDependent
  } = props;

  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [displayError, setDisplayError] = useState(null);
  const [isSetInsurance, setInsurance] = useState(null);

  const { step, endpoint } = useParams();

  const id = new URLSearchParams(location.search).get('id');
  const question_id = new URLSearchParams(location.search).get('question_id');
  const insurance_id = new URLSearchParams(location.search).get('insurance_id');
  const personal_id = new URLSearchParams(location.search).get('personal_id');
  const schedule_id = new URLSearchParams(location.search).get('schedule_id');

  useEffect(() => {
    console.log('TestdAppointmentCalendar useEffect step:', step, ', endpoint:', endpoint);

    if (endpoint) {
      clearErrors();
      (async () => {
        let res = await fetchEndpointDetails(testdAcToken, {
          endpoint: decodeUriComponent(endpoint)
        });
        setLoading(false);
        if (res.success) {
          localStorage.setItem(appConstants.TESTD_AC_ID, res.data.populationsettings_id);
          localStorage.setItem(appConstants.TESTD_AC_LOCATION_INFO, JSON.stringify(res.data));
          setLocationData(res.data);
        } else {
          setDisplayError('Something went wrong. Please contact Administrator');
        }
      })();
      return;
    }

    if (isStepValid(step)) {
      if (step === 'authenticate') {
        clearErrors();
        if (id && id !== 'null') {
          (async () => {
            let res = await validateLocationDepartment(testdAcToken, {
              department_id: id
            });
            setLoading(false);
            if (res.success) {
              localStorage.setItem(appConstants.TESTD_AC_ID, id);
              localStorage.setItem(
                appConstants.TESTD_AC_LOCATION_INFO,
                JSON.stringify(res.data)
              );
              setLocationData(res.data);
            } else {
              setDisplayError(
                'Something went wrong. Please contact Administrator'
              );
            }
          })();
        } else {
          setLoading(false);
          setDisplayError('ID incorrect. Please contact Administrator');
        }
      }

      if (step === 'phone-verify') {
        clearErrors();
        if (!localStorage.getItem(appConstants.TESTD_AC_USER_DATA)) {
          history.push(
            `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        }
      }

      if (step === 'got_it') {
        clearErrors();
        if (!localStorage.getItem(appConstants.TESTD_AC_USER_DATA)) {
          history.push(
            `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        }
      }

      if (step === 'welcome') {
        clearErrors();
        if (!localStorage.getItem(appConstants.TESTD_AC_LOCATION_INFO)) {
          history.push(
            `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        }
      }

      if (step === 'add-dependent') {
        clearErrors();
        if (
          !localStorage.getItem(appConstants.TESTD_AC_LOCATION_INFO) ||
          !localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
        ) {
          history.push(
            `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        } else {
          setUser(
            JSON.parse(
              localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
            )
          );
          setInsurance(
            localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
              ? localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
              : null
          );
        }
      }

      if (step === 'question') {
        clearErrors();
        if (
          !localStorage.getItem(appConstants.TESTD_AC_LOCATION_INFO) ||
          !localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
        ) {
          history.push(
            `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        } else {
          setUser(
            JSON.parse(
              localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
            )
          );
          setInsurance(
            localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
              ? localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
              : null
          );
          console.log(
            'calendar ',
            localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
          );
          if (!question_id)
            history.push(
              `/testd-appointment-calendar/question?id=${localStorage.getItem(
                appConstants.TESTD_AC_ID
              )}&question_id=1`
            );
        }
      }

      if (step === 'insurance') {
        clearErrors();
        let localPatient = localStorage.getItem(
          appConstants.TESTD_AC_PATIENT_DATA
        );
        if (!localPatient || localPatient === 'null') {
          history.push(
            `/testd-appointment-calendar/question?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        } else {
          setUser(
            JSON.parse(
              localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
            )
          );
          setPatient(
            JSON.parse(localStorage.getItem(appConstants.TESTD_AC_PATIENT_DATA))
          );
          if (!insurance_id)
            history.push(
              `/testd-appointment-calendar/insurance?id=${localStorage.getItem(
                appConstants.TESTD_AC_ID
              )}&insurance_id=1`
            );
        }
      }

      if (step === 'personal') {
        clearErrors();
        if (!localStorage.getItem(appConstants.TESTD_AC_USER_DATA)) {
          history.push(
            `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
              appConstants.TESTD_AC_ID
            )}`
          );
        } else {
          setUser(
            JSON.parse(
              localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
            )
          );
          if (!personal_id)
            history.push(
              `/testd-appointment-calendar/personal?id=${localStorage.getItem(
                appConstants.TESTD_AC_ID
              )}&personal_id=1`
            );
        }
      }
    } else {
      history.push(
        `/testd-appointment-calendar/authenticate?id=${localStorage.getItem(
          appConstants.TESTD_AC_ID
        )}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (patient)
      localStorage.setItem(
        appConstants.TESTD_AC_PATIENT_DATA,
        JSON.stringify(patient)
      );
  }, [patient]);

  useEffect(() => {
    if (user)
      localStorage.setItem(
        appConstants.TESTD_AC_USER_DATA,
        JSON.stringify(user)
      );
  }, [user]);

  const isStepValid = step => {
    if ((step === 'phone-verify' || step === 'got_it') && localStorage.getItem(appConstants.TESTD_AC_USER_DATA)) {
      setUser(JSON.parse(localStorage.getItem(appConstants.TESTD_AC_USER_DATA)));
      return true;
    } else if (
      step === 'authenticate' ||
      step === 'phone-verify' ||
      step === 'welcome' ||
      step === 'add-dependent' ||
      step === 'question' ||
      step === 'insurance' ||
      step === 'personal' ||
      step === 'got_it'
    ) {
      return true;
    } else {
      return false;
    }
  };

  const clearErrors = () => {
    setDisplayError(null);
  };

  const handleAuthenticateSubmit = async body => {
    clearErrors();
    setSubmitLoading(true);
    let res = await findTestdAcUser(testdAcToken, body);
    setSubmitLoading(false);
    if (res.success) {
      let locationInfo = JSON.parse(
        localStorage.getItem(appConstants.TESTD_AC_LOCATION_INFO)
      );
      if (res.data) {
        let user = {
          ...res.data,
          location_id: locationInfo.location_id,
          client_id: locationInfo.client_id,
          department_id: locationInfo.department_id,
          populationsettings_id: locationInfo.populationsettings_id,
          population_type: locationInfo.population_type
        };
        console.log(user, '-0-----------------user')
        setUser(user);
        localStorage.setItem(
          appConstants.TESTD_AC_USER_DATA,
          JSON.stringify(user)
        );
        localStorage.setItem(appConstants.TESTD_AC_USER_ID, res.data._id);
        if (res.message.includes('OTP')) {
          history.push(`/testd-appointment-calendar/phone-verify`);
        } else {
          history.push(`/testd-appointment-calendar/got_it`);
        }
      } else {
        let user = {
          location_id: locationInfo.location_id,
          client_id: locationInfo.client_id,
          department_id: locationInfo.department_id,
          populationsettings_id: locationInfo.populationsettings_id,
          population_type: locationInfo.population_type,
          email: body.email,
          phone: body.phone
        };
        setUser(user);
        localStorage.setItem(
          appConstants.TESTD_AC_USER_DATA,
          JSON.stringify(user)
        );
        if (res.message.includes('OTP')) {
          history.push(`/testd-appointment-calendar/phone-verify`);
        } else {
          history.push(`/testd-appointment-calendar/welcome`);
        }
      }
    } else {
      setDisplayError('Something went wrong. Please contact Adminstrator');
    }
  };

  const handlePhoneVerifySubmit = async body => {
    clearErrors();
    if (body.code.length < 6) {
      setDisplayError('Please input 6 digits code sent to your phone...');
    } else {
      setSubmitLoading(true);
      let res = await verifyCheckOtp(testdAcToken, body);
      setSubmitLoading(false);
      if (res.success) {
        let user = JSON.parse(
          localStorage.getItem(appConstants.TESTD_AC_USER_DATA)
        );
        user.phone_verified = true;
        setUser(user);
        localStorage.setItem(
          appConstants.TESTD_AC_USER_DATA,
          JSON.stringify(user)
        );
        history.push(`/testd-appointment-calendar/welcome`);
      } else {
        setDisplayError('Something went wrong. Please contact Adminstrator');
      }
    }
  };

  const handeResendOtp = async () => {
    clearErrors();
    let body = {
      phone: user.phone
    };
    setSubmitLoading(true);
    let res = await resendOtp(testdAcToken, body);
    setSubmitLoading(false);
    if (res.success) {
    }
  };

  const handleWelcomeSubmit = async accepted => {
    if (!accepted) {
      setDisplayError('Please accept this terms and conditions...');
    } else {
      const new_question_id = question_id ? question_id / 1 + 1 : 1;
      history.push(
        `/testd-appointment-calendar/question?question_id=` + new_question_id
      );
    }
  };

  const handleGotItSubmit = async body => {
    history.push(`/testd-appointment-calendar/welcome`);
  };

  const handleAddDependent = body => {
    history.push(`/testd-appointment-calendar/add-dependent`);
  };

  const handleDependentBack = () => {
    const new_question_id = question_id ? question_id / 1 - 1 : 8;
    history.push(`/testd-appointment-calendar/question?question_id=${new_question_id}`);
  };

  const handleDependentSubmit = async (data) => {
    setSubmitLoading(true);
    let res = await createTestdAcDependent(testdAcToken, data);
    setSubmitLoading(false);
    if (res.success) {
      if (data.next) {
        const new_question_id = question_id ? question_id / 1 + 1 : 9;
        history.push(`/testd-appointment-calendar/question?question_id=${new_question_id}`);
      }
    }
  };

  const handleQuestionsSubmit = async data => {
    const new_question_id = question_id / 1 + 1;
    let questionStep = parseInt(question_id);
    setDisplayError('');
    if (questionStep <= 5) {
      // screening questions
      let questions =
        JSON.parse(
          localStorage.getItem(appConstants.TESTD_AC_QUESTIONS_DATA)
        ) || [];
      data.forEach(d => {
        let index = questions.findIndex(q => q.question === d.label);
        if (index >= 0)
          questions[index].value =
            d.checked === true ? 'Yes' : d.checked === false ? 'No' : d.checked;
        else
          questions.push({
            question: d.label,
            value:
              d.checked === true
                ? 'Yes'
                : d.checked === false
                  ? 'No'
                  : d.checked
          });
      });
      localStorage.setItem(
        appConstants.TESTD_AC_QUESTIONS_DATA,
        JSON.stringify(questions)
      );
      history.push(
        `/testd-appointment-calendar/question?question_id=${new_question_id}`
      );
    } else if (questionStep >= 6 && questionStep <= 8) {
      // User details
      if (data['zip_code'] && questionStep === 7)
        if (data['zip_code'].length < 5) {
          setDisplayError('Invalid Zip code');
          return;
        }
      setUser(data);
      if (questionStep === 8) {
        saveUser(new_question_id, data);
      } else {
        history.push(
          `/testd-appointment-calendar/question?question_id=${new_question_id}`
        );
      }
    } else if (questionStep === 9) {
      localStorage.setItem(appConstants.TESTD_AC_HAVE_INSURANCE, data);
      // data === 'true' ?
      // history.push(`/testd-appointment-calendar/insurance?insurance_id=1`):
      // history.push(`/testd-appointment-calendar/question?question_id=${new_question_id}`);
      // Insurance
      // let insurance = data.find(d => d.checked);
      // localStorage.setItem(appConstants.TESTD_AC_HAVE_INSURANCE, insurance ? insurance.label === 'YES' ? 'true' : 'false' : 'false');
      // localStorage.setItem(appConstants.TESTD_AC_HAVE_INSURANCE, data);
      let body = {
        covid_19_screening: JSON.parse(
          localStorage.getItem(appConstants.TESTD_AC_QUESTIONS_DATA)
        )
      };
      saveUserHaveInsuranceField(data);
      savePatient(body, new_question_id, data);
    } else if (questionStep === 10) {
      // signature
      if (data) {
        setUser(user => ({
          ...user,
          ...data
        }));
      }
      if (localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE) === 'true')
        history.push(`/testd-appointment-calendar/insurance?insurance_id=1`);
      else history.push(`/testd-appointment-calendar/personal?personal_id=1`);
    } else {
      history.push(
        `/testd-appointment-calendar/question?question_id=${new_question_id}`
      );
    }
  };

  const handleInsuranceSubmit = async data => {
    console.log('data', data);
    if (data) {
      let body = {
        insurance: { ...patient.insurance, ...data }
      };
      setPatient(patient => ({
        ...patient,
        ...body
      }));
    }
    const new_insurance_id = insurance_id / 1 + 1;
    if (new_insurance_id <= 3) {
      history.push(
        `/testd-appointment-calendar/insurance?insurance_id=${new_insurance_id}`
      );
    } else {
      history.push(`/testd-appointment-calendar/personal?personal_id=1`);
    }
  };

  const handlePersonalSubmit = async data => {
    console.log('data', data);
    if (data) {
      setUser(user => ({
        ...user,
        ...data
      }));
    }
    const new_personal_id = personal_id / 1 + 1;
    if (new_personal_id <= 2) {
      history.push(
        `/testd-appointment-calendar/personal?personal_id=${new_personal_id}`
      );
    } else {
      history.push(
        `/schedule-appointment/${user._id}?isTestdAcPage=true`
      );
    }
  };

  const handleScheduleSubmit = async data => {
    console.log('data', data);
    const new_schedule_id = schedule_id / 1 + 1;
    if (new_schedule_id < 4) {
      history.push(
        `/testd-appointment-calendar/schedule?schedule_id=${new_schedule_id}`
      );
    } else {
      // history.push(`/testd-appointment-calendar/schedule?user_id=${user_id}&schedule_id=1`);
    }
  };

  const backTab = id => {
    if (id === 'question') {
      // question id
      const new_question_id = question_id ? question_id / 1 - 1 : 1;
      // set user id
      setUser(
        JSON.parse(localStorage.getItem(appConstants.TESTD_AC_USER_DATA))
      );
      setInsurance(
        localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
          ? localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
          : null
      );
      console.log(
        'backtab ',
        localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE)
      );
      question_id / 1 > 1
        ? history.push(
          `/testd-appointment-calendar/question?question_id=${new_question_id}`
        )
        : history.push(
          `/testd-appointment-calendar/welcome?id=${localStorage.getItem(
            appConstants.TESTD_AC_ID
          )}`
        );
    } else if (id === 'insurance') {
      const new_insurance_id = insurance_id ? insurance_id / 1 - 1 : 1;
      new_insurance_id > 0
        ? history.push(
          `/testd-appointment-calendar/insurance?insurance_id=${new_insurance_id}`
        )
        : isSetInsurance === 'true'
          ? history.push(`/testd-appointment-calendar/question?question_id=9`)
          : history.push(`/testd-appointment-calendar/question?question_id=10`);
    } else if (id === 'personal') {
      const new_personal_id = personal_id ? personal_id / 1 - 1 : 1;
      if (new_personal_id > 0)
        history.push(
          `/testd-appointment-calendar/personal?personal_id=${new_personal_id}`
        );
      else {
        if (
          localStorage.getItem(appConstants.TESTD_AC_HAVE_INSURANCE) === 'true'
        )
          history.push(`/testd-appointment-calendar/insurance?insurance_id=3`);
        else
          history.push(`/testd-appointment-calendar/question?question_id=10`);
      }
    } else if (id === 'schedule') {
      const new_schedule_id = schedule_id ? schedule_id / 1 - 1 : 1;
      new_schedule_id > 0
        ? history.push(
          `/testd-appointment-calendar/schedule?schedule_id=${new_schedule_id}`
        )
        : history.push(`/testd-appointment-calendar/personal?personal_id=4`);
    } else {
      history.push(
        `/testd-appointment-calendar/${id}?id=${localStorage.getItem(
          appConstants.TESTD_AC_ID
        )}`
      );
    }
  };

  const saveUser = async (new_question_id, data) => {
    if (user._id) {
      setSubmitLoading(true);
      let res = await updateTestdAcUser(testdAcToken, user._id, data);
      setSubmitLoading(false);
      if (res.success) {
        setUser(res.data);
        localStorage.setItem(appConstants.TESTD_AC_USER_ID, res.data._id);
        if (data.addDependent)
          history.push(`/testd-appointment-calendar/add-dependent`);
        else
          history.push(`/testd-appointment-calendar/question?question_id=${new_question_id}`);
      }
    } else {
      setSubmitLoading(true);
      let res = await createTestdAcUser(testdAcToken, data);
      setSubmitLoading(false);
      if (res.success) {
        setUser(res.data);
        localStorage.setItem(appConstants.TESTD_AC_USER_ID, res.data._id);
        if (data.addDependent)
          history.push(`/testd-appointment-calendar/add-dependent`);
        else
          history.push(`/testd-appointment-calendar/question?question_id=${new_question_id}`);
      }
    }
  };

  const saveUserHaveInsuranceField = async data => {
    let res = await updateTestdAcUser(testdAcToken, user._id, {
      have_insurance: data === 'true'
    });
    if (res.success) setUser(res.data);
  };

  const savePatient = async (body, new_question_id, data) => {
    setSubmitLoading(true);
    const res = await updateTestdAcPatient(testdAcToken, user._id, body);
    setSubmitLoading(false);
    if (res.success) {
      body['_id'] = res.data;
      setPatient(patient => ({
        ...patient,
        ...body
      }));
      data === 'true'
        ? history.push(`/testd-appointment-calendar/insurance?insurance_id=1`)
        : history.push(
          `/testd-appointment-calendar/question?question_id=${new_question_id}`
        );
    }
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>
          {locationData
            ? `${locationData.location_name} | Check In`
            : 'TESTD Dashboard'}
        </title>
      </Helmet>

      {!endpoint && step !== 'authenticate' && step !== 'phone-verify' && step !== 'got_it' && (
        <AppBar position="static" className={classes.header}>
          <Toolbar className={classes.toolbar}>
            <img
              src="/images/svg/Testd_ID_logo.svg"
              alt="Testd_logo"
              style={{ height: 50, marginTop: 10 }}
            />
          </Toolbar>
        </AppBar>
      )}

      <Grid container direction="column" justify="center" alignItems="center">
        <div className={classes.error}>
          {displayError ? (
            <Alert
              severity="error"
              className={classes.alertBody}
              onClose={() => {
                closeErrorMessage();
              }}>
              {displayError}
            </Alert>
          ) : null}
        </div>

        {(step === 'authenticate' || endpoint) &&
          (!locationData ? (
            loading && <CircularProgress className={classes.spinner} />
          ) : (
              <Authenticate
                locationData={locationData}
                handleAuthenticateSubmit={handleAuthenticateSubmit}
                submitLoading={submitLoading}
                setDisplayError={setDisplayError}
              />
            ))}

        {step === 'phone-verify' &&
          (!user ? (
            loading && <CircularProgress className={classes.spinner} />
          ) : (
              <PhoneVerify
                user={user}
                handlePhoneVerifySubmit={handlePhoneVerifySubmit}
                handeResendOtp={handeResendOtp}
                submitLoading={submitLoading}
                backTab={backTab}
              />
            ))
        }

        {step === 'got_it' && <GotIt handleGotItSubmit={handleGotItSubmit} />}

        {step === 'welcome' && (
          <Welcome
            locationInfo={JSON.parse(
              localStorage.getItem(appConstants.TESTD_AC_LOCATION_INFO)
            )}
            handleWelcomeSubmit={handleWelcomeSubmit}
            backTab={backTab}
          />
        )}

        {step === 'add-dependent' && (
          <AddDependent
            user={user}
            // handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            submitLoading={submitLoading}
            handleDependentSubmit={handleDependentSubmit}
            handleDependentBack={handleDependentBack}
          />
        )}

        {step === 'question' && question_id / 1 === 1 && (
          <Question1
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}

        {step === 'question' && question_id / 1 === 2 && (
          <Question2
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}

        {step === 'question' && question_id / 1 === 3 && (
          <Question3
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}

        {step === 'question' && question_id / 1 === 4 && (
          <Question4
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}

        {step === 'question' && question_id / 1 === 5 && (
          <Question5
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}

        {/* {step === 'question' && question_id / 1 === 6 && (
          <Question6
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError = {setDisplayError}
          />
        )}

        {step === 'question' && question_id / 1 === 7 && (
          <Question7
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError = {setDisplayError}
          />
        )}
        {step === 'question' && question_id / 1 === 8 && (
          <Question8
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError = {setDisplayError}
          />
        )}
        {step === 'question' && question_id / 1 === 9 && (
          <Question9
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError = {setDisplayError}
          />
        )} */}
        {step === 'question' && question_id / 1 === 6 && (
          <Question6
            user={user}
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}
        {step === 'question' && question_id / 1 === 7 && (
          <Question7
            user={user}
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
          />
        )}
        {step === 'question' && question_id / 1 === 8 && (
          <Question8
            user={user}
            submitLoading={submitLoading}
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            handleAddDependent={handleAddDependent}
          />
        )}
        {step === 'question' && question_id / 1 === 9 && (
          <Question9
            user={user}
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            isSetInsurance={isSetInsurance}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}
        {step === 'question' && question_id / 1 === 10 && (
          <Question10
            user={user}
            testdAcToken={testdAcToken}
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
            setDisplayError={setDisplayError}
          />
        )}

        {/* Insurance */}
        {/* {step === 'insurance' && insurance_id === '1' && (
          <Insurance
            handleInsuranceSubmit={handleInsuranceSubmit}
            backTab={backTab}
            id={insurance_id}
          />
        )} */}

        {step === 'insurance' && insurance_id === '1' && (
          <Inputs
            user={user}
            patient={patient}
            testdAcToken={testdAcToken}
            handleInsuranceSubmit={handleInsuranceSubmit}
            backTab={backTab}
            id={insurance_id}
          />
        )}

        {step === 'insurance' && insurance_id === '2' && (
          <InsuranceFrontPhoto
            patient={patient}
            testdAcToken={testdAcToken}
            handleInsuranceSubmit={handleInsuranceSubmit}
            backTab={backTab}
            id={insurance_id}
          />
        )}

        {/* {step === 'insurance' && insurance_id === '3' && (
          <InsuranceBackPhoto
            patient={patient}
            testdAcToken={testdAcToken}
            handleInsuranceSubmit={handleInsuranceSubmit}
            backTab={backTab}
            id={insurance_id}
          />
        )} */}

        {step === 'insurance' && insurance_id === '3' && (
          <ReviewInsurance
            patient={patient}
            handleInsuranceSubmit={handleInsuranceSubmit}
            backTab={backTab}
            id={insurance_id}
          />
        )}

        {/* Personal */}
        {/* {step === 'personal' && personal_id === '1' && (
          <PersonalID
            handlePersonalSubmit={handlePersonalSubmit}
            backTab={backTab}
            id={personal_id}
          />
        )} */}

        {step === 'personal' && personal_id === '1' && (
          <PersonalIDFrontPhoto
            user={user}
            testdAcToken={testdAcToken}
            handlePersonalSubmit={handlePersonalSubmit}
            backTab={backTab}
            id={personal_id}
          />
        )}

        {/* {step === 'personal' && personal_id === '2' && (
          <PersonalIDBackPhoto
            user={user}
            testdAcToken={testdAcToken}
            handlePersonalSubmit={handlePersonalSubmit}
            backTab={backTab}
            id={personal_id}
          />
        )} */}

        {step === 'personal' && personal_id === '2' && (
          <ReviewPersonalID
            user={user}
            handlePersonalSubmit={handlePersonalSubmit}
            backTab={backTab}
            id={personal_id}
          />
        )}

        {step === 'schedule' && schedule_id === '1' && (
          <ScheduleTest
            handleQuestionsSubmit={handleScheduleSubmit}
            backTab={backTab}
            id={schedule_id}
          />
        )}

        {step === 'schedule' && schedule_id === '2' && (
          <ScheduleBooking
            handleQuestionsSubmit={handleScheduleSubmit}
            backTab={backTab}
            id={schedule_id}
          />
        )}

        {step === 'schedule' && schedule_id === '3' && (
          <Schedule
            handleQuestionsSubmit={handleScheduleSubmit}
            id={schedule_id}
          />
        )}

        {/* {step === 'question' && question_id / 1 === 16 && (
          <Question16
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
          />
        )}

        {step === 'question' && question_id / 1 === 17 && (
          <Question17
            handleQuestionsSubmit={handleQuestionsSubmit}
            backTab={backTab}
            id={question_id}
          />
        )} */}
      </Grid>

      {/* {step !== 'authenticate' && step !== 'phone-verify' && step !== 'got_it' && (
        <AppBar position="fixed" className={classes.footer}>
          <Toolbar className={classes.toolbar}>
          </Toolbar>
        </AppBar>
      )} */}
    </div>
  );
};

TestdAppointmentCalendar.propTypes = {
  validateLocationDepartment: PropTypes.func.isRequired,
  fetchEndpointDetails: PropTypes.func.isRequired,
  findTestdAcUser: PropTypes.func.isRequired,
  resendOtp: PropTypes.func.isRequired,
  verifyCheckOtp: PropTypes.func.isRequired,
  getTestdAcUser: PropTypes.func.isRequired,
  updateTestdAcUser: PropTypes.func.isRequired,
  createTestdAcUser: PropTypes.func.isRequired,
  getTestdAcPatient: PropTypes.func.isRequired,
  updateTestdAcPatient: PropTypes.func.isRequired,
  createTestdAcDependent: PropTypes.func.isRequired
};

export default connect(null, {
  validateLocationDepartment,
  fetchEndpointDetails,
  findTestdAcUser,
  resendOtp,
  verifyCheckOtp,
  getTestdAcUser,
  updateTestdAcUser,
  createTestdAcUser,
  getTestdAcPatient,
  updateTestdAcPatient,
  createTestdAcDependent
})(withRouter(TestdAppointmentCalendar));
