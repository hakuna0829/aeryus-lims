import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

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
    fontWeight: 500,
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
    marginTop: 30,
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginLeft: 8
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  boxContainer: {
    width: 200,
    // height: 120,
    margin: '0 auto',
    // border: '#0F84A9 solid 1px',
    [theme.breakpoints.up(376)]: {
      width: 200,
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '5px 10px',
  },
  uploadedPhoto: {
    maxWidth: 150,
    maxHeight: 150,
    paddingTop: 10
  },
  uploadContanier: {
    border: `solid 1px`,
    borderColor: theme.palette.brandDark,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    marginBottom: 32
  },
  uploadImageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& img': {
      marginRight: 10,
      width: 30
    },
    '& img:last-child': {
      marginRight: 0
    }
  },
  uploadTitle: {
    color: '#0F84A9',
    fontSize: 10,
    position: 'absolute',
    top: -10,
    background: '#fff',
    padding: '0 4px'
  },
  uploadDesc: {
    color: '#9B9B9B',
    fontSize: 14,
    padding: '4px 10px',
    textAlign: 'center'
  },
  uploadInput: {
    display: 'none',
  },
  titleText: {
    color: theme.palette.blueDark,
    paddingBottom: 20,
    textAlign: 'center'
  },
  alertContainer: {
    display: 'flex',
    padding: '0 15px',
    width: '100%',
    justifyContent: 'flex-end'
  },
  address:{
    color: '#0F84A9',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '22px',
    textAlign: 'center'
  },
  alertBody:{
    backgroundColor: 'rgb(218 241 255)'
  }
}));

const Booking = (props) => {
  const { handleQuestionsSubmit, id } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [displayError, setDisplayError] = useState(null);
  // const [image] = useState({ preview: "", raw: "" });

  // const [values, setValues] = React.useState({
  //   data: initialValues,
  //   date: moment()
  // });

  React.useEffect(() => {
    console.log('question page id ', id);
    // setFormState({ front_card: '', back_card: '' });
  }, [id]);

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const handleSubmit = async event => {
    handleQuestionsSubmit();
  };

  
  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <div className={classes.alertContainer}>
          {displayError ? <Alert severity="error" className={classes.alertBody} onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
        </div>
        <Typography className={classes.title}>
          Thank you for booking<br />
          your appointment.
        </Typography>
        <Typography className={classes.description}>
          Test date and time:
        </Typography>
        <br />
        <Typography className={classes.scheduleText}>
          {'AUGUST 23, 2020'}<br />
          {'7:15AM'}
        </Typography>


        <div style={{ textAlign: 'center' }}>
          <Button
            className={clsx(classes.logonButton, brandClasses.loginButton)}
            onClick={handleSubmit}
            startIcon={<CalendarTodayOutlinedIcon />}
          >
            Add to Calendar
          </Button>
          <br />
          <Typography className={classes.description}>
            Personal Verification Code
          </Typography>
          <img src='/images/barcode.png' alt='' />

          <Typography className={classes.description}>
            Testing site address
          </Typography>

          <Typography className={classes.address} >
            Broward War Memorial<br />
            800 NE 8th Street<br />
            Fort Lauderdale, FL 33304
          </Typography>
          <br />
        </div>
      </div>


    </div>
  )
}

Booking.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Booking;
