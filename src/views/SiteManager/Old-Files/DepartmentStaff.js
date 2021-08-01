import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import {
    Typography,
    Button,
    Table,
    TableHead,
    TableBody,
    TableSortLabel,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    TablePagination,
    CircularProgress
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { getUsers } from 'actions/api';
// import { CircularProgress } from '@material-ui/core';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import SearchBar from 'layouts/Main/components/SearchBar';
import TuneIcon from '@material-ui/icons/Tune';
import PropTypes from 'prop-types';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Actions from 'views/UserManager/Actions';
import UserDialog from 'views/UserManager/UserDialog/UserDialog';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
    content: {
        // paddingTop: 50,
        textAlign: 'center'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        '& div': {
            display: 'flex',
            alignItems: 'center'
        }
    },
    pageBar: {
        backgroundColor: 'rgba(15,132,169,0.8)'
    },
    titleContainer: {
        padding: '12px 5px !important'
    },
    headerSubTitle: {
        color: theme.palette.brandText,
        marginLeft: 8
    },
    title: {
        color: '#0F84A9',
        lineHeight: '27px'
    },
    greenBtnContainer: {
        padding: '12px 5px !important',
        '@media (max-width:620px)': {
            justifyContent: 'center'
        }
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
    locationContainer: {
        '@media (max-width:730px)': {
            justifyContent: 'center'
        }
    },
    location: {
        margin: '50px 0'
    },
    loader: {
        height: '100px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noLocations: {
        height: '50px',
        marginTop: '10px'
    },
    searchBar: {
        paddingRight: 20
    },
    statusIcon: {
        width: '25px',
        display: 'flex',
        margin: '0 auto',
        // height: '30px'
    },
    header2: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    settingIconBox: {
        width: '40px',
        height: '40px',
        display: 'block',

        fontFamily: 'verdana',
        fontSize: '22px',
        padding: 0,
        margin: 0,
        marginRight: 16,
        border: 'solid 1px rgba(155,155,155,0.5)',
        outline: 0,
        lineHeight: '50px',
        textAlign: 'center',
        cursor: 'pointer',
        color: '#FFFFFF',
        background: '#fff',
    },
    settingIcon: {
        fontSize: '2rem',
        marginTop: 2,
        color: 'rgba(155,155,155,0.5)',
    },
    cellDiv: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: '160px',
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('lg')]: {
            width: '120px',
        },
        // [theme.breakpoints.between('sm', 'md')]: {
        //   width: '320px',
        // },
        // [theme.breakpoints.between('xs', 'sm')]: {
        //   width: '320px',
        // },
    }
}));

const headCells = [
    { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
    { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
    { id: 'location_id', numeric: false, disablePadding: true, label: 'Location' },
    { id: 'department', numeric: false, disablePadding: true, label: 'Department' },
    { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'viewmore', numeric: false, disablePadding: false, label: 'View More' },
];

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

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? 'right' : 'left'}
                        // padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        align={headCell.id === 'viewmore' || headCell.id === 'status' ? 'center' : 'left'}
                        className={brandClasses.tableHead}
                    >
                        {headCell.id === 'status' || headCell.id === 'viewmore' ?
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
                            // IconComponent={orderIconComponent}
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


export default function DepartmentStaff(props) {
    const classes = useStyles();
    const brandClasses = brandStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    // const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = React.useState('lastname');
    const [userId, setEmplyeeId] = React.useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const fetchUsers = () => {
        getUsers().then(res => {
            setLoading(false);
            if (res.data.success) {
                setUserList(res.data.data);

            } else {
                showFailedDialog(res);
            }

        }).catch(error => {
            setLoading(false);
            showErrorDialog(error);
        });
    }

    const onClickSearchInput = (event) => {
        console.log('isOpen', isOpen, event);
    }

    const handleView = (id) => {
        history.push('/user-details/' + id);
    }

    const onDialogClose = (doFetch) => {
        if (doFetch) {
            fetchUsers();
        }
        setDialogOpen(false);
    }

    const onAddUser = () => {
        setEmplyeeId(null);
        setDialogOpen(true);
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div>
                    <Typography variant="h2" className={brandClasses.headerTitle2}>
                        <img src="/images/svg/department_header_icon.svg" alt="" style={{ width: 35 }} />
                        {'DEPARTMENT MANAGER'} |
                    </Typography>
                    <Typography variant="h4" className={classes.headerSubTitle}>USER LIST</Typography>
                </div>

                <Button
                    variant="contained"
                    className={classes.greenBtn}
                    startIcon={<AddIcon />}
                    onClick={onAddUser}>
                    Add User
                </Button>
            </div>
            <div className={classes.header2}>
                <SearchBar className={classes.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} />
                <div className={classes.settingIconBox}><TuneIcon className={classes.settingIcon} /></div>
            </div>

            <Paper style={{marginTop:16}}>
                <TableContainer>
                    <Table>

                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={userList.length}
                        />
                        <TableBody>
                            {loading
                                ?
                                <TableRow>
                                    <TableCell colSpan={headCells.length} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                                :
                                !userList.length
                                    ?
                                    <TableRow>
                                        <TableCell colSpan={headCells.length} align="center">
                                            {'No data to display...'}
                                        </TableCell>
                                    </TableRow>
                                    :
                                    stableSort(userList, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((user, rowIndex) => {

                                            return (
                                                <TableRow
                                                    hover
                                                    // onClick={(event) => handleClick(event, row.name)}
                                                    tabIndex={-1}
                                                    key={rowIndex}
                                                    className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}
                                                >
                                                    <TableCell className={brandClasses.tableCell}>
                                                        {user.last_name}
                                                    </TableCell>
                                                    <TableCell className={brandClasses.tableCell}>
                                                        {user.first_name}
                                                    </TableCell>
                                                    <TableCell className={brandClasses.tableCell}>
                                                        {user.location_id.name}
                                                    </TableCell>
                                                    <TableCell className={brandClasses.tableCell}>
                                                        {user.department}
                                                    </TableCell>
                                                    <TableCell className={brandClasses.tableCell}>
                                                        <div className={classes.cellDiv}>
                                                            {user.email}
                                                        </div>

                                                    </TableCell>
                                                    <TableCell className={brandClasses.tableCell}>
                                                        {/* {user.phone} */}
                                                        <PhoneNumberFormat value={user.phone} />
                                                    </TableCell>
                                                    <TableCell align='center' className={brandClasses.tableCell}>
                                                        {!user.latest_test_result
                                                            ?
                                                            <Typography className={brandClasses.emptyTestResult}>
                                                                - - - - -
                                                            </Typography>
                                                            : user.latest_test_result.result === 'Positive'
                                                                ? <img src='/images/svg/status/red_shield.svg' alt='' className={classes.statusIcon} />
                                                                : user.latest_test_result.result === 'Negative'
                                                                    ? <img src='/images/svg/status/green_shield.svg' alt='' className={classes.statusIcon} />
                                                                    : <img src='/images/svg/status/pending_turquoise.svg' alt='' className={classes.statusIcon} />
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center" className={brandClasses.tableCell}>
                                                        <Actions
                                                            handleView={() => handleView(user._id)}
                                                        />
                                                    </TableCell>
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
                    count={userList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>


            <UserDialog
                dialogOpen={dialogOpen}
                onDialogClose={onDialogClose}
                userId={userId}
            />
        </div>
    );
}