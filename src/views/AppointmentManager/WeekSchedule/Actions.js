import React from 'react';
import PropTypes from 'prop-types';
import { CheckMark, Reschedule, Delete } from 'icons';
import { Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  checkmark: {
    color: theme.palette.brandGreen,
    padding:'5px',
    '& svg':{
      width:'0.9em',
      height:'0.9em'
    }
  },
  reschedule: {
    color: theme.palette.brand,
    padding:'5px 10px',
    '& svg':{
      width:'0.9em',
      height:'0.9em'
    }
  },
  delete: {
    color: theme.palette.brandText,
    padding:5,
    '& svg':{
      width:'0.9em',
      height:'0.9em'
    }
  }
}))

const Actions = (props) => {
  const { handleCheck, handleReschedule, handleDelete } = props;

  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <IconButton className={classes.checkmark} onClick={handleCheck} >
          <CheckMark />
        </IconButton>
        <IconButton className={classes.reschedule} onClick={handleReschedule} >
          <Reschedule />
        </IconButton>
        <IconButton className={classes.delete} onClick={handleDelete} >
          <Delete />
        </IconButton>
      </Grid>
    </div>
  )
}

Actions.propTypes = {
  handleCheck: PropTypes.func.isRequired,
  handleReschedule: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Actions
