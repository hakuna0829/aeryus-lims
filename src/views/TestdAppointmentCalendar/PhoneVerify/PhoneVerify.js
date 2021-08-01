import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import ReactInputVerificationCode from 'react-input-verification-code';
import tabletBg from '../assets/splash_tablet.svg';
import mobileBg from '../assets//splash_testd.svg';
import "./index.css";
import PhoneNumberFormat from 'components/PhoneNumberFormat';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  content: {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    // [theme.breakpoints.up(415)]: {
    //   top:64,
    // }
  },
  contentBody: {
    height: '100%',
    paddingTop: '45vh'
  },
  titleText: {
    color: '#043B5D',
    fontFamily: 'Montserrat',
    textAlign: 'center'
  },
  box: {
    padding: 0
  },
  loginContainer: {
    marginTop: '40vh'
  },
  description: {
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center'
  },
  item: {
    width: 350,
    marginBottom: 20
  },
  inputCode: {
    ReactInputVerificationCodeItemWidth: '1.5rem',
    ReactInputVerificationCodeItemHeight: '2.5rem',

    '&.ReactInputVerificationCode__container': {
      width: '100%',
      padding: 15,
    }
  },
  logonButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#0F84A9',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 20,
    '&:hover': {
      backgroundColor: '#FFF',
      color: '#0F84A9',
      border: '#0F84A9 solid 1px',
    },
  },
  backButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 30,
    color: '#0F84A9',
    border: '#0F84A9 solid 1px',
    '&:hover': {
      backgroundColor: '#0F84A9',
      color: '#fff',
    },
    [theme.breakpoints.up(375)]: {
      marginTop: 50,
    }
  }
}));

const PhoneVerify = (props) => {
  const { user, submitLoading, backTab, handlePhoneVerifySubmit, handeResendOtp } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [inputCode, setInputCode] = useState('')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imageUrl = windowWidth >= 375 ? tabletBg : mobileBg;

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  const handleChange = e => {
    setInputCode(e)
  };

  const handleSubmit = async event => {
    let body = {
      phone: user.phone,
      code: inputCode
    }
    handlePhoneVerifySubmit(body);
  };

  const handleBack = () => {
    backTab('authenticate');
  }

  return (
    <div className={classes.content} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={classes.contentBody}>
        <Typography style={{ textAlign: 'center' }} className={classes.description}>
          Enter the 6 digit verification<br />
          code we sent to: <PhoneNumberFormat value={user.phone} />
          <br />
          <Button
            onClick={handeResendOtp}
          >
            Resend OTP {submitLoading ? <CircularProgress size={20} /> : ''}
          </Button>
        </Typography>

        <div className="custom-styles">
          <ReactInputVerificationCode
            length={6}
            placeholder=""
            onChange={handleChange}
            className={classes.inputCode}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button
            className={clsx(classes.backButton, brandClasses.loginButton)}
            onClick={handleBack}
          >
            Back
          </Button><br />
          <Button
            className={clsx(classes.logonButton, brandClasses.loginButton)}
            classes={{ disabled: classes.logonButtonDisabled }}
            disabled={submitLoading}
            onClick={handleSubmit}
          >
            Submit {submitLoading ? <CircularProgress size={20} className={brandClasses.progressSpinnerWhite} /> : ''}
          </Button>
        </div>

      </div>

    </div>
  )
}

PhoneVerify.propTypes = {
  handlePhoneVerifySubmit: PropTypes.func.isRequired,
};

export default PhoneVerify;