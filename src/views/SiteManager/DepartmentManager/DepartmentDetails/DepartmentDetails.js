import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Button, Paper, Select, MenuItem, FormControl, Typography, IconButton, CircularProgress, Tooltip, TextField, InputLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Link, withRouter } from 'react-router-dom';
import brandStyles from 'theme/brand';
import { Edit, Delete } from 'icons';
import clsx from 'clsx';
import * as qs from 'qs';
import QRCode from 'qrcode.react';
import Alert from '@material-ui/lab/Alert';
import HelpIcon from '@material-ui/icons/Help';
import { getLocations1, getDepartment, updateDepartment, deleteDepartment } from 'actions/api';
import { clearDepartments } from 'actions/clear';
import DialogAlert from 'components/DialogAlert';
import TextButton from 'components/Button/TextButton';
import * as appConstants from 'constants/appConstants';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(3)
  },
  item: {
    // width: '1000px',
    // border:'solid 1px blue',
    margin: '40px auto'
  },
  itemPaper: {
    width: '100%',
    border: '1px solid #0F84A9',
    padding: '16px',
    position: 'relative',
    marginBottom: '20px',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
  },
  itemPaper2: {
    border: '1px solid #0F84A9',
    // padding: '20px',
    position: 'relative',
    marginBottom: '40px',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    textTransform: 'capitalize',
    fontSize: '16px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  submitBtnOperations: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '& .MuiTypography-h5': {
      color: theme.palette.white,
      fontSize: '16px'
    }
  },
  fieldKey: {
    color: theme.palette.brandDark,
    fontWeight: 500,
  },
  labelValue: {
    color: theme.palette.brandGray,
  },
  editAddressField: {
    marginTop: '10px',
    padding: theme.spacing(1),
  },
  sectionData: {
    marginTop: '10px'
  },
  operationsTitle: {
    padding: '10px 20px'
  },
  firstPropertyLabel: {
    // marginBottom: '-10px'
  },
  operationRow: {
    padding: theme.spacing(1),
    paddingLeft: '20px',
    paddingRight: '20px',
    lineHeight: '30px',
    borderBottom: `1px solid ${theme.palette.brand}`,
    fontFamily: 'Montserrat',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat',
    '&.MuiAccordionSummary-root': {
      padding: '0px 20px'
    }
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center',
    // textAlign: 'left'
  },
  accordionDetails: {
    display: 'flex',
    alignItems: 'center'
  },
  accExpanded: {
    margin: '0 !important',
    borderBottom: '1px solid #0F84A9'
  },
  dayCheckbox: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(2),
    width: 150,
    alignItems: 'center',
    display: 'flex',
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  timeText: {
    color: theme.palette.brandDark,
    textAlign: 'left'
  },
  stationsText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    marginRight: theme.spacing(2)
  },
  stationSelect: {
    '& .MuiOutlinedInput-input': {
      padding: '6px 10px !important',
      marginRight: 17,
      width: 42,
      textAlign: 'center',
    },
    '& .MuiSelect-icon': {
      // width: 21%;
      height: '100%',
      borderRadius: '0 10px 10px 0',
      // backgroundColor: theme.palette.brandDark,
      right: 0,
      top: 'auto'
    },
    '& p': {
      color: '#9B9B9B'
    },
  },
  timeField: {
    '& input': {
      color: theme.palette.brandDark,
      width: '115px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark
    }
  },
  textAlignCenter: {
    textAlign: 'left',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    }
  },
  dayHeaderRow: {
    backgroundColor: theme.palette.brandDark,
    color: theme.palette.white,
    textAlign: 'left',
    fontFamily: 'Montserrat',
    fontWeight: '500'
  },
  marginLeft: {
    marginLeft: '50px !important'
  },
  buttonRed: {
    color: '#DD2525 !important',
    borderColor: '#DD2525 !important'
  },
  actionButtonRow: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    '& div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 30
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(3),
  },
  deleteButton: {
    marginTop: 16,
    margin: 'auto',
    backgroundColor: theme.palette.brandRed,
    border: 'none',
  },
  qrcode: {
    margin: theme.spacing(4),
    height: 180,
    width: 180
  },
  qrSubText: {
    color: theme.palette.brand,
    textTransform: 'none',
    textAlign: 'center',
    fontWeight: 600
  },
}));

