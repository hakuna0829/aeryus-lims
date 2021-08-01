import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Typography, TableCell } from '@material-ui/core';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { fade } from '@material-ui/core/styles/colorManipulator';
import classNames from 'clsx';
import moment from "moment";
import { GreenShield, RedShield, Reschedule } from 'icons';

// const dateClickSubject = new Subject();
// const dateClickObservable = dateClickSubject.asObservable();

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        border: 'solid 1px #0F84A9',
        borderRadius: '5px'
    },
    content: {
        textAlign: 'center'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    headerTitle: {
        marginLeft: theme.spacing(2),
        color: '#043B5D',
        fontSize: 30,
        fontWeight: 500,
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    },
    greenBtn: {
        background: '#25DD83',
        color: '#fff',
        fontSize: 24,
        textTransform: 'capitalize',
    },
    tableRow1: {
        backgroundColor: 'rgba(15,132,169,0.15)',
        "&:hover": {
            backgroundColor: "rgba(15,132,169,0.15) !important"
        }
    },
    tableRow2: {
        backgroundColor: 'white',
    },
    tablehead: {
        color: '#0F84A9',
        fontSize: 17,
        fontWeight: 600,
    },
    tableCell: {
        color: '#0F84A9',
        fontSize: 14,
        fontWeight: 500,
        alignItems: 'center',

    },
    tableCellRed: {
        color: '#f00',
        fontSize: 14,
        fontWeight: 500,
        alignItems: 'center',
    },
    statusCell: {
        color: '#0F84A9',
        fontSize: 14,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center'
    },
    statusCellLabel: {
        paddingLeft: 10
    },

    colorRed: {
        color: 'red !important'
    },
    colorGreen: {
        color: '#25DD83 !important'
    },
    colorBlue: {
        color: '#0F84A9 !important'
    },
    colorSkyBlue: {
        color: '#3ECCCD !important'
    },
    colorBrown: {
        color: '#FF931E !important'
    },
    // 
    text: {
        padding: '0.5em',
        textAlign: 'right',
    },
    cellContent: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
    },
    desc: {
        fontSize: 11,
        color: '#9B9B9B',
        lineHeight: '12px'
    },
    monthViewerContainer: {

    },
    monthViewerHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    monthViewHeaderLabel: {
        color: '#0F84A9',
        textTransform: 'uppercase'
    },
    monthItem: {
        textAlign: 'center',
        cursor: 'pointer',
    },
    monthLabel: {
        color: '#9B9B9B',
        fontFamily: 'Montserrat',
        fontSize: '24px',
        fontWeight: 700,
        paddingBottom: 10,
        [theme.breakpoints.up('lg')]: {
            fontSize: '24px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '16px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
        },
    },
    monthActive: {
        color: '#0F84A9 !important',
        borderBottom: 'solid white 1px',
        position: 'relative',
        top: 1
    },
}));

