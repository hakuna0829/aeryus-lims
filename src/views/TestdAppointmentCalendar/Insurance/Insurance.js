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
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 24,
    [theme.breakpoints.up(415)]: {
      fontSize: 14,
      marginBottom: 12,
    }
  },
  tempBox: {
    width: '100%',
    height: '100%',
    border: 'solid 1px #0F84A9',
    padding: 0,
    borderRadius: 8,
    marginLeft: 8,
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
      padding: 16,
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
  alertContainer:{
    display: 'flex',
    padding:'0 15px',
    width:'100%',
    justifyContent: 'flex-end'
  },
  alertBody:{
    backgroundColor: 'rgb(218 241 255)'
  }
}));

const Insurance = (props) => {
  const { handleInsuranceSubmit, backTab, id } = props;

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
      tempState[key] =  reader.result;
      console.log(key,  reader.result);
      setFormState({...tempState});
    }
    
  }

  const closeErrorMessage = () => {
    console.log(handlePhotoChange)
    setDisplayError(null);
  };

  const handleSubmit = async event => {
    handleInsuranceSubmit();
  };

  const handleBack = () => {
    backTab('insurance');
  }

  console.log('prevValues', formState)

  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <div className={classes.alertContainer}>
          {displayError ? <Alert severity="error" className={classes.alertBody} onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
        </div>
        <Typography className={classes.title}>
          Insurance Information
        </Typography>
        <Typography className={classes.description}>
          Please take a photo of the front <br />
          and back of your insurance card
        </Typography>
        <br />

        <div className={classes.boxContainer} >

          <div className={classes.uploadContanier}>

            {formState.front_card
              ? <img src={formState.front_card} className={classes.uploadedPhoto} alt="img" />
              : <Typography className={classes.uploadDesc}>Front of card</Typography>
            }
            <div className={classes.uploadImageContainer}>
              {/* <input type="file" accept="image/*" className={classes.uploadInput} name="front_card" id="icon-button-file" onChange={(e) => handlePhotoChange('front_card', e)} /> */}
              <label htmlFor="icon-button-file" style={{ cursor: 'pointer', margin: '10px auto' }}>
                <img src="/images/svg/status/UploadPhoto.svg" alt="" />
                <img src="/images/svg/status/Upload_icon.svg" alt="" htmlFor="icon-button-file" />
              </label>
            </div>
          </div>

          <div className={classes.uploadContanier}>

            {formState.back_card
              ? <img src={formState.back_card} className={classes.uploadedPhoto} alt="img" />
              : <Typography className={classes.uploadDesc}>Back of card</Typography>
            }
            <div className={classes.uploadImageContainer}>
              {/* <input type="file" accept="image/*" className={classes.uploadInput} name="front_card" id="icon-button-file2" onChange={(e) => handlePhotoChange('back_card', e)} /> */}
              <label htmlFor="icon-button-file2" style={{ cursor: 'pointer', margin: '10px auto' }}>
                <img src="/images/svg/status/UploadPhoto.svg" alt="" />
                <img src="/images/svg/status/Upload_icon.svg" alt="" htmlFor="icon-button-file" />
              </label>
            </div>
          </div>

        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            className={clsx(classes.logonButton, brandClasses.loginButton)}
            onClick={handleSubmit}
          >
            Next
          </Button>
          <br />
          <Button
            className={clsx(classes.backButton, brandClasses.loginButton)}
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      </div>
      

    </div>
  )
}

Insurance.propTypes = {
  handleInsuranceSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Insurance;
