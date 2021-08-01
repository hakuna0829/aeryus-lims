import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Typography,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableSortLabel,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    TablePagination,
    // CircularProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchBar from '../../../layouts/Main/components/SearchBar';
import SemiPieChart from "../../../components/PieChart";
import OrderBox from "../../../components/OrderBox";
import { Chart } from "react-google-charts";
import CustomSelectBox from '../../../components/SelectBox';
import brandStyles from 'theme/brand';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 0,
        // paddingLeft: theme.spacing(2)
    },
    header: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    headerRight: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    pageTitle: {
        color: theme.palette.blueDark,
    },
    pageTitleIcon: {
        paddingRight: 10
    },
    calendar: {
        margin: '0 auto'
    },
    pieChartRoot: {
        padding: theme.spacing(0),
        margin: '20px auto',
        alignItems: 'center'
    },
    chartLabel: {
        color: theme.palette.brandDark,
        fontSize: '26px',
        fontWeight: 500,
        textAlign: 'center',
        [theme.breakpoints.up('lg')]: {
            fontSize: '26px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '22px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px',
        },
    },
    barChartLabel: {
        color: theme.palette.brandDark,
        fontSize: '26px',
        fontWeight: 500,
        textAlign: 'left',
        margin: '15px 0',
        [theme.breakpoints.up('lg')]: {
            fontSize: '26px',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            fontSize: '22px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '18px',
        },
    }
}));

const columns = [
    { id: 'last_name', label: 'Last Name', minWidth: 100 },
    { id: 'first_name', label: 'First Name', minWidth: 100 },
    { id: 'order_number', label: 'Order Number', minWidth: 150 },
    { id: 'test_type', label: 'Test Type', minWidth: 100 },
    { id: 'lot_number', label: 'Lot Number', minWidth: 120 },
    { id: 'date', label: 'Date Received', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'detail', label: 'Detail', minWidth: 100 },
];

function createData(lastName, firstName, orderNumber, type, lotNumber, receivedDate, status, detail) {
    return {
        last_name: lastName,
        first_name: firstName,
        order_number: orderNumber,
        test_type: type,
        lot_number: lotNumber,
        date: receivedDate,
        status,
        detail
    };
}