const styles = theme => ({
    cell: {
        color: '#78909C!important',
        position: 'relative',
        userSelect: 'none',
        verticalAlign: 'top',
        padding: 0,
        height: 100,
        border: 'solid #9B9B9B 1px',
        // borderLeft: getBorder(theme),
        '&:first-child': {
            // borderLeft: 'none',
        },
        '&:last-child': {
            paddingRight: 0,
        },
        'tr:last-child &': {
            // borderBottom: 'none',
        },
        '&:hover': {
            backgroundColor: 'white',
        },
        '&:focus': {
            backgroundColor: fade('#78909C', 0.15),
            outline: 0,
        },
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
    },
    text: {
        padding: '0.5em',
        textAlign: 'right',
        color: '#9B9B9B'
    },
    sun: {
        color: '#f00',
    },
    cloud: {
        color: '#90A4AE',
    },
    rain: {
        color: '#4FC3F7',
    },
    sunBack: {
        backgroundColor: '#FFFDE7',
    },
    cloudBack: {
        backgroundColor: '#ECEFF1',
    },
    rainBack: {
        backgroundColor: '#E1F5FE',
    },
    opacity: {
        opacity: '0.5',
    },
    appointment: {
        borderRadius: '10px',
        '&:hover': {
            opacity: 0.6,
        },
    },
    apptContent: {
        '&>div>div': {
            whiteSpace: 'normal !important',
            lineHeight: 1.2,
        },
    },
    flexibleSpace: {
        flex: 'none',
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        ...theme.typography.h6,
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightBold,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    // icon: {
    //     color: theme.palette.action.active,
    //     verticalAlign: 'middle',
    // },
    // circle: {
    //     width: theme.spacing(4.5),
    //     height: theme.spacing(4.5),
    //     verticalAlign: 'super',
    // },
    // textCenter: {
    //     textAlign: 'center',
    // },
    // dateAndTitle: {
    //     lineHeight: 1.1,
    // },
    // titleContainer: {
    //     paddingBottom: theme.spacing(2),
    // },
    // container: {
    //     paddingBottom: theme.spacing(1.5),
    // },
    desc: {
        fontSize: 11,
        color: '#9B9B9B',
        lineHeight: '12px'
    },
    eventContainer: {
        position: 'relative',
        textAlign: 'center',
        top: '-20px'
    },
    dayScaleCell: {
        fontSize: 18,
        border: 'solid red 1px'
    },
    countText: {
        textAlign: 'center',
        color: '#0F84A9',
        backgroundColor: theme.palette.white,
        lineHeight: '1vw',
        padding: '.8vw',
        marginLeft: '1.5vw',
        marginRight: '1.5vw',
        borderRadius: '0.4vw',
        fontSize: '1.5vw',
        boxShadow: '1px 1px 3px 3px rgba(15,132,169,0.3)',
        [theme.breakpoints.up('lg')]: {

        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '0.8vw',
            padding: '.5vw .3vw'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8vw',
            padding: '.5vw .3vw'
        },
    },
    appointmentDate: {
        cursor: 'pointer',
    },
    pendingResult: {
        color: theme.palette.brand
    },
    resultShield: {
        // fontSize: '2vw',
    },
    resultText: {
        color: theme.palette.brandGray,
        lineHeight: '0.5vw',
        fontSize: '1.5vw',
        paddingTop: '1vw',
        [theme.breakpoints.up('lg')]: {

        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '0.8vw',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8vw',
        },
    }
});
const clickedDay = (index = '') => {
    console.log(' day ', index)
};

// #FOLD_BLOCK
const CellBase = React.memo(({
    classes,
    startDate,
    formatDate,
    otherMonth,
    data,
    ...restProps
    // #FOLD_BLOCK
}) => {
    const isFirstMonthDay = startDate.getDate() === 1;
    const formatOptions = isFirstMonthDay
        ? { day: 'numeric', month: 'long' }
        : { day: 'numeric' };
    const tableCellRef = React.useRef();
    const [cellSize, setCellSize] = useState({
        width: undefined,
        height: undefined,
    });


    useEffect(() => {
        // Handler to call on window resize

        function handleResize() {
            // Set window width/height to state
            const tempWidth = tableCellRef.current.offsetWidth;
            setCellSize({
                width: tempWidth,
                height: tempWidth,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return (
        <TableCell
            tabIndex={0}
            onClick={() => clickedDay(startDate)}
            className={classNames({
                [classes.cell]: true,
                // [classes.rainBack]: iconId === 0,
                // [classes.sunBack]: iconId === 1,
                // [classes.cloudBack]: iconId === 2,
                // [classes.opacity]: otherMonth,
            })}
            style={{ height: cellSize.height }}
            ref={tableCellRef}
        >
            {/* <div className={classes.content}>
                <WeatherIcon classes={classes} id={iconId} />
            </div> */}
            <div className={classes.text}>
                {formatDate(startDate, formatOptions)}
            </div>
        </TableCell>
    );
});

const DayScaleCell = withStyles(styles, { name: 'DayScaleCell' })(({ classes, ...restProps }) => {
    const { startDate } = restProps;
    if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        return <MonthView.DayScaleCell {...restProps} className={classes.dayScaleCell} />;
    }
    return <MonthView.DayScaleCell {...restProps} />;
});

const CustomScheduler = (props) => {
    const { type, handleMonthChange } = props;

    const classes = useStyles();
    const todayDate = moment();

    const [data, setData] = useState(props.data);
    const [currentDate, setCurrentDate] = useState(todayDate);
    const [activeMonth, setActiveMonth] = useState(moment(todayDate).month());
    const TimeTableCell = withStyles(styles, { name: 'Cell' })(CellBase);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const clickMonth = (index) => {
        setCurrentDate(moment().year() + '/' + (index + 1) + '/01');
        setActiveMonth(index);
        if (handleMonthChange)
            handleMonthChange(index + 1);
    }

    const Appointment = withStyles(styles, { name: 'Appointment' })(({ classes, ...restProps }) => {
        const clickedDay = (date) => {
            if (moment(date).isValid())
                props.dateClickSubject.next(moment(date).format('YYYY-MM-DD'));
        };
        if (type === 'UserTestingHistory') {
            return (
                <Grid container direction="column" justify="center" alignItems="center">
                    {restProps.data.result === 'Pending' && <Reschedule className={classes.pendingResult} />}
                    {restProps.data.result === 'Positive' && <RedShield className={classes.resultShield} />}
                    {restProps.data.result === 'Negative' && <GreenShield className={classes.resultShield} />}
                    <Typography variant="h3" className={classes.resultText}>
                        {restProps.data.time === 'Invalid date' ? 'Processing' : restProps.data.time}
                    </Typography>
                    <Typography variant="h3" className={classes.resultText}>
                        {restProps.data.test_type}
                    </Typography>
                </Grid>
            )
        } else {
            return (
                <div className={classes.appointmentDate} onClick={() => clickedDay(restProps.data.startDate)}>
                    <Typography variant="h3" className={classes.countText}>{restProps.data.title}</Typography>
                </div>
            )
        }
    });

    const MonthViewer = () => {
        const classes = useStyles();

        const monthsArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        return (
            <div >
                <Grid container className={classes.container} spacing={0}>
                    {monthsArr.map((month, index) => {
                        return (
                            <Grid item xs={1} sm={1} className={classes.monthItem} key={index}>
                                <Typography onClick={() => clickMonth(index)} className={activeMonth === index ? classNames(classes.monthLabel, classes.monthActive) : classes.monthLabel}>{month}</Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        )
    }

    return (
        <div>
            <div >
                <MonthViewer className={classes.monthViewerContainer} />
            </div>
            <div className={classes.root}>
                <div className={classes.monthViewerHeader}>
                    <Typography variant="h2" className={classes.monthViewHeaderLabel}>{moment().month(activeMonth).format('MMMM')}</Typography>
                    <Typography variant="h2" className={classes.monthViewHeaderLabel}>{moment(currentDate).format('YYYY')}</Typography>
                </div>
                <Scheduler
                    data={data}
                >
                    <ViewState
                        currentDate={currentDate}
                    />
                    <MonthView timeTableCellComponent={TimeTableCell} cellSize={props.cellSize} />
                    {/* <Toolbar /> */}
                    <Appointments
                        appointmentComponent={Appointment}
                        dayScaleCellComponent={DayScaleCell}
                    // appointmentContentComponent={AppointmentContent}
                    />
                </Scheduler>
            </div>
        </div>
    );
};

CustomScheduler.propTypes = {
    type: PropTypes.string,
    data: PropTypes.array.isRequired,
    dateClickSubject: PropTypes.any,
    handleMonthChange: PropTypes.func,
};

export default CustomScheduler;

