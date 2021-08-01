import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { apiUrl, uploadTestdAcImage } from 'actions/api';
import { FlipCamera } from 'icons';
import { handleImage } from 'helpers';
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
      height: 'calc(100% - 128px)'
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
      fontSize: 20
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
      marginBottom: 12
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
      padding: 16
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
    marginTop: 5,
    [theme.breakpoints.up(400)]: {
      marginTop: 30
    }
  },
  backButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 15,
    marginBottom: 25,
    color: '#0F84A9',
    border: '#0F84A9 solid 1px',
    '&:hover': {
      backgroundColor: '#0F84A9',
      color: '#fff'
    },
    [theme.breakpoints.up(440)]: {
      marginTop: 30
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginLeft: 8
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  boxContainer: {
    width: 230,
    // height: 120,
    margin: '0 auto',
    // border: '#0F84A9 solid 1px',
    [theme.breakpoints.up(376)]: {
      width: 230
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '5px 10px'
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
    padding: '15px 20px',
    position: 'relative',
    marginBottom: 32,
    textAlign: 'center',
    '& img': {
      width: '100%'
    },
    '& h5': {
      color: '#9B9B9B',
      fontsize: 14,
      fontWeight: 500,
      lineHeight: '18px',
      textAlign: 'center'
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
    display: 'none'
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
    justifyContent: 'center'
  },
  alertBody:{
    backgroundColor: 'rgb(218 241 255)'
  },
  scanIcon: {
    color: theme.palette.brand,
    fontSize: 40
  }
}));

