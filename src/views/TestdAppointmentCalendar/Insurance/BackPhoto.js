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
    marginTop: 30,
    [theme.breakpoints.up(376)]: {
      marginTop: 50
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

const BackPhoto = props => {
  const {
    patient,
    handleInsuranceSubmit,
    backTab,
    testdAcToken,
    uploadTestdAcImage
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [backImgUri, setBackImgUri] = useState(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [imgState, setImgState] = useState({});
  const imageRef = React.useRef();

  const handleCamera = () => {
    setCameraDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCameraDialogOpen(false);
  };

  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
  };

  const handleSubmit = async event => {
    if (imgState.imagePath) {
      setLoading(true);
      // const backBlob = dataURLtoBlob(backImgUri);

      let backImgFormData = new FormData();
      // backImgFormData.append('uploadImage', backBlob, 'insurance_back.png');
      backImgFormData.append('uploadImage', imgState.imagePath);
      backImgFormData.append('table', 'patient');
      backImgFormData.append('id', patient._id);
      backImgFormData.append('field', 'insurance.primary_insurance_card_back');
      const res = await uploadTestdAcImage(testdAcToken, backImgFormData);
      setLoading(false);
      if (res.success) {
        handleInsuranceSubmit({ primary_insurance_card_back: res.data });
      }
    } else {
      if (
        patient &&
        patient.insurance &&
        patient.insurance.primary_insurance_card_back
      )
        handleInsuranceSubmit();
      else setDisplayError('Please upload Image');
    }
  };

  const handleTakePhoto = dataUri => {
    handleDialogClose();
    setBackImgUri(dataUri);
  };

  const handleCameraError = error => {
    // TODO: remove Camera if not required, in web app may be required
    console.log(FlipCamera, handleCamera, dataURLtoBlob, backImgUri);
    console.log('handleCameraError', error);
  };

  const handleBack = () => {
    backTab('insurance');
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const handleBtnClick = () => {
    /*Collecting node-element and performing click*/
    imageRef.current.click();
  };

  return (
    <div className={classes.content}>
      <div className={classes.contentBody}>
        <Typography className={classes.title}>Insurance Information</Typography>
        <Typography className={classes.description}>
          Please take a photo of the back
          <br />
          of your insurance card
        </Typography>
        <br />

        <div className={classes.boxContainer}>
          {/* <div className={classes.uploadContanier}>
            <img src='/images/svg/picturebox.svg' alt='' width='90%' />
            <label style={{ cursor: 'pointer' }} onClick={() => handleCamera()}>
              {backImgUri
                ?
                <img src={backImgUri} className={classes.uploadedPhoto} alt="back" />
                :
                patient && patient.insurance && patient.insurance.primary_insurance_card_back
                  ?
                  <img src={apiUrl + patient.insurance.primary_insurance_card_back} className={classes.uploadedPhoto} alt="img" />
                  :
                  <FlipCamera className={classes.scanIcon} />
              }
            </label>
            <Typography variant="h5" >
              Center Back of insurance<br />
              card in this box
            </Typography>
          </div> */}

          <div
            className={classes.uploadContanier}
            onClick={handleBtnClick}
            htmlFor="icon-button-file"
            style={{ cursor: 'pointer', margin: '10px auto' }}>
            {imgState.imgURL ? (
              <img
                src={imgState.imgURL}
                className={classes.uploadedPhoto}
                alt="img"
              />
            ) : patient &&
              patient.insurance &&
              patient.insurance.primary_insurance_card_back ? (
              <img
                src={apiUrl + patient.insurance.primary_insurance_card_back}
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
                accept="image/*"
                ref={imageRef}
                className={classes.uploadInput}
                name="back_card"
                id="icon-button-file"
                onChange={handlePhotoChange}
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
            onClick={handleSubmit}
            type="submit">
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

BackPhoto.propTypes = {
  uploadTestdAcImage: PropTypes.func.isRequired,
  handleInsuranceSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default connect(null, { uploadTestdAcImage })(BackPhoto);
