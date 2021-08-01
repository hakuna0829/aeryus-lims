import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(2),
    width:'70%',
    margin:'10px auto',
    textAlign:'center'
  },
  stringTitle:{
    fontWeight:500,
    fontSize: '35px',
    [theme.breakpoints.down('md')]: {
      fontSize: '28px',
    },
  },
  stringValue:{
    fontWeight:600,
    margin:'15px auto',
    fontSize: '50px',
    [theme.breakpoints.down('md')]: {
      fontSize: '38px',
    },
  },
  stringLabel:{
    fontWeight:400
  }
}));

const OrderBox = props => {
  const { className, title, value, label, ...rest } = props;
  const classes = useStyles();

  return (
    <Paper
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography variant="h3" className={classes.stringTitle}>{title}</Typography>
      <Typography variant="h1" className={classes.stringValue}>{value}</Typography>
      <Typography variant="h6" className={classes.stringLabel}>{label}</Typography>
    </Paper>
  );
};

OrderBox.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default OrderBox;
