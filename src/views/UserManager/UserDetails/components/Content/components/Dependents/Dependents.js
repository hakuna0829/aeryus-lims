import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography, Table, TableHead, TableBody, TableSortLabel, TableRow, TableCell, TableContainer, TablePagination, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@material-ui/core';
import moment from "moment";
import brandStyles from 'theme/brand';
import ResultsSummary from 'views/LabManager/Dialog/ResultsSummary';
// import SearchBar from 'layouts/Main/components/SearchBar';
// import TuneIcon from '@material-ui/icons/Tune';
import { CheckMark, Reschedule, Edit } from 'icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getUserDependents, getDependentTestings } from 'actions/api';
import clsx from 'clsx';
import EditDependentDialog from './EditDependentDialog';

const useStyles = makeStyles(theme => ({
  root: {
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  headerTitle: {
    color: theme.palette.brandText,
    display: 'flex',
    '& img': {
      marginRight: 8
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  tableRoot: {
    marginTop: theme.spacing(4)
  },
  container: {
    margin: '15px 0'
  },
  processing: {
    color: theme.palette.brandOrange,
    margin: '0 auto',
    width: 120,
    display: 'flex'
  },
  resulted: {
    color: theme.palette.brandGreen,
    margin: '0 auto',
    width: 120,
    display: 'flex'
  },
  processingIcon: {
    position: 'relative',
    top: 0,
    right: 5,
  },
  resultedIcon: {
    position: 'relative',
    top: 0,
    right: 5,
  },
  cellIdDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    // width: '260px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('md', 'lg')]: {
      width: '220px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '160px',
    },
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width: '320px',
    // },
  },
  tableStatusCell: {
    padding: '2px 16px !important',
    margin: '0 auto',
    fontWeight: 100,
    width: 140,
    [theme.breakpoints.down('lg')]: {
      padding: '2px 8px !important',
    },
  },
  accExpanded: {
    margin: '0 !important',
    borderBottom: '1px solid #0F84A9'
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center'
  },
  accordion: {
    fontSize: '18px',
    fontFamily: 'Montserrat'
  },
  accordionDetails: {
    display: 'unset'
  },
  editIcon: {
    color: theme.palette.blueDark,
  },
}));

const headCells = [
  { id: 'date', label: 'Date Tested' },
  { id: 'test_type', label: 'Test Type' },
  { id: 'testkit_id', label: 'Test ID Number' },
  { id: 'status', label: 'Test Status' },
  { id: 'result', label: 'Test Results' },
];

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
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.id === 'result' || headCell.id === 'status1' ? 'center' : 'left'}
            className={brandClasses.tableHead}
          >
            {headCell.id === 'status' || headCell.id === 'result' ?
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

const Dependents = (props) => {
  const { user, getUserDependents, getDependentTestings } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dependentsList, setDependentsList] = useState([]);
  const [dependentsTestings, setDependentsTestings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depTestingLoading, setDepTestingLoading] = useState(true);
  const [selectedResultSummaryId, setSelectedResultSummaryId] = useState(null);
  const [isResultSummaryDlg, setIsResultSummaryDlg] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const [editDependentOpen, setEditDependentOpen] = useState(false);
  const [selectedDependent, setSelectedDependent] = useState({});

  const [expanded, setExpanded] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    if (user._id) {
      async function fetchData() {
        const res = await getUserDependents(user._id);
        if (res.success) {
          setDependentsList(res.data || []);
        }
        setLoading(false);
      }
      fetchData();
    }
    // eslint-disable-next-line
  }, [user._id, refetch]);

  const handleAccordianChange = (dep, index) => async (event, isExpanded) => {
    setExpanded(isExpanded ? `panel${index}` : false);
    if (isExpanded) {
      setDepTestingLoading(true);
      const res = await getDependentTestings(dep._id);
      if (res.success) {
        setDependentsTestings(res.data || []);
      }
      setDepTestingLoading(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onClickSummary = (data) => {
    setSelectedResultSummaryId(data._id);
    setIsResultSummaryDlg(true);
  };

  const handleEdit = (data) => {
    setSelectedDependent(data);
    setEditDependentOpen(true);
  };

  const handleEditDependentDialogClose = () => {
    setEditDependentOpen(false);
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <img src="/images/svg/status/users_icon.svg" alt="" />
          {'User Manager'} |
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>DEPENDENTS LIST</Typography>
      </div>

      {loading
        ?
        <CircularProgress />
        :
        !dependentsList.length
          ?
          <Typography variant="h4" className={classes.headerSubTitle}>{'No data to display...'}</Typography>
          :
          dependentsList.map((dep, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleAccordianChange(dep, index)}
              classes={{ expanded: classes.accExpanded }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={clsx(classes.accordion, index % 2 === 0 && brandClasses.tableRow2)}
                classes={{ content: classes.accordionSummary }}
              >
                <Tooltip title="Edit">
                  <IconButton className={classes.editIcon} onClick={() => handleEdit(dep)} >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Typography>
                  {dep.first_name}, {dep.last_name}
                </Typography>
                {/* <Typography>
                  {dep.dob ? moment.utc(dep.dob).format('MM/DD/YYYY') : ''}
                </Typography>
                <Typography>
                  {dep.relationship}
                </Typography> */}
              </AccordionSummary>
              <AccordionDetails
                classes={{ root: classes.accordionDetails }}
              >
                <div>
                  <TableContainer>
                    <Table>
                      <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={dependentsTestings.length}
                      />
                      <TableBody>
                        {depTestingLoading
                          ?
                          <TableRow>
                            <TableCell colSpan={headCells.length} align="center">
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                          :
                          !dependentsTestings.length
                            ?
                            <TableRow>
                              <TableCell colSpan={headCells.length} align="center">
                                {'No data to display...'}
                              </TableCell>
                            </TableRow>
                            :
                            dependentsTestings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((test, rowIndex) => (
                              <TableRow
                                key={rowIndex}
                                hover
                                className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}
                              >
                                <TableCell className={brandClasses.tableCell}>
                                  {test.collected_timestamp && moment(test.collected_timestamp).format('MM/DD/YYYY')}
                                </TableCell>
                                <TableCell className={brandClasses.tableCell}>
                                  {test.test_type}
                                </TableCell >
                                <TableCell className={brandClasses.tableCell}>
                                  <div className={classes.cellIdDiv} >
                                    {test.testkit_id}
                                  </div>
                                </TableCell>
                                <TableCell className={classes.tableStatusCell} >
                                  {test.result === 'Pending'
                                    ?
                                    <Typography className={classes.processing}>
                                      <Reschedule className={classes.processingIcon} style={{ width: 25 }} /> {'Processing'}
                                    </Typography>
                                    :
                                    <Typography className={classes.resulted} >
                                      <CheckMark className={classes.resultedIcon} style={{ width: 25 }} /> {'Resulted'}
                                    </Typography>
                                  }
                                </TableCell>
                                <TableCell className={brandClasses.tableCell} style={{ textAlign: 'center' }}>
                                  <img src="/images/svg/document_icon.svg" alt="" style={{ width: 25, cursor: 'pointer' }} onClick={() => onClickSummary(test)} />
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
                    count={dependentsTestings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          ))
      }

      <ResultsSummary
        isShow={isResultSummaryDlg}
        testing_id={selectedResultSummaryId}
        toggleDlg={setIsResultSummaryDlg}
      />

      <EditDependentDialog
        isShow={editDependentOpen}
        dependent_id={selectedDependent._id}
        toggleDlg={handleEditDependentDialogClose}
        setRefetch={setRefetch}
      />
    </div>
  );
};

Dependents.propTypes = {
  getUserDependents: PropTypes.func.isRequired,
  getDependentTestings: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(null, { getUserDependents, getDependentTestings })(Dependents);
