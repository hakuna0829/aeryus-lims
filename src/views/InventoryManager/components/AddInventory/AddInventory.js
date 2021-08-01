import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  withStyles,
  Grid,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Alert from '@material-ui/lab/Alert';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from '@date-io/moment';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import NewItem from '../NewItem';
import validate from 'validate.js';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import { addInventory } from 'actions/api';

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
    padding: '8px 34px'
  },
  mainTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '30px',
    color: theme.palette.brandDark,
    padding: '12px 0px 20px'
  },
  tracking: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.blueDark,
    margin: '12px 0 8px',
    cursor: 'pointer',
    '& p': {
      color: theme.palette.blueDark,
      fontSize: '20px',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  },
  locationRow: {
    marginBottom: '10px'
  },
  addLocation: {
    padding: '12px 12px',
    '& h6': {
      fontSize: '14px',
      color: theme.palette.brandDark,
      fontWeight: 500,
      fontHeight: '20px'
    }
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
    color: '#DD2525'
  },
  selectRoot: { padding: '10px 12px !important' },
  dateLabel: {
    marginTop: '-23px',
    fontSize: '10px',
    backgroundColor: 'white',
    padding: '0 3px'
  },
  utilRoot: {
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    '& input': {
      padding: '13px 13px',
    },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    }
  },
  redBtn: {
    backgroundColor: theme.palette.brandRed,
    color: theme.palette.white,
    marginLeft: 10,
    borderRadius: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  labelValue: {
    color: theme.palette.brandGray
  },
}));

const InventoryOptions = [
  { name: 'Covid-19 Vaccine', type: 'Vaccine' },
  { name: 'PCR/Lab Test', type: 'PCR' },
  { name: 'Saliva Test', type: 'Saliva' },
  { name: 'Rapid Test', type: 'Rapid' }
];

const CustomOptions = [
  { name: 'Vaccine', type: 'Vaccine' },
  { name: 'Lab Test', type: 'PCR' },
  { name: 'Antigen Test', type: 'Saliva' }
];

