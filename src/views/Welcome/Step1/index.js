import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Typography, Button, Grid } from '@material-ui/core';
import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  getStartedButton: {
    margin: theme.spacing(4),
  },
}));

const Step1 = (props) => {
  const { updateStep } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  return (
    <>
      <Grid item>
        <Typography
          className={classes.text}
          variant="h2"
        >
          {'Welcome to TESTD'}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={classes.text}
          variant="h3"
        >
          {'Let’s get started setting up your dashboard'}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          className={clsx(classes.getStartedButton, brandClasses.button)}
          onClick={updateStep}
        >
          {'GET STARTED'}
        </Button>
      </Grid>
    </>
  );
};

Step1.propTypes = {
  updateStep: PropTypes.func.isRequired
};

export default Step1;