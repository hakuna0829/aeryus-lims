import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import { Typography, Chip, TableRow, TableCell, CircularProgress, Grid, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';
import { getUsers1, searchUsers, getUserActivityHistory, deleteUser, restoreUser, deleteForeverUser } from 'actions/api';
// import { CircularProgress } from '@material-ui/core';
import { showErrorDialog } from 'actions/dialogAlert';
// import TuneIcon from '@material-ui/icons/Tune';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Actions from 'views/UserManager/components/Actions';
import UserDialog from 'views/UserManager/UserDialog/UserDialog';
import CustomTable from 'components/CustomTable';
import SearchBar from 'components/SearchBar';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import moment from "moment";
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import ImportDialog from 'views/UserManager/UserDetails/components/ImportDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Alert from '@material-ui/lab/Alert';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoIcon from '@material-ui/icons/Info';
import FilterSettingPopup from 'views/UserManager/UserDetails/components/FilterSettingPopup';
import ScheduleAction from 'views/SiteManager/PopulationManager/components/ScheduleAction';
import TexButton from 'components/Button/TextButton';
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
  // statusIcon: {
  //   width: '25px',
  //   display: 'flex',
  //   margin: '0 auto',
  //   // height: '30px'
  // },
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
  statusIcon: {
    width: '25px',
    display: 'flex',
    margin: '0 auto',
    // height: '30px'
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
const FiltersInit = [
  // {
  //   groupKey: 'DEPARTMENT',
  //   children: [
  //     { id: '', label: '', value: false },
  //   ]
  // },
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
const PopulationUsers = (props) => {
  const { location, getUsers1, searchUsers, getUserActivityHistory, deleteUser, restoreUser, deleteForeverUser } = props;

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [dialogFilterOpen, setDialogFilterOpen] = useState(false);
  const [isImported, setIsImported] = useState(false);
  const [importedData, setImportedData] = useState({});
  const [arrGroupData, setArrGroupData] = useState([...FiltersInit]);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [anchorEl, setAnchorEl] = useState(false);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [showScheduleDialog,setScheduleDialog] = useState(false);
  const [selectedScheduleUser,setSelectedScheduleUser] = useState({});

  const [activityHistoryList, setActivityHistoryList] = useState([]);
  const [activityHistoryLoading, setActivityHistoryLoading] = useState(false);
  const populationId = new URLSearchParams(location.search).get('population_id');
  const populationType = new URLSearchParams(location.search).get('population_type');

  const metaData = [
    { key: 'history_expand', label: '', align: 'center', sortable: false, cellStyle: brandClasses.tableCell2 },
    { key: 'last_name', label: 'Last Name', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'first_name', label: 'First Name', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'location_id.name', label: 'Location', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'department_id.name', label: 'Department', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'email', label: 'Email', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'phone', label: 'Phone', align: 'left', sortable: true, cellStyle: brandClasses.tableCell },
    { key: 'latest_test_result.result', label: 'Results', align: 'center', sortable: false, cellStyle: brandClasses.tableCell, tooltip: true, tooltipdata: "TEST RESULTS", minWidth: 100 },
    { key: 'view_more', label: 'Actions', align: 'center', sortable: false, cellStyle: brandClasses.tableCell, tooltip: true, minWidth: 180, tooltipdata: "Actions" },
    { key: 'active', label: 'Status', align: 'center', sortable: false, cellStyle: brandClasses.tableCell, tooltip: true, minWidth: 100, tooltipdata: "Status" }
  ];

  // useEffect(() => {
  //   if (populationId) {
  //     fetchUsers();
  //   } else {
  //     setLoading(false);
  //     showErrorDialog('population ID is missing in Params');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    (async () => {
      if (populationId) {
        let queryParams = `populationsettings_id=${populationId}&`;
        queryParams += `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
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
      } else {
        setLoading(false);
        showErrorDialog('Population ID is missing in Params');
      }
    })();
    // eslint-disable-next-line
  }, [refetch, submittedSearch, page, rowsPerPage, order, orderBy,selectedFilter]);

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
  //   getUsers(`populationsettings_id=${populationId}`).then(res => {
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
  const onHistoryExpand = async (user_id, open) => {
    setUserList(
      userList.map(user =>
        user._id === user_id ?
          { ...user, open: !open } :
          { ...user, open: false }
      )
    );
    if (!open) {
      setActivityHistoryLoading(true);
      let res = await getUserActivityHistory(user_id);
      setActivityHistoryLoading(false);
      if (res.success) {
        setActivityHistoryList(res.data);
      }
    }
  }
  const onEditUser = (id) => {
    setUserId(id);
    setDialogOpen(true);
  };
  const onCompleteImport = (data) => {
    console.log('data', data);
    setIsImported(true);
    setImportedData(data);
  }
  const handleDelete = (id, name) => {
    setSelectedUser({ id, action: 'Delete', message: `Do you want to move user '${name}' to Trash ?` });
    setConfirmDialogOpen(true);
  }

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
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

  const onUpload = () => {
    setDialogFilterOpen(true);
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
    // filters['location_ids'] = updatedFilters.find(f => f.groupKey === 'LOCATION').children.filter(c => c.value).map(c => c.id);
    // filters['department_ids'] = updatedFilters.find(f => f.groupKey === 'DEPARTMENT').children.filter(c => c.value).map(c => c.id);
    filters['status'] = updatedFilters.find(f => f.groupKey === 'STATUS').children.filter(c => c.value).map(c => c.id);
    setSelectedFilter(JSON.stringify(filters));
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSchedule = (user) =>{
    setSelectedScheduleUser(user)
    setScheduleDialog(true)
  }

  const onScheduleDialogClose = ()=>{
    setScheduleDialog(false)
  }
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
          {row.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>
      );
    }
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
            - -
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
    if (column.key === 'active') {
      return (
        <img
          src={row.active ? "/images/svg/User.svg" : "/images/svg/status/User_Inactive.svg"}
          alt=""
          className={classes.statusIcon}
        />
      );
    }
    if (column.key === 'view_more') {
      return (
        <Actions
          user_id={row._id}
          userActive={row.active}
          handleEdit={() => onEditUser(row._id)}
          handleDelete={() => handleDelete(row._id, row.first_name + ' ' + row.last_name)}
          handleSchedule={()=>handleSchedule(row)}
        />
      );
    }
    return (
      <div className={row.active ? classes.cellDiv : clsx(classes.cellDiv, classes.inActive)}>{value}</div>
    )
  };
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
        <div>
          <Typography variant="h2" className={brandClasses.headerTitle2}>
            <img src="/images/svg/status/users_icon.svg" alt="" style={{ width: 35 }} />
            {'POPULATION MANAGER | '}
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}> {populationType ? populationType + ' | ' : ''} LIST</Typography>
        </div>

        {/* <Button
          variant="contained"
          className={classes.greenBtn}
          startIcon={<AddIcon />}
          onClick={onAddUser}>
          {'Add User'}
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
            <Typography variant="h4" className={classes.notificationTitle}>Your <span>{populationType}</span> import is complete!</Typography>
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
            <div className={classes.settingIconBox}>
              <img
                src="/images/svg/Filter.svg"
                alt=""
                onClick={handleClick}
              // onClick={() => setDialogFilterOpen(true)}
              />
              {/* <TuneIcon
                className={classes.settingIcon}
                onClick={() => setDialogFilterOpen(true)}
              /> */}
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
              className={classes.settingIconBox}
              style={{ marginRight: '15px' }}
            >
              <img
                src="/images/svg/upload.svg"
                alt=""
                onClick={() => onUpload()}
              />
            </div>
            {populationType !== 'Trash' &&
              // <Button
              //   variant="contained"
              //   onClick={onAddUser}
              //   className={classes.greenBtn}>
              //   <AddIcon /> Add New{' '}
              //   {/* {population_type !== 'All' ? population_type.slice(0, -1) : 'New'} */}
              // </Button>
              <TexButton 
                category="Icon"
                startIcon={<AddIcon />}
                onClick={onAddUser}
              >
                Add New
              </TexButton>
            }
          </Box>
        </Grid>
      </Grid>
      {/* <div className={classes.header2}>
        <SearchBar
          handleSearchSubmit={handleSearchSubmit}
        />
      </div> */}
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
      <ImportDialog
        dialogOpen={dialogFilterOpen}
        onDialogClose={setDialogFilterOpen}
        // settings={filterItems}
        // key={filterItems}
        onCompleted={onCompleteImport}
      />
      <UserDialog
        dialogOpen={dialogOpen}
        onDialogClose={onDialogClose}
        userId={userId}
      />
      <DialogAlert
        open={confirmDialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Are you sure ?'}
        message={selectedUser.message || ''}
        onClose={handleDialogClose}
        onAction={handleDeleteDialogAction}
      />
      <ScheduleAction
      dialogOpen={showScheduleDialog}
      onDialogClose={onScheduleDialogClose}
      user={selectedScheduleUser}
      populationId={populationId}
      />
    </div>
  );
}

PopulationUsers.propTypes = {
  getUsers1: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  getUserActivityHistory: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  restoreUser: PropTypes.func.isRequired,
  deleteForeverUser: PropTypes.func.isRequired,
};

export default connect(null, { getUsers1, searchUsers, showErrorDialog, getUserActivityHistory, deleteUser, restoreUser, deleteForeverUser })(withRouter(PopulationUsers));