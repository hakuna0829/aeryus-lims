import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { Grid, Button, Typography, FormControl, InputLabel, Select, CircularProgress, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import { clearPopulationSettings } from 'actions/clear';
import { getLocations1, addPopulationSetting } from 'actions/api';
import { getPopulationManagerInit } from 'helpers';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  successtitle: {
    fontWeight: 600,
    fontSize: '30px',
    lineHeight: '40px',
    textAlign: 'center',
    color: theme.palette.brandGreen
  },
  checkMark: {
    margin: '18px 0px',
  },
  description: {
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: '25px',
    textAlign: 'center',
    marginBottom: '24px',
    color: theme.palette.brandDark
  },
  container: {
    padding: `0px ${theme.spacing(2)}px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
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
  headerTitle: {
    color: theme.palette.brandText
  },
  title: {
    color: '#0F84A9',
    lineHeight: '27px'
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
  population: {
    margin: '50px 0'
  },
  activateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandGreen,
    borderColor: theme.palette.brandGreen,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none',
  },
  deactivateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandRed,
    borderColor: theme.palette.brandRed,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none',
  },
  viewLink: {
    color: theme.palette.brandDark,
    fontSize: 14,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    lineHeight: 'unset',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  colorGray: {
    color: '#9B9B9B !important' // remove important
  },
  parentGrid: {
    padding: theme.spacing(2),
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  dlgTitle: {
    fontWeight: 600,
    fontSize: '24px',
    textAlign: 'center',
    // color: '#0F84A9'
  },
  dlgSubTitle: {
    fontWeight: 500,
    fontSize: '20px',
    color: theme.palette.blueDark
  }
}));


const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  const classes2 = useStyles();
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes2.dlgTitle}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DuplicateDialog = (props) => {
  const { locations, selectedId, populationSettings, openDuplicated, handleDuplicatedClose, getLocations1, addPopulationSetting, clearPopulationSettings } = props

  const [formState, setFormState] = useState({ type: '', location_id: '' });
  const [formButtonDisable, setFormButtonDisable] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPopulation, setselectedPopulation] = useState({ ...getPopulationManagerInit, testing_type: [], vaccine_type: [] });
  const classes = useStyles();
  const brandClasses = brandStyles();

  useEffect(() => {
    if (formState.type !== '' && formState.location_id !== '' && formState.endpont !== '') {
      setFormButtonDisable(false);
    } else {
      setFormButtonDisable(true)
    }
  }, [formState])

  useEffect(() => {
    async function fetchData() {
      if (!locations) {
        await getLocations1();
      }
      if (selectedId && populationSettings) {
        var selectedPop = populationSettings.find(e => e._id === selectedId);
        setselectedPopulation(selectedPop)
      }
    }
    fetchData();
  }, [openDuplicated, locations, getLocations1, populationSettings, selectedId])

  // const handleDuplicatedClickOpen = () => {
  //   setOpenDuplicated(true);
  // };

  const handleClose = () => {
    handleDuplicatedClose(false);
  };

  const handleChange = e => {
    e.persist();
    if (e.target.name === 'endpoint') {
      setFormState(formState => ({
        ...formState,
        endpoint_encoded: encodeURIComponent(e.target.value)
      }));
    }
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    selectedPopulation.type = formState.type;
    delete selectedPopulation._id;
    selectedPopulation.endpoint = formState.endpoint;
    selectedPopulation.location_id = formState.location_id;

    setLoading(true);
    const res = await addPopulationSetting(selectedPopulation);
    clearPopulationSettings();
    setLoading(false);
    if (res.success) {
      setShowSuccess(false);
      setTimeout(() => {
        setShowSuccess(true);
        handleDuplicatedClose(true);
      }, 1000);

    }
  }

  // if (selectedId) {
  //   var selectedPop = populationSettings.find(e => e._id === selectedId);
  //   setselectedPopulation(selectedPop)
  // }
  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDuplicated} maxWidth={'sm'} fullWidth={true}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        {showSuccess ? <>Duplicate {selectedPopulation && selectedPopulation.type}</> : ''}
      </DialogTitle>
      {showSuccess ? <>
        <DialogContent >
          <form onSubmit={(e) => handleSubmit(e)}>
            <Grid container spacing={2}>
              <Grid item md={2}></Grid>
              <Grid item >
                <Typography gutterBottom className={classes.dlgSubTitle}>
                  ASSIGN THE FOLLOWING:
              </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={2}></Grid>
              <Grid item md={7}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  required
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Name</InputLabel>
                  <TextField
                    type="text"
                    label=""
                    placeholder="New Population Name"
                    name="type"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.type || ''}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={7}>
                {locations
                  ?
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    required
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Assign Location</InputLabel>
                    <Select
                      onChange={handleChange}
                      label="Assign Location"
                      name="location_id"
                      displayEmpty
                      value={formState.location_id || ''}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Select a location</Typography>
                      </MenuItem>
                      {locations.map((location, index) => (
                        <MenuItem key={index} value={location._id}>
                          {location.name}
                          {location.client_id.name && `  –  (${location.client_id.name})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  :
                  <CircularProgress size={20} className={brandClasses.progressSpinner} />
                }
                {/* <FormControl
                className={brandClasses.shrinkTextField}
                required
                fullWidth
                variant="outlined"
              >
                <InputLabel shrink className={brandClasses.selectShrinkLabel}>Assign Location</InputLabel>
                <Select
                  onChange={handleChange}
                  label="Assign Location"
                  name="location_id"
                  displayEmpty
                  value={formState.location_id || ''}
                >
                  <MenuItem value=''>
                    <Typography className={brandClasses.selectPlaceholder}>Select a location</Typography>
                  </MenuItem>
                  <MenuItem value="location1">Location 1</MenuItem>
                  <MenuItem value="location2">Location 2</MenuItem>
                  <MenuItem value="location3">Location 3</MenuItem>
                </Select>
              </FormControl> */}
              </Grid>
              <Grid item md={3}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={7}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  required
                  fullWidth
                  variant="outlined"
                >
                  {/* <Typography variant="h5">testd.go/ </Typography>&nbsp;&ensp; */}
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Set TESTD GO URL</InputLabel>
                  <TextField
                    type="text"
                    label=""
                    placeholder="Set testd go url"
                    name="endpoint"
                    className={brandClasses.shrinkTextField}
                    onChange={handleChange}
                    value={formState.endpoint || ''}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3}></Grid>
            </Grid>
            {/* <Button autoFocus onClick={handleDuplicatedClose} color="primary">
          Save changes
        </Button> */}
            <div className={brandClasses.footerButton} style={{ marginBottom: 0 }}>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={handleClose}
                style={{ width: 150 }}
              >
                BACK
          </Button>
          &ensp;
          <Button
                className={brandClasses.blueBtn}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={formButtonDisable}
                type="submit"
              >
                DUPLICATE  {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </div>
          </form>
        </DialogContent>
      </> : <>
        <DialogContent>
          <Typography className={classes.successtitle}>SUCCESS!</Typography>
          <Typography align="center" className={classes.checkMark}>
            <img src="/images/svg/status/check_green.svg" alt="" width="110" />
          </Typography>

          <Typography className={classes.description}>
            {formState.type} <br />
            has been added
          </Typography>

        </DialogContent></>}


    </Dialog>
  )
}
const mapStateToProps = state => ({
  locations: state.data.locations,
});

DuplicateDialog.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  // getPopulationSettingsByLocationId: PropTypes.func.isRequired,
  addPopulationSetting: PropTypes.func.isRequired,
  clearPopulationSettings: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, addPopulationSetting, clearPopulationSettings })(DuplicateDialog);