import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Typography, CircularProgress, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import { apiUrl } from 'actions/api';
import brandStyles from 'theme/brand';
import { handleImage } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  titleText: {
    color: '#043B5D',
    fontFamily: 'Montserrat',
    textAlign: 'center'
  },
  box: {
    padding: 40
  },
  alertBody:{
    backgroundColor: 'rgb(218 241 255)'
  }
}));

const PersonalIdentity = (props) => {
  const { submitLoading, handlePersonalIdentitySubmit } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({});
  const [imgState, setImgState] = useState({});
  const [displayError, setDisplayError] = useState(null);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
  }

  const handleSubmit = async event => {
    event.preventDefault();
    let body = {
      // email: formState.email.trim(),
      // phone: formState.phone.replace(/ +/g, '')
    }
    handlePersonalIdentitySubmit(body);
  };

  return (
    <div className={classes.content}>
      <div className={classes.contentBody}>
        <Grid item>
          <Typography variant="h4" className={classes.titleText}>
            Please enter your contact information
          </Typography>
        </Grid>

        <br /><br />

        <form
          className={classes.form}
          onSubmit={handleSubmit}
        >
          <Box className={clsx(classes.box, brandClasses.logonBox)}>
            <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
              <Grid item>
                <TextField
                  type="text"
                  label="ID proof"
                  placeholder="Enter ID proof number"
                  name="id_number"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.id_number || ''}
                  required
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item>
                <div className={brandClasses.uploadContanier}>
                  <Typography className={brandClasses.uploadTitle}>ID proof image</Typography>
                  {imgState.imgURL
                    ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                    : formState.photo
                      ? <img src={apiUrl + formState.photo} className={brandClasses.uploadedPhoto} alt="img" />
                      : <Typography className={brandClasses.uploadDesc}>Upload ID proof image</Typography>
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

              <div className={brandClasses.footerMessage}>
                {displayError ? <Alert severity="error" classNames={classes.alertBody} onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
              </div>

              <Button
                className={clsx(classes.logonButton, brandClasses.loginButton)}
                classes={{ disabled: classes.logonButtonDisabled }}
                disabled={submitLoading}
                type="submit"
              >
                Submit {submitLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>

            </Grid>
          </Box>
        </form>
      </div>
    </div>
  )
}

PersonalIdentity.propTypes = {
  handlePersonalIdentitySubmit: PropTypes.func.isRequired,
};

export default PersonalIdentity;