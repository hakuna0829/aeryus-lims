import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Grid, Typography, Divider, RadioGroup } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useReactToPrint } from 'react-to-print';
import { Print } from 'icons';
import moment from "moment";
import { apiUrl } from 'actions/api';
import RadioRoundCheckButton from 'components/RadioRoundCheckButton';

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
  subContent: {
    width: 790,
    margin: '0 auto'
  },
  radioItem1: {
    minWidth: '40%',
    margin: '0 auto'
  },
}));

const AuthorizationForReleaseOfHealthInformation = props => {
  const { open, data, onClose } = props;

  const classes = useStyles();
  const [formState, setFormState] = React.useState({
    health_reason_disclosure : data.health_info_release_auth?.reason_for_disclosure,
    health_auth_release : data.health_info_release_auth?.authorize_to_release
  });

  const componentRef = useRef();

  const printDoc = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleChange = (e) => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]:e.target.value}));
  }

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
          <Typography variant="h4" className={classes.cardTitle}>AUTHORIZATION FOR RELEASE OF HEALTH INFORMATION</Typography>
          <Grid container className={classes.container} >
            <Grid item xs={12} md={6}>
              <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                <Grid item className={classes.cardContentItem}>
                  <Typography className={classes.cardContentLabel}>Name:</Typography>
                  <Typography className={classes.cardContentValue}>
                    {data.dependent_id ? data.dependent_id.first_name : data.user_id.first_name}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.cardContentItem}
                  item
                >
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
                  <Typography className={classes.cardContentValue}>{data.date && moment(data.date).format('MM/DD/YYYY')}</Typography>
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
          <br />

          <Typography variant="h4" className={classes.contentText}>
            I Authorize Complete Health Records be Released and Provided to:
          </Typography>
          <br />
          <Grid container direction="column" justify="center">
            <Grid item className={classes.cardContentItem}>
              <Typography className={classes.cardContentLabel}>Organization:</Typography>
              <Typography className={classes.cardContentValue}>{data.health_info_release_auth && data.health_info_release_auth.organization}</Typography>
            </Grid>
            <Grid item className={classes.cardContentItem}>
              <Typography className={classes.cardContentLabel}>Address:</Typography>
              <Typography className={classes.cardContentValue}>{data.health_info_release_auth && data.health_info_release_auth.address}</Typography>
            </Grid>
            <Grid item className={classes.cardContentItem}>
              <Typography className={classes.cardContentLabel}>Phone: </Typography>
              <Typography className={classes.cardContentValue}>{data.health_info_release_auth && data.health_info_release_auth.phone}</Typography>
            </Grid>
            <Grid item className={classes.cardContentItem}>
              <Typography className={classes.cardContentLabel}>Date of Request: </Typography>
              <Typography className={classes.cardContentValue}>{data.health_info_release_auth && moment(data.health_info_release_auth.dates_of_medical_record_requested).format('MM/DD/YYYY')}</Typography>
            </Grid>
          </Grid>

          <br />
          <Divider className={classes.divider} />
          <br />

          <Typography variant="h4" className={classes.contentText}>
            Reason for Disclosure
          </Typography>
          <br />
          <Grid container direction="column" justify="center" alignItems="center">
            <RadioGroup
              name='health_reason_disclosure'
              value={formState.health_reason_disclosure}
              onChange={(e) => handleChange(e)}
              style={{ flexDirection: 'unset' }}
            >
              <RadioRoundCheckButton label='Continuing Care' value='Continuing Care' />
              <RadioRoundCheckButton label='Insurance' value='Insurance'/>
              <RadioRoundCheckButton label='Legal' value='Legal' />
              <RadioRoundCheckButton label='Personal Use' value='Personal Use' />
              <RadioRoundCheckButton label='Other Reason' value='Other Reason'/>
            </RadioGroup>
          </Grid>

          <br />
          <Divider className={classes.divider} />
          <br />

          <div className={classes.subContent}>
            <Typography variant="h5" className={classes.contentText}>
              The following information will not be released <br />
              unless you specifically authorize it by marking the relevant box(es) below:
            </Typography>
            <br />
            <RadioGroup
              name="health_auth_release"
              value={formState.health_auth_release}
              onChange={(e) => handleChange(e)}
              style={{ flexDirection: 'unset' }}
            >
              <RadioRoundCheckButton label='Drug/Alcohol abuse or treatment' value='Drug/Alcohol abuse or treatment' className={classes.radioItem1} />
              <RadioRoundCheckButton label='HIV/AIDS Test Results or Diagnoses' value='HIV/AIDS Test Results or Diagnoses' className={classes.radioItem1} />
              <RadioRoundCheckButton label='Genetic Testing Information' value='Genetic Testing Information' className={classes.radioItem1} />
              <RadioRoundCheckButton label='COVID-19 Test Results' value='COVID-19 Test Results' className={classes.radioItem1} />
            </RadioGroup>
            <br />
            <Typography variant="h5" className={classes.contentText}>
              This consent is subject to revocation at any time to the extent the action has been taken thereon. <br />
              This authorization and consent will expire one year from the date of authorization written below. <br />
              Your health care (or payment for care) will not be affected by whether or not you sign this authorization. <br />
              Once your health care information is released, redisclosure of your health care <br />
              information by the Recipient may no longer be protected by law. <br />
            </Typography>
          </div>

          <br /><br />
          {data.health_info_release_auth && data.health_info_release_auth.signature &&
            <div className={classes.boxContainer}>
              <img src={apiUrl + data.health_info_release_auth.signature} alt="signature" />
            </div>
          }

          <br /><br />
          <Grid container direction="column" justify="center" alignItems="center" >
            {data.health_info_release_auth && data.health_info_release_auth.submitted_timestamp &&
              <Grid item className={classes.cardContentItem}>
                <Typography className={classes.cardContentLabel}>Date/Time Stamp: </Typography>
                <Typography className={classes.cardContentValue}>{moment(data.health_info_release_auth.submitted_timestamp).format('MM/DD/YYYY h:mm A')}</Typography>
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

AuthorizationForReleaseOfHealthInformation.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthorizationForReleaseOfHealthInformation;