import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';
import { getUsers1, searchUsers } from 'actions/api';
// import { CircularProgress } from '@material-ui/core';
import { showErrorDialog } from 'actions/dialogAlert';
// import TuneIcon from '@material-ui/icons/Tune';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Actions from 'views/UserManager/components/Actions';
import UserDialog from 'views/UserManager/UserDialog/UserDialog';
import CustomTable from 'components/CustomTable';
import SearchBar from 'components/SearchBar';
import TextButton from 'components/Button/TextButton';

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
    // marginBottom: theme.spacing(2),
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
    paddingRight: 10,
    paddingBottom: 10,
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
  },
  inActive: {
    color: '#D8D8D8 !important'
  },
}));

// const headCells = [
//   { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
//   { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
//   { id: 'location_id', numeric: false, disablePadding: true, label: 'Location' },
//   { id: 'department', numeric: false, disablePadding: true, label: 'Department' },
//   { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
//   { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
//   { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
//   { id: 'viewmore', numeric: false, disablePadding: false, label: 'View More' },
// ];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// function EnhancedTableHead(props) {
//   const { order, orderBy, onRequestSort } = props;
//   // const classes = useStyles();
//   const brandClasses = brandStyles();
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>

//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             // align={headCell.numeric ? 'right' : 'left'}
//             // padding={headCell.disablePadding ? 'none' : 'default'}
//             sortDirection={orderBy === headCell.id ? order : false}
//             align={headCell.id === 'viewmore' || headCell.id === 'status' ? 'center' : 'left'}
//             className={brandClasses.tableHead}
//           >
//             {headCell.id === 'status' || headCell.id === 'viewmore' ?
//               headCell.label
//               :
//               <TableSortLabel
//                 active={orderBy === headCell.id}
//                 direction={orderBy === headCell.id ? order : 'asc'}
//                 onClick={createSortHandler(headCell.id)}
//                 classes={{
//                   icon: brandClasses.tableSortLabel,
//                   active: brandClasses.tableSortLabel
//                 }}
//               // IconComponent={orderIconComponent}
//               >
//                 {headCell.label}
//               </TableSortLabel>
//             }
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

