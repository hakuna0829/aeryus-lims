import React from 'react';
import { makeStyles } from '@material-ui/styles';
import SideBar from './SideBar';
import Content from './Content';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 0,
        paddingLeft: theme.spacing(0),
        display:'flex',
        [theme.breakpoints.up('lg')]: {
            display:'flex',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            display:'flex',
        },
        [theme.breakpoints.down('sm')]: {
            display:'block',
        },

    },
    content: {
        padding: 0,
        width: 'calc(100% - 250px)',
        [theme.breakpoints.up('lg')]: {
            width: 'calc(100% - 250px)',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            width: 'calc(100% - 220px)',
        },
        [theme.breakpoints.down('sm')]: {
            width:'100%',
        },
    },
    container:{
        margin:0,
        width:'100%',
        padding:0

    },
    sidebar:{
        padding:'0 !important',
        width:250,
        [theme.breakpoints.up('lg')]: {
            width:250,
        },
        [theme.breakpoints.between('md', 'lg')]: {
            width:220,
        },
        [theme.breakpoints.down('sm')]: {
            width:'100%',
        },
    }
    
}));

const TestTracker = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <Grid container className={classes.container} spacing={0}> */}
                <div className={classes.sidebar} >                   
                    <SideBar />
                </div>
                <div className={classes.content} >
                    <Content />
                </div>
            {/* </Grid> */}
        </div>
    );
};

export default TestTracker;