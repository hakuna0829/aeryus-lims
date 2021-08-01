import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import brandStyles from 'theme/brand';
import { numberWithCommas } from 'helpers/utility';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  value: {
    color: theme.palette.brandDark,
    fontWeight: 700
  },
  typography: {
    color: theme.palette.brandDark,
    paddingTop: '10px',
    fontWeight: 400,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));

const NegativeResults = props => {
  const { value } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  return (

    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={clsx(classes.root, brandClasses.dashboardInfoCard)}
    >
      <Grid item>
        <Typography
          className={classes.value}
          variant="h1"
        >
          {value
            ? numberWithCommas(value.negative_results)
            : <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />
          }
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.typography}
          variant="h5"
        >
          Negative Results
        </Typography>
      </Grid>
    </Grid>

  );
};

NegativeResults.propTypes = {
  value: PropTypes.object,
};

export default NegativeResults;
