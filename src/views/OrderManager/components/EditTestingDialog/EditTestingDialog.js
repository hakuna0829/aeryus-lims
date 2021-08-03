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
  Button,
  TextField
  // CircularProgress
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import { updateTestingPostResulted } from 'actions/api';
import { getTestResults, getTestTypes } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';

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
  resultConfirmTitle: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    lineHeight: '36px',
    fontWeight: 500,
    paddingBottom: 6,
    textAlign: 'center'
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
  cardTitle: {
    padding: '10px 20px',
    fontSize: '18px',
    background: '#0F84A9',
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    letterSpacing: 0
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
  cardContentTitle: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontSize: '18px',
    fontWeight: 600,
    paddingBottom: 6
  },
  cardContentDivider: {
    width: '90%',
    height: 20,
    borderTop: 'solid 1px #0F84A9'
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
  cardContainer: {
    margin: 0,
    border: 'solid 1px #0f83a8',
    borderRadius: '5px',
    paddingBottom: '20px'
  },
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

const EditTestingDialog = props => {
  const { isShow, testing, setRefetch, toggleDlg, updateTestingPostResulted } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState(testing);
  const [displaySuccess, setDisplaySuccess] = useState(null);

  useEffect(() => {
    if (isShow) {
      setDisplaySuccess(null);
      setFormState(testing);
    }
  }, [isShow, testing]);

  const handleClose = () => {
    toggleDlg(false);
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let body = {
      testkit_id: formState.testkit_id,
      test_type: formState.test_type,
      result: formState.result
    };
    setLoading(true);
    const res = await updateTestingPostResulted(testing._id, body);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      setTimeout(() => {
        setRefetch(refetch => refetch + 1);
        handleClose();
      }, 1000);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isShow}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <div className={classes.subHeader}>
          <Typography variant="h2" className={classes.headerTitle}>
            {'EDIT TESTING'}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <Grid container>

          <Grid item xs={12}>
            <div className={classes.cardContainer}>
              <Typography className={classes.cardTitle}>{'PATIENT INFORMATION'}</Typography>
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
                  <Grid item md={5} className={classes.cardContentItem}>
                    <Typography className={classes.cardContentLabel}>
                      Test Result:{' '}
                    </Typography>
                    <Typography className={classes.cardContentValue}>
                      {testing.result}
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
                </Grid>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" className={classes.resultConfirmTitle}>
              Please be careful modifying this
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined">
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>{'Test Result'}</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Select Result"
                      name="result"
                      displayEmpty
                      value={formState.result || ''}
                    >
                      <MenuItem value="" className={brandClasses.selectPlaceholder}><em>{'Select Result'}</em></MenuItem>
                      {getTestResults.map((testStatus, index) => (
                        <MenuItem key={index} value={testStatus.value}>{testStatus.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Test Type</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Select Test Type"
                      name="test_type"
                      displayEmpty
                      value={formState.test_type || ''}
                    >
                      <MenuItem value="" className={brandClasses.selectPlaceholder}><em>{'Select Test Type'}</em></MenuItem>
                      {getTestTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="Test Kit ID"
                    placeholder="Enter Test Kit ID"
                    name="testkit_id"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.testkit_id || ''}
                    required
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <div className={brandClasses.footerMessage}>
                {displaySuccess ? <Alert severity="success">{displaySuccess}</Alert> : null}
              </div>

              <div className={brandClasses.footerButton}>
                <Button
                  className={brandClasses.button}
                  classes={{ disabled: brandClasses.buttonDisabled }}
                  disabled={loading}
                  type="submit"
                >
                  CONFIRM {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

EditTestingDialog.propTypes = {
  testing: PropTypes.object.isRequired,
  updateTestingPostResulted: PropTypes.func.isRequired
};

export default connect(null, { updateTestingPostResulted })(EditTestingDialog);
