import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box, Typography, Button, CircularProgress, Grid, TextField, Select,
  MenuItem, Checkbox, FormControlLabel, IconButton, FilledInput, Link as RouterLink
}
  from '@material-ui/core';
import brandStyles from 'theme/brand';
import { handleImage } from 'helpers';
import Alert from '@material-ui/lab/Alert';
import DialogAlert from 'components/DialogAlert';
import DialogAlertOperationConfirmation from 'components/DialogAlert';
// import SignaturePad from 'react-signature-canvas';
import { addLocation, uploadImage, apiUrl, 
  // getInventoryAvailable 
} from 'actions/api';
import { clearLocations } from 'actions/clear';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import * as appConstants from 'constants/appConstants';
import { Users, Edit, Delete } from 'icons';
// import CheckButton from 'components/CheckButton';
// import ZipCodeInput from 'components/ZipCodeInput';
import NpiInput from 'components/NpiInput';
import TextButton from 'components/Button/TextButton';
import CloseIcon from '@material-ui/icons/Close';
import LineStepProgressBar from 'components/LineStepProgressBar';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import NumberFormat from 'react-number-format';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles(theme => ({
  text: {
    margin: theme.spacing(1),
    color: theme.palette.brandDark,
    textAlign: 'center'
  },
  locationRoot: {
    margin: '32px 16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: theme.palette.brand,
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    '& span': {
      fontWeight: 500
    }
  },
  skipButton: {
    textTransform: 'none',
    marginBottom: theme.spacing(4)
  },
  backTitle: {
    color: theme.palette.brandDisableGray,
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'center',
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '34px',
    color: theme.palette.brand
  },
  operationTitle: {
    backgroundColor: 'rgba(15,132,169,0.8)',
    color: theme.palette.white,
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  operationDescription: {
    color: theme.palette.brandDark,
    padding: theme.spacing(2),
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
  providerCheckbox: {
    color: theme.palette.brand,
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brand
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brand
    }
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
      color: '#0F84A9'
    }
  },
  daySlotCheckbox: {
    color: '#0f84a959',
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: '#0F84A9'
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
  daySlotCheckboxError: {
    color: '#e53935',
    padding: '3px 8px',
    '& .MuiSvgIcon-root': {
      color: '#e53935'
    }
  },
  stationsText: {
    color: '#e53935',
    textAlign: 'center',
    marginRight: theme.spacing(2),
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
      width: '75px'
    },
    '& .MuiIconButton-root': {
      color: theme.palette.brandDark,
    },
    '& button': {
      padding: 0
    }
  },
  accExpanded: {
    margin: '0 !important',
    // borderBottom: '1px solid #0F84A9'
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center'
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat'
  },
  editIcon: {
    color: theme.palette.brandGray,
    fontSize: '1rem',
    padding: '12px 0px 12px 12px',
    '& svg': {
      fontSize: '1.2rem',
    }
  },
  uploadDesc: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '10px',
    lineHeight: '12px',
    textAlign: 'center',
    color: '#D8D8D8'
  },
  uploadImageContainer: {
    textAlign: 'center',
    '& img': {
      width: '50px'
    },
    '& p': {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '17px',
      textAlign: 'center',
      color: theme.palette.brand
    }
  },
  greenBtn: {
    backgroundColor: '#016A73',
    color: theme.palette.white,
    textTransform: 'uppercase',
    fontSize: '16px',
    borderRadius: '10px',
    // '&:hover': {
    //   backgroundColor: theme.palette.brandDark
    // }
  },
  sendIcon: {
    '& svg': {
      width: '20px'
    }
  },
  operationContainer: {
    border: `solid ${theme.palette.brand} 1px`,
    borderRadius: '8px',
    boxShadow: '6.35934px 2.54374px 11.4468px 2.54374px rgba(4, 59, 93, 0.15)',
    padding: '0px 0 12px'
  },
  operationTimes: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '22px',
    lineHeight: '27px',
    color: '#0F84A9',
    margin: '0 0 12px 32px'
  },
  operationHeader: {
    fontFamily: 'Montserrat',
    background: '#5E89A2', color: 'white', fontSize: '20px', lineHeight: '29px', padding: '8px 32px',
    borderRadius: '8px 8px 0px 0px'
  },
  dayRow: {
    width: 200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eoc_closeIcon: {
    color: '#788081',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '& svg': {
      cursor: 'pointer'
    }
  }
}));

const startTime = moment('2020-02-20 09:00');
const endTime = moment('2020-02-20 10:00');

const OperationValuesInit = [
  {
    day_name: 'Monday',
    active: false,
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 1,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
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
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 2,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
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
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 3,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
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
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 4,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
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
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 5,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
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
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 6,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
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
    displayStartTime: startTime,
    displayEndTime: endTime,
    start_time: startTime.format('HH:mm'),
    end_time: endTime.format('HH:mm'),
    day_number: 0,
    edit: false,
    time_slots: [
      {
        displayStartTime: startTime,
        displayEndTime: endTime,
        edit: false,
        checked: false,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm'),
        vaccine: { checked: false, value: 0 },
        pcr: { checked: false, value: 0 },
        antigen: { checked: false, value: 0 },
        time_slot_difference: 10,
      }
    ]
  },
];

