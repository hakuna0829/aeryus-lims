import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import * as appConstants from 'constants/appConstants';
import DialogAlert from 'components/DialogAlert';
import QrReader from 'react-qr-reader';
import { CircularProgress, Dialog, DialogContent, Grid, IconButton, Typography } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  dialogRoot: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
  dialogPaper: {
    maxWidth: '720px',
    width: '720px',
  },
  qrReader: {
    position: 'relative',
    top: 9.5,
    width: '95%',
  },
}));

const QrReaderDialog = props => {
  const { dialogOpen, handleDialogClose, loading } = props;

  const classes = useStyles();

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  const handleScan = async (data) => {
    if (data) {
      console.log('QR code data:', data);
      handleDialogClose({ data });
    }
  }

  const handleError = err => {
    setAlertDialogOpen(true);
    let message = err.message ? err.message : JSON.stringify(err);
    setAlertDialogMessage(message + '. Please try in different browser.');
  }

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  }

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle
          onClose={handleDialogClose}
          children={'Scan the Rapid Pass QR Code'}
        >
        </DialogTitle>
        <DialogContent
          className={classes.dialogRoot}
        >
          <Grid container direction="column" justify="center" alignItems="center" >
            {loading
              ?
              <CircularProgress />
              :
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                className={classes.qrReader}
              />
            }
          </Grid>
        </DialogContent>
      </Dialog>

      <DialogAlert
        open={alertDialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleAlertDialogClose}
      />
    </div>
  );
};

QrReaderDialog.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default QrReaderDialog;
