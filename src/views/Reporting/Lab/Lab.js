import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, CircularProgress } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import BlueBox from "components/BlueBox";
import LineChart from "components/LineChart";
import BarChart from "components/BarChart";
import brandStyles from 'theme/brand';
import { getReportingLabCounts, getReportingLabLinear, getReportingLabTests, getReportingLabList, getLocations1 } from 'actions/api';
import clsx from 'clsx';
import { CSVLink } from "react-csv";
import ReportDialog from '../ReportDialog';
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
    padding: theme.spacing(2),
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
      marginRight: 0,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 'calc(33% - 15px)',
      marginRight: 15,
      marginBottom: 15,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: 0,
      marginBottom: 15,
    },
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
    color: '#0F84A9',

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
    justifyContent: 'flex-end',
    // marginRight: theme.spacing(4)
  },
  submitButton: {
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  tableRow1: {
    backgroundColor: 'rgba(15,132,169,0.15)',
    "&:hover": {
      backgroundColor: "rgba(15,132,169,0.15) !important"
    }
  },
  tableRow2: {
    backgroundColor: 'white',
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
    padding: '12px 15px',
  },
  locationSelect: {
    // width: '50%',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
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
        {headers.map((headCell) => (
          <TableCell
            key={headCell.key}
            sortDirection={orderBy === headCell.key ? order : false}
            align={headCell.key === 'viewmore' || headCell.key === 'status' ? 'center' : 'left'}
            className={brandClasses.tableHead}
          >
            {headCell.key === 'status' || headCell.key === 'viewmore' ?
              headCell.label
              :
              <TableSortLabel
                active={orderBy === headCell.key}
                direction={orderBy === headCell.key ? order : 'asc'}
                onClick={createSortHandler(headCell.key)}
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

const stColors = ['#25DD83', '#3ECCCD'];

const exportHeaders = [
  { label: "Last Name", key: "user_id.last_name", export: true },
  { label: "First Name", key: "user_id.first_name", export: true },
  { label: "DOB", key: "user_id.dob", export: true },
  { label: "Dependent Last Name", key: "dependent_id.last_name", export: true },
  { label: "Dependent First Name", key: "dependent_id.first_name", export: true },
  { label: "Dependent DOB", key: "dependent_id.dob", export: true },
  { label: "Order Number", key: "order_id", export: true },
  { label: "Test Type", key: "test_type", export: true },
  { label: "Location", key: "location_id.name", export: true },
  { label: "Date Received", key: "submitted_timestamp", export: true },
  { label: "Status", key: "status", export: true },
  // { label: "Detail", key: "city", export: true },
];

const headers = [
  { label: "Last Name", key: "user_id.last_name", minWidth: 100 },
  { label: "First Name", key: "user_id.first_name", minWidth: 100 },
  { label: "Order Number", key: "order_id", minWidth: 100 },
  { label: "Test Type", key: "test_type", minWidth: 70 },
  { label: "Location", key: "location_id.name", minWidth: 100 },
  { label: "Date Received", key: "submitted_timestamp", minWidth: 100 },
  { label: "Status", key: "status", minWidth: 120 },
  // { label: "Detail", key: "details", minWidth: 100 },
];

const Lab = (props) => {
  const {
    // API
    getReportingLabCounts,
    getReportingLabLinear,
    getReportingLabTests,
    getReportingLabList,
    getLocations1,
    // Redux data
    reportingLabCounts,
    reportingLabLinear,
    reportingLabTests,
    reportingLabList,
    locations,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const history = useHistory();
  const [location_id, setLocationId] = useState(0);
  const [rCounts, setRcounts] = useState(null);
  const [linearType, setLinearType] = useState('Yearly');
  const [linearDate, setLinearDate] = useState(moment());
  const [linearLabels, setLinearLabels] = useState([]);
  const [linearData, setLinearData] = useState([]);
  const [linearTotal, setLinearTotal] = useState(0);
  const [testsDate, setTestsDate] = useState(moment());
  const [testsLabels, setTestsLabels] = useState([]);
  const [testsData, setTestsData] = useState([]);
  const [labList, setLabList] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const [isShowReportDlg, setIsShowReportDlg] = useState(false);
  const [exportHeaderList, setExportHeaderList] = useState([...exportHeaders]);
  const [csvHeaders, setCsvHeaders] = useState([{ label: '', key: '' }]);
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = React.useState(moment().startOf('month'));
  const [endDate, setEndDate] = React.useState(moment());

  useEffect(() => {
    onLocationUpdate();
    async function fetchData() {
      let queryParams = null;
      if (location_id)
        queryParams = `location_id=${location_id}`;
      if (!locations)
        await getLocations1();
      await getReportingLabCounts(queryParams);
      let queryParamsForLinear = queryParams ? queryParams + `&${linearDateQueryParams(linearType, linearDate)}` : `&${linearDateQueryParams(linearType, linearDate)}`;
      await getReportingLabLinear(queryParamsForLinear);
      let queryParamsForST = queryParams ? queryParams + `&date=${moment(testsDate).format('YYYY-MM-DD')}` : `&date=${moment(testsDate).format('YYYY-MM-DD')}`;
      await getReportingLabTests(queryParamsForST);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location_id]);

  useEffect(() => {
    (async () => {
      setLabList(null);
      let queryParams = `start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`;
      if (location_id)
        queryParams += `&location_id=${location_id}`;
      await getReportingLabList(queryParams);
    })();
    // eslint-disable-next-line 
  }, [location_id, startDate, endDate]);

  useEffect(() => {
    if (reportingLabCounts) {
      setRcounts(reportingLabCounts);
    }
  }, [reportingLabCounts]);

  useEffect(() => {
    if (reportingLabLinear) {
      let linearLabels = [];
      let linearData = [];
      let total = 0;
      reportingLabLinear.forEach(e => {
        if (linearType === 'Daily') {
          let hour = parseInt(e.key);
          linearLabels.push(hour <= 11 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`);
        } else {
          linearLabels.push(e.key);
        }
        linearData.push(e.count);
        total += e.count;
      });
      setLinearTotal(total);
      setLinearLabels(linearLabels);
      setLinearData([{ data: linearData }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportingLabLinear]);

  useEffect(() => {
    if (reportingLabTests) {
      let labels = [];
      let sData = [];
      let tData = [];
      reportingLabTests.forEach(r => {
        labels.push(r.time);
        sData.push(r.schedules);
        tData.push(r.testings);
      });
      setTestsLabels(labels);
      setTestsData([{ name: 'Patients Scheduled', data: sData }, { name: 'Patients Tested', data: tData }]);
    }
  }, [reportingLabTests]);

  useEffect(() => {
    if (reportingLabList) {
      let data = reportingLabList.map(item => {
        let row = Object.assign({}, item);
        row['submitted_timestamp'] = item.submitted_timestamp ? moment.utc(item.submitted_timestamp).format('MM/DD/YYYY') : undefined;
        row['user_id']['dob'] = item.user_id.dob ? moment.utc(item.user_id.dob).format('MM/DD/YYYY') : undefined;
        row['dependent_id'] = item.dependent_id ? item.dependent_id : {};
        if (row.dependent_id.dob)
          row['dependent_id']['dob'] = moment.utc(item.dependent_id.dob).format('MM/DD/YYYY');
        return row;
      });
      setLabList(data);
    }
  }, [reportingLabList]);

  useEffect(() => {
    let csvH = exportHeaders.filter(e => e.export);
    setCsvHeaders(csvH);
  }, [exportHeaderList]);

  function onClickExportButton() {
    setIsShowReportDlg(true);
  }

  const onClickSearchInput = (event) => {
    console.log('isOpen', isOpen, event);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onClickReport = (e) => {
    history.push('/reporting/custom');
    // console.log(' -- click report button -- ', e.target);
  }

  const MaketableRow = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'submitted_timestamp') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {value && moment.utc(value).format('MM/DD/YYYY')}
        </TableCell>
      )
    }
    if (column.key === 'status') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {value === 'Resulted'
            ? <img src='/images/svg/status/resulted_icon.svg' alt='' className={classes.statusIcon} />
            : value === 'Failed'
              ? <img src='/images/svg/status/caution-sign.svg' height={24} alt='' className={classes.statusIcon} />
              : <img src='/images/svg/status/Processing_icon.svg' alt='' className={classes.statusIcon} />
          }
        </TableCell>
      )
    }
    if (column.key.includes('.')) {
      let [locKey, locValue] = column.key.split('.');
      // if has dependent
      if (locKey === 'user_id' && row.dependent_id.first_name) {
        if (locValue === 'first_name' || locValue === 'last_name' || locValue === 'dob')
          locKey = 'dependent_id';
      }
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {locValue === 'dob'
            ?
            row[locKey][locValue] && moment.utc(row[locKey][locValue]).format('DD/MM/YYYY')
            :
            row[locKey][locValue]
          }
        </TableCell>
      )
    }
    return (
      <TableCell key={column.key} align={column.align} className={classes.tableCell}>
        {value}
      </TableCell>
    )
  }

  const onLocationUpdate = () => {
    setLabList(null);
    setTestsData([]);
    setLinearData([]);
    setRcounts(null);
  };

  const handleStDateChange = async (date) => {
    setTestsLabels([]);
    setTestsData([]);
    setTestsDate(date);
    let queryParams = `date=${date.format('YYYY-MM-DD')}`;
    if (location_id)
      queryParams += `&location_id=${location_id}`;
    await getReportingLabTests(queryParams);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleLinearDateChange = async (date) => {
    setLinearLabels([]);
    setLinearData([]);
    setLinearDate(date);
    let queryParams = linearDateQueryParams(linearType, date);
    if (location_id)
      queryParams += `&location_id=${location_id}`;
    await getReportingLabLinear(queryParams);
  };

  const handleLinearTypeChange = async (e) => {
    let type = e.target.value;
    setLinearLabels([]);
    setLinearData([]);
    setLinearType(type);
    let queryParams = linearDateQueryParams(type, linearDate);
    if (location_id)
      queryParams += `&location_id=${location_id}`;
    await getReportingLabLinear(queryParams);
  }

  const handleLocationChange = (event) => {
    setLocationId(event.target.value);
  }

  const linearDateQueryParams = (type, date) => {
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
  }

  const toggleExport = (data) => {
    document.getElementById('csvLinkBtn').click();
  };

  return (
    <div>
      <div className={classes.header} >
        <div className={classes.subHeader}>
          <Chart style={{ color: '#043B5D' }} />
          &ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Reporting |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>
            {'Lab Manager '}
            {locations
              ?
              <Select
                value={location_id}
                onChange={handleLocationChange}
                className={clsx(classes.locationSelect, classes.lineChartRoot)}
              >
                <MenuItem value={0}>
                  <em>{'All Locations'}</em>
                </MenuItem>
                {locations.map((location, index) => (
                  <MenuItem value={location._id} key={index}>{location.name}</MenuItem>
                ))}
              </Select>
              :
              <CircularProgress />
            }
          </Typography>
        </div>
        <Button
          className={clsx(brandClasses.reportBtn, brandClasses.button)}
          onClick={onClickReport}
        >
          {'CUSTOM REPORT'}
        </Button>
      </div>
      <div className={classes.container}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'total_tests'} title={'Total Tests'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'total_resulted'} title={'Total Resulted'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'total_pending'} title={'Total Pending'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'positive_results'} title={'Positive Results'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'positivity_rate'} title={'Positivity Rate %'} isPercent={true} />
          </BlueBox>
        </Grid>
        <Grid container spacing={4}>
          <Grid item md={5}>
            <BlueBox class={classes.lineChart}>
              <Typography variant="h4" className={classes.barChartTitle}> Number of responses</Typography>
              <br />
              <Typography variant="h2"> {linearTotal}</Typography>
              {linearData.length
                ? <LineChart seriesData={linearData} label={linearLabels} />
                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
              }
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils} >
                  {
                    linearType === 'Yearly'
                      ?
                      <DatePicker
                        views={["year"]}
                        label="Year only"
                        value={linearDate}
                        onChange={handleLinearDateChange}
                        className={classes.utilRoot}
                      />
                      :
                      linearType === 'Monthly'
                        ?
                        <DatePicker
                          views={["year", "month"]}
                          label="Year and Month"
                          value={linearDate}
                          onChange={handleLinearDateChange}
                          className={classes.utilRoot}
                        />
                        :
                        linearType === 'Weekly'
                          ?
                          <DatePicker
                            label="Week of"
                            value={linearDate}
                            onChange={handleLinearDateChange}
                            className={classes.utilRoot}
                          />
                          :
                          <DatePicker
                            label="Date"
                            value={linearDate}
                            onChange={handleLinearDateChange}
                            className={classes.utilRoot}
                          />
                  }
                </MuiPickersUtilsProvider>
                <Select
                  value={linearType}
                  onChange={handleLinearTypeChange}
                  className={classes.lineChartRoot}
                >
                  <MenuItem value='Daily'>Daily</MenuItem>
                  <MenuItem value='Weekly'>Weekly</MenuItem>
                  <MenuItem value='Monthly'>Monthly</MenuItem>
                  <MenuItem value='Yearly'>Yearly</MenuItem>
                </Select>
              </div>
            </BlueBox>
          </Grid>
          <Grid item md={7}>
            <BlueBox>
              <Typography className={classes.barChartTitle} variant="h4">
                {'Positive/Negative Cases'}
              </Typography>
              {testsData.length
                ? <BarChart colors={stColors} seriesData={testsData} label={testsLabels} height={405} />
                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
              }
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils} >
                  <DatePicker
                    label="Date"
                    value={testsDate}
                    onChange={handleStDateChange}
                    className={classes.utilRoot}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </BlueBox>
          </Grid>
        </Grid>

        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <MuiPickersUtilsProvider utils={MomentUtils} >
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
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <div className={classes.footer}>
              <SearchBar className={brandClasses.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} />
              <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div> &ensp;&ensp;
              <Button
                className={clsx(classes.submitButton, brandClasses.button)}
                onClick={() => onClickExportButton()}
              >
                <Download /> &nbsp; {'EXPORT'}
              </Button>

              <CSVLink
                data={labList ? labList : []}
                headers={csvHeaders}
                filename={`${moment().format('MM_DD_YYYY')}-${location_id ? locations.find(l => l._id === location_id).name : 'All_Locations'}.csv`}
                className={clsx(classes.submitButton, brandClasses.button)}
                style={{ display: 'none' }}
                // ref={csvLinkRef}
                id="csvLinkBtn"
              >
                {'EXPORT'}
              </CSVLink>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Table  */}
      <div>
        <TableContainer >
          <Table stickyHeader aria-label="sticky table" className={classes.table}>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={labList ? labList.length : 0}
            />
            <TableBody>
              {!labList
                ?
                <TableRow>
                  <TableCell colSpan={headers.length} align="center">
                    <CircularProgress className={brandClasses.fetchProgressSpinner} />
                  </TableCell>
                </TableRow>
                :
                !labList.length
                  ?
                  <TableRow>
                    <TableCell colSpan={headers.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  :
                  stableSort(labList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index} className={index % 2 !== 0 ? '' : classes.tableRow1}>
                          {headers.map((column) => {
                            return (
                              <MaketableRow column={column} row={row} key={column.key} />
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
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={labList ? labList.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          classes={{
            root: classes.tablePagination,
            caption: classes.tablePaginationCaption,
            selectIcon: classes.tablePaginationSelectIcon,
            select: classes.tablePaginationSelect,
            actions: classes.tablePaginationActions,
          }}
        />
      </div>

      <ReportDialog
        title={'Lab Manager'}
        isShowReportDlg={isShowReportDlg}
        toggleReportDlg={setIsShowReportDlg}
        exportHeaderList={exportHeaderList}
        setExportHeaderList={setExportHeaderList}
        clickCSV={toggleExport}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  reportingLabCounts: state.data.reportingLabCounts,
  reportingLabLinear: state.data.reportingLabLinear,
  reportingLabTests: state.data.reportingLabTests,
  reportingLabList: state.data.reportingLabList,
  locations: state.data.locations,
});

Lab.propTypes = {
  getReportingLabCounts: PropTypes.func.isRequired,
  getReportingLabLinear: PropTypes.func.isRequired,
  getReportingLabTests: PropTypes.func.isRequired,
  getReportingLabList: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { getReportingLabCounts, getReportingLabLinear, getReportingLabTests, getReportingLabList, getLocations1 })(Lab);
