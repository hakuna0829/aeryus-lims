import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  CircularProgress,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

function EnhancedTableHead(props) {
  const { metaData, order, orderBy, onRequestSort } = props;

  const brandClasses = brandStyles();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {metaData.map((headCell, index) => (
          <TableCell
            key={index}
            sortDirection={orderBy === headCell.key ? order : false}
            align={headCell.align ? headCell.align : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            style={{ minWidth: headCell.minWidth }}
            className={brandClasses.tableHead}
          > 
            {!headCell.sortable
              ?
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
            {headCell.tooltip ? <Tooltip title={headCell.tooltipdata} placement="right-end">
            <HelpOutlineIcon  style={{color:"#043B5D",fontSize:"16px"}} />
          </Tooltip>  : ''}
          </TableCell>
       
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  metaData: PropTypes.array.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(2),
    position: 'relative'
  },
  container: {
    // maxHeight: 440,
  },
  tbodyBlur: {
    '-webkit-filter': 'blur(5px)',
    '-moz-filter': 'blur(5px)',
    '-o-filter': 'blur(5px)',
    '-ms-filter': 'blur(5px)',
  },
  spinner: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: 9
  },
  cellDiv: {
    padding: '3px 8px',
    color: theme.palette.brand
  }
}));

// eslint-disable-next-line react/no-multi-comp
const CustomTable = (props) => {
  const {
    metaData,
    loading,
    CustomTableData,
    data,
    count,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    className,
    dense,
    ExpandableRow,
    hover
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={clsx(classes.root, className)}>
      <Paper>
        {loading &&
          <CircularProgress
            className={clsx(loading && classes.spinner)}
          />
        }
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              metaData={metaData}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody
              className={clsx(loading && classes.tbodyBlur)}
            >
              {!data.length
                ?
                <TableRow>
                  <TableCell colSpan={metaData.length} align="center">
                    {'No data to display...'}
                  </TableCell>
                </TableRow>
                :
                data.map((row, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow
                        hover = { hover === false ? false : true}
                        className={index % 2 !== 0 ? '' : brandClasses.tableRow2}
                      >
                        {metaData.map((column, index) => {
                          return (
                            <TableCell key={index}
                              align={column.align}
                              className={clsx(classes.cellDiv, column.cellStyle)}>
                              <CustomTableData
                                column={column}
                                row={row}
                              />
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {ExpandableRow &&
                        <ExpandableRow
                          row={row}
                          open={row.open}
                        />
                      }
                    </React.Fragment>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100, 1000]}
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div >
  );
};

CustomTable.propTypes = {
  metaData: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  CustomTableData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  setOrder: PropTypes.func.isRequired,
  orderBy: PropTypes.string.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  className: PropTypes.any,
  ExpandableRow: PropTypes.func,
  hover:PropTypes.bool
};

export default CustomTable;