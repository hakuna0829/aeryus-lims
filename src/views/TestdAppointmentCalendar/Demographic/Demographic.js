import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from "moment";
import brandStyles from 'theme/brand';
import { getStates, getEthnicities, getGenders } from 'helpers';
import NumberFormat from 'react-number-format';
import getRace from 'helpers/getRace';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  header: {
    backgroundColor: '#3ECCCD',
    boxShadow: 'none'
  },
  footer: {
    backgroundColor: '#3ECCCD',
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    justifyContent: 'center'
  },
  formGrid: {
    width: '100%',
    paddingTop: theme.spacing(4),
    paddingLeft: '15%',
    paddingRight: '15%',
  },
  accountKey: {
    color: theme.palette.brandDark,
    marginLeft: 60,
    fontWeight: 600,
  },
  accountValue: {
    color: theme.palette.brandGray,
    marginLeft: 60
  },
  selectLabel: {
    color: theme.palette.brandDark,
    marginBottom: 2,
    // fontWeight: 600
  },
  selectedColor: {
    '& .MuiSelect-select': {
      color: '#FF931E',
    }
  },
  footerButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(15),
    // margin: theme.spacing(8),
  },
  scrollText: {
    color: '#3ECCCD',
  },
  titleText: {
    color: '#043B5D',
    fontFamily: 'Montserrat',
    textAlign: 'center'
  },
  subTitleText: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    textAlign: 'center'
  },
  selectedDateTime: {
    color: '#3ECCCD',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    textAlign: 'center'
  },
  spinner: {
    color: '#3ECCCD',
  },
  desktop: {
    height: 149.2,
    width: 149.2,
  },
  mobile: {
    height: 86,
    width: 86,
  },
  dateBox: {
    margin: 10,
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1.2px solid #0F84A9',
    backgroundColor: '#FFFFFF',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.2)',
  },
  activeDateBox: {
    margin: 10,
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1.2px solid #0F84A9',
    backgroundColor: '#3ECCCD',
    boxShadow: '2px 2px 6px 1px rgba(15,132,169,0.2)',
    '&:hover': {
      backgroundColor: '#3ECCCD',
    },
  },
  displayDay: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    marginBottom: 5
  },
  activeDisplayDay: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    marginBottom: 5
  },
  displayDate: {
    color: '#0F84A9',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  activeDisplayDate: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  hide: {
    display: 'none'
  },
  emptyIcon: {
    width: 49
  },
  emptyBox: {
    width: 86,
  },
  amPmGroup: {
    borderRadius: 5,
    boxShadow: '2px 2px 4px 1px rgba(15,132,169,0.15)',
    '&.MuiButton-outlined': {
      border: '1px solid #0F84A9',
    }
  },
  activeAmPm: {
    backgroundColor: '#0F84A9',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#0F84A9',
    },
  },
  amPm: {
    backgroundColor: '#FFFFFF',
    color: '#0F84A9'
  },
  timeSlotList: {
    overflow: 'auto',
    maxHeight: 300,
  },
  timeSlotButton: {
    width: 168.82,
    color: '#0F84A9',
    border: '0.82px solid #0F84A9',
    borderRadius: 5.5,
    backgroundColor: '#FFFFFF',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.15)',
    textTransform: 'none',
    display: 'flex',
    marginBottom: 21,
    marginLeft: 60,
    marginRight: 40,
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#3ECCCD',
    },
  },
  confirmButton: {
    width: 168.82,
    color: '#FFFFFF',
    border: '0.82px solid #0F84A9',
    borderRadius: 5.5,
    backgroundColor: '#3ECCCD',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.15)',
    textTransform: 'none',
    display: 'flex',
    fontWeight: 600,
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#0F84A9',
    },
  },
  cancelButton: {
    width: 168.82,
    color: '#0F84A9',
    border: '0.82px solid #0F84A9',
    borderRadius: 5.5,
    backgroundColor: '#FFFFFF',
    boxShadow: '2px 2px 7px 1px rgba(15,132,169,0.15)',
    textTransform: 'none',
    display: 'flex',
    fontWeight: 600,
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#0F84A9',
    },
  },
  buttonDisabled: {
    backgroundColor: '#FFFFFF',
  },
  error: {
    padding: 20
  },
}));

