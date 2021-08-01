import React from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles(theme => ({
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

const TrashActions = (props) => {
  const { handleRestore, handleDeleteForever } = props;
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
        {handleRestore &&
          <Tooltip title="Restore">
            <IconButton className={classes.editIcon} onClick={handleRestore} >
              <RestoreFromTrashIcon />
            </IconButton>
          </Tooltip>
        }

        {handleDeleteForever &&
          <Tooltip title="Delete Forever">
            <IconButton className={classes.delete} onClick={handleDeleteForever} >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
        }
      </Grid>
    </div>
  )
}

TrashActions.propTypes = {
  handleRestore: PropTypes.func,
  handleDeleteForever: PropTypes.func,
};

export default TrashActions