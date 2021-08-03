import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Toolbar, Hidden } from '@material-ui/core';

import pages from 'NavItems';

import { SidebarNav } from './components';
import { Profile } from '../Topbar/components';

const useStyles = makeStyles(theme => ({
  drawer: {
    backgroundColor: theme.palette.brand,
    width: theme.palette.drawerWidth,
  },
  toolbar: {
    backgroundColor: theme.palette.brand,
  },
  drawerOpen: {
    width: theme.palette.drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  profile: {
    margin: '8px auto 16px',
    position: 'relative',
    top: 8,
    '& .MuiTypography-root': {
      color: theme.palette.blueDark,
      fontSize: 12
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    // height: '100%',
    // padding: theme.spacing(2)
  },
  hide: {
    display: 'none',
  },
  divider: {
    border: [
      [theme.spacing(2), 'solid', theme.palette.sideMenuBgColor]
    ],
    // margin: theme.spacing(2, 0)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, onCollapse, drawerOpen, modules } = props;

  const classes = useStyles();

  const [authPages, setAuthPages] = useState([]);
  console.log('modules data', modules)
  useEffect(() => {
    // auth routes
    setAuthPages(
      pages.filter(p => p.show && modules.some(m => {
        if (p.module_name === 'UserManager') {
          if (m.name === 'UserManager')
            return true;
          else if (modules.filter(m => m.name === 'TestTechnician').length)
            return true;
          else
            return false;
        } else {
          return p.module_name === m.name;
        }
      }))
    );
  }, [modules]);

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      variant={variant}
      classes={{
        paper: clsx({
          [classes.drawer]: true,
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        }),
      }}
    >
      <div
        className={clsx(classes.root, className)}
      >
        <Toolbar classes={{ root: classes.toolbar }} >
          <Hidden lgUp>
            <Profile className={classes.profile} />
          </Hidden>
        </Toolbar>

        {/* <Divider className={classes.divider} /> */}

        <SidebarNav
          pages={authPages}
          setAuthPages={setAuthPages}
          onCollapse={onCollapse}
        />

        <Toolbar classes={{ root: classes.toolbar }} />
      </div>
    </Drawer>
  );
};

const mapStateToProps = state => ({
  modules: state.auth.modules
});

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
  onCollapse: PropTypes.func,
  drawerOpen: PropTypes.bool
};

export default connect(mapStateToProps)(Sidebar);