const OperationErrorsInit = [...Array(7)].map((e) => (
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

const labelArray = ['Client Information', 'Client Contact Details', 'Provider Information', 'Interface Details'];

const AddLocation = (props) => {
  const { isWelcomePage, updateStep, clearLocations, addLocation, uploadImage, 
    // getInventoryAvailable 
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const history = useHistory();

  const [step, setStep] = useState(3);
  const [eocView, setEocView] = useState(false);
  const [timeSlotError, setTimeSlotError] = useState(null);
  // const [inventory, setInventory] = useState([]);
  const [selectedInventory] = useState([]);
  const [inventoryError, setInventoryError] = useState(null);

  const [displayError, setDisplayError] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOperationOpen, setDialogOperationOpen] = useState(false);
  const [imgState, setImgState] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [formState, setFormState] = useState({ provider: { send_signature_request_email: true, send_signature_request_sms: false } });

  const [operationState, setOperationState] = useState([...OperationValuesInit]);
  const [operationErrorsState, setOperationErrorsState] = useState(JSON.parse(JSON.stringify(OperationErrorsInit)));
  const [inventoryAvailableCount, setInventoryAvailableCount] = useState({ vaccine: 0, antigen: 0, pcr: 0 });
  const [tempInventoryCount, setTempInventoryCount] = useState({ vaccine: 0, pcr: 0, antigen: 0 });
  const [recalculate, setRecalculate] = useState(0);

  useEffect(() => {
    // (async () => {
    //   let res = await getInventoryAvailable();
    //   if (res.success) {
    //     setInventory(res.data);
    //   }
    // })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
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
      // check for value
      o.time_slots.forEach((ts, vei) => {
        if (ts.checked && ((ts.vaccine.checked && ts.vaccine.value === 0) || (ts.pcr.checked && ts.pcr.value === 0) || (ts.antigen.checked && ts.antigen.value === 0))) {
          operationErrors[di].error = true;
          operationErrors[di].timeSlotError[vei].error = 'Please enter value.';
          // check vaccine 
          if (o.time_slots[vei].vaccine.checked && o.time_slots[vei].vaccine.value === 0)
            operationErrors[di].timeSlotError[vei].vaccine = true;
          // check pcr 
          if (o.time_slots[vei].pcr.checked && o.time_slots[vei].pcr.value === 0)
            operationErrors[di].timeSlotError[vei].pcr = true;
          // check antigen 
          if (o.time_slots[vei].antigen.checked && o.time_slots[vei].antigen.value === 0)
            operationErrors[di].timeSlotError[vei].antigen = true;
          setOperationErrorsState([...operationErrors]);
        }
      });
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
    if (!selectedInventory.length) {
      return setInventoryError('Please Select Inventory');
    }
    if (inventoryAvailableCount.vaccine < 0) {
      return setInventoryError('Vaccine insufficient');
    }
    if (inventoryAvailableCount.pcr < 0) {
      return setInventoryError('PCR insufficient');
    }
    if (inventoryAvailableCount.antigen < 0) {
      return setInventoryError('Antigen insufficient');
    }
    // if no errors
    setInventoryError(null);
    // eslint-disable-next-line
  }, [inventoryAvailableCount]);

  useEffect(() => {
    if (selectedInventory.length) {
      let vaccine = selectedInventory.filter(i => i.item_type === 'Vaccine').reduce((sum, i) => sum + i.remaining_quantity, 0);
      let pcr = selectedInventory.filter(i => i.item_type === 'PCR' || i.item_type === 'Saliva').reduce((sum, i) => sum + i.remaining_quantity, 0);
      let antigen = selectedInventory.filter(i => i.item_type === 'Rapid').reduce((sum, i) => sum + i.remaining_quantity, 0);
      setInventoryAvailableCount({ vaccine, pcr, antigen });
      setTempInventoryCount({ vaccine, pcr, antigen });
      setInventoryError(null);
      setRecalculate(recalculate => recalculate + 1);
    } else {
      setInventoryAvailableCount({ vaccine: 0, antigen: 0, pcr: 0 });
      setTempInventoryCount({ vaccine: 0, antigen: 0, pcr: 0 });
      setInventoryError('Please Select Inventory');
    }
    // eslint-disable-next-line
  }, [selectedInventory]);

  const handleChange = e => {
    e.persist();
    if (e.target.type === 'checkbox') {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: !e.target.checked
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleProviderChange = e => {
    e.persist();
    let temp = formState.provider;
    if (e.target.type === 'checkbox') {
      temp[e.target.name] = e.target.checked;
      setFormState({ ...formState, temp });
    } else {
      temp[e.target.name] = e.target.value;
      setFormState({ ...formState, temp });
    }
  };

  // const handleInventoryChange = (e, values) => {
  //   setSelectedInventory(values);
  // };

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
      displayStartTime: moment(last_time, 'HH:mm'),
      displayEndTime: moment(last_time, 'HH:mm').add(1, 'hours'),
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
    operations[index].time_slots[slot_index].displayStartTime = date;
    for (let i = 0; i < operations[index].time_slots.length; i++) {
      if (i !== slot_index) {
        if (operations[index].time_slots[i].start_time === moment(date).format('HH:mm')) {
          checkduplicate = true;
          setTimeSlotError('Start Time already exists');
          return;
        } else if (moment(date).format('HH:mm') <= operations[index].time_slots[i].end_time && moment(date).format('HH:mm') >= operations[index].time_slots[i].start_time) {
          setTimeSlotError('Start Time  is in between selected slots ');
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
    operations[index].time_slots[slot_index].displayEndTime = date; // moment(date).toString()
    for (let i = 0; i < operations[index].time_slots.length; i++) {
      if (i !== slot_index) {
        if (operations[index].time_slots[i].end_time === moment(date).format('HH:mm')) {
          checkduplicate = true;
          setTimeSlotError('End Time already exists');
          return;
        } else if (moment(date).format('HH:mm') <= operations[index].time_slots[i].end_time && moment(date).format('HH:mm') >= operations[index].time_slots[i].start_time) {
          setTimeSlotError('Start Time and End Time is in between selected slots ');
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

  const handlePhotoChange = event => {
    handleImage(event, setDisplayError, setImgState, setImgCompressionLoading);
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

  const clearMessage = () => {
    setDisplayError(null);
    setDisplaySuccess(null);
  }

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const handleSlotDifferenceChange = (index, slot_index) => event => {
    event.persist();
    let operations = [...operationState];
    operations[index].time_slots[slot_index].time_slot_difference = event.target.value;
    setOperationState(operations);
  };

  const toggleEocView = () => {
    setEocView(!eocView);
  };

  const handleSkip = () => {
    updateStep();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    updateStep();
  };

  const handleDialogAction = () => {
    setDialogOpen(false);
    setFormState({ provider: { send_signature_request_email: false, send_signature_request_sms: false } });
    setStep(0);
    setOperationState(OperationValuesInit);
    window.scrollTo(0, 0);
  };

  const handleDialogOperationAction = () => {
    setDialogOperationOpen(false);
    saveLocation(true);
  };

  const handleDialogOperationClose = () => {
    setDialogOperationOpen(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    saveLocation();
  };

  const saveLocation = async (isForce) => {
    clearMessage();
    if (step === 0) {
      // if (!/^\d{5}[-\s]?(?:\d{4})?$/.test(formState.zip_code.trim()))
      //   return setDisplayError(`Invalid Zip code ${formState.zip_code}.`);
      setStep(step + 1);
    } else if (step === 1) {
      setStep(step + 1);
    } else if (step === 2) {
      if (!formState.provider.send_signature_request_email && !formState.provider.send_signature_request_sms)
        return setDisplayError('Please check Email or Text to Send signature request');
      if (formState.provider.npi.trim().length < 10)
        return setDisplayError('Invalid Provider NPI number.');
      setStep(step + 1);
    } else {
      if (inventoryError && !isForce) {
        setDisplayError('Please check the inventory errors');
        setDialogOperationOpen(true);
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
      formState.inventory_ids = selectedInventory.map(i => i._id);
      setLoading(true);
      // check if image uploaded
      if (imgState.imagePath) {
        const locationLogoData = new FormData();
        locationLogoData.append('uploadImage', imgState.imagePath);
        const resLocationLogo = await uploadImage(locationLogoData);
        if (resLocationLogo.success) {
          formState.site_logo = '/images/' + resLocationLogo.data;
          createLocation();
        } else {
          setLoading(false);
        }
      } else {
        createLocation();
      }
    }
  };

  const createLocation = async () => {
    formState.hours_of_operations = operationState;
    setLoading(true);
    const res = await addLocation(formState);
    setLoading(false);
    if (res.success) {
      setDisplaySuccess(res.message);
      clearLocations();
      clearMessage();
      if (isWelcomePage)
        setDialogOpen(true);
      else
        history.push('/site-manager/location-manager');
    }
  };

  return (
    <div>
      {/* <form onSubmit={handleSubmit} > */}
      <div className={classes.locationRoot}>
        {isWelcomePage && (
          <Grid item>
            <Typography
              className={classes.text}
              variant="h2"
            >
              {'LOCATION MANAGER'}
            </Typography>
          </Grid>
        )}
        <div className={classes.header}>
          <Typography
            className={classes.headerTitle}
            variant="h3"
          >
            <Users /> &nbsp; CLIENT MANAGER  | &nbsp;  <span>ADD CLIENT</span>
            {/* <sup>
              <Tooltip title="Add Locaition" placement="right-start">
                <HelpIcon />
              </Tooltip>
            </sup> */}
          </Typography>
          {isWelcomePage && (
            <RouterLink
              className={clsx(classes.skipButton, brandClasses.brandGrayText)}
              component={Button}
              onClick={handleSkip}
              variant="h6"
            >
              {'Skip for now'}
            </RouterLink>
          )}
        </div>

        <Grid container >
          <Box
            display="flex"
            padding="12px 0px 16px"
          >
            <Button
              component={Link}
              to="/site-manager/location-manager"
            >
              <ChevronLeftIcon style={{ color: '#788081' }} />
              <Typography className={classes.backTitle}>Back to location manager</Typography>
            </Button>
          </Box>
          <Grid
            className="text-left d-flex"
            item
            xs={12}
          >
            <LineStepProgressBar
              activeIndex={step}
              handleStep={setStep}
              labels={labelArray}
              totalCount={4}
            />
          </Grid>
        </Grid>

        {step === 0 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography
                className={classes.subTitle}
                variant="h6"
              >Input Client Details</Typography>
            </Box>
            <Grid
              container
              spacing={4}
            >
              <Grid
                item
                sm={4}
                xs={12}
              >
                <Box >
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    label="Client Name"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter client name"
                    required
                    type="text"
                    value={formState.name || ''}
                    variant="outlined"
                  />
                  <br /><br />
                  {/* <TextField
                     type="number"
                      label="Location Phone Number"
                      placeholder="Enter phone number"
                      name="phone"
                      className={brandClasses.shrinkTextField}
                      onChange={handleChange}
                      value={formState.phone || ''}
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    /> */}
                  <NumberFormat
                    InputLabelProps={{ shrink: true }}
                    className={brandClasses.shrinkTextField}
                    customInput={TextField}
                    fullWidth
                    label="Client Phone Number"
                    mask=" "
                    name="phone"
                    onChange={handleChange}
                    placeholder="Enter client phone number"
                    required
                    type="tel"
                    value={formState.phone || ''}
                    variant="outlined"
                  />
                  <br /><br />
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={brandClasses.shrinkTextField}
                    fullWidth
                    label="Client Email Address"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                    type="email"
                    value={formState.email || ''}
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <Box >
                  <div
                    className={brandClasses.uploadContanier}
                    style={{ height: '100%' }}
                  >
                    <Typography className={brandClasses.uploadTitle}>Upload Client Logo</Typography>
                    <Typography
                      className={brandClasses.uploadDesc}
                      display="inline"
                      style={{ padding: '4px' }}
                    >Select your file or drag and drop it here</Typography>
                    <div className={classes.uploadImageContainer}>
                      <input
                        accept="image/*"
                        className={brandClasses.uploadInput}
                        id="icon-button-file"
                        onChange={handlePhotoChange}
                        type="file"
                      />
                      <label
                        htmlFor="icon-button-file"
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          alt=""
                          src="/images/svg/upload_cloud.svg"
                        />
                        <Typography className={brandClasses.uploadPhotoLabel}>UPLOAD<br />PHOTO</Typography>
                        {imgCompressionLoading ? <CircularProgress
                          className={brandClasses.progressSpinner}
                          size={20}
                        /> : ''}
                      </label>
                    </div>
                  </div>
                </Box>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <Box
                  alignItems="center"
                  border="dotted 1px #D8D8D8"
                  display="flex"
                  height="110px"
                  justifyContent="center"
                  width="110px"
                >
                  {imgState.imgURL
                    ? <img
                      src={imgState.imgURL}
                        className={brandClasses.uploadedPhoto}
                        alt="img"
                        width="100%"
                      />
                    : formState.site_logo
                      ? <img
                        src={apiUrl + formState.site_logo}
                          className={brandClasses.uploadedPhoto}
                          alt="img"
                          width="100%"
                        />
                      : <Typography className={classes.uploadDesc}>PHOTO<br /> PREVIEW</Typography>
                  }
                </Box>
              </Grid>
              <Grid
                item
                  xs={12}
                  sm={8}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                  type="text"
                  value={formState.address || ''}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <TextField
                  type="text"
                  label="Address 2"
                  placeholder="Enter apt, suite, floor, etc"
                  name="address2"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.address2 || ''}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={4}>
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
              </Grid> */}
              {/* <Grid item xs={12} sm={4}>
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
              </Grid> */}
              {/* <Grid item xs={12} sm={2}>
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
                      <Typography className={brandClasses.selectPlaceholderGray}>Select State</Typography>
                    </MenuItem>
                    {getStates.map((state, index1) => (
                      <MenuItem key={index1} value={state.text}>{state.text}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
              {/* <Grid item xs={12} sm={2}>
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
              </Grid> */}
              {/* <Grid item xs={12} sm={4}></Grid> */}
            </Grid>
            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert
                onClose={() => { closeErrorMessage() }}
                severity="error"
              >{displayError}</Alert> : null}
              {displaySuccess ? <Alert
                onClose={() => { closeSuccessMessage() }}
                severity="success"
              >{displaySuccess}</Alert> : null}
            </div>
            <div className={brandClasses.footerButton}>
              {/* <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
                style={{ borderRadius: '4px' }}
              >
                NEXT {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button> */}
              <TextButton
                disabled={loading}
                type="submit"
              >
                NEXT {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography className={classes.subTitle}>Input Client Details</Typography>
            </Box>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Location Name"
                  name="location_name"
                  onChange={handleChange}
                  placeholder="Enter location name"
                  required
                  type="text"
                  value={formState.location_name || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <NumberFormat
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  customInput={TextField}
                  fullWidth
                  label="Location Phone Number"
                  mask=" "
                  name="admin_office_phone"
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  type="tel"
                  value={formState.admin_office_phone || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              />
              
              <Grid
                className="mb-1"
                item
                sm={12}
              >
                <TextButton
                  category="Icon"
                  disabled={eocView}
                  onClick={toggleEocView}
                >
                  <AddIcon />
                  ADD Client location
                </TextButton>
              </Grid>
            </Grid>

            {eocView && (
              <>
                <Box margin="8px 0px 16px">
                  <Typography className={classes.subTitle} />
                </Box>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    sm={4}
                    xs={12}
                  >
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      className={brandClasses.shrinkTextField}
                      fullWidth
                      label="Location Name"
                      name="eoc_location_name"
                      onChange={handleChange}
                      placeholder="Enter location name"
                      required
                      type="text"
                      value={formState.eoc_location_name || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                  >
                    <NumberFormat
                      InputLabelProps={{ shrink: true }}
                      className={brandClasses.shrinkTextField}
                      customInput={TextField}
                      fullWidth
                      label="Location Phone Number"
                      mask=" "
                      name="eoc_office_phone"
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      type="tel"
                      value={formState.eoc_office_phone || ''}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    className={classes.eoc_closeIcon}
                    item
                    sm={2}
                    xs={12}
                  >
                    <CloseIcon onClick={toggleEocView} />
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    xs={12}
                  />
                  <Grid
                    item
                    sm={8}
                    xs={12}
                  >
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      className={brandClasses.shrinkTextField}
                      fullWidth
                      label="Address"
                      name="eoc_address"
                      onChange={handleChange}
                      placeholder="Enter address"
                      required
                      type="text"
                      value={formState.eoc_address || ''}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid
                    item
                    sm={4}
                    xs={12}
                  />
                </Grid>
              </>
            )}
            <div className={brandClasses.footerButton}>
              <TextButton
                disabled={loading}
                type="submit"
              >
                NEXT {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography className={classes.subTitle}>Input Provider Information</Typography>
            </Box>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Provider Name"
                  name="name"
                  onChange={handleProviderChange}
                  placeholder="Enter name"
                  required
                  type="text"
                  value={formState.provider.name || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <NumberFormat
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  customInput={TextField}
                  fullWidth
                  label="Provider Phone Number"
                  mask=" "
                  name="phone"
                  onChange={handleProviderChange}
                  placeholder="Enter phone number"
                  required
                  type="tel"
                  value={formState.provider.phone || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              />

              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Provider Email"
                  name="email"
                  onChange={handleProviderChange}
                  placeholder="Enter email"
                  required
                  type="email"
                  value={formState.provider.email || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <NpiInput
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Provider NPI Number"
                  name="npi"
                  onChange={handleProviderChange}
                  placeholder="Enter NPI"
                  required
                  value={formState.provider.npi || ''}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              />

              <Grid
                item
                sm={8}
                xs={12}
              >
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleProviderChange}
                  placeholder="Enter address"
                  required
                  type="text"
                  value={formState.provider.address || ''}
                  variant="outlined"
                />
              </Grid>
             
              <Grid
                item
                sm={4}
                xs={12}
              />
              <Grid
                className="mb-1"
                item
                sm={12}
              >
                <Button
                  className={classes.greenBtn}
                  onClick={toggleEocView}
                  variant="contained"
                >
                  <img
                    alt="send"
                    src="/images/svg/send.svg"
                    style={{ width: 25, marginRight: '8px' }}
                  />
                  Send signature request
                </Button>
                {/* <TextButton onClick={toggleEocView}>
                  <img src="/images/svg/send.svg" alt="send" style={{ width: 25, marginRight: '8px' }} />
                  Send signature request
                </TextButton> */}
              </Grid>
              <Grid
                item
                sm={12}
              >
                <FormControlLabel
                  className={classes.providerCheckbox}
                  control={<Checkbox
                    checked={formState.provider.send_signature_request_email}
                    name="send_signature_request_email"
                    onChange={handleProviderChange}
                           />}
                  label="Email"
                />
                <FormControlLabel
                  className={classes.providerCheckbox}
                  control={<Checkbox
                    checked={formState.provider.send_signature_request_sms}
                    name="send_signature_request_sms"
                    onChange={handleProviderChange}
                           />}
                  label="Text message"
                />
              </Grid>
            </Grid>
            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert
                onClose={() => { closeErrorMessage() }}
                severity="error"
              >{displayError}</Alert> : null}
            </div>
            <div className={brandClasses.footerButton}>
              {/* <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
                style={{ borderRadius: '4px' }}
              >
                NEXT {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button> */}
              <TextButton
                disabled={loading}
                type="submit"
              >
                NEXT {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleSubmit}
          >
            <Box margin="8px 0px 16px">
              <Typography className={classes.subTitle}>Add interface</Typography>
            </Box>
            
            <Box className={classes.operationContainer}>
             
              <Grid
                className={classes.operationHeader}
                container
              >
                <Grid
                  item
                  xs={12}
                >INTERFACE OPTIONS</Grid>
              </Grid>
              {timeSlotError ? <Typography
                style={{ color: 'red', textAlign: 'center' }}
                variant="h6"
              >{timeSlotError}</Typography> : ''}
              {operationState.map((day, day_index) => (
                <Accordion
                  classes={{ expanded: classes.accExpanded }}
                  expanded={expanded === `panel${day_index}`}
                  key={day_index}
                  onChange={handleAccordianChange(day_index)}
                >
                  <AccordionSummary
                    className={clsx(classes.accordion)}
                    classes={{ content: classes.accordionSummary }}
                  >
                    <Grid
                      alignItems="center"
                      container
                      direction="row"
                      justify="space-between"
                    >
                      <Grid
                        item
                        style={{ paddingLeft: '24px' }}
                        xs={2}
                      >
                        <div className={classes.dayRow}>
                          {day.day_name} &ensp;
                          {expanded === `panel${day_index}`
                            ? <img
                                src="/images/svg/chevron_blue_down.svg"
                                style={{ height: 12, width: 18 }}
                                alt=""
                              />
                            : <img
                                src="/images/svg/chevron_blue_right.svg"
                                style={{ height: 18, width: 12 }}
                                alt=""
                              />
                          }
                        </div>
                      </Grid>
                      <Grid
                        className={classes.timeText}
                        item
                        style={{ textAlign: 'center' }}
                        xs={5}
                      >
                        {day.active
                          ? day.time_slots.map((ts, x) =>
                            ts.checked && (<Typography
                              key={x}
                              style={{ color: '#0F84A9' }}
                            >{moment(ts.start_time, 'HH:mm').format('LT') + ' - ' + moment(ts.end_time, 'HH:mm').format('LT')}</Typography>)
                          )
                          : <Typography style={{ color: '#D8D8D8', fontWeight: '600' }}>Closed</Typography>
                        }
                      </Grid>
                      <Grid item xs={5}>
                        {day.active
                          ? day.time_slots.map((item, x) =>
                            item.checked && (
                              <Grid
                                alignItems="center"
                                container
                                direction="row"
                                justify="center"
                                spacing={1}
                              >
                                <Grid
                                  item
                                  sm={4}
                                >
                                  <Typography
                                    align="left"
                                    display="inline"
                                    key={x}
                                    style={{ color: '#043B5D' }}
                                  >
                                    <span style={{ color: '#DE50A4' }}>Vaccine:</span>
                                  </Typography>
                                  <Typography
                                    align="left"
                                    display="inline"
                                  > {item.vaccine.checked ? item.vaccine.value : 0}</Typography>
                                </Grid>
                                <Grid
                                  item
                                  sm={4}
                                >
                                  <Typography
                                    align="left"
                                    display="inline"
                                    key={x}
                                    style={{ color: '#043B5D' }}
                                  >
                                    <span style={{ color: '#3ECCCD' }}>PCR:</span></Typography>
                                  <Typography
                                    align="left"
                                    display="inline"
                                  > {item.pcr.checked ? item.pcr.value : 0}</Typography></Grid>
                                <Grid
                                  item
                                  sm={4}
                                >
                                  <Typography
                                    align="left"
                                    display="inline"
                                    key={x}
                                    style={{ color: '#043B5D' }}
                                  >
                                    <span style={{ color: '#FBC23C' }}>Antigen:</span></Typography>
                                  <Typography
                                    align="left"
                                    display="inline"
                                  > {item.antigen.checked ? item.antigen.value : 0}</Typography></Grid>
                              </Grid>
                            )
                          )
                          : <Typography style={{ color: '#D8D8D8', fontWeight: '600', textAlign: 'center' }}>- - -</Typography>
                        }
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails style={{ backgroundColor: '#F1F6F8' }}>
                    <Grid container  >
                      {day.time_slots.map((item, slot_index) => (
                        <React.Fragment key={slot_index}>
                          <Grid
                            item
                            xs={2}
                          />
                          <Grid
                            item
                            xs={1}
                          />
                          <Grid
                            item
                            xs={4}
                          >
                            {!item.edit
                              ? <>
                                <Grid
                                  container
                                  direction="row"
                                >
                                  <Grid
                                    item
                                    sm={8}
                                  >
                                    <Typography
                                      className={classes.timeDuration}
                                      variant="h5"
                                    >
                                      <Checkbox
                                        checked={item.checked}
                                        className={item.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                        onChange={handleHoursCheckChange(day_index, slot_index)}
                                      />
                                      <span style={{ color: item.checked ? '#043B5D' : '#788081' }}>
                                        {moment(item.displayStartTime).format('LT') + ' - ' + moment(item.displayEndTime).format('LT')}
                                      </span>
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    sm={2}
                                  >
                                    <Typography
                                      className={classes.timeDuration}
                                      variant="h5"
                                    >
                                      <IconButton
                                        classes={{ root: classes.editIcon }}
                                        onClick={() => handleTimeSlotEdit(day_index, slot_index, true)}
                                        style={{ padding: '4px' }}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </Typography>
                                  </Grid>

                                  <Grid
                                    item
                                    sm={2}
                                  >
                                    <Typography
                                      className={classes.timeDuration}
                                      variant="h5"
                                    >
                                      <IconButton
                                        classes={{ root: classes.editIcon }}
                                        onClick={() => handleTimeSlotDelete(day_index, slot_index)}
                                        style={{ padding: '4px' }}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </>
                              :
                              <Grid
                                alignItems="center"
                                container
                                direction="row"
                                style={{ padding: '0 12px' }}
                              >
                                <MuiPickersUtilsProvider
                                  libInstance={moment}
                                  utils={MomentUtils}
                                >
                                  <KeyboardTimePicker
                                    className={classes.timeField}
                                    keyboardIcon={<AccessTimeIcon style={{ color: '#9B9B9B' }} />}
                                    onChange={handleStartTimeChange(day_index, slot_index)}
                                    value={item.displayStartTime}
                                  />
                                  <Typography
                                    className={classes.operationDescription}
                                    variant="h5"
                                  >
                                    {'-'}
                                  </Typography>
                                  <KeyboardTimePicker
                                    className={classes.timeField}
                                    keyboardIcon={<AccessTimeIcon style={{ color: '#9B9B9B' }} />}
                                    onChange={handleEndTimeChange(day_index, slot_index)}
                                    value={item.displayEndTime}
                                  // minDate={day.displayStartTime}
                                  />
                                </MuiPickersUtilsProvider>
                                <IconButton
                                  classes={{ root: classes.editIcon }}
                                  onClick={() => handleTimeSlotEdit(day_index, slot_index, false)}
                                >
                                  <CancelOutlinedIcon />
                                </IconButton>
                              </Grid>
                            }
                          </Grid>
                          <Grid
                            container
                            item
                            spacing={1}
                            xs={5}
                          >
                            <Grid
                              item
                              xs={3}
                            >
                              <Typography
                                className={operationErrorsState[day_index].timeSlotError[slot_index].vaccine ? classes.slotSubHeaderError : item.vaccine.checked ? classes.slotSubHeaderChecked : classes.slotSubHeader}
                                style={{ fontWeight: '600' }}
                              > Vaccine</Typography>
                              <Typography
                                className={classes.timeDuration}
                                variant="h5"
                              >
                                <Checkbox
                                  checked={item.vaccine.checked}
                                  className={operationErrorsState[day_index].timeSlotError[slot_index].vaccine ? classes.daySlotCheckboxError : item.checked && item.vaccine.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                  onChange={handleSlotTypeCheckbox(day_index, slot_index, 'vaccine')}
                                />
                                <FilledInput
                                  aria-describedby="filled-weight-helper-text"
                                  classes={{ root: operationErrorsState[day_index].timeSlotError[slot_index].vaccine ? classes.filledInputRootError : item.checked && item.vaccine.checked ? classes.filledInputRootChecked : classes.filledInputRoot }}
                                  // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                  onChange={handleSlotTypeInput(day_index, slot_index, 'vaccine')}
                                  required
                                  value={item.vaccine.value}
                                />
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                            >
                              <Typography
                                className={operationErrorsState[day_index].timeSlotError[slot_index].pcr ? classes.slotSubHeaderError : item.pcr.checked ? classes.slotSubHeaderChecked : classes.slotSubHeader}
                                style={{ fontWeight: '600' }}
                              >PCR</Typography>
                              <Typography
                                className={classes.timeDuration}
                                variant="h5"
                              >
                                <Checkbox
                                  checked={item.pcr.checked}
                                  className={operationErrorsState[day_index].timeSlotError[slot_index].pcr ? classes.daySlotCheckboxError : item.checked && item.pcr.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                  onChange={handleSlotTypeCheckbox(day_index, slot_index, 'pcr')}
                                />
                                <FilledInput
                                  aria-describedby="filled-weight-helper-text"
                                  classes={{ root: operationErrorsState[day_index].timeSlotError[slot_index].pcr ? classes.filledInputRootError : item.checked && item.pcr.checked ? classes.filledInputRootChecked : classes.filledInputRoot }}
                                  // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                  onChange={handleSlotTypeInput(day_index, slot_index, 'pcr')}
                                  value={item.pcr.value}
                                />
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                            >
                              <Typography
                                className={operationErrorsState[day_index].timeSlotError[slot_index].antigen ? classes.slotSubHeaderError : item.antigen.checked ? classes.slotSubHeaderChecked : classes.slotSubHeader}
                                style={{ fontWeight: '600' }}
                              >Antigen</Typography>
                              <Typography
                                className={classes.timeDuration}
                                variant="h5"
                              >
                                <Checkbox
                                  checked={item.antigen.checked}
                                  className={operationErrorsState[day_index].timeSlotError[slot_index].antigen ? classes.daySlotCheckboxError : item.checked && item.antigen.checked ? classes.daySlotCheckboxhecked : classes.daySlotCheckbox}
                                  onChange={handleSlotTypeCheckbox(day_index, slot_index, 'antigen')}
                                />
                                <FilledInput
                                  aria-describedby="filled-weight-helper-text"
                                  classes={{ root: operationErrorsState[day_index].timeSlotError[slot_index].antigen ? classes.filledInputRootError : item.checked && item.antigen.checked ? classes.filledInputRootChecked : classes.filledInputRoot }}
                                  // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                  onChange={handleSlotTypeInput(day_index, slot_index, 'antigen')}
                                  value={item.antigen.value}
                                />
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                            >
                              <Typography
                                align="right"
                                className={classes.slotSubHeaderChecked}
                                style={{ textAlign: 'start', marginLeft: '0px', fontSize: '8px', }}
                              >Slot Difference</Typography>
                              <Select
                                displayEmpty
                                label="Difference"
                                name="Slot Difference"
                                onChange={handleSlotDifferenceChange(day_index, slot_index)}
                                style={{ paddingRight: '18px', paddingLeft: '12px', border: '1px solid #9B9B9B' }}
                                value={item.time_slot_difference || ''}
                              >
                                <MenuItem value="">
                                  <Typography className={brandClasses.selectPlaceholder}>Select Slot Difference</Typography>
                                </MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="15">15</MenuItem>
                                <MenuItem value="20">20</MenuItem>
                                <MenuItem value="30">30</MenuItem>
                              </Select>
                            </Grid>
                            <Typography
                              className={classes.slotSubHeaderErrorContent}
                              variant="h5"
                            >{operationErrorsState[day_index].timeSlotError[slot_index].error}</Typography>
                          </Grid>
                        </React.Fragment>
                      ))}
                      <Grid
                        item
                        xs={3}
                      />
                      <Grid
                        item
                        xs={4}
                      >
                        <FormControlLabel
                          className={!day.active ? classes.dayCheckbox : classes.dayCheckboxChecked}
                          control={<Checkbox
                            checked={!day.active}
                            onChange={handleClosedChange(day_index)}
                                   />}
                          label="Closed"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={5}
                      />
                      <Grid
                        item
                        xs={3}
                      />
                      <Grid
                        item
                        xs={4}
                      >
                        <Button
                          className={classes.button}
                          onClick={addNewTimeSlot(day_index)}
                          startIcon={<AddIcon />}
                          style={{ marginLeft: '6px' }}
                        >
                          Add another time slot
                        </Button>

                      </Grid>
                      <Grid
                        item
                        xs={5}
                      />
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            <div className={brandClasses.footerMessage}>
              {displayError ? <Alert
                onClose={() => { closeErrorMessage() }}
                severity="error"
              >{displayError}</Alert> : null}
              {displaySuccess ? <Alert
                onClose={() => { closeSuccessMessage() }}
                severity="success"
              >{displaySuccess}</Alert> : null}
            </div>
            <div className={brandClasses.footerButton}>
              {/* <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
                style={{ borderRadius: '4px' }}
              >
                DONE {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button> */}
              <TextButton
                disabled={loading}
                type="submit"
              >
                DONE {loading ? <CircularProgress
                  className={brandClasses.progressSpinner}
                  size={20}
                /> : ''}
              </TextButton>
            </div>
          </form>
        )}
      </div>

      <DialogAlert
        message={'Do you want to Add another Location details ?'}
        onAction={handleDialogAction}
        onClose={handleDialogClose}
        open={dialogOpen}
        title={'Location saved successfully.'}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
      />

      <DialogAlertOperationConfirmation
        message={'Do you want to save without adding operation details ?'}
        onAction={handleDialogOperationAction}
        onClose={handleDialogOperationClose}
        open={dialogOperationOpen}
        title={'Are you sure?'}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
      />
    </div>
  );
};

AddLocation.propTypes = {
  updateStep: PropTypes.func,
  isWelcomePage: PropTypes.bool,
  addLocation: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  clearLocations: PropTypes.func.isRequired,
  getInventoryAvailable: PropTypes.func.isRequired
};

export default connect(null, { addLocation, uploadImage, clearLocations,
  //  getInventoryAvailable 
})(AddLocation);