const ActiveButton = withStyles(theme => ({
  root: {
    color: '#25DD83',
    borderColor: '#25DD83',
    borderRadius: 20,
    textTransform: 'Capitalize',
    fontSize: '26px',
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: '35px',
    '&:hover': {},
    [theme.breakpoints.up('lg')]: {
      fontSize: '26px'
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      fontSize: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    }
  }
}))(Button);

const DepartmentDetails = props => {
  const { history, location, getLocations1, locations, getDepartment, updateDepartment, deleteDepartment, clearDepartments } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [formState, setFormState] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [editSection, setEditSection] = useState({});
  const [alertMessage, setAlertMessage] = useState(0);

  const departmentId = qs.parse(location.search, { ignoreQueryPrefix: true }).department_id;

  const hvtURL = `${window.location.protocol}//${window.location.host}/testd-appointment-calendar/authenticate?id=${departmentId}`;

  useEffect(() => {
    console.log('DepartmentDetails useEffect id:', departmentId);
    if (departmentId) {
      async function fetchData() {
        if (!locations)
          await getLocations1();
        const res = await getDepartment(departmentId);
        setFetchLoading(false);
        if (res.success) {
          if (res.data) {
            setDepartmentDetails(departmentDetails => ({ ...departmentDetails, ...res.data }));
            setFormState(formState => ({ ...formState, ...res.data }));
          } else {
            setAlertMessage('Department ID is Invalid.');
          }
        }
      }
      fetchData();
    } else {
      setFetchLoading(false);
      setAlertMessage('Department ID is missing in Params');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchDepartment = async () => {
    setFetchLoading(true);
    const res = await getDepartment(departmentId);
    setFetchLoading(false);
    if (res.success) {
      if (res.data) {
        setDepartmentDetails(departmentDetails => ({ ...departmentDetails, ...res.data }));
        setFormState(formState => ({ ...formState, ...res.data }));
      } else {
        setAlertMessage('Department ID is Invalid.');
      }
    }
  }

  const goBack = () => {
    history.goBack();
  }

  const handleEdit = (field, isEditing) => {
    let fieldEdit = {};
    fieldEdit[field] = isEditing;
    setEditSection(fieldEdit);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAlertDialogMessage('');
  };

  const toggleDepartmentStatus = body => {
    modifyDepartment(body);
  };

  const handleDeleteDepartment = async () => {
    setSaveLoading(true);
    const res = await deleteDepartment(departmentDetails._id);
    setSaveLoading(false);
    if (res.success) {
      clearDepartments();
      history.goBack();
    }
  };

  const SaveButton = () => {
    return (
      <Button
        className={brandClasses.button}
        classes={{ disabled: brandClasses.buttonDisabled }}
        style={{ marginTop: 16, float: 'right' }}
        disabled={saveLoading}
        type="submit"
      >
        Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
      </Button>
    );
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const keyToObject = (key) => {
    switch (key) {
      case 'location_id':
        return { location_id: formState.location_id };
      case 'name':
        return { name: formState.name };
      case 'extension_number':
        return { extension_number: formState.extension_number };
      case 'head':
        return {
          head: formState.head,
          phone: formState.phone,
          email: formState.email
        };
      default:
        return;
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();
    let key = Object.keys(editSection)[0];
    let body = keyToObject(key);
    setSaveLoading(true);
    modifyDepartment(body);
  };

  const modifyDepartment = async (body) => {
    const res = await updateDepartment(departmentDetails._id, body);
    setSaveLoading(false);
    if (res.success) {
      clearDepartments();
      setEditSection({});
      refetchDepartment();
    }
  };

  return (
    <div className={classes.root}>
      {fetchLoading
        ? <CircularProgress />
        : departmentDetails
          ?
          <div>
            <div className={classes.header} >
              <div className={classes.subHeader}>
                <img src="/images/svg/building_icon.svg" alt="" />&ensp;
                <Typography variant="h2" className={brandClasses.headerTitle}>
                  {'DEPARTMENT MANAGER |'}
                </Typography>
                <Typography variant="h4" className={classes.headerSubTitle}>
                  {'EDIT DEPARTMENT'}
                  <sup>
                    {' '}
                    <Tooltip title="Edit Department" placement="right-start">
                      <HelpIcon />
                    </Tooltip>{' '}
                  </sup>
                </Typography>
              </div>
              {/* <Button
                variant="contained"
                className={classes.greenBtn}
                startIcon={<AddIcon />}
                component={Link}
                to="/site-manager/add-department">
                {'ADD DEPARTMENT'}
              </Button> */}
              <TextButton 
                category="Icon"
                startIcon={<AddIcon />}
                component={Link}
                to="/site-manager/add-department"
              >
                ADD DEPARTMENT
              </TextButton>
            </div>

            <div className={classes.item}>
              <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
                <Grid item xs={12} sm={5} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Location'}
                        </Typography>
                        <Grid item>
                          {editSection.location_id
                            ?
                            <IconButton onClick={() => handleEdit('location_id', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('location_id', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.location_id
                          ?
                          <Grid item xs>
                            <FormControl
                              className={brandClasses.shrinkTextField}
                              required
                              fullWidth
                              variant="outlined"
                            >
                              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Locations</InputLabel>
                              <Select
                                onChange={handleChange}
                                label="Locations* "
                                name="location_id"
                                displayEmpty
                                value={formState.location_id || ''}
                              >
                                <MenuItem value=''>
                                  <Typography className={brandClasses.selectPlaceholder}>Select Location</Typography>
                                </MenuItem>
                                {locations.map((location, index) => (
                                  <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {locations && locations.find(l => l._id === departmentDetails.location_id) ? locations.find(l => l._id === departmentDetails.location_id).name : null}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>

                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Department Name'}
                        </Typography>
                        <Grid item>
                          {editSection.name
                            ?
                            <IconButton onClick={() => handleEdit('name', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('name', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.name
                          ?
                          <Grid item xs>
                            <TextField
                              type="text"
                              label="Department Name"
                              placeholder="Enter department"
                              name="name"
                              className={brandClasses.shrinkTextField}
                              onChange={handleChange}
                              value={formState.name || ''}
                              required
                              fullWidth
                              InputProps={{ classes: { root: classes.inputLabel } }}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                            />
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {departmentDetails.name}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>

                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Extension Number'}
                        </Typography>
                        <Grid item>
                          {editSection.extension_number
                            ?
                            <IconButton onClick={() => handleEdit('extension_number', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('extension_number', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.extension_number
                          ?
                          <Grid item xs>
                            <TextField
                              type="text"
                              label="Extension Number"
                              placeholder="Enter extension number"
                              name="extension_number"
                              className={brandClasses.shrinkTextField}
                              onChange={handleChange}
                              value={formState.extension_number || ''}
                              required
                              fullWidth
                              InputProps={{ classes: { root: classes.inputLabel } }}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                            />
                            <SaveButton />
                          </Grid>
                          :
                          <Typography variant="h5" className={classes.labelValue}>
                            {departmentDetails.extension_number}
                          </Typography>
                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={5} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <Grid container alignItems="baseline" justify="space-between">
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Department Head Contact'}
                            </Typography>
                            <Grid item>
                              {editSection.head
                                ?
                                <IconButton onClick={() => handleEdit('head', false)}>
                                  <CancelOutlinedIcon />
                                </IconButton>
                                :
                                <IconButton onClick={() => handleEdit('head', true)}>
                                  <Edit className={classes.editIcon} />
                                </IconButton>
                              }
                            </Grid>
                          </Grid>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'Name'}
                          </Typography>
                          {editSection.head ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Department Head"
                                  placeholder="Enter Department Head Name"
                                  name="head"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleChange}
                                  value={formState.head || ''}
                                  required
                                  fullWidth
                                  InputProps={{ classes: { root: classes.inputLabel } }}
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {departmentDetails.head}
                              </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} className={classes.sectionData}>
                          <div className={classes.sectionData}>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Phone Number'}
                              </Typography>
                            </Grid>
                            {editSection.head ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
                                  <TextField
                                    type="text"
                                    label="Phone Number"
                                    placeholder="Enter phone number"
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
                              </Grid>
                            ) : (
                                <Grid container justify="flex-start" alignItems="center">
                                  <Grid container>
                                    <Grid>
                                      <Typography variant="h5" className={classes.labelValue}>
                                        {departmentDetails.phone}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )}
                          </div>
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Email address'}
                              </Typography>
                            </Grid>
                            {editSection.head ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
                                  <TextField
                                    type="email"
                                    label="Email Address"
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
                              </Grid>
                            ) : (
                                <Typography variant="h5" className={classes.labelValue}>
                                  {departmentDetails.email}
                                </Typography>
                              )}
                          </div>
                        </Grid>
                        {editSection.head && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <Grid container alignItems="baseline" justify="space-between">
                      <Typography variant="h5" className={classes.fieldKey}>
                        {'Web Registration Details'}
                      </Typography>
                    </Grid>
                    <Grid container direction="column" justify="center" alignItems="center" >
                      <QRCode
                        renderAs="svg"
                        value={hvtURL}
                        // fgColor="#3ECCCD"
                        className={classes.qrcode}
                      />
                      <Grid item container direction="row" justify="center" alignItems="center" >
                        <Button
                          className={classes.qrSubText}
                          component="a"
                          href={hvtURL}
                          target="_blank"
                        >
                          {'Open Link'}
                        </Button>
                        <Button
                          className={classes.qrSubText}
                          onClick={() => { navigator.clipboard.writeText(hvtURL) }}
                        >
                          {'Copy Link'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={2}></Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button
                  className={clsx(brandClasses.button, classes.deleteButton)}
                  classes={{ disabled: brandClasses.buttonDisabled }}
                  endIcon={<Delete />}
                  disabled={saveLoading}
                  onClick={handleDeleteDepartment}
                >
                  DELETE {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                </Button>
                <div className={classes.actionButtonRow} style={{ display: 'none' }}>
                  <ActiveButton
                    variant="outlined"
                    disabled={departmentDetails.active || saveLoading}
                    style={{ marginRight: 15 }}
                    onClick={() => toggleDepartmentStatus({ active: true })}>
                    {'Activate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </ActiveButton>
                  <ActiveButton
                    variant="outlined"
                    disabled={!departmentDetails.active || saveLoading}
                    className={departmentDetails.active ? classes.buttonRed : ''}
                    style={{ marginLeft: 15 }}
                    onClick={() => toggleDepartmentStatus({ active: false })}>
                    {'Deactivate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </ActiveButton>
                </div>
              </Grid>
            </div>
          </div>
          : <div className={classes.alert}>
            <Alert severity="error">
              {alertMessage}
              <Button
                onClick={goBack}
              >
                {'Go Back'}
              </Button>
            </Alert>
          </div>
      }

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
});

DepartmentDetails.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getDepartment: PropTypes.func.isRequired,
  updateDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  clearDepartments: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, getDepartment, updateDepartment, deleteDepartment, clearDepartments })(withRouter(DepartmentDetails));