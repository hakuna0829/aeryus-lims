import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.white,
        color: theme.palette.brandDark,
        fontFamily:'Montserrat',
        // fontSize: 22,
        fontWeight: 600,
        minWidth: 120,
        paddingLeft:theme.spacing(1),
        paddingRight:theme.spacing(1),
        borderRadius:10,
        border: `1px solid ${theme.palette.brandDark}`,
        '&:hover': {
            color: theme.palette.brand
        }
    },

}));

const WhiteButton = props => {
    const { label, className, onClick, type, startIcon } = props;
    const classes = useStyles();

    return (
        <Button onClick={onClick} type={type==='submit' ? 'submit' : '' } className={clsx(classes.root, className)} startIcon={startIcon}>
            {label}
        </Button>
    );
};
WhiteButton.propTypes = {    
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    startIcon:PropTypes.any
};
export default WhiteButton;
