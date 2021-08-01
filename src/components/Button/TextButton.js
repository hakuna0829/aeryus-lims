import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({  
  primary: {
    color: theme.palette.white,
    backgroundColor: theme.palette.brand,
    fontSize:'1rem',
    padding:'8px 12px',
    minWidth: '125px',
    borderRadius:8,
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.palette.brand
      }
    },
    '&.MuiButton-containedSizeLarge':{
      fontSize:'1.4rem',
      padding:'12px 16px',
      minWidth: '140px',
    },
    '&.MuiButton-containedSizeSmall':{
      fontSize:'0.85rem',
      padding:'6px 8px',
      minWidth: '94px',
    },
    
  },

  outline: {
    color: theme.palette.brandDark,
    backgroundColor: theme.palette.white,
    border: `solid 1px ${theme.palette.brandDark}`,
    borderRadius: '8px',
    fontSize:'1rem',
    padding:'8px 12px',
    minWidth: '125px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
      color: theme.palette.white,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.palette.brand
      }
    },
    '&. MuiButton-sizeLarge':{
      fontSize:'1.4rem',
      padding:'12px 16px',
      minWidth: '140px',
    },
    '&.MuiButton-sizeSmall':{
      fontSize:'0.85rem',
      padding:'6px 8px',
      minWidth: '94px',
    },
  },

  icon: {
    color: theme.palette.white,
    backgroundColor: theme.palette.brandGreen,
    fontSize:'1rem',
    padding:'8px 12px',
    borderRadius:8,
    // minWidth: '125px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.palette.brand
      }
    },
    '&.MuiButton-containedSizeLarge':{
      fontSize:'1.4rem',
      padding:'12px 16px',
      // minWidth: '140px',
    },
    '&.MuiButton-containedSizeSmall':{
      fontSize:'0.85rem',
      padding:'6px 8px',
      // minWidth: '94px',
    },
    
  },

  activate: {
    color: theme.palette.brandGreen,
    backgroundColor: theme.palette.white,
    border: `solid 1px ${theme.palette.brandGreen}`,
    '&:hover': {
      color: theme.palette.brandGreen,
      backgroundColor: theme.palette.white,
      border: `solid 1px ${theme.palette.brandGreen}`,
    },
    '&. MuiButton-sizeLarge':{
      
    },
    '&.MuiButton-sizeSmall':{
      
    },
  },

  deActivate: {
    color: theme.palette.brandRed,
    backgroundColor: theme.palette.white,
    border: `solid 1px ${theme.palette.brandRed}`,
    '&:hover': {
      color: theme.palette.brandRed,
      backgroundColor: theme.palette.white,
      border: `solid 1px ${theme.palette.brandRed}`,
    },
    '&. MuiButton-sizeLarge':{
      
    },
    '&.MuiButton-sizeSmall':{
      
    },
  },

  noText:{
    padding:'6px',
    minWidth:'auto',
    '&.MuiButton-containedSizeLarge':{
      padding:'8px',
    },
    '&.MuiButton-containedSizeSmall':{
      padding:'4px',
    },
  },

  fixed:{
    width:'196px',
    '& .MuiButton-label':{
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      justifyContent:'flex-start',
      display:'block'
    }
    
  },

  // This is required for the '&$disabled' selector to work
  disabled: {
    color: `${theme.palette.white} !important`,
    backgroundColor: '#CECECE !important',
    border:'none'
  },

  disabled4activate: {
    color: '#CECECE !important',
    backgroundColor: 'white !important',
    border:'1px solid #CECECE !important'
  }
}));

//  USAGE SAMPLE

// <TextButton size="large">Primary Button</TextButton>
// <TextButton disabled size="small"> Primary Button</TextButton>
// <br />
// <TextButton type="Outlined" fullWidth>Primary Button</TextButton>
// <TextButton type="Outlined" disabled size="small">Primary Button</TextButton>
// <TextButton type="Outlined" fixed={true}> Outline fixed Button</TextButton>
// <br />

// <TextButton type="Icon" size="large"><AddIcon />Primary Button</TextButton>
// <TextButton type="Icon" ><AddIcon />Primary Button</TextButton>
// <TextButton type="Icon" size="small"><AddIcon />Primary Button</TextButton>

// <TextButton type="Icon" size="small">Primary Button</TextButton>
// <TextButton type="Icon" size="large" noText={true}><AddIcon /></TextButton>
// <TextButton type="Icon" noText={true}><AddIcon /></TextButton>
// <TextButton type="Icon" size="small" noText={true}><AddIcon /></TextButton>

// <TextButton type="Icon" size="small" noText={true} disabled><AddIcon /></TextButton>
// <TextButton type="Icon" size="" disabled><AddIcon />Primary Button</TextButton> 


export default function TextButton (props) {
  const { category = 'Contained', children, size = 'medium', fixed = false, noText=false, isActivated=null, ...rest} = props
  const classes = useStyles();
  
  return (
    <>
      { category === 'Contained' && (
        <Button
          {...rest}
          className={!fixed ? classes.primary : clsx(classes.primary, classes.fixed)}
          classes={{ disabled: classes.disabled }}
          size={size}
          variant="contained"
        >
          {children}
        </Button>
      )}
      { category === 'Outlined' && isActivated == null && (
        <Button
          {...rest}
          className={!fixed ? classes.outline : clsx(classes.outline, classes.fixed)}
          classes={{ disabled: classes.disabled }}
          size={size}
          variant="outlined"
        >
          {children}
        </Button>
      )}

      { category === 'Outlined' && isActivated === true && (
        <Button
          {...rest}
          className={!fixed ? clsx(classes.outline, classes.activate) : clsx(classes.outline, classes.fixed, classes.activate)}
          classes={{ disabled: classes.disabled4activate }}
          size={size}
          variant="outlined"
        >
          {children}
        </Button>
      )}

      { category === 'Outlined' && isActivated === false && (
        <Button
          {...rest}
          className={!fixed ? clsx(classes.outline, classes.deActivate) : clsx(classes.outline, classes.fixed, classes.deActivate)}
          classes={{ disabled: classes.disabled4activate }}
          size={size}
          variant="outlined"
        >
          {children}
        </Button>
      )}

      { category === 'Icon' && (
        <Button
          {...rest}
          className={!noText ? classes.icon : clsx(classes.icon, classes.noText)}
          classes={{ disabled: classes.disabled }}
          size={size}
          variant="contained"
        >
          {children}
        </Button>
      )}
      
    </>
    
  )
}
