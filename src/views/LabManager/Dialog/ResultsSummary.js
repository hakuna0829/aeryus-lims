import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  Typography,
  Grid,
  CircularProgress,
  Button,
  Box,
  // CircularProgress 
} from '@material-ui/core';
import moment from "moment";
import 'moment-timezone';
import brandStyles from 'theme/brand';
import CheckButton from 'components/CheckButton';
import Alert from '@material-ui/lab/Alert';
// import SignaturePad from 'react-signature-canvas';
// import clsx from 'clsx';
import { CheckMark, Document } from 'icons';
import { apiUrl, getTestingResultsSummary, resendTestingResultsSummary } from 'actions/api';
import DocumentDialog from 'views/UserManager/UserDetails/components/DocumentDialog';
import { showErrorDialog } from 'actions/dialogAlert';

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

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0

  },
  subHeader: {
    display: 'flex',
    alignItems: 'baseline'
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
    padding: '10px 20px',
    fontSize: '18px',
    background: '#0F84A9',
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    letterSpacing: 0,

    // '&:first-child': {
    //     borderLeft: 0
    // },
    // '&:last-child': {
    //     borderRight: 0
    // },
    // [theme.breakpoints.up('lg')]: {
    //     maxWidth: '1600px',
    //     width: '1620px',
    // },
    // [theme.breakpoints.between('md', 'lg')]: {
    //     maxWidth: '1200px',

    //     // width: '1220px',
    // },
    // [theme.breakpoints.down('sm')]: {
    //     borderLeft: 0
    // },
  },
  cardContent: {
    padding: '10px 20px',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: 230,
    },
    [theme.breakpoints.between(1200, 1278)]: {
      height: 180,
    },
    [theme.breakpoints.down(900)]: {
      height: '100%',
    },

  },
  cardContent2: {
    padding: 0,
    height: '100%',
    // [theme.breakpoints.up('md')]: {
    //   height: 230,
    // },
    // [theme.breakpoints.between(1200, 1278)]: {
    //   height: 180,
    // },
    // [theme.breakpoints.down(900)]: {
    //   height: '100%',
    // },
  },
  cardContentTitle: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontSize: '18px',
    fontWeight: 600,
    paddingBottom: 6
  },
  cardContentTitle2: {
    color: '#FFF',
    backgroundColor: '#82BDD1',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 10px 20px',
    marginTop: 20,
    '& > p': {
      color: '#FFFFFF',
      fontFamily: 'Montserrat',
      fontSize: 18,
      fontWeight: 500,
    },
    '& img': {
      width: 15,
      cursor: 'pointer'
    }
  },
  cardContentTitle3: {

    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 10px 20px',
    '& h4': {
      color: '#043B5D',
      fontWeight: 600,
    },
    '& h5': {
      color: '#043B5D',
      fontWeight: 500,
    }
  },
  cardContentDivider: {
    width: '90%',
    height: 20,
    borderTop: 'solid 1px #0F84A9'
  },
  cardContentDivider2: {
    width: '95%',
    height: 10,
    borderTop: 'solid 1px #0F84A9',
    margin: '5px 0px'
  },
  cardContentItem: {
    display: 'flex',
    marginBottom: 12,
    paddingRight: 10,

    '& > p:first-child': {
      marginRight: 8
    }
  },
  cardContentLabel: {
    color: '#0F84A9',
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
    color: '#0F84A9',
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
  cardContentValue2: {
    color: '#9B9B9B',
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
  cardDesc: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontSize: '20px',
    fontWeight: 600,
    padding: '15px 20px 40px',
    border: 'solid 4px #0F84A9',
    borderTop: 0,
    borderRight: 0,
    borderBottom: 0,
    '&:first-child': {
      borderLeft: 0
    },
    '&:last-child': {
      borderRight: 0
    },
    [theme.breakpoints.between('md', 'lg')]: {

    },
    [theme.breakpoints.down('sm')]: {
      borderLeft: 0,
      borderBottom: 'solid 4px #0F84A9',
    },
  },

  consentContainer: {
    display: 'flex',
    padding: '7px 15px 9px',
    '& h4': {
      color: '#0F84A9'
    }
  },

  checkMark: {
    width: 25,
    marginRight: 15,
    color: theme.palette.brandGreen,
    [theme.breakpoints.down(1200)]: {
      marginRight: 10,
      width: 20
    },
  },

  closeMark: {
    width: 25,
    marginRight: 15,
    color: theme.palette.brandRed,
    [theme.breakpoints.down(1200)]: {
      marginRight: 10,
      width: 20
    },
  },

  naMark: {
    color: theme.palette.brandOrange,
    marginRight: 15,
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

  documentIcon: {
    marginLeft: 10,
    color: theme.palette.brandDark,
    cursor: 'pointer',
    [theme.breakpoints.down(1200)]: {
      marginLeft: 5,
      width: 20
    },
  },

  dialogContentRoot: {
    padding: '16px 24px !important',
    flexGrow: 1,
    // '&:first-child': {
    //     padding: 0
    // }
  },
  dialogPaper: {
    maxWidth: '1600px',
    width: '1600px',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    [theme.breakpoints.up('lg')]: {
      maxWidth: '1600px !important',
      width: '1600px',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '1200px !important',
      // width: '1220px',
    },
    [theme.breakpoints.down('sm')]: {

    },

  },

  cardContainer: {
    margin: 0,
    border: 'solid 1px #0f83a8',
    borderRadius: '5px',
    paddingBottom: '20px'
  },

  cardContainer2: {
    margin: 0,
    border: 'solid 1px #0f83a8',
    borderRadius: '5px'
  },

  boxContanier: {
    // height: 218,
    border: `solid 1px`,
    borderColor: theme.palette.brandDark,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  boxContanierHeight: {
    height: 150,
  },
  boxContanierWidth2: {
    margin: '0 auto',
    width: 150
  },
  boxTitle: {
    color: theme.palette.brandDark,
    fontWeight: 400,
    fontSize: 12,
    position: 'absolute',
    top: -10,
    background: '#fff',
    padding: '0 4px'
  },
  sigPad: {
    width: '100%',
    height: '100%'
  },
  uploadedPhoto: {
    maxWidth: 358,
    maxHeight: 358,
    paddingTop: 20
  },
  qrcode: {
    width: '358px !important',
    height: '358px !important',
    paddingTop: 20
  },
  checkIcon: {
    color: theme.palette.brandGreen,
    marginLeft: 10
  },
  cancelIcon: {
    color: theme.palette.brandRed
  }, blueBtn: {
    backgroundColor: theme.palette.brandDark,
    color: theme.palette.white,
    textTransform: 'uppercase',
    fontSize: '16px',
    borderRadius: '7px',
    padding: '12px 28px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  checkboxLabelRoot: {
    marginRight: '6px'
  }

}))

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiDialogContent);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.header} {...other}>
      <div  >{children}</div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ResultsSummary = props => {
  const { testing_id, isShow, toggleDlg, getTestingResultsSummary, showErrorDialog } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [documentDialogType, setDocumentDialogType] = useState(null);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [resendloading, setResendLoading] = useState(false);
  const [showcheckbox, setShowCheckbox] = useState(false);
  const [resenddata, setResendData] = useState({ "email": true, "sms": true })
  const [disablesubmit, setDisableSubmit] = useState(null);

  useEffect(() => {
    if (testing_id && isShow) {
      setData({});
      (async () => {
        setLoading(true);
        const res = await getTestingResultsSummary(testing_id);
        setLoading(false);
        if (res.success) {
          setData(res.data || {});
        }
      })();
    }
  }, [testing_id, getTestingResultsSummary, isShow]);

  const handleClose = () => {
    toggleDlg(false);
  };

  const handleDocumentDialogClose = () => {
    setOpenDocumentDialog(false);
  };

  const handleDocumentDialogOpen = (type) => {
    setDocumentDialogType(type);
    setOpenDocumentDialog(true);
  };
  const handleSubmit = () => {
    if (!resenddata.email && !resenddata.sms) {
      setDisableSubmit("Select alteast one field")
      return;
    }
    setDisableSubmit(null)
    setResendLoading(true);
    resendTestingResultsSummary(testing_id, resenddata).then(res => {
      setResendLoading(false);
      setShowCheckbox(false);
      if (res.data.success) {
        setData(data => ({
          ...data,
          email_sent: res.data.data.email_sent,
          sms_sent: res.data.data.sms_sent
        }));
      }

    }).catch(error => {
      setLoading(false);
      setResendLoading(false);
      showErrorDialog(error);
      setShowCheckbox(false);
    })
  }
  const handelResend = () => {
    setShowCheckbox(true)
  }
  const handleChange = (event) => {
    event.persist();
    setResendData(resenddata => ({
      ...resenddata,
      [event.target.name]: event.target.checked
    }));
    handelResendButton();
  }
  const handelResendButton = () => {


  }

  const PatientDocsMark = (props) => {
    return (
      (loading || !data.client_id)
        ?
        <CircularProgress size={20} className={brandClasses.progressSpinner} />
        :
        data.client_id.form_settings
          ?
          data.client_id.form_settings[props.formKey]
            ?
            typeof props.dataKey === 'string' && !data[props.dataKey]
              ?
              <CloseIcon className={classes.closeMark} />
              :
              <CheckMark className={classes.checkMark} />
            :
            <Typography className={classes.naMark}>N/A</Typography>
          :
          typeof props.dataKey === 'string' && !data[props.dataKey]
            ?
            <CheckMark className={classes.checkMark} />
            :
            <CloseIcon className={classes.closeMark} />
    )
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isShow}
      // className={classes.root}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div className={classes.subHeader} >
          <Typography variant="h2" className={brandClasses.headerTitle}>
            <img src="/images/svg/results_icon.svg" alt="" />
            {'RESULTS MANAGER | '}
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>RESULTS SUMMARY</Typography>
          {loading && <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />}
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <Grid container className={classes.container} >
          <Grid item xs={12} md={6}  >
            <div className={classes.cardContainer}>
              <div className={classes.cardTitle} >
                {'PATIENT INFORMATION'}
              </div>
              <div className={classes.cardContent}>
                <Typography variant="h4" className={classes.cardContentTitle}>
                  {data.dependent_id
                    ? (
                      data.dependent_id.first_name + ', ' + data.dependent_id.last_name
                    ) :
                    data.user_id && (
                      data.user_id.first_name + ', ' + data.user_id.last_name
                    )
                  }
                </Typography>
                <Typography className={classes.cardContentDivider}>&nbsp;</Typography>
                <Grid container >
                  <Grid item md={5} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Test Date:</Typography>
                    <Typography className={classes.cardContentValue}>{data.collected_timestamp && moment.utc(data.collected_timestamp).format('MM/DD/YYYY')}</Typography>
                  </Grid>
                  <Grid item md={7} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Location:</Typography>
                    <Typography className={classes.cardContentValue}>{data.location_id && data.location_id.name}</Typography>
                  </Grid>
                  <Grid item md={5} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Test Type: </Typography>
                    <Typography className={classes.cardContentValue}>{data.test_type}</Typography>
                  </Grid>
                  <Grid item md={7} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Test Kit ID: </Typography>
                    <Typography className={classes.cardContentValue}>{data.testkit_id}</Typography>
                  </Grid>
                  <Grid item md={5} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Test Result: </Typography>
                    <Typography className={classes.cardContentValue}>{data.result}</Typography>
                  </Grid>
                  <Grid item md={7} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Session ID: </Typography>
                    <Typography className={classes.cardContentValue}>{data.test_session_id}</Typography>
                  </Grid>
                  <Grid item md={5} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>Communication Method: </Typography>
                  </Grid>
                  <Grid item md={7} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentValue}>SMS </Typography>
                  </Grid>
                </Grid>
              </div>

            </div>
          </Grid>

          <Grid item xs={12} md={6} >
            <div className={classes.cardContainer}>
              <div className={classes.cardTitle} >
                REQUISITION SUMMARY
              </div>
              <div className={classes.cardContent}>
                <Typography variant="h4" className={classes.cardContentTitle}>
                  Ordering Physician: {' '}
                  {data.location_id && data.location_id.provider && data.location_id.provider.first_name}, {' '}
                  {data.location_id && data.location_id.provider && data.location_id.provider.last_name}
                </Typography>
                <Typography className={classes.cardContentDivider}>&nbsp;</Typography>
                <Grid container >
                  <Grid item md={6} >
                    <div className={classes.cardContentItem}>
                      <Typography className={classes.cardContentLabel}>Requisition Date: </Typography>
                      <Typography className={classes.cardContentValue}>
                        {data.lab_submitted_timestamp
                          ?
                          moment(data.lab_submitted_timestamp).format('MM/DD/YYYY')
                          :
                          data.date &&
                          moment(data.date).format('MM/DD/YYYY')
                        }
                      </Typography>
                    </div>
                    <div className={classes.cardContentItem}>
                      <Typography className={classes.cardContentLabel}>NPI: </Typography>
                      <Typography className={classes.cardContentValue}>{data.location_id && data.location_id.provider && data.location_id.provider.npi}</Typography>
                    </div>
                  </Grid>
                  <Grid item md={6} className={classes.cardContentItem}>
                    {/* <div className={clsx(classes.boxContanier, classes.boxContanierHeight)}>
                      <Typography variant="h5" className={classes.boxTitle}> Ordering Physician Signature </Typography>
                      <SignaturePad
                          canvasProps={{ className: classes.sigPad }}
                          clearOnResize={false}
                          ref={(ref) => { sigPad1 = ref }}
                      />
                    </div> */}
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.container} >
          <Grid item xs={12} md={12} >
            <div className={classes.cardContentTitle3} >
              <Typography variant="h4">
                Test
              </Typography>
              <Typography style={{ marginRight: '5%' }} variant="h4">ICD 10 Code</Typography>
            </div>
            <div className={classes.cardContentTitle3} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
            </div>
            <div className={classes.cardContentTitle3} style={{ paddingTop: 0 }} >
              <Typography variant="h5">
                SARS-CoV-2 Assay (RNA Detection Test by RT- Detaction Test by RT-qPCR
              </Typography>
              <Typography style={{ marginRight: '5%' }} variant="h5">Z11.59</Typography>
            </div>
            <div className={classes.cardContentTitle3} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
            </div>
            <div className={classes.cardContentTitle3} style={{ paddingTop: 0 }} >
              <Typography variant="h5" style={{ marginRight: '5%' }}>
                By submission of this requisition and accompanying sample(s), I authorize and direct you to perform the testing
                indicated above. I certify that the ordered tests are reasonable and medically necessary by the diagnosis or
                treatment of this patient’s condition. I certify that, to the extent required by laws of this state in which I provide
                healthcare services, I have obtained the patients informed consent to undergo any testing required hereby, and
                to have the results reported to me.<br /><br />

                This requisition was electronically signed by
                {' '}
                {data.location_id && data.location_id.provider && data.location_id.provider.first_name}
                {' '}
                {data.location_id && data.location_id.provider && data.location_id.provider.last_name}
                {' '}
                (NPI {data.location_id && data.location_id.provider && data.location_id.provider.npi})
                {' '}
                on
                {' '}
                {data.location_id && data.location_id.created_date && moment.utc(data.location_id.created_date).tz("America/New_York").format('MM/DD/YYYY, h:mm:ss A') + ' EDT'}
              </Typography>
            </div>

          </Grid>
        </Grid>

        <Grid container className={classes.container} >
          <Grid item xs={12} md={6} >
            <div className={classes.cardContainer2}>
              <div className={classes.cardTitle} >
                INSURANCE INFORMATION
              </div>
              <div className={classes.cardContent2} >
                <Grid container className={classes.container}>
                  <Grid item sm={6} style={{ borderRight: 'solid 1px #0F84A9' }}>
                    <Typography variant="h4" className={classes.cardContentLabel}>
                      PRIMARY INSURANCE
                      </Typography>
                    <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                    <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.primary_insurance}</Typography>
                    <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                    <Grid container  >
                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          PCN
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.primary_pcn}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          ID NUMBER
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.primary_id_number}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>

                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          GROUP NUMBER
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.primary_rx_group}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          BIN NUMBER
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.primary_bin}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>

                    </Grid>
                  </Grid>
                  <Grid item sm={6} >
                    <Typography variant="h4" className={classes.cardContentLabel}>SECONDARY INSURANCE</Typography>
                    <Typography className={classes.cardContentDivider}>&nbsp;</Typography>

                    <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.secondary_insurance}</Typography>
                    <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                    <Grid container  >
                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          PCN
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.secondary_pcn}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          ID NUMBER
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.secondary_id_number}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>

                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          GROUP NUMBER
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.secondary_rx_group}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="h4" className={classes.cardContentLabel}>
                          BIN NUMBER
                        </Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>

                        <Typography className={classes.cardContentValue2}>{data.insurance && data.insurance.secondary_bin}</Typography>
                        <Typography className={classes.cardContentDivider2}>&nbsp;</Typography>
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} >
            <div className={classes.cardContainer2}>
              <div className={classes.cardTitle} >
                PATIENT CONSENTS
              </div>
              <div className={classes.cardContent2} style={{ padding: '9px 0px' }}>
                <div className={classes.consentContainer}>
                  <PatientDocsMark
                    formKey={'privacy_practices_receipt_of_documents_required'}
                    dataKey={true}
                  />
                  <Typography className={classes.cardContentLabel}>RECEIPT OF DOCUMENTS</Typography>
                  <Document
                    className={classes.documentIcon}
                    onClick={() => handleDocumentDialogOpen('ReceiptOfDocuments')}
                  />
                </div>
                <div className={classes.consentContainer}>
                  <PatientDocsMark
                    formKey={'privacy_practices_health_info_release_auth_required'}
                    dataKey={'health_info_release_auth'}
                  />
                  <Typography className={classes.cardContentLabel}>AUTHORIZATION FOR RELEASE OF HEALTH INFORMATION</Typography>
                  <Document
                    className={classes.documentIcon}
                    onClick={() => handleDocumentDialogOpen('AuthorizationForReleaseOfHealthInformation')}
                  />
                </div>
                <div className={classes.consentContainer}>
                  <PatientDocsMark
                    formKey={'privacy_practices_hipaa_notice_of_privacy_required'}
                    dataKey={true}
                  />
                  <Typography className={classes.cardContentLabel}>HIPAA NOTICE OF PRIVACY PRACTICES</Typography>
                  <Document
                    className={classes.documentIcon}
                    onClick={() => handleDocumentDialogOpen('HipaaNoticeOfPrivacyPractices')}
                  />
                </div>
                <div className={classes.consentContainer}>
                  <PatientDocsMark
                    formKey={'privacy_practices_patient_rules_responsibilities_required'}
                    dataKey={true}
                  />
                  <Typography className={classes.cardContentLabel}>PATIENT RULES AND RESPONSIBILITIES</Typography>
                  <Document
                    className={classes.documentIcon}
                    onClick={() => handleDocumentDialogOpen('PatientRulesAndResponsibilites')}
                  />
                </div>
                <div className={classes.consentContainer}>
                  <PatientDocsMark
                    formKey={'privacy_practices_consent_for_services_required'}
                    dataKey={true}
                  />
                  <Typography className={classes.cardContentLabel}>PATIENT CONSENT FOR SERVICES</Typography>
                  <Document
                    className={classes.documentIcon}
                    onClick={() => handleDocumentDialogOpen('PatientConsentForServices')}
                  />
                </div>
                <div className={classes.consentContainer}>
                  <PatientDocsMark
                    formKey={'privacy_practices_result_delivery_required'}
                    dataKey={'result_delivery'}
                  />
                  <Typography className={classes.cardContentLabel}>PATIENT APPROVAL TO BE TESTED</Typography>
                  <Document
                    className={classes.documentIcon}
                    onClick={() => handleDocumentDialogOpen('PatientApprovalToBeTested')}
                  />
                </div>
                <br />
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container className={classes.container} >
          <Grid item xs={12} md={6} >
            <div className={classes.cardContainer2}>
              <div className={classes.cardTitle} >
                INSURANCE CARD IMAGES
              </div>
              <div className={classes.cardContent2} >
                <div style={{ margin: '25px auto', textAlign: 'center', width: 360 }}>
                  <Typography variant="h4" style={{ marginBottom: 10 }}>
                    FRONT OF INSURANCE CARD
                  </Typography>
                  <div className={classes.cardContainer} >
                    {data.insurance && data.insurance.primary_insurance_card_front
                      ?
                      <img src={apiUrl + data.insurance.primary_insurance_card_front} className={classes.uploadedPhoto} alt="front" />
                      :
                      <Typography variant="body2"> No Image found </Typography>
                    }
                  </div>
                </div>
                <div style={{ margin: '25px auto', textAlign: 'center', width: 360 }}>
                  <Typography variant="h4" style={{ marginBottom: 10 }}>
                    BACK OF INSURANCE CARD
                  </Typography>
                  <div className={classes.cardContainer} >
                    {data.insurance && data.insurance.primary_insurance_card_back
                      ?
                      <img src={apiUrl + data.insurance.primary_insurance_card_back} className={classes.uploadedPhoto} alt="back" />
                      :
                      <Typography variant="body2"> No Image found </Typography>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          {data.result !== "Pending" &&
            <Grid item xs={12} md={6} >
              <div className={classes.cardContainer2}>
                <div className={classes.cardTitle} >
                  RESEND EMAIL, SMS
                </div>
                <div className={classes.cardContent2} >
                  {showcheckbox ?
                    <div style={{ margin: '25px auto', textAlign: 'center', width: 360 }}>
                      <CheckButton
                        required={true}
                        checked={resenddata.email}
                        label={'Email'}
                        name={'email'}
                        onChange={handleChange}
                        className={classes.checkboxLabelRoot}
                      />
                      <br></br>
                      <CheckButton
                        required={true}
                        checked={resenddata.sms}
                        label={'SMS'}
                        name={'sms'}
                        onChange={handleChange}
                        className={classes.checkboxLabelRoot}
                      />
                      <br></br>
                      <div className={brandClasses.footerButton}>
                        {disablesubmit ? <Alert severity="error">{disablesubmit}</Alert> : null}
                      </div>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          className={classes.blueBtn}
                          classes={{ disabled: brandClasses.buttonDisabled }}
                          disabled={resendloading}
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Submit{resendloading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                        </Button>
                      </Box>
                    </div>
                    :
                    <div style={{ margin: '25px auto', textAlign: 'center', width: 360 }}>
                      <Typography variant="h4" style={{ marginBottom: 10 }}>
                        {data.email_sent ? <CheckIcon className={classes.checkIcon} /> : <CancelIcon className={classes.cancelIcon} />} Email Sent
                      </Typography>
                      <Typography variant="h4" style={{ marginBottom: 10 }}>
                        {data.sms_sent ? <CheckIcon className={classes.checkIcon} /> : <CancelIcon className={classes.cancelIcon} />} SMS Sent
                      </Typography>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          className={classes.blueBtn}
                          classes={{ disabled: brandClasses.buttonDisabled }}
                          disabled={resendloading}
                          type="submit"
                          onClick={handelResend}
                        >
                          Resend
                      </Button>
                      </Box>
                    </div>
                  }
                </div>
              </div>
            </Grid>
          }
          <Grid item xs={12} md={6} >
            <div className={classes.cardContainer2}>
              <div className={classes.cardTitle} >
                SPECIMEN COLLECTION
              </div>
              <div className={classes.cardContent2} >
                <div style={{ margin: '25px auto', textAlign: 'center', width: 360 }}>
                  <Typography variant="h4" style={{ marginBottom: 10 }}>
                    COMPLETED KIT
                  </Typography>
                  <div className={classes.cardContainer}>
                    {data.testkit_front
                      ?
                      <img src={apiUrl + data.testkit_front} className={classes.uploadedPhoto} alt="front" />
                      :
                      <Typography variant="body2"> No Image found </Typography>
                    }
                  </div>
                </div>
                <div style={{ margin: '25px auto', textAlign: 'center', width: 360 }}>
                  <Typography variant="h4" style={{ marginBottom: 10 }}>
                    QR VERIFICATION
                    </Typography>
                  <div className={classes.cardContainer}>
                    {data.testkit_id
                      ?
                      // <img src={apiUrl + data.testkit_back} className={classes.uploadedPhoto} alt="qr" />
                      <QRCode
                        renderAs="svg"
                        value={data.testkit_id}
                        fgColor="#3ECCCD"
                        className={classes.qrcode}
                      />
                      :
                      <Typography variant="body2"> No Image found </Typography>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <DocumentDialog
        open={openDocumentDialog}
        type={documentDialogType}
        data={data}
        onClose={handleDocumentDialogClose}
      />

    </Dialog >
  )
}

ResultsSummary.propTypes = {
  getTestingResultsSummary: PropTypes.func.isRequired,
  testing_id: PropTypes.string,
  showErrorDialog: PropTypes.func.isRequired,
};

export default connect(null, { getTestingResultsSummary, showErrorDialog })(ResultsSummary);