const AddInventory = (props) => {
  const { dialogOpen, onDialogClose, locations, addInventory } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [trackVisible, setTrackVisible] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [emptyItemError, setEmptyItemError] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [formState, setFormState] = useState({
    exp_date: moment(),
    location_assign: [{ location_id: undefined, quantity: undefined }]
  });

  useEffect(() => {
    if (dialogOpen) {
      setTrackVisible(false);
      setQuantityError(false);
      setEmptyItemError(false);
      setDisplaySuccess(null);
      setFormState({
        exp_date: moment(),
        location_assign: [{ location_id: undefined, quantity: undefined }]
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const handleItemChange = (value) => {
    setFormState(formState => ({
      ...formState,
      item_value: value,
      item_name: value.name,
      item_type: value.type,
      exp_date: moment(),
    }))
    if (value.type !== 'Vaccine') {
      setFormState(formState => ({
        ...formState,
        exp_date: ""
      }))
    }
  };

  const handleDateChange = (date) => {
    setFormState(formState => ({
      ...formState,
      exp_date: date
    }));
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.name === 'quantity' ? parseInt(e.target.value) : e.target.value
    }));
  };

  const handleChangeLocation = index => e => {
    e.persist();
    setQuantityError(false);
    let temp = formState.location_assign;
    temp[index][e.target.name] = e.target.name === 'quantity' ? parseInt(e.target.value) : e.target.value;
    let totalLocationQuantity = 0;
    let validAssignedLocations = temp.filter(l => l.location_id && l.quantity);
    validAssignedLocations.map((location) => {
      return totalLocationQuantity += location.quantity;
    });
    if (totalLocationQuantity > formState.quantity) {
      setQuantityError(true);
      return;
    }
    setFormState({ ...formState, temp });
  };

  const handleNewTrack = () => {
    setTrackVisible(!trackVisible);
  };

  const onAddLocation = () => {
    const isInvalid = validate(formState.location_assign[formState.location_assign.length - 1], locationValidatorSchema);
    if (isInvalid) {
      setAlertDialogOpen(true);
      setAlertDialogMessage('Please enter all the Location fields to add new Location');
    } else {
      let temp = formState.location_assign;
      temp.push({ location_id: undefined, quantity: undefined });
      setFormState({ ...formState, temp });
    }
  };

  const handleRemoveLocation = () => {
    let temp = formState.location_assign;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
    setAlertDialogMessage('');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    // validate item
    if (!formState.item_name || !formState.item_type) {
      setEmptyItemError(true);
      return;
    } else {
      setEmptyItemError(false);
    }
    // check quantity    
    let totalLocationQuantity = 0;
    let validAssignedLocations = formState.location_assign.filter(l => l.location_id && l.quantity);
    validAssignedLocations.map((location) => {
      return totalLocationQuantity += location.quantity;
    });
    if (totalLocationQuantity > formState.quantity) {
      setQuantityError(true);
      return;
    } else {
      setQuantityError(false);
    }
    // add body
    let body = {
      ...formState,
      leftover_quantity: formState.quantity,
      location_assign: validAssignedLocations
    };
    setLoading(true);
    let res = await addInventory(body);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      setTimeout(() => {
        onDialogClose('doRefetch');
      }, 1000);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => onDialogClose()}
      maxWidth={'md'}
      fullWidth={true}
    >
      <DialogTitle onClose={() => onDialogClose()} className={clsx(brandClasses.headerContainer, classes.header)}>
        <img src="/images/svg/inventory_icon.svg" alt="" />&ensp;
        <Typography component="span" className={clsx(brandClasses.headerTitle, classes.headerTitle)}>
          INVENTORY MANAGER  | <span>RECEIVING INVENTORY</span>
        </Typography>
      </DialogTitle>

      <DialogContent className={classes.contentContainer}>
        <form
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <Typography className={classes.mainTitle}>
            Enter the product you are receiving:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <NewItem
                label={'Item Name'}
                itemValue={formState.item_value}
                setItemValue={handleItemChange}
                placeholder={"Enter the item's name"}
                inventoryOptions={InventoryOptions}
                customOptions={CustomOptions}
                emptyItemError={emptyItemError}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="number"
                label="Quantity"
                placeholder="Enter how many"
                name="quantity"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.quantity || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="text"
                label="Manufacturer"
                placeholder="Enter the manufacturers name"
                name="manufacturer"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.manufacturer || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="number"
                label="Serial Number"
                placeholder="0000"
                name="serial_number"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.serial_number || ''}
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                type="text"
                label="Lot Number"
                placeholder="Enter Lot Number"
                name="lot_number"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.lot_number || ''}
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            {formState.item_type && formState.item_type !== "Vaccine" ?
              <Grid item xs={12} sm={3} className={classes.sectionData}>
                <Typography variant="h5" className={classes.fieldKey}>
                  {'Exp. Date'}
                </Typography>
                <Typography variant="h5" className={classes.labelValue}>
                  {"00/00/0000"}
                </Typography>
              </Grid>

              :
              <Grid item xs={12} sm={3}>
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel className={classes.dateLabel}>Exp.Date</InputLabel>
                  <MuiPickersUtilsProvider utils={MomentUtils} >
                    <DatePicker
                      value={formState.exp_date || ''}
                      minDate={moment()}
                      format="MM/DD/yyyy"
                      onChange={handleDateChange}
                      className={classes.utilRoot}
                      required
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </Grid>
            }

          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={5} className={classes.tracking} onClick={handleNewTrack}>
              <AddIcon />
              <Typography >Add Tracking</Typography>
            </Grid>
          </Grid>
          {trackVisible &&
            <Grid container spacing={2} className={classes.locationRow} >
              <Grid item xs={12} sm={5} >
                <TextField
                  // type="number"
                  label="Tracking Number"
                  placeholder="Enter Tracking Number"
                  name="tracking_number"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.tracking_number || ''}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3} >
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>Carrier</InputLabel>
                  <Select
                    onChange={handleChange}
                    name="tracking_carrier"
                    displayEmpty
                    value={formState.tracking_carrier || ''}
                  >
                    <MenuItem value=''>
                      <Typography className={brandClasses.selectPlaceholder}>Pick a carrier</Typography>
                    </MenuItem>
                    <MenuItem value='FedEx'>FedEx</MenuItem>
                    <MenuItem value='UPS'>UPS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          }

          <Grid container spacing={2} className={classes.locationRow}>
            <Grid item xs={12} sm={5} >
              <Typography className={classes.mainTitle}>
                Assign to a location
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5} >
              {quantityError &&
                <Typography className={classes.error}>
                  Appears your quantity doesn’t match <br /> the receving amount. Check again.
                </Typography>
              }
            </Grid>
          </Grid>

          {formState.location_assign.map((loc, index) =>
            <Grid container spacing={2} key={index} className={classes.locationRow}>
              <Grid item xs={12} sm={5} >
                {locations
                  ?
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Location</InputLabel>
                    <Select
                      onChange={handleChangeLocation(index)}
                      // classes={{ root: classes.selectRoot, select: classes.selectRoot }}
                      label="Location"
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
              <Grid item xs={12} sm={3} >
                <TextField
                  type="number"
                  label="Quantity"
                  placeholder="Enter how many"
                  name="quantity"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChangeLocation(index)}
                  value={loc.quantity || ''}
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={quantityError}
                />
              </Grid>
            </Grid>
          )}

          <div className={classes.addLocation}>
            <Grid container spacing={1} className={classes.locationRow}>
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
                  {formState.location_assign.length > 1 && (
                    <Button variant="contained" onClick={handleRemoveLocation} className={classes.redBtn}>
                      <RemoveIcon />
                      {' REMOVE'}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={5} >
                <div className={brandClasses.footerMessage}>
                  {displaySuccess ? <Alert severity="success">{displaySuccess}</Alert> : null}
                </div>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    className={classes.blueBtn}
                    classes={{ disabled: brandClasses.buttonDisabled }}
                    disabled={loading}
                    type="submit"
                  >
                    ADD {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
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

export default connect(null, { addInventory })(AddInventory);
