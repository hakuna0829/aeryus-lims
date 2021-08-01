import React from 'react';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
  Grid
  // CircularProgress
} from '@material-ui/core';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0
  },
  subHeader: {
    // display: 'flex',
    // alignItems: 'baseline',
    // justifyContent: 'center'
    fontFamily: 'Montserrat',
    fontSize: '28px',
    fontWeight: 500,
    color: theme.palette.brandGreen,
    textAlign: 'center'
  },
  headerTitle: {
    color: theme.palette.blueDark
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  container: {
    // margin:0

    '& > .MuiGrid-item': {
      padding: '7px',
      paddingTop: 15
    }
  },
  cardTitle: {
    // padding: '10px 20px',
    fontSize: '18px',
    lineHeight: '25px',
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'center'
  },
  cardContent: {
    padding: '10px 20px',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '185px'
    },
    [theme.breakpoints.between(1200, 1278)]: {
      height: '180px'
    },
    [theme.breakpoints.down(900)]: {
      height: '100%'
    }
  },
  dialogContentRoot: {
    padding: '0px 24px 16px  !important',
    flexGrow: 1
  },
  dialogPaper: {
    maxWidth: '500px',
    width: '500px',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    [theme.breakpoints.up('lg')]: {
      maxWidth: '500px !important',
      width: '500px'
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '450px !important'
      // width: '1220px',
    },
    [theme.breakpoints.down('sm')]: {}
  },
  statusIcon: {
    width: '90px'
  }
}));

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(0)
  }
}))(MuiDialogContent);

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.header} {...other}>
      <div>{children}</div>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogSuccess = props => {
  const classes = useStyles();
  // const brandClasses = brandStyles();

  const handleClose = () => {
    props.toggleDlg(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.isShow}
      // className={classes.root}
      classes={{ paper: classes.dialogPaper }}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div className={classes.subHeader}>SUCCESS!</div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <Grid container className={classes.container}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img
              src="/images/svg/status/check_green.svg"
              alt=""
              className={classes.statusIcon}
            />
          </Grid>

          <Grid item xs={12}>
            <div className={classes.cardTitle}>
              Patient has been successfully <br />
              notified of their test results.
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

DialogSuccess.propTypes = {};

export default connect(null, {})(DialogSuccess);
