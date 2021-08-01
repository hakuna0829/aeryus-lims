import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Grid,
  IconButton,
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import moment from "moment";
import { searchOrders, getOrders } from 'actions/api';
import SearchBar from 'components/SearchBar';
import OrderDetails from '../OrderDetails';
import CustomTable from 'components/CustomTable';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    // paddingLeft: theme.spacing(2)
  },
  header: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  pageTitle: {
    color: theme.palette.blueDark,
  },
  calendar: {
    margin: '0 auto'
  },
  cellDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '160px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('lg')]: {
      width: '120px',
    },
  },
  detailsIcon: {
    padding: 0,
    paddingLeft: 10
  }
}));

// const headCells = [
//   { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
//   { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
//   { id: 'order_number', numeric: false, disablePadding: true, label: 'Order Number' },
//   { id: 'test_type', numeric: false, disablePadding: true, label: 'Test Type' },
//   { id: 'location', numeric: false, disablePadding: true, label: 'Location' },
//   { id: 'date', numeric: false, disablePadding: false, label: 'Date Received' },
//   { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
//   { id: 'detail', numeric: false, disablePadding: false, label: 'Detail' },
// ];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }
// function EnhancedTableHead(props) {
//   const { order, orderBy, onRequestSort } = props;
//   const brandClasses = brandStyles();
//   // const classes = useStyles();

//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             // align={headCell.numeric ? 'right' : 'left'}
//             padding={headCell.disablePadding ? 'none' : 'default'}
//             sortDirection={orderBy === headCell.id ? order : false}
//             align={headCell.id === 'detail' || headCell.id === 'status' ? 'center' : 'left'}
//             className={brandClasses.tableHead}
//           >
//             {headCell.id === 'status' || headCell.id === 'detail' ?
//               headCell.label
//               :
//               <TableSortLabel
//                 active={orderBy === headCell.id}
//                 direction={orderBy === headCell.id ? order : 'asc'}
//                 onClick={createSortHandler(headCell.id)}
//                 classes={{
//                   icon: brandClasses.tableSortLabel,
//                   active: brandClasses.tableSortLabel
//                 }}
//               >
//                 {headCell.label}
//               </TableSortLabel>
//             }
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

const metaData = [
  { key: 'last_name', label: 'Last Name', align: 'left', sortable: true },
  { key: 'first_name', label: 'First Name', align: 'left', sortable: true },
  { key: 'testing_order_id', label: 'Order Number', minWidth: 200, align: 'left', sortable: true },
  { key: 'testing_test_type', label: 'Test Type', minWidth: 120, align: 'left', sortable: true },
  { key: 'location_name', label: 'Location', align: 'left', sortable: true },
  { key: 'submitted_timestamp', label: 'Date Received', align: 'left', sortable: true },
  { key: 'status', label: 'Status', align: 'center', sortable: true },
  { key: 'detail', label: 'Detail', align: 'center', sortable: false },
];

