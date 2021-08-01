import React from 'react';
import PropTypes from 'prop-types';
import { Site, Users, TestManager, Departiment, Test, Inventory, NotificationBell } from 'icons';
import Results from 'icons/Results';

const NotificationIcon = ({ type, classes }) => {
  if (type.includes('location'))
    return <Site className={classes} />;
  if (type.includes('department'))
    return <Departiment className={classes} />;
  if (type.includes('populationsetting'))
    return <Users className={classes} />;
  else if (type.includes('user'))
    return <Users className={classes} />;
  else if (type.includes('result'))
    return <Results className={classes} />;
  else if (type.includes('order'))
    return <Test className={classes} />;
  else if (type.includes('schedule'))
    return <TestManager className={classes} />;
  else if (type.includes('inventory'))
    return <Inventory className={classes} />;
  else
    return <NotificationBell className={classes} />;
}

NotificationIcon.propTypes = {
  type: PropTypes.string,
};

export default NotificationIcon;