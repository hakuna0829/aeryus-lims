import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography, MenuItem, Select, InputLabel, FormControl, Grid, CircularProgress, TextField, Button, IconButton } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import { getAudits, searchAudits, searchAccounts } from 'actions/api';
import CustomTable from 'components/CustomTable';
import brandStyles from 'theme/brand';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchBar from 'components/SearchBar';
import AuditDetails from './AuditDetails';
import { Document } from 'icons';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
  },
  headerGrid: {
    padding: theme.spacing(2),
  },
  headerTitle: {
    color: theme.palette.brandText,
  },
  customTable: {
    marginTop: 20
  },
  documentIcon: {
    color: theme.palette.blueDark,
    [theme.breakpoints.down(1200)]: {
      marginLeft: 5,
      width: 20
    },
  },
  detailsIcon: {
    padding: 0
  }
}));

const dates = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'This Year', 'Last Year'];
const components = [
  { key: 'Clients', label: 'Clients' },
  { key: 'Roles', label: 'Roles' },
  { key: 'Accounts', label: 'Accounts' },
  { key: 'Locations', label: 'Locations Manager' },
  { key: 'Departments', label: 'Departments Manager' },
  { key: 'PopulationSettings', label: 'Population Manager' },
  { key: 'Users', label: 'Users' },
  { key: 'Dependents', label: 'Dependents' },
  { key: 'Patients', label: 'Patient Intake' },
  { key: 'Schedules', label: 'Schedules/Appointments' },
  { key: 'Testings', label: 'Testing' },
  { key: 'Orders', label: 'Lab Orders' },
  { key: 'Inventory', label: 'Inventory' },
  { key: 'Reports', label: 'Reporting' },
];

const metaData = [
  { key: 'timestamp', label: 'Action Time', align: 'left', sortable: true },
  { key: 'component', label: 'Component', align: 'left', sortable: true },
  { key: 'action', label: 'Action', align: 'left', sortable: true },
  { key: 'summary', label: 'Summary', align: 'left', sortable: true },
  { key: 'details', label: 'Details', align: 'center', sortable: false },
];

const AuditHistory = (props) => {
  const { getAudits, searchAudits, searchAccounts } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({ date: 'Today' });
  const [loading, setLoading] = useState(false);
  const [auditsList, setAuditsList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  // useEffect(() => {
  //   (async () => {
  //     setFetchLoading(true);
  //     let res = await getAccounts();
  //     setFetchLoading(false);
  //     if (res.success) {
  //       setAccountsList(res.data);
  //     }
  //   })();
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      if (formState.date)
        queryParams += `&date=${formState.date}`;
      if (formState.components)
        queryParams += `&components=${formState.components}`;
      if (formState.account_ids)
        queryParams += `&account_ids=${formState.account_ids}`;

      let res = {};
      setLoading(true);
      if (submittedSearch.length)
        res = await searchAudits({ search_string: submittedSearch }, queryParams);
      else
        res = await getAudits(queryParams);
      setLoading(false);

      if (res.success) {
        setAuditsList(res.data);
        setCount(res.count);
      }
    })();
    // eslint-disable-next-line
  }, [refetch, submittedSearch, page, rowsPerPage, order, orderBy]);

  const doSearch = async (text) => {
    if (!text || !text.length) return;
    let queryParams = `rowsPerPage=${100}`;    
    setFetchLoading(true);
    let res = await searchAccounts({ search_string: text }, queryParams);
    setFetchLoading(false);
    if (res.success) {
      setAccountsList(res.data);
    }
  }

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearchSubmit = async (str) => {
    setPage(0);
    setSubmittedSearch(str);
  };

  const handleAccountsAutoCompleteChange = (e, values) => {
    setFormState(formState => ({
      ...formState,
      account_ids: values.map(v => (v._id))
    }));
  };

  const handleComponentsAutoCompleteChange = (e, values) => {
    setFormState(formState => ({
      ...formState,
      components: values.map(v => v.key)
    }));
  };

  const onViewDetails = (data) => {
    setSelectedRecord(data);
    setDetailsDialogOpen(true);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setRefetch(refetch => refetch + 1);
  };

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'timestamp') {
      return (
        <span>{value && moment.utc(value).format('MMM DD, YYYY HH:mm')}</span>
      );
    }
    if (column.key === 'details') {
      return (
        <IconButton className={classes.detailsIcon} onClick={() => onViewDetails(row)} >
          {/* <img src='/images/svg/document_icon.svg' alt='Edit' /> */}
          <Document className={classes.documentIcon} />
        </IconButton>
      )
    }
    return (
      <span>{value}</span>
    )
  }

  return (
    <div className={classes.root}>
      <form
        onSubmit={handleSubmit}
      >
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='center'
          className={classes.headerGrid}
        >
          <Grid item xs={12} sm={3} className={brandClasses.padding8}>
            <FormControl
              className={brandClasses.shrinkTextField}
              required
              fullWidth
              variant='outlined'
            >
              <InputLabel shrink className={brandClasses.selectShrinkLabel}>Date</InputLabel>
              <Select
                onChange={handleChange}
                label='Date* '
                name='date'
                displayEmpty
                value={formState.date || ''}
              >
                <MenuItem value=''>
                  <Typography className={brandClasses.selectPlaceholder}>Select Date</Typography>
                </MenuItem>
                {dates.map((date, index) => (
                  <MenuItem key={index} value={date}>{date}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={brandClasses.padding8}>
            <Autocomplete
              multiple
              options={accountsList}
              loading={fetchLoading}
              getOptionLabel={option =>
                `${option.last_name} ${option.first_name}`
              }
              className={brandClasses.shrinkTextField}
              onChange={handleAccountsAutoCompleteChange}
              onInputChange={_.debounce((_, value) => doSearch(value), 500)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Accounts'
                  name='accounts'
                  placeholder='All Accounts'
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {fetchLoading ? (
                          <CircularProgress color='inherit' size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={brandClasses.padding8}>
            <Autocomplete
              multiple
              options={components}
              getOptionLabel={option => option.label}
              className={brandClasses.shrinkTextField}
              onChange={handleComponentsAutoCompleteChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Components'
                  placeholder='All Components'
                  variant='outlined'
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: params.InputProps.endAdornment
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={2}>
            <Button
              className={brandClasses.button}
              classes={{ disabled: brandClasses.buttonDisabled }}
              disabled={loading}
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid container direction='row' justify='space-between' alignItems='center' style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Grid item>
          {/* <Typography className={brandClasses.headerTitle}>Audit History</Typography> */}
          <SearchBar
            handleSearchSubmit={handleSearchSubmit}
          />
        </Grid>
        <Grid item>
        </Grid>
      </Grid>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={auditsList}
        count={count}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        className={classes.customTable}
      />

      <AuditDetails
        selectedRecord={selectedRecord}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
      />
    </div>
  );
};

AuditHistory.propTypes = {
  getAudits: PropTypes.func.isRequired,
  searchAudits: PropTypes.func.isRequired,
  searchAccounts: PropTypes.func.isRequired
};

export default connect(null, { getAudits, searchAudits, searchAccounts })(AuditHistory);