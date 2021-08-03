import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
  Typography,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
  // CircularProgress
} from '@material-ui/core';
import moment from 'moment';
import 'moment-timezone';
import brandStyles from 'theme/brand';
import { updateTestingResult } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import clsx from 'clsx';
import { getTestResults } from 'helpers';

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
  successText: {
    // padding: '10px 20px',
    fontSize: '18px',
    lineHeight: '25px',
    color: theme.palette.brandDark,
    fontFamily: 'Montserrat',
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'center'
  },
  cardTitle: {
    padding: '10px 20px',
    fontSize: '18px',
    background: '#0F84A9',
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    letterSpacing: 0

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
      height: '185px'
    },
    [theme.breakpoints.between(1200, 1278)]: {
      height: '180px'
    },
    [theme.breakpoints.down(900)]: {
      height: '100%'
    }
  },

  resultConfirmTitle: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: 500,
    paddingBottom: 6,
    textAlign: 'center'
  },
  cardContentTitle: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontSize: '18px',
    fontWeight: 600,
    paddingBottom: 6
  },
  cardFooterLeft: {
    // display: 'flex',
    // justifyContent: 'space-between',
    padding: '10px 10px 10px 0px'
  },

  cardFooterRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 10px 10px 0px'
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
    }
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
    }
  },

  dialogContentRoot: {
    padding: '0px 24px 16px  !important',
    flexGrow: 1
    // '&:first-child': {
    //     padding: 0
    // }
  },
  dialogPaper: {
    maxWidth: '900px',
    width: '900px',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    [theme.breakpoints.up('lg')]: {
      maxWidth: '900px !important',
      width: '900px'
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '600px !important'
      // width: '1220px',
    },
    [theme.breakpoints.down('sm')]: {}
  },

  cardContainer: {
    margin: 0,
    border: 'solid 1px #0f83a8',
    borderRadius: '5px',
    paddingBottom: '20px'
  },

  statusIcon: {
    width: '110px'
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

const ConfirmResultDialog = props => {
  const { isShow, testing, setRefetch, toggleDlg } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [resultTestType, setResultTestType] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isShow) {
      setResultTestType(null);
      setStep(1);
    }
  }, [isShow]);

  const handleClose = () => {
    toggleDlg(false);
  };

  const handleChange = e => {
    e.persist();
    setResultTestType(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setStep(step => step + 1);
  };

  const handleConfirm = () => {
    let body = {
      testing_id: testing._id,
      result: resultTestType
    };
    setLoading(true);
    updateTestingResult(body)
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          setStep(step => step + 1);
          setTimeout(() => {
            setRefetch(refetch => refetch + 1);
            handleClose();
          }, 1000);
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        setLoading(false);
        showErrorDialog(error);
      });
  };

  const handleBack = () => {
    setStep(step => step - 1);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isShow}
      classes={{ paper: classes.dialogPaper }}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div className={classes.subHeader}>
          {step === 1 &&
            <Typography variant="h2" className={classes.headerTitle}>
              {'SELECT TEST RESULT'}
            </Typography>
          }
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        {(step === 1 || step === 2) &&
          <>
            <Grid container className={classes.container}>
              {step === 2 &&
                <>
                  <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <img
                      src="/images/svg/status/red_triangle_alert.svg"
                      alt=""
                      className={classes.statusIcon}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" className={classes.resultConfirmTitle}>
                      You are about to notify of their test results.
                </Typography>
                  </Grid>
                </>
              }

              <Grid item xs={12}>
                <div className={classes.cardContainer}>
                  <div className={classes.cardTitle}>{'PATIENT INFORMATION'}</div>
                  <div className={classes.cardContent}>
                    <Typography variant="h4" className={classes.cardContentTitle}>
                      {testing.dependent_id
                        ? testing.dependent_id.first_name + ', ' + testing.dependent_id.last_name
                        : testing.user_id &&
                        testing.user_id.first_name + ', ' + testing.user_id.last_name}
                    </Typography>
                    <Typography className={classes.cardContentDivider}>
                      &nbsp;
                  </Typography>
                    <Grid container>
                      <Grid item md={5} className={classes.cardContentItem}>
                        <Typography className={classes.cardContentLabel}>
                          Test Date:
                      </Typography>
                        <Typography className={classes.cardContentValue}>
                          {testing.collected_timestamp && moment(testing.collected_timestamp).format('MM/DD/YYYY')}
                        </Typography>
                      </Grid>
                      <Grid item md={7} className={classes.cardContentItem}>
                        <Typography className={classes.cardContentLabel}>
                          Location:
                      </Typography>
                        <Typography className={classes.cardContentValue}>
                          {testing.location_id && testing.location_id.name}
                        </Typography>
                      </Grid>
                      <Grid item md={5} className={classes.cardContentItem}>
                        <Typography className={classes.cardContentLabel}>
                          Test Type:{' '}
                        </Typography>
                        <Typography className={classes.cardContentValue}>
                          {testing.test_type}
                        </Typography>
                      </Grid>
                      <Grid item md={7} className={classes.cardContentItem}>
                        <Typography className={classes.cardContentLabel}>
                          Test Kit ID:{' '}
                        </Typography>
                        <Typography className={classes.cardContentValue}>
                          {testing.testkit_id}
                        </Typography>
                      </Grid>
                      {step === 1 ?
                        <Grid item md={12} className={classes.cardContentItem}>
                          <Typography className={classes.cardContentLabel}>
                            Session ID:{' '}
                          </Typography>
                          <Typography className={classes.cardContentValue}>
                            {testing.test_session_id}
                          </Typography>
                        </Grid>
                        :
                        <>
                          <Grid item md={5} className={classes.cardContentItem}>
                            <Typography className={classes.cardContentLabel}>
                              Test Result:{' '}
                            </Typography>
                            <Typography className={classes.cardContentValue}>
                              {resultTestType}
                            </Typography>
                          </Grid>
                          <Grid item md={7} className={classes.cardContentItem}>
                            <Typography className={classes.cardContentLabel}>
                              Session ID:{' '}
                            </Typography>
                            <Typography className={classes.cardContentValue}>
                              {testing.test_session_id}
                            </Typography>
                          </Grid>
                          <Grid item md={5} className={classes.cardContentItem}>
                            <Typography className={classes.cardContentLabel}>
                              Communication Method:{' '}
                            </Typography>
                          </Grid>
                          <Grid item md={7} className={classes.cardContentItem}>
                            <Typography className={classes.cardContentValue}>
                              SMS{' '}
                            </Typography>
                          </Grid>
                        </>
                      }
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
            <form onSubmit={handleSubmit}>
              <Grid container className={classes.container}>
                <Grid item xs={6}>
                  {step === 1 ? (
                    <div className={classes.cardFooterLeft}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        required
                        fullWidth
                        variant="outlined">
                        <InputLabel
                          shrink
                          className={brandClasses.selectShrinkLabel}
                        >
                          {'Result Test'}
                        </InputLabel>
                        <Select
                          onChange={handleChange}
                          label="Select Result"
                          name="select_result"
                          displayEmpty
                          value={resultTestType || ''}>
                          <MenuItem value="">
                            <em>{'Select Result'}</em>
                          </MenuItem>
                          {getTestResults.map((testStatus, index) => (
                            <MenuItem key={index} value={testStatus.value}>
                              {testStatus.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  ) : (
                    <div className={classes.cardFooterLeft}>
                      <Button
                        className={clsx(
                          brandClasses.button,
                          brandClasses.whiteButton
                        )}
                        classes={{ disabled: brandClasses.buttonDisabled }}
                        onClick={handleBack}>
                        {'BACK'}{' '}
                      </Button>
                    </div>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.cardFooterRight}>
                    {step === 1 ? (
                      <Button
                        className={brandClasses.button}
                        classes={{ disabled: brandClasses.buttonDisabled }}
                        disabled={loading}
                        type="submit"
                      >
                        {'SUBMIT'}{' '}
                        {loading && <CircularProgress size={20} className={brandClasses.progressSpinner} />}
                      </Button>
                    ) : (
                      <Button
                        className={brandClasses.button}
                        classes={{ disabled: brandClasses.buttonDisabled }}
                        disabled={loading}
                        // type="submit"
                        onClick={handleConfirm}>
                        {'CONFIRM'}{' '}
                        {loading && <CircularProgress size={20} className={brandClasses.progressSpinner} />}
                      </Button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </form>
          </>
        }
        {step === 3 &&
          <Grid container className={classes.container}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <img
                src="/images/svg/status/check_green.svg"
                alt=""
                className={classes.statusIcon}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.successText}>
                Patient has been successfully <br />
                notified of their test results.
              </div>
            </Grid>
          </Grid>
        }
      </DialogContent>
    </Dialog>
  );
};

ConfirmResultDialog.propTypes = {
  testing_id: PropTypes.string,
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired
};

export default connect(null, {
  showFailedDialog,
  showErrorDialog
})(ConfirmResultDialog);