const rows = [
    createData('Last Name2', 'First Name4', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6a', '06/05/2020', 1, ''),
    createData('Last Name1', 'First Name3', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 2, ''),
    createData('Last Name3', 'First Name1', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 2, ''),
    createData('Last Name', 'First Name2', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6b', '06/05/2020', 3, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 4, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 3, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 4, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 2, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6e', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 2, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 3, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 4, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 4, ''),
    createData('Last Name', 'First Name', '4b17eec0-8fce-4f6d-9ab1', 'Serology', '4b17eec0-8fce-4f6d', '06/05/2020', 1, ''),
];

const statusImgArr = [
    'images/svg/status/resulted_icon.svg',
    'images/svg/status/requsitioned2_icon.svg',
    'images/svg/status/Processing_icon.svg',
    'images/svg/status/accessioned_icon.svg'
];

const headCells = [
    { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
    { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
    { id: 'order_number', numeric: false, disablePadding: true, label: 'Order Number' },
    { id: 'test_type', numeric: false, disablePadding: true, label: 'Test Type' },
    { id: 'lot_number', numeric: false, disablePadding: true, label: 'Lot Number' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date Received' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'detail', numeric: false, disablePadding: false, label: 'Detail' },
];

function descendingComparator(a, b, orderBy) {
    // console.log(a, b)
    // console.log(orderBy)
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    // console.log(order, orderBy)
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
    const brandClasses = brandStyles();
    // const classes = useStyles();

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        align={headCell.id === 'detail' || headCell.id === 'status' ? 'center' : 'left'}
                        className={brandClasses.tableHead}
                    >
                        {headCell.id === 'status' || headCell.id === 'detail' ?
                            headCell.label
                            :
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
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

const Content = () => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isOpen, setIsOpen] = React.useState(false);
    const brandClasses = brandStyles();

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('last_name');
    const statusData = [
        { value: 0, label: 'Status: All' },
        { value: 1, label: 'Case 1' },
        { value: 2, label: 'Case 2' },
        { value: 3, label: 'Case 3' },
    ];

    const dateData = [
        { value: 0, label: 'Date: Today' },
        { value: 1, label: 'Date: Yesterday' },
    ];

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

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

    const MaketableRow = (data) => {
        const column = data.column;
        const row = data.row;
        const value = row[column.id];
        if (column.id === 'status') {
            return (
                <TableCell key={column.id} align='center' className={brandClasses.tableCell}>
                    <img src={statusImgArr[value - 1]} alt='Status' className={brandClasses.statusIcon} />
                </TableCell>
            )
        }
        if (column.id === 'detail') {
            return (
                <TableCell key={column.id} align={column.align} className={brandClasses.tableCell}>
                    <div className={brandClasses.actionContainer}>
                        <img src='/images/svg/document_icon.svg' alt='Edit' />
                        <img src='/images/svg/eye_icon.svg' alt='View' />
                    </div>
                </TableCell>
            )
        }
        return (
            <TableCell key={column.id} align={column.align} className={brandClasses.tableCell}>
                {value}
            </TableCell>
        )
    }

    return (
        <div className={classes.root}>
            <Grid container className={classes.container} spacing={0}>
                <Grid item xs={12} sm={3} className={classes.header}>
                    <Typography variant="h3" className={brandClasses.headerTitle}>SEROLOGY TESTS</Typography>
                </Grid>
                <Grid item xs={12} sm={9} className={brandClasses.tableActionBar}>
                    <CustomSelectBox className={classes.selectOption} data={statusData} />
                    <CustomSelectBox className={classes.selectOption} data={dateData} />
                    <SearchBar className={brandClasses.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} />
                    {/* <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div> */}
                </Grid>
            </Grid>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table" className={brandClasses.table}>
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={columns.length}
                        />
                        <TableBody>
                            {
                                !rows.length
                                    ?
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            {'No data to display...'}
                                        </TableCell>
                                    </TableRow>
                                    : stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                            return (
                                                <TableRow hover tabIndex={-1} key={index} className={index % 2 === 0 ? brandClasses.tableRow1 : ''}>
                                                    {columns.map((column) => {
                                                        return (
                                                            <MaketableRow column={column} row={row} key={column.id} />
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
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    classes={{
                        root: brandClasses.tablePagination,
                        caption: brandClasses.tablePaginationCaption,
                        selectIcon: brandClasses.tablePaginationSelectIcon,
                        select: brandClasses.tablePaginationSelect,
                        actions: brandClasses.tablePaginationActions,
                    }}
                />
            </Paper>
            <Grid container className={classes.pieChartRoot} spacing={0}>
                <Grid item xs={12} sm={6} className={brandClasses.pieChartContainer} >
                    <SemiPieChart color={'#FF931E'} value="78" label="Inventory Threshold Serology" />
                </Grid>
                <Grid item xs={12} sm={6} className={brandClasses.pieChartContainer} >
                    <Typography className={classes.chartLabel}>Test Inventory</Typography>
                    <OrderBox language="es" className={brandClasses.orangeBoard} title="Serology" value="722" label="Current Orders" />
                </Grid>
            </Grid>

            <Grid container className={brandClasses.barChartRoot} spacing={0}>
                <Grid item xs={12} sm={12} className={brandClasses.barChartContainer}>
                    <Typography className={brandClasses.barChartLabel}>Daily Trend</Typography>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Day', 'Score'],
                            ['Mon', 150],
                            ['Tue', 120],
                            ['Wed', 200],
                            ['Thu', 310],
                            ['Fri', 220],
                            ['Sat', 280],
                            ['Sun', 480],
                        ]}
                        options={{
                            // Material design options
                            chart: {
                                title: '',
                                subtitle: '',
                            },
                            colors: ['#3ECCCD'],
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '2' }}
                    />
                </Grid>
            </Grid>

        </div>
    );
};

export default Content;