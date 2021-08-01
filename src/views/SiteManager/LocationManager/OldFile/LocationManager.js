import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { Grid, Button, Typography, CircularProgress, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Location } from 'icons';
import { getLocations1, updateLocation1 } from 'actions/api';
import { clearLocations } from 'actions/clear';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles(theme => ({
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
  location: {
    margin: '50px 0'
  },
  locationGrid: {
    margin: theme.spacing(2),
    padding: 15,
    border: `1px solid ${theme.palette.brand}`,
    borderRadius: 8,
    // maxHeight: 260,
    maxWidth: 260,
    boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)',
  },
  locationGridGray: {
    border: `1px solid ${theme.palette.brandGray}`,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  activeLocationIcon: {
    width: 103,
    fontSize: 112,
    color: theme.palette.brandDark,
  },
  inActiveLocationIcon: {
    width: 103,
    fontSize: 112,
    color: theme.palette.brandGray,
  },
  activeLocationText: {
    color: theme.palette.brandDark,
    stroke: theme.palette.brandDark,
    textAlign: 'center',
  },
  inActiveLocationText: {
    color: theme.palette.brandGray,
    stroke: theme.palette.brandGray,
    textAlign: 'center',
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
    fontSize: 18,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  colorGray: {
    color: '#9B9B9B !important' // remove important
  },
}));

const LocationManager = (props) => {
  const { locations, getLocations1, updateLocation1, clearLocations } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  useEffect(() => {
    async function fetchData() {
      if (!locations)
        await getLocations1();
    }
    fetchData();
  }, [locations, getLocations1]);

  const handleStatusUpdate = async (id, active) => {
    let res = await updateLocation1(id, { active });
    if (res.success) {
      await clearLocations();
    }
  };

  console.log('locations -', locations)
  return (
    <div >
      <div className={classes.header} >
        <div className={classes.subHeader}>
          <img src="/images/svg/building_icon.svg" alt="" />&ensp;
            {/* <Typography variant="h2" className={brandClasses.headerTitle}>
            Site Manager |
            </Typography> */}
          <Typography variant="h4" className={classes.headerSubTitle}>
            {'LOCATION MANAGER'}
          </Typography>
          <sup>
            <Tooltip title="LOCATION MANAGER" placement="right-start">
              <HelpIcon />
            </Tooltip>
          </sup>
        </div>
        <Button
          variant="contained"
          className={classes.greenBtn}
          startIcon={<AddIcon />}
          component={Link}
          to="/site-manager/add-location">
          ADD LOCATION
          </Button>
      </div>

      <div className={classes.container} >
        <Typography variant="h5" className={classes.title}>
          Once you add a new location, you cannot delete locations, but you can deactivate a location at any time. <br />
          Inactive accounts will still be visible and can be reactivated at any time.
        </Typography>
        <Grid container>
          {!locations
            ?
            <CircularProgress className={brandClasses.fetchProgressSpinner} />
            :
            !locations.length
              ?
              <Typography variant="h2" className={brandClasses.headerTitle}>
                {'No data to display...'}
              </Typography>
              :
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
              >
                {locations.map((location, index) => (
                  <Grid
                    item
                    key={index}
                    lg={3}
                    md={3}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={clsx(classes.locationGrid, !location.active && classes.locationGridGray)}
                  >
                    <Location className={location.active ? classes.activeLocationIcon : classes.inActiveLocationIcon} />
                    <Typography variant="h3"
                      className={location.active ? classes.activeLocationText : classes.inActiveLocationText}
                    >
                      {location.name}
                      {location.client_id.name && `  –  (${location.client_id.name})`}
                    </Typography>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <Button variant="outlined" disabled={location.active} className={classes.activateButton} onClick={() => handleStatusUpdate(location._id, true)}>Activate</Button>
                      <Button variant="outlined" disabled={!location.active} className={classes.deactivateButton} onClick={() => handleStatusUpdate(location._id, false)}>Deactivate</Button>
                    </Grid>
                    <Button
                      component={Link}
                      to={`/site-manager/location-details?location_id=${location._id}`}
                      className={clsx(classes.viewLink, !location.active && classes.colorGray)}
                    >
                      {'View Details'}
                    </Button>
                  </Grid>
                ))}
              </Grid>
          }
        </Grid>
      </div>
    </div >
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
});

LocationManager.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  updateLocation1: PropTypes.func.isRequired,
  clearLocations: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getLocations1, updateLocation1, clearLocations })(LocationManager);