const Content = (props) => {
  const { refetch, setRefetch, getOrders, searchOrders } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  useEffect(() => {
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      let res = {};
      setLoading(true);
      if (submittedSearch.length)
        res = await searchOrders({ search_string: submittedSearch }, queryParams);
      else
        res = await getOrders(queryParams);
      setLoading(false);

      if (res.success) {
        setOrdersList(res.data);
        setCount(res.count);
      }
    })();
    // eslint-disable-next-line
  }, [refetch, submittedSearch, page, rowsPerPage, order, orderBy]);

  const handleSearchSubmit = async (str) => {
    setPage(0);
    setSubmittedSearch(str);
    // if (searchString.length) {
    //   setSearchLoading(true);
    //   let res = await searchOrders({ search_string: searchString });
    //   setSearchLoading(false);
    //   if (res.success) {
    //     setOrdersList(res.data);
    //   }
    // } else {
    //   setOrdersList(tempOrdersList);
    // }
  };

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const onViewDetails = (data) => {
    setSelectedOrder(data);
    setDetailsDialogOpen(true);
  }

  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'last_name') {
      return (
        <span>{row.dependent_id ? row.dependent_id.last_name : row.user_id.last_name}</span>
      );
    }
    if (column.key === 'first_name') {
      return (
        <span>{row.dependent_id ? row.dependent_id.first_name : row.user_id.first_name}</span>
      );
    }
    if (column.key === 'testing_order_id') {
      return (
        <span>{row.testing_id.testkit_id}</span>
      );
    }
    if (column.key === 'testing_test_type') {
      return (
        <span>{row.testing_id.test_type}</span>
      );
    }
    if (column.key === 'location_name') {
      return (
        <span>{row.location_id.name}</span>
      );
    }
    if (column.key === 'submitted_timestamp') {
      return (
        <span>{row.submitted_timestamp ? moment.utc(row.submitted_timestamp).format('MM/DD/YYYY') : ''}</span>
      );
    }
    if (column.key === 'status') {
      return row.status === 'Resulted'
        ? <img src='/images/svg/status/resulted_icon.svg' alt='' className={classes.statusIcon} />
        : row.status === 'Failed'
          ? <img src='/images/svg/status/caution-sign.svg' height={24} alt='' className={classes.statusIcon} />
          : <img src='/images/svg/status/Processing_icon.svg' alt='' className={classes.statusIcon} />
    }
    if (column.key === 'detail') {
      return (
        <div className={brandClasses.actionContainer}>
          <IconButton className={classes.detailsIcon} onClick={() => onViewDetails(row)} >
            <img src='/images/svg/document_icon.svg' alt='Edit' />
          </IconButton>
          <IconButton className={classes.detailsIcon} onClick={() => onViewDetails(row)} >
            <img src='/images/svg/status/label.svg' alt='View' />
          </IconButton>
        </div>
      )
    }
    return (
      <span>{value}</span>
    )
  }

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={0}>
        <Grid item xs={12} sm={3} className={classes.header}>
          <Typography variant="h3" className={brandClasses.headerTitle}>TEST TRACKER</Typography>
        </Grid>
        <Grid item xs={12} sm={9} className={brandClasses.tableActionBar2}>
          <SearchBar
            handleSearchSubmit={handleSearchSubmit}
          />
        </Grid>
      </Grid>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={ordersList}
        count={count}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        dense={true}
      />

      {/* <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" className={classes.table}>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={headCells.length}
            />
            <TableBody>
              {(loading || searchLoading)
                ?
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
                :
                !ordersList.length
                  ?
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      {'No data to display...'}
                    </TableCell>
                  </TableRow>
                  : stableSort(ordersList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={index} className={index % 2 === 0 ? brandClasses.tableRow1 : ''}>
                          <TableCell className={brandClasses.tableCell}>
                            {row.dependent_id ? row.dependent_id.last_name : row.user_id.last_name}
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            {row.dependent_id ? row.dependent_id.first_name : row.user_id.first_name}
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            {row.testing_id.testkit_id}
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            {row.testing_id.test_type}
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            {row.location_id.name}
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            {row.submitted_timestamp ? moment.utc(row.submitted_timestamp).format('MM/DD/YYYY') : ''}
                          </TableCell>
                          <TableCell align="center" className={brandClasses.tableCell}>
                            {row.status === 'Resulted'
                              ? <img src='/images/svg/status/resulted_icon.svg' alt='' className={classes.statusIcon} />
                              : row.status === 'Failed'
                                ? <img src='/images/svg/status/caution-sign.svg' height={24} alt='' className={classes.statusIcon} />
                                : <img src='/images/svg/status/Processing_icon.svg' alt='' className={classes.statusIcon} />
                            }
                          </TableCell>
                          <TableCell className={brandClasses.tableCell}>
                            <div className={brandClasses.actionContainer}>
                              <IconButton className={classes.detailsIcon} onClick={() => onViewDetails(row)} >
                                <img src='/images/svg/document_icon.svg' alt='Edit' />
                              </IconButton>
                              <IconButton className={classes.detailsIcon} onClick={() => onViewDetails(row)} >
                                <img src='/images/svg/status/label.svg' alt='View' />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={ordersList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          classes={{
            root: brandClasses.tablePagination,
            caption: brandClasses.tablePaginationCaption,
            selectIcon: brandClasses.tablePaginationSelectIcon,
            select: brandClasses.tablePaginationSelect,
            actions: brandClasses.tablePaginationActions,
          }}
        />
      </Paper> */}

      <OrderDetails
        selectedOrder={selectedOrder}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        setRefetch={setRefetch}
      />
    </div>
  );
};

Content.propTypes = {
  getOrders: PropTypes.func.isRequired,
  searchOrders: PropTypes.func.isRequired,
};

export default connect(null, { getOrders, searchOrders })(Content);