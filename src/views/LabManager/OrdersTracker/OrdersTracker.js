import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Sidebar from './Sidebar';
import Content from './Content';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    // marginTop: 15,
    paddingLeft: theme.spacing(0),
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'block',
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
      width: '100%',
    },
  },
  container: {
    margin: 0,
    width: '100%',
    padding: 0

  },
  sidebar: {
    padding: '0 !important',
    width: 250,
    [theme.breakpoints.up('lg')]: {
      width: 250,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 220,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  }

}));

const OrdersTracker = (props) => {

  const classes = useStyles();

  const [refetch, setRefetch] = useState(0);

  return (
    <div className={classes.root}>
      <div className={classes.sidebar} >
        <Sidebar
          refetch={refetch}
        />
      </div>
      <div className={classes.content} >
        <Content
          refetch={refetch}
          setRefetch={setRefetch}
        />
      </div>
    </div>
  );
};

export default OrdersTracker;