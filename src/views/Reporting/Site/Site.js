import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, CircularProgress } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import BlueBox from "components/BlueBox";
import LineChart from "components/LineChart";
import BarChart from "components/BarChart";
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import { CSVLink } from "react-csv";
import ReportDialog from '../ReportDialog';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Download from 'icons/Download';
import { CountBox } from 'components';
import { getReportingSiteCounts, getReportingSiteTests, getReportingSiteLinear, getLocations1 } from 'actions/api';
import SearchBar from 'layouts/Main/components/SearchBar';
import TuneIcon from '@material-ui/icons/Tune';
import { useHistory } from 'react-router-dom';
import Chart from 'icons/Chart';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2)
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2),
        // marginBottom: theme.spacing(2),
    },
    subHeader: {
        display: 'flex',
        alignItems: 'center'
    },
    headerSubTitle: {
        color: theme.palette.brandText,
        marginLeft: 8,
        display: 'flex',
        alignItems: 'center'
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
        locationSelect: {
            marginLeft: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
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
    headerTitle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    cellDiv: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        // width: '140px',
        whiteSpace: 'nowrap',
        [theme.breakpoints.between('md', 'lg')]: {
            width: '140px',
        },
        [theme.breakpoints.between('sm', 'md')]: {
            width: '100px',
        },
        [theme.breakpoints.between('xs', 'sm')]: {
            width: '80px',
        },
    }
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

const testsColors = ['#25DD83', '#3ECCCD'];

const exportHeaders = [
    { label: "Location", key: "name", export: true },
    { label: "Phone", key: "office_phone", export: true },
    { label: "Address", key: "address", export: true },
    { label: "Admin Name", key: "administrator", export: true },
    { label: "City", key: "city", export: true },
    { label: "State", key: "state", export: true },
    { label: "EOC Name", key: "eoc", export: true },
    { label: "Zip", key: "zip_code", export: true },
    { label: "County", key: "county", export: true },
    { label: "Testing Protocols", key: "testing_protocols", export: true },
];

const headers = [
    { label: "Location", key: "name", minWidth: 100 },
    { label: "Address", key: "address", minWidth: 100 },
    { label: "City", key: "city", minWidth: 100 },
    { label: "State", key: "state", minWidth: 70 },
    { label: "Zip", key: "zip_code", minWidth: 100 },
    { label: "County", key: "county", minWidth: 100 },
    { label: "Phone", key: "office_phone", minWidth: 120 },
    { label: "Admin name", key: "administrator", minWidth: 100 },
    { label: "EOC name", key: "eoc", minWidth: 80 },
];

const Site = (props) => {
    const {
        // API
        getReportingSiteCounts,
        getReportingSiteTests,
        getReportingSiteLinear,
        getLocations1,
        // Redux data
        reportingSiteCounts,
        reportingSiteLinear,
        reportingSiteTests,
        locations,
    } = props;

    const classes = useStyles();
    const brandClasses = brandStyles();
    const history = useHistory();
    const [location_id] = useState(0);
    const [rCounts, setRcounts] = useState(null);
    const [testsLabels, setTestsLabels] = useState([]);
    const [testsData, setTestsData] = useState([]);
    const [linearType, setLinearType] = useState('Yearly');
    const [linearDate, setLinearDate] = useState(moment());
    const [linearLabels, setLinearLabels] = useState([]);
    const [linearData, setLinearData] = useState([]);
    const [linearTotal, setLinearTotal] = useState(0);
    const [locationList, setLocationList] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const [isShowReportDlg, setIsShowReportDlg] = useState(false);
    const [exportHeaderList, setExportHeaderList] = useState([...exportHeaders]);
    const [csvHeaders, setCsvHeaders] = useState([{ label: '', key: '' }]);
    const [csvList, setCsvList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await getReportingSiteCounts();
            await getReportingSiteLinear();
            await getReportingSiteTests();
            if (!locations)
                await getLocations1();
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reportingSiteCounts) {
            setRcounts(reportingSiteCounts);
        }
    }, [reportingSiteCounts]);

    useEffect(() => {
        if (reportingSiteLinear) {
            let linearLabels = [];
            let linearData = [];
            let total = 0;
            reportingSiteLinear.forEach(e => {
                if (linearType === 'Daily') {
                    let hour = parseInt(e.key);
                    linearLabels.push(hour <= 11 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`);
                } else {
                    linearLabels.push(e.key);
                }
                linearData.push(e.count);
                total += e.count;
            });
            setLinearTotal(total);
            setLinearLabels(linearLabels);
            setLinearData([{ data: linearData }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportingSiteLinear]);

    useEffect(() => {
        if (reportingSiteTests) {
            let labels = [];
            let sData = [];
            let tData = [];
            reportingSiteTests.forEach(r => {
                labels.push(r.location_name);
                sData.push(r.total_tests);
                tData.push(r.results.find(x => x.result === 'Positive') ? r.results.find(x => x.result === 'Positive').resultsCount : 0);
            });
            setTestsLabels(labels);
            setTestsData([{ name: 'Total Tests Performed', data: sData }, { name: 'Positive Results', data: tData }]);
        }
    }, [reportingSiteTests]);

    useEffect(() => {
        if (locations) {
            setLocationList(locations);
        }
    }, [locations]);

    useEffect(() => {
        let csvH = exportHeaders.filter(e => e.export);
        setCsvHeaders(csvH);
    }, [exportHeaderList]);

    const handleLinearDateChange = async (date) => {
        setLinearLabels([]);
        setLinearData([]);
        setLinearDate(date);
        let queryParams = linearDateQueryParams(linearType, date);
        if (location_id)
            queryParams += `&location_id=${location_id}`;
        await getReportingSiteLinear(queryParams);
    };

    const handleLinearTypeChange = async (e) => {
        let type = e.target.value;
        setLinearLabels([]);
        setLinearData([]);
        setLinearType(type);
        let queryParams = linearDateQueryParams(type, linearDate);
        if (location_id)
            queryParams += `&location_id=${location_id}`;
        await getReportingSiteLinear(queryParams);
    }

    const linearDateQueryParams = (type, date) => {
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onClickSearchInput = (event) => {
        console.log('isOpen', isOpen, event);
    }

    const onClickReport = (e) => {
        // console.log(' -- click report button -- ', e.target);
        history.push('/reporting/custom');
    }

    const MaketableRow = (data) => {
        const column = data.column;
        const row = data.row;
        const value = row[column.key];

        return (
            <TableCell key={column.key} align={column.align} className={classes.tableCell}>
                {column.key === 'office_phone'
                    ?
                    <PhoneNumberFormat value={value} />
                    :
                    column.key === 'address'
                        ?
                        <div className={classes.cellDiv} >
                            {value}
                        </div>
                        :
                        value
                }
            </TableCell>
        )
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onClickExportButton = () => {
        setIsShowReportDlg(true);
    }

    const toggleExport = (data) => {
        console.log('click toggle button', data);
        let from = new Date(data.fromDate).getTime();
        let to = new Date(data.toDate).getTime();
        let result = locationList.filter(c => {
            var time = new Date(c.created_date).getTime();
            return (from < time && time < to);
        });
        setCsvList(result);
        setTimeout(() => {
            document.getElementById('csvLinkBtn').click()
        }, 500);
    };

    return (
        <div>
            <div className={classes.header} >
                <div className={classes.subHeader}>
                    <Chart style={{ color: '#043B5D' }} />&ensp;
                        <Typography variant="h2" className={brandClasses.headerTitle}>
                        Reporting |
                        </Typography>
                    <Typography variant="h4" className={classes.headerSubTitle}>
                        {'Site Statistics'}
                    </Typography>
                </div>
                <Button
                    className={clsx(brandClasses.reportBtn, brandClasses.button)}
                    onClick={onClickReport}
                >
                    {'CUSTOM REPORT'}
                </Button>
            </div>
            <div className={classes.container}>
                {/* <div className={classes.header} >
                    <Typography variant="h3" className={clsx(brandClasses.headerTitle, classes.headerTitle)}>
                        {'Site Report '}
                    </Typography>
                    <Button
                        className={clsx(brandClasses.reportBtn, brandClasses.button)}
                        onClick={onClickReport}
                    >
                        {'CUSTOM REPORT'}
                    </Button>
                </div>
                <br /> */}
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"

                >
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'total_locations'} title={'Total Locations'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'total_active_locations'} title={'Total Active Locations'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'total_tests_performed'} title={'Total Tests Performed'} />
                    </BlueBox>
                    <BlueBox class={classes.topBoxRoot}>
                        <CountBox value={rCounts} object_key={'positive_results'} title={'Positive Results'} />
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
                            <Typography variant="h2"> {linearTotal}</Typography>
                            {linearData.length
                                ? <LineChart seriesData={linearData} label={linearLabels} />
                                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MuiPickersUtilsProvider utils={MomentUtils} >
                                    {
                                        linearType === 'Yearly'
                                            ?
                                            <DatePicker
                                                views={["year"]}
                                                label="Year only"
                                                value={linearDate}
                                                onChange={handleLinearDateChange}
                                                className={classes.utilRoot}
                                            />
                                            :
                                            linearType === 'Monthly'
                                                ?
                                                <DatePicker
                                                    views={["year", "month"]}
                                                    label="Year and Month"
                                                    value={linearDate}
                                                    onChange={handleLinearDateChange}
                                                    className={classes.utilRoot}
                                                />
                                                :
                                                linearType === 'Weekly'
                                                    ?
                                                    <DatePicker
                                                        label="Week of"
                                                        value={linearDate}
                                                        onChange={handleLinearDateChange}
                                                        className={classes.utilRoot}
                                                    />
                                                    :
                                                    <DatePicker
                                                        label="Date"
                                                        value={linearDate}
                                                        onChange={handleLinearDateChange}
                                                        className={classes.utilRoot}
                                                    />
                                    }
                                </MuiPickersUtilsProvider>
                                <Select
                                    value={linearType}
                                    onChange={handleLinearTypeChange}
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
                                {'Positive/Negative Cases'}
                            </Typography>
                            {testsData.length
                                ? <BarChart colors={testsColors} seriesData={testsData} label={testsLabels} height={450} />
                                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
                            }
                        </BlueBox>
                    </Grid>
                </Grid>
                <div className={classes.footer}>
                    <SearchBar className={brandClasses.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} />
                    <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div>
                    &ensp;&ensp;
          <Button
                        className={clsx(classes.submitButton, brandClasses.button)}
                        onClick={() => onClickExportButton()}
                    >
                        <Download /> &nbsp; {'EXPORT'}
                    </Button>

                    <CSVLink
                        data={csvList}
                        headers={csvHeaders}
                        filename={"site.csv"}
                        className={clsx(classes.submitButton, brandClasses.button)}
                        style={{ display: 'none' }}
                        // ref={csvLinkRef}
                        id="csvLinkBtn"
                    >EXPORT</CSVLink>
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
                            rowCount={locationList.length}
                        />
                        <TableBody>
                            {!locations
                                ?
                                <TableRow>
                                    <TableCell colSpan={headers.length} align="center">
                                        <CircularProgress className={brandClasses.fetchProgressSpinner} />
                                    </TableCell>
                                </TableRow>
                                :
                                !locationList.length
                                    ?
                                    <TableRow>
                                        <TableCell colSpan={headers.length} align="center">
                                            {'No data to display...'}
                                        </TableCell>
                                    </TableRow>
                                    :
                                    stableSort(locationList, getComparator(order, orderBy))
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
                    count={locationList.length}
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
                title={'Site Statistics'}
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
    reportingSiteCounts: state.data.reportingSiteCounts,
    reportingSiteLinear: state.data.reportingSiteLinear,
    reportingSiteTests: state.data.reportingSiteTests,
    locations: state.data.locations,
});

Site.propTypes = {
    getReportingSiteCounts: PropTypes.func.isRequired,
    getReportingSiteTests: PropTypes.func.isRequired,
    getReportingSiteLinear: PropTypes.func.isRequired,
    getLocations1: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { getReportingSiteCounts, getReportingSiteTests, getReportingSiteLinear, getLocations1 })(Site);
