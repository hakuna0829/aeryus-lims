import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.brandRed,
    borderRadius: '8px',
    height: 140
  },
  typography: {
    color: theme.palette.white,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));

const TestSerology = props => {
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
          Serology
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.typography}
          variant="h2"
        >
          722
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

TestSerology.propTypes = {
  className: PropTypes.string
};

export default TestSerology;
