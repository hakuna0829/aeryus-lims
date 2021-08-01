import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { apiUrl } from 'actions/api';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  content: {
    position: 'fixed',
    top: 65,
    width: '100%',
    height: 'calc(100% - 97px)',
    backgroundSize: 'cover',
    overflowY: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.up(415)]: {
      top: 80,
      height: 'calc(100% - 128px)',
    }
  },
  contentBody: {
    height: '100%',
    paddingTop: '2vh'
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 16,
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
    }
  },
  description: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 24,
    [theme.breakpoints.up(415)]: {
      fontSize: 16,
      marginBottom: 12,
    }
  },
  tempBox: {
    width: '100%',
    height: '100%',
    border: 'solid 1px #0F84A9',
    padding: 0,
    borderRadius: 8,
    marginLeft: 8,
    marginTop: 16,
    // '& input': {
    //   padding: '4px 10px',
    // },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    }
  },
  utilRoot: {
    width: '100%',
    height: '100%',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    padding: 0,
    marginLeft: 8,
    marginTop: 16,
    '& input': {
      padding: 16,
    },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
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
    [theme.breakpoints.up(400)]: {
      marginTop: 20,
    }
  },
  backButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 25,
    color: '#0F84A9',
    border: '#0F84A9 solid 1px',
    '&:hover': {
      backgroundColor: '#0F84A9',
      color: '#fff',
    },
    [theme.breakpoints.up(440)]: {
      marginTop: 30,
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginLeft: 8
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  boxContainer: {
    width: '100%',
    margin: '0 auto',
    display:'flex',
    justifyContent:'center',
    // border: '#0F84A9 solid 1px',
    [theme.breakpoints.up(376)]: {
      width: '100%',
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '5px 10px',
  },
  uploadedPhoto: {
    maxWidth: 150,
    maxHeight: 150,
    paddingTop: 10
  },
  uploadContanier: {
    border: `solid 1px`,
    borderColor: theme.palette.brandDark,
    borderRadius: 10,
    padding: '8px 10px',
    textAlign: 'center',
    position: 'relative',
    marginBottom: 15,
    '&:first-child':{
      marginRight:8
    },
    [theme.breakpoints.up(376)]: {
      marginBottom: 35,
    }
  },
  uploadImageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& img': {
      marginRight: 10,
      width: 30
    },
    '& img:last-child': {
      marginRight: 0
    }
  },
  uploadTitle: {
    color: '#0F84A9',
    fontSize: 10,
    position: 'absolute',
    top: -10,
    background: '#fff',
    padding: '0 4px'
  },
  uploadDesc: {
    color: '#9B9B9B',
    fontSize: 14,
    padding: '4px 10px',
    textAlign: 'center'
  },
  uploadInput: {
    display: 'none',
  },
  titleText: {
    color: theme.palette.blueDark,
    paddingBottom: 20,
    textAlign: 'center'
  },
  alertContainer: {
    display: 'flex',
    padding: '0 15px',
    width: '100%',
    justifyContent: 'flex-end'
  }

}));

const ReviewPersonalID = (props) => {
  const { user, handlePersonalSubmit, backTab } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const handleSubmit = async event => {
    handlePersonalSubmit();
  };

  const handleBack = () => {
    backTab('personal');
  }

  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          Personal ID
        </Typography>
        <Typography className={classes.description}>
          Please review both photos<br />
          and make sure they are clear,<br />
          legible and the most updated
        </Typography>
        <br />

        <div className={classes.boxContainer} >

          <div className={classes.uploadContanier}>

            {user && user.personal_id_front && (
              <>
                <img src={apiUrl + user.personal_id_front} className={classes.uploadedPhoto} alt="img" />
                <Typography className={classes.uploadDesc}>Front</Typography>
              </>
            )}
            <div className={classes.uploadImageContainer}>
              {/* <input type="file" accept="image/*" className={classes.uploadInput} name="front_card" id="icon-button-file" onChange={(e) => handlePhotoChange('front_card', e)} /> */}
              {/* <label htmlFor="icon-button-file" style={{ cursor: 'pointer', margin: '10px auto' }}>
                <img src="/images/svg/status/UploadPhoto.svg" alt="" />
                <img src="/images/svg/status/Upload_icon.svg" alt="" htmlFor="icon-button-file" />
              </label> */}
            </div>
          </div>

          <div className={classes.uploadContanier}>

            {user && user.personal_id_back && (
              <>
                <img src={apiUrl + user.personal_id_back} className={classes.uploadedPhoto} alt="img" />
                <Typography className={classes.uploadDesc}>Back</Typography>
              </>
            )}
            <div className={classes.uploadImageContainer}>
              {/* <input type="file" accept="image/*" className={classes.uploadInput} name="front_card" id="icon-button-file2" onChange={(e) => handlePhotoChange('back_card', e)} /> */}
              {/* <label htmlFor="icon-button-file2" style={{ cursor: 'pointer', margin: '10px auto' }}>
                <img src="/images/svg/status/UploadPhoto.svg" alt="" />
                <img src="/images/svg/status/Upload_icon.svg" alt="" htmlFor="icon-button-file" />
              </label> */}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px auto 50px' }}>
          {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, padding: '6px 8px', cursor: 'pointer' }} onClick={handleBack} />
          <Button onClick={handleSubmit} >
            <img src='/images/svg/next_button.svg' alt='next' />
          </Button> */}
          <Button
            className={clsx(brandClasses.backButton, brandClasses.loginButton)}
            onClick={handleBack}
          >
            <KeyboardBackspaceIcon style={{color:"#0F84A9"}} />
            Back
          </Button>

          <Button
            className={clsx(brandClasses.logonButton, brandClasses.loginButton)}
            onClick={handleSubmit}
          >
            Next
            <ArrowRightAltIcon style={{color:"#fff"}} />
          </Button>
        </div>
      </div>


    </div>
  )
}

ReviewPersonalID.propTypes = {
  handlePersonalSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default ReviewPersonalID;
