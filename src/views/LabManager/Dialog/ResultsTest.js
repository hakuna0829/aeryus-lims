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
} from '@material-ui/core';
import moment from 'moment';
import 'moment-timezone';
import brandStyles from 'theme/brand';
import { getTestingResultsSummary, updateTestingResult } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import clsx from 'clsx';

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
    padding: '16px 24px !important',
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

const testStatusData = [
  { value: 'Positive', label: 'Positive' },
  { value: 'Negative', label: 'Negative' },
  { value: 'Inconclusive', label: 'Inconclusive' }
];

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

const ResultsTest = props => {
  const { testing_id, getTestingResultsSummary } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [resultTestType, setResultTestType] = useState(null);
  const [isClickedSubmit, setIsClickedSubmit] = useState(false);
  // const [isClickedConfirm, setIsClickedConfirm] = useState(false);
  // const [openDocumentDialog, setOpenDocumentDialog] = useState(false);

  const handleClose = () => {
    props.toggleDlg(false);
    props.toggleSuccessDlg(false);
  };

  useEffect(() => {
    setLoading(true);
    setResultTestType(null);
    if (testing_id) {
      (async () => {
        const res = await getTestingResultsSummary(testing_id);
        if (res.success) {
          setData(res.data || {});
        }
        setLoading(false);
      })();
    }
  }, [testing_id, getTestingResultsSummary]);

  const handleChange = e => {
    e.persist();
    setResultTestType(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log('resultTestType', resultTestType);
    setIsClickedSubmit(true);
    console.log(' clicked submit button - IsClickedSubmit', isClickedSubmit);
  };

  const handleConfirm = () => {
    let body = {
      testing_id: data._id,
      result: resultTestType
      // rna: selectedValue
    };
    setLoading(true);
    updateTestingResult(body)
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          handleClose();
          props.setRefetch(refetch => refetch + 1);
          setIsClickedSubmit(false);
          props.toggleDlg(false);
          props.toggleSuccessDlg(true);
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
    setIsClickedSubmit(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.isShow}
      // className={classes.root}
      classes={{ paper: classes.dialogPaper }}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div className={classes.subHeader}>
        {!isClickedSubmit ? (
            <Typography variant="h2" className={classes.headerTitle}>
              {'SELECT TEST RESULT'}
            </Typography>
          ) : (
            ''
          )}
          {/* {loading && (
            <CircularProgress
              size={20}
              className={brandClasses.fetchProgressSpinner}
            />
          )} */}
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <Grid container className={classes.container}>
        {isClickedSubmit ? (
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
          ) : (
            ''
          )}
          <Grid item xs={12}>
            <div className={classes.cardContainer}>
              <div className={classes.cardTitle}>{'PATIENT INFORMATION'}</div>
              
              {loading ? (
                <div className={classes.cardContent}>
                  <CircularProgress
                    size={20}
                    className={brandClasses.fetchProgressSpinner}
                  />
                </div>
              ) : (
              <div className={classes.cardContent}>
                <Typography variant="h4" className={classes.cardContentTitle}>
                  {data.dependent_id
                    ? data.dependent_id.first_name +
                      ', ' +
                      data.dependent_id.last_name
                    : data.user_id &&
                      data.user_id.first_name + ', ' + data.user_id.last_name}
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
                      {data.date && moment(data.date).format('MM/DD/YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item md={7} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>
                      Location:
                    </Typography>
                    <Typography className={classes.cardContentValue}>
                      {data.location_id && data.location_id.name}
                    </Typography>
                  </Grid>
                  <Grid item md={5} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>
                      Test Type:{' '}
                    </Typography>
                    <Typography className={classes.cardContentValue}>
                      {data.test_type}
                    </Typography>
                  </Grid>
                  <Grid item md={7} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>
                      Test Kit ID:{' '}
                    </Typography>
                    <Typography className={classes.cardContentValue}>
                      {data.testkit_id}
                    </Typography>
                  </Grid>
                  {!isClickedSubmit ? (
                      <Grid item md={12} className={classes.cardContentItem}>
                        <Typography className={classes.cardContentLabel}>
                          Session ID:{' '}
                        </Typography>
                        <Typography className={classes.cardContentValue}>
                          {data.test_session_id}
                        </Typography>
                      </Grid>
                    ) : (
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
                      {data.test_session_id}
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
                    )}
                </Grid>
              </div>
              )}
            </div>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit}>
        <Grid container className={classes.container}>
          <Grid item xs={6}>
          {!isClickedSubmit ? (
                <div className={classes.cardFooterLeft}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined">
                    <InputLabel
                      shrink
                      className={brandClasses.selectShrinkLabel}>
                      Result Test
                    </InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Select Result"
                      name="select_result"
                      displayEmpty
                      value={resultTestType || ''}>
                      {/* <MenuItem value="">
                  <em>{'Select Result'}</em>
                </MenuItem> */}
                      {testStatusData.map((testStatus, index) => (
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
                    disabled={loading}
                    onClick={handleBack}>
                    {'BACK'}{' '}
                    {loading ? (
                      <CircularProgress
                        size={20}
                        className={brandClasses.progressSpinner}
                      />
                    ) : (
                      ''
                    )}
                  </Button>
            </div>
               )}
          </Grid>
          <Grid item xs={6}>
          <div className={classes.cardFooterRight}>
                {!isClickedSubmit ? (
                  <Button
                    className={brandClasses.button}
                    classes={{ disabled: brandClasses.buttonDisabled }}
                    disabled={loading}
                    type="submit"
                    // onClick={handleSubmit}
                  >
                    {'SUBMIT'}{' '}
                    {loading ? (
                      <CircularProgress
                        size={20}
                        className={brandClasses.progressSpinner}
                      />
                    ) : (
                      ''
                    )}
                  </Button>
                ) : (
                  <Button
                    className={brandClasses.button}
                    classes={{ disabled: brandClasses.buttonDisabled }}
                    disabled={loading}
                    // type="submit"
                    onClick={handleConfirm}>
                    {'CONFIRM'}{' '}
                    {loading ? (
                      <CircularProgress
                        size={20}
                        className={brandClasses.progressSpinner}
                      />
                    ) : (
                      ''
                    )}
                  </Button>
                )}
            </div>
          </Grid>
        </Grid>
        </form>
      </DialogContent>

      <DocumentDialog
        open={openDocumentDialog}
        type={documentDialogType}
        data={data}
        onClose={handleDocumentDialogClose}
      />
    </Dialog>
  );
};

ResultsTest.propTypes = {
  getTestingResultsSummary: PropTypes.func.isRequired,
  testing_id: PropTypes.string,
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired
};

export default connect(null, { getTestingResultsSummary, showFailedDialog, showErrorDialog })(ResultsTest);
