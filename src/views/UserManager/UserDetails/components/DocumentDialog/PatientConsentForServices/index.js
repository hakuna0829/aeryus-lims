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
  privacy: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    // font- size: 16px;
    fontWeight: 500,
    '& span': {
      fontWeight: 600,
    }
  },
}));

const PatientConsentForServices = props => {
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
          <Typography variant="h4" className={classes.cardTitle}>PATIENT RULES AND RESPONSIBILITIES</Typography>
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

          <Typography variant='h5' className={classes.privacy}>
            Benefits to the Intake Questionnaire: Intake may be administered by a Medical Case Manager (MCM) or Non-Medical Case Manager (NMCM) to evaluate the area of needs, treatment and medications management. It may be beneficial to you, as well as the referring professional, to understand the cause of any difficulties affecting my daily Functioning, so that appropriate recommendations and services may be offered.
            <br /> <br />
            Uses of this questionnaire: Referral to Specialists, Evaluation for Support Services, Mental Health and/or Substance Abuse Planning and Education.
            <br /> <br />
            Possible benefits of services: include improved socio-economic status, job performance, health status, quality of life and awareness of spreading any diseases.
            <br /> <br />
            Right to Withdraw Consent: I have the right to withdraw my consent for services and/or treatment at any time verbally or in writing.
            <br /> <br />
            Right to Treatment: I also attest that I have the right to consent for treatment.
            <br /> <br />
            I understand that this authorization is voluntary and that I may refuse to sign this authorization. My refusal to sign will not affect my ability to obtain treatment, or eligibility for benefits, unless allowed by law.
            <br /> <br />
            I have read and understand the above, I have had an opportunity to ask questions about this information, and I consent to the service, referral,
            follow-up and treatment if offered.
          </Typography>

          <br /><br />
          {data.consent_for_services && data.consent_for_services.signature &&
            <div className={classes.boxContainer}>
              <img src={apiUrl + data.consent_for_services.signature} alt="signature" />
            </div>
          }
          <br /><br />
          <Grid container direction="column" justify="center" alignItems="center" >
            {data.consent_for_services && data.consent_for_services.submitted_timestamp &&
              <Grid item className={classes.cardContentItem}>
                <Typography className={classes.cardContentLabel}>Date/Time Stamp: </Typography>
                <Typography className={classes.cardContentValue}>{moment(data.consent_for_services.submitted_timestamp).format('MM/DD/YYYY h:mm A')}</Typography>
              </Grid>
            }
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

PatientConsentForServices.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PatientConsentForServices;