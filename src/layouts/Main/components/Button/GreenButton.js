import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.brand,
        color: theme.palette.white,
        fontFamily:'Montserrat',
        // fontSize: 22,
        fontWeight: 600,
        minWidth: 120,
        paddingLeft:30,
        paddingRight:30,
        borderRadius:10,
        border: `1px solid ${theme.palette.brandDark}`,
        '&:hover': {
            color: theme.palette.brand
        }
    },

}));

const GreenButton = props => {
    const { label, className, onClick, type } = props;
    const classes = useStyles();

    return (
        <Button onClick={onClick} type={type==='submit' ? 'submit' : '' } className={clsx(classes.root, className)}>
            {label}
        </Button>
    );
};
GreenButton.propTypes = {    
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
};
export default GreenButton;
