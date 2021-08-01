import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Delete } from 'icons';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  calendarIcon: {
    color: theme.palette.brandDark,
    padding: '5px'
  },
  visibilityIcon: {
    color: theme.palette.brandDark,
    padding: '4px 5px 4px 12px'
  },
  inActive: {
    pointerEvents: 'none',
    opacity: 0.8
  },
  editIcon: {
    color: theme.palette.blueDark,
  },
  delete: {
    color: theme.palette.brandDeepGray,
  },
  root: {
    '& button': {
      padding: '4px 4px 4px 12px'
    },
    '& button:first-child': {
      paddingLeft: 0
    }

  }
}))

const Actions = (props) => {
  const { handleEdit, handleDelete } = props;
  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        {handleEdit &&
          <Tooltip title="Edit">
            <IconButton className={classes.editIcon} onClick={handleEdit} >
              <Edit />
            </IconButton>
          </Tooltip>
        }

        {handleDelete &&
          <Tooltip title="Delete">
            <IconButton className={classes.delete} onClick={handleDelete} >
              <Delete />
            </IconButton>
          </Tooltip>
        }
      </Grid>
    </div>
  )
}

Actions.propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default Actions