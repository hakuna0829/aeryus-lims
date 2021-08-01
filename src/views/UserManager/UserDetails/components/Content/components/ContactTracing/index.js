import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  // Paper,
  TablePagination,
  // CircularProgress
} from '@material-ui/core';

import brandStyles from 'theme/brand';
// import { Link } from 'react-router-dom';
// import Visibility from '@material-ui/icons/Visibility';
import SearchBar from '../../../../../../../layouts/Main/components/SearchBar';
import TuneIcon from '@material-ui/icons/Tune';

export const appointments = [
  {
    title: 'Serology',
    startDate: new Date(2020, 7, 23, 9, 30),
    endDate: new Date(2020, 7, 23, 11, 30),
    status: true,
  }, {
    title: 'Serology',
    startDate: new Date(2020, 7, 24, 12, 0),
    endDate: new Date(2020, 7, 24, 13, 0),
    status: true,
  }, {
    title: 'Serology',
    startDate: new Date(2020, 7, 28, 14, 30),
    endDate: new Date(2020, 7, 28, 15, 30),
    status: false,
  }, {
    title: 'Serology',
    startDate: new Date(2020, 7, 14, 10, 0),
    endDate: new Date(2020, 7, 14, 11, 0),
    status: true,
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: `${theme.spacing(1)}px`,
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  tableRoot: {
    marginTop: theme.spacing(4)
  }
}));
const columns = [
  { id: 'location', label: 'Location', minWidth: 100 },
  { id: 'address', label: 'Address', minWidth: 100 },
  { id: 'entry_date', label: 'Entry Date', minWidth: 100 },
  { id: 'entry_time', label: 'Entry Time', minWidth: 100 },
];

const contractsListTest = [
  // { id: 1, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12345', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 2, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12345', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 3, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12349', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 4, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12345', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 5, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12346', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 6, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12345', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 7, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12342', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 8, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12345', entryDate: 'June 30', entryTime:'09:00' },
  // { id: 9, location: 'The Preserve at PalmAire', address:'123 Any Street  |  Any Town  |  ST  |  12348', entryDate: 'June 30', entryTime:'09:00' },

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

        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={headCell.label !== 'Address' ? { minWidth: 120 } : { width: '30%' } }
            align={headCell.label === 'Location' ? "left" : "center"}
            className={brandClasses.tableHead2}
            // sortDirection={headCell === headCell.id ? order : false}
          >
            {headCell.id === 'status' || headCell.id === 'viewmore' ? 
              headCell.label
            :
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

const ContactTracing = () => {

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [contractsList] = useState(contractsListTest);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const [data] = useState(appointments);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onClickSearchInput = (event) => {
    console.log('isOpen', isOpen, event);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <img src="/images/svg/status/users_icon.svg" alt="" />
          {'User Manager'} |
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>CONTACT TRACING</Typography>
      </div>
      <div className={brandClasses.subHeader}>
        <Grid container className={classes.container} spacing={0}>
          <Grid item xs={12} sm={5} className={classes.header}>
            <Typography variant="h4" >TRACING HISTORY</Typography>
          </Grid>
          <Grid item xs={12} sm={7} className={brandClasses.tableActionBar2}>
            <SearchBar className={brandClasses.searchBar} onClick={onClickSearchInput} toggleOpen={setIsOpen} isOpen={isOpen} />
            <div className={brandClasses.settingIconBox}><TuneIcon className={brandClasses.settingIcon} /></div>
          </Grid>
        </Grid>
      </div>

      {/* <Paper className={classes.tableRoot}> */}
        <TableContainer>
          <Table>
            {/* <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    style={column.label !== 'Entry Time' ? { minWidth: 120 } : { width: '50%' } }
                    align={column.label === 'Location' ? "left" : "center"}
                    className={brandClasses.tableHead2}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead> */}

            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={contractsList.length}
            />
            <TableBody>
              {!contractsList.length
                ?
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {'No data to display...'}
                  </TableCell>
                </TableRow>
                :
                stableSort(contractsList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    hover
                    className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}
                  >
                    <TableCell style={{ minWidth: 120 }} className={brandClasses.tableCell2} align="left">
                      {account.location}
                    </TableCell>
                    <TableCell 
                    style={{ minWidth: 120, 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden' }} 
                        className={brandClasses.tableCell2} align="center">
                      {account.address}
                    </TableCell>
                    <TableCell style={{ minWidth: 120 }} className={brandClasses.tableCell2} align="center">
                      {account.entryDate}
                    </TableCell>
                    <TableCell style={{ minWidth: 120 }} className={brandClasses.tableCell2} align="center">
                      {account.entryTime}
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
          count={contractsList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      {/* </Paper> */}
    </div>
  );
};

export default ContactTracing;
