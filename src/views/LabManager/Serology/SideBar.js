import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
        // width: 294
    },
    content: {
        textAlign: 'center'
    },
    overviewTitle: {
        color: theme.palette.blueDark,
        backgroundColor: theme.palette.sideMenuBgColor,
        textAlign: 'center',
        padding:'25px 30px',
        fontWeight:600
    },
    totalOrders:{
        backgroundColor:'rgba(62,204,205,0.5)',
        padding:'20px',
        border:'solid 1px #3ECCCD',
        borderRightWidth:0,
        borderLeftWidth:0,
    },
    totalTitle:{
        color:'#043B5D',
        textAlign:'center'
    },
    totalValue:{
        color:'#fff',
        textAlign:'center',
        fontSize:36
    },
    divider:{
        width:'80%',
        color:'white',
        border: 'solid 1px',
        margin: '20px auto'
    },
    serologyOrders:{
        backgroundColor:'rgba(15,132,169,0.3)',
        padding:'20px',
        borderBottom:'solid 1px #0F84A9'
    },
    serologyTitle:{
        color:'#043B5D',
        textAlign:'center'
    },
    serologyValue:{
        color:'#fff',
        textAlign:'center',
        fontSize:36
    },
    pcrOrders:{
        backgroundColor:'rgba(4,59,93,0.2)',
        padding:'20px',
        borderBottom:'solid 1px #043B5D'
    },
    pcrTitle:{
        color:'#043B5D',
        textAlign:'center'
    },
    pcrValue:{
        color:'#fff',
        textAlign:'center',
        fontSize:36
    },
}));

const SideBar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>

            <Typography className={classes.overviewTitle} variant="h4">
                OVERVIEW
            </Typography>
            <div className={classes.serologyOrders} >
                <Typography variant="h6" className={classes.serologyTitle}>Serology orders</Typography>
                <Typography variant="h1" className={classes.serologyValue}>1000</Typography>
                <hr className={classes.divider}/>
                <Typography variant="h6" className={classes.serologyTitle}>Serology orders shipped</Typography>
                <Typography variant="h1" className={classes.serologyValue}>1000</Typography>
            </div>
           
        </div>
    );
};

export default SideBar;