/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  // Button,
  Grid,
  // CircularProgress,
  // Select,
  // MenuItem,
  // InputLabel,
  // FormControl,
  // Table,
  // TableHead,
  // TableBody,
  // TableSortLabel,
  FormControl,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  Box,
  IconButton,
  // TableContainer,
  // Paper,
  // TablePagination,
  // CircularProgress
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
// import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
// import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import Order from 'icons/Order';
import SearchBar from 'components/SearchBar';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import ResultsSummary from 'views/LabManager/Dialog/ResultsSummary';
import { getTestings, searchTestings, getLocations1, deleteTesting } from 'actions/api';
import moment from 'moment';
// import * as utility from 'helpers/utility';
import ConfirmResultDialog from '../ConfirmResultDialog';
import CustomTable from 'components/CustomTable';
import EditTestingDialog from '../EditTestingDialog';
import Actions from '../Actions';
import * as appConstants from 'constants/appConstants';
import DialogAlert from 'components/DialogAlert';
import FilterSettingPopup from 'views/UserManager/UserDetails/components/FilterSettingPopup';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0
    // paddingLeft: theme.spacing(2)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2)
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  pageTitle: {
    color: theme.palette.blueDark
  },
  calendar: {
    margin: '0 auto'
  },
  cellDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '180px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('lg')]: {
      width: '120px'
    }
    // [theme.breakpoints.between('sm', 'md')]: {
    //   width: '320px',
    // },
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width: '320px',
    // },
  },
  statusIcon: {
    width: '25px',
    display: 'flex',
    margin: '0 auto'
    // height: '30px'
  },
  phoneContainer: {
    display: 'flex',
    // justifyContent: 'center',
    '& img': {
      width: '20px'
    }
  },
  emailContainer: {
    display: 'flex',
    // justifyContent: 'center',
    '& img': {
      width: '15px'
    }
  },
  statusBtn: {
    color: theme.palette.brandDark,
    borderRadius: '7px',
    border: '0.7px solid #0F84A9',
    padding: '0px 8px',
    fontSize: '12px',
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: theme.palette.brand
    }
  },
  tableActionBar: {
    margin: '0px auto',
    display: 'flex',
    padding: '0 16px',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  container: {
    paddingLeft: 16,
    paddingBottom: 12,
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
  locationSelect: {
    // width: '50%',
    marginRight: theme.spacing(2),
    width:'120px'
    // marginTop: theme.spacing(2),
    // marginBottom: theme.spacing(2)
  },
  header2: {
    display: 'flex',
    // justifyContent: 'flex-end',
    // padding: `0px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
  },
  
}));

const columnsDefault = [
  { key: 'row_expand', label: '', align: 'center', sortable: false },
  { key: 'last_name', label: 'Last Name', align: 'left', sortable: true },
  { key: 'first_name', label: 'First Name', align: 'left', sortable: true },
  { key: 'location_id.name', label: 'Location', align: 'left', sortable: true },
  { key: 'collected_timestamp', label: 'Test Date', align: 'left', sortable: true },
  { key: 'testkit_id', label: 'Test ID', align: 'left', sortable: true },
  { key: 'user_id.email', label: 'Email', align: 'left', sortable: true },
  { key: 'user_id.phone', label: 'Phone', align: 'left', sortable: true },
  { key: 'detail', label: 'Results', align: 'center', sortable: false },
  { key: 'actions', label: 'Actions', align: 'center', sortable: false },
  { key: 'status', label: 'Status', align: 'center', sortable: false },
];


