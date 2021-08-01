import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: 0,

    '& .MuiFormControlLabel-root': {
      color: theme.palette.brandDark,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark,
    }
  },
  icon: {
    width: 27,
    height: 27,
    border: "solid #0F84A9 1px",
    boxShadow: "4px 4px 8px 2px rgba(15,132,169,0.3)",
    backgroundColor: "#fff",
    borderRadius:'20px',
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5"
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)"
    }
  },
  checkedIcon: {
    backgroundColor: "#fff",
    
    
    "&:before": {
      display: "block",
      height: 25,
      width: 25,
      backgroundColor: "transparent",
      // backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""'
    },
    "&:after": {
      content: '""',
      position: "absolute",
      display: "block",
      left: 20,
      top: 12,
      width: 5,
      height: 15,
      border: "solid #3ECCCD",
      borderWidth: "0 3px 3px 0",
      transform: "rotate(45deg)"
    },
    "input:hover ~ &": {
      backgroundColor: "#fff",
      borderRadius:'20px'
    }
  }
}));

// Inspired by blueprintjs
function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      //   className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export default function RadioRoundCheckButton(props) {
  const classes = useStyles();
  return (
    <FormControlLabel
      value={props.value}
      disabled={props.disabled === true ? true : false}
      control={<StyledRadio required={props.required} />}
      label={props.label}
      className={clsx(classes.root, props.className)}
    />

  );
}
