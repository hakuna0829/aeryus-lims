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
  privacyLabelingContainer: {
    display: 'flex',
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
  privacyIndent: {
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    marginLeft: 10,
    // font- size: 16px;
    fontWeight: 500,
    '& span': {
      fontWeight: 600,
    }
  },
}));

const PatientRulesAndResponsibilites = props => {
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
            <span><b>TESTD | MD</b> Staff very much wants to make your experience a safe and comfortable one. This begins with the relationship between the patient and staff, which is based on mutual respect. The following rules must be adhered to whenever you visit the Clinic.</span>
            <br /><br />
            <span>In order to ensure the safety and welfare of all our participants, we ask that all patients, staff and volunteers comply with the following:</span>
            <br /><br />
          </Typography>
          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy} >
              Conduct yourself in an appropriate, non-disruptive and non-threatening manner.
              Physical violence, threats of physical violence or sexual harassment will not be tolerated.
                </Typography>
          </div><br />
          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy} >
              Do not use discriminatory statements regarding gender, race, color, creed, religious
              affiliation, ancestry, national origin, physical handicap, medical condition, marital status,
              age, and sexual orientation.
                </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Do not come to the Clinic under the influence of alcohol or other non-prescribed substances.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Do not bring alcohol and/or illegal drugs or drug paraphernalia on-site.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Do not come to the Clinic with weapons on your person.
              </Typography>
          </div><br />

          <Typography variant='h5' className={classes.privacy}>
            <span>To maximize <b>TESTD | MD</b> services and operations, please adhere to the following:</span>
          </Typography><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Be honest when answering questions. Do not give false information regarding identity, HIV
              status, residency, or income.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Supply requested documentation in a timely manner in order to verify your eligibility and
              inform staff of any changes in a timely manner.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Arrive on time for all appointments and call to cancel or reschedule appointments.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Actively participate in the development of the Medical Treatment Plan/Care Plan
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              If you miss more than three (3) consecutive appointments, your provider may decide that it
              is unsound medically to continue your course of treatment without adequate follow up visits
              and, therefore, may discontinue your enrollment, with referral to another facility.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              If we do not hear from you within six-month period, your file may be considered inactive,
              necessitating reprocessing as a new patient should you decide to return to <b>TESTD | MD</b>.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Make sure that you have enough medication to last until your next appointment.
              </Typography>
          </div><br />

          <Typography variant='h5' className={classes.privacy}>
            <span>While a patient is at <b>TESTD | MD</b>, it is necessary to adhere to the rules of our medical office building.</span>
          </Typography><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              There is no smoking anywhere including hallways and restrooms.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Patients are responsible for their own property. The office shall not be liable for loss or
              damage to personal property.
              </Typography>
          </div><br />

          <div className={classes.privacyLabelingContainer} >
            <Typography variant='h5' className={classes.privacyIndent}>•&ensp; </Typography>
            <Typography variant='h5' className={classes.privacy}>
              Patients are to refrain from eating or drinking anything not provided by the office in the
              waiting room.
              </Typography>
          </div>

          <br /><br />
          {data.patient_rules_responsibilities && data.patient_rules_responsibilities.signature &&
            <div className={classes.boxContainer}>
              <img src={apiUrl + data.patient_rules_responsibilities.signature} alt="signature" />
            </div>
          }
          <br /><br />
          <Grid container direction="column" justify="center" alignItems="center" >
            {data.patient_rules_responsibilities && data.patient_rules_responsibilities.submitted_timestamp &&
              <Grid item className={classes.cardContentItem}>
                <Typography className={classes.cardContentLabel}>Date/Time Stamp: </Typography>
                <Typography className={classes.cardContentValue}>{moment(data.patient_rules_responsibilities.submitted_timestamp).format('MM/DD/YYYY h:mm A')}</Typography>
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

PatientRulesAndResponsibilites.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PatientRulesAndResponsibilites;