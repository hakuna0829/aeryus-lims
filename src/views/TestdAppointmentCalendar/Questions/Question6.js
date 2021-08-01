import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
// import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
// import MomentUtils from '@date-io/moment';
import moment from "moment";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  content: {
    position: 'fixed',
    top: 65,
    width: '100%',
    height: 'calc(100% - 97px)',
    backgroundSize: 'cover',
    overflowY: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.up(415)]: {
      top: 80,
      height: 'calc(100% - 128px)',
    }
  },
  contentBody: {
    height: '100%',
    paddingTop: '2vh'
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 16,
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
      lineHeight: 1.5
    }
  },
  dobTitle: {
    color: '#0F84A9',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 24,
    [theme.breakpoints.up(415)]: {
      fontSize: 16,
      marginBottom: 22,
    }
  },
  tempBox: {
    width: '100%',
    height: '100%',
    border: 'solid 1px #0F84A9',
    padding: 0,
    borderRadius: 8,
    marginTop: 16,
    // '& input': {
    //   padding: '4px 10px',
    // },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    }
  },
  utilRoot: {
    width: '100%',
    height: '100%',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    padding: 0,
    marginLeft: 8,
    marginTop: 16,
    '& input': {
      padding: '13px 13px',
    },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    }
  },
  logonButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#0F84A9',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 30,
    [theme.breakpoints.up(376)]: {
      marginTop: 50,
    }
  },
  backButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 25,
    color: '#0F84A9',
    border: '#0F84A9 solid 1px',
    '&:hover': {
      backgroundColor: '#0F84A9',
      color: '#fff',
    },
    [theme.breakpoints.up(440)]: {
      marginTop: 30,
    }
  },
  boxContainer: {
    width: 360,
    margin: '0 auto',
    [theme.breakpoints.up(376)]: {
      width: 340,
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px'
  },
  dateLabel: {
    marginTop: '-8px',
    fontSize: '10px',
    backgroundColor: 'white',
    padding: '0 3px'
  },
  inputTextField: {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-input': {
        padding: '15px !important',
      },
      '& fieldset': {
      },
      '&:hover fieldset': {
      },
      '&.Mui-focused fieldset': {
      },
    },
    '& .MuiInputLabel-shrink': {
    },
  },

}));

const Question6 = (props) => {
  const { user, handleQuestionsSubmit, backTab } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [formState, setFormState] = useState({});

  React.useEffect(() => {
    if (user) {
      if (user.dob) {
        let dob = moment.utc(user.dob);
        user.dateOfBirth = dob.date();
        user.monthOfBirth = dob.month() + 1;
        user.yearOfBirth = dob.year();
      }
      setFormState(user);
    }
  }, [user]);

  // const handleEmpDateChange = (e) => {
  //   e.persist();
  //   setFormState(formState => ({
  //     ...formState,
  //     dob: moment(e.target.value)
  //   }));
  // };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    formState.dob = moment().year(formState.yearOfBirth).month(formState.monthOfBirth - 1).date(formState.dateOfBirth).format('YYYY-MM-DD');
    handleQuestionsSubmit(formState);
  };

  const handleBack = () => {
    backTab('question');
  }

  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          We need to collect a little <br /> information about you
        </Typography>
        <br />
        {/* <Typography className={classes.description}>
          Select all that apply
        </Typography> */}

        <form
          onSubmit={handleSubmit}
        >
          <div className={classes.boxContainer}>
            {/* <TextField
              placeholder="First Name"
              name="first_name"
              className={classes.tempBox}
              onChange={handleChange}
              value={formState.first_name || ''}
              required
              variant="outlined"
            /> */}
            <TextField
              type="text"
              label="First name"
              placeholder="First Name"
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
            <br />
            <TextField
              type="text"
              label="Middle name"
              placeholder="Middle Name"
              name="middle_name"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.middle_name || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="Last name"
              placeholder="Last Name"
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
            {/* <br />
            <TextField
              type="date"
              label="Date of Birth"
              // defaultValue="2017-05-24"
              name="dob"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleEmpDateChange}
              value={formState.dob ? moment(formState.dob).format('YYYY-MM-DD') : ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            /> */}
            <br />
            <Typography className={classes.dobTitle}>Date of Birth:</Typography>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <FormControl
                variant="outlined"
                required
                className={brandClasses.shrinkTextField}
                style={{ width: 120, marginRight: 10 }}
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
                className={brandClasses.shrinkTextField}
                style={{ width: '80px', marginRight: 10 }}
                required
                variant="outlined"
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
                required
                className={brandClasses.shrinkTextField}
                style={{ width: 80 }}
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
            </Grid>
            {/* <FormControl
              className={brandClasses.shrinkTextField}
              fullWidth
              required
              variant="outlined"
            >
              <InputLabel className={classes.dateLabel}>Date of Birth</InputLabel>
              <MuiPickersUtilsProvider utils={MomentUtils} style={{ margin: 0, margiinTop: 16 }}>
                <DatePicker
                  value={formState.dob}
                  showTodayButton={true}
                  format="MM/DD/yyyy"
                  onChange={handleEmpDateChange}
                  className={classes.utilRoot}
                  style={{ marginLeft: 0 }}
                  required
                />
              </MuiPickersUtilsProvider>
            </FormControl> */}

          </div>

          <div style={{ textAlign: 'center' }}>
            <Typography className={classes.description} style={{ textAlign: 'center' }}>
              <img src='/images/svg/lock_icon.svg' style={{ marginRight: '1em' }} alt='lock' />
              &nbsp;All your personal information <br /> is encrypted and secure.
            </Typography>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px auto 50px' }}>
            {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, cursor: 'pointer' }} onClick={handleBack} />
            <Button type="submit" >
              <img src='/images/svg/next_button.svg' alt='next' />
            </Button> */}
            <Button
              className={clsx(brandClasses.backButton, brandClasses.loginButton)}
              onClick={handleBack}
            >
              <KeyboardBackspaceIcon style={{ color: "#0F84A9" }} />
              Back
            </Button>

            <Button
              className={clsx(brandClasses.logonButton, brandClasses.loginButton)}
              type="submit"
            >
              Next
              <ArrowRightAltIcon style={{ color: "#fff" }} />
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}

Question6.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Question6;
