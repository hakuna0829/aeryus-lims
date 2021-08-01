import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Typography, Button, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem, Link, FormHelperText } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
// import GetAppIcon from '@material-ui/icons/GetApp';
import brandStyles from 'theme/brand';
import Alert from '@material-ui/lab/Alert';
import { apiUrl, uploadCsv, getLocations1, getDepartments } from 'actions/api';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';

const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  getStartedButton: {
    margin: theme.spacing(4),
  },
  skipButton: {
    textTransform: 'none',
    marginBottom: theme.spacing(4)
  },
}));

const Step4 = (props) => {
  const { getLocations1, locations, getDepartments, departments, showErrorDialog, updateStep } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [csvState, setCsvState] = useState({});
  const [locationDepartments, setLocationsDepartments] = useState([]);
  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!locations)
        await getLocations1();
      if (!departments)
        await getDepartments();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (departments) {
      let locDep = departments.filter(d => d.location_id._id === formState.location_id);
      setFormState(formState => ({ ...formState, department_id: null }));
      setLocationsDepartments(locDep ? locDep : []);
    }
  }, [departments, formState.location_id]);

  const handleSkip = () => {
    updateStep();
  }

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleDialogAction = () => {
    setDialogOpen(false);
    updateStep();
  }

  const handleCsvChange = event => {
    let files = event.target.files;
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/excel\/*/) == null) {
      setDisplayError('Only .csv files are supported.');
      return;
    } else {
      setUploadedFileName(files[0].name);
      setDisplayError(null);
    }

    let reader = new FileReader();
    setCsvState(csvState => ({
      ...csvState,
      csvPath: files[0]
    }));
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      setCsvState(csvState => ({
        ...csvState,
        csvURL: reader.result
      }));
    }
  }

  const clearUploadedFile = () => {
    // setCsvState({});
    // setUploadedFileName(null);
  }

  const handleSubmit = event => {
    event.preventDefault();
    clearMessage();
    if (csvState.csvPath) {
      if (!formState.location_id || !formState.department_id) {
        setDisplayError('Please select a location & department from the list');
        return;
      }
      setLoading(true);
      let formData = new FormData();
      formData.append('uploadCsv', csvState.csvPath);
      formData.append('location_id', formState.location_id);
      formData.append('department_id', formState.department_id);
      uploadCsv(formData).then(res => {
        clearUploadedFile();
        setLoading(false);
        if (res.data.success) {
          clearMessage();
          setDisplaySuccess(`${res.data.message} Redirecting to Dashboard`);
          setTimeout(() => {
            updateStep();
          }, 4000);
        } else {
          setDisplayError(res.data.message);
        }
      }).catch(error => {
        clearUploadedFile();
        setLoading(false);
        showErrorDialog(error);
      });
    } else {
      setDialogOpen(true);
    }
  };

  const clearMessage = () => {
    setDisplayError(null);
    setDisplaySuccess(null);
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };


  return (
    <form
      onSubmit={handleSubmit}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Typography
            className={classes.text}
            variant="h2"
          >
            {'USER MANAGER'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            className={classes.text}
            variant="h3"
          >
            {'1. Let’s import your user list into TESTD'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            className={classes.text}
            variant="h3"
          >
            {'2. Download the template. '}
            <br></br>
            {'Do not edit/remove the header text. '}
            <br></br>
            {'Add the users from next line. '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={`${apiUrl}/download/users_upload_template.csv`}
            >
              <IconButton component="span">
                <img src='/images/svg/upload_icon_down.svg' alt='download_icon' width="25" />
                {/* <GetAppIcon className={classes.downloadIcon} /> */}
              </IconButton>
            </a>
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            className={classes.text}
            variant="h3"
          >
            {'3. Upload your user list'}
            <input
              type="file"
              accept=".csv, text/csv"
              style={{ display: "none" }}
              onChange={handleCsvChange}
              id="icon-button-file"
            />
            <label htmlFor="icon-button-file">
              <IconButton component="span">
                <img src='/images/svg/upload_icon.svg' alt='upload_icon' width="25" />
              </IconButton>
            </label>
          </Typography>
        </Grid>

        {uploadedFileName}

        <Grid item style={{ width: 250, paddingTop: 20 }}>
          {locations
            ?
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
            :
            <CircularProgress size={20} className={brandClasses.progressSpinner} />
          }
        </Grid>

        <Grid item style={{ width: 250, paddingTop: 30 }}>
          {departments
            ?
            <FormControl
              className={brandClasses.shrinkTextField}
              required
              fullWidth
              variant="outlined"
            >
              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Department</InputLabel>
              <Select
                onChange={handleChange}
                label="Department* "
                name="department_id"
                displayEmpty
                value={formState.department_id || ''}
              >
                <MenuItem value=''>
                  <Typography className={brandClasses.selectPlaceholder}>Select Department</Typography>
                </MenuItem>
                {locationDepartments.map((location, index) => (
                  <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Departments will be based on Locations</FormHelperText>
            </FormControl>
            :
            <CircularProgress size={20} className={brandClasses.progressSpinner} />
          }
        </Grid>

        <Grid item>
          <Button
            type="submit"
            className={clsx(classes.getStartedButton, brandClasses.button)}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={loading}
          >
            CONFIRM {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </Grid>

        <Grid item>
          <Link
            className={clsx(classes.skipButton, brandClasses.brandGrayText)}
            component={Button}
            onClick={handleSkip}
            variant="h6"
          >
            {'Skip for now'}
          </Link>
        </Grid>


        <Grid item>
          {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
          {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
        </Grid>

        <DialogAlert
          open={dialogOpen}
          type={appConstants.DIALOG_TYPE_CONFIRMATION}
          title={'Are you sure ?'}
          message={`Upload the user list file. OR Do you want to skip Users upload ?`}
          onClose={handleDialogClose}
          onAction={handleDialogAction}
        />
      </Grid>
    </form>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
  departments: state.data.departments,
});

Step4.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  updateStep: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getLocations1, getDepartments })(Step4);