const DepartmentStaff = (props) => {
  const { location, getUsers1, searchUsers } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [order, setOrder] = useState('asc');
  // const [orderBy, setOrderBy] = React.useState('lastname');
  const [userId, setUserId] = React.useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  const [refetch, setRefetch] = useState(0);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const departmentId = new URLSearchParams(location.search).get('department_id');
  const departmentName = new URLSearchParams(location.search).get('department_name');

  const metaData = [
    { key: 'last_name', label: 'Last Name', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'first_name', label: 'First Name', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'location_id.name', label: 'Location', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'department_id.name', label: 'Department', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'email', label: 'Email', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'phone', label: 'Phone', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'latest_test_result.result', label: 'Status', align: 'center', sortable: false, cellStyle: brandClasses.tableCell },
    { key: 'view_more', label: 'View More', align: 'center', sortable: false, cellStyle: brandClasses.tableCell },
  ];

  // useEffect(() => {
  //   if (departmentId) {
  //     fetchUsers();
  //   } else {
  //     setLoading(false);
  //     showErrorDialog('Department ID is missing in Params');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    (async () => {
      if (departmentId) {
        let queryParams = `department_id=${departmentId}&`;
        queryParams += `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
        let res = {};
        setLoading(true);
        if (submittedSearch.length)
          res = await searchUsers({ search_string: submittedSearch }, queryParams);
        else
          res = await getUsers1(queryParams);
        setLoading(false);

        if (res.success) {
          setUserList(res.data);
          setCount(res.count);
        }
      } else {
        setLoading(false);
        showErrorDialog('Department ID is missing in Params');
      }
    })();
    // eslint-disable-next-line
  }, [refetch, submittedSearch, page, rowsPerPage, order, orderBy]);

  const handleSearchSubmit = async (str) => {
    setPage(0);
    setSubmittedSearch(str);
  };

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  // const fetchUsers = () => {
  //   getUsers(`department_id=${departmentId}`).then(res => {
  //     setLoading(false);
  //     if (res.data.success) {
  //       setUserList(res.data.data);
  //     } else {
  //       showFailedDialog(res);
  //     }
  //   }).catch(error => {
  //     setLoading(false);
  //     showErrorDialog(error);
  //   });
  // }

  // const onClickSearchInput = (event) => {
  //   console.log('isOpen', isOpen, event);
  // }

  const onDialogClose = (doFetch) => {
    if (doFetch) {
      setRefetch(refetch => refetch + 1);
      // fetchUsers();
    }
    setDialogOpen(false);
  }

  const onAddUser = () => {
    setUserId(null);
    setDialogOpen(true);
  }

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'phone') {
      return (
        <div className={row.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>
          <PhoneNumberFormat value={value} />
        </div>
      );
    }
    if (column.key === 'location_id.name') {
      return (
        <div className={row.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>
          {row.location_id.name}
        </div>
      );
    }
    if (column.key === 'department_id.name') {
      return (
        <div className={row.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>
          <span>{row.department_id && row.department_id.name}</span>
        </div>
      );
    }
    if (column.key === 'latest_test_result.result') {
      return (
        !row.latest_test_result ? (
          <Typography className={brandClasses.emptyTestResult}>
            - - - - -
          </Typography>
        ) : row.latest_test_result.result === 'Positive' ? (
          <img
            src={row.active ? "/images/svg/status/red_shield.svg" : "/images/svg/status/gray_failed_shield.svg"}
            alt=""
            className={classes.statusIcon}
          />
        ) : row.latest_test_result.result === 'Negative' ? (
          <img
            src={row.active ? "/images/svg/status/green_shield.svg" : "/images/svg/status/gray_check_shield.svg"}
            alt=""
            className={classes.statusIcon}
          />
        ) : (
          <img
            src={row.active ? "/images/svg/status/pending_turquoise.svg" : "/images/svg/status/gray_turquoise.svg"}
            alt=""
            className={classes.statusIcon}
          />
        )
      );
    }
    if (column.key === 'view_more') {
      return (
        <Actions
          user_id={row._id}
          userActive={row.active}
        />
      );
    }
    return (
      <div className={row.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{value}</div>
    )
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div>
          <Typography variant="h2" className={brandClasses.headerTitle2}>
            <img src="/images/svg/department_header_icon.svg" alt="" style={{ width: 35 }} />
            {'DEPARTMENT MANAGER | '} {departmentName ? departmentName + ' | ' : ''}
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>USER LIST</Typography>
        </div>

        <TextButton
          category="Icon"
          onClick={onAddUser}
          startIcon={<AddIcon />}
        >
          Add User
        </TextButton>
      </div>
      <div className={classes.header2}>
        <SearchBar
          handleSearchSubmit={handleSearchSubmit}
        />
        {/* <SearchBar className={classes.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} /> */}
        {/* <div className={classes.settingIconBox}><TuneIcon className={classes.settingIcon} /></div> */}
      </div>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={userList}
        count={count}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />

      {/* <Paper style={{ marginTop: 16 }}>
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
                            {user.department_id && user.department_id.name}
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            <div className={classes.cellDiv}>
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            <PhoneNumberFormat value={user.phone} />
                          </TableCell>
                          <TableCell align='center' className={brandClasses.tableCell}>
                            {!user.latest_test_result
                              ?
                              <Typography className={brandClasses.emptyTestResult}>
                                {'- - - - -'}
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
                              user_id={user._id}
                              userActive={user.active}
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
      </Paper> */}

      <UserDialog
        dialogOpen={dialogOpen}
        onDialogClose={onDialogClose}
        userId={userId}
      />
    </div>
  );
}

DepartmentStaff.propTypes = {
  getUsers1: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
};

export default connect(null, { getUsers1, searchUsers, showErrorDialog })(withRouter(DepartmentStaff));