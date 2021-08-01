import React, { useState, useEffect } from 'react';
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
  useMediaQuery
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Users } from 'icons';
import { getAllPopulationSetting, deletePopulationSettings } from 'actions/api';
import { useTheme } from '@material-ui/styles';
// import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DuplicateDialog from './DuplicateDialog';
// import SuccessAlert from 'components/SuccessAlert';
import PopulationView from './PopulationView';
import DialogAlert from 'components/DialogAlert';
import TextButton from 'components/Button/TextButton';
import { clearPopulationSettings } from 'actions/clear';
import * as appConstants from 'constants/appConstants';
import useWindowDimensions from 'helpers/useWindowDimensions';

// const cardLgWidth = 280;
// const cardMdWidth = 230;
const ITEM_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
  container: {
    padding: `0px ${theme.spacing(2)}px`
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2)
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
    lineHeight: '27px'
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    textTransform: 'capitalize',
    fontSize: '16px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  population: {
    margin: '50px 0'
  },
  populationGrid: {
    // margin: theme.spacing(2),
    // padding: 15,
    // border: `1px solid ${theme.palette.brand}`,
    // borderRadius: 8,
    margin: '0 auto',
    // maxWidth: cardLgWidth,
    width: '100%'
    // boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)'
  },
  populationGridGray: {
    border: `1px solid ${theme.palette.brandGray}`,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  activePopulationIcon: {
    fontSize: 112,
    color: theme.palette.brandDark
  },
  inActivePopulationIcon: {
    fontSize: 112,
    color: theme.palette.brandGray
  },
  activePopulationText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '80%',
    whiteSpace: 'nowrap',
    margin: '0 auto'
  },
  inActivePopulationText: {
    color: theme.palette.brandGray,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '80%',
    whiteSpace: 'nowrap',
    margin: '0 auto'
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
    fontSize: 14,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    lineHeight: 'unset',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  colorGray: {
    color: '#9B9B9B !important' // remove important
  },
  parentGrid: {
    padding: theme.spacing(2)
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  dlgTitle: {
    fontWeight: 600,
    fontSize: '24px',
    textAlign: 'center'
    // color: '#0F84A9'
  },
  dlgSubTitle: {
    fontWeight: 500,
    fontSize: '20px',
    color: theme.palette.blueDark
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
  }
}));

