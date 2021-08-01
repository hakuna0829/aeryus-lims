import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: 0,
    '& .MuiFormControlLabel-root': {
      color: theme.palette.brandDark,
    },
    '& .MuiTypography-body1': {
      color: '#788081',//'#D8D8D8',
    }
  },
  icon: {
    width: 20,
    height: 20,
    border: 'solid #0F84A9 1px',
    // boxShadow: "4px 4px 8px 2px rgba(15,132,169,0.3)",
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

    '&:before': {
      display: 'block',
      height: 20,
      width: 20,
      backgroundColor: theme.palette.blueDark,
      // backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""'
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      display: 'block',
      top: 12,
      left: 17,
      width: 4,
      height: 10,
      border: 'solid white',
      borderWidth: '0 3px 3px 0',
      transform: 'rotate(45deg)'
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3'
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
      name={props.name}
      onChange={props.onChange}
      {...props}
    />
  );
}

export default function CheckButton2(props) {
  const classes = useStyles();
  return (
    <FormControlLabel
      className={clsx(classes.root, props.className)}
      control={<StyledCheckBox
        checked={props.checked}
        name={props.name}
        onChange={props.onChange}
        required={props.required}
               />}
      disabled={props.disabled === true ? true : false}
      label={props.label}
      value={props.value}
    />

  );
}
