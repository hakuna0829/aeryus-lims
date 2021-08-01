import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useReactToPrint } from 'react-to-print';
import { Print } from 'icons';
import moment from "moment";
import { apiUrl } from 'actions/api';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  uploadButton: {
    color: theme.palette.brandDark,
  },
  printButton: {
    color: theme.palette.blueDark,
  },
  closeButton: {
    color: theme.palette.grey[500],
  },

});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, printDoc, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.header} {...other}>
      <div>{children}</div>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-start"
      >
        <IconButton className={classes.printButton} onClick={printDoc}>
          <Print />
        </IconButton>
        <IconButton className={classes.uploadButton}>
          <img src='/images/svg/upload_icon.svg' alt='upload_icon' width="18" />
        </IconButton>
        {onClose ? (
          <IconButton className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </Grid>
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    maxWidth: '1000px',
    width: '1000px',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    [theme.breakpoints.up('lg')]: {
      maxWidth: '1000px !important',
      width: '1000px',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '800px !important',
      // width: '1220px',
    },
    [theme.breakpoints.down('sm')]: {

    },
  },
  dialogContent: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  container: {
    '& > .MuiGrid-item': {
      padding: '7px',
      paddingTop: 15
    }
  },
  cardTitle: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
  },
  cardContentItem: {
    display: 'flex',
    direction: 'row',
    marginBottom: 12,
    paddingRight: 10,

    '& > p:first-child': {
      marginRight: 8
    }
  },
  cardContentLabel: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 600,
    [theme.breakpoints.up('md')]: {
      fontSize: '16px'
    },
    [theme.breakpoints.down(1400)]: {
      fontSize: '14px'
    },
    [theme.breakpoints.down(1200)]: {
      fontSize: '11px'
    },
  },
  cardContentValue: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 400,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    [theme.breakpoints.up('md')]: {
      fontSize: '16px'
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '14px'
    },
  },
  divider: {
    margin: 'auto',
    width: '100%',
    height: 1.5,
    backgroundColor: theme.palette.brandDark,
  },
  contentText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
  },
  boxContainer: {
    width: 300,
    height: 110,
    margin: '0 auto',
    border: '#0F84A9 solid 1px',
    borderRadius: '6px',
    [theme.breakpoints.up(376)]: {
      width: 300,
    }
  },
}));

const PatientApprovalToBeTested = props => {
  const { open, data, onClose } = props;

  const classes = useStyles();

  const componentRef = useRef();

  const printDoc = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle
          onClose={onClose}
          printDoc={printDoc}
        >
        </DialogTitle>
        <DialogContent
          className={classes.dialogContent}
          ref={componentRef}
        >
          <Typography variant="h4" className={classes.cardTitle}>PATIENT APPROVAL TO BE TESTED</Typography>
          <Grid container className={classes.container} >
            <Grid item xs={12} md={6}>
              <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Name:</Typography>
                  <Typography className={classes.cardContentValue}>
                    {data.dependent_id ? data.dependent_id.first_name : data.user_id.first_name}
                  </Typography>
                </Grid>
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>DB:</Typography>
                  <Typography className={classes.cardContentValue}>
                    {data.dependent_id
                      ?
                      moment.utc(data.dependent_id.dob).format('MM/DD/YYYY')
                      :
                      data.user_id.dob && moment.utc(data.user_id.dob).format('MM/DD/YYYY')
                    }
                  </Typography>
                </Grid>
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Test Kit ID: </Typography>
                  <Typography className={classes.cardContentValue}>{data.testkit_id}</Typography>
                </Grid>
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Session ID: </Typography>
                  <Typography className={classes.cardContentValue}>{data.test_session_id}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} >
              <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Test Date: </Typography>
                  <Typography className={classes.cardContentValue}>{data.collected_timestamp && moment.utc(data.collected_timestamp).format('MM/DD/YYYY')}</Typography>
                </Grid>
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Location: </Typography>
                  <Typography className={classes.cardContentValue}>{data.location_id && data.location_id.name}</Typography>
                </Grid>
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Test Result: </Typography>
                  <Typography className={classes.cardContentValue}>{data.result}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <br />
          <Divider className={classes.divider} />
          <br /><br />

          <Typography variant="h5" className={classes.contentText}>
            By signing this you give the medical technician permission to draw your blood for testing. <br /><br />

            You will be notified of your test results 24-48 hours on the TESTD | ID app.
            Please make sure you download it.
          </Typography>

          <br /><br />
          {data.user_id && data.user_id.signature &&
            <div className={classes.boxContainer}>
              <img src={apiUrl + data.user_id.signature} alt="signature" />
            </div>
          }
          <br /><br />
          <Grid container direction="column" justify="center" alignItems="center" >
            {/* <Grid item className={classes.cardContentItem}>
              <Typography className={classes.cardContentLabel}>Date/Time Stamp: </Typography>
              <Typography className={classes.cardContentValue}>{moment(data.date).format('MM/DD/YYYY')} / {moment(data.time, 'HH:mm').format('h:mm A')}</Typography>
            </Grid> */}
            <Grid item className={classes.cardContentItem}>
              <Typography className={classes.cardContentLabel}>Session ID: </Typography>
              <Typography className={classes.cardContentValue}>{data.test_session_id}</Typography>
            </Grid>
          </Grid>
          <br /><br />
          <br /><br />
        </DialogContent>
      </Dialog>
    </div>
  )
}

PatientApprovalToBeTested.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PatientApprovalToBeTested;