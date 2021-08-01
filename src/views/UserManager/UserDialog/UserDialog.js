import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { v4 as uuidv4 } from 'uuid';
import {
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  withStyles,
  Grid,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Tooltip,
  FormHelperText
} from '@material-ui/core';
import moment from "moment";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import brandStyles from 'theme/brand';
import validate from 'validate.js';
import { getStates, getPopulationManagerInit, handleImage, getEthnicities, getGenders, getRace } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import NumberFormat from 'react-number-format';
import { createUser, updateUser, uploadPhoto, getLocations1, getDepartments, getAllPopulationSetting, apiUrl } from 'actions/api';
import { getUser } from 'actions/api';
import HelpIcon from '@material-ui/icons/Help';
import ZipCodeInput from 'components/ZipCodeInput';
import TextButton from 'components/Button/TextButton';

import InputAdornment from '@material-ui/core/InputAdornment';

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div variant="h6">{children}</div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    color: theme.palette.brandDark,
    // textAlign: 'center',
    fontWeight: 600,
  },
  birthday: {
    paddingTop: 10,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > div ': {
      marginRight: 15,
      marginBottom: 15,
      '&:last-child': {
        marginRight: 0,
      }
    }
  },
  errorTxt: {
    color: '#e53935',
    paddingTop: '8px',
    fontSize: '12px'
  }
}));
const errorsMsg = {
  ssnLong: 'Too many numbers. Please double check.',
  ssnShort: 'Not enough numbers. Please double check.',
};

