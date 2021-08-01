import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Grid, Button, Box, Paper, Checkbox, Select, MenuItem,
  FormControl, FormControlLabel, Typography, IconButton,
  CircularProgress, Accordion, AccordionSummary, AccordionDetails,
  TextField, InputLabel, FilledInput
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { getStates, handleImage } from 'helpers';
import { Link, withRouter } from 'react-router-dom';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import * as qs from 'qs';
import moment from 'moment';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import MomentUtils from '@date-io/moment';
import {
  // Location,
  Edit, Delete
} from 'icons';
import { getLocation, updateLocation1, uploadImage, apiUrl, getInventoryAvailable, getInventoryCountsByLocation } from 'actions/api';
import { clearLocations } from 'actions/clear';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import ZipCodeInput from 'components/ZipCodeInput';
import NpiInput from 'components/NpiInput';
import NumberFormat from 'react-number-format';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: theme.spacing(3)
  },
  item: {
    // width: '1000px',
    // border:'solid 1px blue',
    margin: '20px auto'
  },
  itemPaper: {
    width: '100%',
    border: '0px solid #0F84A9',
    padding: '16px',
    position: 'relative',
    marginBottom: '20px',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
  },
  itemPaper2: {
    border: '1px solid #0F84A9',
    // padding: '20px',
    position: 'relative',
    marginBottom: '40px',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
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
  submitBtnOperations: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '& .MuiTypography-h5': {
      color: theme.palette.white,
      fontSize: '16px'
    }
  },
  fieldKey: {
    color: theme.palette.brandDark,
    fontWeight: 500,
  },
  completeLabel: {
    color: '#25DD83',

  },
  labelValue: {
    color: theme.palette.brandGray,
  },
  editAddressField: {
    marginTop: '10px',
    padding: theme.spacing(1),
  },
  sectionData: {
    marginTop: '10px'
  },
  operationsTitle: {
    padding: '10px 20px'
  },
  firstPropertyLabel: {
    // marginBottom: '-10px'
  },
  operationRow: {
    padding: theme.spacing(1),
    paddingLeft: '20px',
    paddingRight: '20px',
    lineHeight: '30px',
    borderBottom: `1px solid ${theme.palette.brand}`,
    fontFamily: 'Montserrat',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat',
    // '&.MuiAccordionSummary-root': {
    //   padding: '0px 20px'
    // }
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center',
    // textAlign: 'left'
  },
  accordionDetails: {
    display: 'flex',
    alignItems: 'center'
  },
  accExpanded: {
    margin: '0 !important',
    // borderBottom: '1px solid #0F84A9'
  },
  dayCheckboxChecked: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(0),
    width: 150,
    alignItems: 'center',
    display: 'flex',
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  dayCheckbox: {
    color: '#D8D8D8',
    marginLeft: theme.spacing(0),
    width: 150,
    alignItems: 'center',
    display: 'flex',
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: '#D8D8D8'
    },
    '& .MuiSvgIcon-root': {
      color: '#0f84a959'
    }
  },
  daySlotCheckbox: {
    color: '#0f84a959',
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: '#0f84a959'
    }
  },
  daySlotCheckboxhecked: {
    color: theme.palette.brandDark,
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  timeText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    '& p': {
      color: theme.palette.blueDark,
      fontSize: '16px',
      fontWeight: 500
    }
  },
  stationsText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    marginRight: theme.spacing(2)
  },
  stationSelect: {
    '& .MuiOutlinedInput-input': {
      padding: '6px 10px !important',
      marginRight: 17,
      width: 42,
      textAlign: 'center',
    },
    '& .MuiSelect-icon': {
      // width: 21%;
      height: '100%',
      borderRadius: '0 10px 10px 0',
      // backgroundColor: theme.palette.brandDark,
      right: 0,
      top: 'auto'
    },
    '& p': {
      color: '#9B9B9B'
    },
  },
  timeField: {
    '& input': {
      color: theme.palette.brandDark,
      width: '115px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark
    }
  },
  textAlignCenter: {
    textAlign: 'left',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    }
  },
  dayHeaderRow: {
    backgroundColor: theme.palette.brandDark,
    color: theme.palette.white,
    textAlign: 'left',
    fontFamily: 'Montserrat',
    fontWeight: '500'
  },
  marginLeft: {
    marginLeft: '50px !important'
  },
  buttonRed: {
    color: '#DD2525 !important',
    borderColor: '#DD2525 !important'
  },
  actionButtonRow: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    '& div': {
      display: 'flex',
      alignItems: 'center'
    }
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
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(3),
  },
  operationContainer: {
    border: 'solid #0F84A9 1px',
    borderRadius: '10px',
    boxShadow: '6.35934px 2.54374px 11.4468px 2.54374px rgba(4, 59, 93, 0.15)',
    padding: '12px 0 12px'
  },
  operationTimes: {
    // font-family: Montserrat;
    // font-style: normal;
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: '27px',
    color: '#0F84A9',
    margin: '0 0 12px 32px'
  },
  operationHeader: {
    fontFamily: 'Montserrat',
    background: '#87C1D4', color: 'white', fontSize: '20px', lineHeight: '29px', padding: '8px 32px'
  },
  filledInputRoot: {
    background: '#FFFFFF',
    border: '1px solid #D8D8D8',
    boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    marginBottom: '8px',
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&::before': {
      borderBottom: 'none'
    },
    '&:hover': {
      borderBottom: '1px solid #D8D8D8',
      background: '#FFFFFF',
      '&::before': {
        borderBottom: 'none'
      },
    },
    '& input': {
      padding: '5px 8px',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: '14px',
      '&:focus': {
        background: '#FFFFFF',
        borderRadius: '5px',
        '&::before': {
          borderBottom: 'none'
        },
      },
      '&:hover': {
        // borderBottom:'none',
        // background: '#FFFFFF',
      },
    }
  },
  filledInputRootChecked: {
    background: '#FFFFFF',
    border: '1px solid #043B5D',
    boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    marginBottom: '8px',
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&::before': {
      borderBottom: 'none'
    },
    '&:hover': {
      borderBottom: '1px solid #043B5D',
      background: '#FFFFFF',
      '&::before': {
        borderBottom: 'none'
      },
    },
    '& input': {
      padding: '5px 8px',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: '14px',
      '&:focus': {
        background: '#FFFFFF',
        borderRadius: '5px',
        '&::before': {
          borderBottom: 'none'
        },
      },
      '&:hover': {
        // borderBottom:'none',
        // background: '#FFFFFF',
      },
    }
  },
  timeDuration: {
    color: theme.palette.brandDark,
    display: 'flex',
    alignItems: 'center'
    // padding: theme.spacing(1),
  },
  slotSubHeader: {
    marginLeft: '30px',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#D8D8D8',//'#043B5D',
    fontWeight: 600,
    textAlign: 'center',
  },
  slotSubHeaderChecked: {
    marginLeft: '30px',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#043B5D',
    fontWeight: 600,
    textAlign: 'center',
  },
  filledInputRootError: {
    background: '#FFFFFF',
    border: '1px solid #e53935',
    boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
    borderRadius: '5px',
    marginBottom: '8px',
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&::before': {
      borderBottom: 'none'
    },
    '&:hover': {
      borderBottom: '1px solid #043B5D',
      background: '#FFFFFF',
      '&::before': {
        borderBottom: 'none'
      },
    },
    '& input': {
      padding: '5px 8px',
      textAlign: 'center',
      fontFamily: 'Montserrat',
      fontSize: '14px',
      '&:focus': {
        background: '#FFFFFF',
        borderRadius: '5px',
        '&::before': {
          borderBottom: 'none'
        },
      },
      '&:hover': {
        // borderBottom:'none',
        // background: '#FFFFFF',
      },
    }
  },
  daySlotCheckboxError: {
    color: '#e53935',
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: '#e53935'
    }
  },
  slotSubHeaderError: {
    marginLeft: '30px',
    fontSize: '10px',
    lineHeight: '12px',
    color: '#DD2525;',
    fontWeight: 600,
    textAlign: 'center',
  },
  slotSubHeaderErrorContent: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    color: '#DD2525'
  },
  dayRow: {
    width: 200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
}));

