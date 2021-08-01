import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    root: {
        border: '1px solid rgba(15,132,169,0.8)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
        marginBottom: theme.spacing(4),
        textAlign: 'center',
        padding:theme.spacing(2),
        // width:'100%'
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        },
    },

}));


export default function BlueBox(props) {
    const classes = useStyles();
    
    return (
        <Box className={clsx(classes.root, props.class)}>
            {props.children}
        </Box>
    );
}