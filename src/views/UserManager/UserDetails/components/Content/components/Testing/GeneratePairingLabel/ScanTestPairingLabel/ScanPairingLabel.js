import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QrReader from 'react-qr-reader';
// import QrScanner from 'react-qr-scanner';
// import { Html5QrcodeScannerPlugin } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, Dialog, DialogContent, CircularProgress } from '@material-ui/core';
import brandStyles from 'theme/brand';
// import { FlipCamera } from 'icons';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import { updateUserTesting } from 'actions/api';

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
  fixScanText: {
    color: theme.palette.brandDark,
    marginTop: theme.spacing(4)
  },
  gridBody: {
    marginTop: theme.spacing(8)
  },
  scanIcon: {
    marginTop: theme.spacing(12),
    color: theme.palette.brand,
    fontSize: 100
  },
  scanLabel: {
    color: theme.palette.brandGray,
    textAlign: 'center'
  },
  scanSuccess: {
    marginTop: 167,
    color: theme.palette.brandGray,
    textAlign: 'center'
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(8),
  },
  cornerBorder: {
    width: 380,
    height: 380,
    background:
      `linear-gradient(to right, ${theme.palette.brand} 5px, transparent 5px) 0 0,
      linear-gradient(to right, ${theme.palette.brand} 5px, transparent 5px) 0 100%,
      linear-gradient(to left, ${theme.palette.brand} 5px, transparent 5px) 100% 0,
      linear-gradient(to left, ${theme.palette.brand} 5px, transparent 5px) 100% 100%,
      linear-gradient(to bottom, ${theme.palette.brand} 5px, transparent 5px) 0 0,
      linear-gradient(to bottom, ${theme.palette.brand} 5px, transparent 5px) 100% 0,
      linear-gradient(to top, ${theme.palette.brand} 5px, transparent 5px) 0 100%,
      linear-gradient(to top, ${theme.palette.brand} 5px, transparent 5px) 100% 100%;`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '50px 50px',
  },
  dialogRoot: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
  successTitle: {
    color: theme.palette.brandGreen,
  },
  checkIcon: {
    width: 100
  },
  paringCompletedText: {
    color: theme.palette.brandText,
    margin: theme.spacing(4)
  },
  qrReader: {
    position: 'relative',
    top: 9.5,
    width: '95%',
  }
}));

const ScanTestPairingLabel = (props) => {
  const { nextTab, previousTab, updateUserTesting, testing } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [isPairSuccess, setIsPairSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [displayError, setDisplayError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = async () => {
    if (isPairSuccess) {
      nextTab();
    } else {
      setDisplayError('Please Pair Test KIT to continue');
    }
  }

  const handleDialogNext = () => {
    setDialogOpen(false);
    nextTab();
  }

  const handleDialogClose = () => {
    setAlertDialogOpen(false);
  }

  const handleScan = async (data) => {
    if (data) {
      console.log('QR code data:', data);
      if (data === testing.testkit_id) {
        setIsPairSuccess(true);
        let body = {
          paired: true
        }
        setLoading(true);
        const res = await updateUserTesting(testing._id, body);
        setLoading(false);
        if (res.success) {
          setDialogOpen(true);
        }
      } else {
        setAlertDialogOpen(true);
        setAlertDialogMessage('You have scanned Invalid Test Kit QR code');
      }
    }
  }

  const handleError = err => {
    setAlertDialogOpen(true);
    let message = err.message ? err.message : JSON.stringify(err);
    setAlertDialogMessage(message + '. Please try in different browser.');
  }

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <>
            <img src="/images/svg/status/users_icon.svg" alt="" />
            {'User Manager'} |
          </>
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>
          {'CHECK-IN/SCAN TEST PAIRING LABEL'}
        </Typography>
      </div>
      <Grid
        className={classes.gridBody}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <div className={classes.cornerBorder}>
          <Grid container direction="column" justify="center" alignItems="center" >
            {/* <FlipCamera className={classes.scanIcon} />
            <Typography variant="h2" className={classes.scanLabel}>
              Scan pairing <br></br> label
            </Typography> */}
            {isPairSuccess
              ?
              <Typography variant="h2" className={classes.scanSuccess}>
                {"Pair Success"}
              </Typography>
              :
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                className={classes.qrReader}
              />
              // <QrScanner
              //   delay={300}
              //   style={{ height: 380, width: 380 }}
              //   onError={handleError}
              //   onScan={handleScan}
              // />
              // <Html5QrcodeScannerPlugin
              //   fps={10}
              //   qrBox={250}
              //   disableFlip={false}
              //   qrCodeSuccessCallback={handleScan}
              //   // qrCodeErrorCallback={handleError}
              // />
            }
          </Grid>
        </div>
        <Typography variant="h2" className={classes.fixScanText}>
          Affix label to test kit first, <br />
          then scan test kit label.
        </Typography>
      </Grid>

      <div className={classes.footer}>
        <Grid>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={previousTab}
              >
                {'BACK'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                onClick={handleNext}
              >
                {'NEXT'} {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogNext}
      >
        <DialogContent
          className={classes.dialogRoot}
        >
          <Grid container direction="column" justify="center" alignItems="center" >
            <Typography variant="h2" className={classes.successTitle}>
              {'SUCCESS!'}
            </Typography>
            <img src="/images/svg/check_round.svg" alt="" className={classes.checkIcon} />
            <Typography variant="h4" className={classes.paringCompletedText}>
              {'Pairing completed'}
            </Typography>
            <Button
              className={brandClasses.button}
              onClick={handleDialogNext}
            >
              {'NEXT'}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      <DialogAlert
        open={alertDialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

ScanTestPairingLabel.prototype = {
  nextTab: PropTypes.func.isRequired,
  previousTab: PropTypes.func.isRequired,
  updateUserTesting: PropTypes.func.isRequired,
  testing: PropTypes.object.isRequired,
};

export default connect(null, { updateUserTesting })(ScanTestPairingLabel);