const Demographic = (props) => {
  const { submitLoading, user, handleDemographicSubmit } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (user.dob) {
      let dob = moment.utc(user.dob);
      user.dateOfBirth = dob.date();
      user.monthOfBirth = dob.month() + 1;
      user.yearOfBirth = dob.year();
    }
    setFormState({ ...user });
  }, [user]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formState.email = formState.email.trim();
    formState.phone = formState.phone.replace(/ +/g, '');
    formState.dob = moment().year(formState.yearOfBirth).month(formState.monthOfBirth - 1).date(formState.dateOfBirth).format('YYYY-MM-DD');
    handleDemographicSubmit(formState);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h4" className={classes.titleText}>
            {'Please enter your information'}
          </Typography>
        </Grid>

        <Grid
          item
          // style={{ marginTop: 40 }}
          className={classes.formGrid}
        >
          <form
            onSubmit={handleSubmit}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Last Name"
                  placeholder="Enter last name"
                  name="last_name"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.last_name || ''}
                  required
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="First Name"
                  placeholder="Enter first name"
                  name="first_name"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.first_name || ''}
                  required
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumberFormat
                  customInput={TextField}
                  format="### ### ####"
                  mask=" "
                  type="tel"
                  label="10 Digit Phone Number"
                  placeholder="Enter Phone number"
                  name="phone"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.phone || ''}
                  required
                  fullWidth
                  // disabled={user.phone !== undefined}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="email"
                  label="Email"
                  placeholder="Enter email address"
                  name="email"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.email || ''}
                  required
                  fullWidth
                  // disabled={user.email !== undefined}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Address"
                  placeholder="Enter address"
                  name="address"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.address || ''}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                />
              </Grid>
              <Grid item container spacing={3} xs={12} sm={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel>State</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="State* "
                      name="state"
                      value={formState.state || ''}
                    >
                      {getStates.map((state, index) => (
                        <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item container xs={12} sm={6}>
                  <TextField
                    type="text"
                    label="Zip Code"
                    placeholder="Enter zip"
                    name="zip_code"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.zip_code || ''}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  // style={{ height: 52 }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  type="text"
                  label="Last 4 digits of social"
                  placeholder="0000"
                  name="social_digits"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.social_digits || ''}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputLabel className={classes.selectLabel}>Date of Birth</InputLabel>
                <FormControl
                  variant="outlined"
                  required
                  className={clsx(classes.selectedColor, brandClasses.selectExpandIcon, brandClasses.shrinkTextField)}
                  style={{ width: 100 }}
                >
                  <Select
                    IconComponent={ExpandMoreIcon}
                    onChange={handleChange}
                    name="dateOfBirth"
                    value={formState.dateOfBirth || ''}
                  >
                    {[...Array(31)].map((_, item) => (
                      <MenuItem value={item + 1} key={item}>{item + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <InputLabel className={classes.selectLabel}>Month of Birth</InputLabel>
                <FormControl
                  variant="outlined"
                  required
                  className={clsx(classes.selectedColor, brandClasses.selectExpandIcon, brandClasses.shrinkTextField)}
                  style={{ width: 100 }}
                >
                  <Select
                    IconComponent={ExpandMoreIcon}
                    onChange={handleChange}
                    name="monthOfBirth"
                    value={formState.monthOfBirth || ''}
                  >
                    {[...Array(12)].map((_, item) => (
                      <MenuItem value={item + 1} key={item}>{item + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <InputLabel className={classes.selectLabel}>Year of Birth</InputLabel>
                <FormControl
                  variant="outlined"
                  required
                  className={clsx(classes.selectedColor, brandClasses.selectExpandIcon, brandClasses.shrinkTextField)}
                  style={{ width: 200 }}
                >
                  <Select
                    IconComponent={ExpandMoreIcon}
                    onChange={handleChange}
                    name="yearOfBirth"
                    value={formState.yearOfBirth || ''}
                  >
                    {[...Array.from({ length: (1900 - moment().get('y')) / -1 + 1 })].map((_, item) => (
                      <MenuItem value={moment().get('y') + (item * -1)} key={item}>{moment().get('y') + (item * -1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel className={classes.selectLabel}>Gender</InputLabel>
                <FormControl
                  variant="outlined"
                  required
                  className={clsx(classes.selectedColor, brandClasses.selectExpandIcon, brandClasses.shrinkTextField)}
                  style={{ width: 200 }}
                >
                  <Select
                    IconComponent={ExpandMoreIcon}
                    onChange={handleChange}
                    name="gender"
                    value={formState.gender || ''}
                  >
                    {getGenders.map((gender, index) => (
                      <MenuItem value={gender} key={index}>{gender}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <InputLabel className={classes.selectLabel}>Race</InputLabel>
                <FormControl
                  variant="outlined"
                  className={clsx(classes.selectedColor, brandClasses.selectExpandIcon, brandClasses.shrinkTextField)}
                  style={{ width: 200 }}
                >
                  <Select
                    IconComponent={ExpandMoreIcon}
                    onChange={handleChange}
                    name="race"
                    value={formState.race || ''}
                  >
                    {getRace.map((race, index) => (
                      <MenuItem key={index} value={race}>{race}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel className={classes.selectLabel}>Ethnicity</InputLabel>
                <FormControl
                  variant="outlined"
                  className={clsx(classes.selectedColor, brandClasses.selectExpandIcon, brandClasses.shrinkTextField)}
                  style={{ width: 200 }}
                >
                  <Select
                    IconComponent={ExpandMoreIcon}
                    onChange={handleChange}
                    name="ethnicity"
                    value={formState.ethnicity || ''}
                  >
                    {getEthnicities.map((ethnicity, index) => (
                      <MenuItem value={ethnicity} key={index}>{ethnicity}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <div className={classes.footerButton}>
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={submitLoading}
                type="submit"
              >
                {'Next'} {submitLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>

    </div >
  )
}

Demographic.propTypes = {
  user: PropTypes.object.isRequired,
  submitLoading: PropTypes.bool.isRequired,
  handleDemographicSubmit: PropTypes.func.isRequired,
};

export default Demographic;