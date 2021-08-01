import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery, Toolbar } from '@material-ui/core';
import { Sidebar, Topbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    // paddingTop: 56,    
    // height: '100%',
    // [theme.breakpoints.up('sm')]: {
    //   paddingTop: 80
    // }
  },
  shiftContentOpenDrawer: {
    paddingLeft: theme.palette.drawerWidth,
    transition: theme.transitions.create('padding-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  shiftContentCloseDrawer: {
    paddingLeft: theme.spacing(7) + 1,
    transition: theme.transitions.create('padding-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(9) + 1,
    },
  },
  content: {
    flexGrow: 1,
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  const [drawerOpen, setDrawerOpen] = useState(true);
  const onCollapse = () => setDrawerOpen(!drawerOpen);

  return (
    <div
      className={clsx(
        classes.root,
        isDesktop ? drawerOpen ? classes.shiftContentOpenDrawer : classes.shiftContentCloseDrawer : null
      )}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />

      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
        drawerOpen={drawerOpen}
        onCollapse={onCollapse}
      />
      <main className={classes.content}>
        <Toolbar />
        {children}
        <Footer />
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
