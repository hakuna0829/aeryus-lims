import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import brandStyles from 'theme/brand';
import {
  Button,
  makeStyles,
  Dialog,
  Typography,
  DialogContent,
  withStyles,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid
} from '@material-ui/core';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import { searchUsers, getDepartments, getLocations, addSchedule } from 'actions/api';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import QrReaderDialog from 'components/QrReaderDialog';
import { getAppointmentTypes } from 'helpers';

const styles = theme => ({
  root: {
    margin: 0,
    marginBottom: 20,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
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

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(6)
  },
  headerTitle: {
    color: theme.palette.brandText,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontWeight: 600
  },
  button: {
    marginBottom: 20,
    // width: 320,
    width: '100%',
    boxShadow: '5px 5px 10px 2px rgba(15,132,169,0.3)'
  },
  successMessage: {
    color: theme.palette.brand,
    textAlign: 'center'
  },
  checkIcon: {
    color: theme.palette.brandGreen,
    marginLeft: 10
  }
}));

const ScheduleButton = props => {
  const {
    searchUsers,
    getDepartments,
    departments,
    submitScheduleAction,
    showFailedDialog,
    showErrorDialog
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState('List');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dropDown, setDropdown] = useState([]);
  const [formState, setFormState] = useState({});

  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const [qrReaderDialogOpen, setQrReaderDialogOpen] = useState(false);

  useEffect(() => {
    console.log('ScheduleButton useEffect');
    if (dialogOpen) {
      setContent('List');
      setFormState({});
      setDropdown([]);
      setDisplaySuccess(null);
      setDisplayError(null);
      setSelectedUsers([]);
      setSelectedLocation(null);
    }
  }, [dialogOpen]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSchedule = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const doSearch = async (text) => {
    if (!text || !text.length) return;
    let queryParams = `rowsPerPage=${100}`;
    setSearchLoading(true);
    let res = await searchUsers({ search_string: text }, queryParams);
    setSearchLoading(false);
    if (res.success) {
      setDropdown(res.data);
    }
  }

  const handleScheduleUser = () => {
    setContent('User');
    // setLoading(true);
    // getUsers().then(res => {
    //   setLoading(false);
    //   if (res.data.success) {
    //     setDropdown(res.data.data);
    //   } else {
    //     showFailedDialog(res);
    //   }
    // }).catch(error => {
    //   setLoading(false);
    //   showErrorDialog(error);
    // });
  }

  const handleScheduleDepartment = async () => {
    setContent('Department');
    if (!departments) {
      setLoading(true);
      await getDepartments();
      setLoading(false);
    }
  };

  const handleScheduleLocation = () => {
    setContent('Location');
    setLoading(true);
    getLocations()
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          setDropdown(res.data.data);
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        setLoading(false);
        showErrorDialog(error);
      });
  };

  const handleAutoCompleteChange = (event, values) => {
    if (displayError)
      setDisplayError(null);
    setSelectedUsers(values);
  }

  const handleDepartmentChange = event => {
    if (displayError) setDisplayError(null);
    setSelectedDepartment(event.target.value);
  };

  const handleLocationChange = event => {
    if (displayError) setDisplayError(null);
    setSelectedLocation(event.target.value);
  };

  const handleScheduleUserAppointment = event => {
    event.preventDefault();
    console.log('selectedUsers ', selectedUsers)
    if (!selectedUsers.length) {
      setDisplayError('Please select at least one user');
      return;
    }
    let body = {
      schedule_for: 'User',
      type: formState.type,
      users: selectedUsers.map(user => (
        {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          location_name: user.location_id.name
        }
      ))
    }
    setLoading(true);
    addSchedule(body).then(res => {
      setLoading(false);
      if (res.data.success) {
        setDisplaySuccess(
          selectedUsers.length === 1
            ?
            `${selectedUsers[0].email ? selectedUsers[0].email : 'N/A'}, ${selectedUsers[0].phone ? selectedUsers[0].phone : 'N/A'} `
            :
            `Request Sent to ${selectedUsers.length} users`
        );
        setContent('Success');
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const handleScheduleDepartmentTest = event => {
    event.preventDefault();
    if (!selectedDepartment) {
      setDisplayError('Please select a department');
      return;
    }
    let body = {
      schedule_for: 'Department',
      type: formState.type,
      department_id: selectedDepartment,
      department_name: departments.find(d => d._id === selectedDepartment).name,
    };
    setLoading(true);
    addSchedule(body).then(res => {
      setLoading(false);
      if (res.data.success) {
        setDisplaySuccess(`Request Sent to '${body.department_name}' Department users`);
        setContent('Success');
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const handleScheduleLocationAppointment = event => {
    event.preventDefault();
    if (!selectedLocation) {
      setDisplayError('Please select a Location');
      return;
    }
    let body = {
      schedule_for: 'Location',
      type: formState.type,
      location_id: selectedLocation,
      location_name: dropDown.find(l => l._id === selectedLocation).name
    };
    setLoading(true);
    addSchedule(body).then(res => {
      setLoading(false);
      if (res.data.success) {
        setDisplaySuccess(`Request Sent to '${body.location_name}' Location users`);
        setContent('Success');
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const handleCheckIn = () => {
    setQrReaderDialogOpen(true);
  };

  const handleQrReaderDialogClose = async data => {
    if (data.data) {
      setLoading(true);
      let body = {
        action: 'Check',
        schedule_id: data.data
      };
      let res = await submitScheduleAction(body);
      setLoading(false);
      if (res.success) {
        setQrReaderDialogOpen(false);
      }
    } else {
      setQrReaderDialogOpen(false);
    }
  };

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Button
          style={{ fontSize: 18, marginRight: 10 }}
          className={brandClasses.button}
          onClick={handleCheckIn}>
          {'CHECK IN'}
        </Button>
        <Button
          style={{ fontSize: 18 }}
          className={brandClasses.button}
          onClick={handleSchedule}>
          {'SCHEDULE'}
        </Button>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle onClose={handleDialogClose}>
          {/* <Typography className={classes.headerTitle}>
            {'+ ADD USER'}
          </Typography> */}
        </DialogTitle>
        <DialogContent className={classes.root}>
          {content === 'List' && (
            <Grid
              container
              direction="column"
              justify="space-around"
              alignItems="center">
              <Button
                className={clsx(classes.button, brandClasses.button)}
                onClick={handleScheduleUser}
              >
                {'SCHEDULE USER'}
              </Button>
              <Button
                className={clsx(classes.button, brandClasses.button)}
                onClick={handleScheduleDepartment}>
                {'SCHEDULE DEPARMENT'}
              </Button>
              <Button
                className={clsx(classes.button, brandClasses.button)}
                onClick={handleScheduleLocation}>
                {'SCHEDULE LOCATION'}
              </Button>
            </Grid>
          )}

          {content === 'Type' && (
            <Grid
              container
              direction="column"
              justify="space-around"
              alignItems="center">
              <Button
                className={clsx(classes.button, brandClasses.button)}
                onClick={handleScheduleUser}
              >
                {'SCHEDULE USER'}
              </Button>
              <Button
                className={clsx(classes.button, brandClasses.button)}
                onClick={handleScheduleDepartment}>
                {'SCHEDULE DEPARMENT'}
              </Button>
              <Button
                className={clsx(classes.button, brandClasses.button)}
                onClick={handleScheduleLocation}>
                {'SCHEDULE LOCATION'}
              </Button>
            </Grid>
          )}

          {content === 'User' && (
            <form
              onSubmit={handleScheduleUserAppointment}
            >
              <Typography className={classes.headerTitle}>
                {'Schedule User Test'}
              </Typography>
              <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Appointment Type</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Appointment Type* "
                  name="type"
                  displayEmpty
                  value={formState.type || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select Appointment Type</Typography>
                  </MenuItem>
                  {getAppointmentTypes.map((type, index) => (
                    <MenuItem key={index} value={type.value}>{type.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography>&nbsp;</Typography>
              <Autocomplete
                multiple
                // open={true}
                options={dropDown}
                loading={searchLoading}
                getOptionLabel={option =>
                  `${option.last_name ? option.last_name : 'N/A'} ${option.first_name ? option.first_name : 'N/A'}`
                }
                className={brandClasses.shrinkTextField}
                onChange={handleAutoCompleteChange}
                onInputChange={_.debounce((_, value) => doSearch(value), 500)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="User"
                    placeholder="Enter to search"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
              <Button
                style={{ marginBottom: 10, marginTop: 40 }}
                className={clsx(classes.button, brandClasses.button)}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
              >
                {'SCHEDULE APPOINTMENT'}
              </Button>
            </form>
          )}

          {content === 'Department' && (
            <form
              onSubmit={handleScheduleDepartmentTest}
            >
              <Typography className={classes.headerTitle}>
                {'Schedule Department Test'}
              </Typography>
              {loading
                ?
                <CircularProgress color="inherit" />
                :
                <>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Appointment Type</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Appointment Type* "
                      name="type"
                      displayEmpty
                      value={formState.type || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Select Appointment Type</Typography>
                      </MenuItem>
                      {getAppointmentTypes.map((type, index) => (
                        <MenuItem key={index} value={type.value}>{type.text}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography>&nbsp;</Typography>
                  <FormControl
                    variant="outlined"
                    className={clsx(
                      brandClasses.selectExpandIcon,
                      brandClasses.shrinkTextField
                    )}
                    fullWidth>
                    <InputLabel>Select Department</InputLabel>
                    <Select
                      label="Select Department"
                      IconComponent={ExpandMoreIcon}
                      value={selectedDepartment || ''}
                      onChange={handleDepartmentChange}>
                      {departments.map((department, index) => (
                        <MenuItem key={index} value={department._id}>
                          {department.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              }
              <Button
                style={{ marginBottom: 10, marginTop: 40 }}
                className={clsx(classes.button, brandClasses.button)}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
              >
                {'SCHEDULE APPOINTMENT'}
              </Button>
            </form>
          )}

          {content === 'Location' && (
            <form
              onSubmit={handleScheduleLocationAppointment}
            >
              <Typography className={classes.headerTitle}>
                {'Schedule Location Test'}
              </Typography>
              {loading
                ?
                <CircularProgress color="inherit" />
                :
                <>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Appointment Type</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Appointment Type* "
                      name="type"
                      displayEmpty
                      value={formState.type || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Select Appointment Type</Typography>
                      </MenuItem>
                      {getAppointmentTypes.map((type, index) => (
                        <MenuItem key={index} value={type.value}>{type.text}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography>&nbsp;</Typography>
                  
                  <FormControl
                    variant="outlined"
                    className={clsx(
                      brandClasses.selectExpandIcon,
                      brandClasses.shrinkTextField
                    )}
                    fullWidth>
                    <InputLabel>Select Location</InputLabel>
                    <Select
                      label="Select Location"
                      IconComponent={ExpandMoreIcon}
                      value={selectedLocation || ''}
                      onChange={handleLocationChange}>
                      {dropDown.map((location, index) => (
                        <MenuItem key={index} value={location._id}>
                          {location.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              }
              <Button
                style={{ marginTop: 40, marginBottom: 10 }}
                className={clsx(classes.button, brandClasses.button)}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
              >
                {'SCHEDULE APPOINTMENT'}
              </Button>
            </form>
          )}

          {content === 'Success' && (
            <>
              <Typography className={classes.headerTitle}>
                {'Schedule Request Sent'}
              </Typography>
              <Typography variant="h5" className={classes.successMessage}>
                {displaySuccess}
                <CheckIcon className={classes.checkIcon} />
              </Typography>
            </>
          )}

          {displayError ? <Alert severity="error">{displayError}</Alert> : null}
        </DialogContent>
      </Dialog>

      <QrReaderDialog
        dialogOpen={qrReaderDialogOpen}
        handleDialogClose={handleQrReaderDialogClose}
        loading={loading}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  departments: state.data.departments
});

ScheduleButton.propTypes = {
  searchUsers: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  submitScheduleAction: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  searchUsers,
  getDepartments,
  showFailedDialog,
  showErrorDialog
})(withRouter(ScheduleButton));