const ActiveButton = withStyles(theme => ({
  root: {
    color: '#25DD83',
    borderColor: '#25DD83',
    borderRadius: 20,
    textTransform: 'Capitalize',
    fontSize: '26px',
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: '35px',
    '&:hover': {},
    [theme.breakpoints.up('lg')]: {
      fontSize: '26px'
    },
    [theme.breakpoints.between('sm', 'lg')]: {
      fontSize: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    }
  }
}))(Button);

const startTime = '09:00';
const endTime = '10:00';

const OperationValuesInit = [
  {
    day_name: 'Monday',
    active: false,
    day_number: 1,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
  {
    day_name: 'Tuesday',
    active: false,
    day_number: 2,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
  {
    day_name: 'Wednesday',
    active: false,
    day_number: 3,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
  {
    day_name: 'Thursday',
    active: false,
    day_number: 4,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
  {
    day_name: 'Friday',
    active: false,
    day_number: 5,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
  {
    day_name: 'Saturday',
    active: false,
    day_number: 6,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
  {
    day_name: 'Sunday',
    active: false,
    day_number: 0,
    edit: false,
    time_slots: [
      {
        edit: false,
        checked: false,
        start_time: startTime,
        end_time: endTime,
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
];

let OperationErrorsInit = [...Array(7)].map((e) => (
  {
    error: false,
    timeSlotError: [
      {
        vaccine: false,
        pcr: false,
        antigen: false,
        error: null,
      }
    ]
  }
));

const LocationDetails = props => {
  const { history, location, getLocation, updateLocation1, uploadImage, clearLocations, getInventoryAvailable, getInventoryCountsByLocation } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [formState, setFormState] = useState({ provider: {} });
  const [imgState, setImgState] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [editSection, setEditSection] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [timeSlotError, setTimeSlotError] = useState(null);
  const [displayError, setDisplayError] = useState(null);

  const [inventory, setInventory] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [inventoryError, setInventoryError] = useState(null);
  const [locationAllocatedCounts, setLocationAllocatedCounts] = useState({ vaccine: 0, pcr: 0, antigen: 0 });
  const [inventoryCount, setInventoryCount] = useState({ vaccine: 0, pcr: 0, antigen: 0 });

  const [operationState, setOperationState] = useState([...OperationValuesInit]);
  const [operationErrorsState, setOperationErrorsState] = useState(JSON.parse(JSON.stringify(OperationErrorsInit)));
  const [inventoryAvailableCount, setInventoryAvailableCount] = useState({ vaccine: 0, antigen: 0, pcr: 0 });
  const [tempInventoryCount, setTempInventoryCount] = useState({ vaccine: 0, pcr: 0, antigen: 0 });
  const [recalculate, setRecalculate] = useState(0);
  const [refetchLocation, setRefetchLocation] = useState(0);

  const locationId = qs.parse(location.search, { ignoreQueryPrefix: true }).location_id;

  useEffect(() => {
    if (locationId) {
      setSelectedInventory([]);
      async function fetchData() {
        const res = await getLocation(locationId);
        setFetchLoading(false);
        if (res.success) {
          if (res.data) {
            if (res.data.hours_of_operations && res.data.hours_of_operations.length) {
              // set operations
              setOperationState(JSON.parse(JSON.stringify((res.data.hours_of_operations))));
              // add inventory values
              let vaccine = 0, pcr = 0, antigen = 0;
              res.data.hours_of_operations.forEach((o) => {
                vaccine += o.time_slots.filter(ts => ts.checked && ts.vaccine.checked).reduce((sum, ts) => sum + ts.vaccine.value, 0);
                pcr += o.time_slots.filter(ts => ts.checked && ts.pcr.checked).reduce((sum, ts) => sum + ts.pcr.value, 0);
                antigen += o.time_slots.filter(ts => ts.checked && ts.antigen.checked).reduce((sum, ts) => sum + ts.antigen.value, 0);
              });
              setLocationAllocatedCounts({ vaccine, pcr, antigen });
              // set errors
              let operationErrors = res.data.hours_of_operations.map((o) => ({
                error: false,
                timeSlotError: o.time_slots.map((ts) => ({
                  vaccine: false,
                  pcr: false,
                  antigen: false,
                  error: null,
                })),
              }));
              OperationErrorsInit = operationErrors;
              setOperationErrorsState(operationErrors);
            } else {
              res.data.hours_of_operations = OperationValuesInit;
            }
            setFormState(formState => ({ ...formState, ...res.data }));
            // set location data
            setLocationDetails(res.data);
            // fetch inventory
            let invRes = await getInventoryAvailable();
            if (invRes.success) {
              setInventory(invRes.data);
            }
            // fetch assigned inventory counts
            const icRes = await getInventoryCountsByLocation(locationId);
            if (icRes.success) {
              setInventoryCount(icRes.data);
            }
          } else {
            setAlertMessage('Location ID is Invalid.');
          }
        }
      }
      fetchData();
    } else {
      setFetchLoading(false);
      setAlertMessage('Location ID is missing in Params');
    }
    // eslint-disable-next-line
  }, [locationId, refetchLocation]);

  useEffect(() => {
    if (!locationDetails) return;
    // calculation
    let vaccineInputCount = 0, pcrInputCount = 0, antigenInputCount = 0;
    // JSON parse stringify - to create a copy of object
    let operationErrors = JSON.parse(JSON.stringify(OperationErrorsInit));
    setOperationErrorsState(operationErrors);
    operationState.forEach((o, di) => {
      // get sum of types
      vaccineInputCount += o.time_slots.filter(ts => ts.checked && ts.vaccine.checked).reduce((sum, ts) => sum + ts.vaccine.value, 0);
      pcrInputCount += o.time_slots.filter(ts => ts.checked && ts.pcr.checked).reduce((sum, ts) => sum + ts.pcr.value, 0);
      antigenInputCount += o.time_slots.filter(ts => ts.checked && ts.antigen.checked).reduce((sum, ts) => sum + ts.antigen.value, 0);
      // check for checked
      o.time_slots.forEach((ts, cei) => {
        if (ts.checked && (!ts.antigen.checked && !ts.pcr.checked && !ts.vaccine.checked)) {
          operationErrors[di].error = true;
          operationErrors[di].timeSlotError[cei].vaccine = true;
          operationErrors[di].timeSlotError[cei].pcr = true;
          operationErrors[di].timeSlotError[cei].antigen = true;
          operationErrors[di].timeSlotError[cei].error = 'You must check one and input number of slots';
          setOperationErrorsState([...operationErrors]);
        }
      });
      // not required to check value, as the value will be reduced to 0 once all schedules are done
      // check for value
      // o.time_slots.forEach((ts, vei) => {
      //   if (ts.checked && ((ts.vaccine.checked && ts.vaccine.value === 0) || (ts.pcr.checked && ts.pcr.value === 0) || (ts.antigen.checked && ts.antigen.value === 0))) {
      //     operationErrors[di].error = true;
      //     operationErrors[di].timeSlotError[vei].error = 'Please enter value.';
      //     // check vaccine 
      //     if (o.time_slots[vei].vaccine.checked && o.time_slots[vei].vaccine.value === 0)
      //       operationErrors[di].timeSlotError[vei].vaccine = true;
      //     // check pcr 
      //     if (o.time_slots[vei].pcr.checked && o.time_slots[vei].pcr.value === 0)
      //       operationErrors[di].timeSlotError[vei].pcr = true;
      //     // check antigen 
      //     if (o.time_slots[vei].antigen.checked && o.time_slots[vei].antigen.value === 0)
      //       operationErrors[di].timeSlotError[vei].antigen = true;
      //     setOperationErrorsState([...operationErrors]);
      //   }
      // });
    });
    // minus from available inventory
    setInventoryAvailableCount({
      vaccine: tempInventoryCount.vaccine - vaccineInputCount,
      pcr: tempInventoryCount.pcr - pcrInputCount,
      antigen: tempInventoryCount.antigen - antigenInputCount
    });
    // eslint-disable-next-line
  }, [operationState, recalculate]);

  useEffect(() => {
    // if (!selectedInventory.length) {
    //   return setInventoryError('Please Select Inventory');
    // }
    if (inventoryAvailableCount.vaccine < 0) {
      return setInventoryError(`Vaccine insufficient`);
    }
    if (inventoryAvailableCount.pcr < 0) {
      return setInventoryError(`PCR insufficient`);
    }
    if (inventoryAvailableCount.antigen < 0) {
      return setInventoryError(`Antigen insufficient`);
    }
    // if no errors
    setInventoryError(null);
    // eslint-disable-next-line
  }, [inventoryAvailableCount]);

  useEffect(() => {
    let vaccine = inventoryCount.vaccine, pcr = inventoryCount.pcr, antigen = inventoryCount.antigen;
    if (selectedInventory.length) {
      vaccine += selectedInventory.filter(i => i.item_type === 'Vaccine').reduce((sum, i) => sum + i.remaining_quantity, 0);
      pcr += selectedInventory.filter(i => i.item_type === 'PCR' || i.item_type === 'Saliva').reduce((sum, i) => sum + i.remaining_quantity, 0);
      antigen += selectedInventory.filter(i => i.item_type === 'Rapid').reduce((sum, i) => sum + i.remaining_quantity, 0);
      setInventoryAvailableCount({ vaccine, pcr, antigen });
      setTempInventoryCount({ vaccine, pcr, antigen });
      setInventoryError(null);
      setRecalculate(recalculate => recalculate + 1);
    } else {
      setInventoryAvailableCount({ vaccine, antigen, pcr });
      setTempInventoryCount({ vaccine, antigen, pcr });
      setInventoryError('Please Select Inventory');
      setRecalculate(recalculate => recalculate + 1);
    }
    // eslint-disable-next-line
  }, [selectedInventory, inventoryCount]);

  const goBack = () => {
    history.goBack();
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const handleInventoryChange = (e, values) => {
    setSelectedInventory(values);
  };

  const handleEdit = (field, isEditing) => {
    let fieldEdit = {};
    fieldEdit[field] = isEditing;
    setEditSection(fieldEdit);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAlertDialogMessage('');
  };

  const toggleLocationStatus = body => {
    modifyLocation(body);
  };

  const handleAccordianChange = index => (event, isExpanded) => {
    setExpanded(isExpanded ? `panel${index}` : false);
    // if (isExpanded) {
    //   let operations = [...operationState];
    //   operations[index].active = true;
    //   operations[index].time_slots[0].checked = true;
    //   setOperationState(operations);
    // }
  };

  const handlePhotoChange = event => {
    handleImage(event, setAlertDialogMessage, setImgState, setImgCompressionLoading, setDialogOpen);
  }

  const SaveButton = () => {
    return (
      <Button
        className={brandClasses.button}
        classes={{ disabled: brandClasses.buttonDisabled }}
        style={{ marginTop: 16, float: 'right' }}
        disabled={saveLoading}
        type="submit"
      >
        Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
      </Button>
    );
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleProviderChange = e => {
    e.persist();
    let temp = formState.provider;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleHoursCheckChange = (index, slot_index) => event => {
    event.persist();
    let operations = [...operationState];
    // make time slot checked/unchecked
    operations[index].time_slots[slot_index].checked = event.target.checked;
    // to make day as active/inactive
    let isActiveArray = operations[index].time_slots.filter(e => e.checked === true);
    operations[index].active = isActiveArray.length ? true : false;
    setOperationState(operations);
  };

  const handleTimeSlotEdit = (index, slot_index, value) => {
    let operations = [...operationState];
    operations[index].time_slots[slot_index].edit = value;
    setOperationState(operations);
  };

  const handleClosedChange = index => event => {
    event.persist();
    let operations = [...operationState];
    operations[index].active = !event.target.checked;
    setOperationState(operations);
  };

  const addNewTimeSlot = index => event => {
    event.preventDefault();
    let operations = [...operationState];
    let last_time = operations[index].time_slots.length ? operations[index].time_slots[operations[index].time_slots.length - 1].end_time : '09:00';
    operations[index].time_slots.push({
      start_time: moment(last_time, 'HH:mm').format('HH:mm'),
      end_time: moment(last_time, 'HH:mm').add(1, 'hours').format('HH:mm'),
      edit: false,
      checked: false,
      vaccine: { checked: false, value: 0 },
      pcr: { checked: false, value: 0 },
      antigen: { checked: false, value: 0 },
      time_slot_difference: 10,
    });
    setOperationState(operations);
    // add for errors
    let operationErrors = [...operationErrorsState];
    operationErrors[index].timeSlotError.push({
      vaccine: false,
      pcr: false,
      antigen: false,
      error: null,
    });
    setOperationErrorsState([...operationErrors]);
    OperationErrorsInit[index].timeSlotError.push({
      vaccine: false,
      pcr: false,
      antigen: false,
      error: null,
    });
  };

  const handleTimeSlotDelete = (index, slot_index) => {
    let operations = [...operationState];
    operations[index].time_slots.splice(slot_index, 1);
    setOperationState(operations);
    // remove for errors
    let operationErrors = [...operationErrorsState];
    operationErrors[index].timeSlotError.splice(slot_index, 1);
    setOperationErrorsState([...operationErrors]);
    OperationErrorsInit[index].timeSlotError.splice(slot_index, 1);
  };

  const handleStartTimeChange = (index, slot_index) => (date) => {
    setTimeSlotError(null);
    let checkduplicate = false;
    let operations = [...operationState];
    // operations[index].time_slots[slot_index].displayStartTime = date;
    for (let i = 0; i < operations[index].time_slots.length; i++) {
      if (i !== slot_index) {
        if (operations[index].time_slots[i].start_time === moment(date).format('HH:mm')) {
          checkduplicate = true;
          setTimeSlotError("Start Time already exists");
          return;
        } else if (moment(date).format('HH:mm') <= operations[index].time_slots[i].end_time && moment(date).format('HH:mm') >= operations[index].time_slots[i].start_time) {
          setTimeSlotError("Start Time  is in between selected slots ");
          return;
        } else {
          checkduplicate = false
        }
      }
    }
    if (!checkduplicate) { // moment(date).toString()
      operations[index].time_slots[slot_index].start_time = moment(date).format('HH:mm');
      setOperationState(operations);
    }
  };

  const handleEndTimeChange = (index, slot_index) => (date) => {
    setTimeSlotError(null);
    let checkduplicate = false
    let operations = [...operationState];
    // operations[index].time_slots[slot_index].displayEndTime = date; 
    for (let i = 0; i < operations[index].time_slots.length; i++) {
      if (i !== slot_index) {
        if (operations[index].time_slots[i].end_time === moment(date).format('HH:mm')) {
          checkduplicate = true;
          setTimeSlotError("End Time already exists");
          return;
        } else if (moment(date).format('HH:mm') <= operations[index].time_slots[i].end_time && moment(date).format('HH:mm') >= operations[index].time_slots[i].start_time) {
          setTimeSlotError("Start Time and End Time is in between selected slots ");
          return;
        } else {
          checkduplicate = false
        }
      }
    }
    if (!checkduplicate) {
      operations[index].time_slots[slot_index].end_time = moment(date).format('HH:mm');
      setOperationState(operations);
    }
  };

  const handleSlotTypeCheckbox = (index, slot_index, type) => event => {
    event.persist();
    let operations = [...operationState];
    operations[index].time_slots[slot_index][type].checked = event.target.checked;
    setOperationState(operations);
  };

  const handleSlotTypeInput = (index, slot_index, type) => event => {
    event.persist();
    if (!isNaN(event.target.value)) {
      let operations = [...operationState];
      if (!event.target.value) {
        operations[index].time_slots[slot_index][type].value = 0;
      } else {
        operations[index].time_slots[slot_index][type].value = parseInt(event.target.value);
      }
      setOperationState(operations);
    }
  };

  const handleSlotDifferenceChange = (index, slot_index) => event => {
    event.persist();
    let operations = [...operationState];
    operations[index].time_slots[slot_index].time_slot_difference = event.target.value;
    setOperationState(operations);
  };

  const keyToObject = (key) => {
    switch (key) {
      case 'name':
        return { name: formState.name };
      case 'phone':
        return { phone: formState.phone };
      case 'address':
        return {
          address: formState.address,
          address2: formState.address2,
          city: formState.city,
          state: formState.state,
          zip_code: formState.zip_code,
          county: formState.county,
        };
      case 'admin_contact':
        return {
          admin_first_name: formState.admin_first_name,
          admin_last_name: formState.admin_last_name,
          admin_office_phone: formState.admin_office_phone,
          admin_office_ext: formState.admin_office_ext,
          admin_email: formState.admin_email
        };
      case 'provider':
        return {
          provider: {
            first_name: formState.provider.first_name,
            last_name: formState.provider.last_name,
            npi: formState.provider.npi,
            phone: formState.provider.phone,
            email: formState.provider.email,
            address: formState.provider.address,
            address2: formState.provider.address2,
            city: formState.provider.city,
            state: formState.provider.state,
            zip_code: formState.provider.zip_code,
          }
        };
      case 'eoc_details':
        return {
          eoc_first_name: formState.eoc_first_name,
          eoc_last_name: formState.eoc_last_name,
          eoc_office_phone: formState.eoc_office_phone,
          eoc_ext: formState.eoc_ext,
          eoc_email: formState.eoc_email
        };
      case 'site_logo':
        return { site_logo: formState.site_logo };
      case 'operations':
        return { operations: formState.operations };
      case 'hours_of_operations':
        return {
          hours_of_operations: operationState,
          inventory_ids: selectedInventory.map(i => i._id),
        };
      // case 'is_healthcare_related':
      //   return { is_healthcare_related: formState.is_healthcare_related };
      // case 'is_resident_congregate_setting':
      //   return { is_resident_congregate_setting: formState.is_resident_congregate_setting };
      default:
        return;
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    let key = Object.keys(editSection)[0];
    let body = keyToObject(key);
    if (key === 'site_logo') {
      if (imgState.imagePath) {
        setSaveLoading(true);
        const locationLogoData = new FormData();
        locationLogoData.append('uploadImage', imgState.imagePath);
        const resLocationLogo = await uploadImage(locationLogoData);
        setSaveLoading(false);
        if (resLocationLogo.success) {
          body.site_logo = '/images/' + resLocationLogo.data;
          modifyLocation(body);
        }
      } else {
        setEditSection({});
      }
    } else if (key === 'hours_of_operations') {
      if (inventoryError) {
        setDisplayError('Please check the inventory errors');
        return;
      }
      if (timeSlotError) {
        setDisplayError('Please check all time slots for overlap of timings.');
        return;
      }
      if (operationErrorsState.some(e => e.error)) {
        setDisplayError('Please check all time slots for any errors');
        return;
      }
      modifyLocation(body);
    } else {
      modifyLocation(body);
    }
  };

  const modifyLocation = async (body) => {
    setSaveLoading(true);
    const res = await updateLocation1(locationDetails._id, body);
    setSaveLoading(false);
    if (res.success) {
      clearLocations();
      setEditSection({});
      setRefetchLocation(refetchLocation => refetchLocation + 1);
    }
  };

  return (
    <div className={classes.root}>
      {fetchLoading
        ? <CircularProgress />
        : locationDetails
          ?
          <div>
            <div className={classes.header} >
              <div className={classes.subHeader}>
                <img src="/images/svg/building_icon.svg" alt="" />&ensp;
                <Typography variant="h2" className={brandClasses.headerTitle}>
                  {'LOCATION MANAGER |'}
                </Typography>
                <Typography variant="h4" className={classes.headerSubTitle}>
                  {formState.name || ''}
                  {/* <sup>
                    {' '}
                    <Tooltip title="Edit Locaition" placement="right-start">
                      <HelpIcon />
                    </Tooltip>{' '}
                  </sup> */}
                </Typography>
              </div>
              <Button
                variant="contained"
                className={classes.greenBtn}
                startIcon={<AddIcon />}
                component={Link}
                to="/site-manager/add-location">
                {'ADD LOCATION'}
              </Button>
            </div>

            <div className={classes.item}>

              {/* ----------- Location details ----------- */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3} container >
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          {'Location Name'}
                        </Typography>

                        <Grid item>
                          {editSection.name
                            ?
                            <IconButton onClick={() => handleEdit('name', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('name', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.name
                          ?
                          <Grid item xs>
                            <TextField
                              type="text"
                              label="Location Name"
                              placeholder="Enter location"
                              name="name"
                              className={brandClasses.shrinkTextField}
                              onChange={handleChange}
                              value={formState.name || ''}
                              required
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                            />
                            <SaveButton />
                          </Grid>
                          :

                          <Typography variant="h5" className={classes.labelValue}>
                            {locationDetails.name}
                          </Typography>

                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4} container >
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12} >
                          <div >
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Location Phone Number'}
                              </Typography>
                              <Grid item>
                                {editSection.phone
                                  ?
                                  <IconButton onClick={() => handleEdit('phone', false)}>
                                    <CancelOutlinedIcon />
                                  </IconButton>
                                  :
                                  <IconButton onClick={() => handleEdit('phone', true)}>
                                    <Edit className={classes.editIcon} />
                                  </IconButton>
                                }
                              </Grid>
                            </Grid>
                            {editSection.phone ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
                                  <NumberFormat
                                    customInput={TextField}
                                    mask=" "
                                    type="tel"
                                    label="Admin Office Phone"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.phone || ''}
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container justify="flex-start" alignItems="center">
                                <Grid container>
                                  <Grid>
                                    <Typography variant="h5" className={classes.labelValue}>
                                      {locationDetails.phone}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </div>
                        </Grid>
                        {editSection.phone && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={5} container direction="column" justify="center" alignItems="center">
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <Grid container alignItems="baseline" justify="space-between">
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Address'}
                            </Typography>
                            <Grid item>
                              {editSection.address ? (
                                <IconButton onClick={() => handleEdit('address', false)}>
                                  <CancelOutlinedIcon />
                                </IconButton>
                              ) : (
                                <IconButton onClick={() => handleEdit('address', true)}>
                                  <Edit className={classes.editIcon} />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                          {editSection.address ? (
                            <Grid container item className={classes.editAddressField} spacing={1}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Address"
                                  placeholder="Enter address"
                                  name="address"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleChange}
                                  value={formState.address || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Address 2"
                                  placeholder="Enter apt, suite, floor, etc"
                                  name="address2"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleChange}
                                  value={formState.address2 || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.address}, {locationDetails.address2}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={3} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'City'}
                          </Typography>
                          {editSection.address ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="City"
                                  placeholder="Enter city"
                                  name="city"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleChange}
                                  value={formState.city || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.city}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={3} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'State'}
                          </Typography>
                          {editSection.address ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <FormControl
                                  className={brandClasses.shrinkTextField}
                                  required
                                  fullWidth
                                  variant="outlined"
                                >
                                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>State</InputLabel>
                                  <Select
                                    onChange={handleChange}
                                    label="State* "
                                    name="state"
                                    displayEmpty
                                    value={formState.state || ''}
                                  >
                                    <MenuItem value=''>
                                      <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                                    </MenuItem>
                                    {getStates.map((state, index) => (
                                      <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.state}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <div className={classes.sectionData}>
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Zip Code'}
                            </Typography>
                            {editSection.address ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
                                  <ZipCodeInput
                                    label="Zip Code"
                                    placeholder="Enter zip"
                                    name="zip_code"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.zip_code || ''}
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    style={{ height: 52 }}
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.zip_code}
                              </Typography>
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <div className={classes.sectionData}>
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'County'}
                            </Typography>
                            {editSection.address ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
                                  <TextField
                                    type="text"
                                    label="County"
                                    placeholder="Enter County"
                                    name="county"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.county || ''}
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.county}
                              </Typography>
                            )}
                          </div>
                        </Grid>
                        {editSection.address && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                </Grid>
              </Grid>

              <hr style={{ borderTop: '1px solid #83C1D5' }}></hr>

              {/* ----------- Vaccine details ----------- */}
              <Grid item xs={12} className={classes.sectionData} style={{ paddingLeft: 16 }}>
                <Grid container alignItems="center" justify="space-between" spacing={2}>
                  <Grid item sm={4}>
                    <Typography variant="h5" className={classes.fieldKey}>
                      {'Vaccine'}
                    </Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant="h5" className={classes.fieldKey}>
                      {'PCR'}
                    </Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant="h5" className={classes.fieldKey}>
                      {'Antigen'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.sectionData} style={{ paddingLeft: 16 }}>
                <Grid container alignItems="center" justify="space-between" spacing={2}>
                  <Grid item sm={4}>
                    <Typography variant="h5" className={classes.labelValue}>
                      {locationAllocatedCounts.vaccine}
                    </Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant="h5" className={classes.labelValue}>
                      {locationAllocatedCounts.pcr}
                    </Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant="h5" className={classes.labelValue}>
                      {locationAllocatedCounts.antigen}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <hr style={{ borderTop: '1px solid #83C1D5', marginTop: '10px' }}></hr>

              <Grid container spacing={3}>
                {/* ----------- Administrator Contract ----------- */}
                <Grid item xs={12} sm={4} container >
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <Grid container alignItems="baseline" justify="space-between">
                            <Typography variant="h5" className={classes.fieldKey}>
                              {'Administrator Contact'}
                            </Typography>
                            <Grid item>
                              {editSection.admin_contact
                                ?
                                <IconButton onClick={() => handleEdit('admin_contact', false)}>
                                  <CancelOutlinedIcon />
                                </IconButton>
                                :
                                <IconButton onClick={() => handleEdit('admin_contact', true)}>
                                  <Edit className={classes.editIcon} />
                                </IconButton>
                              }
                            </Grid>
                          </Grid>
                          {editSection.admin_contact ? (
                            <Grid container item spacing={1}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="First Name"
                                  placeholder="Enter first name"
                                  name="admin_first_name"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleChange}
                                  value={formState.admin_first_name || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Last Name"
                                  placeholder="Enter last name"
                                  name="admin_last_name"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleChange}
                                  value={formState.admin_last_name || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {formState.admin_first_name} {formState.admin_last_name}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div >
                            <Grid container alignItems="center" justify="space-between" spacing={2}>
                              <Grid item xs={12} sm={8}>
                                <Typography variant="h5" className={classes.fieldKey}>
                                  {'Phone Number'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="h5" className={classes.fieldKey}>
                                  {'Ext.'}
                                </Typography>
                              </Grid>
                            </Grid>
                            {editSection.admin_contact ? (
                              <Grid container item spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <NumberFormat
                                    customInput={TextField}
                                    mask=" "
                                    type="tel"
                                    label="Admin Office Phone"
                                    placeholder="(000) 000-0000"
                                    name="admin_office_phone"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.admin_office_phone || ''}
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    type="text"
                                    label="Ext."
                                    placeholder="Enter Ext"
                                    name="admin_office_ext"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.admin_office_ext || ''}
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container justify="flex-start" alignItems="center">
                                <Grid container spacing={2}>
                                  <Grid item sm={8}>
                                    <Typography variant="h5" className={classes.labelValue}>
                                      {formState.admin_office_phone}
                                    </Typography>
                                  </Grid>
                                  <Grid item sm={4}>
                                    <Typography variant="h5" className={classes.labelValue}>
                                      {formState.admin_office_ext || '<0000>'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </div>
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div>
                            <Grid container alignItems="center" justify="space-between" spacing={2}>
                              <Grid item>
                                <Typography variant="h5" className={classes.fieldKey}>
                                  {'Email address'}
                                </Typography>
                              </Grid>
                            </Grid>
                            {editSection.admin_contact ? (
                              <Grid container item spacing={2}>
                                <Grid item xs>
                                  <TextField
                                    type="email"
                                    label="Email"
                                    placeholder="Enter email address"
                                    name="admin_email"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.admin_email || ''}
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {formState.admin_email}
                              </Typography>
                            )}
                          </div>
                        </Grid>
                        {editSection.admin_contact && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>
                </Grid>

                {/* ----------- Provider Contract ----------- */}
                <Grid item xs={12} sm={8}>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey} >
                            {'Provider Name'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField} spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  type="text"
                                  label="Provider Last Name"
                                  placeholder="Enter provider’s last name"
                                  name="last_name"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.last_name || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  type="text"
                                  label="Provider First Name"
                                  placeholder="Enter provider’s first name"
                                  name="first_name"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.first_name || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue} style={{ paddingTop: '8px' }}>
                              {locationDetails.provider && locationDetails.provider.last_name} &nbsp;
                              {locationDetails.provider && locationDetails.provider.first_name}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey} style={{ paddingBottom: '8px' }}>
                            {'NPI'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <NpiInput
                                  label="NPI"
                                  placeholder="Enter NPI"
                                  name="npi"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.npi || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.npi}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h5" className={classes.fieldKey} style={{ paddingBottom: '8px' }}>
                              {'Phone Number'}
                            </Typography>
                            {editSection.provider
                              ?
                              <IconButton onClick={() => handleEdit('provider', false)} style={{ padding: 0 }}>
                                <CancelOutlinedIcon />
                              </IconButton>
                              :
                              <IconButton onClick={() => handleEdit('provider', true)} style={{ padding: 0 }}>
                                <Edit className={classes.editIcon} />
                              </IconButton>
                            }
                          </div>

                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <NumberFormat
                                  customInput={TextField}
                                  mask=" "
                                  type="tel"
                                  label="Phone"
                                  placeholder="Enter phone number"
                                  name="phone"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.phone || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.phone}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'Email Address'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Email Address"
                                  placeholder="Enter email"
                                  name="email"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.email || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.email}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={8} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'Address'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField} spacing={1}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Address"
                                  placeholder="Enter address"
                                  name="address"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.address || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="Address 2"
                                  placeholder="Enter apt, suite, floor, etc"
                                  name="address2"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.address2 || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && `${locationDetails.provider.address}, ${locationDetails.provider.address2}`}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'City'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <TextField
                                  type="text"
                                  label="City"
                                  placeholder="Enter city"
                                  name="city"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.city || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.city}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'State'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <FormControl
                                  className={brandClasses.shrinkTextField}
                                  required
                                  fullWidth
                                  variant="outlined"
                                >
                                  <InputLabel shrink className={brandClasses.selectShrinkLabel}>State</InputLabel>
                                  <Select
                                    onChange={handleProviderChange}
                                    label="State* "
                                    name="state"
                                    displayEmpty
                                    value={formState.provider.state || ''}
                                  >
                                    <MenuItem value=''>
                                      <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                                    </MenuItem>
                                    {getStates.map((state, index) => (
                                      <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.state}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.sectionData}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'Zip Code'}
                          </Typography>
                          {editSection.provider ? (
                            <Grid container item className={classes.editAddressField}>
                              <Grid item xs>
                                <ZipCodeInput
                                  label="Zip Code"
                                  placeholder="Enter zip code"
                                  name="zip_code"
                                  className={brandClasses.shrinkTextField}
                                  onChange={handleProviderChange}
                                  value={formState.provider.zip_code || ''}
                                  required
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography variant="h5" className={classes.labelValue}>
                              {locationDetails.provider && locationDetails.provider.zip_code}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      {editSection.provider && (
                        <Grid item xs={12}>
                          <SaveButton />
                        </Grid>
                      )}
                    </form>
                  </Paper>

                </Grid>

              </Grid>

              {/* ----------- EOC Contract ----------- */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4} container >
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="flex-start">
                        <Grid item xs={12}>
                          <div>
                            <Grid container alignItems="baseline" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'EOC Contact'}
                              </Typography>
                              <Grid item>
                                {editSection.eoc_details
                                  ?
                                  <IconButton onClick={() => handleEdit('eoc_details', false)}>
                                    <CancelOutlinedIcon />
                                  </IconButton>
                                  :
                                  <IconButton onClick={() => handleEdit('eoc_details', true)}>
                                    <Edit className={classes.editIcon} />
                                  </IconButton>
                                }
                              </Grid>
                            </Grid>
                            {editSection.eoc_details ? (
                              <Grid container item className={classes.editAddressField} spacing={1}>
                                <Grid item xs>
                                  <TextField
                                    type="text"
                                    label="EOC First Name"
                                    placeholder="Enter first name"
                                    name="eoc_first_name"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.eoc_first_name || ''}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs>
                                  <TextField
                                    type="text"
                                    label="EOC Last Name"
                                    placeholder="Enter last name"
                                    name="eoc_last_name"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.eoc_last_name || ''}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.eoc_first_name} {locationDetails.eoc_last_name}
                              </Typography>
                            )}
                          </div>
                        </Grid>

                        <Grid item xs={12}>
                          <div className={classes.sectionData}>
                            <Grid container alignItems="center" justify="space-between" spacing={2}>
                              <Grid item xs={12} sm={8}>
                                <Typography variant="h5" className={classes.fieldKey}>
                                  {'Phone Number'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Typography variant="h5" className={classes.fieldKey}>
                                  {'Ext.'}
                                </Typography>
                              </Grid>

                            </Grid>
                            {editSection.eoc_details ? (
                              <Grid container item className={classes.editAddressField} spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <NumberFormat
                                    customInput={TextField}
                                    mask=" "
                                    type="tel"
                                    label="EOC Office Phone"
                                    placeholder="Enter phone number"
                                    name="eoc_office_phone"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.eoc_office_phone || ''}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    type="text"
                                    label="EOC Ext"
                                    placeholder="Enter ext"
                                    name="eoc_ext"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.eoc_ext || ''}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container justify="flex-start" alignItems="center">
                                <Grid container spacing={2}>
                                  <Grid item sm={8}>
                                    <Typography variant="h5" className={classes.labelValue}>
                                      {locationDetails.eoc_office_phone}
                                    </Typography>
                                  </Grid>
                                  <Grid item sm={4}>
                                    <Typography variant="h5" className={classes.labelValue}>
                                      {formState.eoc_ext || '<0000>'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </div>
                        </Grid>

                        <Grid item xs={12} className={classes.sectionData}>
                          <div>
                            <Grid container alignItems="center" justify="space-between">
                              <Typography variant="h5" className={classes.fieldKey}>
                                {'Email address'}
                              </Typography>
                            </Grid>
                            {editSection.eoc_details ? (
                              <Grid container item className={classes.editAddressField}>
                                <Grid item xs>
                                  <TextField
                                    type="email"
                                    label="EOC Email"
                                    placeholder="Enter email address"
                                    name="eoc_email"
                                    className={brandClasses.shrinkTextField}
                                    onChange={handleChange}
                                    value={formState.eoc_email || ''}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                  />
                                </Grid>
                              </Grid>
                            ) : (
                              <Typography variant="h5" className={classes.labelValue}>
                                {locationDetails.eoc_email}
                              </Typography>
                            )}
                          </div>
                        </Grid>
                        {editSection.eoc_details && (
                          <Grid item xs={12}>
                            <SaveButton />
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Paper>

                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Grid container alignItems="baseline" justify="space-between">
                        <Typography variant="h5" className={classes.fieldKey}>
                          Site Logo
                        </Typography>
                        <Grid item>
                          {editSection.site_logo
                            ?
                            <IconButton onClick={() => handleEdit('site_logo', false)}>
                              <CancelOutlinedIcon />
                            </IconButton>
                            :
                            <IconButton onClick={() => handleEdit('site_logo', true)}>
                              <Edit className={classes.editIcon} />
                            </IconButton>
                          }
                        </Grid>
                      </Grid>
                      <Grid container alignItems="flex-start">
                        {editSection.site_logo
                          ?
                          <Grid item xs>
                            <div className={brandClasses.uploadContanier}>
                              <Typography className={brandClasses.uploadTitle}>Site Logo</Typography>
                              {imgState.imgURL
                                ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                                : formState.site_logo
                                  ? <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                                  : <Typography className={brandClasses.uploadDesc}>Upload Site Logo</Typography>
                              }
                              <div className={brandClasses.uploadImageContainer}>
                                <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file" onChange={handlePhotoChange} />
                                <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                                  <img src="/images/svg/UploadPhoto.svg" alt="" />
                                  <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                                  {imgCompressionLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                </label>
                              </div>
                            </div>
                            <SaveButton />
                          </Grid>
                          :
                          <Grid item container justify="flex-start" alignItems="center">
                            {formState.site_logo && (
                              <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                            )}
                          </Grid>
                        }
                      </Grid>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" className={classes.itemPaper}>
                    <Grid container alignItems="baseline" justify="space-between">
                      <Typography variant="h5" className={classes.fieldKey}>
                        Signature Request
                      </Typography>
                      <Grid item>
                        {editSection.signature
                          ?
                          <IconButton onClick={() => handleEdit('signature', false)}>
                            <CancelOutlinedIcon />
                          </IconButton>
                          :
                          <IconButton onClick={() => handleEdit('signature', true)}>
                            <Edit className={classes.editIcon} />
                          </IconButton>
                        }
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="flex-start">
                      {editSection.signature ?
                        <>
                          <Grid item xs>
                            <div className={brandClasses.uploadContanier}>
                              <Typography className={brandClasses.uploadTitle}>Signature Preview</Typography>
                              {formState.provider.signature
                                ? <img src={apiUrl + formState.provider.signature} className={brandClasses.uploadedPhoto} alt="img" />
                                : <Typography variant="h5" className={classes.completeLabel}>
                                  Check your provider Email for adding Signature
                                </Typography>
                              }
                            </div>
                          </Grid>
                        </> :
                        <div>
                          {formState.provider.signature ?
                            <>
                              <img src="/images/svg/check.svg" alt="green check" width="25px" /> &ensp;
                              <Typography variant="h5" className={classes.completeLabel}>
                                Completed
                              </Typography>
                            </>
                            :
                            <Typography variant="h5" className={classes.completeLabel}>
                              Check your provider Email for adding Signature
                            </Typography>
                          }
                        </div>
                      }
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              {/*  ------ --------- -------- ------- -------- --------  */}

              {/* ----------- Operations ----------- */}
              <Grid container spacing={3}></Grid>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <Paper variant="outlined" className={classes.itemPaper2}>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Box>
                        <Grid container alignItems="baseline" justify="space-between" className={classes.operationsTitle}>
                          <Typography variant="h5" className={classes.fieldKey}>
                            {'Operations Times'}
                          </Typography>
                          <Grid item>
                            {editSection.hours_of_operations ? (
                              <IconButton
                                onClick={() => handleEdit('hours_of_operations', false)}>
                                <CancelOutlinedIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => handleEdit('hours_of_operations', true)}>
                                <Edit className={classes.editIcon} />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                        {editSection.hours_of_operations &&
                          <Grid container className={classes.operationsTitle}>
                            <Grid item xs={12} sm={3}>
                              <Autocomplete
                                multiple
                                options={inventory}
                                getOptionLabel={option => `${option.item_type} - ${option.remaining_quantity}`}
                                className={brandClasses.shrinkTextField}
                                onChange={handleInventoryChange}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Select Inventory'
                                    name='Inventory'
                                    placeholder='All Inventory'
                                    variant='outlined'
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: params.InputProps.endAdornment
                                    }}
                                  />
                                )}
                              />
                            </Grid>
                            <Typography variant="h5" className={classes.fieldKey} style={{ paddingTop: 11, paddingLeft: 30 }}>
                              <span style={{ color: '#DE50A4', fontSize: '12px' }}>Total Vaccine: {inventoryAvailableCount.vaccine}</span>&nbsp;&nbsp;&nbsp;
                              <span style={{ color: '#3ECCCD', fontSize: '12px' }}>Total PCR: {inventoryAvailableCount.pcr}</span>&nbsp;&nbsp;&nbsp;
                              <span style={{ color: '#FBC23C', fontSize: '12px' }}>Total Antigen: {inventoryAvailableCount.antigen}</span>&nbsp;&nbsp;&nbsp;
                              {inventoryError ? <span style={{ color: '#DD2525', fontSize: '12px' }}>{inventoryError}</span> : ''}
                            </Typography>
                          </Grid>
                        }
                        <Grid container className={classes.operationHeader}>
                          <Grid item xs={4}>Day of the week</Grid>
                          <Grid item xs={4} style={{ textAlign: 'center' }} >Hours of operation</Grid>
                          <Grid item xs={4} style={{ textAlign: 'center' }}>Slots</Grid>
                        </Grid>
                      </Box>
                      {editSection.hours_of_operations
                        ?
                        operationState.map((day, day_index) => (
                          <Accordion
                            key={day_index}
                            expanded={expanded === `panel${day_index}`}
                            onChange={handleAccordianChange(day_index)}
                            classes={{ expanded: classes.accExpanded }}
                          >
                            <AccordionSummary
                              className={clsx(classes.accordion)}
                              classes={{ content: classes.accordionSummary }}
                            >
                              <Grid container
                                direction="row"
                                justify="space-between"
                                alignItems="center">
                                <Grid item xs={4} style={{ paddingLeft: '24px' }}>
                                  <div className={classes.dayRow}>
                                    {day.day_name}&ensp;
                                    {expanded === `panel${day_index}`
                                      ? <img src="/images/svg/chevron_blue_down.svg" style={{ height: 12, width: 18 }} alt="" />
                                      : <img src="/images/svg/chevron_blue_right.svg" style={{ height: 18, width: 12 }} alt="" />
                                    }
                                  </div>
                                </Grid>
                                <Grid item xs={4} style={{ textAlign: 'center' }} className={classes.timeText} >
                                  {day.active
                                    ? day.time_slots.map((ts, x) =>
                                      ts.checked && (<Typography key={x}>{moment(ts.start_time, 'HH:mm').format('LT') + ' - ' + moment(ts.end_time, 'HH:mm').format('LT')}</Typography>)
                                    )
                                    : <Typography style={{ color: '#D8D8D8' }}>Closed</Typography>
                                  }
                                </Grid>
                                <Grid item xs={4} style={{ textAlign: 'center' }}>
                                  {day.active
                                    ? day.time_slots.map((item, x) =>
                                      item.checked && (
                                        <Typography key={x} style={{ color: '#043B5D' }}>
                                          <span style={{ color: '#DE50A4' }}>Vaccine</span>: {item.vaccine.checked ? item.vaccine.value : 0}&nbsp;
                                          <span style={{ color: '#3ECCCD' }}>PCR</span>: {item.pcr.checked ? item.pcr.value : 0}&nbsp;
                                          <span style={{ color: '#FBC23C' }}>Antigen</span>: {item.antigen.checked ? item.antigen.value : 0}
                                        </Typography>
                                      )
                                    )
                                    : <Typography style={{ color: '#D8D8D8' }}>- - -</Typography>
                                  }
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container style={{ backgroundColor: '#F1F6F8' }} >
                                {day.time_slots.map((ts, slot_index) => (
                                  <React.Fragment key={slot_index}>
                                    <Grid item xs={4}></Grid>
                                    <Grid item xs={4} >
                                      {!ts.edit
                                        ?
                                        <Typography
                                          variant="h5"
                                          className={classes.timeDuration}
                                        >
                                          <Checkbox
                                            onChange={handleHoursCheckChange(day_index, slot_index)}
                                            checked={ts.checked}
                                            className={ts.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                          />
                                          <span style={{ color: ts.checked ? '#043B5D' : '#788081' }}>
                                            {moment(ts.start_time, 'HH:mm').format('LT') + ' - ' + moment(ts.end_time, 'HH:mm').format('LT')}
                                          </span>
                                          <IconButton onClick={() => handleTimeSlotEdit(day_index, slot_index, true)} classes={{ root: classes.editIcon }}>
                                            <Edit />
                                          </IconButton>
                                          <IconButton onClick={() => handleTimeSlotDelete(day_index, slot_index)} classes={{ root: classes.editIcon }}>
                                            <Delete />
                                          </IconButton>
                                        </Typography>
                                        :
                                        <Grid container direction="row" alignItems="center" style={{ padding: '0 12px' }}>
                                          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                            <KeyboardTimePicker
                                              value={moment(ts.start_time, 'HH:mm')}
                                              onChange={handleStartTimeChange(day_index, slot_index)}
                                              className={classes.timeField}
                                            />
                                            <Typography variant="h5" className={classes.operationDescription}>
                                              {'-'}
                                            </Typography>
                                            <KeyboardTimePicker
                                              value={moment(ts.end_time, 'HH:mm')}
                                              onChange={handleEndTimeChange(day_index, slot_index)}
                                              className={classes.timeField}
                                            // minDate={day.displayStartTime}
                                            />
                                          </MuiPickersUtilsProvider>
                                          <IconButton onClick={() => handleTimeSlotEdit(day_index, slot_index, false)} classes={{ root: classes.editIcon }}>
                                            <CancelOutlinedIcon />
                                          </IconButton>
                                        </Grid>
                                      }
                                    </Grid>
                                    <Grid item xs={4} container spacing={1}>
                                      <Grid item xs={3}>
                                        <Typography className={operationErrorsState[day_index].timeSlotError[slot_index].vaccine ? classes.slotSubHeaderError : ts.vaccine.checked ? classes.slotSubHeaderChecked : classes.slotSubHeader}>Vaccine</Typography>
                                        <Typography
                                          variant="h5"
                                          className={classes.timeDuration}
                                        >
                                          <Checkbox
                                            onChange={handleSlotTypeCheckbox(day_index, slot_index, 'vaccine')}
                                            checked={ts.vaccine.checked}
                                            className={operationErrorsState[day_index].timeSlotError[slot_index].vaccine ? classes.daySlotCheckboxError : ts.checked && ts.vaccine.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                          />
                                          <FilledInput
                                            value={ts.vaccine.value}
                                            onChange={handleSlotTypeInput(day_index, slot_index, 'vaccine')}
                                            // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                            aria-describedby="filled-weight-helper-text"
                                            classes={{ root: operationErrorsState[day_index].timeSlotError[slot_index].vaccine ? classes.filledInputRootError : ts.checked && ts.vaccine.checked ? classes.filledInputRootChecked : classes.filledInputRoot }}
                                            required
                                          />
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={3}>
                                        <Typography className={operationErrorsState[day_index].timeSlotError[slot_index].pcr ? classes.slotSubHeaderError : ts.pcr.checked ? classes.slotSubHeaderChecked : classes.slotSubHeader}>PCR</Typography>
                                        <Typography
                                          variant="h5"
                                          className={classes.timeDuration}
                                        >
                                          <Checkbox
                                            onChange={handleSlotTypeCheckbox(day_index, slot_index, 'pcr')}
                                            checked={ts.pcr.checked}
                                            className={operationErrorsState[day_index].timeSlotError[slot_index].pcr ? classes.daySlotCheckboxError : ts.checked && ts.pcr.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                          />
                                          <FilledInput
                                            value={ts.pcr.value}
                                            onChange={handleSlotTypeInput(day_index, slot_index, 'pcr')}
                                            // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                            aria-describedby="filled-weight-helper-text"
                                            classes={{ root: operationErrorsState[day_index].timeSlotError[slot_index].pcr ? classes.filledInputRootError : ts.checked && ts.pcr.checked ? classes.filledInputRootChecked : classes.filledInputRoot }}
                                          />
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={3}>
                                        <Typography className={operationErrorsState[day_index].timeSlotError[slot_index].antigen ? classes.slotSubHeaderError : ts.antigen.checked ? classes.slotSubHeaderChecked : classes.slotSubHeader}>Antigen</Typography>
                                        <Typography
                                          variant="h5"
                                          className={classes.timeDuration}
                                        >
                                          <Checkbox
                                            onChange={handleSlotTypeCheckbox(day_index, slot_index, 'antigen')}
                                            checked={ts.antigen.checked}
                                            className={operationErrorsState[day_index].timeSlotError[slot_index].antigen ? classes.daySlotCheckboxError : ts.checked && ts.antigen.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                          />
                                          <FilledInput
                                            value={ts.antigen.value}
                                            onChange={handleSlotTypeInput(day_index, slot_index, 'antigen')}
                                            // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                            aria-describedby="filled-weight-helper-text"
                                            classes={{ root: operationErrorsState[day_index].timeSlotError[slot_index].antigen ? classes.filledInputRootError : ts.checked && ts.antigen.checked ? classes.filledInputRootChecked : classes.filledInputRoot }}
                                          />
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={3}>
                                        <Typography className={classes.slotSubHeaderChecked} style={{ marginLeft: '10px', fontSize: '8px', }}>Slot Difference</Typography>
                                        <Select
                                          onChange={handleSlotDifferenceChange(day_index, slot_index)}
                                          label="Difference"
                                          name="Slot Difference"
                                          displayEmpty
                                          value={ts.time_slot_difference || ''}
                                          style={{ marginLeft: '20px' }}
                                        >
                                          <MenuItem value=''>
                                            <Typography className={brandClasses.selectPlaceholder}>Select Slot Difference</Typography>
                                          </MenuItem>
                                          <MenuItem value="5">5</MenuItem>
                                          <MenuItem value="10">10</MenuItem>
                                          <MenuItem value="15">15</MenuItem>
                                          <MenuItem value="20">20</MenuItem>
                                          <MenuItem value="30">30</MenuItem>
                                        </Select>
                                      </Grid>
                                      <Typography variant="h5" className={classes.slotSubHeaderErrorContent}>{operationErrorsState[day_index].timeSlotError[slot_index].error}</Typography>
                                    </Grid>
                                  </React.Fragment>
                                ))}
                                <Grid item xs={4}></Grid>
                                <Grid item xs={4}>
                                  <FormControlLabel
                                    control={<Checkbox onChange={handleClosedChange(day_index)} checked={!day.active} />}
                                    label="Closed"
                                    className={!day.active ? classes.dayCheckbox : classes.dayCheckboxChecked}
                                  />
                                  <Button
                                    className={classes.button}
                                    startIcon={<AddIcon />}
                                    onClick={addNewTimeSlot(day_index)}
                                  >
                                    Add another time slot
                                  </Button>
                                </Grid>
                                <Grid item xs={4}>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))
                        :
                        locationDetails.hours_of_operations.map((day, index) => (
                          <Grid item xs={12} sm={12} container className={classes.operationRow} key={index}>
                            <Grid
                              container
                              direction="row"
                              justify="space-between"
                              alignItems="center"
                            >
                              <Grid item xs={4} style={{ paddingLeft: '24px' }}>
                                <div className={classes.dayRow}>
                                  {day.day_name}&ensp;
                                </div>
                              </Grid>
                              <Grid item xs={4} style={{ textAlign: 'center' }} className={classes.timeText} >
                                {day.active
                                  ? day.time_slots.map((item, x) =>
                                    item.checked && (<Typography key={x}>{moment(item.start_time, 'HH:mm').format('LT') + ' - ' + moment(item.end_time, 'HH:mm').format('LT')}</Typography>)
                                  )
                                  : <Typography style={{ color: '#D8D8D8' }}>Closed</Typography>
                                }
                              </Grid>
                              <Grid item xs={4} style={{ textAlign: 'left' }}>
                                {day.active
                                  ? day.time_slots.map((item, x) =>
                                    <Typography key={x} style={{ color: '#043B5D', textAlign: 'center' }}>
                                      <span style={{ color: '#DE50A4' }}>Vaccine</span>: {item.vaccine.checked ? item.vaccine.value : 0}&nbsp;
                                      <span style={{ color: '#3ECCCD' }}>PCR</span>: {item.pcr.checked ? item.pcr.value : 0}&nbsp;
                                      <span style={{ color: '#FBC23C' }}>Antigen</span>: {item.antigen.checked ? item.antigen.value : 0}
                                    </Typography>
                                  )
                                  : <Typography style={{ color: '#D8D8D8' }}>- - -</Typography>
                                }
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}

                      {editSection.hours_of_operations && (
                        <Grid container justify={'flex-end'}>
                          <Grid className={classes.submitBtnOperations} item xs={12}>
                            <div className={brandClasses.footerMessage}>
                              {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
                            </div>
                            <SaveButton />
                          </Grid>
                        </Grid>
                      )}
                    </form>
                  </Paper>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <div className={classes.actionButtonRow}>
                  <ActiveButton
                    variant="outlined"
                    disabled={locationDetails.active || saveLoading}
                    style={{ marginRight: 15 }}
                    onClick={() => toggleLocationStatus({ active: true })}>
                    {'Activate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </ActiveButton>
                  <ActiveButton
                    variant="outlined"
                    disabled={!locationDetails.active || saveLoading}
                    className={locationDetails.active ? classes.buttonRed : ''}
                    style={{ marginLeft: 15 }}
                    onClick={() => toggleLocationStatus({ active: false })}>
                    {'Deactivate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </ActiveButton>
                </div>
              </Grid>
            </div>
          </div>
          :
          <div className={classes.alert}>
            <Alert severity="error">
              {alertMessage}
              <Button
                onClick={goBack}
              >
                {'Go Back'}
              </Button>
            </Alert>
          </div>
      }

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleDialogClose}
      />

    </div>
  );
};

LocationDetails.propTypes = {
  getLocation: PropTypes.func.isRequired,
  updateLocation1: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  clearLocations: PropTypes.func.isRequired,
  getInventoryAvailable: PropTypes.func.isRequired,
  getInventoryCountsByLocation: PropTypes.func.isRequired,
};

export default connect(null, { getLocation, updateLocation1, uploadImage, clearLocations, getInventoryAvailable, getInventoryCountsByLocation })(withRouter(LocationDetails));