import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Dialog,
  DialogContent,
  withStyles,
  Box
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import brandStyles from 'theme/brand';
// import clsx from 'clsx';
import Actions from './Actions';

function createData(id, createdDate, frequency, creator, action) {
  return { id, createdDate, frequency, creator, action };
}

const rows = [
  createData(1, '06/14/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(2, '01/25/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(3, '02/15/2021', 'Daily: Every 2 days', 'Cindi', ''),
  createData(4, '03/05/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(5, '02/10/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(6, '02/18/2021', 'Daily: Every 2 days', 'Cindi', ''),
  createData(7, '01/25/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(8, '07/15/2021', 'Daily: Every 2 days', 'Cindi', ''),
  createData(9, '06/15/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(10, '05/15/2021', 'Daily: Every 2 days', 'Nicholus Andrew', ''),
  createData(11, '02/15/2021', 'Daily: Every 2 days', 'Nicholus Andrew', '')
];

const headCells = [
  {
    id: 'createdDate',
    numeric: false,
    disablePadding: true,
    label: 'Date created',
  },
  {
    id: 'frequency',
    numeric: false,
    disablePadding: false,
    label: 'Frequency'
  },
  { id: 'creator', numeric: false, disablePadding: false, label: 'Created By' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Actions', align:'center' }
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
  return stabilizedThis.map(el => el[0]);
}

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const brandClasses = brandStyles();
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            classes={{root:classes.checkboxRoot, checked:classes.checkboxChecked}}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            inputProps={{ 'aria-label': 'select all desserts' }}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            align={headCell.align ? headCell.align : 'left'}
            key={headCell.id}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              classes={{
                icon: brandClasses.tableSortLabel,
                active: brandClasses.tableSortLabel
              }}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      className={classes.root}
      disableTypography
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: `0px ${theme.spacing(2)}px ${theme.spacing(2)}px`
  },
  rootTable: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  headerTitle: {
    marginLeft: theme.spacing(4),
    color: theme.palette.brandText,
    fontSize: 24
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px`,
    // marginBottom: theme.spacing(2),
    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  headerSubTitle: {
    fontSize: '24px',
    color: theme.palette.brandText,
    textTransform: 'uppercase',
    marginLeft: 8
  },
  description: {
    color: theme.palette.brandGreen,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '24px',
    paddingBottom: 24
  },
  cellDiv: {
    padding: '2px 2px'
  },
  checkboxRoot:{
    padding: '4px 9px',
    color:theme.palette.brandDark
  },
  checkboxChecked:{
    color:`${theme.palette.blueDark} !important`
  },
}));

// eslint-disable-next-line react/no-multi-comp
const ViewAlert = props => {
  const { dialogOpen, onDialogClose } = props;
  //   const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const brandClasses = brandStyles();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //   const [formState, setFormState] = useState({});

  const handleClose = () => {
    onDialogClose();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    console.log('property', property);
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    console.log('new page', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const onEditUser = id => {
    console.log('edit click');
  };

  const handleDelete = (id, name) => {
    console.log('delete click');
  };
  return (
    <Dialog
      fullWidth
      maxWidth={'md'}
      onClose={handleClose}
      open={dialogOpen}
    >
      <DialogTitle onClose={handleClose}>
        <div className={classes.header}>
          <Box>
            <Typography
              className={brandClasses.headerTitle2}
              variant="h2"
            >
              <img
                alt=""
                src="/images/svg/mailbox.svg"
                style={{ width: 35 }}
              />
              TESTD ALERTS |
            </Typography>
            <Typography
              className={classes.headerSubTitle}
              variant="h4"
            >
              VIEW ALERTS
            </Typography>
          </Box>
        </div>
      </DialogTitle>
      <DialogContent>
        <Box
          alignItems="center"
          display="flex"
          mb={2}
        >
          <img
            alt=""
            src="/images/svg/alerts/system/new_department_added.svg"
            width={60}
          />
          <Typography className={classes.addedLabel}>
            A new department has been added
          </Typography>
        </Box>
        <Paper className={classes.paper}>
          {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
          <TableContainer className={classes.container}>
            <Table
              aria-label="enhanced table"
              aria-labelledby="tableTitle"
              className={classes.table}
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                order={order}
                orderBy={orderBy}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        aria-checked={isItemSelected}
                        className={
                          index % 2 !== 0 ? '' : brandClasses.tableRow2
                        }
                        hover
                        key={row.id}
                        onClick={event => handleClick(event, row.id)}
                        role="checkbox"
                        selected={isItemSelected}
                        tabIndex={-1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            classes={{root:classes.checkboxRoot, checked:classes.checkboxChecked}}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.cellDiv}
                          component="th"
                          id={labelId}
                          padding="none"
                          scope="row"
                        >
                          {row.createdDate}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.cellDiv}
                        >
                          {row.frequency}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.cellDiv}
                        >
                          {row.creator}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={classes.cellDiv}
                        >
                          <Actions
                            handleDelete={() =>
                              handleDelete(row.id, row.creator)
                            }
                            handleEdit={() => onEditUser(row.id)}
                            // handleView={() => handleView(user._id)}
                            userActive
                            user_id={row.id}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rows.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

ViewAlert.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired
};

export default ViewAlert;
