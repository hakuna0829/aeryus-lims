import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 0,
        position:'relative',
        // paddingLeft: theme.spacing(2)
    },
    monthLabel:{
        position: 'absolute',
        top: '18%',
        left: '0%',
        color: 'white',
        width:'95%',
        textAlign:'center',
        fontSize:12,
        fontWeight:600
    },
    dayLabel:{
        position: 'absolute',
        top: '48%',
        left: '0%',
        width:'95%',
        textAlign:'center',
        color: 'white',
        fontSize:'42px',
        fontWeight:600
    },
    calendarImg:{
        width:100
    }
}));

const CalendarIcon = props => {
    const { day, month } = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img src='/images/svg/calendar_icon.svg' className={classes.calendarImg} alt='' />
            <Typography variant="h6" className={classes.monthLabel}>{month}</Typography>
            <Typography variant="h2" className={classes.dayLabel}>{day}</Typography>
        </div>
    );
}
CalendarIcon.propTypes = {    
    day: PropTypes.number.isRequired,
    month: PropTypes.string.isRequired,
};
export default CalendarIcon;