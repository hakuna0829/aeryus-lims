import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.brand,
    borderRadius: '8px',
    marginTop: theme.spacing(2),
    height: 140
  },
  typography: {
    color: theme.palette.white,
  }
}));

const TestPCR = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="space-evenly"
      alignItems="center"
      {...rest}
      className={classes.root}
    >
      <Grid item>
        <Typography
          className={classes.typography}
          variant="h2"
        >
          PCR
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.typography}
          variant="h2"
        >
          52
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.typography}
          variant="h6"
        >
          View Inventory
        </Typography>
      </Grid>
    </Grid>
  );
};

TestPCR.propTypes = {
  className: PropTypes.string
};

export default TestPCR;