const FiltersInit = [
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

const statusArr = ['Status1', 'Status2', 'Status3'];
const dateArr = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 60 days'];

const ResultsPage = props => {
  const { getLocations1, locations, getTestings, searchTestings, deleteTesting, tab, result, refetch, setRefetch 
    // ,isSuperAdmin
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(true);
  const [metaData
    // , setMetaData
  ] = useState(columnsDefault);
  const [testingList, setTestingList] = useState([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const [isResultSummaryDlg, setIsResultSummaryDlg] = useState(false);
  const [isResultTestDlg, setIsResultTestDlg] = useState(false);
  const [editResultsOpen, setEditResultsOpen] = useState(false);
  const [selectedTesting, setSelectedTesting] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [location_id
    // , setLocationId
  ] = useState(0);
  const [startDate
    // , setStartDate
  ] = React.useState(moment().startOf('month'));
  const [endDate
    // , setEndDate
  ] = React.useState(moment());

  const [anchorEl, setAnchorEl] = useState(false);
  const [arrGroupData, setArrGroupData] = useState([...FiltersInit]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [formState, setFormState] = useState({filterStatus: '', filterDate:'Today'});

  useEffect(() => {
    (async () => {
      if (!locations)
        await getLocations1();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log('selectedFilter', selectedFilter);
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      queryParams += `&start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`;
      queryParams += tab === 'All' || !tab ? '' : result === 'Vaccine' ? `&type=${result}` : `&result=${result}`;
      if (location_id)
        queryParams += `&location_id=${location_id}`;
      let res = {};
      setLoading(true);
      if (submittedSearch.length)
        res = await searchTestings({ search_string: submittedSearch }, queryParams);
      else
        res = await getTestings(queryParams);
      setLoading(false);
      if (res.success) {
        setTestingList(res.data);
        setCount(res.count);
      }
    })();
    // eslint-disable-next-line
  }, [tab, result, refetch, submittedSearch, page, rowsPerPage, order, orderBy, startDate, endDate, location_id]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSearchSubmit = async (str) => {
    setPage(0);
    setSubmittedSearch(str);
  };

  // const onClickSummary = data => {
  //   setSelectedTesting(data);
  //   setIsResultSummaryDlg(true);
  // };

  // const onClickTest = data => {
  //   setSelectedTesting(data);
  //   setIsResultTestDlg(true);
  // };

  const onEditTesting = (data) => {
    setSelectedTesting(data);
    setEditResultsOpen(true);
  };

  const onDeleteTesting = (data) => {
    setSelectedTesting(data);
    setConfirmDialogOpen(true);
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleDeleteDialogAction = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    let res = await deleteTesting(selectedTesting._id);
    setLoading(false);
    if (res.success) {
      setRefetch(refetch => refetch + 1);
    }
  };

  // const handleLocationChange = (event) => {
  //   setLocationId(event.target.value);
  // };
  const onHistoryExpand = async (test_id, open) => {
    setTestingList(
      testingList.map(test =>
        test._id === test_id ?
          { ...test, open: !open } :
          { ...test, open: false }
      )
    );
    
  };
  
  const CustomTableData = data => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'row_expand') {
      return (
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => onHistoryExpand(row._id, row.open)}
        >
          {row.open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRight />}
        </IconButton>
      );
    }

    if (column.key === 'last_name') {
      return (
        <span>{row.dependent_id ? row.dependent_id.last_name : row.user_id.last_name}</span>
      );
    }
    if (column.key === 'first_name') {
      return (
        <span>{row.dependent_id ? row.dependent_id.first_name : row.user_id.first_name}</span>
      );
    }
    if (column.key === 'location_id.name') {
      return (
        <span>{row.location_id.name}</span>
      );
    }
    if (column.key === 'collected_timestamp') {
      return (
        <span>{row.collected_timestamp ? moment.utc(row.collected_timestamp).format('MM/DD/YYYY') : ''}</span>
      );
    }
    if (column.key === 'result') {
      return !value
        ?
        <Typography className={brandClasses.emptyTestResult}>
          - - - - -
        </Typography>
        :
        <img
          src="/images/svg/Notes.svg"
          alt=""
          className={classes.statusIcon}
        />
         
    }
    if (column.key === 'status') {
      return <img
        src="/images/svg/status/pending_Order.svg"
        alt=""
        className={classes.statusIcon}
      />
    }
    if (column.key === 'detail') {
      return (
        <div className={brandClasses.actionContainer}>
          <img
            src="/images/svg/Notes.svg"
            alt="Edit"
            className={classes.statusIcon}
            // onClick={() => onClickSummary(row)}
          />
        </div>
      );
    }
    if (column.key === 'user_id.email') {
      return (
        
        <div className={classes.cellDiv}>{row.user_id.email}</div>
        
      );
    }
    if (column.key === 'testkit_id') {
      return (
        
        <div className={classes.cellDiv}>{value}</div>
        
      );
    }
    if (column.key === 'user_id.phone') {
      return (
        <div className={classes.cellDiv}><PhoneNumberFormat value={row.user_id.phone} /></div>
      );
    }
    if (column.key === 'actions') {
      return (
        <Actions
          handleDelete={() => onDeleteTesting(row)}  
          handleEdit={() => onEditTesting(row)}
        />
      );
    }
    return (
      <span>{value}</span>
    )
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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

  const ExpandableRow = (props) => {
    const { open } = props;

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
                Content
              </Typography>
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
            {/* <img src="/images/svg/status/users_icon.svg" alt="" /> */}
            <Order />
            &nbsp;
            {'ORDER MANAGER'}
          </Typography>
        </div>
      </div>

      <Grid container className={classes.container} spacing={0}>
        <Grid item xs={12} sm={8}>
          <div className={classes.header2}>
            <div className={brandClasses.settingIconBox}>
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
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <FormControl
              className={clsx(classes.locationSelect, brandClasses.shrinkTextField)}
              // fullWidth
              variant="outlined"
            >
              {/* <InputLabel>Locations</InputLabel> */}
              <Select
                name="filterStatus"
                value={formState.filterStatus || ''}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">
                  <Typography className={brandClasses.selectPlaceholder}>Status: All</Typography>
                </MenuItem>
                {statusArr.map((status, index) => (
                  <MenuItem value={status} key={index}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            &nbsp;

            <FormControl
              className={clsx(classes.locationSelect, brandClasses.shrinkTextField)}
              // fullWidth
              variant="outlined"
            >
              {/* <InputLabel>Locations</InputLabel> */}
              <Select
                name="filterDate"
                value={formState.filterDate || ''}
                onChange={handleChange}
                displayEmpty
              >
                {/* <MenuItem value="">
                  <Typography className={brandClasses.selectPlaceholder}>Date: Today</Typography>
                </MenuItem> */}
                {dateArr.map((status, index) => (
                  <MenuItem value={status} key={index}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          
          {/* <MuiPickersUtilsProvider utils={MomentUtils} >
            <DatePicker
              label="From Date"
              format="DD-MMM-yyyy"
              value={startDate}
              maxDate={endDate}
              onChange={setStartDate}
              className={classes.utilRoot}
            />
            <DatePicker
              label="To Date"
              format="DD-MMM-yyyy"
              value={endDate}
              minDate={startDate}
              onChange={setEndDate}
              className={classes.utilRoot}
            />
          </MuiPickersUtilsProvider> */}
        </Grid>
        <Grid item xs={12} sm={3} >
          
          
        </Grid>
        
      </Grid>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={testingList}
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

      <ResultsSummary
        isShow={isResultSummaryDlg}
        testing_id={selectedTesting._id}
        toggleDlg={setIsResultSummaryDlg}
      />

      <ConfirmResultDialog
        isShow={isResultTestDlg}
        testing={selectedTesting}
        setRefetch={setRefetch}
        toggleDlg={setIsResultTestDlg}
      />

      <EditTestingDialog
        isShow={editResultsOpen}
        testing={selectedTesting}
        setRefetch={setRefetch}
        toggleDlg={setEditResultsOpen}
      />

      <DialogAlert
        open={confirmDialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Are you sure ?'}
        message={selectedTesting ? `Do you want to Delete Test ID: ${selectedTesting.testkit_id}` : ''}
        onClose={handleDialogClose}
        onAction={handleDeleteDialogAction}
      />

      {/* <ResultsDetail
        isShowResultsDetailDlg={isShowResultsDetailDlg}
        toggleResultsDetailDlg={setIsShowResultDetailDlg}
        data={selectedTested}
        setRefetch={setRefetch}
        isActionBtn={true}
      /> */}
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations,
  isSuperAdmin: state.auth.isSuperAdmin
});

ResultsPage.propTypes = {
  getTestings: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
  searchTestings: PropTypes.func.isRequired,
  deleteTesting: PropTypes.func.isRequired,
  tab: PropTypes.number.isRequired,
  result: PropTypes.string.isRequired
};

export default connect(mapStateToProps, { getLocations1, getTestings, searchTestings, deleteTesting })(ResultsPage);