const FrontPhoto = props => {
  const {
    user,
    handlePersonalSubmit,
    backTab,
    testdAcToken,
    uploadTestdAcImage
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [frontImgUri, setFrontImgUri] = useState(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [imgFrontState, setImgFrontState] = useState({});
  const [imgBackState, setImgBackState] = useState({});
  const imageFrontRef = React.useRef();
  const imageBackRef = React.useRef();

  const handleCamera = () => {
    setCameraDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCameraDialogOpen(false);
  };

  const handleFrontPhotoChange = event => {
    handleImage(
      event,
      setDisplayError,
      setImgFrontState,
      setImgCompressionLoading
    );
  };

  const handleBackPhotoChange = event => {
    handleImage(
      event,
      setDisplayError,
      setImgBackState,
      setImgCompressionLoading
    );
  };

  const handleSubmit = async event => {
    if (imgFrontState.imagePath && imgBackState.imagePath) {
      setLoading(true);
      // const frontBlob = dataURLtoBlob(frontImgUri);

      let frontImgFormData = new FormData();
      // frontImgFormData.append('uploadImage', frontBlob, 'personal_id_front.png');
      frontImgFormData.append('uploadImage', imgFrontState.imagePath);
      frontImgFormData.append('table', 'user');
      frontImgFormData.append('id', user._id);
      frontImgFormData.append('field', 'personal_id_front');
      const resFront = await uploadTestdAcImage(testdAcToken, frontImgFormData);

      let backImgFormData = new FormData();
      // frontImgFormData.append('uploadImage', frontBlob, 'personal_id_front.png');
      backImgFormData.append('uploadImage', imgBackState.imagePath);
      backImgFormData.append('table', 'user');
      backImgFormData.append('id', user._id);
      backImgFormData.append('field', 'personal_id_back');
      const resBack = await uploadTestdAcImage(testdAcToken, backImgFormData);

      setLoading(false);
      if (resFront.success && resBack.success) {
        handlePersonalSubmit({
          personal_id_front: resFront.data,
          personal_id_back: resBack.data
        });
      }
    } else {
      if (user && user.personal_id_front) handlePersonalSubmit();
      else setDisplayError('Please upload both Image');
    }
  };

  const handleTakePhoto = dataUri => {
    handleDialogClose();
    setFrontImgUri(dataUri);
  };

  const handleCameraError = error => {
    // TODO: remove Camera if not required, in web app may be required
    console.log(FlipCamera, handleCamera, dataURLtoBlob, frontImgUri);
    console.log('handleCameraError', error);
  };

  const handleBack = () => {
    backTab('personal');
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const handleFrontBtnClick = () => {
    /*Collecting node-element and performing click*/
    imageFrontRef.current.click();
  };

  const handleBackBtnClick = () => {
    /*Collecting node-element and performing click*/
    imageBackRef.current.click();
  };
  return (
    <div className={classes.content}>
      <div className={classes.contentBody}>
        <Typography className={classes.title}>Personal ID</Typography>
        <Typography className={classes.description}>
          Please take a photo of a Personal ID: <br />
          Front of Personal ID
        </Typography>

        <div className={classes.boxContainer}>
          {/* <div className={classes.uploadContanier}>
            <img src='/images/svg/picturebox.svg' alt='' width='90%' />
            <label style={{ cursor: 'pointer' }} onClick={() => handleCamera()}>
              {frontImgUri
                ?
                <img src={frontImgUri} className={classes.uploadedPhoto} alt="front" />
                :
                user && user.personal_id_front
                  ?
                  <img src={apiUrl + user.personal_id_front} className={classes.uploadedPhoto} alt="img" />
                  :
                  <FlipCamera className={classes.scanIcon} />
              }
            </label>
            <Typography variant="h5" >
              Center Front of ID <br />
              card in this box
            </Typography>
          </div> */}

          <div
            className={classes.uploadContanier}
            onClick={handleFrontBtnClick}
            style={{ cursor: 'pointer', margin: '10px auto' }}>
            {imgFrontState.imgURL ? (
              <img
                src={imgFrontState.imgURL}
                className={classes.uploadedPhoto}
                alt="img"
              />
            ) : user && user.personal_id_front ? (
              <img
                src={apiUrl + user.personal_id_front}
                className={classes.uploadedPhoto}
                alt="img"
              />
            ) : (
              <Typography className={classes.uploadDesc}>
                Front of card
              </Typography>
            )}
            <div className={classes.uploadImageContainer}>
              <input
                type="file"
                ref={imageFrontRef}
                accept="image/*"
                className={classes.uploadInput}
                name="front_card"
                id="icon-button-file"
                onChange={handleFrontPhotoChange}
              />
              <label style={{ cursor: 'pointer', margin: '10px auto' }}>
                <img src="/images/svg/status/UploadPhoto.svg" alt="" />
                <img src="/images/svg/status/Upload_icon.svg" alt="" />
                {imgCompressionLoading ? (
                  <CircularProgress
                    size={20}
                    className={brandClasses.progressSpinner}
                  />
                ) : (
                  ''
                )}
                {loading ? (
                  <CircularProgress
                    size={20}
                    className={brandClasses.progressSpinner}
                  />
                ) : (
                  ''
                )}
              </label>
            </div>
            <Typography className={classes.uploadDesc}>Tap here</Typography>
          </div>

          <div
            className={classes.uploadContanier}
            onClick={handleBackBtnClick}
            style={{ cursor: 'pointer', margin: '10px auto' }}>
            {imgBackState.imgURL ? (
              <img
                src={imgBackState.imgURL}
                className={classes.uploadedPhoto}
                alt="img"
              />
            ) : user && user.personal_id_back ? (
              <img
                src={apiUrl + user.personal_id_back}
                className={classes.uploadedPhoto}
                alt="img"
              />
            ) : (
              <Typography className={classes.uploadDesc}>
                Back of card
              </Typography>
            )}
            <div className={classes.uploadImageContainer}>
              <input
                type="file"
                ref={imageBackRef}
                accept="image/*"
                className={classes.uploadInput}
                name="back_card"
                id="S2"
                onChange={handleBackPhotoChange}
              />
              <label style={{ cursor: 'pointer', margin: '10px auto' }}>
                <img src="/images/svg/status/UploadPhoto.svg" alt="" />
                <img src="/images/svg/status/Upload_icon.svg" alt="" />
                {imgCompressionLoading ? (
                  <CircularProgress
                    size={20}
                    className={brandClasses.progressSpinner}
                  />
                ) : (
                  ''
                )}
                {loading ? (
                  <CircularProgress
                    size={20}
                    className={brandClasses.progressSpinner}
                  />
                ) : (
                  ''
                )}
              </label>
            </div>
            <Typography className={classes.uploadDesc}>Tap here</Typography>
          </div>
        </div>

        <div className={classes.alertContainer}>
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '30px auto 50px'
          }}>
          {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, padding: '6px 8px', cursor: 'pointer' }} onClick={handleBack} />
          <Button onClick={handleSubmit} type="submit" disabled={loading} >
            <img src='/images/svg/next_button.svg' alt='next' />
          </Button> */}
          <Button
            className={clsx(brandClasses.backButton, brandClasses.loginButton)}
            onClick={handleBack}>
            <KeyboardBackspaceIcon style={{ color: '#0F84A9' }} />
            Back
          </Button>

          <Button
            className={clsx(brandClasses.logonButton, brandClasses.loginButton)}
            onClick={handleSubmit}>
            Next
            {loading ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              ''
            )}
            <ArrowRightAltIcon style={{ color: '#fff' }} />
          </Button>
        </div>
      </div>

      <Dialog open={cameraDialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Camera
            onTakePhoto={dataUri => handleTakePhoto(dataUri)}
            onCameraError={error => {
              handleCameraError(error);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

FrontPhoto.propTypes = {
  uploadTestdAcImage: PropTypes.func.isRequired,
  handlePersonalSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default connect(null, { uploadTestdAcImage })(FrontPhoto);
