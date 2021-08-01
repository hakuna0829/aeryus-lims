import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Grid,
    Typography,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    CircularProgress,
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import BlueBox from "components/BlueBox";
import LineChart from "components/LineChart";
import BarChart from "components/BarChart";
// import DataLabelBarChart from "components/DataLabelBarChart";
import brandStyles from 'theme/brand';
import { getReportingComplianceCounts, getReportingComplianceTests, getReportingComplianceLinear, getLocations1, getReportingComplianceList } from 'actions/api';
import clsx from 'clsx';
import { CSVLink } from "react-csv";
import ReportDialog from '../ReportDialog';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Download from 'icons/Download';
import { CountBox } from 'components';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2)
    },
    lineChart: {
        padding: theme.spacing(2),
        textAlign: 'left !important'
    },
    topBoxRoot: {
        width: 'calc(20% - 15px)',
        marginRight: 15,
        '&:last-child': {
            marginRight: 0,
        },
        // [theme.breakpoints.up('md')]: {
        //   width:'calc(33% - 15px)',
        //   marginRight:15,
        //   marginBottom:15,
        // },
        [theme.breakpoints.between('sm', 'md')]: {
            width: 'calc(33% - 15px)',
            marginRight: 15,
            marginBottom: 15,
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            margin: 0,
            marginBottom: 15,
        },
    },
    lineChartRoot: {
        color: '#0F84A9',
        '&.MuiInput-underline:before': {
            borderBottom: 'solid 1px #0F84A9'
        },
        '&.MuiInput-underline:hover': {
            borderBottom: 'solid 1px #0F84A9'
        },
        '&.MuiInput-underline:after': {
            borderBottom: 'solid 1px #0F84A9'
        }
    },
    barChartTitle: {
        color: '#0F84A9',

    },
    utilRoot: {
        width: 120,
        marginRight: 15,
        '& .MuiInput-underline:before': {
            borderBottom: 'solid 1px #0F84A9'
        },
        '& .MuiInput-underline:hover': {
            borderBottom: 'solid 1px #0F84A9'
        },
        '& .MuiInput-underline:after': {
            borderBottom: 'solid 1px #0F84A9'
        }
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        // marginRight: theme.spacing(4)
    },
    submitButton: {
        // marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
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
        padding: '12px 15px'
    },
    tableCell: {
        color: '#0F84A9',
        fontSize: 14,
        fontWeight: 500,
        padding: '12px 15px',
    },
    locationSelect: {
        // width: '50%',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
}));
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    // const classes = useStyles();
    const brandClasses = brandStyles();
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headers.map((headCell) => (
                    <TableCell
                        key={headCell.key}
                        sortDirection={orderBy === headCell.key ? order : false}
                        align={headCell.key === 'viewmore' || headCell.key === 'status' ? 'center' : 'left'}
                        className={brandClasses.tableHead}
                    >
                        {headCell.key === 'status' || headCell.key === 'viewmore' ?
                            headCell.label
                            :
                            <TableSortLabel
                                active={orderBy === headCell.key}
                                direction={orderBy === headCell.key ? order : 'asc'}
                                onClick={createSortHandler(headCell.key)}
                                classes={{
                                    icon: brandClasses.tableSortLabel,
                                    active: brandClasses.tableSortLabel
                                }}

                            >
                                {headCell.label}
                            </TableSortLabel>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const stColors = ['#25DD83', '#3ECCCD'];

const exportHeaders = [
    { label: "Patient First Name", key: "first_name", export: true },
    { label: "Patient Last Name", key: "last_name", export: true },
    { label: "DOB", key: "dob", export: true },
    { label: "SEX", key: "gender", export: true },
    { label: "Race", key: "race", export: true },
    { label: "Ethnicity", key: "ethnicity", export: true },
    { label: "Patient Address", key: "address", export: true },
    { label: "City", key: "city", export: true },
    { label: "State", key: "state", export: true },
    { label: "Zip", key: "zip_code", export: true },
    { label: "County", key: "county", export: true },
    { label: "Patient Phone", key: "phone", export: true },
    { label: "Employed Healthcare", key: "healthcare", export: true },

    { label: "Resident Congregate Setting", key: "resident_setting", export: false },
    { label: "Ordering Facility Name", key: "ordering_name", export: false },
    { label: "Ordering Facility Address", key: "ordering_address", export: false },
    { label: "Ordering Facility City", key: "ordering_city", export: false },
    { label: "Ordering Facility State", key: "ordering_state", export: false },
    { label: "Ordering Facility Zip", key: "ordering_zip", export: false },
    { label: "Ordering Facility County", key: "ordering_county", export: false },
    { label: "Ordering Provider First Name", key: "ordering_firstName", export: false },
    { label: "Ordering Provider Last Name", key: "ordering_lastName", export: false },
    { label: "Ordering Provider Phone", key: "ordering_phone", export: false },
    { label: "Specimen Collection Date", key: "specimen_date", export: false },
    { label: "Test Description", key: "test_description", export: false },
    { label: "Test Results", key: "latest_test_result.result", export: false },
];

const headers = [
    { label: "Patient First Name", key: "first_name", minWidth: 100 },
    { label: "Patient Last Name", key: "last_name", minWidth: 100 },
    { label: "DOB", key: "dob", minWidth: 100 },
    { label: "SEX", key: "gender", minWidth: 70 },
    { label: "Race", key: "race", minWidth: 100 },
    { label: "Ethnicity", key: "ethnicity", minWidth: 100 },
    { label: "Patient Address", key: "address", minWidth: 120 },
    { label: "City", key: "city", minWidth: 100 },
    { label: "State", key: "state", minWidth: 80 },
    { label: "Zip", key: "zip_code", minWidth: 100 },
    { label: "County", key: "county", minWidth: 100 },
    { label: "Patient Phone", key: "phone", minWidth: 120 },
];

const Inventory = (props) => {
    const {
        // API
        getReportingComplianceCounts,
        getReportingComplianceTests,
        getReportingComplianceLinear,
        getLocations1,
        getReportingComplianceList,
        // Redux data
        reportingComplianceCounts,
        reportingComplianceTests,
        reportingComplianceLinear,
        locations,
        reportingComplianceList
    } = props;

    const classes = useStyles();
    const brandClasses = brandStyles();

    const [location_id, setLocationId] = useState(0);
    const [rCounts, setRcounts] = useState(null);
    const [stDate, setStDate] = useState(moment());
    const [stLabels, setStLabels] = useState([]);
    const [stData, setStData] = useState([]);
    const [empType, setEmpType] = useState('Yearly');
    const [empDate, setEmpDate] = useState(moment());
    const [empLabels, setEmpLabels] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [empTotal, setEmpTotal] = useState(0);
    const [complianceList, setComplianceList] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('last_name');

    const [isShowReportDlg, setIsShowReportDlg] = useState(false);
    const [exportHeaderList, setExportHeaderList] = useState([...exportHeaders]);
    const [csvHeaders, setCsvHeaders] = useState([{ label: '', key: '' }]);
    const [csvList, setCsvList] = useState([]);

    // const [seriesBarData] = React.useState([
    //     {
    //         name: 'Patients Scheduled',
    //         data: [50, 88, 65, 121, 220, 162, 469, 391, 248, 183]
    //     },
    //     {
    //         name: 'Patients Tested',
    //         data: [80, 148, 125, 251, 430, 260, 230, 151, 168, 133],
    //     }
    // ]);
    // const [categoryBarLabel] = React.useState(['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM']);

    // const [lineChartType, setLineChartType] = React.useState('yearly')
    // const [seriesData] = React.useState([{
    //     data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    // }]);
    // const [categoryLineLabel] = React.useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']);
    // const [selectedDate, handleDateChange] = useState(new Date());

    useEffect(() => {
        onLocationUpdate();
        async function fetchData() {
            let queryParams = null;
            if (location_id)
                queryParams = `location_id=${location_id}`;
            if (!locations)
                await getLocations1();
            await getReportingComplianceCounts(queryParams);
            let queryParamsForEmp = queryParams ? queryParams + `&${empDateQueryParams(empType, empDate)}` : `&${empDateQueryParams(empType, empDate)}`;
            await getReportingComplianceLinear(queryParamsForEmp);
            let queryParamsForST = queryParams ? queryParams + `&date=${moment(stDate).format('YYYY-MM-DD')}` : `&date=${moment(stDate).format('YYYY-MM-DD')}`;
            await getReportingComplianceTests(queryParamsForST);
            await getReportingComplianceList(queryParams);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location_id]);

    useEffect(() => {
        if (reportingComplianceTests) {
            let labels = [];
            let sData = [];
            let tData = [];
            reportingComplianceTests.forEach(r => {
                labels.push(r.time);
                sData.push(r.schedules);
                tData.push(r.testings);
            });
            setStLabels(labels);
            setStData([{ name: 'Patients Scheduled', data: sData }, { name: 'Patients Tested', data: tData }]);
        }
    }, [reportingComplianceTests]);

    useEffect(() => {
        if (reportingComplianceLinear) {
            let empLabels = [];
            let empData = [];
            let total = 0;
            reportingComplianceLinear.forEach(e => {
                if (empType === 'Daily') {
                    let hour = parseInt(e.key);
                    empLabels.push(hour <= 11 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`);
                } else {
                    empLabels.push(e.key);
                }
                empData.push(e.count);
                total += e.count;
            });
            setEmpTotal(total);
            setEmpLabels(empLabels);
            setEmpData([{ data: empData }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportingComplianceLinear]);

    useEffect(() => {
        if (reportingComplianceCounts) {
            setRcounts(reportingComplianceCounts);
        }
    }, [reportingComplianceCounts]);

    useEffect(() => {
        if (reportingComplianceList) {
            setComplianceList(reportingComplianceList);
        }
    }, [reportingComplianceList]);

    useEffect(() => {
        let csvH = exportHeaders.filter(e => e.export);
        setCsvHeaders(csvH);
    }, [exportHeaderList]);

    function onClickExportButton() {
        setIsShowReportDlg(true);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const MaketableRow = (data) => {
        const column = data.column;
        const row = data.row;
        const value = row[column.key];

        return (
            <TableCell key={column.key} align={column.align} className={classes.tableCell}>
                {column.key === 'phone'
                    ?
                    <PhoneNumberFormat value={value} />
                    :
                    column.key === 'dob'
                        ?
                        moment.utc(value).format('DD/MM/YYYY')
                        :
                        value
                }
            </TableCell>
        )
    }

    const onLocationUpdate = () => {
        setStData([]);
        setEmpData([]);
        setRcounts(null);
    };

    const handleStDateChange = async (date) => {
        setStLabels([]);
        setStData([]);
        setStDate(date);
        let queryParams = `date=${date.format('YYYY-MM-DD')}`;
        if (location_id)
            queryParams += `&location_id=${location_id}`;
        await getReportingComplianceTests(queryParams);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEmpDateChange = async (date) => {
        setEmpLabels([]);
        setEmpData([]);
        setEmpDate(date);
        let queryParams = empDateQueryParams(empType, date);
        if (location_id)
            queryParams += `&location_id=${location_id}`;
        await getReportingComplianceLinear(queryParams);
    };

    const handleEmpTypeChange = async (e) => {
        let type = e.target.value;
        setEmpLabels([]);
        setEmpData([]);
        setEmpType(type);
        let queryParams = empDateQueryParams(type, empDate);
        if (location_id)
            queryParams += `&location_id=${location_id}`;
        await getReportingComplianceLinear(queryParams);
    }

    const handleLocationChange = (event) => {
        setLocationId(event.target.value);
    }

    const empDateQueryParams = (type, date) => {
        switch (type) {
            case 'Yearly':
                return `type=Yearly&year=${date.year()}`;
            case 'Monthly':
                return `type=Monthly&year=${date.year()}&month=${date.month() + 1}`;
            case 'Weekly':
                return `type=Weekly&date=${date.format('YYYY-MM-DD')}`;
            case 'Daily':
                return `type=Daily&date=${date.format('YYYY-MM-DD')}`;

            default:
                return null;
        }
    }

    const toggleExport = (data) => {
        console.log('click toggle button', data);
        let from = new Date(data.fromDate).getTime();
        let to = new Date(data.toDate).getTime();
        let result = complianceList.filter(c => {
            var time = new Date(c.created_date).getTime();
            return (from < time && time < to);
        });
        setCsvList(result);
        setTimeout(() => {
            document.getElementById('csvLinkBtn').click()
        }, 500);
        // csvLinkRef.click();
        // this.btn.click();
    };

    return (
        <div>
            <div className={classes.container}>
                <Typography variant="h3" className={brandClasses.headerTitle}>
                    {'Inventory Report '}
                    {locations
                        ?
                        <Select
                            value={location_id}
                            onChange={handleLocationChange}
                            className={clsx(classes.locationSelect, classes.lineChartRoot)}
                        >
                            <MenuItem value={0}>
                                <em>{'All Locations'}</em>
                            </MenuItem>
                            {locations.map((location, index) => (
                                <MenuItem value={location._id} key={index}>{location.name}</MenuItem>
                            ))}
                        </Select>
                        :
                        <CircularProgress />
                    }
                </Typography>
                <br />
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"

                >
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'total_users'} title={'Total Users'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'tests_performed'} title={'Tests Performed'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'positive_results'} title={'Positive Results'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'negative_results'} title={'Negative Results'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'positivity_rate'} title={'Positivity Rate %'} isPercent={true} />
                    </BlueBox>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item md={5}>
                        <BlueBox class={classes.lineChart}>
                            <Typography variant="h4" className={classes.barChartTitle}> Number of responses</Typography>
                            <br />
                            <Typography variant="h2"> {empTotal}</Typography>
                            {empData.length
                                ? <LineChart seriesData={empData} label={empLabels} />
                                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MuiPickersUtilsProvider utils={MomentUtils} >
                                    {
                                        empType === 'Yearly'
                                            ?
                                            <DatePicker
                                                views={["year"]}
                                                label="Year only"
                                                value={empDate}
                                                onChange={handleEmpDateChange}
                                                className={classes.utilRoot}
                                            />
                                            :
                                            empType === 'Monthly'
                                                ?
                                                <DatePicker
                                                    views={["year", "month"]}
                                                    label="Year and Month"
                                                    value={empDate}
                                                    onChange={handleEmpDateChange}
                                                    className={classes.utilRoot}
                                                />
                                                :
                                                empType === 'Weekly'
                                                    ?
                                                    <DatePicker
                                                        label="Week of"
                                                        value={empDate}
                                                        onChange={handleEmpDateChange}
                                                        className={classes.utilRoot}
                                                    />
                                                    :
                                                    <DatePicker
                                                        label="Date"
                                                        value={empDate}
                                                        onChange={handleEmpDateChange}
                                                        className={classes.utilRoot}
                                                    />
                                    }
                                </MuiPickersUtilsProvider>
                                <Select
                                    value={empType}
                                    onChange={handleEmpTypeChange}
                                    className={classes.lineChartRoot}
                                >
                                    <MenuItem value='Daily'>Daily</MenuItem>
                                    <MenuItem value='Weekly'>Weekly</MenuItem>
                                    <MenuItem value='Monthly'>Monthly</MenuItem>
                                    <MenuItem value='Yearly'>Yearly</MenuItem>
                                </Select>
                            </div>
                        </BlueBox>
                    </Grid>
                    <Grid item md={7}>
                        <BlueBox>
                            <Typography className={classes.barChartTitle} variant="h4">
                                Positive/Negative Cases
                            </Typography>
                            {stData.length
                                ? <BarChart colors={stColors} seriesData={stData} label={stLabels} />
                                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MuiPickersUtilsProvider utils={MomentUtils} >
                                    <DatePicker
                                        label="Date"
                                        value={stDate}
                                        onChange={handleStDateChange}
                                        className={classes.utilRoot}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                        </BlueBox>
                    </Grid>
                </Grid>
                <div className={classes.footer}>
                    <Button
                        className={clsx(classes.submitButton, brandClasses.button)}
                        onClick={() => onClickExportButton()}
                    >
                        <Download /> &nbsp;
                        {'EXPORT'}
                    </Button>

                    <CSVLink
                        data={csvList}
                        headers={csvHeaders}
                        filename={"my-file.csv"}
                        className={clsx(classes.submitButton, brandClasses.button)}
                        style={{ display: 'none' }}
                        // ref={csvLinkRef}
                        id="csvLinkBtn"
                    >
                        EXPORT
                    </CSVLink>
                </div>
            </div>

            {/* Table  */}
            <div>
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table" className={classes.table}>
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={complianceList.length}
                        />
                        <TableBody>
                            {!reportingComplianceList
                                ?
                                <TableRow>
                                    <TableCell colSpan={headers.length} align="center">
                                        <CircularProgress className={brandClasses.fetchProgressSpinner} />
                                    </TableCell>
                                </TableRow>
                                :
                                !complianceList.length
                                    ?
                                    <TableRow>
                                        <TableCell colSpan={headers.length} align="center">
                                            {'No data to display...'}
                                        </TableCell>
                                    </TableRow>
                                    :
                                    stableSort(complianceList, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index} className={index % 2 !== 0 ? '' : classes.tableRow1}>
                                                    {headers.map((column) => {
                                                        return (
                                                            <MaketableRow column={column} row={row} key={column.key} />
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={complianceList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    classes={{
                        root: classes.tablePagination,
                        caption: classes.tablePaginationCaption,
                        selectIcon: classes.tablePaginationSelectIcon,
                        select: classes.tablePaginationSelect,
                        actions: classes.tablePaginationActions,
                    }}
                />
            </div>

            <ReportDialog
                title="Inventory Report"
                isShowReportDlg={isShowReportDlg}
                toggleReportDlg={setIsShowReportDlg}
                exportHeaderList={exportHeaderList}
                setExportHeaderList={setExportHeaderList}
                clickCSV={toggleExport}
            />
        </div>
    );
}

const mapStateToProps = state => ({
    reportingComplianceCounts: state.data.reportingComplianceCounts,
    reportingComplianceLinear: state.data.reportingComplianceLinear,
    reportingComplianceTests: state.data.reportingComplianceTests,
    reportingComplianceList: state.data.reportingComplianceList,
    locations: state.data.locations,
});

Inventory.propTypes = {
    getReportingComplianceCounts: PropTypes.func.isRequired,
    getReportingComplianceTests: PropTypes.func.isRequired,
    getReportingComplianceLinear: PropTypes.func.isRequired,
    getLocations1: PropTypes.func.isRequired,
    getReportingComplianceList: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { getReportingComplianceCounts, getReportingComplianceTests, getReportingComplianceLinear, getLocations1, getReportingComplianceList })(Inventory);
