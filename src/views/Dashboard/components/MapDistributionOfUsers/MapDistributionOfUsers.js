import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  typography: {
    color: theme.palette.brandDark,
    paddingTop: '10px'
  },
  mapTypography: {
    color: theme.palette.brandDark,
    paddingTop: '20vh'
  }
}));

const MapDistributionOfUsers = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  return (
    <Grid
      {...rest}
      className={brandClasses.dashboardMapCard}
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item>
        <Typography
          className={classes.typography}
          variant="h4"
        >
          Distribution of Users
            </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.mapTypography}
          variant="h5"
        >
          Map comes here
            </Typography>
      </Grid>
    </Grid>
  );
};

MapDistributionOfUsers.propTypes = {
  className: PropTypes.string
};

export default MapDistributionOfUsers;
