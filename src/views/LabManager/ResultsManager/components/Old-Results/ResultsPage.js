import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
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
  CircularProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchBar from '../../../../../layouts/Main/components/SearchBar';
import brandStyles from 'theme/brand';
import Results from 'icons/Results';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import ResultsSummary from 'views/LabManager/Dialog/ResultsSummary';
import { getTestings } from 'actions/api';
import moment from 'moment';
import * as utility from 'helpers/utility';
import ConfirmResultDialog from '../ConfirmResultDialog';

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
    [theme.breakpoints.down('md')]: {
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
    backgroundColor: theme.palette.white,
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
  }
}));

const columnsDefault = [
  {
    id: 'last_name',
    label: 'Last Name',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'first_name',
    label: 'First Name',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'location',
    label: 'Location',
    minWidth: 150,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'test_date',
    label: 'Test Date',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'test_id',
    label: 'Test ID',
    minWidth: 150,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'test_type',
    label: 'Test Type',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'detail',
    label: 'View Detail',
    align: 'center',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'phone',
    label: 'Phone Number',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'email',
    label: 'Email',
    align: 'left',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  }
];

const columnsPending = [
  {
    id: 'last_name',
    label: 'Last Name',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'first_name',
    label: 'First Name',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'location',
    label: 'Location',
    minWidth: 150,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'test_date',
    label: 'Test Date',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'test_id',
    label: 'Test ID',
    minWidth: 150,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'test_type',
    label: 'Test Type',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'detail',
    label: 'View Detail',
    align: 'center',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'status',
    label: 'Status',
    align: 'center',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  }
];

const columnsAll = [
  {
    id: 'last_name',
    label: 'Last Name',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'first_name',
    label: 'First Name',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'location',
    label: 'Location',
    minWidth: 150,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'test_date',
    label: 'Test Date',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'test_id',
    label: 'Test ID',
    minWidth: 120,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'test_type',
    label: 'Test Type',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'phone',
    label: 'Phone Number',
    minWidth: 100,
    numeric: false,
    disablePadding: true
  },
  {
    id: 'email',
    label: 'Email',
    align: 'left',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'detail',
    label: 'View Details',
    align: 'center',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  },
  {
    id: 'result',
    label: 'Results',
    align: 'center',
    minWidth: 100,
    numeric: false,
    disablePadding: false
  }
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
  return stabilizedThis.map(el => el[0]);
}
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const brandClasses = brandStyles();
  // const classes = useStyles();

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            align={
              headCell.id === 'detail' ||
              headCell.id === 'status' ||
              headCell.id === 'email' ||
              headCell.id === 'result'
                ? 'center'
                : 'left'
            }
            className={brandClasses.tableHead}>
            {headCell.id === 'status' || headCell.id === 'detail' ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                classes={{
                  icon: brandClasses.tableSortLabel,
                  active: brandClasses.tableSortLabel
                }}>
                {headCell.label}
              </TableSortLabel>
            )}
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
  rowCount: PropTypes.number.isRequired
};

