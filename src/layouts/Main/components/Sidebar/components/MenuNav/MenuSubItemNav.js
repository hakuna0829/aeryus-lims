import React, { forwardRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { ListItem } from '@material-ui/core';
import { NavLink, NavLinkProps } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      background: theme.palette.sideMenuItemActiveColor,
      '& .MuiTypography-body1': {
        color: theme.palette.sideMenuActiveColor,
      }
    }
  }
}));

const MenuSubItemNav = props => {
  const { className, onClick, href, children } = props;

  const classes = useStyles();

  if (!href || typeof href !== 'string') {
    return (
      <ListItem
        button
        classes={{ root: classes.root }}
        className={className}
        children={children}
        onClick={onClick}
      />
    )
  }

  return (
    <ListItem
      button
      classes={{ root: classes.root }}
      className={className}
      children={children}
      component={forwardRef((props: NavLinkProps, ref: any) => <NavLink exact {...props} innerRef={ref} />)}
      to={href}
    />
  )
}

export default MenuSubItemNav;
