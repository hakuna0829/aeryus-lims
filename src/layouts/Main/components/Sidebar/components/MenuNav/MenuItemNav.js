import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { List, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuSubItemNav from './MenuSubItemNav';

import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(theme => ({
  menuItem: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(4,59,93,0.2)',
    '& .MuiTypography-body1': {
      color: '#043B5D',
      fontSize: '12px'
    },
    '&.active': {
      background: theme.palette.sideMenuItemActiveColor,
      '& .MuiTypography-body1': {
        color: theme.palette.sideMenuActiveColor
      },
      '& .MuiListItemIcon-root': {
        color: theme.palette.sideMenuActiveColor,
      }
    }
  },
  mainMenuItem: {
    background: theme.palette.sideMenuBgColor,
    '&:hover':{
      background: theme.palette.sideMenuItemActiveColor,
      '& .MuiTypography-root' :{
        color:theme.palette.white,
      },
      '& .MuiListItemIcon-root':{
        color:theme.palette.white,
      },
      '& .MuiSvgIcon-root': {
        color:theme.palette.white
      },
    }
  },
  active:{
    background: theme.palette.sideMenuItemActiveColor,
    color:theme.palette.white,
    '& .MuiTypography-root' :{
      color:theme.palette.white
    },
    '& .MuiListItemIcon-root':{
      color:theme.palette.white
    },
    '& .MuiSvgIcon-root': {
        color:theme.palette.white
    }
  },
  subMenuItem: {
    background: '#F8FCFD',
    color:theme.palette.brandDark,
    '& .MuiTypography-root' :{
      color:theme.palette.blueDark
    },
    '&:hover':{
      background:theme.palette.sideMenuBgColor,
      '& .MuiTypography-body1':{
        color:theme.palette.brandDark,
        fontWeight:600,
      }
    },
    '&.active':{
      background:theme.palette.sideMenuBgColor,
      '& .MuiTypography-body1':{
        color:theme.palette.brandDark,
        fontWeight:600,
      }
    }
  },
  menuItemIcon: {
    color: theme.palette.sideMenuInActiveColor,
    minWidth:'40px',
    '&:hover':{
      color:theme.palette.white
    }
  },
  chevronDark: {
    color: theme.palette.blueDark,
    fontSize: '20px'
  },
  // chevronLight: {
  //   color: '#7896a8',
  //   fontSize: '16px'
  // }
}));

const MenuItemNav = props => {
  const { title, expanded, module_name, handleExpand, href, icon, children = [] } = props;

  const classes = useStyles();

  const isExpandable = children && children.length > 0;

  // const [open, setOpen] = useState(false);
  // const handleClick = () => setOpen(!open);

  const MenuItemRoot = (
    <MenuSubItemNav
      className={clsx(
        classes.menuItem,
        icon ? classes.mainMenuItem : classes.subMenuItem,
        expanded ? classes.active : null
      )}
      href={href}
      onClick={() => handleExpand(module_name)}>
      {!!icon && (
        <ListItemIcon className={classes.menuItemIcon}>{icon}</ListItemIcon>
      )}

      <ListItemText primary={title} inset={!icon} />

      {/* {!isExpandable && <ChevronRightIcon className={classes.chevronLight} />} */}

      {isExpandable && !expanded && (
        <IconExpandMore className={classes.chevronDark} />
      )}
      {isExpandable && expanded && (
        <IconExpandLess className={classes.chevronDark} />
      )}
    </MenuSubItemNav>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {children.map((item, index) => (
          <MenuItemNav {...item} key={index} />
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

MenuItemNav.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.any,
  expanded: PropTypes.bool,
  module_name: PropTypes.string,
  handleExpand: PropTypes.func,
  children: PropTypes.array
};

export default MenuItemNav;
