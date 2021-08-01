import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
// import brandStyles from 'theme/brand';
// import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import moment from "moment";
// import MomentUtils from '@date-io/moment';

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
    fontWeight: 400,
    textAlign: 'center',
    marginTop: 16,
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
    }
  },
  description: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    [theme.breakpoints.up(415)]: {
      fontSize: 18,
      marginBottom: 22,
    }
  },
  scheduleText: {
    fontSize: 24,
    fontWeight: 600,
    color: '#3ECCCD',
    lineHeight: '32px',
    textAlign: 'center'
  },
  logonButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#0F84A9',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 20,
    [theme.breakpoints.up(400)]: {
      marginTop: 20,
    }
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 250,
    margin: '0 auto',
    '& h4': {
      border: 'solid 1px #0F84A9',
      borderRadius: 10,
      fontSize: 18,
      fontWeight: 600,
      padding: 20,
      textAlign: 'center'
    }
  },
  buttonGroup: {
    border: 'solid #0F84A9 1px',
    borderRadius: 6
  },
  toggleButtonRoot: {
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#0F84A9',
    padding: '7px 14px'
  },
  toggleButtonActive: {
    fontSize: 16,
    backgroundColor: '#0F84A9 !important',
    color: '#fff !important',
  },
  alertBody:{
    backgroundColor: 'rgb(218 241 255)'
  }
}));

const Schedule = (props) => {
  const { 
    // handleQuestionsSubmit, 
    id 
  } = props;
  const [timeSlot, setTimeSlot] = React.useState('AM');
  const classes = useStyles();
  // const brandClasses = brandStyles();
  const [displayError, setDisplayError] = useState(null);
  const [scheduleDay] = useState(moment());

  React.useEffect(() => {
    console.log('question page id ', id);   
  }, [id]);

  const handleTimeSlot = (event, newFormats) => {
    console.log('newFormats', newFormats)
    if (newFormats) {
      setTimeSlot(newFormats);
    }
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  // const handleSubmit = async event => {
  //   handleQuestionsSubmit();
  // };

  console.log('weekday', moment(scheduleDay).weekday())
  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <div className={classes.alertContainer}>
          {displayError ? <Alert severity="error" className={classes.alertBody} onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
        </div>
        <Typography className={classes.title}>
          Please choose a date and time<br />
          to schedule your test:
        </Typography>
        <Typography className={classes.description}>
          Select a day
        </Typography>
        <br />
        <div className={classes.selectContainer}>

          <img src="/images/svg/chevron_dark_blue_left.svg" alt='left' />
          <Typography variant="h4">
            {/* {moment(scheduleDay).weekday} */}
            {'Aug 22'}
          </Typography>
          <img src="/images/svg/chevron_dark_blue_right.svg" alt='right' />
        </div>

        <Typography className={classes.description}>
          Select a time slot
        </Typography>

        <div style={{ textAlign: 'center' }}>
          <ToggleButtonGroup
            value={timeSlot}
            exclusive
            onChange={handleTimeSlot}
            aria-label="Time Slot"
            classes={{ root: classes.buttonGroup }}
          >
            <ToggleButton value="AM" aria-label="AM"
              classes={{ root: classes.toggleButtonRoot, selected: classes.toggleButtonActive }}>
              AM
          </ToggleButton>
            <ToggleButton value="PM" aria-label="PM"
              classes={{ root: classes.toggleButtonRoot, selected: classes.toggleButtonActive }}>
              PM
          </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <br /><br />
        <div className={classes.selectContainer}>

          <img src="/images/svg/chevron_dark_blue_left.svg" alt='left' />
          <Typography variant="h4">
            {'7:00 AM'}
          </Typography>
          <img src="/images/svg/chevron_dark_blue_right.svg" alt='right' />
        </div>
      </div>


    </div>
  )
}

Schedule.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Schedule;
