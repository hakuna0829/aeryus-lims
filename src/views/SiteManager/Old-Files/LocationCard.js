import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { updateLocation } from '../../actions/api';
import { CircularProgress } from '@material-ui/core';
import { showErrorDialog, showFailedDialog } from '../../actions/dialogAlert';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '15px',
    border: '1px solid #3ECCCD',
    borderRadius: '8px',
    margin: '25px 0px',
    boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)',
  },
  borderGray: {
    border: '1px solid #9B9B9B !important',
    borderRadius: '8px',
    boxShadow: 'box-shadow: 4px 4px 8px 2px rgba(15,132,169,0.15);'
  },
  cardcontent: {
    textAlign: 'center',
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  pageBar: {
    backgroundColor: 'rgba(15,132,169,0.8)'
  },
  title: {
    color: '#0F84A9',
    fontSize: 24
  },/*
  viewLinkContainer: {
    margin: '20px auto 0'
  },*/
  viewLink: {
    color: '#0F84A9',
    fontSize: 18,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    '&:hover' : {
      textDecoration: 'underline',
    }
  },
  locationLogo: {
    height: 90,
    width: '45%',
    textAlign: 'center',
    margin: '0 auto 15px',
    '& img':{
      width:'100%'
    }
  },

  colorGray: {
    color: '#9B9B9B !important' // remove important
  },

  buttonRed: {
    color: '#DD2525 !important',
    borderColor: '#DD2525 !important'
  },
  actionButtonRow: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '10px auto 5px'
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const ActiveButton = withStyles(theme => ({
  root: {
    color: '#25DD83',
    borderColor: '#25DD83',
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'capitalize'
  }
}))(Button);

export default function LocationCard(props) {
  const classes = useStyles();
  const [location, setLocation] = useState(props.item);
  // console.log(props.refWidth)
  const [isLoading, setIsLoading] = useState(false);
  const cardItemRef = React.useRef();
  
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleResize() {
      // Set window width/height to state
      const containerWidth = cardItemRef.current.offsetWidth;
      props.handleCardItemWidth(containerWidth+props.offset);
      // const itemWidth = cardItemRef.current;
      console.log('Location Card Width', containerWidth)
      // console.log('itemWidth', itemWidth)
      // setCellSize({
      //   width: tempWidth,
      //   height: tempWidth,
      // });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [props]);

  const ActionButton = data => {
    const isActive = data.row && data.row.active;
    const changeLocationDetails = (modifiedLocation) => {
      setIsLoading(true);
      updateLocation(modifiedLocation._id, modifiedLocation)
        .then(res => {
          setIsLoading(false);
          if (res.data.success) {
            setLocation(modifiedLocation);
          } else {
            showFailedDialog(res);
          }
        })
        .catch(error => {
          setIsLoading(false);
          showErrorDialog(error);
          console.error(error);
        });
    }
    return (<div className={classes.actionButtonRow} >
      <ActiveButton variant="outlined" disabled={isActive} style={{ marginRight: 15 }} onClick={() => changeLocationDetails({...data.row, active: true })}>
        Activate
      </ActiveButton>
      <ActiveButton variant="outlined" disabled={!isActive} className={isActive ? classes.buttonRed:''} style={{ marginLeft: 15 }} onClick={() => changeLocationDetails({...data.row, active: false})}>
        Deactivate
      </ActiveButton>
    </div>)
  };
  return (
    <Card
      ref={cardItemRef}
      className={
        location.active ? classes.root : `${classes.root} ${classes.borderGray}`
      } style={{position: 'relative', marginRight:props.cardPadding ? props.cardPadding : 0, marginLeft:props.firstPadding?props.firstPadding:0}}>
      {isLoading && <div className={classes.loader}>
        <CircularProgress/>
      </div>}
      {/* {props.cardPadding} */}
      <div >
        <div className={classes.locationLogo}>
          <img
            src={
              location.active
                ? '/images/svg/status/building_icon_turquoise.svg '
                : '/images/svg/status/building_icon_gray.svg'
            }
            alt=""
          />
        </div>
        <CardContent className={classes.cardcontent}>
          <Typography
            className={
              location.active
                ? `${classes.title}`
                : `${classes.title} ${classes.colorGray}`
            }>
            {location.name}
          </Typography>
          <ActionButton row={location} />
          <Button
            component={Link}
            to={{ pathname : "/site-manager/location-details", state: { locationDetails: location }
            }}
            className={
              location.active
                ? `${classes.viewLink}`
                : `${classes.viewLink} ${classes.colorGray}`
            }
          >
            View Details
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