const PopulationManager = props => {
  const {
    populationSettings,
    getAllPopulationSetting,
    deletePopulationSettings,
    clearPopulationSettings
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
  //   defaultMatches: true
  // });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedId, setSelectedId] = React.useState();
  // const [currentPopulation, setCurrentPopulation] = React.useState();
  const [openDuplicated, setOpenDuplicated] = React.useState(false);
  // const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openViewDlg, setOpenViewDlg] = React.useState(false);
  // const [duplicateValue, setDuplicateValue] = React.useState();
  const [viewValue, setViewValue] = React.useState();
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState({});
  // const [duplicatePopulation, setDuplicatePopulation] = React.useState(null);
  const [emptyCardCount, setEmptyCardCount] = useState(0);
  const { width } = useWindowDimensions();

  const mobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const perRow = mobileScreen
      ? parseInt((width - 16 * 3) / (260 + 16 * 2))
      : parseInt((width - 260 - 16 * 3) / (260 + 16 * 2));
    const tempEmptyCardCounts = populationSettings
      ? perRow - (populationSettings.length % perRow)
      : 0;
    setEmptyCardCount(tempEmptyCardCounts);
    // console.log('tempEmptyCardCounts', tempEmptyCardCounts)
  }, [width, populationSettings, mobileScreen]);

  const handleClick = id => event => {
    setAnchorEl(event.currentTarget);
    // var tempPopulation = populationSettings.filter((population) => population._id === id)[0];
    // setCurrentPopulation(tempPopulation);
    setSelectedId(id);
  };

  const handleDuplicatedClickOpen = () => {
    setOpenDuplicated(true);
  };

  const handleDuplicatedClose = duplicated => {
    setOpenDuplicated(false);
    // setDuplicateValue(formValue);
    // duplicated ? setOpenSuccess(true) : setOpenSuccess(false);
  };

  const closeViewDlg = () => {
    setOpenViewDlg(false);
  };

  const handleClose = () => {
    // e.preventDefault();
    setAnchorEl(null);
  };

  // const closeSuccess = () => {
  //   setOpenSuccess(false);
  // }

  const handleMenuItem = (e, id) => {
    e.preventDefault();
    handleClose();
    handleDuplicatedClickOpen();
  };

  // const DuplicateDialog = () => {
  //   var currentPopulation;
  //   if(selectedId){
  //     currentPopulation = populationSettings.filter((population) => population._id === selectedId)[0];

  //   }
  //   return (
  //     <Dialog onClose={handleDuplicatedClose} aria-labelledby="customized-dialog-title" open={openDuplicated} maxWidth={'sm'} fullWidth={true}>
  //       <DialogTitle id="customized-dialog-title" onClose={handleDuplicatedClose} >
  //         Duplicate {selectedId && currentPopulation.type}
  //       </DialogTitle>
  //       <DialogContent >
  //         <Typography gutterBottom className={classes.dlgSubTitle}>
  //           ASSIGN THE FOLLOWING:
  //         </Typography>
  //         <Grid container spacing={2}>
  //           <Grid item md={7}>
  //             <FormControl
  //               className={brandClasses.shrinkTextField}
  //               required
  //               fullWidth
  //               variant="outlined"
  //             >
  //               <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Name</InputLabel>
  //             <TextField
  //               type="text"
  //               label=""
  //               placeholder="Enter custom text"
  //               name="uri"
  //               className={brandClasses.shrinkTextField}
  //               onChange={handleChange}
  //               value={formState.uri || ''}
  //               required
  //               fullWidth
  //               InputLabelProps={{ shrink: true }}
  //               variant="outlined"
  //             />
  //             </FormControl>
  //           </Grid>
  //           <Grid item md={7}>
  //             <FormControl
  //               className={brandClasses.shrinkTextField}
  //               required
  //               fullWidth
  //               variant="outlined"
  //             >
  //               <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Name</InputLabel>
  //               <Select
  //                 onChange={handleChange}
  //                 label="Assign Location"
  //                 name="dupLocation"
  //                 displayEmpty
  //                 value={formState.dupLocation || ''}
  //               >
  //                 <MenuItem value=''>
  //                   <Typography className={brandClasses.selectPlaceholder}>Select a location</Typography>
  //                 </MenuItem>
  //                   <MenuItem value="location1">Location 1</MenuItem>
  //                   <MenuItem value="location2">Location 2</MenuItem>
  //                   <MenuItem value="location3">Location 3</MenuItem>
  //               </Select>
  //             </FormControl>
  //           </Grid>
  //         </Grid>
  //         <Button autoFocus onClick={handleDuplicatedClose} color="primary">
  //         Save changes
  //       </Button>
  //       </DialogContent>

  //     </Dialog>
  //   )
  // }

  const handleView = population => {
    setOpenViewDlg(true);
    setViewValue(population);
  };

  useEffect(() => {
    async function fetchData() {
      if (!populationSettings) await getAllPopulationSetting();
    }
    fetchData();
  }, [populationSettings, getAllPopulationSetting]);

  const handleDelete = async (id, name) => {
    setSelectedItem({ id, name });
    setConfirmDialogOpen(true);
  };

  const handleDeleteDialogAction = async () => {
    setConfirmDialogOpen(false);
    let res = await deletePopulationSettings(selectedItem.id);
    if (res.success) {
      clearPopulationSettings();
    }
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <div>
      {/* <EmployeeMenu population={} /> */}
      <div className={classes.header}>
        {/* <div className={classes.subHeader}> */}
        <Grid container>
          <Grid
            className={classes.subHeader}
            item
            md={8}
          >
            <img
              alt=""
              src="/images/svg/status/users_icon.svg"
            />
            &ensp;
            <Typography
              className={brandClasses.headerTitle}
              variant="h2"
            >
              POPULATION MANAGER
            </Typography>
            &ensp;
          </Grid>
          <Grid
            item
            md={4}
            style={{ textAlign: 'right' }}
          >
            {/* <Button
              className={classes.greenBtn}
              component={Link}
              startIcon={<AddIcon />}
              to="/site-manager/add-population"
              variant="contained"
            >
              ADD POPULATION
            </Button> */}
            <TextButton
              category="Icon"
              component={Link}
              startIcon={<AddIcon />}
              to="/site-manager/add-population"
            >
              ADD POPULATION
            </TextButton>
          </Grid>
        </Grid>

        {/* <sup>
            <Tooltip title="POPULATION MANAGER" placement="right-start">
              <HelpIcon />
            </Tooltip>
          </sup> */}
        {/* </div> */}
      </div>
      {/* <Box padding="16px">
        <Grid container>
          <Grid item md={8}>
            <Typography variant="h5" className={classes.title}>
              Once you add a new population, you cannot delete it, but you can deactivate it <br />
              at any time. Inactive populations will still be visible and can be reactivated at any time.
            </Typography>
          </Grid>
          <Grid item md={4} style={{ textAlign: 'right' }}>

          </Grid>
        </Grid>
      </Box> */}

      <Grid container>
        {!populationSettings ? (
          <CircularProgress className={brandClasses.fetchProgressSpinner} />
        ) : !populationSettings.length ? (
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
            {populationSettings.map((population, index) => (
              <Grid
                alignItems="center"
                className={classes.locationGrid}
                container
                direction="column"
                item
                justify="center"
                key={index}
                lg={3}
                md={3}
              >
                <div
                  className={clsx(
                    classes.populationGrid,
                    population.active && classes.populationGridGray
                  )}
                  style={{ textAlign: 'center', position: 'relative' }}
                >
                  <Users
                    className={
                      !population.active
                        ? classes.activePopulationIcon
                        : classes.inActivePopulationIcon
                    }
                  />
                  <Typography
                    className={
                      !population.active
                        ? classes.activePopulationText
                        : classes.inActivePopulationText
                    }
                    variant="h3"
                  >
                    {population.type}
                  </Typography>
                  <Typography
                    className={
                      !population.active
                        ? classes.activePopulationText
                        : classes.inActivePopulationText
                    }
                    variant="h4"
                  >
                    {population.location_id && population.location_id.name}
                  </Typography>

                  <Grid
                    alignItems="center"
                    container
                    direction="row"
                    justify="space-between"
                  >
                    <Button
                      // component={Link}
                      // to={`/site-manager/population-details?population_id=${population._id}`}
                      className={clsx(
                        classes.viewLink,
                        population.active && classes.colorGray
                      )}
                      onClick={() => handleView(population)}
                    >
                      View <br /> Details
                    </Button>
                    <Button
                      className={clsx(
                        classes.viewLink,
                        population.active && classes.colorGray
                      )}
                      component={Link}
                      to={`/site-manager/population-users?population_id=${population._id}&population_type=${population.type}`}
                    >
                      View <br /> Population
                    </Button>
                  </Grid>

                  <IconButton
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    aria-label="more"
                    // onClick={handleClick}
                    className={classes.iconButton}
                    onClick={handleClick(population._id)}
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
                    key={population._id}
                    onClick={() => setAnchorEl(null)}
                    open={population._id === selectedId && open}
                  >
                    <MenuItem
                      // selected={option === 'Pyxis'}
                      onClick={e => handleMenuItem(e, population._id)}
                    >
                      Duplicate
                    </MenuItem>
                    <MenuItem
                      onClick={e =>
                        handleDelete(
                          population._id,
                          population.type +
                            ' ' +
                            (population.location_id &&
                              population.location_id.name)
                        )
                      }
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </Grid>
            ))}
            {[...Array(emptyCardCount)].map((x, i) => (
              <Grid
                alignItems="center"
                className={classes.locationGrid}
                container
                direction="column"
                item
                justify="center"
                key={i}
                lg={3}
                md={3}
                style={{ visibility: 'hidden' }}
              />
            ))}
          </Grid>
        )}
      </Grid>
      {/* <Grid
        container
        direction="row"
        justify={isDesktop ? "flex-start" : "center"}
        alignItems="center"
        spacing={2}
        className={classes.parentGrid}
      >
        {!populationSettings
          ?
          <CircularProgress className={brandClasses.fetchProgressSpinner} />
          :
          !populationSettings.length
            ?
            <Typography variant="h2" className={brandClasses.headerTitle}>
              {'No data to display...'}
            </Typography>
            :
            populationSettings.map((population, index) => (
              <Grid
                item
                key={index}
                lg={3}
                md={4}
                sm={6}
                xm={12}
              >
                <div style={{ textAlign: 'center', position: 'relative' }} className={clsx(classes.populationGrid, population.active && classes.populationGridGray)}>
                  <Users className={!population.active ? classes.activePopulationIcon : classes.inActivePopulationIcon} />
                  <Typography variant="h3"
                    className={!population.active ? classes.activePopulationText : classes.inActivePopulationText}
                  >
                    {population.type}
                  </Typography>
                  <Typography variant="h4"
                    className={!population.active ? classes.activePopulationText : classes.inActivePopulationText}
                  >
                    {population.location_id && population.location_id.name}
                  </Typography>

                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Button
                      // component={Link}
                      // to={`/site-manager/population-details?population_id=${population._id}`}
                      onClick={() => handleView(population)}
                      className={clsx(classes.viewLink, population.active && classes.colorGray)}
                    >
                      View <br /> Details
                        </Button>
                    <Button
                      component={Link}
                      to={`/site-manager/population-users?population_id=${population._id}&population_type=${population.type}`}
                      className={clsx(classes.viewLink, population.active && classes.colorGray)}
                    >
                      View <br /> Population
                    </Button>
                  </Grid>

                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    // onClick={handleClick}
                    onClick={handleClick(population._id)}
                    className={classes.iconButton}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Menu
                    key={population._id}
                    id="long-menu"
                    anchorEl={anchorEl}
                    // keepMounted
                    open={population._id === selectedId && open}
                    onClick={() => setAnchorEl(null)}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    <MenuItem
                      // selected={option === 'Pyxis'} 
                      onClick={(e) => handleMenuItem(e, population._id)}>
                      Duplicate
                    </MenuItem>
                    <MenuItem onClick={(e) => handleDelete(population._id, population.type + ' ' + (population.location_id && population.location_id.name))}>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </Grid>
            ))
        }
      </Grid>
       */}
      <DuplicateDialog
        handleDuplicatedClose={handleDuplicatedClose}
        openDuplicated={openDuplicated}
        populationSettings={populationSettings}
        selectedId={selectedId}
      />
      {/* {
        duplicateValue && <SuccessAlert open={openSuccess} onClose={closeSuccess} population={duplicateValue} />
      } */}

      {viewValue && (
        <PopulationView
          handleViewClose={closeViewDlg}
          openView={openViewDlg}
          selectedPopulation={viewValue}
        />
      )}

      <DialogAlert
        message={`Do you want to Delete ${selectedItem.name}?`}
        onAction={handleDeleteDialogAction}
        onClose={handleDialogClose}
        open={confirmDialogOpen}
        title={'Are you sure ?'}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  populationSettings: state.data.populationSettings
});

PopulationManager.propTypes = {
  getAllPopulationSetting: PropTypes.func.isRequired,
  deletePopulationSettings: PropTypes.func.isRequired,
  clearPopulationSettings: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getAllPopulationSetting,
  deletePopulationSettings,
  clearPopulationSettings
})(PopulationManager);
