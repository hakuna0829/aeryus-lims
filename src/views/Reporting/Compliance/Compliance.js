import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
  CircularProgress,
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import moment from "moment";
import BlueBox from "components/BlueBox";
import LineChart from "components/LineChart";
import BarChart from "components/BarChart";
import brandStyles from 'theme/brand';
import { getReportingComplianceCounts, getReportingComplianceTests, getReportingComplianceLinear, getLocations1, getReportingComplianceList, clientServer } from 'actions/api';
import { clearReportingCompliance, clearComplianceList } from 'actions/clear';
import clsx from 'clsx';
import { CSVLink } from "react-csv";
import ReportDialog from '../ReportDialog';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import Download from 'icons/Download';
import { CountBox } from 'components';
import SearchBar from 'layouts/Main/components/SearchBar';
import TuneIcon from '@material-ui/icons/Tune';
import Chart from 'icons/Chart';
import { getRace } from 'helpers';

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
    submitButton: {
      // marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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

const exportOptionsList = [
  'Custom',
  'DOH - FL',
  'DPH - GA'
];

const exportHeaders = [
  { label: "Dependent First Name", key: "dependent_id.first_name", export: true },
  { label: "Dependent Last Name", key: "dependent_id.last_name", export: true },
  { label: "Dependent DOB", key: "dependent_id.dob", export: true },
  { label: "Dependent SEX", key: "dependent_id.gender", export: true },
  { label: "Patient First Name", key: "user_id.first_name", export: true },
  { label: "Patient Middle Name", key: "user_id.middle_name", export: true },
  { label: "Patient Last Name", key: "user_id.last_name", export: true },
  { label: "DOB", key: "user_id.dob", export: true },
  { label: "SEX", key: "user_id.gender", export: true },
  { label: "Race", key: "user_id.race", export: true },
  { label: "Ethnicity", key: "user_id.ethnicity", export: true },
  { label: "Patient Address", key: "user_id.address", export: true },
  { label: "Patient Address 2", key: "user_id.address2", export: true },
  { label: "City", key: "user_id.city", export: true },
  { label: "State", key: "user_id.state", export: true },
  { label: "Zip", key: "user_id.zip_code", export: true },
  { label: "County", key: "user_id.county", export: true },
  { label: "Patient Phone", key: "user_id.phone", export: true },
  { label: "Employed Healthcare", key: "location_id.is_healthcare_related", export: true },

  { label: "Resident Congregate Setting", key: "location_id.is_resident_congregate_setting", export: false },
  { label: "Ordering Facility Name", key: "location_id.name", export: false },
  { label: "Ordering Facility Address", key: "location_id.address", export: false },
  { label: "Ordering Facility City", key: "location_id.city", export: false },
  { label: "Ordering Facility State", key: "location_id.state", export: false },
  { label: "Ordering Facility Zip", key: "location_id.zip_code", export: false },
  { label: "Ordering Facility County", key: "location_id.county", export: false },
  { label: "Ordering Provider First Name", key: "location_id.provider.first_name", export: false },
  { label: "Ordering Provider Last Name", key: "location_id.provider.last_name", export: false },
  { label: "Ordering Provider Phone", key: "location_id.provider.phone", export: false },
  { label: "Specimen Collection Date", key: "collected_timestamp", export: false },
  { label: "Test Description", key: "test_type", export: false },
  { label: "Test Results", key: "result", export: false },
];

if (clientServer === 'prod007') {
  exportHeaders.push({ label: "Payment Type", key: "payment_type", export: false });
  exportHeaders.push({ label: "Payment Complementary Code", key: "complementary_code", export: false });
  exportHeaders.push({ label: "Payment Complementary Room Number", key: "complementary_room_number", export: false });
}

const exportDohFlHeaders = [
  { label: "RecordID", key: "user_id._id", export: true },
  { label: "AccessionNumber", key: "testkit_id", export: true },
  { label: "LastName", key: "user_id.last_name", export: true },
  { label: "FirstName", key: "user_id.first_name", export: true },
  { label: "MiddleName", key: "user_id.middle_name", export: true },
  { label: "DOB", key: "user_id.dob", export: true },
  { label: "StreetAddress", key: "user_id.address", export: true },
  { label: "City", key: "user_id.city", export: true },
  { label: "State", key: "user_id.state", export: true },
  { label: "Zip", key: "user_id.zip_code", export: true },
  { label: "County", key: "user_id.county", export: true },
  { label: "Gender", key: "user_id.gender", export: true },
  { label: "PhoneNumber", key: "user_id.phone", export: true },
  { label: "Ethnicity", key: "user_id.ethnicity", export: true },

  { label: "RaceWhite", key: "user_id.RaceWhite", export: true },
  { label: "RaceBlack", key: "user_id.RaceBlack", export: true },
  { label: "RaceAmericanIndianAlaskanNative", key: "user_id.RaceAmericanIndianAlaskanNative", export: true },
  { label: "RaceAsianPacificIslande", key: "user_id.RaceAsianPacificIslande", export: true },
  { label: "RaceNativeHawaiianOrOtherPacificIslander", key: "user_id.RaceNativeHawaiianOrOtherPacificIslander", export: true },
  { label: "RaceOther", key: "user_id.RaceOther", export: true },
  { label: "RaceUnknown", key: "user_id.RaceUnknown", export: true },

  { label: "Specimen", key: "", export: true },
  { label: "SpecimenCollectedDate", key: "collected_timestamp", export: true },
  { label: "TestType", key: "test_type", export: true },
  { label: "Result", key: "result", export: true },
  { label: "ProviderName", key: "location_id.ProviderName", export: true },
  { label: "NPI", key: "location_id.provider.npi", export: true },
  { label: "Pregnant", key: "", export: true },
  { label: "SchoolAssociation", key: "", export: true },
  { label: "SchoolName", key: "", export: true },
];

const exportDphGaHeaders = [
  { label: "PatientFirstName", key: "user_id.first_name", export: true },
  { label: "PatientLastName", key: "user_id.last_name", export: true },
  { label: "DOB", key: "user_id.dob", export: true },
  { label: "SEX", key: "user_id.gender", export: true },
  { label: "Race", key: "user_id.race", export: true },
  { label: "Ethnicity", key: "user_id.Ethnicity", export: true },
  { label: "PatientAddress", key: "user_id.address", export: true },
  { label: "PatientAddress2", key: "user_id.address2", export: true },
  { label: "City", key: "user_id.city", export: true },
  { label: "State", key: "user_id.state", export: true },
  { label: "Zip", key: "user_id.zip_code", export: true },
  { label: "County", key: "user_id.county", export: true },
  { label: "PatientPhone", key: "user_id.phone", export: true },
  { label: "Employed_Healthcare", key: "location_id.is_healthcare_related", export: true },
  { label: "Resident_Congregate_Setting", key: "location_id.is_resident_congregate_setting", export: true },
  { label: "Ordering_Facility_Name", key: "location_id.name", export: true },
  { label: "Ordering_Facility_Address", key: "location_id.address", export: true },
  { label: "Ord_City", key: "location_id.city", export: true },
  { label: "Ord_St", key: "location_id.state", export: true },
  { label: "Ord_zip", key: "location_id.zip_code", export: true },
  { label: "Ord_County", key: "location_id.county", export: true },
  { label: "Ordering_Provider_first_name", key: "location_id.provider.first_name", export: true },
  { label: "Ordering_Provider_last_name", key: "location_id.provider.last_name", export: true },
  { label: "Ordering_Provider_Phone", key: "location_id.provider.phone", export: true },
  { label: "Specimen_Collection_Date", key: "collected_timestamp", export: true },
  { label: "Test_description", key: "test_type", export: true },
  { label: "Test_result", key: "result", export: true },
];

const headers = [
  { label: "Patient First Name", key: "user_id.first_name", minWidth: 100 },
  { label: "Patient Last Name", key: "user_id.last_name", minWidth: 100 },
  { label: "DOB", key: "user_id.dob", minWidth: 100 },
  { label: "SEX", key: "user_id.gender", minWidth: 70 },
  { label: "Race", key: "user_id.race", minWidth: 100 },
  { label: "Ethnicity", key: "user_id.ethnicity", minWidth: 100 },
  { label: "Patient Address", key: "user_id.address", minWidth: 120 },
  { label: "City", key: "user_id.city", minWidth: 100 },
  { label: "State", key: "user_id.state", minWidth: 80 },
  { label: "Zip", key: "user_id.zip_code", minWidth: 100 },
  { label: "County", key: "user_id.county", minWidth: 100 },
  { label: "Patient Phone", key: "user_id.phone", minWidth: 120 },
];

const Compliance = (props) => {
  const {
    // API
    getReportingComplianceCounts,
    getReportingComplianceTests,
    getReportingComplianceLinear,
    getLocations1,
    getReportingComplianceList,
    // Redux data
    reportingComplianceCounts,
    reportingComplianceTests,
    reportingComplianceLinear,
    locations,
    reportingComplianceList,
    // clear
    clearReportingCompliance,
    clearComplianceList,
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
  const [exportOption, setExportOption] = useState('Custom');
  const [csvHeaders, setCsvHeaders] = useState([{ label: '', key: '' }]);
  // const [csvList, setCsvList] = useState([]);
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
      await getReportingComplianceCounts(queryParams);
      let queryParamsForEmp = queryParams ? queryParams + `&${empDateQueryParams(empType, empDate)}` : `&${empDateQueryParams(empType, empDate)}`;
      await getReportingComplianceLinear(queryParamsForEmp);
      let queryParamsForST = queryParams ? queryParams + `&date=${moment(stDate).format('YYYY-MM-DD')}` : `&date=${moment(stDate).format('YYYY-MM-DD')}`;
      await getReportingComplianceTests(queryParamsForST);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location_id]);

  useEffect(() => {
    (async () => {
      clearComplianceList();
      let queryParams = `start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`;
      if (location_id)
        queryParams += `&location_id=${location_id}`;
      await getReportingComplianceList(queryParams);
    })();
    // eslint-disable-next-line 
  }, [location_id, startDate, endDate]);

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
      setStData([{ name: 'Patients Scheduled', data: sData }, { name: 'Patients Tested', data: tData }]);
    }
  }, [reportingComplianceTests]);

  useEffect(() => {
    if (reportingComplianceLinear) {
      let empLabels = [];
      let empData = [];
      let total = 0;
      reportingComplianceLinear.forEach(e => {
        if (empType === 'Daily') {
          let hour = parseInt(e.key);
          empLabels.push(hour <= 11 ? `${hour} AM` : hour === 12 ? `12 PM` : `${hour - 12} PM`);
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
  }, [reportingComplianceLinear]);

  useEffect(() => {
    if (reportingComplianceCounts) {
      setRcounts(reportingComplianceCounts);
    }
  }, [reportingComplianceCounts]);

  useEffect(() => {
    if (reportingComplianceList) {
      let data = reportingComplianceList.map(item => {
        let row = Object.assign({}, item);
        row['user_id']['dob'] = item.user_id.dob ? moment.utc(item.user_id.dob).format('MM/DD/YYYY') : undefined;
        if (item.dependent_id)
          row['dependent_id']['dob'] = item.dependent_id.dob ? moment.utc(item.dependent_id.dob).format('MM/DD/YYYY') : undefined;
        row['collected_timestamp'] = item.collected_timestamp ? moment.utc(item.collected_timestamp).format('MM/DD/YYYY') : undefined;
        row['test_type'] = item.test_type ? item.test_type.includes('PCR') ? 'PCR' : item.test_type : item.test_type;

        row['location_id']['ProviderName'] = (item.location_id && item.location_id.provider && item.location_id.provider.first_name && item.location_id.provider.last_name) ? item.location_id.provider.first_name + ' ' + item.location_id.provider.last_name : '';

        row['user_id']['Ethnicity'] = item.user_id.ethnicity ? item.user_id.ethnicity === 'Hispanic' ? 'Hispanic' : 'Non-Hispanic' : undefined;

        if (getRace.includes(item.user_id.race)) {
          row['user_id']['RaceWhite'] = item.user_id.race === 'White' ? 1 : 0;
          row['user_id']['RaceBlack'] = item.user_id.race === 'Black' ? 1 : 0;
          row['user_id']['RaceAmericanIndianAlaskanNative'] = 0;
          row['user_id']['RaceAsianPacificIslande'] = item.user_id.race === 'Asian' ? 1 : 0;
          row['user_id']['RaceNativeHawaiianOrOtherPacificIslander'] = 0;
          row['user_id']['RaceOther'] = item.user_id.race === 'Other/Mixed' ? 1 : 0;
          row['user_id']['RaceUnknown'] = 0;
        } else {
          row['user_id']['RaceWhite'] = 0;
          row['user_id']['RaceBlack'] = 0;
          row['user_id']['RaceAmericanIndianAlaskanNative'] = 0;
          row['user_id']['RaceAsianPacificIslande'] = 0;
          row['user_id']['RaceNativeHawaiianOrOtherPacificIslander'] = 0;
          row['user_id']['RaceOther'] = 0;
          row['user_id']['RaceUnknown'] = 1;
        }
        return row;
      });
      setComplianceList(data);
    }
  }, [reportingComplianceList]);

  useEffect(() => {
    if (exportOption === 'Custom') {
      let csvH = exportHeaders.filter(e => e.export);
      setCsvHeaders(csvH);
    } else if (exportOption === 'DOH - FL') {
      let csvH = exportDohFlHeaders.filter(e => e.export);
      setCsvHeaders(csvH);
    } else if (exportOption === 'DPH - GA') {
      let csvH = exportDphGaHeaders.filter(e => e.export);
      setCsvHeaders(csvH);
    }
  }, [exportHeaderList, exportOption]);

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

  const MaketableRow = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'phone') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          <PhoneNumberFormat value={value} />
        </TableCell>
      )
    }
    if (column.key === 'dob') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {value && moment.utc(value).format('DD/MM/YYYY')}
        </TableCell>
      )
    }
    if (column.key.includes('.')) {
      let [locKey, locValue] = column.key.split('.');
      // if has dependent
      if (locKey === 'user_id' && row.dependent_id)
        if (locValue === 'first_name' || locValue === 'last_name' || locValue === 'dob')
          locKey = 'dependent_id';
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

  const onLocationUpdate = async () => {
    await clearReportingCompliance();
    setStData([]);
    setEmpData([]);
    setRcounts(null);
  };

  const handleStDateChange = async (date) => {
    setStLabels([]);
    setStData([]);
    setStDate(date);
    let queryParams = `date=${date.format('YYYY-MM-DD')}`;
    if (location_id)
      queryParams += `&location_id=${location_id}`;
    await getReportingComplianceTests(queryParams);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEmpDateChange = async (date) => {
    setEmpLabels([]);
    setEmpData([]);
    setEmpDate(date);
    let queryParams = empDateQueryParams(empType, date);
    if (location_id)
      queryParams += `&location_id=${location_id}`;
    await getReportingComplianceLinear(queryParams);
  };

  const handleEmpTypeChange = async (e) => {
    let type = e.target.value;
    setEmpLabels([]);
    setEmpData([]);
    setEmpType(type);
    let queryParams = empDateQueryParams(type, empDate);
    if (location_id)
      queryParams += `&location_id=${location_id}`;
    await getReportingComplianceLinear(queryParams);
  }

  const handleLocationChange = (event) => {
    setLocationId(event.target.value);
  }

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
  }

  const toggleExport = (data) => {
    document.getElementById('csvLinkBtn').click();
    // console.log('click toggle button', data);
    // let from = new Date(data.startDate).getTime();
    // let to = new Date(data.endDate).getTime();
    // let result = complianceList.filter(c => {
    //   var time = new Date(c.collected_timestamp).getTime();
    //   return (from < time && time < to);
    // });
    // console.log('result:', result);
    // setCsvList(result);
    // setTimeout(() => {
    //   document.getElementById('csvLinkBtn').click();
    // }, 500);
    // csvLinkRef.click();
    // this.btn.click();
  };

  const onClickCustomReport = (e) => {
    history.push('/reporting/custom');
  }

  return (
    <div>
      <div className={classes.header} >
        <div className={classes.subHeader}>
          <Chart style={{ color: '#043B5D' }} />&ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Reporting |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>
            {'Compliance'}
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
          onClick={onClickCustomReport}
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
            <CountBox value={rCounts} object_key={'total_users'} title={'Total Users'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'tests_performed'} title={'Tests Performed'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'positive_results'} title={'Positive Results'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'negative_results'} title={'Negative Results'} />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot}>
            <CountBox value={rCounts} object_key={'positivity_rate'} title={'Positivity Rate %'} isPercent={true} />
          </BlueBox>
        </Grid>

        <Grid container spacing={4}>
          <Grid item md={5}>
            <BlueBox class={classes.lineChart}>
              <Typography variant="h4" className={classes.barChartTitle}>Current Number of Tests</Typography>
              <br />
              <Typography variant="h2"> {empTotal}</Typography>
              {empData.length
                ? <LineChart seriesData={empData} label={empLabels} />
                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
              }
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils} >
                  {
                    empType === 'Yearly'
                      ?
                      <DatePicker
                        views={["year"]}
                        label="Year only"
                        value={empDate}
                        onChange={handleEmpDateChange}
                        className={classes.utilRoot}
                      />
                      :
                      empType === 'Monthly'
                        ?
                        <DatePicker
                          views={["year", "month"]}
                          label="Year and Month"
                          value={empDate}
                          onChange={handleEmpDateChange}
                          className={classes.utilRoot}
                        />
                        :
                        empType === 'Weekly'
                          ?
                          <DatePicker
                            label="Week of"
                            value={empDate}
                            onChange={handleEmpDateChange}
                            className={classes.utilRoot}
                          />
                          :
                          <DatePicker
                            label="Date"
                            value={empDate}
                            onChange={handleEmpDateChange}
                            className={classes.utilRoot}
                          />
                  }
                </MuiPickersUtilsProvider>
                <Select
                  value={empType}
                  onChange={handleEmpTypeChange}
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
              {stData.length
                ? <BarChart colors={stColors} seriesData={stData} label={stLabels} height={405} />
                : <CircularProgress className={brandClasses.fetchProgressSpinner} />
              }
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils} >
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
                data={complianceList}
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
              rowCount={complianceList.length}
            />
            <TableBody>
              {!reportingComplianceList
                ?
                <TableRow>
                  <TableCell colSpan={headers.length} align="center">
                    <CircularProgress className={brandClasses.fetchProgressSpinner} />
                  </TableCell>
                </TableRow>
                :
                !complianceList.length
                  ?
                  <TableRow>
                    <TableCell colSpan={headers.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  :
                  stableSort(complianceList, getComparator(order, orderBy))
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
            actions: classes.tablePaginationActions,
          }}
        />
      </div>

      <ReportDialog
        title={'Compliance'}
        isShowReportDlg={isShowReportDlg}
        toggleReportDlg={setIsShowReportDlg}
        exportHeaderList={exportHeaderList}
        setExportHeaderList={setExportHeaderList}
        clickCSV={toggleExport}

        exportOptionsList={exportOptionsList}
        exportOption={exportOption}
        setExportOption={setExportOption}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  reportingComplianceCounts: state.data.reportingComplianceCounts,
  reportingComplianceLinear: state.data.reportingComplianceLinear,
  reportingComplianceTests: state.data.reportingComplianceTests,
  reportingComplianceList: state.data.reportingComplianceList,
  locations: state.data.locations,
});

Compliance.propTypes = {
  getReportingComplianceCounts: PropTypes.func.isRequired,
  getReportingComplianceTests: PropTypes.func.isRequired,
  getReportingComplianceLinear: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
  getReportingComplianceList: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { getReportingComplianceCounts, getReportingComplianceTests, getReportingComplianceLinear, getLocations1, getReportingComplianceList, clearReportingCompliance, clearComplianceList })(Compliance);
