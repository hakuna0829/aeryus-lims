import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Profile, NotificationPopover } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.brand,
    boxShadow: 'none',
    '& > *': {
      padding: theme.spacing(1),
    },
  },
  notificationLink: {
    color: '#043B5D'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  topLogo: {
    // border:'solid 1px',
    width: '100%',
    textAlign: 'center'
  },
  userInfo: {
    position: 'absolute',
    right: 0,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    // width: '100%',
    [theme.breakpoints.down('sm')]: {
      // marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  sideBarIcon: {
    position: 'absolute',
    left: 0,
  },
  search: {
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    color: theme.palette.brandGray,
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: theme.palette.brandGray
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  logo: {
    margin: 'auto',
    textAlign: 'center',
    width: '90%',
  },
  logoCenter: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  help: {
    margin: 'auto',
    textAlign: 'center',
    width: '30px',
    cursor: 'pointer',
    marginRight:'16px'
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;
  const classes = useStyles();

  return (
    <AppBar
      // position="fixed"
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar
        disableGutters={true}
      >
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>


        <div className={classes.logoCenter}>
          <img src="/images/svg/lims_header_logo.svg" className={classes.logo} alt="logo" />
        </div>

        {/* <Profile className={classes.userInfo}/> */}
        {/* <Hidden smDown>
          <div className={classes.topLogo}>
            <img src="images/svg/Testd_DB_logo.svg" alt="toplogo" />
          </div>
        </Hidden> */}

        <div className={classes.flexGrow} />

        <Hidden mdDown>
          <Profile />
        </Hidden>

        <Hidden mdDown>
          <img src="/images/svg/help_inactive.svg" className={classes.help} alt="help" />
        </Hidden>

        <Hidden lgUp>
          <NotificationPopover />
        </Hidden>

        
        <Hidden mdDown>
          <NotificationPopover />
        </Hidden>

        {/* <Hidden mdDown>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              // placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            // inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Hidden> */}
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
