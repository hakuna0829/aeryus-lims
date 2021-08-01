import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import moment from "moment";
import { getSessionsByAccountId } from 'actions/api';
import CustomTable from 'components/CustomTable';

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(3),
  },
  headerTitle: {
    color: theme.palette.brandText,
  }
}));

const metaData = [
  { key: 'ip_address', label: 'IP Address', align: 'left', sortable: true },
  { key: 'device', label: 'User Agent', align: 'left', sortable: true },
  { key: 'login_time', label: 'Last Active', align: 'left', sortable: true },
  { key: 'status', label: 'Status', align: 'center', sortable: true },
];

const Sessions = (props) => {
  const { getSessionsByAccountId, account_id } = props;

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [sessionsList, setSessionsList] = useState([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    console.log('Sessions useEffect');
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      setLoading(true);
      let res = await getSessionsByAccountId(account_id, queryParams);
      setLoading(false);
      if (res.success) {
        setSessionsList(res.data);
        setCount(res.count);
      }
    })();
    // eslint-disable-next-line
  }, [account_id, page, rowsPerPage, order, orderBy]);

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'login_time') {
      return (
        <span>{value && moment.utc(value).format('MMM DD, YYYY HH:mm')}</span>
      );
    }
    return (
      <span>{value}</span>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h3" className={classes.headerTitle}>
          SESSIONS
        </Typography>
      </div>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={sessionsList}
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
                !sessionsList.length
                  ?
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  :
                  sessionsList.map((session, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      hover
                      className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}
                    >
                      <TableCell>
                        {session.ip_address}
                      </TableCell>
                      <TableCell>
                        {session.device}
                      </TableCell>
                      <TableCell>
                        {moment(session.login_time).format('MMM DD, YYYY HH:mm')}
                      </TableCell>
                      <TableCell>
                        {session.status}
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100, 1000]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper> */}
    </div>
  );
};

Sessions.propTypes = {
  getSessionsByAccountId: PropTypes.func.isRequired,
  account_id: PropTypes.string.isRequired
};

export default connect(null, { getSessionsByAccountId })(Sessions);