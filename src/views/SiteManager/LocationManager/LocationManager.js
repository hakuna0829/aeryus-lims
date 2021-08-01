import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import {
  Grid,
  Button,
  Typography,
  CircularProgress,
  Box
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { Location } from 'icons';
import { getLocations1, updateLocation1, apiUrl } from 'actions/api';
import { clearLocations } from 'actions/clear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DuplicateDialog from './DuplicateDialog';
import SuccessAlert from 'components/SuccessAlert';
import { useTheme, useMediaQuery } from '@material-ui/core';
import useWindowDimensions from 'helpers/useWindowDimensions';
// import { DateRange } from 'react-date-range';
// import 'react-date-range/dist/styles.css'; // main style file
// import 'react-date-range/dist/theme/default.css'; // theme css file
import TextButton from 'components/Button/TextButton';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  container: {
    padding: `0px ${theme.spacing(0)}px`
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 16px'
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 30
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  title: {
    color: '#0F84A9',
    lineHeight: '1.5rem',
    paddingLeft: 16
  },
  greenBtn: {
    backgroundColor: '#00D7A2',
    color: theme.palette.white,
    textTransform: 'capitalize',
    fontSize: '16px',
    borderRadius: '8px',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#00D7A2'
    }
  },
  buttonLabel: {
    '& span': {
      fontSize: '28px',
      height: '0.5em',
      display: 'flex',
      alignItems: 'center'
    }
  },
  location: {
    margin: '50px 0'
  },
  locationGrid: {
    margin: theme.spacing(2),
    padding: 15,
    border: `1px solid ${theme.palette.brandDark}`,
    borderRadius: 8,
    // maxHeight: 260,
    maxWidth: 260,
    boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)',
    position: 'relative'
  },
  locationGridGray: {
    border: `1px solid ${theme.palette.brandGray}`,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  activeLocationIcon: {
    width: 150,
    fontSize: 112,
    color: theme.palette.brandDark,
    height: 150
  },
  inActiveLocationIcon: {
    width: 150,
    fontSize: 112,
    color: theme.palette.brandGray,
    height: 150
  },
  activeLocationText: {
    color: theme.palette.brandDark,
    stroke: theme.palette.brandDark,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%'
  },
  inActiveLocationText: {
    color: theme.palette.brandGray,
    stroke: theme.palette.brandGray,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%'
  },
  activateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandGreen,
    borderColor: theme.palette.brandGreen,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none'
  },
  deactivateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandRed,
    borderColor: theme.palette.brandRed,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none'
  },
  viewLink: {
    color: theme.palette.brandDark,
    fontSize: 18,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  colorGray: {
    color: '#9B9B9B !important' // remove important
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  boxConainer: {
    display: 'flex'
  },
  cardBox: {
    maxWidth: 300,
    width: '100%',
    border: '1px solid #0F84A9',
    borderRadius: '8px',
    boxShadow: '4px 4px 4px rgba(4, 59, 93, 0.15)',
    textAlign: 'center',
    padding: 10,
    position: 'relative',
    marginBottom: 24
  }
}));

