import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import {
  Typography,
  Chip,
  TableRow,
  TableCell,
  CircularProgress,
  Grid,
  Box,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import brandStyles from 'theme/brand';
import { getLocations1, getDepartments, getUsers1, searchUsers, deleteUser, restoreUser, deleteForeverUser, getUserActivityHistory } from 'actions/api';
import UserDialog from './UserDialog/UserDialog';
import * as appConstants from 'constants/appConstants';
import DialogAlert from 'components/DialogAlert';
import SearchBar from 'components/SearchBar';
import ImportDialog from './UserDetails/components/ImportDialog';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import moment from "moment";
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoIcon from '@material-ui/icons/Info';
import FilterSettingPopup from './UserDetails/components/FilterSettingPopup';
import CustomTable from 'components/CustomTable';
import Actions from './components/Actions';
import TrashActions from './components/TrashActions';
import TextButton from 'components/Button/TextButton';

const useStyles = makeStyles(theme => ({
  root: {
    // paddingTop: theme.spacing(2),
  },
  container: {
    maxHeight: 600,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText,
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  header2: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `0px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    borderRadius: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  applyButton: {
    color: theme.palette.white,
    backgroundColor: theme.palette.brandDark,
    border: `0.75px solid ${theme.palette.brandDark}`,
    borderRadius: '10px',
    textTransform: 'none',
    marginTop: '10px',
    padding: '6px 24px',
    '&:hover': {
      backgroundColor: theme.palette.brandGreen,
    },
  },
  activateButton: {
    color: theme.palette.brandGreen,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGreen}`,
    borderRadius: '8px',
    textTransform: 'none',
  },
  deactivateButton: {
    color: theme.palette.brandGray,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGray}`,
    borderRadius: '8px',
    textTransform: 'none',
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
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  marginRight15: {
    marginRight: 15
  },
  actionIcon: {
    cursor: 'pointer'
  },
  editIcon: {
    width: 20
  },
  trashIcon: {
    width: 16
  },
  tableHead: {
    backgroundColor: `${theme.palette.white} !important`,
    padding: '8px 1px',
    [theme.breakpoints.between('md', 'lg')]: {
      padding: '12px 16px'
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: '8px 16px'
    }
  },
  uploadIconBox: {
    width: '42px',
    height: '40px',
    display: 'block',

    fontFamily: 'verdana',
    fontSize: '22px',
    padding: 0,
    margin: '0px 15px 0 0',
    border: 'solid 1px',
    borderColor: theme.palette.brandDark,
    borderRadius: '3px',
    boxShadow: '2.34545px 3.12727px 3.90909px rgba(4, 59, 93, 0.15)',
    outline: 0,
    lineHeight: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    background: '#fff',
    
  },
  cellDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    // width: '140px',
    whiteSpace: 'nowrap',
    // [theme.breakpoints.between('md', 'lg')]: {
    //   width: '80px',
    // },
    // [theme.breakpoints.between('sm', 'md')]: {
    //   width: '60px',
    // },
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width: '320px',
    // },
  },
  statusCellDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    // width: '60px',
    whiteSpace: 'nowrap',
    padding: '0px',
    // [theme.breakpoints.between('md', 'lg')]: {
    //   width: '60px',
    // },
    // [theme.breakpoints.between('sm', 'md')]: {
    //   width: '60px',
    // },
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width: '320px',
    // },
  },
  inActive: {
    color: '#D8D8D8 !important'
  },
  boxHistoryTitleContainer: {
    margin: '8px 0px',
    borderBottom: 'solid 1px #D8D8D8'
  },
  boxHistoryContentContainer: {
    margin: '8px 0px',
    paddingLeft: '35px'
  },
  historyContentItem: {
    fontfamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '17px',
    paddingBottom: '8px',
    color: theme.palette.black
  },
  historyTitle: {
    // borderBottom: 'solid 1px',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px',
    paddingBottom: '8px',
    paddingLeft: '32px',
    color: theme.palette.blueDark
  },
  historyPipe: {
    color: theme.palette.blueDark,
    fontSize: 20,
    // fontWeight: 600
  },
  viewHereLink: {
    color: theme.palette.brandDark,
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.blueDark
    }
  },

  // Filter layout
  selectedContainer: {
    margin: '8px 16px'
  },
  selectedItem: {
    marginRight: '8px',
    borderRadius: '6px',
    backgroundColor: theme.palette.brandLightGray
  },
  selectedDeleteIcon: {
    color: 'rgba(0, 0, 0, 0.6)'
  },
  paperRoot: {
    marginTop: '10px',
    marginLeft: '-6px',
    border: 'solid 1px',
    padding: '8px'
  },
  filterTitle: {
    fontFamily: 'Montserrat',
    fontSize: '20px',
    fontWeight: 600,
    color: theme.palette.brandDark,
    paddingBottom: '8px'
  },
  filterGroupLabel: {
    fontSize: '16px',
    fontWeight: 500,
    color: theme.palette.brandDark
  },
  filterSubLabel: {
    fontSize: '16px',
    color: theme.palette.brandDark
  },
  checkboxRoot: {
    padding: '4px 9px',
    color: theme.palette.brandDark
  },
  checkboxChecked: {
    color: `${theme.palette.blueDark} !important`
  },
  subGroupContainer: {
    paddingLeft: '16px'
  },

  notificationContainer: {
    padding: '0 16px'

  },
  alertRoot: {
    marginLeft: '16px',
    display: 'inline-flex',
    padding: '0px 12px',
    color: theme.palette.brandDark,
    fontsize: '14px',
    margin: '16px 0',
    '&:first-child': {
      marginLeft: 0
    }
  },

  notificationTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '24px',
    color: theme.palette.brandDark,
    '& span': {
      textTransform: 'capitalize'
    }
  },
  notificationDesc: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.palette.brandDark,
  }

}));

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
//   const classes = useStyles();
//   const brandClasses = brandStyles();
//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell className={classes.tableHead}></TableCell>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             // align={headCell.numeric ? 'right' : 'left'}
//             // padding={headCell.disablePadding ? 'none' : 'default'}
//             sortDirection={orderBy === headCell.id ? order : false}
//             align={headCell.id === 'viewmore' || headCell.id === 'status' ? 'center' : 'left'}
//             className={classes.tableHead}
//           >
//             { headCell.id === 'viewmore' ? headCell.label :
//               headCell.id === 'status' ?
//                 <TableSortLabel
//                   active={orderBy === 'latest_test_result.result'}
//                   direction={orderBy === 'latest_test_result.result' ? order : 'asc'}
//                   onClick={createSortHandler('latest_test_result.result')}
//                   classes={{
//                     icon: brandClasses.tableSortLabel,
//                     active: brandClasses.tableSortLabel
//                   }}
//                 // IconComponent={orderIconComponent}
//                 >
//                   <div className={classes.statusCellDiv}>
//                     {headCell.label}
//                   </div>
//                 </TableSortLabel>
//                 :
//                 <TableSortLabel
//                   active={orderBy === headCell.id}
//                   direction={orderBy === headCell.id ? order : 'asc'}
//                   onClick={createSortHandler(headCell.id)}
//                   classes={{
//                     icon: brandClasses.tableSortLabel,
//                     active: brandClasses.tableSortLabel
//                   }}
//                 // IconComponent={orderIconComponent}
//                 >
//                   {headCell.id !== 'active' && headCell.id !== 'viewmore' ?
//                     <div className={classes.cellDiv}>
//                       {headCell.label}
//                     </div> :
//                     headCell.label
//                   }
//                 </TableSortLabel>
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

// const columns = ['Last Name', 'First Name', 'Location', 'Department', 'Email', 'Phone', 'Status', 'View More'];
// const headCells = [
//   { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
//   { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
//   { id: 'dob', numeric: false, disablePadding: true, label: 'DOB' },
//   { id: 'location_id', numeric: false, disablePadding: true, label: 'Location' },
//   { id: 'department', numeric: false, disablePadding: true, label: 'Department' },
//   { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
//   { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
//   { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
//   { id: 'viewmore', numeric: false, disablePadding: false, label: 'View More' },
//   { id: 'active', numeric: false, disablePadding: false, label: '' },
// ];

// const FiltersInit1 = [
//   { id: 'Pending_Completion', label: 'Pending Completion', checked: false },
//   { id: 'Not_Tested', label: 'Not Tested', checked: false },
//   { id: 'Status_Positive', label: 'Status Positive', checked: false }
// ];

const FiltersInit = [
  {
    groupKey: 'LOCATION',
    children: [
      { id: '', label: '', value: false },
    ]
  },
  {
    groupKey: 'DEPARTMENT',
    children: [
      { id: '', label: '', value: false },
    ]
  },
  {
    groupKey: 'STATUS',
    children: [
      { id: 'Pending_Completion', label: 'Pending Completion', value: false },
      { id: 'Not_Tested', label: 'Not Tested', value: false },
      { id: 'Positive', label: 'Positive', value: false },
      { id: 'Negative', label: 'Negative', value: false }
    ]
  }
];

const UserList = (props) => {
  const { match, getLocations1, locations, getDepartments, departments, getUsers1, searchUsers, deleteUser, restoreUser, deleteForeverUser, getUserActivityHistory } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const population_type = match.params.population_type;

  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  // const [filteredUserList, setFilteredUserList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFilterOpen, setDialogFilterOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [userId, setEmplyeeId] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const [searchKeys, setSearchKeys] = useState(['first_name', 'last_name', 'email', 'phone']);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [arrGroupData, setArrGroupData] = useState([...FiltersInit]);
  const [refetch, setRefetch] = useState(0);

  const [activityHistoryLoading, setActivityHistoryLoading] = useState(false);
  const [activityHistoryList, setActivityHistoryList] = useState([]);

  const [anchorEl, setAnchorEl] = useState(false);
  const [isImported, setIsImported] = useState(false);
  const [importedData, setImportedData] = useState({});

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const metaData = [
    { key: 'history_expand', label: '', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
    { key: 'last_name', label: 'Last Name', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'first_name', label: 'First Name', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'dob', label: 'DOB', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'location_id.name', label: 'Location', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'department_id.name', label: 'Department', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'email', label: 'Email', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'phone', label: 'Phone', align: 'left', sortable: true, cellStyle: brandClasses.tableCell2 },
    { key: 'latest_test_result.result', label: 'Result', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
    { key: 'view_more', label: 'Actions', align: 'center', sortable: false, minWidth: 160, cellStyle: brandClasses.tableCell2 },
    { key: 'active', label: 'Status', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
  ];

  useEffect(() => {
    (async () => {
      if (!locations)
        await getLocations1();
      if (!departments)
        await getDepartments();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (locations) {
      let temp = FiltersInit.map(f => {
        if (f.groupKey === 'LOCATION')
          f.children = locations.map(l => { return ({ id: l._id, label: l.name, value: false }) });
        return f;
      });
      setArrGroupData(temp);
    }
    // eslint-disable-next-line
  }, [locations]);

  useEffect(() => {
    if (departments) {
      let temp = FiltersInit.map(f => {
        if (f.groupKey === 'DEPARTMENT')
          f.children = departments.map(d => { return ({ id: d._id, label: d.name, value: false }) });
        return f;
      });
      setArrGroupData(temp);
    }
    // eslint-disable-next-line
  }, [departments]);

  useEffect(() => {
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      if (population_type !== 'All')
        queryParams += `&population_type=${population_type}`;
      if (selectedFilter)
        queryParams += `&filter=${selectedFilter}`;
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
    })();
    // eslint-disable-next-line
  }, [refetch, submittedSearch, page, rowsPerPage, order, orderBy, population_type, selectedFilter]);

  const handleSearchSubmit = async (str) => {
    setPage(0);
    setSubmittedSearch(str);
  };

  // useEffect(() => {
  //   fetchUsers();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [population_type, selectedFilter]);

  // useEffect(() => {
  //   const currentFilterItems = filterItems.filter(item => item.checked === true);
  //   var temp = [];
  //   currentFilterItems.map(item => {
  //     temp.push(item.id);
  //     return true;
  //   })
  //   setSearchKeys(['first_name', 'last_name', 'email', 'phone']);
  // }, [filterItems]);

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // const fetchUsers = (queryParams) => {
  //   if (!queryParams)
  //     queryParams = population_type ? population_type === 'All' ? undefined : `population_type=${population_type}&` : undefined;
  //   if (selectedFilter)
  //     queryParams = `${queryParams ? queryParams : ''}filter=${selectedFilter}`;
  //   setLoading(true);
  //   getUsers(queryParams).then(res => {
  //     setLoading(false);
  //     if (res.data.success) {
  //       setUserList(res.data.data);
  //       setFilteredUserList(res.data.data);
  //       // console.log('FilteredUserList', res.data.data)
  //     } else {
  //       showFailedDialog(res);
  //     }
  //   }).catch(error => {
  //     setLoading(false);
  //     showErrorDialog(error);
  //   });
  // }

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onDialogClose = (doFetch) => {
    if (doFetch) {
      setRefetch(refetch => refetch + 1);
      // fetchUsers();
    }
    setDialogOpen(false);
  };

  const onAddUser = () => {
    setEmplyeeId(null);
    setDialogOpen(true);
  };

  const onEditUser = (id) => {
    setEmplyeeId(id);
    setDialogOpen(true);
  };

  const handleDelete = (id, name) => {
    setSelectedUser({ id, action: 'Delete', message: `Do you want to move user '${name}' to Trash ?` });
    setConfirmDialogOpen(true);
  }

  const handleRestore = (id, name) => {
    setSelectedUser({ id, action: 'Restore', message: `Do you want to Restore user '${name}' ?` });
    setConfirmDialogOpen(true);
  }

  const handleDeleteForever = (id, name) => {
    setSelectedUser({ id, action: 'DeleteForever', message: `Do you want to Delete '${name}' Forever ? Everything related to this user will be deleted permanently.` });
    setConfirmDialogOpen(true);
  }

  const onUpload = () => {
    setDialogFilterOpen(true);
  }

  const handleDeleteDialogAction = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    let res;
    if (selectedUser.action === 'Restore') {
      res = await restoreUser({ user_id: selectedUser.id });
    } else if (selectedUser.action === 'DeleteForever') {
      res = await deleteForeverUser(selectedUser.id);
    } else {
      res = await deleteUser(selectedUser.id);
    }
    setLoading(false);
    if (res.success) {
      setRefetch(refetch => refetch + 1);
    }
  }

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  }

  // const onClickSearchInput = (event) => {
  //   console.log('isOpen', isOpen, event);
  // }

  // const onChangeSearch = async (e) => {
  //   e.persist();
  //   const keys = searchKeys;//['first_name', 'last_name', 'email', 'phone', 'location_id'];

  //   if (userList && userList.length > 0) {
  //     setFilteredUserList(utility.filter(userList, e.target.value, keys));
  //   }
  // }

  // const onChangeFilterItems = (index, e) => {
  //   e.persist();
  //   var tempFilterItems = filterItems;
  //   if (e.target.checked)
  //     tempFilterItems.forEach(t => t.checked = false);
  //   tempFilterItems[index].checked = e.target.checked;
  //   setFilterItems([...tempFilterItems]);
  // }

  // const onFilterSubmit = () => {
  //   setDialogFilterOpen(false);
  //   setSelectedFilter(filterItems.find(f => f.checked) ? filterItems.find(f => f.checked).id : undefined);
  // }

  const onCompleteImport = (data) => {
    console.log('data', data);
    setIsImported(true);
    setImportedData(data);
  }

  const removeFilterConditionItem = (groupKey, id, value) => {
    var currentGroup = arrGroupData.filter((group => group.groupKey === groupKey))[0];

    currentGroup.children.map((sloc => {
      if (sloc.id === id) {
        sloc.value = value;
      }
      return sloc;
    }))

    const updatedGroup = arrGroupData.map((group => {
      if (group.groupKey === groupKey) {
        group = currentGroup;
      }
      return group
    }))
    setArrGroupData(updatedGroup);
    updateFilter(updatedGroup);
  }

  const handleCloseFilter = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = (appliedFilters) => {
    setAnchorEl(null);
    updateFilter(appliedFilters);
  };

  const updateFilter = (updatedFilters) => {
    setPage(0);
    let filters = {};
    filters['location_ids'] = updatedFilters.find(f => f.groupKey === 'LOCATION').children.filter(c => c.value).map(c => c.id);
    filters['department_ids'] = updatedFilters.find(f => f.groupKey === 'DEPARTMENT').children.filter(c => c.value).map(c => c.id);
    filters['status'] = updatedFilters.find(f => f.groupKey === 'STATUS').children.filter(c => c.value).map(c => c.id);
    setSelectedFilter(JSON.stringify(filters));
  }

  // function Row(props) {
  //   const { user, rowIndex } = props;
  //   const [open, setOpen] = React.useState(false);
  //   // const classes = useRowStyles();

  //   return (
  //     <React.Fragment key={rowIndex}>
  //       <TableRow
  //         hover
  //         // onClick={(event) => handleClick(event, row.name)}
  //         tabIndex={-1}
  //         className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}>
  //         <TableCell className={brandClasses.tableCell}>
  //           <IconButton
  //             aria-label="expand row"
  //             size="small"
  //             onClick={() => setOpen(!open)}>
  //             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
  //           </IconButton>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{user.last_name}</div>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{user.first_name}</div>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>
  //             {user.dob ? moment.utc(user.dob).format('MM/DD/YYYY') : ''}
  //           </div>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{user.location_id.name}</div>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{user.department_id && user.department_id.name}</div>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{user.email}</div>
  //         </TableCell>
  //         <TableCell className={brandClasses.tableCell}>
  //           {/* {user.phone} */}
  //           <div className={user.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>
  //             <PhoneNumberFormat value={user.phone} />
  //           </div>
  //         </TableCell>
  //         <TableCell align="center" className={brandClasses.tableCell}>
  //           {!user.latest_test_result ? (
  //             <Typography className={brandClasses.emptyTestResult}>
  //               - - - - -
  //             </Typography>
  //           ) : user.latest_test_result.result === 'Positive' ? (
  //             <img
  //               src={user.active ? "/images/svg/status/red_shield.svg" : "/images/svg/status/gray_failed_shield.svg"}
  //               alt=""
  //               className={classes.statusIcon}
  //             />
  //           ) : user.latest_test_result.result === 'Negative' ? (
  //             <img
  //               src={user.active ? "/images/svg/status/green_shield.svg" : "/images/svg/status/gray_check_shield.svg"}
  //               alt=""
  //               className={classes.statusIcon}
  //             />
  //           ) : (
  //             <img
  //               src={user.active ? "/images/svg/status/pending_turquoise.svg" : "/images/svg/status/gray_turquoise.svg"}
  //               alt=""
  //               className={classes.statusIcon}
  //             />
  //           )}
  //         </TableCell>
  //         <TableCell align="center" className={brandClasses.tableCell}>
  //           <Actions
  //             user_id={user._id}
  //             userActive={user.active}
  //             // handleView={() => handleView(user._id)}
  //             handleEdit={() => onEditUser(user._id)}
  //             handleDelete={() => handleDelete(user._id, user.first_name)}
  //           />
  //         </TableCell>
  //         <TableCell align="center" className={classes.statusCellDiv}>
  //           <img
  //             src={user.active ? "/images/svg/status/approved user.svg" : "/images/svg/status/inactive user.svg"}
  //             alt=""
  //             className={classes.statusIcon}
  //           />
  //         </TableCell>
  //       </TableRow>

  //       <TableRow>
  //         <TableCell style={{ padding: 0 }} colSpan={12}>
  //           <Collapse in={open} timeout="auto" unmountOnExit>
  //             <Box margin={1} className={classes.boxHistoryTitleContainer}>
  //               <Typography
  //                 variant="h6"
  //                 // gutterBottom
  //                 component="div"
  //                 className={classes.historyTitle}>
  //                 {population_type.slice(0, -1)} History
  //               </Typography>
  //             </Box>
  //             <Box margin={1} className={classes.boxHistoryContentContainer}>
  //               <Typography
  //                 variant="h6"
  //                 // gutterBottom
  //                 component="div"
  //                 className={classes.historyContentItem}>
  //                 {user.last_name} {user.first_name} scheduled an appointment
  //                 for {moment.utc(user.created_date).format('MM/DD/YYYY')}{' '}
  //                 <a href="/" className={classes.viewHereLink}>
  //                   view here
  //                 </a>
  //               </Typography>
  //               <Typography
  //                 variant="h6"
  //                 // gutterBottom
  //                 component="div"
  //                 className={classes.historyContentItem}>
  //                 {user.last_name} {user.first_name} checked lab results on{' '}
  //                 {moment.utc(user.created_date).format('MM/DD/YYYY')}{' '}
  //                 <a href="/" className={classes.viewHereLink}>
  //                   view here
  //                 </a>
  //               </Typography>
  //               <Typography
  //                 variant="h6"
  //                 // gutterBottom
  //                 component="div"
  //                 className={classes.historyContentItem}>
  //                 {user.last_name} {user.first_name} checked in for testing on{' '}
  //                 {moment.utc(user.created_date).format('MM/DD/YYYY')} view test
  //                 results{' '}
  //                 <a href="/" className={classes.viewHereLink}>
  //                   view here
  //                 </a>
  //               </Typography>
  //               <Typography
  //                 variant="h6"
  //                 // gutterBottom
  //                 component="div"
  //                 className={classes.historyContentItem}>
  //                 {user.last_name} {user.first_name} scheduled a vaccine
  //                 appointment for
  //                 {moment.utc(user.created_date).format('MM/DD/YYYY')}{' '}
  //                 <a href="/" className={classes.viewHereLink}>
  //                   view here
  //                 </a>
  //               </Typography>
  //               <Typography
  //                 variant="h6"
  //                 // gutterBottom
  //                 component="div"
  //                 className={classes.historyContentItem}>
  //                 {user.last_name} {user.first_name} changed their address{' '}
  //                 <a href="/" className={classes.viewHereLink}>
  //                   view here
  //                 </a>
  //               </Typography>
  //             </Box>
  //           </Collapse>
  //         </TableCell>
  //       </TableRow>
  //     </React.Fragment>
  //   );
  // }

  const onHistoryExpand = async (user_id, open) => {
    setUserList(
      userList.map(user =>
        user._id === user_id ?
          { ...user, open: !open } :
          { ...user, open: false }
      )
    );
    // fetch activity history
    if (!open) {
      setActivityHistoryLoading(true);
      let res = await getUserActivityHistory(user_id);
      setActivityHistoryLoading(false);
      if (res.success) {
        setActivityHistoryList(res.data);
      }
    }
  };

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'history_expand') {
      return (
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => onHistoryExpand(row._id, row.open)}
        >
          {row.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      );
    }
    if (column.key === 'dob') {
      return (
        <div className={classes.cellDiv}>
          {value ? moment.utc(value).format('MM/DD/YYYY') : ''}
        </div>
      );
    }
    if (column.key === 'phone') {
      return (
        <div className={classes.cellDiv}>
          <PhoneNumberFormat value={value} />
        </div>
      );
    }
    if (column.key === 'location_id.name') {
      return (
        <div className={classes.cellDiv}>
          {row.location_id.name}
        </div>
      );
    }
    if (column.key === 'department_id.name') {
      return (
        <div className={classes.cellDiv}>
          <span>{row.department_id && row.department_id.name}</span>
        </div>
      );
    }
    if (column.key === 'latest_test_result.result') {
      return (
        !row.latest_test_result ? (
          <Typography className={brandClasses.emptyTestResult}>
            - -
          </Typography>
        ) : row.latest_test_result.result === 'Positive' ? (
          <img
            src="/images/svg/status/red_shield.svg"
            alt=""
            className={classes.statusIcon}
          />
        ) : row.latest_test_result.result === 'Negative' ? (
          <img
            src="/images/svg/status/green_shield.svg"
            alt=""
            className={classes.statusIcon}
          />
        ) : (
          <img
            src="/images/svg/status/pending_turquoise.svg"
            alt=""
            className={classes.statusIcon}
          />
        )
      );
    }
    if (column.key === 'view_more') {
      if (population_type === 'Trash') {
        return (
          <TrashActions
            handleRestore={() => handleRestore(row._id, row.first_name + ' ' + row.last_name)}
            handleDeleteForever={() => handleDeleteForever(row._id, row.first_name + ' ' + row.last_name)}
          />
        );
      } else {
        return (
          <Actions
            user_id={row._id}
            userActive={row.active}
            // handleView={() => handleView(user._id)}
            handleEdit={() => onEditUser(row._id)}
            handleDelete={() => handleDelete(row._id, row.first_name + ' ' + row.last_name)}
          />
        );
      }
    }
    if (column.key === 'active') {
      return (
        <img
          src={row.active ? "/images/svg/User.svg" : "/images/svg/status/User_Inactive.svg"}
          alt=""
          className={classes.statusIcon}
        />
      );
    }
    return (
      <div className={classes.cellDiv}>{value}</div>
      // <div className={row.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{value}</div>
    )
  }

  const ExpandableRow = (props) => {
    const { open, row } = props;

    return (
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.boxHistoryTitleContainer}>
              <Typography
                variant="h6"
                // gutterBottom
                component="div"
                className={classes.historyTitle}>
                {row.last_name} {row.first_name} History
              </Typography>
            </Box>
            <Box margin={1} className={classes.boxHistoryContentContainer}>
              {activityHistoryLoading
                ?
                <CircularProgress />
                :
                !activityHistoryList.length
                  ?
                  'No data to display...'
                  :
                  activityHistoryList.map((history, index) => {
                    return (
                      <Typography
                        key={index}
                        variant="h6"
                        // gutterBottom
                        component="div"
                        className={classes.historyContentItem}
                      >
                        {moment(history.date).format('MM/DD/YYYY h:mm A')}
                        <span className={classes.historyPipe}>{' | '}</span>
                        {history.activity}
                        {history.summary &&
                          <>
                            <span className={classes.historyPipe}>{' | '}</span>
                            {history.summary}
                          </>
                        }
                        {/* <a href="/" className={classes.viewHereLink}>
                          {'view here'}
                        </a> */}
                      </Typography>
                    );
                  })
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <Typography variant="h2" className={brandClasses.headerTitle}>
            <img src="/images/svg/status/users_icon.svg" alt="" />
            {population_type} |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>USER LIST</Typography>
        </div>
        {/* <Button variant="contained" onClick={onAddUser} className={classes.greenBtn}>
          <AddIcon />  Add New
        </Button> */}
      </div>

      {isImported ?
        <Grid
          container
          direction="row"
          className={classes.notificationContainer}
          // justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h4" className={classes.notificationTitle}>Your <span>{population_type}</span> import is complete!</Typography>
            <Typography variant="h5" className={classes.notificationDesc}>Here is a summary:</Typography>
          </Grid>
          <Grid item xs={12}>
            <Alert variant="outlined" iconMapping={{ success: <CheckCircleIcon fontSize="inherit" /> }} classes={{ root: classes.alertRoot }}>
              {importedData.imported} employees were uploaded
            </Alert>
            <Alert variant="outlined" iconMapping={{ success: <CheckCircleIcon fontSize="inherit" /> }} classes={{ root: classes.alertRoot }}>
              {importedData.sucess} employees were sucessfully imported
            </Alert>
            <Alert variant="outlined" iconMapping={{ error: <CancelIcon fontSize="inherit" /> }} severity="error" classes={{ root: classes.alertRoot }}>
              {importedData.failed} rows were not imported
            </Alert>
            <Alert variant="outlined" iconMapping={{ warning: <InfoIcon fontSize="inherit" /> }} severity="warning" classes={{ root: classes.alertRoot }}>
              {importedData.no_matched} rows did not match our system
            </Alert>
          </Grid>
        </Grid>
        :
        null
      }

      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <div className={classes.header2}>
            <div className={brandClasses.settingIconBox}>
              {/* <img
                src="/images/svg/Filter.svg"
                alt=""
                onClick={handleClick}
              // onClick={() => setDialogFilterOpen(true)}
              /> */}
              <Typography onClick={handleClick} style={{height:'100%'}}>&nbsp;</Typography>
              <FilterSettingPopup
                groupInfo={arrGroupData}
                updateGroupData={setArrGroupData}
                onClose={handleCloseFilter}
                onApply={handleApplyFilter}
                setAnchorEl={setAnchorEl}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                classes={{ paper: classes.paperRoot }}
              />
            </div>
            <SearchBar
              handleSearchSubmit={handleSearchSubmit}
            />
            {/* <SearchBar
              className={classes.searchBar}
              onClick={onClickSearchInput}
              toggleOpen={setIsOpen}
              isOpen={isOpen}
              onChange={onChangeSearch}
            /> */}
          </div>
        </Grid>
        <Grid item style={{ paddingRight: 15, paddingBottom: 20 }}>
          <Box display="flex">
            <div
              className={classes.uploadIconBox}
              style={{ marginRight: '15px' }}
            >
              <img
                src="/images/svg/upload.svg"
                alt=""
                onClick={() => onUpload()}
              />
            </div>
            {population_type !== 'Trash' &&
              // <Button
              //   variant="contained"
              //   onClick={onAddUser}
              //   className={classes.greenBtn}>
              //   <AddIcon /> Add New
              //   {/* {population_type !== 'All' ? population_type.slice(0, -1) : 'New'} */}
              // </Button>
              <TextButton
                category="Icon"
                onClick={onAddUser}
                startIcon={<AddIcon />}
              >
                Add New
              </TextButton>
            }
          </Box>
        </Grid>
      </Grid>

      <div className={classes.selectedContainer}>
        {arrGroupData.map((group) => (
          group.children.map(child => (
            child.value === true ?
              <Chip
                label={child.label}
                key={child.id}
                onDelete={() => removeFilterConditionItem(group.groupKey, child.id, !child.value)}
                classes={{ root: classes.selectedItem, deleteIcon: classes.selectedDeleteIcon }}
              />
              : ''
          ))
        ))}
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
        ExpandableRow={ExpandableRow}
      />

      {/* <Paper>
        <TableContainer className={classes.container}>
          <Table stickyHeader >
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
                !filteredUserList.length
                  ?
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  :
                  stableSort(filteredUserList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, rowIndex) => {

                      return (
                        <Row user={user} rowIndex={rowIndex} key={rowIndex} />
                      );
                    })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredUserList.length}
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

      <ImportDialog
        dialogOpen={dialogFilterOpen}
        onDialogClose={setDialogFilterOpen}
        // settings={filterItems}
        // key={filterItems}
        onCompleted={onCompleteImport}
      />

      <DialogAlert
        open={confirmDialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Are you sure ?'}
        message={selectedUser.message || ''}
        onClose={handleDialogClose}
        onAction={handleDeleteDialogAction}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
  departments: state.data.departments,
});

UserList.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  getUsers1: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  restoreUser: PropTypes.func.isRequired,
  deleteForeverUser: PropTypes.func.isRequired,
  getUserActivityHistory: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getLocations1, getDepartments, getUsers1, searchUsers, deleteUser, restoreUser, deleteForeverUser, getUserActivityHistory })(withRouter(UserList));