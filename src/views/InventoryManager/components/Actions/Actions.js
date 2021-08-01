import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Delete } from 'icons';
import { Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Visibility from '@material-ui/icons/Visibility';
// import clsx from 'clsx';

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
        color: theme.palette.brand,
    },
    delete: {
        color: theme.palette.brandText,
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
    const { handleView, handleEdit, handleDelete } = props;
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
                {handleView &&
                    <IconButton className={classes.visibilityIcon} onClick={handleView} >
                        <Visibility />
                    </IconButton>
                }
                {handleEdit &&
                    <IconButton className={classes.editIcon} onClick={handleEdit} >
                        <Edit />
                    </IconButton>
                }
                {handleDelete &&
                    <IconButton className={classes.delete} onClick={handleDelete} >
                        <Delete />
                    </IconButton>
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