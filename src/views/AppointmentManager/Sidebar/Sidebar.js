import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { Grid, Typography, Divider, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton } from '@material-ui/core';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import SearchIcon from '@material-ui/icons/Search';
import { getScheduleCounts, getLocations } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { TestManager } from 'icons';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    backgroundColor: '#f3f9fa',
    height: '100%'
  },
  telemedicineIcon: {
    fontSize: 44,
    color: theme.palette.brandText,
    marginRight: 10
  },
  pageTitle: {
    color: theme.palette.brandText,
  },
  locationSelect: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4)
  },
  gridBox: {
    width: '100%',
    backgroundColor: theme.palette.white,
    border: `1px solid ${theme.palette.brandDark}`,
    borderRadius: 10,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    cursor: 'pointer'
  },
  activeBox: {
    backgroundColor: 'rgba(62,204,205,0.3)',
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: theme.spacing(25),
    backgroundColor: 'rgba(15,132,169,0.3)'
  },
  cardNumber: {
    color: theme.palette.brandDark,
    marginBottom: theme.spacing(1)
  },
  cardLabel: {
    color: theme.palette.brandDark,
  },
  cardTodayNumber: {
    color: theme.palette.white,
    backgroundColor: theme.palette.brandDark,
    padding: theme.spacing(1),
    width: 'fit-content',
    borderRadius: 10,
    fontWeight: 600,
    marginBottom: theme.spacing(1)
  },
}));

const SideBar = (props) => {
  const { selectedSchedule, selectedChange, location_id, setLocationId, showFailedDialog, showErrorDialog, refetch, history } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [counts, setCounts] = useState(null);
  const [locations, setLocations] = useState(null);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    console.log('SideBar useEffect');
    getLocations().then(res => {
      if (res.data.success) {
        setLocations(res.data.data);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      showErrorDialog(error);
    });
    fetchSchedulesCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  const fetchSchedulesCount = (location_id) => {
    let queryParams = null;
    if (location_id)
      queryParams = `location_id=${location_id}`;
    setCounts(null);
    getScheduleCounts(queryParams).then(res => {
      if (res.data.success) {
        setCounts(res.data.data);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      showErrorDialog(error);
    });
  }

  const handleChange = (event) => {
    event.persist();
    setLocationId(event.target.value);
    fetchSchedulesCount(event.target.value);
  }

  const handleSearchChange = e => {
    e.persist();
    setSearchString(e.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    history.push(`/appointment-manager/search?search_string=${searchString}`);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
          <TestManager className={classes.telemedicineIcon} />
          <Typography variant="h3" className={brandClasses.headerTitle}>APPOINTMENT<br /> MANAGER</Typography>
        </Grid>

        <Grid item container direction="row" justify="flex-end" alignItems="center">
          {/* <Typography variant="h3" className={classes.locationSelect}>Location</Typography> */}
          {locations
            ?
            <FormControl
              className={clsx(classes.locationSelect, brandClasses.shrinkTextField)}
              fullWidth
              variant="outlined"
            >
              <InputLabel>Locations</InputLabel>
              <Select
                label="Locations"
                value={location_id}
                onChange={handleChange}
              >
                <MenuItem value={0}>
                  <em>{'All Locations'}</em>
                </MenuItem>
                {locations.map((location, index) => (
                  <MenuItem value={location._id} key={index}>
                    {location.name}
                    {location.client_id.name && `  –  (${location.client_id.name})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            :
            <CircularProgress />
          }
        </Grid>

        <form
          onSubmit={handleSubmit}
        >
          <Grid item container direction="row" justify="center" alignItems="center">
            <TextField
              type="text"
              label="Search"
              placeholder="Search..."
              className={brandClasses.shrinkTextField}
              onChange={handleSearchChange}
              value={searchString}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </form>

        <Grid item>
          <Divider className={classes.divider} />
        </Grid>

        <Grid
          item
          className={clsx(classes.gridBox, selectedSchedule === 'today' && classes.activeBox)}
          onClick={() => selectedChange('today')}
        >
          <Typography variant="h1" className={classes.cardNumber}>
            {counts
              ? counts.today
              : <CircularProgress />
            }
          </Typography>
          <Typography variant="h5" className={classes.cardLabel}>Appointments <br />scheduled today</Typography>
        </Grid>

        <Grid item>
          <Divider className={classes.divider} />
        </Grid>

        <Grid
          item
          className={clsx(classes.gridBox, selectedSchedule === 'tomorrow' && classes.activeBox)}
          onClick={() => selectedChange('tomorrow')}
        >
          <Typography variant="h1" className={classes.cardNumber}>
            {counts
              ? counts.tomorrow
              : <CircularProgress />
            }
          </Typography>
          <Typography variant="h5" className={classes.cardLabel}>Appointments <br />scheduled tomorrow</Typography>
        </Grid>

        <Grid item>
          <Divider className={classes.divider} />
        </Grid>

        <Grid
          item
          className={clsx(classes.gridBox, selectedSchedule === 'weekly' && classes.activeBox)}
          onClick={() => selectedChange('weekly')}
        >
          <Typography variant="h1" className={classes.cardNumber}>
            {counts
              ? counts.thisWeek
              : <CircularProgress />
            }
          </Typography>
          <Typography variant="h5" className={classes.cardLabel}>Appointments <br />scheduled this week</Typography>
        </Grid>

        <Grid item>
          <Divider className={classes.divider} />
        </Grid>

        <Grid
          item
          className={clsx(classes.gridBox, selectedSchedule === 'monthly' && classes.activeBox)}
          onClick={() => selectedChange('monthly')}
        >
          <Typography variant="h1" className={classes.cardNumber}>
            {counts
              ? counts.thisMonth
              : <CircularProgress />
            }
          </Typography>
          <Typography variant="h5" className={classes.cardLabel}>Appointments <br />scheduled this month</Typography>
        </Grid>

      </Grid>
    </div>
  );
};

SideBar.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  selectedSchedule: PropTypes.string.isRequired,
  selectedChange: PropTypes.func.isRequired,
  refetch: PropTypes.any.isRequired,
};

export default connect(null, { showFailedDialog, showErrorDialog })((withRouter(SideBar)));