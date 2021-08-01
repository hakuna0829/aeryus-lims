import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, CircularProgress, Dialog, DialogContent } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import brandStyles from 'theme/brand';
import clsx from 'clsx';

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
      <div variant="h6">{children}</div>
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
    padding: '25px 156px',
  },
  statusSvg: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    paddingBottom: 10
  },
  successTitle: {
    textAlign: 'center',
    color: theme.palette.brandGreen,
    paddingBottom: 10
  },
  failedTitle: {
    textAlign: 'center',
    color: theme.palette.brandRed,
    paddingBottom: 10
  },
  dialogMessage: {
    textAlign: 'center',
    whiteSpace: 'pre-line'
  }
}));

const ResendDialog = (props) => {
  const { dialogOpen, handleDialogClose, notification_id, saveLoading, handleResend, success, message } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle onClose={handleDialogClose} className={brandClasses.headerContainer}></DialogTitle>

        <DialogContent
          className={classes.dialogRoot}
        >
          {success
            ?
            <>
              <Typography variant="h2" className={classes.successTitle}>
                {'SUCCESS!'}
              </Typography>
              <img src="/images/svg/status/check_green.svg" alt="" className={classes.statusSvg} />
            </>
            :
            <>
              <Typography variant="h2" className={classes.failedTitle}>
                {'FAILED'}
              </Typography>
              <img src="/images/svg/status/cross_red.svg" alt="" className={classes.statusSvg} />
            </>
          }
          <br />

          <Typography variant="h5" className={classes.dialogMessage}>
            {message}
          </Typography>

          <br />

          {!success &&
            <div className={classes.footer}>
              <Grid>
                <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
                  <Grid item>
                    <Button
                      className={clsx(brandClasses.button, brandClasses.whiteButton)}
                      classes={{ disabled: brandClasses.buttonDisabled }}
                      onClick={() => handleResend(notification_id)}
                      disabled={saveLoading}
                    >
                      {'TRY AGAIN'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};

ResendDialog.prototype = {
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default ResendDialog;
