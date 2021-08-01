import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import Download from 'icons/Download';
import { Add, Close } from '@material-ui/icons';
import clsx from 'clsx';
import moment from "moment";
import {
  Button,
  Grid,
  Typography, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel,
  CircularProgress,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  FormControl,
  StepButton,
} from '@material-ui/core';
import { getReportingCustom } from 'actions/api';
import { CSVLink } from "react-csv";
import SearchBar from 'layouts/Main/components/SearchBar';
import TuneIcon from '@material-ui/icons/Tune';
import PhoneNumberFormat from 'components/PhoneNumberFormat';
import RadioCheckButton from 'components/RadioCheckButton';
import CheckButton from 'components/CheckButton';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2)
  },
  lineChart: {
    padding: theme.spacing(2),
    textAlign: 'left !important'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'space-between'
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
  locationSelect: {
    // width: '50%',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  blueBox: {
    textAlign: 'left',
    padding: 8,
    // display: 'flex',
    alignItems: 'center',
  },
  blueBoxHeader: {
    textAlign: 'left',
    // padding:8,
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 30
    },
    '& h4,h5': {
      fontWeight: 600
    }
  },
  subTitle: {
    padding: '16px 16px 8px',

  },
  submitButton: {
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  tableContainer: {
    width: 'calc(100% + 32px)',
    marginLeft: '-16px'
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
    padding: '6px 8px',
  },
  inputLabel: {
    '& input': {
      fontSize: '16px !important',
      padding: '8px !important'
    },
    '& fieldset': {
      borderRadius: '6px !important'
    }

  },
  stepRoot: {
    border: '1px solid rgba(15,132,169,0.8)',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
    padding: theme.spacing(2),
  },
  headerTitle: {
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
  const { order, orderBy, onRequestSort, headers } = props;
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

const FilterOptionInit = {
  field: '',
  condition: 'equal',
  value: ''
};

const unwantedFields = ['_id', '__v', 'client_id', 'location_id', 'user_id', 'latitude', 'longitude', 'operations', 'slot_difference', 'created_date', 'latest_test_result', 'password', 'ext', 'completed', 'paired', 'date_time', 'testkit_back', 'testkit_front', 'role_id', 'photo', 'access_to_locations', 'admin_office_ext', 'eoc_ext', 'provider', 'site_logo', 'country', 'department_id', 'personal_id_back', 'personal_id_front', 'phone_verified', 'signature', 'medical_technician', 'patient_signature', 'protocol_email_sent', 'schedule_date_time', 'populationsettings_id', 'dependent_id', 'employee_id', 'testing_protocol_email_sent', 'vaccine_protocol_email_sent', 'vaccine_protocol', 'population_manager', 'users_fields', 'users_type', 'positive_points'];

const CustomReport = (props) => {
  const { getReportingCustom } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [formState, setFormState] = useState({
    filterOptions: [{ ...FilterOptionInit }],
  });

  const [tablesList, setTablesList] = useState(null);
  const [table, setTable] = useState(null);
  const [tableFilterFields, setTableFilterFields] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [tableFilteredData, setTableFilteredData] = useState([]);

  const [selectRows, setSelectRows] = useState(0);
  const [filterRows, setFilterRows] = useState(null);
  const [summarizeColumns, setSummarizeColumns] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    async function fetchData() {
      let res = await getReportingCustom();
      if (res.success)
        setTablesList(res.data);
    }
    fetchData();
  }, [getReportingCustom]);

  useEffect(() => {
    if (summarizeColumns) {
      let csvH = summarizeColumns.filter(e => e.export);
      setCsvHeaders(csvH);
    }
  }, [summarizeColumns]);

  const handleAddFilterOption = () => {
    let temp = formState.filterOptions;
    temp.push({ ...FilterOptionInit });
    setFormState({ ...formState, temp });
  };

  const handleRemoveFilterOption = () => {
    let temp = formState.filterOptions;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onClickExportButton = () => {
    document.getElementById('csvLinkBtn').click();
  }

  const onClickSearchInput = (event) => {
    // console.log('isOpen', isOpen, event);
  }

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleTableChange = async e => {
    e.persist();
    setTable(e.target.value);
    setSelectRows('Loading');
    let res = await getReportingCustom(`table=${e.target.value}`);
    if (res.success) {
      setTableData(res.data.rows);
      setSelectRows(res.data.rows.length);
      goToNextStep({});
      let requiredFields = removeUnwantedFields(res.data.fields);
      setTableFilterFields(requiredFields);
      let columns = await getColumns(requiredFields);
      setSummarizeColumns(columns);
    }
  };

  const getColumns = async (fields) => {
    return fields.map(f => ({
      key: f,
      label: getFieldName(f),
      export: true
    }));
  }

  const removeUnwantedFields = (fields) => {
    return fields.filter(f => !unwantedFields.some(uf => uf === f));
  };

  const getFieldName = (field) => {
    switch (field) {
      // Location
      case 'name': return 'Name';
      case 'active': return 'Active';
      case 'address': return 'Address';
      case 'administrator': return 'Admin Name';
      case 'city': return 'City';
      case 'email': return 'Email';
      case 'eoc': return 'EOC Name';
      case 'office_phone': return 'Office Phone';
      case 'phone': return 'Phone';
      case 'state': return 'State';
      case 'zip_code': return 'Zip Code';
      case 'admin_office_phone': return 'Admin Office Phone';
      case 'county': return 'County';
      case 'eoc_email': return 'EOC Email';
      case 'eoc_office_phone': return 'EOC office phone';
      case 'is_healthcare_related': return 'Is Healthcare Related';
      case 'is_resident_congregate_setting': return 'Is Resident Congregate Setting';
      case 'testing_protocol': return 'Testing Protocol';
      // User
      case 'department': return 'Department';
      case 'dob': return 'Date of Birth';
      case 'ethnicity': return 'Ethnicity';
      case 'first_name': return 'First Name';
      case 'last_name': return 'Last Name';
      case 'middle_name': return 'Middle Name';
      case 'gender': return 'Gender';
      case 'social_digits': return 'Social Digits';
      case 'unit': return 'Unit';
      case 'verification_id': return 'Verification ID';
      case 'address2': return 'Address 2';
      case 'contact_tracing': return 'Contact Tracing';
      case 'location_sharing': return 'Location Sharing';
      case 'have_insurance': return 'Have Insurance';
      case 'race': return 'Race';
      case 'population_type': return 'Population Type';
      // Testing
      case 'date': return 'Date';
      case 'time': return 'Time';
      case 'result': return 'Result';
      case 'rna': return 'RNA';
      case 'testkit_id': return 'Test Kit ID';
      case 'test_session_id': return 'Test Kit Session ID';
      case 'schedule_date': return 'Schedule Date';
      case 'schedule_time': return 'Schedule Time';
      case 'test_type': return 'Test Type';
      case 'type': return 'Type';
      case 'lab_submitted_timestamp': return 'Lab Submitted Timestamp';
      case 'collected_timestamp': return 'Collected Timestamp';
      case 'received_timestamp': return 'Received Timestamp';
      case 'reported_timestamp': return 'Reported Timestamp';
      // Account
      case 'location': return 'Location';
      case 'username': return 'Username';
      default:
        console.log('Unknown Field:', field);
        return '***Unknown Field***';
    }
  }

  const onFilterNext = async () => {
    goToNextStep({ ...completed });
    let validFilters = formState.filterOptions.filter(f => f.field && f.condition && f.value.length);
    let fd = [...tableData];
    if (validFilters.length)
      fd = await filterDataFunc([...tableData], [...validFilters]);
    setTableFilteredData(fd);
    setFilterRows(fd.length);
  };

  const filterDataFunc = async (datas, filters) => {
    return datas.filter(data => {
      return filters.some(f => {
        let fieldValue = data[f.field] ? data[f.field].toString().toLowerCase() : '';
        let searchValue = f.value.toLowerCase();
        return f.condition === 'equal'
          ? f.field.includes('date') || f.field.includes('time') ? fieldValue.includes(searchValue) : fieldValue === searchValue
          : f.condition === 'not_equal'
            ? fieldValue !== searchValue
            : f.condition === 'less_than'
              ? fieldValue < searchValue
              : fieldValue > searchValue;
      });
    });
  }

  const onSummarizeNext = () => {
    goToNextStep({ ...completed });
  };

  const goToNextStep = (newCompleted) => {
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep(activeStep => activeStep + 1);
  };

  const handleFilterChange = index => e => {
    e.persist();
    let temp = formState.filterOptions;
    temp[index][e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleSummarizeColumnsChange = index => e => {
    e.persist();
    let temp = [...summarizeColumns];
    temp[index].export = e.target.checked;
    setSummarizeColumns(temp);
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
    if (column.key === 'latest_test_result') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {!value
            ?
            <Typography className={brandClasses.emptyTestResult}>
              {'- - - - -'}
            </Typography>
            : value.result === 'Positive'
              ? <img src='/images/svg/status/red_shield.svg' alt='' className={brandClasses.resultStatusIcon} />
              : value.result === 'Negative'
                ? <img src='/images/svg/status/green_shield.svg' alt='' className={brandClasses.resultStatusIcon} />
                : <img src='/images/svg/status/pending_turquoise.svg' alt='' className={brandClasses.resultStatusIcon} />
          }
        </TableCell>
      )
    }
    if (column.key === 'result') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {value === 'Positive'
            ? <img src='/images/svg/status/red_shield.svg' alt='' className={brandClasses.resultStatusIcon} />
            : value === 'Negative'
              ? <img src='/images/svg/status/green_shield.svg' alt='' className={brandClasses.resultStatusIcon} />
              : <img src='/images/svg/status/pending_turquoise.svg' alt='' className={brandClasses.resultStatusIcon} />
          }
        </TableCell>
      )
    }
    if (column.key === 'date') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {moment.utc(value).format('DD/MM/YYYY')}
        </TableCell>
      )
    }
    if (column.key === 'dob') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {moment.utc(value).format('DD/MM/YYYY')}
        </TableCell>
      )
    }
    if (column.key === 'time') {
      return (
        <TableCell key={column.key} align={column.align} className={classes.tableCell}>
          {moment(value, 'HH:mm').format('h:mm A')}
        </TableCell>
      )
    }
    return (
      <TableCell key={column.key} align={column.align} className={classes.tableCell}>
        {value ? value.toString() : ''}
      </TableCell>
    )
  }

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography variant="h3" className={clsx(brandClasses.headerTitle, classes.headerTitle)}>
            {'Custom Report '}
          </Typography>
        </div>

        <div className={classes.root}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step className={classes.stepRoot}>
              <StepLabel>
                <Grid container>
                  <Grid item md={9} className={classes.blueBoxHeader}>
                    <img src="/images/svg/table_icon.svg" alt="select table" />
                    <StepButton onClick={handleStep(0)} completed={completed[0]} style={{ width: 'auto' }}>
                      <Typography variant="h5" >SELECT YOUR TABLE</Typography>
                    </StepButton>
                  </Grid>
                  <Grid item md={3} className={classes.blueBoxHeader}>
                    <Typography variant="h5" >
                      {selectRows === 'Loading'
                        ? <CircularProgress />
                        : selectRows ? `${selectRows + ' ROWS'}` : ''
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                {tablesList
                  ?
                  <RadioGroup
                    value={table}
                    onChange={handleTableChange}
                  >
                    {tablesList.map((table, index) => (
                      <RadioCheckButton label={table} value={table} key={index} />
                    ))}
                  </RadioGroup>
                  :
                  <CircularProgress />
                }
              </StepContent>
            </Step>

            <Step className={classes.stepRoot}>
              <StepLabel>
                <Grid container>
                  <Grid item md={9} className={classes.blueBoxHeader}>
                    <img src="/images/svg/filter_icon2.svg" alt="filter" style={{ width: '18px', marginLeft: '5px', marginRight: '6px' }} />
                    <StepButton onClick={handleStep(1)} disabled={!completed[0]} style={{ width: 'auto' }}>
                      <Typography variant="h5" >FILTER YOUR DATA</Typography>
                    </StepButton>
                  </Grid>
                  <Grid item md={3} className={classes.blueBoxHeader}>
                    <Typography variant="h5" >
                      {completed[1] ? `${filterRows + ' ROWS'}` : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                <Grid container >
                  <Typography variant="h6" className={classes.subTitle}>Only show me rows where</Typography>
                  {formState.filterOptions.map((filterOption, index) => (
                    <Grid container key={index} style={{ margin: 6 }}>
                      <Grid item xs={12} sm={12} className={brandClasses.tableActionBar}>
                        {/* <CustomSelectBox className={classes.selectOption} data={fieldData} /> */}
                        {tableFilterFields && (
                          <FormControl className={brandClasses.shrinkTextField} variant="outlined" style={{ width: 130 }} >
                            <Select
                              onChange={handleFilterChange(index)}
                              name="field"
                              value={filterOption.field || 'Data field'}
                            >
                              <MenuItem value='Data field'>
                                <Typography className={brandClasses.selectPlaceholder}>Data field</Typography>
                              </MenuItem>
                              {tableFilterFields.map((field, index) => (
                                <MenuItem key={index} value={field}>{getFieldName(field)}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                        &nbsp;&nbsp;
                        <FormControl className={brandClasses.shrinkTextField} variant="outlined" style={{ width: 130 }} >
                          <Select
                            onChange={handleFilterChange(index)}
                            name="condition"
                            value={filterOption.condition}
                          >
                            <MenuItem value={'equal'}>Is equal to</MenuItem>
                            <MenuItem value={'not_equal'}>Not equal to</MenuItem>
                            <MenuItem value={'less_than'}>Less than</MenuItem>
                            <MenuItem value={'greater_than'}>Greater than</MenuItem>
                          </Select>
                        </FormControl>
                        &nbsp;&nbsp;
                        <TextField
                          className={clsx(brandClasses.shrinkTextField, classes.inputLabel)}
                          name="value"
                          value={filterOption.value || ''}
                          onChange={handleFilterChange(index)}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid container justify="flex-end" spacing={2}>
                  <Button
                    className={clsx(classes.submitButton, brandClasses.button)}
                    onClick={() => handleAddFilterOption()}
                  >
                    <Add />&nbsp;{'ADD'}
                  </Button>
                  &nbsp;
                  <Button
                    className={clsx(brandClasses.reportBtn, brandClasses.button)}
                    onClick={() => handleRemoveFilterOption()}
                    disabled={!formState.filterOptions.length}
                  >
                    <Close />&nbsp;{'REMOVE'}
                  </Button>
                  &nbsp;
                  <Button
                    className={clsx(brandClasses.reportBtn, brandClasses.button)}
                    onClick={onFilterNext}
                  >
                    {'NEXT'}
                  </Button>
                </Grid>
              </StepContent>
            </Step>

            <Step className={classes.stepRoot}>
              <StepLabel>
                <Grid container>
                  <Grid item md={9} className={classes.blueBoxHeader}>
                    <img src="/images/svg/circle_s.svg" alt="circle_s" style={{ width: '22px', marginLeft: '5px', marginRight: '5px' }} />
                    <StepButton onClick={handleStep(2)} disabled={!completed[1]} style={{ width: 'auto' }}>
                      <Typography variant="h5" >SUMMARIZE</Typography>
                    </StepButton>
                  </Grid>
                  <Grid item md={3} className={classes.blueBoxHeader}>
                    <Typography variant="h5" >
                      {summarizeColumns && completed[2] ? `${csvHeaders.length + ' COLUMNS'}` : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                <Grid container >
                  <Typography variant="h6" className={classes.subTitle}>Only show me columns</Typography>
                  <Grid item container spacing={1}>
                    {summarizeColumns && (
                      summarizeColumns.map((col, index) => (
                        <Grid item xs={12} sm={3} key={index}>
                          <CheckButton
                            checked={col.export}
                            label={col.label}
                            name={col.name}
                            onChange={handleSummarizeColumnsChange(index)}
                          />
                        </Grid>
                      ))
                    )}
                  </Grid>
                </Grid>
                <Grid container justify="flex-end">
                  <Button
                    className={clsx(brandClasses.reportBtn, brandClasses.button)}
                    onClick={onSummarizeNext}
                  >
                    {'NEXT'}
                  </Button>
                </Grid>
              </StepContent>
            </Step>

            <Step className={classes.stepRoot}>
              <StepLabel>
                <Grid container>
                  <Grid item md={9} className={classes.blueBoxHeader}>
                    <img src="/images/svg/table_icon.svg" alt="select table" />
                    <StepButton onClick={handleStep(3)} disabled={!completed[2]} style={{ width: 'auto' }}>
                      <Typography variant="h5" >RESULTS TABLE</Typography>
                    </StepButton>
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                <div className={classes.footer}>
                  <SearchBar className={brandClasses.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} />
                  <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div>
                  &ensp;&ensp;
                  <Button
                    className={clsx(classes.submitButton, brandClasses.button)}
                    onClick={() => onClickExportButton()}
                  >
                    <Download /> &nbsp; {'EXPORT'}
                  </Button>
                  <CSVLink
                    data={tableFilteredData}
                    headers={csvHeaders}
                    filename={"custom.csv"}
                    className={clsx(classes.submitButton, brandClasses.button)}
                    style={{ display: 'none' }}
                    // ref={csvLinkRef}
                    id="csvLinkBtn"
                  >
                    {'EXPORT'}
                  </CSVLink>
                </div>
                <div className={classes.tableContainer}>
                  <TableContainer >
                    <Table stickyHeader aria-label="sticky table" className={classes.table}>
                      <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        headers={csvHeaders}
                        // onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={tableFilteredData.length}
                      />
                      <TableBody>
                        {!tableFilteredData.length
                          ?
                          <TableRow>
                            <TableCell colSpan={csvHeaders.length} align="center">
                              {'No data to display...'}
                            </TableCell>
                          </TableRow>
                          :
                          stableSort(tableFilteredData, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                              return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index} className={index % 2 !== 0 ? '' : classes.tableRow1}>
                                  {csvHeaders.map((column) => {
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
                    count={tableFilteredData.length}
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
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
}

CustomReport.propTypes = {
  getReportingCustom: PropTypes.func.isRequired
}

export default connect(null, { getReportingCustom, })(CustomReport);