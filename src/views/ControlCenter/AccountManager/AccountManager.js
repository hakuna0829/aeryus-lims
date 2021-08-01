import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Visibility from '@material-ui/icons/Visibility';
import brandStyles from 'theme/brand';
import { getAccounts, updateAccount } from 'actions/api';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import CustomTable from 'components/CustomTable';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
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
    marginLeft: 8
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  activateButton: {
    color: theme.palette.brandGreen,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGreen}`,
    borderRadius: '8px',
    textTransform: 'none',
  },
  deactivateButton: {
    color: theme.palette.brandGray,
    backgroundColor: theme.palette.white,
    border: `0.75px solid ${theme.palette.brandGray}`,
    borderRadius: '8px',
    textTransform: 'none',
  },
  visibilityIcon: {
    color: theme.palette.brandDark
  },
}));

// const columns = ['Name', 'Location', 'Department', 'Role', 'Phone Number', 'Email', 'Status', 'View More'];

const metaData = [
  { key: 'name', label: 'Name', align: 'left', sortable: true },
  { key: 'location', label: 'Location', align: 'left', sortable: true },
  { key: 'department', label: 'Department', align: 'left', sortable: true },
  { key: 'role_id', label: 'Role', align: 'left', sortable: true },
  { key: 'phone', label: 'Phone Number', align: 'left', sortable: true },
  { key: 'email', label: 'Email', align: 'left', sortable: true },
  { key: 'active', label: 'Status', align: 'center', sortable: true },
  { key: 'view_more', label: 'View More', align: 'center', sortable: false },
];

const AccountManager = (props) => {
  const { getAccounts, showFailedDialog, showErrorDialog } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(true);
  const [accountsList, setAccountsList] = useState([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    console.log('AccountManager useEffect');
    fetchAccouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, order, orderBy]);

  const fetchAccouts = async () => {
    let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
    setLoading(true);
    let res = await getAccounts(queryParams);
    setLoading(false);
    if (res.success) {
      setAccountsList(res.data);
      setCount(res.count);
    }
    // getAccounts().then(res => {
    //   setLoading(false);
    //   if (res.data.success) {
    //     setAccountsList(res.data.data);
    //   } else {
    //     showFailedDialog(res);
    //   }
    // }).catch(error => {
    //   setLoading(false);
    //   showErrorDialog(error);
    // });
  }

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const handleDeactivate = (id) => {
    setLoading(true);
    updateAccount(id, { active: false }).then(res => {
      if (res.data.success) {
        fetchAccouts();
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      showErrorDialog(error);
    });
  };

  const handleActivate = (id) => {
    setLoading(true);
    updateAccount(id, { active: true }).then(res => {
      if (res.data.success) {
        fetchAccouts();
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      showErrorDialog(error);
    });
  };

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'name') {
      return (
        <span>{`${row.last_name}, ${row.first_name}`}</span>
      );
    }
    if (column.key === 'role_id') {
      return (
        <span>{value ? value.name : ''}</span>
      );
    }
    if (column.key === 'active') {
      return row.active
        ? <Button size="small" className={classes.deactivateButton} onClick={() => handleDeactivate(row._id)}>Deactivate</Button>
        : <Button size="small" className={classes.activateButton} onClick={() => handleActivate(row._id)}>Activate</Button>
    }
    if (column.key === 'view_more') {
      return (
        <Link to={`/control-center/account-details?account_id=${row._id}`}>
          <Visibility className={classes.visibilityIcon} />
        </Link>
      )
    }
    return (
      <span>{value}</span>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <img src="/images/svg/settings_icon-1.svg" alt="" />&ensp;
          <Typography variant="h2" className={brandClasses.headerTitle}>
            Control Center |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>ACCOUNTS</Typography>
        </div>
        <Button variant="contained" component={Link} to="/control-center/add-account" className={classes.greenBtn}>
          <AddIcon />  Add Account
        </Button>
      </div>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={accountsList}
        count={count}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />

      {/* <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ?
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
                :
                !accountsList.length
                  ?
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  :
                  accountsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      hover
                      className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}
                    >
                      <TableCell>
                        {account.last_name}, {account.first_name}
                      </TableCell>
                      <TableCell>
                        {account.location}
                      </TableCell>
                      <TableCell>
                        {account.department}
                      </TableCell>
                      <TableCell>
                        {account.role_id ? account.role_id.name : null}
                      </TableCell>
                      <TableCell>
                        {account.phone}
                      </TableCell>
                      <TableCell>
                        {account.email}
                      </TableCell>
                      <TableCell>
                        {account.active
                          ? <Button size="small" className={classes.deactivateButton} onClick={() => handleDeactivate(account._id)}>Deactivate</Button>
                          : <Button size="small" className={classes.activateButton} onClick={() => handleActivate(account._id)}>Activate</Button>
                        }
                      </TableCell>
                      <TableCell align="center">
                        <Link to={`/control-center/account-details?account_id=${account._id}`}>
                          <Visibility className={classes.visibilityIcon} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={accountsList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper> */}
    </div>
  );
};

AccountManager.propTypes = {
  getAccounts: PropTypes.func.isRequired,
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
};

export default connect(null, { getAccounts, showFailedDialog, showErrorDialog })(AccountManager);