import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, MenuItem, Select, FormControl, InputLabel, CircularProgress, TextField, Button } from '@material-ui/core';
// import RadioCheckButton from 'components/RadioCheckButton';
import brandStyles from 'theme/brand';
import { getStates, getEthnicities, getGenders, getRace } from 'helpers';
import { updateUser2 } from 'actions/api';
import moment from "moment";
import PhoneNumberInput from 'components/PhoneNumberInput';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px 0px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(1)}px`,
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  title: {
    color: theme.palette.brandDark,
    // textAlign: 'center',
    fontWeight: 600,
    marginBottom: 20
  },
  checkbox: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(2),
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end'
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'flex-end'
  },
  upContent: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5)
    },
    // paddingTop: '0px'
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right",
    width: 70
  },
  birthday: {
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
  }
}));

const DemoGraphics = (props) => {
  const { nextTab, user, setUser, updateUser2, isMandatory } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (user.dob) {
      let dob = moment.utc(user.dob);
      user.dateOfBirth = dob.date();
      user.monthOfBirth = dob.month() + 1;
      user.yearOfBirth = dob.year();
    }
    setFormState(user);
  }, [user]);

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const trimFormData = () => {
    formState.email = formState.email ? formState.email.trim() : undefined;
    formState.phone = formState.phone ? formState.phone.replace(/ +/g, '') : undefined;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    if (!didModified) return nextTab();
    trimFormData();
    setLoading(true);
    formState.dob = moment().year(formState.yearOfBirth).month(formState.monthOfBirth - 1).date(formState.dateOfBirth).format('YYYY-MM-DD');
    const res = await updateUser2(user._id, formState);
    setLoading(false);
    if (res.success) {
      setUser(formState);
      nextTab();
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <img src="/images/svg/status/users_icon.svg" alt="" />
          {'User Manager'} |
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>PATIENT INFORMATION</Typography>
      </div>

      <form
        onSubmit={handleSubmit}
      >
        <div className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5" >PATIENT INFORMATION</Typography>
        </div>
        <div className={classes.upContent}>
          <Grid container spacing={4}>
            <Grid item md={4}>
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
            <Grid item md={4}>
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
            <Grid item md={4}>
              <TextField
                type="text"
                label="Middle Name"
                placeholder="Enter middle name"
                name="middle_name"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.middle_name || ''}
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item md={5} >
              <Typography variant="h5" className={classes.title}>Date of Birth:</Typography>
              <div className={classes.birthday}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  style={{ width: '80px' }}
                  required={isMandatory}
                  variant="outlined"
                >
                  <InputLabel>Day</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Day* "
                    name="dateOfBirth"
                    value={formState.dateOfBirth || ''}
                  >
                    {[...Array(31)].map((_, item) => (
                      <MenuItem value={item + 1} key={item}>{item + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  required={isMandatory}
                  className={brandClasses.shrinkTextField}
                  style={{ width: 120 }}
                >
                  <InputLabel>Month</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Month* "
                    name="monthOfBirth"
                    value={formState.monthOfBirth || ''}
                  >
                    {moment.months().map((item, index) => (
                      <MenuItem value={index + 1} key={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  required={isMandatory}
                  className={brandClasses.shrinkTextField}
                  style={{ width: 80 }}
                >
                  <InputLabel>Year</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Year* "
                    name="yearOfBirth"
                    value={formState.yearOfBirth || ''}
                  >
                    {[...Array.from({ length: (1900 - moment().get('y')) / -1 + 1 })].map((_, item) => (
                      <MenuItem value={moment().get('y') + (item * -1)} key={item}>{moment().get('y') + (item * -1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>

            {/* <Grid item md={7}>
              <div className={classes.radioGroup}>
                <Typography variant="body1" className={classes.label}>
                  Ethnicity:
                </Typography>
                <RadioGroup
                  value={formState.ethnicity || ''}
                  onChange={handleChange}
                  name="ethnicity"
                  style={{ flexDirection: 'unset' }}
                >
                  {getEthnicities.map((ethnicity, index) => (
                    <RadioCheckButton required={true} key={index} label={ethnicity} value={ethnicity} />
                  ))}
                </RadioGroup>
              </div>
              <div className={classes.radioGroup}>
                <Typography variant="body1" className={classes.label}>
                  Gender:
                </Typography>
                <RadioGroup
                  value={formState.gender || ''}
                  onChange={handleChange}
                  name="gender"
                  style={{ flexDirection: 'unset' }}
                >
                  {getGenders.map((gender, index) => (
                    <RadioCheckButton required={true} key={index} label={gender} value={gender} />
                  ))}
                </RadioGroup>
              </div>
            </Grid> */}
          </Grid>

          <Grid container spacing={4}>
            <Grid item md={4}>
              <FormControl
                className={brandClasses.shrinkTextField}
                fullWidth
                variant="outlined"
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
            <Grid item md={4}>
              <FormControl
                className={brandClasses.shrinkTextField}
                fullWidth
                variant="outlined"
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
            <Grid item md={4}>
              <FormControl
                className={brandClasses.shrinkTextField}
                fullWidth
                variant="outlined"
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
          </Grid>
          <br /><br />

          <Grid container spacing={3}>
            <Grid item md={5}>
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
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={3}>
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
            <Grid item md={4}></Grid>
            <Grid item md={5}>
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
            <Grid item md={3}>
              <FormControl
                className={brandClasses.shrinkTextField}
                fullWidth
                variant="outlined"
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

            <Grid item md={4}></Grid>

            <Grid item md={5}>
              <PhoneNumberInput
                type="tel"
                label="Cell Phone"
                placeholder="Enter cell number"
                name="phone"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.phone || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={7}>
            </Grid>

            <Grid item md={4}>
              <PhoneNumberInput
                type="tel"
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
            <Grid item md={3}>
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
        </div>

        <div className={classes.footer}>
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
            type="submit"
          >
            NEXT {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </div>

      </form>
    </div>
  );
};

DemoGraphics.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  updateUser2: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
  isMandatory: PropTypes.bool.isRequired,
};

export default connect(null, { updateUser2 })(DemoGraphics);