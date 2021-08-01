import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import BlueBox from "components/BlueBox";
// import brandStyles from 'theme/brand';
// import clsx from 'clsx';
import {
    Profile, 
    Return,
    Departiment,
    Building
} from 'icons';

const useStyles = makeStyles(theme => ({
    root: {
        // padding: 20,
        // paddingLeft: theme.spacing(2)
    },
    container:{
        margin:'0 auto',
        paddingTop:200
    },
    content:{
        width:'100%',
        display:'flex',
        justifyContent:'space-evenly'
    },
    box:{
        width:300,
        cursor:'pointer',
        '& img':{
            margin:'15px auto 5px'
        },
        '& h4':{
            color:theme.palette.brand,
            margin:'10px auto 20px'
        },
        '& svg':{
            color:theme.palette.brand,
            margin:'10px auto 5px',
            fontSize:54
        },
        
        '&:hover':{
            backgroundColor:theme.palette.brand,
            '& svg':{
                color:theme.palette.white,
                // width:30
            },
            '& h4':{
                color:theme.palette.white,
            }
        }
    }
}));

const SchedulerSelector = (props) => {

    const classes = useStyles();
    // const brandClasses = brandStyles();

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <BlueBox class={classes.box}>
                    <Profile className={classes.profile}/>
                    <Typography variant="h4" >
                        SCHEDULE<br /> NEW USER
                    </Typography>
                </BlueBox>
                <BlueBox class={classes.box}>
                    <Return />
                    <Typography variant="h4">
                        SCHEDULE
                        <br />RETURNING USER
                    </Typography>
                </BlueBox>
            </div>
            <div className={classes.content}>
                <BlueBox class={classes.box}>
                    <Departiment />
                    <Typography variant="h4">
                        SCHEDULE
                        <br/> DEPARTMENT
                    </Typography>
                </BlueBox>
                <BlueBox class={classes.box}>
                    <Building />
                    <Typography variant="h4">
                        SCHEDULE
                        <br/>LOCATION
                    </Typography>
                </BlueBox>
            </div>
        </div>
    );
}

export default SchedulerSelector;
