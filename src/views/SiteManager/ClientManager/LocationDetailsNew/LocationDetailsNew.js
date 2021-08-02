import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Grid, Button, Box, Paper, Checkbox, Select, MenuItem,
    FormControlLabel, Typography, IconButton,
    CircularProgress, Accordion, AccordionSummary, AccordionDetails,
    TextField, FilledInput, Popover
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { handleImage } from 'helpers';
import { withRouter } from 'react-router-dom';
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
import { getLocation, updateLocation1, apiUrl, getInventoryAvailable, getInventoryCountsByLocation, uploadImage } from 'actions/api';
import { clearLocations } from 'actions/clear';
import DialogAlert from 'components/DialogAlert';
import TextButton from 'components/Button/TextButton';
import * as appConstants from 'constants/appConstants';
// import ZipCodeInput from 'components/ZipCodeInput';
import NpiInput from 'components/NpiInput';
import NumberFormat from 'react-number-format';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    editIcon: {
        color: '#FFFFFF',
        fontSize: theme.spacing(1)
    },
    editIconHours: {
        color: theme.palette.brandGray,
        fontSize: '1rem',
        padding: '12px 0px 12px 12px',
        '& svg': {
            fontSize: '1.2rem',
        }
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
    editBtn: {
        backgroundColor: '#25B3B4',
        color: theme.palette.white,
        textTransform: 'capitalize',
        fontSize: '16px',
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: '#25B3B4'
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
            width: '75px'
        },
        '& .MuiIconButton-root': {
            color: theme.palette.brandDark
        },
        '& button': {
            padding: 0
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
        padding: theme.spacing(2),
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
    subHeading: {
        background: '#0F84A9',
        padding: theme.spacing(1),
        '& .MuiTypography-h5': {
            color: "#FFFFFF"
        }
    },
    locationFields: {
        padding: theme.spacing(1)
    },
    locationFieldItems: {
        padding: theme.spacing(1)
    },
    sitelogo: {
        padding: theme.spacing(1),
        border: '1px solid #0F84A9',
        boxShadow: '0px 4px 4px rgba(4, 59, 93, 0.15)',
        borderRadius: '5px',
        '& .MuiTypography-h6': {
            color: "#788081"
        }
    }
}));

// const ActiveButton = withStyles(theme => ({
//     root: {
//         color: '#25DD83',
//         borderColor: '#25DD83',
//         borderRadius: 20,
//         textTransform: 'Capitalize',
//         fontSize: '26px',
//         fontWeight: 500,
//         letterSpacing: 0,
//         lineHeight: '35px',
//         '&:hover': {},
//         [theme.breakpoints.up('lg')]: {
//             fontSize: '26px'
//         },
//         [theme.breakpoints.between('sm', 'lg')]: {
//             fontSize: '20px'
//         },
//         [theme.breakpoints.down('sm')]: {
//             fontSize: '18px'
//         }
//     }
// }))(Button);

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

