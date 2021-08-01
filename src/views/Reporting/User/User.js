import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  CircularProgress
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import BlueBox from 'components/BlueBox';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import brandStyles from 'theme/brand';
import {
  getReportingComplianceCounts,
  getReportingComplianceTests,
  getReportingUserLinear,
  getLocations1,
  getReportingUserList
} from 'actions/api';
import clsx from 'clsx';
import { CSVLink } from 'react-csv';
import ReportDialog from '../ReportDialog';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Download from 'icons/Download';
import { CountBox } from 'components';
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
    padding: theme.spacing(2)
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
      marginRight: 0
    },
    // [theme.breakpoints.up('md')]: {
    //   width:'calc(33% - 15px)',
    //   marginRight:15,
    //   marginBottom:15,
    // },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 'calc(33% - 15px)',
      marginRight: 15,
      marginBottom: 15
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: 0,
      marginBottom: 15
    }
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
    color: '#0F84A9'
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
  footer: {
    display: 'flex',
    justifyContent: 'flex-end'
    // marginRight: theme.spacing(4)
  },
  submitButton: {
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  tableRow1: {
    backgroundColor: 'rgba(15,132,169,0.15)',
    '&:hover': {
      backgroundColor: 'rgba(15,132,169,0.15) !important'
    }
  },
  tableRow2: {
    backgroundColor: 'white'
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
    padding: '12px 15px'
  },
  locationSelect: {
    // width: '50%',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
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
  return stabilizedThis.map(el => el[0]);
}

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
        {headers.map(headCell => (
          <TableCell
            key={headCell.key}
            sortDirection={orderBy === headCell.key ? order : false}
            align={
              headCell.key === 'viewmore' || headCell.key === 'status'
                ? 'center'
                : 'left'
            }
            className={brandClasses.tableHead}>
            {headCell.key === 'status' || headCell.key === 'viewmore' ? (
              headCell.label
            ) : (
                <TableSortLabel
                  active={orderBy === headCell.key}
                  direction={orderBy === headCell.key ? order : 'asc'}
                  onClick={createSortHandler(headCell.key)}
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

const testsColors = ['#25DD83', '#3ECCCD'];

const exportHeaders = [
  { label: 'Last Name', key: 'last_name', export: true },
  { label: 'Email', key: 'email', export: true },
  { label: 'First Name', key: 'first_name', export: true },
  { label: 'Phone', key: 'phone', export: true },
  { label: 'Location', key: 'location_id.name', export: true },
  { label: 'Status', key: 'latest_test_result.result', export: true },
  { label: 'Department', key: 'department_id.name', export: true }
];

const headers = [
  { label: 'Last Name', key: 'last_name', minWidth: 100 },
  { label: 'First Name', key: 'first_name', minWidth: 100 },
  { label: 'Location', key: 'location_id.name', minWidth: 100 },
  { label: 'Department', key: 'department_id.name', minWidth: 70 },
  { label: 'Email', key: 'email', minWidth: 100 },
  { label: 'Phone', key: 'phone', minWidth: 120 },
  { label: 'Status', key: 'latest_test_result', minWidth: 100 }
];

const User = props => {
  const {
    // API
    getReportingComplianceCounts,
    getReportingComplianceTests,
    getReportingUserLinear,
    getLocations1,
    getReportingUserList,
    // Redux data
    reportingComplianceCounts,
    reportingComplianceTests,
    reportingUserLinear,
    locations,
    reportingUserList
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const history = useHistory();
  const [location_id, setLocationId] = useState(0);
  const [rCounts, setRcounts] = useState(null);
  const [stDate, setStDate] = useState(moment());
  const [stLabels, setStLabels] = useState([]);
  const [stData, setStData] = useState([]);
  const [empType, setEmpType] = useState('Yearly');
  const [empDate, setEmpDate] = useState(moment());
  const [empLabels, setEmpLabels] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [empTotal, setEmpTotal] = useState(0);
  const [complianceList, setComplianceList] = useState([]);

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
    onLocationUpdate();
    async function fetchData() {
      let queryParams = null;
      if (location_id) queryParams = `location_id=${location_id}`;
      if (!locations) await getLocations1();
      await getReportingComplianceCounts(queryParams);
      let queryParamsForEmp = queryParams
        ? queryParams + `&${empDateQueryParams(empType, empDate)}`
        : `&${empDateQueryParams(empType, empDate)}`;
      await getReportingUserLinear(queryParamsForEmp);
      let queryParamsForST = queryParams
        ? queryParams + `&date=${moment(stDate).format('YYYY-MM-DD')}`
        : `&date=${moment(stDate).format('YYYY-MM-DD')}`;
      await getReportingComplianceTests(queryParamsForST);
      await getReportingUserList(queryParams);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location_id]);

  useEffect(() => {
    if (reportingComplianceTests) {
      let labels = [];
      let sData = [];
      let tData = [];
      reportingComplianceTests.forEach(r => {
        labels.push(r.time);
        sData.push(r.schedules);
        tData.push(r.testings);
      });
      setStLabels(labels);
      setStData([
        { name: 'Patients Scheduled', data: sData },
        { name: 'Patients Tested', data: tData }
      ]);
    }
  }, [reportingComplianceTests]);

  useEffect(() => {
    if (reportingUserLinear) {
      let empLabels = [];
      let empData = [];
      let total = 0;
      reportingUserLinear.forEach(e => {
        if (empType === 'Daily') {
          let hour = parseInt(e.key);
          empLabels.push(
            hour <= 11
              ? `${hour} AM`
              : hour === 12
                ? `12 PM`
                : `${hour - 12} PM`
          );
        } else {
          empLabels.push(e.key);
        }
        empData.push(e.count);
        total += e.count;
      });
      setEmpTotal(total);
      setEmpLabels(empLabels);
      setEmpData([{ data: empData }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportingUserLinear]);

  useEffect(() => {
    if (reportingComplianceCounts) {
      setRcounts(reportingComplianceCounts);
    }
  }, [reportingComplianceCounts]);

  useEffect(() => {
    if (reportingUserList) {
      let data = reportingUserList.map(item => {
        let row = Object.assign({}, item);
        row['department_id'] = item.department_id ? item.department_id : {};
        return row;
      });
      setComplianceList(data);
    }
  }, [reportingUserList]);

  useEffect(() => {
    let csvH = exportHeaders.filter(e => e.export);
    setCsvHeaders(csvH);
  }, [exportHeaderList]);

  function onClickExportButton() {
    setIsShowReportDlg(true);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const MaketableRow = data => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'phone') {
      return (
        <TableCell
          key={column.key}
          align={column.align}
          className={classes.tableCell}>
          <PhoneNumberFormat value={value} />
        </TableCell>
      );
    }
    if (column.key === 'latest_test_result') {
      return (
        <TableCell>
          {!value
            ?
            <Typography className={brandClasses.emptyTestResult}>
              {'- - - - -'}
            </Typography>
            :
            value.result === 'Positive'
              ?
              <img
                src="/images/svg/status/red_shield.svg"
                alt=""
                className={brandClasses.resultStatusIcon}
              />
              :
              value.result === 'Negative'
                ?
                <img
                  src="/images/svg/status/green_shield.svg"
                  alt=""
                  className={brandClasses.resultStatusIcon}
                />
                :
                <img
                  src="/images/svg/status/pending_turquoise.svg"
                  alt=""
                  className={brandClasses.resultStatusIcon}
                />
          }
        </TableCell>
      )
    }
    if (column.key.includes('.')) {
      let [locKey, locValue] = column.key.split('.');
      return (
        <TableCell
          key={column.key}
          align={column.align}
          className={classes.tableCell}>
          {row[locKey] && row[locKey][locValue]}
        </TableCell>
      );
    }
    return (
      <TableCell
        key={column.key}
        align={column.align}
        className={classes.tableCell}>
        {value}
      </TableCell>
    );
  };

  const onLocationUpdate = () => {
    setStData([]);
    setEmpData([]);
    setRcounts(null);
  };

  const handleStDateChange = async date => {
    setStLabels([]);
    setStData([]);
    setStDate(date);
    let queryParams = `date=${date.format('YYYY-MM-DD')}`;
    if (location_id) queryParams += `&location_id=${location_id}`;
    await getReportingComplianceTests(queryParams);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEmpDateChange = async date => {
    setEmpLabels([]);
    setEmpData([]);
    setEmpDate(date);
    let queryParams = empDateQueryParams(empType, date);
    if (location_id) queryParams += `&location_id=${location_id}`;
    await getReportingUserLinear(queryParams);
  };

  const handleEmpTypeChange = async e => {
    let type = e.target.value;
    setEmpLabels([]);
    setEmpData([]);
    setEmpType(type);
    let queryParams = empDateQueryParams(type, empDate);
    if (location_id) queryParams += `&location_id=${location_id}`;
    await getReportingUserLinear(queryParams);
  };

  const handleLocationChange = event => {
    setLocationId(event.target.value);
  };

  const empDateQueryParams = (type, date) => {
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
  };

  const toggleExport = data => {
    console.log('click toggle button', data);
    let from = new Date(data.fromDate).getTime();
    let to = new Date(data.toDate).getTime();
    let result = complianceList.filter(c => {
      var time = new Date(c.created_date).getTime();
      return from < time && time < to;
    });
    setCsvList(result);
    setTimeout(() => {
      document.getElementById('csvLinkBtn').click();
    }, 500);
    // csvLinkRef.click();
    // this.btn.click();
  };

  const onClickSearchInput = event => {
    console.log('isOpen', isOpen, event);
  };

  const onClickReport = e => {
    history.push('/reporting/custom');
    // console.log(' -- click report button -- ', e.target);
  };

  return (
    <div>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <Chart style={{ color: '#043B5D' }} />
          &ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Reporting |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>
            {'User Manager'}
            {locations ? (
              <Select
                value={location_id}
                onChange={handleLocationChange}
                className={clsx(classes.locationSelect, classes.lineChartRoot)}>
                <MenuItem value={0}>
                  <em>{'All Locations'}</em>
                </MenuItem>
                {locations.map((location, index) => (
                  <MenuItem value={location._id} key={index}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
                <CircularProgress />
              )}
          </Typography>
        </div>
        <Button
          className={clsx(brandClasses.reportBtn, brandClasses.button)}
          onClick={onClickReport}>
          {'CUSTOM REPORT'}
        </Button>
      </div>
      <div className={classes.container}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center">
          <BlueBox class={classes.topBoxRoot}>
            <CountBox
              value={rCounts}
              object_key={'total_users'}
              title={'Total Users'}
            />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox
              value={rCounts}
              object_key={'tests_performed'}
              title={'Tests Performed'}
            />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox
              value={rCounts}
              object_key={'positive_results'}
              title={'Positive Results'}
            />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox
              value={rCounts}
              object_key={'negative_results'}
              title={'Negative Results'}
            />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox
              value={rCounts}
              object_key={'positivity_rate'}
              title={'Positivity Rate %'}
              isPercent={true}
            />
          </BlueBox>
        </Grid>
        <Grid container spacing={4}>
          <Grid item md={5}>
            <BlueBox class={classes.lineChart}>
              <Typography variant="h4" className={classes.barChartTitle}>
                {' '}
                Number of responses
              </Typography>
              <br />
              <Typography variant="h2"> {empTotal}</Typography>
              {empData.length ? (
                <LineChart seriesData={empData} label={empLabels} />
              ) : (
                  <CircularProgress
                    className={brandClasses.fetchProgressSpinner}
                  />
                )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  {empType === 'Yearly' ? (
                    <DatePicker
                      views={['year']}
                      label="Year only"
                      value={empDate}
                      onChange={handleEmpDateChange}
                      className={classes.utilRoot}
                    />
                  ) : empType === 'Monthly' ? (
                    <DatePicker
                      views={['year', 'month']}
                      label="Year and Month"
                      value={empDate}
                      onChange={handleEmpDateChange}
                      className={classes.utilRoot}
                    />
                  ) : empType === 'Weekly' ? (
                    <DatePicker
                      label="Week of"
                      value={empDate}
                      onChange={handleEmpDateChange}
                      className={classes.utilRoot}
                    />
                  ) : (
                          <DatePicker
                            label="Date"
                            value={empDate}
                            onChange={handleEmpDateChange}
                            className={classes.utilRoot}
                          />
                        )}
                </MuiPickersUtilsProvider>
                <Select
                  value={empType}
                  onChange={handleEmpTypeChange}
                  className={classes.lineChartRoot}>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </div>
            </BlueBox>
          </Grid>
          <Grid item md={7}>
            <BlueBox>
              <Typography className={classes.barChartTitle} variant="h4">
                Scheduled/Tested Patients
              </Typography>
              {stData.length ? (
                <BarChart
                  colors={testsColors}
                  seriesData={stData}
                  label={stLabels}
                  height={405}
                />
              ) : (
                  <CircularProgress
                    className={brandClasses.fetchProgressSpinner}
                  />
                )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    label="Date"
                    value={stDate}
                    onChange={handleStDateChange}
                    className={classes.utilRoot}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </BlueBox>
          </Grid>
        </Grid>
        <div className={classes.footer}>
          <SearchBar
            className={brandClasses.searchBar}
            onClick={onClickSearchInput}
            toggleOpen={setIsOpen}
            isOpen={isOpen}
          />
          <div className={brandClasses.settingIconBox}>
            <TuneIcon className={brandClasses.settingIcon} />
          </div>
          &ensp;&ensp;
          <Button
            className={clsx(classes.submitButton, brandClasses.button)}
            onClick={() => onClickExportButton()}>
            <Download /> &nbsp; {'EXPORT'}
          </Button>
          <CSVLink
            data={csvList}
            headers={csvHeaders}
            filename={'user.csv'}
            className={clsx(classes.submitButton, brandClasses.button)}
            style={{ display: 'none' }}
            // ref={csvLinkRef}
            id="csvLinkBtn">
            {'EXPORT'}
          </CSVLink>
        </div>
      </div>

      {/* Table  */}
      <div>
        <TableContainer>
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
              rowCount={complianceList.length}
            />
            <TableBody>
              {!reportingUserList ? (
                <TableRow>
                  <TableCell colSpan={headers.length} align="center">
                    <CircularProgress
                      className={brandClasses.fetchProgressSpinner}
                    />
                  </TableCell>
                </TableRow>
              ) : !complianceList.length ? (
                <TableRow>
                  <TableCell colSpan={headers.length} align="center">
                    {'No data to display...'}
                  </TableCell>
                </TableRow>
              ) : (
                    stableSort(complianceList, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                            className={index % 2 !== 0 ? '' : classes.tableRow1}>
                            {headers.map(column => {
                              return (
                                <MaketableRow
                                  column={column}
                                  row={row}
                                  key={column.key}
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
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={complianceList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          classes={{
            root: classes.tablePagination,
            caption: classes.tablePaginationCaption,
            selectIcon: classes.tablePaginationSelectIcon,
            select: classes.tablePaginationSelect,
            actions: classes.tablePaginationActions
          }}
        />
      </div>

      <ReportDialog
        title={'User Manager'}
        isShowReportDlg={isShowReportDlg}
        toggleReportDlg={setIsShowReportDlg}
        exportHeaderList={exportHeaderList}
        setExportHeaderList={setExportHeaderList}
        clickCSV={toggleExport}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  reportingComplianceCounts: state.data.reportingComplianceCounts,
  reportingUserLinear: state.data.reportingUserLinear,
  reportingComplianceTests: state.data.reportingComplianceTests,
  reportingUserList: state.data.reportingUserList,
  locations: state.data.locations
});

User.propTypes = {
  getReportingComplianceCounts: PropTypes.func.isRequired,
  getReportingComplianceTests: PropTypes.func.isRequired,
  getReportingUserLinear: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
  getReportingUserList: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getReportingComplianceCounts,
  getReportingComplianceTests,
  getReportingUserLinear,
  getLocations1,
  getReportingUserList
})(User);
