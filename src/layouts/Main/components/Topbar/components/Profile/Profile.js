import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { apiUrl } from 'actions/api';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 'fit-content',
    paddingRight: theme.spacing(3)
  },
  userinfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.white,
    paddingRight: theme.spacing(2)
  },
  avatar: {
    backgroundColor: '#D8D8D8',
    width: 51,
    height: 51
  },
  typography: {
    color: theme.palette.white
  }
}));

const Profile = props => {
  const { account } = props;
  const { first_name, last_name, photo } = account;

  const classes = useStyles();

  const user = {
    welcome: 'Welcome back',
    avatar: photo ? `${apiUrl}${photo}` : '',
    name: `${first_name} ${last_name}`
  };

  return (
    <div className={clsx(classes.root, props.className)}>
     
      <div className={classes.userinfo}>
        <Typography
          className={classes.typography}
          variant="h6"
        >
          {user.welcome}
        </Typography>
        <Typography
          className={classes.typography}
          variant="h6"
        >{user.name}</Typography>
      </div>
      <Avatar
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        to="/dashboard"
      />
    </div>
  );
};

const mapStateToProps = state => ({
  account: state.auth.account
});

export default connect(mapStateToProps)(Profile);