const ResultsPage = props => {
  const { getTestings, tab, result } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(true);
  const [headerColumns, setHeaderColumns] = useState(columnsDefault);

  // const [isShowResultsDetailDlg, setIsShowResultDetailDlg] = useState(false);
  // const [selectedTested, setSelectedTested] = useState(null);
  const [refetch, setRefetch] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('last_name');
  const [searchKeys] = useState([ 'first_name', 'last_name', 'location', 'test_id', 'test_type', 'email', 'phone', 'test_date']);

  const [isResultSummaryDlg, setIsResultSummaryDlg] = useState(false);
  const [isResultTestDlg, setIsResultTestDlg] = useState(false);
  const [selectedTesting, setSelectedTesting] = useState({});

  useEffect(() => {
    switch (result) {
      case 'All':
        setHeaderColumns(columnsAll);
        break;
      case 'Pending':
        setHeaderColumns(columnsPending);
        break;

      default:
        break;
    }

    (async () => {
      setLoading(true);
      let queryParams = tab === 'All' || !tab ? null : `result=${result}`;
      let res = await getTestings(queryParams);
      setLoading(false);
      if (res.success) {
        const cardData = await getTestingData(res.data);
        setAllData(cardData.data);
        props.setCount(cardData.total);
        props.setLoading(false);
        // console.log(cardData.data);
        setFilteredData(cardData.data);
        setLoading(false);
      }
    })();

    const getTestingData = async testing => {
      let cardData = {};
      cardData.type = tab;
      cardData.data = await filterTesting(testing, tab);
      cardData.total = cardData.data.length;

      return cardData;
    };
    // eslint-disable-next-line
  }, [tab, result, refetch]);

  const filterTesting = async (testing, type) => {
    let data = [];
    testing.forEach(t => {
      // if (t.result === type) {
      data.push({
        first_name: t.dependent_id
          ? t.dependent_id.first_name
          : t.user_id.first_name,
        last_name: t.dependent_id
          ? t.dependent_id.last_name
          : t.user_id.last_name,
        location: t.location_id.name,
        phone: t.user_id.phone,
        email: t.user_id.email,
        test_date: moment.utc(t.collected_timestamp).format('MM/DD/YYYY'),
        result: t.result,
        id: t.user_id.verification_id,
        test_id: t.testkit_id,
        test_type: t.test_type,
        detail: '',
        data: t
      });
      // }
    });
    return data;
  };

  const onClickSummary = data => {
    setSelectedTesting(data);
    setIsResultSummaryDlg(true);
  };

  const onClickTest = data => {
    setSelectedTesting(data);
    setIsResultTestDlg(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onClickSearchInput = event => {
    console.log('isOpen', isOpen, event);
  };

  const onChangeSearch = async e => {
    e.persist();
    const keys = searchKeys; //['first_name', 'last_name', 'email', 'phone', 'location_id'];

    if (allData && allData.length > 0) {
      setFilteredData(utility.filter(allData, e.target.value, keys));
    }
  };

  const MaketableRow = data => {
    const column = data.column;
    const row = data.row;
    const value = row[column.id];

    if (column.id === 'result') {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={brandClasses.tableCell}>
          {!value ? (
            <Typography className={brandClasses.emptyTestResult}>
              - - - - -
            </Typography>
          ) : value === 'Positive' ? (
            <img
              src="/images/svg/status/red_shield.svg"
              alt=""
              className={classes.statusIcon}
            />
          ) : value === 'Negative' ? (
            <img
              src="/images/svg/status/green_shield.svg"
              alt=""
              className={classes.statusIcon}
            />
          ) :value === 'Inconclusive' ?  (
            <img
              src="/images/svg/status/Inconclusive.svg"
              alt=""
              className={classes.statusIcon}
            />
          ) : (
            <img
              src="/images/svg/status/pending_turquoise.svg"
              alt=""
              className={classes.statusIcon}
            />
          )}
        </TableCell>
      );
    }
    if (column.id === 'status') {
      // return result !== 'Pending' ? (
      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={brandClasses.tableCell}>
          {loading ? (
            <CircularProgress />
            ) : row['test_type'] !== 'Antigen' ? (
            <Typography variant="h6" className={classes.comesFromLab}>
              Comes from LAB
            </Typography>
          ) : !value ? (
            <Button
              variant="outlined"
              className={classes.statusBtn}
              onClick={() => onClickTest(row['data'])}>
              INTERPRET
            </Button>
          ) : (
            <Button
              variant="outlined"
              className={classes.statusBtn}
              onClick={() => onClickTest(row.data)}>
              LAB PENDING
            </Button>
          )}
        </TableCell>
      );
      // : (
      //   <TableCell
      //     key={column.id}
      //     align={column.align}
      //     className={brandClasses.tableCell}>
      //     <CustomSelectBox align="center" size="small" data={testStatusData} />
      //   </TableCell>
      // );
    }
    if (column.id === 'detail') {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={brandClasses.tableCell}>
          <div className={brandClasses.actionContainer}>
            <img
              src="/images/svg/document_icon.svg"
              alt="Edit"
              onClick={() => onClickSummary(row.data)}
            />
          </div>
        </TableCell>
      );
    }
    if (column.id === 'test_id') {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={brandClasses.tableCell}>
          <div className={classes.cellDiv}>{value}</div>
        </TableCell>
      );
    }
    if (column.id === 'email') {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={brandClasses.tableCell}>
          <div className={classes.emailContainer}>
            <img src="/images/svg/email_icon.svg" alt="" />
            &ensp;
            <div className={classes.cellDiv}>{value}</div>
          </div>
        </TableCell>
      );
    }
    if (column.id === 'phone') {
      return (
        <TableCell
          key={column.id}
          align={column.align}
          className={brandClasses.tableCell}>
          <div className={classes.phoneContainer}>
            <img src="/images/svg/telephone_icon–blue.svg" alt="" />
            &ensp;
            <PhoneNumberFormat value={value} />
          </div>
        </TableCell>
      );
    }
    return (
      <TableCell
        key={column.id}
        align={column.align}
        className={brandClasses.tableCell}>
        {value}
      </TableCell>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={0}>
        <Grid item xs={12} sm={3}>
          {/* <Typography variant="h3" className={brandClasses.headerTitle}>
            RESULTS MANAGER
          </Typography> */}
          <div className={classes.header}>
            <div className={classes.subHeader}>
              <Typography variant="h2" className={brandClasses.headerTitle}>
                {/* <img src="/images/svg/status/users_icon.svg" alt="" /> */}
                <Results />
                &nbsp;
                {'RESULTS MANAGER'}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={9} className={classes.tableActionBar}>
          {/* <CustomSelectBox className={classes.selectOption} data={statusData} />
          <CustomSelectBox className={classes.selectOption} data={dateData} /> */}
          <SearchBar
            className={classes.searchBar}
            onClick={onClickSearchInput}
            onChange={onChangeSearch}
            toggleOpen={setIsOpen}
            isOpen={isOpen}
          />
          {/* <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div> */}
        </Grid>
      </Grid>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            aria-label="sticky table"
            className={classes.table}>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              headCells={headerColumns}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={headerColumns.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headerColumns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !filteredData.length ? (
                <TableRow>
                  <TableCell colSpan={headerColumns.length} align="center">
                    {'No data to display...'}
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(filteredData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                        className={
                          index % 2 === 0 ? brandClasses.tableRow1 : ''
                        }>
                        {headerColumns.map(column => {
                          return (
                            <MaketableRow
                              column={column}
                              row={row}
                              key={column.id}
                            />
                          );
                        })}
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          classes={{
            root: brandClasses.tablePagination,
            caption: brandClasses.tablePaginationCaption,
            selectIcon: brandClasses.tablePaginationSelectIcon,
            select: brandClasses.tablePaginationSelect,
            actions: brandClasses.tablePaginationActions
          }}
        />
      </Paper>
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

ResultsPage.propTypes = {
  getTestings: PropTypes.func.isRequired,
  setLoading: PropTypes.func,
  // tab: PropTypes.number.isRequired,
  // result: PropTypes.string.isRequired
};

export default connect(null, { getTestings })(ResultsPage);
