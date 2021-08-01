import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import SignaturePad from 'react-signature-canvas';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import { uploadTestdAcImage } from 'actions/api';
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
    fontWeight: 400,
    textAlign: 'center',
    marginTop: 16,
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
      lineHeight: 1.5
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    marginLeft: 8
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  boxContainer: {
    width: 300,
    height: 110,
    margin: '0 auto',
    border: '#0F84A9 solid 1px',
    borderRadius: '6px',
    [theme.breakpoints.up(376)]: {
      width: 300,
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '5px 10px',
  },
  alertContainer: {
    display: 'flex',
    padding: '0 15px',
    width: '100%',
    justifyContent: 'center'
  },
  clearContainer: {
    display: 'flex',
    padding: '0 15px',
    margin: '20px 0 0',
    width: '100%',
    justifyContent: 'center'
  }


}));

let sigPad = {};

const Question10 = (props) => {
  const { user, handleQuestionsSubmit, backTab, uploadTestdAcImage, testdAcToken, setDisplayError } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    if (user && user.signature) {
      handleQuestionsSubmit();
    } else {
      if (!sigPad.isEmpty()) {
        setDisplayError('');
        setLoading(true);
        const sigBlob = dataURLtoBlob(sigPad.getTrimmedCanvas().toDataURL('image/png'));
        // Form Data
        const sigFormData = new FormData();
        sigFormData.append('uploadImage', sigBlob, 'patient-signature.png');
        sigFormData.append('table', 'user');
        sigFormData.append('id', user._id);
        sigFormData.append('field', 'signature');
        const res = await uploadTestdAcImage(testdAcToken, sigFormData);
        setLoading(false);
        if (res.success) {
          handleQuestionsSubmit({ signature: res.data });
        }
      } else {
        setDisplayError('Please make Signature.');
      }
    }
  };

  const sigClear = () => {
    sigPad.clear();
  };

  const handleBack = () => {
    backTab('question');
  }

  const changeSignature = () => {
    console.log(sigPad);
  }

  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          COVID Attention of <br /> Uninsured Patients
        </Typography>
        <Typography className={classes.description}>
          I do not have health care coverage<br /> such as individual, employer-sponsored, <br />Medicare or Medicaid coverage.<br /> Therefore I affirm and attest the above<br /> patient qualifies as Uninsured according<br /> to the COVID-19 Uninsured program<br /> in the Coronavirus Aid,  Relief and <br />Economic Security( CARES ) Act. ( P.L. 116-136)
        </Typography>
        <br />

        <div className={classes.boxContainer}>
          <SignaturePad
            penColor='#0F84A9'
            canvasProps={{ width: 300, height: 150, className: 'sigCanvas' }}
            clearOnResize={false}
            onChange={changeSignature}
            ref={(ref) => { sigPad = ref }}
          />
        </div>

        <div className={classes.clearContainer}>
          <Button
            className={clsx(brandClasses.button, brandClasses.whiteButton)}
            onClick={sigClear}
          >
            {'Clear Signature'}
          </Button>
        </div>

        {/* <div className={classes.alertContainer}>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
        </div> */}

        <div style={{ display: 'flex', justifyContent: 'center', margin: '0px auto 50px' }}>
          {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, padding: '6px 8px', cursor: 'pointer' }} onClick={handleBack} />
          <Button onClick={handleSubmit} type="submit" >
            <img src='/images/svg/next_button.svg' alt='next' />
          </Button>
          {loading ? <CircularProgress size={20} /> : ''} */}
          <Button
            className={clsx(brandClasses.backButton, brandClasses.loginButton)}
            onClick={handleBack}
          >
            <KeyboardBackspaceIcon style={{color:"#0F84A9"}} />
            Back
          </Button>

          <Button
            className={clsx(brandClasses.logonButton, brandClasses.loginButton)}
            onClick={handleSubmit}
          >
            Next
            {loading ? <CircularProgress size={20} style={{color:"#fff"}} /> : ''}
            <ArrowRightAltIcon style={{color:"#fff"}} />
          </Button>
        </div>
      </div>

    </div>
  )
}

Question10.propTypes = {
  uploadTestdAcImage: PropTypes.func.isRequired,
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default connect(null, { uploadTestdAcImage })(Question10);
