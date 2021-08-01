import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  withStyles,
  Grid,
  TextField,
  MenuItem,
  Select,
  Box,
  FormControl
} from '@material-ui/core';
import moment from 'moment';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { showErrorDialog } from 'actions/dialogAlert';
import brandStyles from 'theme/brand';
import { getInventory, updateInventory, getLocations1 } from 'actions/api';
import clsx from 'clsx';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Edit } from 'icons';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
// import RemoveIcon from '@material-ui/icons/Remove';
import validate from 'validate.js';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';

const locationValidatorSchema = {
  location_id: { presence: { allowEmpty: false } },
  quantity: { presence: { allowEmpty: false } },
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div variant="h6">{children}</div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: '8px',
  },
  header: {
    '& > div': {
      display: 'flex',
    }
  },
  headerTitle: {
    lineHeight: '30px',
    fontWeight: 600,
    '& span': {
      fontWeight: 400,
    }
  },
  contentContainer: {
    padding: '34px 34px'
  },
  labelValue: {
    color: theme.palette.brandGray,
    marginTop: '10px'
  },
  sectionData: {
    marginTop: '16px',
    paddingRight: '12px'
  },
  fieldKey: {
    color: theme.palette.brandDark,
    fontWeight: 600,
  },
  mainTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '30px',
    color: theme.palette.blueDark,
    padding: '12px 0px 10px 20px'
  },
  editIcon: {
    color: theme.palette.blueDark,
    fontSize: theme.spacing(2)
  },
  locationRow: {
    paddingLeft: 25,
    marginTop: 10
  },
  blueBtn: {
    backgroundColor: theme.palette.brandDark,
    color: theme.palette.white,
    textTransform: 'uppercase',
    fontSize: '16px',
    borderRadius: '7px',
    padding: '12px 28px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  error: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '18px',
    padding: '12px 0px 20px',
    color: '#DD2525',
    // textAlign: 'right'
  },
  gridData: {
    paddingLeft: '25px'
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    textTransform: 'uppercase',
    fontSize: '14px',
    borderRadius: '7px',
    padding: '3px 12px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  saveBtn: {
    backgroundColor: theme.palette.brand,
    color: theme.palette.white,
    marginLeft: 10,
    borderRadius: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  iconBtn:{
    paddingTop:'0px !important',
    paddingBottom:'0px !important',
  }
}));

