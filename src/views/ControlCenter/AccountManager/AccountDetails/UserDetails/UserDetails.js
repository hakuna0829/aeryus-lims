import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import {
  Typography,
  Button,
  Grid,
  Divider,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import { getStates } from 'helpers';
import validate from 'validate.js';
import {
  updateAccount,
  getAccount,
  getRoles,
  getLocations1
} from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { Edit } from 'icons';
import * as md5 from 'md5';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3)
  },
  header: {
    // margin: theme.spacing(2),
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  activateButton: {
    color: theme.palette.brandGreen,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGreen}`,
    borderRadius: '8px',
    textTransform: 'none'
  },
  deactivateButton: {
    color: theme.palette.brandGray,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGray}`,
    borderRadius: '8px',
    textTransform: 'none'
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    paddingTop: 2,
    backgroundColor: theme.palette.brandDark
  },
  accountKey: {
    color: theme.palette.brandDark
  },
  accountValue: {
    color: theme.palette.brandGray
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(2)
  },
  nameWrapper: {
    display: 'flex'
  }
}));

const UserDetails = props => {
  const {
    showFailedDialog,
    showErrorDialog,
    accountData,
    getLocations1,
    locations
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(accountData);
  const [formState, setFormState] = useState(accountData);
  const [accessToLocations, setAccessToLocations] = useState([]);
  const [editState, setEditState] = useState({});
  const [rolesList, setRolesList] = useState([]);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);

  useEffect(() => {
    console.log('UserDetails useEffect');
    async function fetchData() {
      if (!locations) await getLocations1();
      if (locations && accountData.access_to_locations) {
        let accessLocation = locations.filter(l =>
          accountData.access_to_locations.includes(l._id)
        );
        setAccessToLocations(accessLocation);
      }
    }
    fetchData();
  }, [accountData, getLocations1, locations]);

  useEffect(() => {
    console.log('UserDetails useEffect');
    setAccount(accountData);

    getRoles()
      .then(res => {
        if (res.data.success) {
          setRolesList(res.data.data);
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        showErrorDialog(error);
      });
  }, [accountData, showFailedDialog, showErrorDialog]);

  const fetchAccout = () => {
    getAccount(account._id)
      .then(res => {
        setLoading(false);
        if (res.data.success) {
          setAccount(res.data.data);
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        setLoading(false);
        showErrorDialog(error);
      });
  };

  const handleDeactivate = () => {
    setLoading(true);
    updateAccount(account._id, { active: false })
      .then(res => {
        if (res.data.success) {
          fetchAccout();
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        showErrorDialog(error);
      });
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleAutoCompleteChange = (event, values) => {
    event.persist();
    // console.log('accessToLocations', accessToLocations)
    // console.log('selected values', values)
    setAccessToLocations(values);
  };

  const handleActivate = () => {
    setLoading(true);
    updateAccount(account._id, { active: true })
      .then(res => {
        if (res.data.success) {
          fetchAccout();
        } else {
          showFailedDialog(res);
        }
      })
      .catch(error => {
        showErrorDialog(error);
      });
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setDisplayError(null);
    setDisplaySuccess(null);
    if (!Object.keys(editState).length) {
      return;
    }
    let error = validate(formState, { email: { email: true } });
    if (error) {
      setDisplayError(error.email[0]);
    } else {
      if (editState.password) {
        if (formState.password === md5(formState.old_password)) {
          if (formState.new_password === formState.confirm_password) {
            formState.password = md5(formState.new_password);
            delete formState.old_password;
            delete formState.new_password;
            delete formState.confirm_password;
          } else {
            setDisplayError('Passwords did not match');
            return;
          }
        } else {
          setDisplayError('You have entered invalid password');
          return;
        }
      }
      if (editState.access_to_locations) {
        formState.access_to_locations = accessToLocations.map(l => l._id);
      }
      setLoading(true);
      updateAccount(account._id, formState)
        .then(res => {
          setLoading(false);
          if (res.data.success) {
            setDisplaySuccess(res.data.message);
            setEditState({});
            fetchAccout();
          } else {
            setDisplayError(res.data.message);
          }
        })
        .catch(error => {
          setLoading(false);
          showErrorDialog(error);
        });
    }
  };

  const handleEdit = (field, state = false) => {
    let fieldEdit = { ...editState };
    switch (field) {
      case 'fullname':
        fieldEdit.fullname = state;
        break;
      case 'location':
        fieldEdit.location = state;
        break;
      case 'role':
        fieldEdit.role = state;
        break;
      case 'department':
        fieldEdit.department = state;
        break;
      case 'office_phone':
        fieldEdit.office_phone = state;
        break;
      case 'address':
        fieldEdit.address = state;
        break;
      case 'phone':
        fieldEdit.phone = state;
        break;
      case 'access_to_locations':
        fieldEdit.access_to_locations = state;
        break;
      case 'email':
        fieldEdit.email = state;
        break;
      case 'password':
        fieldEdit.password = state;
        break;

      default:
        break;
    }
    setEditState(fieldEdit);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.header}>
        <Grid item className={classes.nameWrapper}>
          {/* <Typography variant="h3" className={classes.headerTitle}>
            {account.first_name} {account.last_name}
            {editState.fullname === true ? (
              <IconButton onClick={() => handleEdit('fullname', false)}>
                <CancelOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleEdit('fullname', true)}>
                <Edit className={classes.editIcon} />
              </IconButton>
            )}
          </Typography> */}
          {editState.fullname ? (
            <>
              <TextField
                type="text"
                label="First name"
                placeholder="Enter first Name"
                name="first_name"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.first_name || ''}
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />{' '}
              &nbsp;
              <TextField
                type="text"
                label="Lasst name"
                placeholder="Enter last Name"
                name="last_name"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.last_name || ''}
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              <IconButton onClick={() => handleEdit('fullname', false)}>
                <CancelOutlinedIcon />
              </IconButton>
            </>
          ) : (
            <Typography variant="h3" className={classes.headerTitle}>
              {formState.first_name} {formState.last_name}
              <IconButton onClick={() => handleEdit('fullname', true)}>
                <Edit className={classes.editIcon} />
              </IconButton>
            </Typography>
          )}
          {/* {editState.fullname === true ? (
            <IconButton onClick={() => handleEdit('fullname', false)}>
              <CancelOutlinedIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleEdit('fullname', true)}>
              <Edit className={classes.editIcon} />
            </IconButton>
          )} */}
        </Grid>
        <Grid item>
          {account.active ? (
            <Button
              size="small"
              className={classes.deactivateButton}
              onClick={handleDeactivate}>
              Deactivate
            </Button>
          ) : (
            <Button
              size="small"
              className={classes.activateButton}
              onClick={handleActivate}>
              Activate
            </Button>
          )}
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      <form className={classes.root} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item container direction="column" spacing={2} lg={5} xs={12}>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Location'}
                {editState.location === true ? (
                  <IconButton onClick={() => handleEdit('location', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('location', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.location ? (
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
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.location}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Role'}
                {editState.role === true ? (
                  <IconButton onClick={() => handleEdit('role', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('role', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.role ? (
                <FormControl
                  className={brandClasses.shrinkTextField}
                  required
                  fullWidth
                  variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Role"
                    name="role_id"
                    value={
                      typeof formState.role_id === 'object'
                        ? formState.role_id._id
                        : formState.role_id
                    }
                  // value={formState.role_id || ''}
                  >
                    {rolesList.map((role, index) => (
                      <MenuItem key={index} value={role._id}>
                        {role.name}
                        {role.client_id.name && `  –  (${role.client_id.name})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.role_id.name}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Department'}
                {editState.department === true ? (
                  <IconButton onClick={() => handleEdit('department', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('department', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.department ? (
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
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.department}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Office Phone'}
                {editState.office_phone === true ? (
                  <IconButton onClick={() => handleEdit('office_phone', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('office_phone', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.office_phone ? (
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
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.office_phone}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Account ID Number'}
              </Typography>
              <Typography variant="body2" className={classes.accountValue}>
                {account._id}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container direction="column" spacing={2} lg={5} xs={12}>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Home Address'}
                {editState.address === true ? (
                  <IconButton onClick={() => handleEdit('address', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('address', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.address ? (
                <>
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
                  <br />
                  <br />
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
                  <br />
                  <br />
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    variant="outlined">
                    <InputLabel>State</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="State* "
                      name="state"
                      value={formState.state || 'Select State'}>
                      <MenuItem value="Select State">
                        <Typography className={classes.stateSelect}>
                          Select State
                        </Typography>
                      </MenuItem>
                      {getStates.map((state, index) => (
                        <MenuItem key={index} value={state.text}>
                          {state.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.address}, {formState.city}, {formState.state}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Access to Locations'}
                {editState.access_to_locations === true ? (
                  <IconButton
                    onClick={() => handleEdit('access_to_locations', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => handleEdit('access_to_locations', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.access_to_locations ? (
                <Autocomplete
                  multiple
                  value={accessToLocations}
                  options={locations}
                  // getOptionLabel={(option) => option.name + `${option.client_id ? option.client_id.name ? `  –  (Client: ${option.client_id.name})` : '' : ' –  (Super Admin)'}`}
                  getOptionLabel={option =>
                    option.name +
                    `${option.client_id.name
                      ? `  –  (${option.client_id.name})`
                      : ''
                    }`
                  }
                  className={brandClasses.shrinkTextField}
                  onChange={handleAutoCompleteChange}
                  // getOptionSelected={(option, value) => option._id === value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Access to Locations"
                      placeholder="Enter Location name"
                      helperText="Leave empty will allow access to All Locations."
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: params.InputProps.endAdornment
                      }}
                    />
                  )}
                />
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {locations &&
                    accessToLocations &&
                    accessToLocations.map(
                      (loc, index) =>
                        loc.name +
                        `${accessToLocations.length !== index + 1 ? ', ' : ''}`
                    )}
                  {/*{locations && account.access_to_locations && (
                    account.access_to_locations.map((loc, index) => (
                      locations.find(l => l._id === loc).name + `${account.access_to_locations.length !== index + 1 ? ', ' : ''}`
                    ))
                  )} */}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Cell Phone'}
                {editState.phone === true ? (
                  <IconButton onClick={() => handleEdit('phone', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('phone', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.phone ? (
                <TextField
                  type="text"
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
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.phone}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Email'}
                {editState.email === true ? (
                  <IconButton onClick={() => handleEdit('email', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('email', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.email ? (
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
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {formState.email}
                </Typography>
              )}
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" className={classes.accountKey}>
                {'Password'}
                {editState.password === true ? (
                  <IconButton onClick={() => handleEdit('password', false)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit('password', true)}>
                    <Edit className={classes.editIcon} />
                  </IconButton>
                )}
              </Typography>
              {editState.password ? (
                <>
                  <TextField
                    type="password"
                    label="Old Password"
                    placeholder="Enter old password"
                    name="old_password"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.old_password || ''}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                  <br />
                  <br />
                  <TextField
                    type="password"
                    label="New Password"
                    placeholder="Enter new password"
                    name="new_password"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.new_password || ''}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                  <br />
                  <br />
                  <TextField
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    name="confirm_password"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.confirm_password || ''}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </>
              ) : (
                <Typography variant="body2" className={classes.accountValue}>
                  {'•••••••••••••'}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>

        <div className={brandClasses.footerMessage}>
          {displayError ? (
            <Alert
              severity="error"
              onClose={() => {
                closeErrorMessage();
              }}>
              {displayError}
            </Alert>
          ) : null}
          {displaySuccess ? (
            <Alert
              severity="success"
              onClose={() => {
                closeSuccessMessage();
              }}>
              {displaySuccess}
            </Alert>
          ) : null}
        </div>

        <div className={brandClasses.footerButton}>
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
            type="submit">
            {'SAVE'}{' '}
            {loading ? (
              <CircularProgress
                size={20}
                className={brandClasses.progressSpinner}
              />
            ) : (
              ''
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations
});

UserDetails.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  accountData: PropTypes.object.isRequired,
  getLocations1: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  showFailedDialog,
  showErrorDialog,
  getLocations1
})(UserDetails);
