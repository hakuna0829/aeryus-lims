import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { version } from '../../../../../package.json';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    // float: 'right',
    // position: 'relative',
    position: 'fixed',
    bottom: 2,
    // right: 2,
    // left: 2,
    opacity: 0.8,
  },
  text: {
    fontSize: 12
  }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} >
      <div style={{ paddingTop: 12 }} />
      <div
        className={clsx(classes.root, className)}
      >
        <Typography variant="body1" className={classes.text}>
          &copy;{' '}
          <Link
            component="a"
            href="https://testd.com/"
            target="_blank"
          >
            {'TESTD | DB '}
          </Link>
          {' version'} {version}
        </Typography>
      </div>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