const InventoryDialog = (props) => {
  const { getInventory, dialogOpen, onDialogClose, inventoryId, locations, getLocations1, updateInventory } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    location_assign: [{}]
  });
  const [editSection, setEditSection] = useState({});
  const [quantityError, setQuantityError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  useEffect(() => {
    if (dialogOpen) {
      setDisplaySuccess(null);
      setQuantityError(null);
      setEditSection({});
      async function fetchData() {
        if (!locations)
          await getLocations1();
        if (inventoryId) {
          const res = await getInventory(inventoryId);
          if (res.success) {
            if (res.data) {
              if (!res.data.leftover_quantity)
                res.data.leftover_quantity = res.data.quantity;
              setInventoryData(res.data)
            } else {
              onDialogClose('doRefetch');
            }
          }
        } else {
          onDialogClose('doRefetch');
        }
      }
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, dialogOpen, inventoryId, getInventory]);

  const handleEdit = (field, isEditing) => {
    let fieldEdit = {};
    fieldEdit[field] = isEditing;
    setEditSection(fieldEdit);
    if (isEditing) {
      if (!inventoryData.location_assign || !inventoryData.location_assign.length) {
        // push empty object
        let temp = inventoryData.location_assign;
        temp.push({ location_id: undefined, quantity: undefined });
        setInventoryData({ ...inventoryData, temp });
      }
    }
  };

  const handleChangeLocation = index => e => {
    e.persist();
    setQuantityError(null);
    let temp = inventoryData.location_assign;
    temp[index][e.target.name] = e.target.name === 'quantity' ? parseInt(e.target.value) : e.target.value;
    let totalLocationQuantity = 0;
    let validAssignedLocations = temp.filter(l => l.location_id && l.quantity);
    validAssignedLocations.map((location) => {
      return totalLocationQuantity += location.quantity;
    });
    if (totalLocationQuantity > inventoryData.quantity) {
      setQuantityError(`Location assigned quantity total is ${totalLocationQuantity}, which is exceeding leftover quantity: ${inventoryData.leftover_quantity}. Check again.`);
      return;
    }
    setInventoryData({ ...inventoryData, temp });
  };

  const onAddLocation = () => {
    const isInvalid = validate(inventoryData.location_assign[inventoryData.location_assign.length - 1], locationValidatorSchema);
    if (isInvalid) {
      setAlertDialogOpen(true);
      setAlertDialogMessage('Please enter all the Location fields to add new Location');
    } else {
      let temp = inventoryData.location_assign;
      temp.push({ location_id: undefined, quantity: undefined });
      setInventoryData({ ...inventoryData, temp });
    }
  };

  const handleRemoveLocation = (id) => {
    let temp = inventoryData.location_assign;
    const location_assign = temp.filter((item) => item._id !== id)
    setInventoryData({ ...inventoryData, location_assign });
  };

  // useEffect(() => {
  //   console.log('InventoryData changed', inventoryData);
  // },[inventoryData])

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
    setAlertDialogMessage('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    // check quantity    
    let totalLocationQuantity = 0;
    let validAssignedLocations = inventoryData.location_assign.filter(l => l.location_id && l.quantity);
    validAssignedLocations.map((location) => {
      return totalLocationQuantity += location.quantity;
    });
    if (totalLocationQuantity > inventoryData.leftover_quantity) {
      setQuantityError(`Location assigned quantity total is ${totalLocationQuantity}, which is exceeding leftover quantity: ${inventoryData.leftover_quantity}. Check again.`);
      return;
    } else {
      setQuantityError(null);
    }
    let body = {
      ...inventoryData,
      location_assign: validAssignedLocations
    };
    setLoading(true);
    let res = await updateInventory(inventoryData._id, body);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      setTimeout(() => {
        setEditSection({})
        onDialogClose('doRefetch');
      }, 1000);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => onDialogClose()}
      maxWidth={'md'}
    >
      <DialogTitle onClose={() => onDialogClose()} className={clsx(brandClasses.headerContainer, classes.header)}>
        <img src="/images/svg/inventory_icon.svg" alt="" />&ensp;
        <Typography component="span" className={clsx(brandClasses.headerTitle, classes.headerTitle)}>
          INVENTORY MANAGER  | <span>VIEW DETAILS</span>
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.contentContainer}>
        <form
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <Typography className={classes.mainTitle}>
            PRODUCT DETAILS
          </Typography>
          <Grid container className={classes.gridData}>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Item Name'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.item_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Blockchain ID'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.serial_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Quantity'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.quantity}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Leftover quantity'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.leftover_quantity}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Manufacturer'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.manufacturer}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Serial Number'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.serial_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Lot Number'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData && inventoryData.lot_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.sectionData}>
              <Typography variant="h5" className={classes.fieldKey}>
                {'Exp. Date'}
              </Typography>
              <Typography variant="h5" className={classes.labelValue}>
                {inventoryData.exp_date && moment(inventoryData.exp_date).format('MM/DD/yyyy')}
              </Typography>
            </Grid>
          </Grid>

          <Grid container direction="row" justify="center" alignItems="flex-start" spacing={0}>
            <Grid item xs={12} sm={6} container direction="column" justify="center" alignItems="center">
              <Grid container alignItems="baseline" justify="space-between">
                <Typography className={classes.mainTitle}>
                  LOCATION
                  {editSection.location_assign
                    ?
                    <IconButton onClick={() => handleEdit('location_assign', false)} className={classes.iconBtn} style={{paddingRight:0}}>
                      <CancelOutlinedIcon />
                    </IconButton>
                    :
                    <IconButton onClick={() => handleEdit('location_assign', true)} style={{paddingRight:0}}>
                      <Edit className={classes.editIcon} color="" />
                    </IconButton>
                  } <span style={{ fontSize: '18px', paddingLeft: '0px' }}>EDIT</span>
                </Typography>
                <Grid >

                </Grid>
              </Grid>
              {inventoryData.location_assign.map((loc, index) =>
                <Grid container direction="row" justify="center" alignItems="flex-start" spacing={0} key={index} className={classes.gridData}>
                  <Grid item xs={12} sm={7} className={classes.sectionData}>
                    <Typography variant="h5" className={classes.fieldKey}>
                      {'Location Name'}
                    </Typography>
                    {editSection.location_assign
                      ?
                      <Grid item xs>
                        {locations
                          ?
                          <FormControl
                            className={brandClasses.shrinkTextField}
                            fullWidth
                            variant="outlined"
                          >
                            <Select
                              onChange={handleChangeLocation(index)}
                              name="location_id"
                              displayEmpty
                              value={loc.location_id || ''}
                            >
                              <MenuItem value=''>
                                <Typography className={brandClasses.selectPlaceholder}>Select Location</Typography>
                              </MenuItem>
                              {locations.map((location, index) => (
                                <MenuItem key={index} value={location._id}>
                                  {location.name}
                                  {location.client_id.name && `  –  (${location.client_id.name})`}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          :
                          <CircularProgress size={20} className={brandClasses.progressSpinner} />
                        }
                      </Grid>
                      :
                      <Typography variant="h5" className={classes.labelValue}>
                        {loc.location_id ? locations.find(e => e._id === loc.location_id).name : '' || ''}
                      </Typography>
                    }
                  </Grid>
                  <Grid item xs={12} sm={5} className={classes.sectionData}>
                    <Typography variant="h5" className={classes.fieldKey}>
                      {'Quantity'}
                    </Typography>
                    {editSection.location_assign
                      ?
                      <Grid item xs style={{display:'flex', alignItems:'center'}}>
                        <TextField
                          type="number"
                          // placeholder="Enter how many"
                          name="quantity"
                          className={brandClasses.shrinkTextField}
                          onChange={handleChangeLocation(index)}
                          value={loc.quantity || 0}
                          fullWidth
                          InputProps={{ classes: { root: classes.inputLabel } }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          error={quantityError ? true : false}
                        />
                        {inventoryData.location_assign.length > 1 && (
                          <img src="/images/svg/delete_grey.svg" onClick={() => handleRemoveLocation(loc._id)} alt="Remove" style={{width:'24px', marginLeft: 5}}/>
                        )}
                      </Grid>
                      :
                      <Typography variant="h5" className={classes.labelValue}>
                        {loc.quantity || ''}
                      </Typography>
                    }
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} sm={6} container direction="column" justify="center" alignItems="center">
              <Grid container alignItems="baseline" justify="space-between">
                <Typography className={classes.mainTitle}>
                  {'TRACKING'}
                </Typography>
              </Grid>
              <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3} className={classes.gridData}>
                <Grid item xs={12} sm={6} className={classes.sectionData}>
                  <Typography variant="h5" className={classes.fieldKey}>
                    {'Tracking Number'}
                  </Typography>
                  <Typography variant="h5" className={classes.labelValue}>
                    {inventoryData && inventoryData.tracking_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.sectionData}>
                  <Typography variant="h5" className={classes.fieldKey}>
                    {'Carrier'}
                  </Typography>
                  <Typography variant="h5" className={classes.labelValue}>
                    {inventoryData && inventoryData.tracking_carrier}
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.sectionData}>
                  <Typography variant="h5" className={classes.fieldKey}>
                    {'Shipping Status:  '}
                    <span className={classes.labelValue}>
                      {inventoryData && inventoryData.tracking_number}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={1} className={classes.locationRow}>
            {editSection.location_assign && (
              <Grid item xs={12} sm={7} >
                <Typography variant="h6">Want to split the quantity of product? You can add another location.</Typography>
                <Box display="flex">
                  <Button
                    variant="contained"
                    onClick={onAddLocation}
                    className={classes.greenBtn}
                  >
                    <AddIcon /> ADD Another location
                  </Button>
                  
                  <Button
                    className={classes.saveBtn}
                    onClick={() => handleEdit('location_assign', false)}
                    variant="contained" 
                  >
                   SAVE
                  </Button>
                  
                </Box>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {quantityError &&
                <Typography className={classes.error}>
                  {quantityError}
                </Typography>
              }
            </Grid>
          </Grid>
          <Grid item xs={12} >
            {displaySuccess ? <div className={brandClasses.footerMessage}>
              <Alert severity="success">{displaySuccess}</Alert>
            </div> : ''}
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                className={classes.blueBtn}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
              >
                DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </Box>
          </Grid>
        </form>

        <DialogAlert
          open={alertDialogOpen}
          type={appConstants.DIALOG_TYPE_ALERT}
          title={'Alert'}
          message={alertDialogMessage}
          onClose={handleAlertDialogClose}
        />

      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations
});

InventoryDialog.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getInventory: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
  inventoryId: PropTypes.string,
  updateInventory: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getLocations1, getInventory, showErrorDialog, updateInventory })(InventoryDialog);