const UserDialog = (props) => {
  const { getLocations1, locations, getDepartments, departments, getAllPopulationSetting, populationSettings, showFailedDialog, showErrorDialog, dialogOpen, onDialogClose, userId } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({});
  const [formError, setFormError] = useState({});
  const [imgState, setImgState] = useState({});
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [userFields, setUserFields] = useState({ ...getPopulationManagerInit });
  const [locationDepartments, setLocationsDepartments] = useState(null);
  const [locationPopulationSettings, setLocationsPopulationSettings] = useState(null);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({ ssnLong: false, ssnShort: false });
  useEffect(() => {
    if (dialogOpen) {
      setDisplayError(null);
      setDisplaySuccess(null);
      setFormState({});
      setUserFields({ ...getPopulationManagerInit });
      setImgState({});
      // fetch 
      async function fetchData() {
        setFetchLoading(true);
        if (!locations)
          await getLocations1();
        if (!departments)
          await getDepartments();
        if (!populationSettings)
          await getAllPopulationSetting();
        if (userId) {
          getUser(userId).then(res => {
            setFetchLoading(false);
            if (res.data.data) {
              let user = res.data.data;
              user.location_id = res.data.data.location_id._id;
              if (user.dob) {
                let dob = moment.utc(user.dob);
                user.dateOfBirth = dob.date();
                user.monthOfBirth = dob.month() + 1;
                user.yearOfBirth = dob.year();
              }
              setFormState(user);
            } else {
              showFailedDialog('User ID is Invalid.');
            }
          }).catch(error => {
            setFetchLoading(false);
            showErrorDialog(error);
          });
        } else {
          setFetchLoading(false);
          setFormState({ verification_id: uuidv4() });
        }
      }
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, userId]);

  useEffect(() => {
    if (populationSettings) {
      let temp = populationSettings.filter(p => p.location_id._id === formState.location_id);
      setLocationsPopulationSettings(temp ? temp : []);
    }
  }, [populationSettings, formState.location_id]);

  useEffect(() => {
    if (departments) {
      let locDep = departments.filter(d => d.location_id._id === formState.location_id);
      // TODO: 
      // setFormState(formState => ({ ...formState, department_id: null }));
      setLocationsDepartments(locDep ? locDep : []);
    }
  }, [departments, formState.location_id]);

  useEffect(() => {
    if (locationPopulationSettings) {
      let temp = locationPopulationSettings.find(p => p._id === formState.populationsettings_id);
      if (temp)
        setUserFields(temp);
      else
        setUserFields({ ...getPopulationManagerInit });
    }
    // eslint-disable-next-line 
  }, [locationPopulationSettings]);

  const handleChange = e => {
    e.persist();
    if (e.target.name === 'location_id') {
      setFormState(formState => ({
        ...formState,
        department_id: undefined,
        populationsettings_id: undefined,
        population_type: undefined
      }));
    }
    if (e.target.name === 'populationsettings_id') {
      handleTypeFields(e.target.value);
    }
    if (e.target.name === 'social_digits') {
      if (userFields.demographics_ssn_required && !userFields.demographics_ssn_hide && e.target.value) {
        if (e.target.value.length > 4) {
          setErrors({ ...errors, ssnLong: true });
        } else if (e.target.value.length < 4) {
          setErrors({ ...errors, ssnShort: true })
        } else {
          setErrors({ ...errors, ssnShort: false, ssnLong: false });
        }
      } else {
        if (e.target.value.length !== 0 && e.target.value.length > 4) {
          setErrors({ ...errors, ssnLong: true });
        } else if (e.target.value.length !== 0 && e.target.value.length < 4) {
          setErrors({ ...errors, ssnShort: true })
        } else {
          setErrors({ ...errors, ssnShort: false, ssnLong: false });
        }
      }
    }
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleTypeFields = (populationsettings_id) => {
    let temp = locationPopulationSettings.find(p => p._id === populationsettings_id);
    if (temp) {
      setUserFields(temp);
      setFormState(formState => ({
        ...formState,
        population_type: temp.type
      }));
    } else {
      setUserFields({ ...getPopulationManagerInit });
      setFormState(formState => ({
        ...formState,
        population_type: '',
        populationsettings_id: ''
      }));
    }
  }

  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
  }

  const handleSubmit = event => {
    event.preventDefault();
    setDisplayError(null);
    setDisplaySuccess(null);
    setFormError({});
    trimFormData();
    if (formState.yearOfBirth || formState.monthOfBirth || formState.dateOfBirth) {
      if (formState.yearOfBirth && formState.monthOfBirth && formState.dateOfBirth)
        formState.dob = moment().year(formState.yearOfBirth).month(formState.monthOfBirth - 1).date(formState.dateOfBirth).format('YYYY-MM-DD');
      else
        return setDisplayError('Please enter correct date of birth');
    }
    if (errors.ssnLong || errors.ssnShort)
      return
    let error = validate(formState, { email: { email: true }, phone: { length: { minimum: 10 } } });
    if (error) {
      setDisplayError(error.email ? error.email[0] : error.phone ? error.phone[0] : null);
      setFormError(error);
    } else {
      setSaveLoading(true);
      if (imgState.imagePath) {
        let formData = new FormData();
        formData.append('uploadImage', imgState.imagePath);
        uploadPhoto(formData).then(res => {
          if (res.data.success) {
            formState.photo = '/images/' + res.data.data;
            userId ? modifyUser() : saveUser();
          } else {
            setSaveLoading(false);
            setDisplayError(res.data.message);
          }
        }).catch(error => {
          setSaveLoading(false);
          showErrorDialog(error);
        });
      } else {
        userId ? modifyUser() : saveUser();
      }
    }
  };

  const trimFormData = () => {
    formState.email = formState.email ? formState.email.trim() : undefined;
    formState.phone = formState.phone ? formState.phone.replace(/ +/g, '') : undefined;
  }

  const saveUser = () => {
    createUser(formState).then(res => {
      setSaveLoading(false);
      if (res.data.success) {
        setDisplaySuccess(res.data.message);
        setTimeout(() => {
          onDialogClose('refetch');
        }, 1000);
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setSaveLoading(false);
      showErrorDialog(error);
    });
  }

  const modifyUser = () => {
    updateUser(userId, formState).then(res => {
      setSaveLoading(false);
      if (res.data.success) {
        setDisplaySuccess(res.data.message);
        setTimeout(() => {
          onDialogClose('refetch');
        }, 1000);
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setSaveLoading(false);
      showErrorDialog(error);
    });
  }

  const handleClose = () => {
    onDialogClose();
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      maxWidth={'md'}
    >
      <DialogTitle onClose={handleClose} className={brandClasses.headerContainer}>
        <Typography component={'span'} className={brandClasses.headerTitle}>
          {userId ? 'EDIT USER ' : '+ ADD USER '}
          <sup>
            {' '}
            <Tooltip title={userId ? 'Edit user' : '+ Add user'} placement="right-start">
              <HelpIcon />
            </Tooltip>{' '}
          </sup>
          {fetchLoading
            ? <CircularProgress size={20} style={{ marginLeft: '15px' }} />
            : null
          }
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              {locations
                ?
                <FormControl
                  className={brandClasses.shrinkTextField}
                  required
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Locations</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Locations* "
                    name="location_id"
                    displayEmpty
                    value={formState.location_id || ''}
                  >
                    <MenuItem value=''>
                      <Typography className={brandClasses.selectPlaceholder}>Select Location</Typography>
                    </MenuItem>
                    {locations.map((location, index) => (
                      <MenuItem key={index} value={location._id}>
                        {location.name}
                        {location.client_id.name && `  –  (${location.client_id.name})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                :
                <CircularProgress size={20} className={brandClasses.progressSpinner} />
              }
            </Grid>
            <Grid item xs={12} sm={4}>
              {locationPopulationSettings
                ?
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Type</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Population Type* "
                    name="populationsettings_id"
                    displayEmpty
                    value={formState.populationsettings_id || ''}
                  >
                    <MenuItem value=''>
                      <Typography className={brandClasses.selectPlaceholder}>Select Type</Typography>
                    </MenuItem>
                    {locationPopulationSettings.map((pm, index) => (
                      <MenuItem key={index} value={pm._id}>{pm.type}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Type will be based on Locations</FormHelperText>
                </FormControl>
                :
                <CircularProgress size={20} className={brandClasses.progressSpinner} />
              }
            </Grid>
            <Grid item xs={12} sm={4}>
              {locationDepartments
                ?
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Department</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Department* "
                    name="department_id"
                    displayEmpty
                    value={formState.department_id || ''}
                  >
                    <MenuItem value=''>
                      <Typography className={brandClasses.selectPlaceholder}>Select Department</Typography>
                    </MenuItem>
                    {locationDepartments.map((location, index) => (
                      <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Departments will be based on Locations</FormHelperText>
                </FormControl>
                :
                <CircularProgress size={20} className={brandClasses.progressSpinner} />
              }
            </Grid>
            {!userFields.name_hide &&
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Last Name"
                  placeholder="Enter last name"
                  name="last_name"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.last_name || ''}
                  required={userFields.name_required}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            }
            {!userFields.name_hide &&
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="First Name"
                  placeholder="Enter first name"
                  name="first_name"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.first_name || ''}
                  required={userFields.name_required}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            }
            {!userFields.email_hide &&
              <Grid item xs={12} sm={6}>
                <TextField
                  type="email"
                  label="Email"
                  placeholder="Enter email address"
                  name="email"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.email || ''}
                  required={userFields.email_required}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            }
            <Grid item container spacing={3} xs={12} sm={6}>
              <Grid item xs={12} sm={8}>
                <TextField
                  type="number"
                  label="Office Phone"
                  placeholder="Enter office number"
                  name="office_phone"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.office_phone || ''}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item container xs={12} sm={4}>
                <TextField
                  type="text"
                  label="Ext."
                  placeholder="Enter ext."
                  name="ext"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.ext || ''}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {!userFields.phone_hide &&
              <Grid item xs={12} sm={6}>
                <NumberFormat
                  customInput={TextField}
                  format="### ### ####"
                  mask=" "
                  type="tel"
                  label="Cell Phone"
                  placeholder="Enter cell number"
                  name="phone"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.phone || ''}
                  required={userFields.phone_required}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={formError.phone ? true : false}
                />
              </Grid>
            }
            {!userFields.address_hide &&
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="County"
                    placeholder="Enter County"
                    name="county"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.county || ''}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    required={userFields.address_required}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="Address 1"
                    placeholder="Enter address 1"
                    name="address"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.address || ''}
                    required={userFields.address_required}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="Address 2"
                    placeholder="Enter address 2"
                    name="address2"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.address2 || ''}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    type="text"
                    label="City"
                    placeholder="Enter city"
                    name="city"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.city || ''}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    required={userFields.address_required}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    variant="outlined"
                    required={userFields.address_required}
                  >
                    <InputLabel>State</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="State"
                      name="state"
                      value={formState.state || 'Select State'}
                    >
                      <MenuItem value='Select State'>
                        <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                      </MenuItem>
                      {getStates.map((state, index) => (
                        <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ZipCodeInput
                    label="Zip Code"
                    placeholder="Enter zip"
                    name="zip_code"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.zip_code || ''}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    required={userFields.address_required}
                  />
                </Grid>
              </>
            }
            {!userFields.gender_hide && <>
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                  required={userFields.gender_required}
                >
                  <InputLabel>Gender</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Gender"
                    name="gender"
                    value={formState.gender || 'Select Gender'}
                  >
                    <MenuItem value='Select Gender'>
                      <Typography className={brandClasses.selectPlaceholder}>Select Gender</Typography>
                    </MenuItem>
                    {getGenders.map((gender, index) => (
                      <MenuItem key={index} value={gender}>{gender}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
            }
            {!userFields.race_hide && <>
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                  required={userFields.race_required}
                >
                  <InputLabel>Race</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Race"
                    name="race"
                    value={formState.race || 'Select Race'}
                  >
                    <MenuItem value='Select Race'>
                      <Typography className={brandClasses.selectPlaceholder}>Select Race</Typography>
                    </MenuItem>
                    {getRace.map((race, index) => (
                      <MenuItem key={index} value={race}>{race}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
            }
            {!userFields.ethnicity_hide && <>
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                  required={userFields.ethnicity_required}
                >
                  <InputLabel>Ethnicity</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Ethnicity"
                    name="ethnicity"
                    value={formState.ethnicity || 'Select Ethnicity'}
                  >
                    <MenuItem value='Select Ethnicity'>
                      <Typography className={brandClasses.selectPlaceholder}>Select Ethnicity</Typography>
                    </MenuItem>
                    {getEthnicities.map((ethnicity, index) => (
                      <MenuItem key={index} value={ethnicity}>{ethnicity}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

            </>
            }
            {!userFields.date_of_birth_hide && <>
              <Grid item xs={12} sm={6}>
                <Typography variant="h5" className={classes.title}>Date of Birth:</Typography>
                <div className={classes.birthday}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    style={{ width: '80px' }}
                    variant="outlined"
                    required={userFields.date_of_birth_required}
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Day</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Day* "
                      name="dateOfBirth"
                      displayEmpty
                      value={formState.dateOfBirth || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Day</Typography>
                      </MenuItem>
                      {[...Array(31)].map((_, item) => (
                        <MenuItem value={item + 1} key={item}>{item + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={brandClasses.shrinkTextField}
                    style={{ width: 120 }}
                    required={userFields.date_of_birth_required}
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Month</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Month* "
                      name="monthOfBirth"
                      displayEmpty
                      value={formState.monthOfBirth || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Month</Typography>
                      </MenuItem>
                      {moment.months().map((item, index) => (
                        <MenuItem value={index + 1} key={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={brandClasses.shrinkTextField}
                    style={{ width: 80 }}
                    required={userFields.date_of_birth_required}
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Year</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Year* "
                      name="yearOfBirth"
                      displayEmpty
                      value={formState.yearOfBirth || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Year</Typography>
                      </MenuItem>
                      {[...Array.from({ length: (1900 - moment().get('y')) / -1 + 1 })].map((_, item) => (
                        <MenuItem value={moment().get('y') + (item * -1)} key={item}>{moment().get('y') + (item * -1)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>

            </>
            }
            {!userFields.demographics_ssn_hide && <>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Last 4 digits of your SSN"
                  placeholder="Last 4 Social Security Number *** ** 0000"
                  name="social_digits"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.social_digits || ''}
                  fullWidth
                  required={userFields.demographics_ssn_required}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={errors.ssnLong || errors.ssnShort}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{!formState.social_digits ? '' : '*** **'}</InputAdornment>,
                    maxLength: 4, classes: { root: classes.inputLabel }
                  }}
                />
                <Typography className={classes.errorTxt}>
                  {errors.ssnLong ? errorsMsg.ssnLong : errors.ssnShort ? errorsMsg.ssnShort : ""}
                </Typography>
              </Grid>
            </>
            }

            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Verification ID Number"
                placeholder="Verification ID Number"
                name="verification_id"
                className={brandClasses.shrinkTextField}
                value={formState.verification_id || ''}
                disabled
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}></Grid> */}
            <Grid item xs={12} sm={6}>
              <div className={brandClasses.uploadContanier}>
                <Typography className={brandClasses.uploadTitle}>Photo</Typography>
                {imgState.imgURL
                  ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                  : formState.photo
                    ? <img src={apiUrl + formState.photo} className={brandClasses.uploadedPhoto} alt="img" />
                    : <Typography className={brandClasses.uploadDesc}>Upload profile image</Typography>
                }
                <div className={brandClasses.uploadImageContainer}>
                  <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file" onChange={handlePhotoChange} />
                  <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                    <img src="/images/svg/UploadPhoto.svg" alt="" />
                    <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                    {imgCompressionLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </label>
                </div>
              </div>
            </Grid>
          </Grid>

          <div className={brandClasses.footerMessage}>
            {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
            {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
          </div>

          <div className={brandClasses.footerButton}>
            {/* <Button
              className={brandClasses.button}
              classes={{ disabled: brandClasses.buttonDisabled }}
              disabled={saveLoading}
              type="submit"
            >
              SAVE {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            </Button> */}
            <TextButton disabled={saveLoading} type="submit">
              SAVE {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            </TextButton>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
  departments: state.data.departments,
  populationSettings: state.data.populationSettings,
});

UserDialog.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  getAllPopulationSetting: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default connect(mapStateToProps, { getLocations1, getDepartments, getAllPopulationSetting, showFailedDialog, showErrorDialog })(UserDialog);