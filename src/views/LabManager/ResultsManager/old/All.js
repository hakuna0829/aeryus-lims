import React, { useEffect, useState } from 'react';
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
  CircularProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchBar from '../../../../layouts/Main/components/SearchBar';
import CustomSelectBox from '../../../../components/SelectBox';
import brandStyles from 'theme/brand';
import Results from 'icons/Results';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import ResultsSummary from 'views/LabManager/Dialog/ResultsSummary';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { getTestings } from 'actions/api';
import moment from 'moment';

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
  }
}));

const columns = [
  { id: 'last_name', label: 'Last Name', minWidth: 100 },
  { id: 'first_name', label: 'First Name', minWidth: 100 },
  { id: 'location', label: 'Location', minWidth: 150 },
  { id: 'test_date', label: 'Test Date', minWidth: 100 },
  { id: 'test_id', label: 'Test ID', minWidth: 120 },
  // { id: 'test_type', label: 'Test Type', minWidth: 100 },
  { id: 'phone_number', label: 'Phone Number', minWidth: 100 },
  { id: 'email', label: 'Email', align: 'left', minWidth: 100 },
  { id: 'detail', label: 'Status', align: 'center', minWidth: 100 },
  { id: 'status', label: 'Detail', align: 'center', minWidth: 100 }
];

const headCells = [
  { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
  {
    id: 'first_name',
    numeric: false,
    disablePadding: true,
    label: 'First Name'
  },
  {
    id: 'location',
    numeric: false,
    disablePadding: true,
    label: 'Location'
  },
  {
    id: 'test_date',
    numeric: false,
    disablePadding: false,
    label: 'Test Date'
  },
  { id: 'test_id', numeric: false, disablePadding: true, label: 'Test ID' },
  {
    id: 'phone_number',
    numeric: false,
    disablePadding: true,
    label: 'Phone Number'
  },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  {
    id: 'detail',
    numeric: false,
    disablePadding: false,
    label: 'View Details'
  },
  { id: 'status', numeric: false, disablePadding: false, label: 'Results' }
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
  const { order, orderBy, onRequestSort } = props;
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
              headCell.id === 'email'
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

const All = () => {
  const classes = useStyles();
  const brandClasses = brandStyles();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isOpen, setIsOpen] = React.useState(false);
  const [allData, setAllData] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('last_name');
  const [isResultSummaryDlg, setIsResultSummaryDlg] = useState(false);
  const [selectedResultSummaryId, setSelectedResultSummaryId] = useState(null);

  useEffect(() => {
    setLoading(true);
    console.log('Content useEffect');
    getTestings()
      .then(async res => {
        if (res.data.success) {
          const cardData = await getTestingData(res.data.data);
          setAllData(cardData.data);
          setLoading(false);
          console.log('cardAll Data', cardData);
        } else {
          showFailedDialog(res);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        showErrorDialog(error);
      });

    const getTestingData = async testing => {
      let cardData = {};
      cardData.type = 'All';
      cardData.data = await filterTesting(testing, 'All');
      cardData.total = cardData.data.length;

      return cardData;
    };
  }, []);

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
        phone_number: t.user_id.phone,
        email: t.user_id.email,
        test_date: moment.utc(t.date).format('MM/DD/YYYY'),
        status: t.result,
        id: t.user_id.verification_id,
        test_id: t.test_session_id,
        detail: '',
        data: t
      });
      // }
    });
    return data;
  };

  const statusData = [
    { value: 0, label: 'Status: All' },
    { value: 1, label: 'Case 1' },
    { value: 2, label: 'Case 2' },
    { value: 3, label: 'Case 3' }
  ];

  const dateData = [
    { value: 0, label: 'Date: Today' },
    { value: 1, label: 'Date: Yesterday' }
  ];

  const onClickSummary = data => {
    setSelectedResultSummaryId(data._id);
    setIsResultSummaryDlg(true);
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

  const MaketableRow = data => {
    const column = data.column;
    const row = data.row;
    const value = row[column.id];
    // console.log('make table', row);

    if (column.id === 'status') {
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
    if (column.id === 'phone_number') {
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
        <Grid item xs={12} sm={9} className={brandClasses.tableActionBar}>
          <CustomSelectBox className={classes.selectOption} data={statusData} />
          <CustomSelectBox className={classes.selectOption} data={dateData} />
          <SearchBar
            className={classes.searchBar}
            onClick={onClickSearchInput}
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
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={columns.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !allData.length ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {'No data to display...'}
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(allData, getComparator(order, orderBy))
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
                        {columns.map(column => {
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
          count={allData.length}
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
        testing_id={selectedResultSummaryId}
        toggleDlg={setIsResultSummaryDlg}
      />
    </div>
  );
};

export default All;
