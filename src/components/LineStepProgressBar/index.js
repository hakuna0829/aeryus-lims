import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    width: '100%',
    margin: '0px auto 8px',
    [theme.breakpoints.up(415)]: {
      // top: 80,
      // width:'350px',
      // height: 'calc(100vh - 90px)',
    }
  },
  container: {
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
  },
  label: {
    color: '#0F84A9',
    textAlign: 'center',
    margin: '15px auto 30px',
    [theme.breakpoints.up('lg')]: {
      fontSize: '26px'
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '22px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    },
  },
  yAxisStyle: {
    color: '#0F84A9',
    fontSize: 12,
    fontFamily: 'Montserrat'
  },
  progressBar: {
    display: 'flex',
    marginBottom: '3px',
    '& div': {
      marginRight: 2,
      lineHeight: '4px',
      borderRadius: '8px',
      '&:last-child': {
        marginRight: 0
      }
    }

  },
  progressItem: {
    backgroundColor: theme.palette.brandLightGray
  },
  progressItemActive: {
    backgroundColor: theme.palette.brand
  },
  progressItemPass: {
    backgroundColor: theme.palette.brandDark
  },
  mark: {
    marginBottom: '1em',
    listStyleType: 'none',
    padding: '.4em 0 0 2.5em',
    position: 'relative',
    paddingLeft: '20px',
    color: theme.palette.brandDisableGray,
    fontFamily: 'Montserrat',
    fontWeight: 500,
    lineHeight: '10px !important',
    fontSize: '12px',
    '&:before': {
      position: 'absolute',
      top: 4,
      left: 0,
      width: '9px',
      height: '9px',
      border: `solid 2px #D8D8D8`,
      content: "' '",
      marginTop: '0px',
      display: 'block',
      borderRadius: '.8em',
      background: 'white'
    }
  },
  activeMark: {
    color: theme.palette.brand,
    '&:before': {
      position: 'absolute',
      top: 4,
      left: 0,
      width: 0,
      height: 0,
      border: `solid 7px ${theme.palette.brand}`,
      content: "' '",
      marginTop: '0px',
      display: 'block',
      borderRadius: '.8em',
      background: theme.palette.brand
    },
    '&:after': {
      top: '8px',
      left: '4px',
      content: '" "',
      width: '6px',
      height: '6px',
      display: 'block',
      borderRadius: '50%',
      backgroundColor: 'white',
      position: 'absolute',
      marginTop: '0px',
    }
  },
  passMark: {
    color: theme.palette.brandDark,
    '&:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      border: 'solid 7px #0F84A9',
      content: "' '",
      marginTop: '0px',
      display: 'block',
      borderRadius: '.8em',
      background: '#0F84A9'
    },
    '&:after': {
      content: '" "',
      display: 'block',
      top: '1px',
      left: '4px',
      border: 'solid #fff',
      width: '4px',
      height: '7px',
      borderWidth: '0 2px 2px 0',
      position: 'absolute',
      marginTop: '0px',
      transform: 'rotate(45deg)'
    }
  }
}))
export default function LineStepProgressBar(props) {
  // console.log(props)
  const classes = useStyles();
  //   const [loaded, setLoaded] = React.useState(false);
  const { activeIndex, labels, totalCount, handleStep } = props;
  const oneStepWidth = 1 / (totalCount) * 100;
  
  const goStep = (step_index) => {
    if( step_index < activeIndex )
      handleStep(step_index);
  }

  useEffect(() => {

  }, [props]); // Empty array ensures that effect is only run on mount

  return (
    <div className={classes.root} >
      <div className={classes.progressBar} >
        {new Array(totalCount).fill(1).map((_, z) => {
          return (
            <div style={{ width: oneStepWidth + '%' }} key={z} > 
              <div className={clsx(classes.progressItem, {
                [`${classes.progressItemActive}`]: z === activeIndex,
                [`${classes.progressItemPass}`]: z < activeIndex,
              })}>
                &nbsp;
              </div>
            </div>
          )
        })}
      </div>
      <div className={classes.progressBar} >
        {new Array(totalCount).fill(1).map((_, z) => {
          return (
            <div style={{ width: oneStepWidth + '%' }} key={z} onClick={() => goStep(z)}> 
              <div className={clsx(classes.mark, {
                [`${classes.activeMark}`]: z === activeIndex,
                [`${classes.passMark}`]: z < activeIndex,
              })}>
                {labels[z]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
};