const LocationManager = props => {
  const { locations, getLocations1, updateLocation1, clearLocations } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedId, setSelectedId] = React.useState();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openDuplicated, setOpenDuplicated] = React.useState(false);
  const [duplicateValue, setDuplicateValue] = useState();
  const [emptyCardCount, setEmptyCardCount] = useState(0);
  const { width } = useWindowDimensions();

  const theme = useTheme();
  // const mobileScreen = useMediaQuery(theme.breakpoints.up('md'));
  const mobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  // const xLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
 
  useEffect(() => {
    async function fetchData() {
      if (!locations) await getLocations1();
    }
    fetchData();
  }, [locations, getLocations1]);

  useEffect(() => {
    const perRow = mobileScreen ? parseInt((width - 16 * 3) / (260 + 16 * 2)) : parseInt((width - 260 - 16 * 3) / (260 + 16 * 2));
    const tempEmptyCardCounts = locations ? perRow - locations.length % perRow : 0;
    setEmptyCardCount(tempEmptyCardCounts);
  }, [width, locations, mobileScreen])

  // useEffect(() => {
  //   const perRow = mobileScreen ? parseInt( ( width - 16*3 ) / (260 + 16*2) ) : parseInt( (width - 260 - 16*3) / ( 260 + 16*2 )  );
  //   console.log('perRow count ', perRow);
  //   const tempEmptyCardCounts = locations ? perRow - locations.length % perRow : 0;
  //   console.log('emptyCardCounts count ', tempEmptyCardCounts);
  //   console.log('breakPoint', mobileScreen, xLargeScreen);
  //   setEmptyCardCount(tempEmptyCardCounts);
  // },[])

  // const emptyCard = () => {

  // }

  // emptyCard()

  const handleStatusUpdate = async (id, active) => {
    let res = await updateLocation1(id, { active });
    if (res.success) {
      await clearLocations();
    }
  };

  const handleClose = () => {
    // e.preventDefault();
    setAnchorEl(null);
  };

  const closeSuccess = () => {
    setOpenSuccess(false);
  };

  const handleDuplicatedClickOpen = () => {
    setOpenDuplicated(true);
  };

  const handleDuplicatedClose = (duplicated, formValue = {}) => {
    setOpenDuplicated(false);
    setDuplicateValue(formValue);
    duplicated ? setOpenSuccess(true) : setOpenSuccess(false);
  };

  const handleClick = id => event => {
    setAnchorEl(event.currentTarget);
    // var tempPopulation = populationSettings.filter((population) => population._id === id)[0];
    // setCurrentPopulation(tempPopulation);
    setSelectedId(id);
  };

  const handleMenuItem = (e, id) => {
    e.preventDefault();
    handleClose();
    handleDuplicatedClickOpen();
  };

  return (
    <div>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <img
            alt=""
            src="/images/svg/building_icon.svg"
          />
          &ensp;
          {/* <Typography variant="h2" className={brandClasses.headerTitle}>
            Site Manager |
            </Typography> */}
          <Typography
            className={classes.headerSubTitle}
            variant="h4"
          >
            LOCATION MANAGER
          </Typography>
          {/* <sup>
            <Tooltip title="LOCATION MANAGER" placement="right-start">
              <HelpIcon />
            </Tooltip>
          </sup> */}
        </div>
        {/* <DateRange
          editableDateInputs
          moveRangeOnFirstSelection={false}
          onChange={item => setState([item.selection])}
          ranges={state}
        /> */}
        <TextButton category="Icon" to="/site-manager/add-location" component={Link}><AddIcon />ADD LOCATION</TextButton>
      </div>

      <div className={classes.container}>
        <Typography
          className={classes.title}
          variant="h5"
        >
          Once you add a new location, you can not delete it. However, you can
          deactivate it at any <br /> time. Inactive locations will still be
          visible. Gray indicates an inactive location and blue <br /> indicates
          an active location.
        </Typography>
        <Grid container>
          {!locations ? (
            <CircularProgress className={brandClasses.fetchProgressSpinner} />
          ) : !locations.length ? (
            <Typography
              className={brandClasses.headerTitle}
              variant="h2"
            >
              {'No data to display...'}
            </Typography>
          ) : (
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="space-between"
            >
              {locations.map((location, index) => (
                <Grid
                  alignItems="center"
                  className={clsx(
                    classes.locationGrid,
                    !location.active && classes.locationGridGray
                  )}
                  container
                  direction="column"
                  item
                  justify="center"
                  key={index}
                  lg={3}
                  md={3}
                >
                  {location.site_logo ? <> <img alt="" src={apiUrl + location.site_logo} className={
                    location.active
                      ? classes.activeLocationIcon
                      : classes.inActiveLocationIcon
                  } /></> : <>
                    <Location
                      className={
                        location.active
                          ? classes.activeLocationIcon
                          : classes.inActiveLocationIcon
                      }
                    />
                  </>}
                  <Typography
                    className={
                      location.active
                        ? classes.activeLocationText
                        : classes.inActiveLocationText
                    }
                    variant="h3"
                  >
                    {location.name}
                    {location.client_id.name &&
                      `  –  (${location.client_id.name})`}
                  </Typography>
                  {/*<Grid
                    alignItems="center"
                    container
                    direction="row"
                    justify="space-between"
                  >
                     <Button
                      className={classes.activateButton}
                      disabled={location.active}
                      onClick={() => handleStatusUpdate(location._id, true)}
                      variant="outlined"
                    >
                      Activate
                    </Button> 
                    <Button
                      className={classes.deactivateButton}
                      disabled={!location.active}
                      onClick={() => handleStatusUpdate(location._id, false)}
                      variant="outlined"
                    >
                      Deactivate
                    </Button>
                    
                  </Grid>*/}
                  <Box display="flex" justifyContent="space-between" width="100%" marginTop="8px">
                    <TextButton 
                      disabled={location.active}
                      isActivated
                      onClick={() => handleStatusUpdate(location._id, true)}
                      size="small"
                      category="Outlined"
                      
                    >
                      Activate
                    </TextButton>
                    <TextButton 
                      disabled={!location.active}
                      isActivated={false}
                      onClick={() => handleStatusUpdate(location._id, false)}
                      size="small"
                      category="Outlined"
                      
                    >
                      Deactivate
                    </TextButton>
                  </Box>
                  <Button
                    className={clsx(
                      classes.viewLink,
                      !location.active && classes.colorGray
                    )}
                    component={Link}
                    to={`/site-manager/location-details?location_id=${location._id}`}
                  >
                    {'View Details'}
                  </Button>

                  <IconButton
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    aria-label="more"
                    // onClick={handleClick}
                    className={classes.iconButton}
                    onClick={handleClick(location._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Menu
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch'
                      }
                    }}
                    anchorEl={anchorEl}
                    id="long-menu"
                    // keepMounted
                    key={location._id}
                    onClick={() => setAnchorEl(null)}
                    open={location._id === selectedId && open}
                  >
                    <MenuItem
                      // selected={option === 'Pyxis'}
                      onClick={e => handleMenuItem(e, location._id)}
                    >
                      Duplicate
                    </MenuItem>
                    <MenuItem>Delete</MenuItem>
                  </Menu>
                </Grid>
              ))}
              {[...Array(emptyCardCount)].map((x, i) =>
                <Grid
                  alignItems="center"
                  container
                  className={classes.locationGrid}
                  style={{ visibility: 'hidden' }}
                  direction="column"
                  item
                  justify="center"
                  key={i}
                  lg={3}
                  md={3}
                />
              )}
            </Grid>
          )}
        </Grid>
        <DuplicateDialog
          handleDuplicatedClose={handleDuplicatedClose}
          openDuplicated={openDuplicated}
          populationSettings={locations}
          selectedId={selectedId}
        />
        {duplicateValue && (
          <SuccessAlert
            onClose={closeSuccess}
            open={openSuccess}
            population={duplicateValue}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations
});

LocationManager.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  updateLocation1: PropTypes.func.isRequired,
  clearLocations: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getLocations1,
  updateLocation1,
  clearLocations
})(LocationManager);
