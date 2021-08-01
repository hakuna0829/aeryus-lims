import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Grid, Button, TextField, Select, FormControl, MenuItem, InputLabel, Typography, CircularProgress, ListSubheader } from '@material-ui/core';
import validate from 'validate.js';
import brandStyles from 'theme/brand';
import { getStates, handleImage } from 'helpers';
import { createAccount, uploadPhoto, getRoles, apiUrl, getLocations1 } from 'actions/api';
import { showErrorDialog } from 'actions/dialogAlert';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  header: {
    margin: theme.spacing(3),
  },
  headerTitle: {
    color: theme.palette.brandText,
  },
  inputLabel: {
    // fontSize: theme.spacing(2)
  },
  stateSelect: {
    color: theme.palette.brandGray,
  },
  uploadedPhoto: {
    width: 300
  },
}));

const AddAccount = (props) => {
  const { history, showErrorDialog, getLocations1, locations } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({});
  const [accessToLocations, setAccessToLocations] = useState([]);
  const [imgState, setImgState] = useState({});
  const [rolesList, setRolesList] = useState([]);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('AddAccount useEffect');
    async function fetchData() {
      if (!locations)
        await getLocations1();
    }
    fetchData();

    getRoles().then(res => {
      setRolesList(res.data.data);
    }).catch(error => {
      showErrorDialog(error);
    });
  }, [showErrorDialog, getLocations1, locations]);

  const handleChange = e => {
    e.persist();
    if (e.target.value === 'create_new_custom_role') {
      history.push(`/control-center/role-manager`);
    }
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleAutoCompleteChange = (event, values) => {
    event.persist();
    setAccessToLocations(values);
  }

  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
  }

  const handleSubmit = event => {
    event.preventDefault();
    setDisplayError(null);
    setDisplaySuccess(null);
    let error = validate(formState, { email: { email: true } });
    if (error) {
      setDisplayError(error.email[0]);
    } else {
      setLoading(true);
      if (imgState.imagePath) {
        let formData = new FormData();
        formData.append('uploadImage', imgState.imagePath);
        uploadPhoto(formData).then(res => {
          if (res.data.success) {
            formState.photo = '/images/' + res.data.data;
            saveAccount();
          } else {
            setLoading(false);
            setDisplayError(res.data.message);
          }
        }).catch(error => {
          setLoading(false);
          showErrorDialog(error);
        });
      } else {
        saveAccount();
      }
    }
  };

  const saveAccount = () => {
    if (formState.role_id === 'create_new_custom_role' || formState.role_id === 'new_administrator_role') {
      formState.role_id = undefined;
    }
    if (accessToLocations.length) {
      formState.access_to_locations = accessToLocations.map(l => (l._id));
    }
    createAccount(formState).then(res => {
      setLoading(false);
      if (res.data.success) {
        setDisplaySuccess(res.data.message);
        setTimeout(() => {
          history.push('/control-center/account-manager');
        }, 1000);
      } else {
        setDisplayError(res.data.message);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h3" className={classes.headerTitle}>
          + Add Account
        </Typography>
      </div>
      <form
        className={classes.root}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={5}>
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
          <Grid item xs={12} sm={5}>
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
          <Grid item xs={12} sm={5}>
            <FormControl
              className={brandClasses.shrinkTextField}
              required
              fullWidth
              variant="outlined"
            >
              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Role</InputLabel>
              <Select
                onChange={handleChange}
                label="Role* "
                name="role_id"
                displayEmpty
                value={formState.role_id || ''}
              >
                <MenuItem value=''>
                  <Typography className={brandClasses.selectPlaceholder}>Select Role</Typography>
                </MenuItem>
                <ListSubheader>--- Create New ---</ListSubheader>
                <MenuItem value='new_administrator_role'>New Administrator Role</MenuItem>
                <MenuItem value='create_new_custom_role'>Create New Custom Role</MenuItem>
                <ListSubheader>--- Available Roles ---</ListSubheader>
                {rolesList.map((role, index) => (
                  <MenuItem key={index} value={role._id}>
                    {role.name}
                    {role.client_id.name && `  –  (${role.client_id.name})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            {locations
              ?
              <Autocomplete
                multiple
                options={locations}
                getOptionLabel={(option) => option.name + `${option.client_id.name ? `  –  (${option.client_id.name})` : ''}`}
                className={brandClasses.shrinkTextField}
                onChange={handleAutoCompleteChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Access to Locations"
                    placeholder="Enter Location name"
                    helperText="Leave empty will allow access to All Locations."
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        params.InputProps.endAdornment
                      ),
                    }}
                  />
                )}
              />
              :
              <CircularProgress size={20} className={brandClasses.progressSpinner} />
            }
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Location"
              placeholder="Enter location"
              name="location"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.location || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Department"
              placeholder="Enter department"
              name="department"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.department || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
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
          <Grid item container spacing={3} xs={12} sm={5}>
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
          <Grid item xs={12} sm={5}>
            <TextField
              type="number"
              label="Cell Phone"
              placeholder="Enter cell number"
              name="phone"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.phone || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}></Grid>
          <Grid item xs={12} sm={5}>
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
          <Grid item xs={12} sm={5}>
            <TextField
              type="text"
              label="Unit"
              placeholder="Enter unit number"
              name="unit"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.unit || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
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
          <Grid item xs={12} sm={4}>
            <FormControl
              className={brandClasses.shrinkTextField}
              fullWidth
              variant="outlined"
            >
              <InputLabel>State</InputLabel>
              <Select
                onChange={handleChange}
                label="State* "
                name="state"
                value={formState.state || 'Select State'}
              >
                <MenuItem value='Select State'>
                  <Typography className={classes.stateSelect}>Select State</Typography>
                </MenuItem>
                {getStates.map((state, index) => (
                  <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
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
          <Grid item xs={12} sm={5}></Grid>
          {/* <Grid item xs={12} sm={5}>
            <Button
              variant="contained"
              component="label"
            >
              {'Upload Photo'}
              <input
                type="file"
                accept='image/*'
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm={5}>
            {imgState.imgURL
              ? <img src={imgState.imgURL} className={classes.uploadedPhoto} alt="img" />
              : null}
          </Grid> */}
        </Grid>

        <div className={brandClasses.footerMessage}>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
        </div>

        <div className={brandClasses.footerButton}>
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
            type="submit"
          >
            CREATE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </div>
      </form>
    </div >
  )
};

const mapStateToProps = state => ({
  locations: state.data.locations,
});

AddAccount.propTypes = {
  history: PropTypes.object,
  showErrorDialog: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { showErrorDialog, getLocations1 })(withRouter(AddAccount));