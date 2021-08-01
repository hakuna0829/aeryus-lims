import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Divider, Button, CircularProgress, Dialog, DialogContent } from '@material-ui/core';
import brandStyles from 'theme/brand';
import { Print, FlipCamera } from 'icons';
import { uploadImage, apiUrl, clientServer } from 'actions/api';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { useReactToPrint } from 'react-to-print';
import moment from "moment";
import Barcode from 'react-barcode';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px 0px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(1)}px`,
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  gridBody: {
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(8)
  },
  labelTitle: {
    marginTop: theme.spacing(2),
    color: theme.palette.brandDark,
    fontWeight: 600
  },
  dividerTop: {
    marginBottom: theme.spacing(3),
    width: '80%',
    height: 1.5,
    backgroundColor: theme.palette.brandDark,
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: '80%',
    height: 1.5,
    backgroundColor: theme.palette.brandDark,
  },
  textValue: {
    color: theme.palette.brandGray,
  },
  textValueSpan: {
    color: theme.palette.brandDark,
  },
  uploadKitOuterBox: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
    boxSizing: 'border-box',
    height: 263.2,
    width: 243.6,
    border: `0.7px solid ${theme.palette.brandDark}`,
    borderRadius: 6.3,
    backgroundColor: '#FFFFFF',
    boxShadow: '3px 3px 6px 1px rgba(15,132,169,0.15)'
  },
  uploadKitBox: {
    width: 140,
    height: 110,
    margin: 4,
    marginBottom: 50,
    padding: 16,
    boxSizing: 'border-box',
    border: `1.01px dashed ${theme.palette.brandGray}`,
    borderRadius: 10.75,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  uploadKitText: {
    color: theme.palette.brandGray,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 12
  },
  uploadedPhoto: {
    maxWidth: 150,
    maxHeight: 150
  },
  scanIcon: {
    color: theme.palette.brand,
    fontSize: 40
  },
  footer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  printLabel: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    textAlign: 'center'
  },
  nextButton: {
    marginTop: 18
  },
  printPage: {
    padding: 16,
    // rotation
    // position: 'absolute',
    // paddingTop: 476,
    // paddingLeft: 245,
    // '-webkit-transform': 'rotate(90deg)',
    // '-moz-transform': 'rotate(90deg)',
    // '-o-transform': 'rotate(90deg)',
    // '-ms-transform': 'rotate(90deg)',
    // transform: 'rotate(90deg)',
  },
  printPageProd002: {
    padding: 1,
    paddingTop: 22,
  },
  printPageDiv: {
    float: 'left',
    textAlign: 'left',
    paddingLeft: 16
  },
  printPageDivProd002: {
    float: 'left',
    textAlign: 'left',
    paddingLeft: 1
  },
  printPageKey: {
    color: theme.palette.black,
    fontWeight: 'bold',
    fontSize: 8,
    lineHeight: 'inherit',
  },
  printPageKeyProd002: {
    color: theme.palette.black,
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 'inherit',
  },
  printPageKeyProd003: {
    color: theme.palette.black,
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 'inherit',
  },
  printPageValue: {
    color: theme.palette.black,
    fontSize: 28,
  }
}));

const SpecimenCollection = (props) => {
  const { nextTab, previousTab, updateTesting, testing, user, saveLoading, uploadImage } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const componentRef = useRef();

  const [loading, setLoading] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [cameraType, setCameraType] = useState(false);
  const [frontImgUri, setFrontImgUri] = useState(null);
  const [backImgUri, setBackImgUri] = useState(null);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);

  const [isNewPrint] = useState(clientServer === 'prod002' || clientServer === 'prod003' || clientServer === 'prod007');
  // const [isProd002] = useState(clientServer === 'prod002');
  const [isProd003] = useState(clientServer === 'prod003');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePrint = () => {
    // window.print();
    setIsPrinting(true);
    setTimeout(() => {
      printQR();
      setTimeout(() => { setIsPrinting(false) }, 1000);
      if (clientServer === 'prod002')
        updateTesting({ completed: true });
    }, 500);
  }

  const printQR = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleNext = async () => {
    if (frontImgUri && backImgUri) {
      setLoading(true);
      let body = {
        testkit_front: '',
        testkit_back: ''
      }
      const frontBlob = dataURLtoBlob(frontImgUri);
      const backBlob = dataURLtoBlob(backImgUri);

      let frontImgFormData = new FormData();
      frontImgFormData.append('uploadImage', frontBlob, 'testkit_front.png');
      const resFront = await uploadImage(frontImgFormData);
      if (resFront.success) {
        let backImgFormData = new FormData();
        backImgFormData.append('uploadImage', backBlob, 'testkit_back.png');
        const resBack = await uploadImage(backImgFormData);
        if (resBack.success) {
          body.testkit_front = '/images/' + resFront.data;
          body.testkit_back = '/images/' + resBack.data;
          updateTesting(body);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else {
      nextTab();
      // if (testing.testkit_front && testing.testkit_back) {
      //   nextTab();
      // } else {
      //   setDisplayError('Please upload Test Kit Front & Back Images');
      // }
    }
  }

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const handleCamera = (type) => {
    setCameraType(type);
    setCameraDialogOpen(true);
  }

  const handleDialogClose = () => {
    setCameraDialogOpen(false);
  }

  const handleTakePhoto = (dataUri) => {
    handleDialogClose();
    if (cameraType === 'front')
      setFrontImgUri(dataUri);
    else
      setBackImgUri(dataUri);
  }

  const handleCameraError = (error) => {
    console.log('handleCameraError', error);
  }

  class PrintingPage extends React.Component {
    render() {
      return (
        <div className={clsx(classes.printPage, isNewPrint && classes.printPageProd002)}>
          <div className={clsx(classes.printPageDiv, isNewPrint && classes.printPageDivProd002)}>
            {/* , isProd003 && classes.printPageKeyProd003 */}
            <Typography className={clsx(classes.printPageKey, isNewPrint && classes.printPageKeyProd002)}>
              {'Patient: '}
              {testing.dependent_id
                ?
                <span style={{ fontWeight: 100 }}>
                  {testing.dependent_id.first_name}, {testing.dependent_id.last_name}
                </span>
                :
                <span style={{ fontWeight: 100 }}>
                  {user.last_name}, {user.first_name}
                </span>
              }
              {' | '}
              {isNewPrint && <br />}
              {/* {isProd002 && <br />} */}
              {'DOB: '}
              <span style={{ fontWeight: 100 }}>
                {testing.dependent_id
                  ?
                  moment.utc(testing.dependent_id.dob).format('MM/DD/YYYY')
                  :
                  moment.utc(user.dob).format('MM/DD/YYYY')
                }
              </span>
              {/* {' | '}
              {'Zip: '}
              <span style={{ fontWeight: 100 }}>
                {user.location_id ? user.location_id.zip_code : ''}
              </span> */}
              {' | '}
              {'DOS: '} <span style={{ fontWeight: 100 }}>{moment().format('MM/DD/YYYY')}</span>
            </Typography>

            {/* <Typography className={classes.printPageKey}>
              {'Patient: '} <span style={{ fontWeight: 100 }}> {user.last_name}, {user.first_name} </span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'DOB: '} <span style={{ fontWeight: 100 }}>{moment(user.dob).format('MM/DD/YYYY')}</span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'Sex: '} <span style={{ fontWeight: 100 }}>{user.gender}</span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'Zipcode: '}
              <span style={{ fontWeight: 100 }}>
                {user.location_id ? user.location_id.zip_code : ''}
              </span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'Site: '}
              <span style={{ fontWeight: 100 }}>
                {user.location_id ? user.location_id.city + ', ' + user.location_id.name : ''}
              </span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'Provider name: '}
              <span style={{ fontWeight: 100 }}>
                {user.location_id && user.location_id.provider && user.location_id.provider.name}
              </span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'NPI: '}
              <span style={{ fontWeight: 100 }}>
                {user.location_id && user.location_id.provider && user.location_id.provider.npi}
              </span>
            </Typography> */}

            {/* <br /><br /><br /> */}
            {isNewPrint
              ?
              isProd003
                ?
                <Barcode
                  value={testing.testkit_id}
                  font={'Montserrat'}
                  width={2}
                  height={100}
                  fontSize={20}
                />
                :
                <Barcode
                  value={testing.testkit_id}
                  font={'Montserrat'}
                  width={2}
                  height={85}
                  fontSize={20}
                // marginLeft={10}
                />
              :
              <Barcode
                value={testing.testkit_id}
                font={'Montserrat'}
                width={1}
                height={30}
                fontSize={8}
              />
            }
            {/* <br /><br />
            <Typography className={classes.printPageKey}>
              {'Session ID: '} <span style={{ fontWeight: 100 }}>{testing.test_session_id}</span>
            </Typography>
            <br />
            <Typography className={classes.printPageKey}>
              {'Date: '} <span style={{ fontWeight: 100 }}>{moment().format('MM/DD/YYYY')}</span>
            </Typography>
            <br /><br /><br /> */}

            {/* <Typography className={classes.printPageKey}>
              {'Patient Signature: '}
            </Typography>
            <br />
            <img src={apiUrl + testing.patient_signature} alt="img" />
            <br /><br />
            <Typography className={classes.printPageKey}>
              {'Medical Technician Signature: '}
            </Typography>
            <br />
            <img src={apiUrl + testing.medical_technician} alt="img" /> */}
          </div>

          {/* <div style={{ float: 'right', textAlign: 'right', paddingRight: 16 }}>
          </div> */}
        </div>
      );
    }
  }

  return (
    <div className={classes.root}>
      {isPrinting && <PrintingPage ref={componentRef} />}
      {/* <PrintingPage ref={componentRef} /> */}
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <>
            <img src="/images/svg/status/users_icon.svg" alt="" />
            {'User Manager'} |
          </>
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>
          {'SPECIMEN COLLECTION'}
        </Typography>
      </div>
      <Grid
        className={classes.gridBody}
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
      >
        <Typography variant="h4" className={classes.labelTitle}>
          PATIENT NAME
        </Typography>
        <Divider className={classes.dividerTop} />
        {testing.dependent_id
          ?
          <Typography variant="h4" className={classes.textValue}>
            {testing.dependent_id.first_name}, {testing.dependent_id.last_name}
          </Typography>
          :
          <Typography variant="h4" className={classes.textValue}>
            {user.first_name}, {user.last_name}
          </Typography>
        }
        <Divider className={classes.divider} />

        <Typography variant="h4" className={classes.labelTitle}>
          SESSION ID
        </Typography>
        <Divider className={classes.dividerTop} />
        <Typography variant="h4" className={classes.textValue}>
          {testing.test_session_id}
        </Typography>
        <Divider className={classes.divider} />

        <Typography variant="h4" className={classes.labelTitle}>
          TEST KIT ID
        </Typography>
        <Divider className={classes.dividerTop} />
        <Typography variant="h4" className={classes.textValue}>
          {testing.testkit_id}
        </Typography>
        <Divider className={classes.divider} />

        <Typography variant="h4" className={classes.labelTitle}>
          Upload photo of test kit
        </Typography>
        <Grid item container direction="row" justify="flex-start" alignItems="center" >
          <Grid item container direction="column" justify="center" alignItems="center" className={classes.uploadKitOuterBox} >
            <label style={{ cursor: 'pointer' }} onClick={() => handleCamera('front')}>
              {frontImgUri
                ? <img src={frontImgUri} className={classes.uploadedPhoto} alt="front" />
                : testing.testkit_front
                  ?
                  <img src={apiUrl + testing.testkit_front} className={classes.uploadedPhoto} alt="front" />
                  :
                  <Grid item className={classes.uploadKitBox}>
                    <Typography className={classes.uploadKitText}>
                      Upload test kit  <br />
                      verification front
                    </Typography>
                    <FlipCamera className={classes.scanIcon} />
                  </Grid>
              }
            </label>
          </Grid>
          <Grid item container direction="column" justify="center" alignItems="center" className={classes.uploadKitOuterBox} >
            <label style={{ cursor: 'pointer' }} onClick={() => handleCamera('back')}>
              {backImgUri
                ? <img src={backImgUri} className={classes.uploadedPhoto} alt="back" />
                : testing.testkit_back
                  ?
                  <img src={apiUrl + testing.testkit_back} className={classes.uploadedPhoto} alt="back" />
                  :
                  <Grid item className={classes.uploadKitBox} >
                    <Typography className={classes.uploadKitText}>
                      Upload test kit  <br />
                      verification back
                    </Typography>
                    <FlipCamera className={classes.scanIcon} />
                  </Grid>
              }
            </label>
          </Grid>
        </Grid>
      </Grid>
      <br />

      <div className={classes.footer}>
        <Grid>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton, classes.nextButton)}
                onClick={previousTab}
              >
                {'BACK'}
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.printLabel}>
                {'Print Specimen Label'}
              </Typography>
              <Button
                className={brandClasses.button}
                onClick={handlePrint}
                startIcon={<Print />}
              >
                {'PRINT'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={clsx(brandClasses.button, classes.nextButton)}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading || saveLoading}
                onClick={handleNext}
              >
                {'NEXT'} {loading || saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={cameraDialogOpen}
        onClose={handleDialogClose}
      >
        <DialogContent>
          <Camera
            onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
            onCameraError={(error) => { handleCameraError(error) }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

SpecimenCollection.prototype = {
  nextTab: PropTypes.func.isRequired,
  previousTab: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  updateTesting: PropTypes.func.isRequired,
  testing: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  saveLoading: PropTypes.bool.isRequired,
};

export default connect(null, { uploadImage })(SpecimenCollection);
