import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Typography,
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
import moment from 'moment';
import brandStyles from 'theme/brand';
import CustomScheduler from 'components/Scheduler';
import ResultsSummary from 'views/LabManager/Dialog/ResultsSummary';
// import SearchBar from 'layouts/Main/components/SearchBar';
// import TuneIcon from '@material-ui/icons/Tune';
import { CheckMark, Reschedule } from 'icons';
import { getUserAllTesting } from 'actions/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: `${theme.spacing(3)}px`,
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText,
    display: 'flex',
    '& img': {
      marginRight: 8
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  tableRoot: {
    marginTop: theme.spacing(4)
  },
  container: {
    margin: '15px 0'
  },
  processing: {
    color: theme.palette.brandOrange,
    margin: '0 auto',
    width: 120,
    display: 'flex'
  },
  resulted: {
    color: theme.palette.brandGreen,
    margin: '0 auto',
    width: 120,
    display: 'flex'
  },
  processingIcon: {
    position: 'relative',
    top: 0,
    right: 5
  },
  resultedIcon: {
    position: 'relative',
    top: 0,
    right: 5
  },
  cellIdDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    // width: '260px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('md', 'lg')]: {
      width: '220px'
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '160px'
    }
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width: '320px',
    // },
  },
  tableStatusCell: {
    padding: '2px 16px !important',
    margin: '0 auto',
    fontWeight: 100,
    width: 140,
    [theme.breakpoints.down('lg')]: {
      padding: '2px 8px !important'
    }
  }
}));

const headCells = [
  { id: 'date', label: 'Date Tested' },
  { id: 'test_type', label: 'Test Type' },
  { id: 'testkit_id', label: 'Test ID Number' },
  { id: 'status', label: 'Test Status' },
  { id: 'result', label: 'Test Results' }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  // const classes = useStyles();
  const brandClasses = brandStyles();
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
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            align={
              headCell.id === 'result' || headCell.id === 'status1'
                ? 'center'
                : 'left'
            }
            className={brandClasses.tableHead}>
            {headCell.id === 'status' || headCell.id === 'result' ? (
              headCell.label
            ) : (
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

const TestingHistory = props => {
  const { user, getUserAllTesting } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [empTestings, setEmpTestings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResultSummaryId, setSelectedResultSummaryId] = useState(null);
  const [isResultSummaryDlg, setIsResultSummaryDlg] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = React.useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    console.log('TestingHistory useEffect id:', user._id);
    if (user._id) {
      async function fetchData() {
        const res = await getUserAllTesting(user._id);
        if (res.success) {
          setEmpTestings(res.data || []);
          let monthDates = res.data.map(x => ({
            result: x.result,
            time: moment(x.time, 'HH:mm').format('h:mm A'),
            test_type: x.test_type,
            startDate: moment(x.date).format(),
            endDate: moment(x.date)
              .add(30, 'm')
              .format()
          }));
          setData(monthDates);
        }
        setLoading(false);
      }
      fetchData();
    }
  }, [user._id, getUserAllTesting]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onClickSummary = data => {
    setSelectedResultSummaryId(data._id);
    setIsResultSummaryDlg(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <img src="/images/svg/status/users_icon.svg" alt="" />
          {'User Manager'} |
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>
          TESTING HISTORY
        </Typography>
      </div>
      <CustomScheduler data={data} type={'UserTestingHistory'} />
      {/* <div className={brandClasses.subHeader}>
        <Grid container className={classes.container} spacing={0}>
          <Grid item xs={12} sm={12} className={brandClasses.tableActionBar2}>
            <SearchBar className={brandClasses.searchBar} toggleOpen={setIsOpen} isOpen={isOpen} />
            <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div>
          </Grid>
        </Grid>
      </div> */}
      <Paper className={classes.tableRoot}>
        <TableContainer>
          <Table>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={empTestings.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !empTestings.length ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    {'No data to display...'}
                  </TableCell>
                </TableRow>
              ) : (
                empTestings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((test, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      hover
                      className={
                        rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2
                      }>
                      <TableCell className={brandClasses.tableCell}>
                        {test.collected_timestamp && moment(test.collected_timestamp).format('MM/DD/YYYY')}
                      </TableCell>
                      <TableCell className={brandClasses.tableCell}>
                        {test.test_type}
                      </TableCell>
                      <TableCell className={brandClasses.tableCell}>
                        <div className={classes.cellIdDiv}>
                          {test.testkit_id}
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableStatusCell}>
                        {test.result === 'Pending' ? (
                          <Typography className={classes.processing}>
                            <Reschedule
                              className={classes.processingIcon}
                              style={{ width: 25 }}
                            />{' '}
                            {'Processing'}
                          </Typography>
                        ) : (
                          <Typography className={classes.resulted}>
                            <CheckMark
                              className={classes.resultedIcon}
                              style={{ width: 25 }}
                            />{' '}
                            {'Resulted'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        className={brandClasses.tableCell}
                        style={{ textAlign: 'center' }}>
                        <img
                          src="/images/svg/document_icon.svg"
                          alt=""
                          style={{ width: 25, cursor: 'pointer' }}
                          onClick={() => onClickSummary(test)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={empTestings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
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

TestingHistory.propTypes = {
  getUserAllTesting: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(null, { getUserAllTesting })(TestingHistory);
