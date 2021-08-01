import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';

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
    textAlign:'center'
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
  alertBody:{
    backgroundColor: 'rgb(218 241 255)'
  }
}));

const Testing = (props) => {
  const { handleQuestionsSubmit, id } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [displayError, setDisplayError] = useState(null);
  const [formState, setFormState] = useState({ front_card: '', back_card: '' });
  // const [image] = useState({ preview: "", raw: "" });

  // const [values, setValues] = React.useState({
  //   data: initialValues,
  //   date: moment()
  // });

  React.useEffect(() => {
    console.log('question page id ', id);
    setFormState({ front_card: '', back_card: '' });
  }, [id]);

  const handlePhotoChange = (key, event) => {
    console.log(key, event)
    let files = event.target.files;
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      setDisplayError('Only images are supported.');
      return;
    } else {
      setDisplayError(null);
    }

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      let tempState = formState;
      tempState[key] = reader.result;
      console.log(key, reader.result);
      setFormState({ ...tempState });
    }

  }

  const closeErrorMessage = () => {
    console.log(handlePhotoChange)
    setDisplayError(null);
  };

  const handleSubmit = async event => {
    handleQuestionsSubmit(formState);
  };

  console.log('prevValues', formState)

  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <div className={classes.alertContainer}>
          {displayError ? <Alert severity="error" className={classes.alertBody} onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
        </div>
        <Typography className={classes.title}>
          {/* Thank you for scheduling your<br />
          test. A reminder will be<br />
          sent 24 hours prior to<br />
          your appointment. */}
        </Typography>
        <Typography className={classes.description}>
          You scheduled<br />
          your test for:
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
          >
            Confirm
          </Button>
          <br />
          <Button
            className={clsx(classes.backButton, brandClasses.loginButton)}
            // onClick={handleBack}
          >
            Change
          </Button>
        </div>
      </div>


    </div>
  )
}

Testing.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Testing;
