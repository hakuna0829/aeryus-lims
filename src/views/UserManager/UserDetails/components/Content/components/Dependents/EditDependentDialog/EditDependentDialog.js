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
import { getDependent, updateDependent } from 'actions/api';
import { getGenders, getRelationShips } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
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
  resultConfirmTitle: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    lineHeight: '36px',
    fontWeight: 500,
    paddingBottom: 6,
    textAlign: 'center'
  },

  dialogContentRoot: {
    padding: '10px 24px 16px  !important',
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

const EditDependentDialog = props => {
  const { isShow, dependent_id, setRefetch, toggleDlg, getDependent, updateDependent } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({});
  const [displaySuccess, setDisplaySuccess] = useState(null);

  useEffect(() => {
    if (isShow) {
      (async () => {
        setDisplaySuccess(null);
        setFormState({});
        setFetchLoading(true);
        const res = await getDependent(dependent_id);
        setFetchLoading(false);
        if (res.success) {
          setFormState(res.data);
        }
      })();
    }
    // eslint-disable-next-line
  }, [isShow, dependent_id]);

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

  const handleDobChange = (date) => {
    setFormState(formState => ({
      ...formState,
      dob: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateDependent(formState._id, formState);
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
      open={isShow}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle onClose={handleClose}>
        <div className={classes.subHeader}>
          <Typography variant="h2" className={classes.headerTitle}>
            {'EDIT DEPENDENT'}
          </Typography>
          {fetchLoading && <CircularProgress className={brandClasses.fetchProgressSpinner} />}
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContentRoot }}>
        <Grid container>

          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="First name"
                    placeholder="First name"
                    name="first_name"
                    className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
                    onChange={handleChange}
                    value={formState.first_name || ''}
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="Middle name"
                    placeholder="Middle name"
                    name="middle_name"
                    className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
                    onChange={handleChange}
                    value={formState.middle_name || ''}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="Last name"
                    placeholder="Last name"
                    name="last_name"
                    className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
                    onChange={handleChange}
                    value={formState.last_name || ''}
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={MomentUtils} >
                    <DatePicker
                      label="Date of Birth"
                      placeholder="Date of Birth"
                      name="dob"
                      className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
                      onChange={date => handleDobChange(date)}
                      value={formState.dob || null}
                      fullWidth
                      required
                      maxDate={moment()}
                      format="MM/DD/yyyy"
                      InputLabelProps={{ shrink: true }}
                      inputVariant="outlined"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="outlined"
                    required
                    fullWidth
                    className={brandClasses.shrinkTextField}
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Gender</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Gender* "
                      name="gender"
                      displayEmpty
                      value={formState.gender || ''}
                      classes={{ select: clsx(classes.selected, classes.selectItem) }}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Select Gender</Typography>
                      </MenuItem>
                      {getGenders.map((gender, index) => (
                        <MenuItem key={index} value={gender}>{gender}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="outlined"
                    required
                    fullWidth
                    className={brandClasses.shrinkTextField}
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Relationship</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Relationship *"
                      name="relationship"
                      displayEmpty
                      value={formState.relationship || ''}
                      classes={{ select: clsx(classes.selected, classes.selectItem) }}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Relationship</Typography>
                      </MenuItem>
                      {getRelationShips.map((relation, index) => (
                        <MenuItem key={index} value={relation}>{relation}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  Submit {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

EditDependentDialog.propTypes = {
  dependent_id: PropTypes.string,
  getDependent: PropTypes.func.isRequired,
  updateDependent: PropTypes.func.isRequired
};

export default connect(null, { getDependent, updateDependent })(EditDependentDialog);
