import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: 0,
    marginRight: 0,

    '& .MuiFormControlLabel-root': {
      color: theme.palette.brandDark
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    }
  },
  icon: {
    width: 22,
    height: 22,
    border: 'solid #043B5D 1px',
    // boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.3)',
    backgroundColor: '#fff',
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#fff',
    border: 'solid #043B5D 0px',
    '&:before': {
      display: 'block',
      height: 22,
      width: 22,
      backgroundColor: '#043B5D',
      // backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""'
    },
    '&:after': {
      top: 10,
      left: 17,
      width: 5,
      border: 'solid white',
      height: 14,
      content: '""',
      display: 'block',
      position: 'absolute',
      borderWidth: '0px 3px 3px 0px',
      transform: 'rotate(45deg)'
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3'
    }
  },
  indeterminateIcon: {
    backgroundColor: '#fff',
    border: 'solid #043B5D 0px',

    '&:before': {
      display: 'block',
      height: 22,
      width: 22,
      backgroundColor: '#043B5D',
      content: '""'
    },
    '&:after': {
      top: 19,
      left: 13,
      width: 11,
      border: 'solid white',
      height: 0,
      content: '""',
      display: 'block',
      position: 'absolute',
      borderWidth: '1px 0px 2px 3px'
    }
  }
}));

// Inspired by blueprintjs
function StyledCheckBox(props) {
  const classes = useStyles();

  return (
    <Checkbox
      //   className={classes.root}
      checked={props.checked}
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      color="default"
      disableRipple
      icon={<span className={classes.icon} />}
      indeterminate={props.indetermnate}
      indeterminateIcon={
        props.checked ? (
          <span className={clsx(classes.icon, classes.indeterminateIcon)} />
        ) : (
          <span className={classes.icon} />
        )
      }
      name={props.name}
      onChange={props.onChange}
      {...props}
    />
  );
}

// eslint-disable-next-line react/no-multi-comp
export default function CheckButton(props) {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={clsx(classes.root, props.className)}
      control={
        <StyledCheckBox
          checked={props.checked}
          indeterminate={props.indeterminate}
          name={props.name}
          onChange={props.onChange}
          required={props.required}
        />
      }
      disabled={props.disabled === true ? true : false}
      label={props.label}
      value={props.value}
    />
  );
}
CheckButton.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.any
};
