import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import tabletBg from '../assets/splash_tablet.svg';
import mobileBg from '../assets//splash_testd.svg';
import brandStyles from 'theme/brand';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

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
  },
  contentBody: {
    height: '100%',
    paddingTop: '35vh'
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
  title: {
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'center'
  },
  logonButton: {
    height: 50,
    width: 150,
    borderRadius: 10,
    backgroundColor: '#0F84A9',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 30,
    marginBottom: 80,

    "& span":{
      justifyContent:'space-around'
    },
    [theme.breakpoints.up(440)]: {
      marginTop: 50,
      width: 180,
    }
  },
  breakMobile: {
    display: 'inline',
    [theme.breakpoints.up(414)]: {
      display: 'none'
    }
  },
  breakTablet: {
    display: 'inline',
    [theme.breakpoints.down(415)]: {
      display: 'none'
    }
  }

}));

const GotIt = (props) => {
  const { handleGotItSubmit } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imageUrl = windowWidth > 375 ? tabletBg : mobileBg;

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  const handleSubmit = async event => {
    handleGotItSubmit();
  };

  return (
    <div className={classes.content} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          Got it
        </Typography>
        <br />
        <Typography className={classes.description}>
          Okay, this will be quick –<br className={classes.breakMobile} />
          we have a few questions <br className={classes.breakMobile} />
          about your health.<br className={classes.breakMobile} /> <br className={classes.breakTablet} />
          Please have your driver’s license<br className={classes.breakMobile} />
          and insurance <br className={classes.breakTablet} />card available <br className={classes.breakMobile} />
          before you start.<br className={classes.breakMobile} /><br className={classes.breakTablet} />
          <br />
          (All personal information you <br className={classes.breakMobile} />
          provide <br className={classes.breakTablet} />is encrypted and secure.)<br />
        </Typography>

        <div style={{ textAlign: 'center', marginTop: 30, cursor: 'pointer' }}>
          {/* <img src='/images/svg/back_button.svg' alt='back' style={{marginRight:30}} /> */}
          {/* <img src='/images/svg/next_button.svg' alt='next' onClick={handleSubmit} /> */}
          <Button
            className={clsx(classes.logonButton, brandClasses.loginButton)}
            onClick={handleSubmit}
          >
            Next
            <ArrowRightAltIcon style={{color:'#fff'}} />
          </Button>
        </div>
      </div>

    </div>
  )
}

GotIt.propTypes = {
  handleGotItSubmit: PropTypes.func.isRequired,
};

export default GotIt;