const LocationDetailsNew = props => {
    const { history, location, getLocation, updateLocation1, clearLocations, getInventoryAvailable, getInventoryCountsByLocation, uploadImage } = props;

    const classes = useStyles();
    const brandClasses = brandStyles();

    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
    const [locationDetails, setLocationDetails] = useState(null);
    const [formState, setFormState] = useState({ provider: {} });
    const [modifiedData, setModifiedData] = useState({});
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

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const locationId = qs.parse(location.search, { ignoreQueryPrefix: true }).location_id;

    useEffect(() => {
        if (locationId) {
            setSelectedInventory([]);
            async function fetchData() {
                const res = await getLocation(locationId);
                setFetchLoading(false);
                if (res.success) {
                    if (res.data) {
                        res.data.admin_name = res.data.admin_first_name && res.data.admin_last_name ? res.data.admin_first_name + " " + res.data.admin_last_name : res.data.admin_first_name ? res.data.admin_first_name + "" + (res.data.admin_last_name ? res.data.admin_last_name : '') : res.data.admin_last_name ? res.data.admin_last_name : '';
                        res.data.eoc_name = res.data.eoc_first_name && res.data.eoc_last_name ? res.data.eoc_first_name + " " + res.data.eoc_last_name : res.data.eoc_first_name ? res.data.eoc_first_name + "" + (res.data.eoc_last_name ? res.data.eoc_last_name : '') : res.data.eoc_last_name ? res.data.eoc_last_name : '';
                        if (!res.data.provider) res.data.provider = {};
                        res.data.provider.name = res.data.provider.first_name && res.data.provider.last_name ? res.data.provider.first_name + " " + res.data.provider.last_name : res.data.provider.first_name ? res.data.provider.first_name + "" + (res.data.provider.last_name ? res.data.provider.last_name : '') : res.data.provider.last_name ? res.data.provider.last_name : '';
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

    const handleEdit = (field, isEditing) => event => {
        event.preventDefault();
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

    // const SaveButton = () => {
    //     return (
    //         <Button
    //             className={brandClasses.button}
    //             classes={{ disabled: brandClasses.buttonDisabled }}
    //             style={{ marginTop: 16, float: 'right' }}
    //             disabled={saveLoading}
    //             type="submit"
    //         >
    //             Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
    //         </Button>
    //     );
    // };

    const handleChange = e => {
        e.persist();
        setDisplayError(null);
        if (e.target.name === 'admin_name') {
            let name = e.target.value.split(" ")
            let first_name = e.target.value.split(" ")[0];
            name.shift();
            let last_name = e.target.value.split(" ").length > 1 ? name.join('') : "";
            setFormState(formState => ({
                ...formState,
                admin_first_name: first_name, admin_last_name: last_name, admin_name: e.target.value
            }));
            setModifiedData(modifiedData => ({
                ...modifiedData,
                admin_first_name: first_name, admin_last_name: last_name, admin_name: e.target.value
            }))
        } else if (e.target.name === 'eoc_name') {
            let name = e.target.value.split(" ")
            let first_name = e.target.value.split(" ")[0];
            name.shift();
            let last_name = e.target.value.split(" ").length > 1 ? name.join('') : "";
            setFormState(formState => ({
                ...formState,
                eoc_first_name: first_name, eoc_last_name: last_name, eoc_name: e.target.value
            }));
            setModifiedData(modifiedData => ({
                ...modifiedData,
                eoc_first_name: first_name, eoc_last_name: last_name, eoc_name: e.target.value
            }))
        } else {
            setFormState(formState => ({
                ...formState,
                [e.target.name]: e.target.value
            }));
            setModifiedData(modifiedData => ({
                ...modifiedData,
                [e.target.name]: e.target.value
            }))

        }
    };

    const handleProviderChange = e => {
        e.persist();
        setDisplayError(null);
        let temp = formState.provider;
        if (e.target.name === 'name') {
            let name = e.target.value.split(" ")
            temp.first_name = e.target.value.split(" ")[0];
            name.shift();
            temp.last_name = e.target.value.split(" ").length > 1 ? name.join('') : "";
            temp.name = e.target.value;
        } else {
            temp[e.target.name] = e.target.value;
        }
        setFormState({ ...formState, 'provider': temp });
        setModifiedData(modifiedData => ({
            ...modifiedData, 'provider': temp
        }))
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
            // case 'name':
            //   return { name: formState.name };
            // case 'phone':
            //   return { phone: formState.phone };
            // case 'address':
            //   return {
            //     address: formState.address,
            //     address2: formState.address2,
            //     city: formState.city,
            //     state: formState.state,
            //     zip_code: formState.zip_code,
            //     county: formState.county,
            //   };
            // case 'admin_contact':
            //   return {
            //     admin_first_name: formState.admin_first_name,
            //     admin_last_name: formState.admin_last_name,
            //     admin_office_phone: formState.admin_office_phone,
            //     admin_office_ext: formState.admin_office_ext,
            //     admin_email: formState.admin_email
            //   };
            // case 'provider':
            //   return {
            //     provider: {
            //       first_name: formState.provider.first_name,
            //       last_name: formState.provider.last_name,
            //       npi: formState.provider.npi,
            //       phone: formState.provider.phone,
            //       email: formState.provider.email,
            //       address: formState.provider.address,
            //       address2: formState.provider.address2,
            //       city: formState.provider.city,
            //       state: formState.provider.state,
            //       zip_code: formState.provider.zip_code,
            //     }
            //   };
            // case 'eoc_details':
            //   return {
            //     eoc_first_name: formState.eoc_first_name,
            //     eoc_last_name: formState.eoc_last_name,
            //     eoc_office_phone: formState.eoc_office_phone,
            //     eoc_ext: formState.eoc_ext,
            //     eoc_email: formState.eoc_email
            //   };
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
        // if (key === 'site_logo') {
        // else {
        //   setEditSection({});
        // }
        // }
        if (key === 'hours_of_operations') {
            let body = keyToObject(key);
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
        }
        else if (imgState.imagePath) {
            let body = modifiedData;
            setSaveLoading(true);
            const locationLogoData = new FormData();
            locationLogoData.append('uploadImage', imgState.imagePath);
            const resLocationLogo = await uploadImage(locationLogoData);
            setSaveLoading(false);
            if (resLocationLogo.success) {
                body.site_logo = '/images/' + resLocationLogo.data;
                modifyLocation(body);
            }
        }
        else {
            let body = modifiedData;
            let modifiedDataKey = Object.keys(modifiedData)
            if (modifiedDataKey.length !== 0) {
                modifyLocation(body);
            } else {
                setEditSection({});
                setModifiedData({});
            }
        }
    };

    const modifyLocation = async (body) => {
        if (formState.provider.npi && formState.provider.npi.trim().length < 10)
            return setDisplayError(`Invalid Provider NPI number.`);
        setSaveLoading(true);
        const res = await updateLocation1(locationDetails._id, body);
        setSaveLoading(false);
        if (res.success) {
            clearLocations();
            setEditSection({});
            setModifiedData({});
            setRefetchLocation(refetchLocation => refetchLocation + 1);
        }
    };

    const handlePreviewClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteSiteLogo = event => {
        event.preventDefault();
        setImgState({});
        if (formState.site_logo) {
            setFormState(formState => ({
                ...formState,
                site_logo: ""
            }));
            setModifiedData(modifiedData => ({
                ...modifiedData,
                site_logo: ""
            }))
        }

    }

    return (
        <div className={classes.root}>
            {/* {fetch} */}
            {fetchLoading
                ? <CircularProgress />
                : locationDetails
                    ?
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className={classes.header} >
                                <div className={classes.subHeader}>
                                    <img src="/images/svg/building_icon.svg" alt="" />&ensp;
                <Typography variant="h2" className={brandClasses.headerTitle}>
                                        {'LOCATION MANAGER |'}
                                    </Typography>
                                    <Typography variant="h4" className={classes.headerSubTitle}>
                                        {formState.name || ''}
                                    </Typography>
                                </div>
                                {editSection.location_edit ? <>
                                    {/* <Button
                                        className={brandClasses.button}
                                        classes={{ disabled: brandClasses.buttonDisabled }}
                                        style={{ marginTop: 16, float: 'right' }}
                                        disabled={saveLoading}
                                        type="submit"
                                    >
                                        Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                    </Button> */}
                                    <TextButton disabled={saveLoading} type="submit">
                                        Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                    </TextButton>
                                </> : <>
                                    {/* <Button
                                        variant="contained"
                                        type="button"
                                        className={classes.editBtn}
                                        startIcon={<Edit className={classes.editIcon} />}
                                        onClick={handleEdit('location_edit', true)}>
                                        {'EDIT LOCATION'}
                                    </Button> */}
                                    <TextButton 
                                        category="Icon" 
                                        startIcon={<Edit className={classes.editIcon} />} 
                                        onClick={handleEdit('location_edit', true)}>
                                        EDIT LOCATION
                                    </TextButton>
                                </>}

                            </div>
                            {editSection.location_edit && displayError && (
                                <Grid container justify={'flex-end'}>
                                    <Grid className={classes.submitBtnOperations} item xs={12}>
                                        <div className={brandClasses.footerMessage}>
                                            {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
                                        </div>
                                        {/* <SaveButton /> */}
                                    </Grid>
                                </Grid>
                            )}
                            {/* location info */}
                            <Grid container direction="column" justifycontent="center" alignItems="center" className={classes.subHeading}>
                                <Typography variant="h5">LOCATION INFORMATION</Typography>
                            </Grid>
                            <Grid container direction="row" justifyontent="center" alignItems="center" className={classes.locationFields}>
                                {editSection.location_edit ? <>
                                    <Grid item sm={8}>
                                        <Grid container direction="row">
                                            <Grid item sm={6} className={classes.locationFieldItems}>
                                                <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                    {'Location Name'}
                                                </Typography>
                                                <TextField
                                                    type="text"
                                                    // label="Location Name"
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
                                            </Grid>
                                            <Grid item sm={6} className={classes.locationFieldItems}>
                                                <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                    {'Phone Number'}
                                                </Typography>
                                                <NumberFormat
                                                    customInput={TextField}
                                                    mask=" "
                                                    type="tel"
                                                    // label="Admin Office Phone"
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
                                            {/* <Grid item sm={4} className={classes.locationFieldItems}>
                                                <Grid item container justify="flex-start" alignItems="center">
                                                    {formState.site_logo && (
                                                        <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                                                    )}
                                                </Grid>
                                            </Grid> */}
                                            <Grid item sm={8} className={classes.locationFieldItems}>
                                                <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                    {'Address'}
                                                </Typography>
                                                <TextField
                                                    type="text"
                                                    // label="Address"
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
                                                {/* <Grid container direction="row" justifycontent="center" alignItems="center" spacing={3}>
                                        <Grid item sm={3}>
                                           
                                        </Grid>
                                        <Grid item sm={3}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Address2'}
                                            </Typography>
                                            <TextField
                                                type="text"
                                                // label="Address 2"
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
                                        <Grid item sm={2}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'City'}
                                            </Typography>
                                            <TextField
                                                type="text"
                                                // label="City"
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
                                        <Grid item sm={2}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'State'}
                                            </Typography>
                                            <FormControl
                                                className={brandClasses.shrinkTextField}
                                                required
                                                fullWidth
                                                variant="outlined"
                                            >
                                                <Select
                                                    onChange={handleChange}
                                                    // label="State* "
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
                                        <Grid item sm={2}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Zip Code'}
                                            </Typography>
                                            <ZipCodeInput
                                                // label="Zip Code"
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
                                    </Grid> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={4}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Site Logo'}
                                        </Typography>
                                        <div className={classes.sitelogo}>
                                            <Grid container direction="row">
                                                <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                    {'preview'}
                                                </Typography>
                                            </Grid>
                                            <Grid container direction="column" justifycontent="center" alignItems="center">

                                                {imgState.imgURL
                                                    ? <img src={imgState.imgURL} className={brandClasses.uploadedPhoto} alt="img" />
                                                    : formState.site_logo
                                                        ? <img src={apiUrl + formState.site_logo} className={brandClasses.uploadedPhoto} alt="img" />
                                                        : <Typography className={brandClasses.uploadDesc}>Upload Site Logo</Typography>
                                                }
                                                {/* {formState.site_logo && (
                                                    <img src={apiUrl + formState.site_logo} style={{ maxWidth: '100px', maxHeight: '100px' }} alt="img" />
                                                )} */}
                                            </Grid>
                                            <Grid container direction="row" justifycontent="flex-end" alignItems="flex-end">
                                                <Grid item sm={10}></Grid>
                                                <Grid item sm={2}>
                                                    <div className={brandClasses.uploadImageContainer}>
                                                        <input type="file" accept="image/*" className={brandClasses.uploadInput} id="icon-button-file" onChange={handlePhotoChange} />
                                                        <label htmlFor="icon-button-file" style={{ cursor: 'pointer', display: 'flex' }}>
                                                            <img src="/images/svg/upload.svg" alt="" align="right" />
                                                            <IconButton onClick={handleDeleteSiteLogo} classes={{ root: classes.editIconHours }}>
                                                                <Delete />
                                                            </IconButton>
                                                            {imgCompressionLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                                        </label>
                                                    </div>

                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>

                                </> :
                                    <>
                                        <Grid item sm={8}>
                                            <Grid container direction="row">
                                                <Grid item sm={6} className={classes.locationFieldItems}>
                                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                        {'Location Name'}
                                                    </Typography>
                                                    <Typography variant="h6" align="left" className={classes.labelValue}>
                                                        {formState.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item sm={6} className={classes.locationFieldItems}>
                                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                        {'Phone Number'}
                                                    </Typography>
                                                    <Typography variant="h6" align="left" className={classes.labelValue}>
                                                        {formState.phone}
                                                    </Typography>
                                                </Grid>
                                                <Grid item sm={8} className={classes.locationFieldItems}>
                                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                        {'Address'}
                                                    </Typography>
                                                    <Typography variant="h6" align="left" className={classes.labelValue}>
                                                        {formState.address}
                                                    </Typography>
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Site Logo'}
                                            </Typography>
                                            {formState.site_logo ? <>
                                                <div className={classes.sitelogo}>
                                                    <Grid container direction="row">
                                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                            {'preview'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid container direction="column" justifycontent="center" alignItems="center">
                                                        {formState.site_logo && (
                                                            <img src={apiUrl + formState.site_logo} style={{ maxWidth: '100px', maxHeight: '100px' }} alt="img" />
                                                        )}
                                                    </Grid>
                                                </div>
                                            </> : '-'}
                                        </Grid>
                                    </>}
                            </Grid>
                            {/* inventory info */}
                            <Grid container direction="column" justifycontent="center" alignItems="center" className={classes.subHeading}>
                                <Typography variant="h5">INVENTORY</Typography>
                            </Grid>
                            <Grid container direction="row" justifycontent="center" alignItems="center" className={classes.locationFields}>

                                <Grid item sm={4} className={classes.locationFieldItems}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'Vaccine'}
                                    </Typography>
                                    <Typography variant="h6" align="left" className={classes.labelValue}>
                                        {locationAllocatedCounts.vaccine}
                                    </Typography>
                                </Grid>
                                <Grid item sm={4} className={classes.locationFieldItems}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'PCR'}
                                    </Typography>
                                    <Typography variant="h6" align="left" className={classes.labelValue}>
                                        {locationAllocatedCounts.pcr}
                                    </Typography>
                                </Grid>
                                <Grid item sm={4} className={classes.locationFieldItems}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'Antigen'}
                                    </Typography>
                                    <Typography variant="h6" align="left" className={classes.labelValue}>
                                        {locationAllocatedCounts.antigen}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* provider info */}
                            <Grid container direction="column" justifycontent="center" alignItems="center" className={classes.subHeading}>
                                <Typography variant="h5">PROVIDER INFORMATION</Typography>
                            </Grid>
                            <Grid container direction="row" justifycontent="center" alignItems="center" className={classes.locationFields} spacing={3}>
                                {editSection.location_edit ? <>
                                    <Grid item sm={3}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Provider Name'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="Provider Last Name"
                                            placeholder="Enter provider's  name"
                                            name="name"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleProviderChange}
                                            value={formState.provider.name || ''}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    {/* <Grid item sm={3}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'Provider First Name'}
                                    </Typography>
                                    <TextField
                                        type="text"
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
                                </Grid> */}
                                    <Grid item sm={5}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Address'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="Address"
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
                                    {/* <Grid item sm={3}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'Address2'}
                                    </Typography>
                                    <TextField
                                        type="text"
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
                                </Grid> */}
                                    {/* <Grid item sm={2}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'City'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="City"
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
                                    </Grid> */}
                                    {/* <Grid item sm={2}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'State'}
                                    </Typography>
                                    <FormControl
                                        className={brandClasses.shrinkTextField}
                                        required
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <Select
                                            onChange={handleProviderChange}
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
                                <Grid item sm={2}>
                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'Zip Code'}
                                    </Typography>
                                    <ZipCodeInput
                                        placeholder="Enter zip"
                                        name="zip_code"
                                        className={brandClasses.shrinkTextField}
                                        onChange={handleProviderChange}
                                        value={formState.provider.zip_code || ''}
                                        required
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        style={{ height: 52 }}
                                    />
                                </Grid> */}
                                    <Grid item sm={3}><Typography variant="h6" align="left" className={classes.fieldKey}>
                                        {'Signature Request'}
                                    </Typography>
                                        {formState.provider.signature
                                            ? <>
                                                <img src="/images/svg/check.svg" aria-describedby="preview" alt="green check" width="25px" style={{ cursor: 'pointer' }} onClick={handlePreviewClick} /> &ensp;
                                                    <Popover
                                                    id="preview"
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'center',
                                                    }}
                                                >
                                                    <div className={brandClasses.uploadContanier}>
                                                        <img src={apiUrl + formState.provider.signature} className={brandClasses.uploadedPhoto} alt="img" />
                                                    </div>
                                                </Popover>
                                                <Typography variant="h6" align="left" className={classes.completeLabel}>
                                                    Completed
                                  </Typography></>
                                            : <Typography variant="h5" className={classes.completeLabel}>
                                                Check your provider Email for adding Signature
                                </Typography>
                                        }
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Phone Number'}
                                        </Typography>
                                        <NumberFormat
                                            customInput={TextField}
                                            mask=" "
                                            type="tel"
                                            // label="Phone"
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
                                    <Grid item sm={3}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Email'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="Email Address"
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
                                    <Grid item sm={3}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'NPI'}
                                        </Typography>
                                        <NpiInput
                                            // label="NPI"
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
                                </>
                                    :
                                    <>

                                        <Grid item sm={3} className={classes.locationFieldItems}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Provider Name'}
                                            </Typography>
                                            <Typography variant="h6" align="left" className={classes.labelValue}>
                                                {(formState.provider && formState.provider.last_name) || (formState.provider && formState.provider.first_name) ? `${formState.provider && formState.provider.first_name}  ${formState.provider && formState.provider.last_name}` : '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={6} className={classes.locationFieldItems}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Address'}
                                            </Typography>
                                            <Typography variant="h6" align="left" className={classes.labelValue}>
                                                {(formState.provider && formState.provider.address) || (formState.provider && formState.provider.address) ? formState.provider.address : '-'}
                                            </Typography>
                                        </Grid>
                                        {/* <Grid item sm={3} className={classes.locationFieldItems}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'City'}
                                            </Typography>
                                            <Typography variant="h6" align="left" className={classes.labelValue}>
                                                {(formState.provider && formState.provider.city) ? formState.provider.city : '-'}
                                            </Typography>
                                        </Grid> */}
                                        <Grid item sm={3} className={classes.locationFieldItems}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Signature Request'}
                                            </Typography>
                                            {formState.provider.signature ?
                                                <>
                                                    <img src="/images/svg/check.svg" aria-describedby="preview" alt="green check" width="25px" style={{ cursor: 'pointer' }} onClick={handlePreviewClick} /> &ensp;
                                                    <Popover
                                                        id="preview"
                                                        open={open}
                                                        anchorEl={anchorEl}
                                                        onClose={handleClose}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'center',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'center',
                                                        }}
                                                    >
                                                        <div className={brandClasses.uploadContanier}>
                                                            <img src={apiUrl + formState.provider.signature} className={brandClasses.uploadedPhoto} alt="img" />
                                                        </div>
                                                    </Popover>
                                                    <Typography variant="h6" align="left" className={classes.completeLabel}>
                                                        Completed
                                  </Typography>
                                                </>
                                                :
                                                <Typography variant="h6" align="left" className={classes.completeLabel}>
                                                    Check your provider Email for adding Signature
                                </Typography>
                                            }
                                        </Grid>
                                        <Grid item sm={3} className={classes.locationFields}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Phone Number'}
                                            </Typography>
                                            <Typography variant="h6" align="left" className={classes.labelValue}>
                                                {(formState.provider && formState.provider.phone) ? formState.provider.phone : '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={3} className={classes.locationFields}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Email'}
                                            </Typography>
                                            <Typography variant="h6" align="left" className={classes.labelValue}>
                                                {(formState.provider && formState.provider.email) ? formState.provider.email : '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={3} className={classes.locationFields}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'NPI'}
                                            </Typography>
                                            <Typography variant="h6" align="left" className={classes.labelValue}>
                                                {(formState.provider && formState.provider.npi) ? formState.provider.npi : '-'}
                                            </Typography>
                                        </Grid>
                                    </>}
                            </Grid>
                            {/* administrative info */}
                            <Grid container direction="column" justifycontent="center" alignItems="center" className={classes.subHeading}>
                                <Typography variant="h5">ADMINISTRATIVE CONTACT </Typography>
                            </Grid>
                            <Grid container direction="row" justifycontent="center" alignItems="center" className={classes.locationFields} spacing={3}>
                                {editSection.location_edit ? <>
                                    <Grid item sm={4}>
                                        {/* <Grid container direction="row" justifycontent="center" alignItems="center" spacing={3}>
                                        <Grid item sm={6}> */}
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Administrative Contact'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="First Name"
                                            placeholder="Enter first name"
                                            name="admin_name"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleChange}
                                            value={formState.admin_name || ''}
                                            required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />
                                        {/* </Grid> */}
                                        {/* <Grid item sm={6}>
                                            <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                {'Administrative Contact'}
                                            </Typography>
                                            <TextField
                                                type="text"
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

                                        </Grid> */}
                                        {/* </Grid> */}
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Phone Number'}
                                        </Typography>
                                        <NumberFormat
                                            customInput={TextField}
                                            mask=" "
                                            type="tel"
                                            // label="Admin Office Phone"
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
                                    <Grid item sm={2}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Extension'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="Ext."
                                            placeholder="Enter Ext"
                                            name="admin_office_ext"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleChange}
                                            value={formState.admin_office_ext || ''}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Email'}
                                        </Typography>
                                        <TextField
                                            type="email"
                                            // label="Email"
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
                                </> : <>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Administrative Contact'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {(formState.admin_first_name || formState.admin_last_name) ? formState.admin_first_name + " " + formState.admin_last_name : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Phone Number'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {formState.admin_office_phone ? formState.admin_office_phone : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Extension'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {formState.admin_office_ext ? formState.admin_office_ext : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Email'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {formState.admin_email ? formState.admin_email : '-'}
                                        </Typography>
                                    </Grid></>}

                            </Grid>
                            {/* eoc info */}
                            <Grid container direction="column" justifycontent="center" alignItems="center" className={classes.subHeading}>
                                <Typography variant="h5">EOC CONTACT</Typography>
                            </Grid>
                            <Grid container direction="row" justifycontent="center" alignItems="center" className={classes.locationFields}>
                                {editSection.location_edit ? <>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'EOC Contact'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="First Name"
                                            placeholder="Enter first name"
                                            name="eoc_name"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleChange}
                                            value={formState.eoc_name || ''}
                                            // required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Phone Number'}
                                        </Typography>
                                        <NumberFormat
                                            customInput={TextField}
                                            mask=" "
                                            type="tel"
                                            // label="Admin Office Phone"
                                            placeholder="(000) 000-0000"
                                            name="eoc_office_phone"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleChange}
                                            value={formState.eoc_office_phone || ''}
                                            // required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />

                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Extension'}
                                        </Typography>
                                        <TextField
                                            type="text"
                                            // label="Ext."
                                            placeholder="Enter Ext"
                                            name="eoc_ext"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleChange}
                                            value={formState.eoc_ext || ''}
                                            // required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />

                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Email'}
                                        </Typography>
                                        <TextField
                                            type="email"
                                            // label="Email"
                                            placeholder="Enter email address"
                                            name="eoc_email"
                                            className={brandClasses.shrinkTextField}
                                            onChange={handleChange}
                                            value={formState.eoc_email || ''}
                                            // required
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </> : <>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'EOC Contact'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {(formState.eoc_first_name || formState.eoc_last_name) ? formState.eoc_first_name + " " + formState.eoc_last_name : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Phone Number'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {formState.eoc_office_phone ? formState.eoc_office_phone : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Extension'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {formState.eoc_ext ? formState.eoc_ext : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={3} className={classes.locationFieldItems}>
                                        <Typography variant="h6" align="left" className={classes.fieldKey}>
                                            {'Email'}
                                        </Typography>
                                        <Typography variant="h6" align="left" className={classes.labelValue}>
                                            {formState.eoc_email ? formState.eoc_email : '-'}
                                        </Typography>
                                    </Grid>
                                </>}

                            </Grid>
                        </form>
                        <Grid container direction="column" justifycontent="center" alignItems="center" className={classes.subHeading} style={{ marginBottom: '40px' }}>
                            <Typography variant="h5">HOURS OF OPERATION</Typography>
                        </Grid>
                        <div className={classes.item}>


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
                                                    <Typography variant="h6" align="left" className={classes.fieldKey}>
                                                        {'Operations Times'}
                                                    </Typography>
                                                    <Grid item>
                                                        {editSection.hours_of_operations ? <>
                                                            {/* <Button
                                                                className={brandClasses.button}
                                                                classes={{ disabled: brandClasses.buttonDisabled }}
                                                                style={{ marginTop: 16, float: 'right' }}
                                                                disabled={saveLoading}
                                                                type="submit"
                                                            >
                                                                Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                                            </Button> */}
                                                            <TextButton disabled={saveLoading} type="submit">
                                                                Save {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                                            </TextButton>
=======
                                                               
                                                        </> : <>
                                                            {/* <Button
                                                                variant="contained"
                                                                className={classes.editBtn}
                                                                startIcon={<Edit className={classes.editIcon} />}
                                                                onClick={handleEdit('hours_of_operations', true)}>
                                                                {'EDIT OPERATION HOURS'}
                                                            </Button> */}
                                                            <TextButton startIcon={<Edit className={classes.editIcon} />}
                                                                onClick={handleEdit('hours_of_operations', true)}>
                                                                EDIT OPERATION HOURS
                                                            </TextButton>
                                                        </>}

                                                        {/* {editSection.hours_of_operations ? (
                                                            <IconButton
                                                                onClick={() => handleEdit('hours_of_operations', false)}>
                                                                <CancelOutlinedIcon />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton
                                                                onClick={() => handleEdit('hours_of_operations', true)}>
                                                                <Edit className={classes.editIcon} />
                                                            </IconButton>
                                                        )} */}
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
                                                        <Typography variant="h6" align="left" className={classes.fieldKey} style={{ paddingTop: 11, paddingLeft: 30 }}>
                                                            <span style={{ color: '#DE50A4', fontSize: '12px' }}>Total Vaccine: {inventoryAvailableCount.vaccine}</span>&nbsp;&nbsp;&nbsp;
                              <span style={{ color: '#3ECCCD', fontSize: '12px' }}>Total PCR: {inventoryAvailableCount.pcr}</span>&nbsp;&nbsp;&nbsp;
                              <span style={{ color: '#FBC23C', fontSize: '12px' }}>Total Antigen: {inventoryAvailableCount.antigen}</span>&nbsp;&nbsp;&nbsp;
                              {inventoryError ? <span style={{ color: '#DD2525', fontSize: '12px' }}>{inventoryError}</span> : ''}
                                                        </Typography>
                                                    </Grid>
                                                }
                                                <Grid container className={classes.operationHeader}>
                                                    <Grid item xs={3}>Day of the week</Grid>
                                                    <Grid item xs={4} style={{ textAlign: 'center' }} >Hours of operation</Grid>
                                                    <Grid item xs={5} style={{ textAlign: 'center' }}>Slots</Grid>
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
                                                                <Grid item xs={2} style={{ paddingLeft: '24px' }}>
                                                                    <div className={classes.dayRow}>
                                                                        {day.day_name}&ensp;
                                    {expanded === `panel${day_index}`
                                                                            ? <img src="/images/svg/chevron_blue_down.svg" style={{ height: 12, width: 18 }} alt="" />
                                                                            : <img src="/images/svg/chevron_blue_right.svg" style={{ height: 18, width: 12 }} alt="" />
                                                                        }
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={5} style={{ textAlign: 'center' }} className={classes.timeText} >
                                                                    {day.active
                                                                        ? day.time_slots.map((ts, x) =>
                                                                            ts.checked && (<Typography key={x} style={{ color: '#0F84A9' }}>{moment(ts.start_time, 'HH:mm').format('LT') + ' - ' + moment(ts.end_time, 'HH:mm').format('LT')}</Typography>)
                                                                        )
                                                                        : <Typography style={{ color: '#D8D8D8', fontWeight: "600" }}>Closed</Typography>
                                                                    }
                                                                </Grid>
                                                                <Grid item xs={5} >
                                                                    {day.active
                                                                        ? day.time_slots.map((item, x) =>
                                                                            item.checked && (
                                                                                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                                                                                    <Grid item sm={4}>
                                                                                        <Typography key={x} align="left" style={{ color: '#043B5D' }} display="inline">
                                                                                            <span style={{ color: '#DE50A4' }}>Vaccine:</span>
                                                                                        </Typography>
                                                                                        <Typography align="left" display="inline"> {item.vaccine.checked ? item.vaccine.value : 0}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item sm={4}>
                                                                                        <Typography key={x} align="left" style={{ color: '#043B5D' }} display="inline">
                                                                                            <span style={{ color: '#3ECCCD' }}>PCR:</span></Typography>
                                                                                        <Typography align="left" display="inline"> {item.pcr.checked ? item.pcr.value : 0}</Typography></Grid>
                                                                                    <Grid item sm={4}>
                                                                                        <Typography key={x} align="left" style={{ color: '#043B5D' }} display="inline">
                                                                                            <span style={{ color: '#FBC23C' }}>Antigen:</span></Typography>
                                                                                        <Typography align="left" display="inline"> {item.antigen.checked ? item.antigen.value : 0}</Typography></Grid>
                                                                                </Grid>
                                                                            )
                                                                        )
                                                                        : <Typography style={{ color: '#D8D8D8', fontWeight: "600", textAlign: 'center' }}>- - -</Typography>
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </AccordionSummary>
                                                        <AccordionDetails style={{ backgroundColor: '#F1F6F8' }} >
                                                            <Grid container direction="row"
                                                                justify="center"
                                                                alignItems="center" >
                                                                {day.time_slots.map((ts, slot_index) => (<>
                                                                    {/* // <div key={slot_index}> */}
                                                                    <Grid item xs={2}>
                                                                        <div className={classes.dayRow} style={{ display: 'none' }}>
                                                                            {day.day_name}&ensp;
                                                                            </div>
                                                                    </Grid>
                                                                    <Grid item xs={1}>
                                                                        <div className={classes.dayRow} style={{ display: 'none' }}>
                                                                            {day.day_name}&ensp;
                                                                            </div>
                                                                    </Grid>
                                                                    <Grid item xs={4}>
                                                                        {!ts.edit
                                                                            ? <>
                                                                                <Grid container direction="row">
                                                                                    <Grid item sm={8}>
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
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                    <Grid item sm={2}>
                                                                                        <Typography
                                                                                            variant="h5"
                                                                                            className={classes.timeDuration}
                                                                                        >
                                                                                            <IconButton style={{padding:'4px'}} onClick={() => handleTimeSlotEdit(day_index, slot_index, true)} classes={{ root: classes.editIconHours }}>
                                                                                                <Edit />
                                                                                            </IconButton></Typography>
                                                                                    </Grid>
                                                                                    <Grid item sm={2}>

                                                                                        <Typography
                                                                                            variant="h5"
                                                                                            className={classes.timeDuration}
                                                                                        ><IconButton style={{padding:'4px'}} onClick={() => handleTimeSlotDelete(day_index, slot_index)} classes={{ root: classes.editIconHours }}>
                                                                                                <Delete />
                                                                                            </IconButton>
                                                                                        </Typography>
                                                                                    </Grid></Grid></>
                                                                            :
                                                                            <Grid container direction="row" alignItems="center" style={{ padding: '0 12px' }}>
                                                                                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                                                                    <KeyboardTimePicker
                                                                                        value={moment(ts.start_time, 'HH:mm')}
                                                                                        onChange={handleStartTimeChange(day_index, slot_index)}
                                                                                        className={classes.timeField}
                                                                                        keyboardIcon={<AccessTimeIcon style={{ color: "#9B9B9B" }} />}
                                                                                    />
                                                                                    <Typography variant="h5" className={classes.operationDescription}>
                                                                                        {'-'}
                                                                                    </Typography>
                                                                                    <KeyboardTimePicker
                                                                                        value={moment(ts.end_time, 'HH:mm')}
                                                                                        onChange={handleEndTimeChange(day_index, slot_index)}
                                                                                        className={classes.timeField}
                                                                                        keyboardIcon={<AccessTimeIcon style={{ color: "#9B9B9B" }} />}
                                                                                    // minDate={day.displayStartTime}
                                                                                    />
                                                                                </MuiPickersUtilsProvider>
                                                                                <IconButton onClick={() => handleTimeSlotEdit(day_index, slot_index, false)} classes={{ root: classes.editIconHours }}>
                                                                                    <CancelOutlinedIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        }
                                                                    </Grid>
                                                                    <Grid item xs={5} container spacing={1}>
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
                                                                            <Typography className={classes.slotSubHeaderChecked} align="right" style={{ textAlign: 'start', marginLeft: '0px', fontSize: '8px', }}>Slot Difference</Typography>
                                                                            <Select
                                                                                onChange={handleSlotDifferenceChange(day_index, slot_index)}
                                                                                label="Difference"
                                                                                name="Slot Difference"
                                                                                displayEmpty
                                                                                value={ts.time_slot_difference || ''}
                                                                                style={{ paddingRight: '18px', paddingLeft: '12px', border: '1px solid #9B9B9B' }}
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
                                                                        <Typography variant="h6" align="left" className={classes.slotSubHeaderErrorContent}>{operationErrorsState[day_index].timeSlotError[slot_index].error}</Typography>
                                                                    </Grid>
                                                                    {/* // </div> */}

                                                                </>
                                                                ))}
                                                                <Grid item xs={3}></Grid>
                                                                <Grid item xs={4}>
                                                                    <FormControlLabel style={{ marginLeft: '3px' }}
                                                                        control={<Checkbox onChange={handleClosedChange(day_index)} checked={!day.active} />}
                                                                        label="Closed"
                                                                        className={!day.active ? classes.dayCheckbox : classes.dayCheckboxChecked}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={5}>
                                                                </Grid>
                                                                <Grid item xs={3}></Grid>
                                                                <Grid item xs={4}>
                                                                    <Button
                                                                        className={classes.button} style={{ marginLeft: '6px' }}
                                                                        startIcon={<AddIcon />}
                                                                        onClick={addNewTimeSlot(day_index)}
                                                                    >
                                                                        Add another time slot
                                                                     </Button>

                                                                </Grid>
                                                                <Grid item xs={5}>
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
                                                            <Grid item xs={3} style={{ paddingLeft: '24px' }}>
                                                                <div className={classes.dayRow}>
                                                                    {day.day_name}&ensp;
                                </div>
                                                            </Grid>
                                                            <Grid item xs={4} style={{ textAlign: 'center' }} className={classes.timeText} >
                                                                {day.active
                                                                    ? day.time_slots.map((item, x) =>
                                                                        item.checked && (<Typography style={{ color: '#0F84A9' }} key={x}>{moment(item.start_time, 'HH:mm').format('LT') + ' - ' + moment(item.end_time, 'HH:mm').format('LT')}</Typography>)
                                                                    )
                                                                    : <Typography style={{ color: '#D8D8D8' }}>Closed</Typography>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={5} style={{ textAlign: 'left' }}>
                                                                {day.active
                                                                    ? day.time_slots.map((item, x) =>
                                                                        <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                                                                            <Grid item sm={4}>
                                                                                <Typography key={x} align="left" style={{ color: '#043B5D' }} display="inline">
                                                                                    <span style={{ color: '#DE50A4' }}>Vaccine:</span>
                                                                                </Typography>
                                                                                <Typography align="left" display="inline"> {item.vaccine.checked ? item.vaccine.value : 0}</Typography>
                                                                            </Grid>
                                                                            <Grid item sm={4}>
                                                                                <Typography key={x} align="left" style={{ color: '#043B5D' }} display="inline">
                                                                                    <span style={{ color: '#3ECCCD' }}>PCR:</span></Typography>
                                                                                <Typography align="left" display="inline"> {item.pcr.checked ? item.pcr.value : 0}</Typography></Grid>
                                                                            <Grid item sm={4}>
                                                                                <Typography key={x} align="left" style={{ color: '#043B5D' }} display="inline">
                                                                                    <span style={{ color: '#FBC23C' }}>Antigen:</span></Typography>
                                                                                <Typography align="left" display="inline"> {item.antigen.checked ? item.antigen.value : 0}</Typography></Grid>
                                                                        </Grid>
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
                                                        {/* <SaveButton /> */}
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </form>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <div className={classes.actionButtonRow}>
                                    {/* <ActiveButton
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
                                    </ActiveButton> */}
                                    <TextButton 
                                        category="Outlined"
                                        disabled={locationDetails.active || saveLoading}
                                        isActivated
                                        onClick={() => toggleLocationStatus({ active: true })}
                                    >
                                        {'Activate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                    </TextButton>
                                    &ensp;&ensp;
                                    <TextButton 
                                        category="Outlined"
                                        disabled={!locationDetails.active || saveLoading}
                                        isActivated={false}
                                        onClick={() => toggleLocationStatus({ active: false })}
                                    >
                                        {'Deactivate'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                                    </TextButton>
                                    
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

LocationDetailsNew.propTypes = {
    getLocation: PropTypes.func.isRequired,
    updateLocation1: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    clearLocations: PropTypes.func.isRequired,
    getInventoryAvailable: PropTypes.func.isRequired,
    getInventoryCountsByLocation: PropTypes.func.isRequired,
};

export default connect(null, { getLocation, updateLocation1, uploadImage, clearLocations, getInventoryAvailable, getInventoryCountsByLocation })(withRouter(LocationDetailsNew));