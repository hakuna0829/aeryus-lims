import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import brandStyles from 'theme/brand';
import { connect } from 'react-redux';
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  withStyles,
  Grid,
  CircularProgress,
  LinearProgress,
  Box,
  Table,
  TableHead,
  TableBody,
  TableSortLabel,
  TableRow,
  TableCell,
  TableContainer,
  // TablePagination,
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormHelperText,
  // TextField
  // Tooltip,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { handleImport } from 'helpers';
// import { spacing } from '@material-ui/system';
import * as appConstants from 'constants/appConstants';
import DialogAlert from 'components/DialogAlert';
// import { last } from 'underscore';
// import WhiteButton from 'layouts/Main/components/Button/WhiteButton';
// import HelpIcon from '@material-ui/icons/Help';
// import CheckButton from 'components/CheckButton';
// import classes from '*.module.css';
import { uploadFile, getLocations1, getDepartments, getAllPopulationSetting } from 'actions/api';
import { showErrorDialog } from 'actions/dialogAlert';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div variant="h6">{children}</div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  headerTitle: {
    fontSize: '24px',
    color: theme.palette.brandDark
  },
  connectTitle: {
    marginTop: '20px',
    marginBottom: '10px',
    textTransform: 'uppercase'
  },
  dialogContainer: {
    minWidth: '600px'
  },
  typeContainer: {
    border: `solid 1px ${theme.palette.brandDark}`,
    borderRadius: '5px',
    textAlign: 'center',
    padding: '12px',
    fontSize: '20px',
    fontWeight: 500,
    fontFamily: 'Montserrat',
    cursor: 'pointer',
    width: '160px',
    boxSizing: 'border-box',
  },
  active: {
    backgroundColor: theme.palette.brandDark,
    color: theme.palette.white,
  },
  typeInActiveContainer: {
    borderColor: theme.palette.brandLightGray,
    color: theme.palette.brandLightGray,
    cursor: 'default'
  },
  roundContainer: {
    border: `solid 1px ${theme.palette.brandDark}`,
    borderRadius: '5px',
    textAlign: 'center',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: 'Montserrat',
    width: '100%',
    color: theme.palette.brandLightGray,
    boxShadow: '2.34545px 3.12727px 3.90909px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '10px 0'
  },
  uploadImageContainer: {
    marginTop: '16px',
    '& p': {
      color: theme.palette.brandDark
    }
  },
  tableHead: {
    backgroundColor: `${theme.palette.white} !important`,
    padding: '8px 1px',
    [theme.breakpoints.between('md', 'lg')]: {
      padding: '12px 16px'
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: '8px 16px'
    }
  },
  cellDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    // width: '140px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('md', 'lg')]: {
      // width: '80px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '60px',
    },
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width: '320px',
    // },
  },
  stationSelect: {

    '& .MuiOutlinedInput-input': {
      padding: '6px 10px !important',
      marginRight: 17,
      // width: 42,
      textAlign: 'center',
    },
    '& .MuiSelect-icon': {
      // width: 21%;
      height: '100%',
      borderRadius: '0 10px 10px 0',
      backgroundColor: theme.palette.white,
      right: 0,
      top: 'auto'
    },
    '& p': {
      color: '#9B9B9B'
    },
  },
  mapFieldCheckbox: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(2),
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    '& img': {
      marginLeft: 10,
    },
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
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

// const columns = ['Last Name', 'First Name', 'Location', 'Department', 'Email', 'Phone', 'Status', 'View More'];
const headCells = [
  { id: 'db_fields', numeric: false, disablePadding: true, label: 'TESTD Database Fields' },
  { id: 'file_fields', numeric: false, disablePadding: true, label: 'Fields' },
  { id: 'field_value', numeric: false, disablePadding: true, label: 'Map Field Value' }
];
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const classes = useStyles();
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
            align={headCell.id === 'field_value' ? 'center' : 'left'}
            className={classes.tableHead}
          >
            { headCell.id === 'viewmore' ? headCell.label :
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                classes={{
                  icon: brandClasses.tableSortLabel,
                  active: brandClasses.tableSortLabel
                }}
              >
                {headCell.id !== 'viewmore' ?
                  <div className={classes.cellDiv}>
                    {headCell.label}
                  </div> :
                  headCell.label
                }
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

const ImportDialog = (props) => {
  const { dialogOpen, onDialogClose, settings, onCompleted, getLocations1, locations, getDepartments, departments, populationSettings, getAllPopulationSetting, showErrorDialog
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [step, setStep] = useState(1);
  const [fileState, setFileState] = useState({});
  const [alertDialogMessage, setAlertDialogMessage] = useState('');
  const [imgCompressionLoading, setImgCompressionLoading] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  // eslint-disable-next-line
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('last_name');
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [testFileData, setTestFieldData] = useState([]);
  const [formState, setFormState] = useState({});
  const [locationDepartments, setLocationsDepartments] = useState([]);
  const [locationPopulation, setLocationPopulation] = useState([]);
  const [nextStep, setNextStep] = useState(true);

  useEffect(() => {
    if (dialogOpen) {
      setFormState({});
      setStep(1);
      setFileState({});
      setUploadType(null)
      async function fetchData() {
        if (!locations)
          await getLocations1();
        if (!departments)
          await getDepartments();
        if (!populationSettings)
          await getAllPopulationSetting();
      }
      fetchData();
    }
    // eslint-disable-next-line 
  }, [dialogOpen]);

  useEffect(() => {
    if (departments) {
      let locDep = departments.filter(d => d.location_id._id === formState.location_id);
      setFormState(formState => ({ ...formState, department_id: null }));
      setLocationsDepartments(locDep ? locDep : []);
    }
  }, [departments, formState.location_id]);

  useEffect(() => {
    if (populationSettings) {
      let locDep = populationSettings.filter(d => d.location_id._id === formState.location_id);
      setFormState(formState => ({ ...formState, populationsettings_id: null }));
      setLocationPopulation(locDep ? locDep : []);
    }
  }, [populationSettings, formState.location_id]);

  useEffect(() => {
    setTestFieldData([
      {
        id: 'Lastname',
        label: 'Lastname',
        value: '',
        checked: false
      },
      {
        id: 'Firstname',
        label: 'Firstname',
        value: '',
        checked: false
      },
      {
        id: 'Email',
        label: 'Email',
        value: '',
        checked: false
      }, {
        id: 'Unit',
        label: 'Unit',
        value: '',
        checked: false
      }, {
        id: 'City',
        label: 'City',
        value: '',
        checked: false
      }, {
        id: 'Phone',
        label: 'Phone',
        value: '',
        checked: false
      }, {
        id: 'Officephone',
        label: 'Officephone',
        value: '',
        checked: false
      },
      {
        id: 'Address',
        label: 'Address',
        value: '',
        checked: false
      },
      {
        id: 'State',
        label: 'State',
        value: '',
        checked: false
      },
    ]);
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };
  const handleChange = e => {
    e.persist();
    if (e.target.name === 'location_id') {
      setFormState({
        department_id: undefined,
        populationsettings_id: undefined,
        location_id: e.target.value
      });
    } else if (e.target.name === 'department_id') {
      setFormState(formState => ({
        ...formState,
        department_id: e.target.value
      }));
    } else if (e.target.name === 'populationsettings_id') {
      setFormState(formState => ({
        ...formState,
        populationsettings_id: e.target.value
      }));

    }
    if (formState.location_id && formState.department_id && formState.populationsettings_id)
      setNextStep(false)
    // onHandleNext()
  };
  const handleClose = () => {
    onDialogClose(false);
    setStep(1);
    setUploadType(null);
    setFileState({});
  };
  useEffect(() => {
    setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    if (fileState.files) {
      setNextStep(false)
    }
    else {
      setNextStep(true);
    }
  }, [fileState]);

  const onHandleNext = () => {
    let formData = new FormData();
    if (step === 1) {
      setStep(step + 1);
    }
    else if (step === 2) {
      if (fileState.files) {
        setNextStep(false);
        setStep(step + 1);
      }
      else {
        setNextStep(true)
      }
    } else if (step === 3) {
      setStep(step + 1);
      setNextStep(true)
    } else if (step === 4) {
      if (formState.location_id && formState.department_id && formState.populationsettings_id) {
        setStep(step + 1)
        setNextStep(false)
      } else {
        setNextStep(true)
      }
      formData.append('uploadCsv', fileState.files);
      formData.append('location_id', formState.location_id);
      formData.append('department_id', formState.department_id);
      formData.append('populationsettings_id', formState.populationsettings_id);
      formData.append('first_name', testFileData.find(e => e.id === 'Firstname').value ? testFileData.find(e => e.id === 'Firstname').value : 'Firstname');
      formData.append('last_name', testFileData.find(e => e.id === 'Lastname').value ? testFileData.find(e => e.id === 'Lastname').value : 'Lastname');
      formData.append('email', testFileData.find(e => e.id === 'Email').value ? testFileData.find(e => e.id === 'Email').value : 'Email');
      formData.append('city', testFileData.find(e => e.id === 'City').value ? testFileData.find(e => e.id === 'City').value : 'City');
      formData.append('unit', testFileData.find(e => e.id === 'Unit').value ? testFileData.find(e => e.id === 'Unit').value : 'Unit');
      formData.append('office_phone', testFileData.find(e => e.id === 'Officephone').value ? testFileData.find(e => e.id === 'Officephone').value : 'Officephone');
      formData.append('address', testFileData.find(e => e.id === 'Address').value ? testFileData.find(e => e.id === 'Address').value : 'Address');
      formData.append('state', testFileData.find(e => e.id === 'State').value ? testFileData.find(e => e.id === 'State').value : 'State');


      let url = 'csv-file';
      if (uploadType === 'csv') {
        url = 'csv-file'
      } else if (uploadType === 'xlsx') {
        url = 'xlsx-file'
      } else {
        url = '';
      }

      let counter = 1;
      const interval = setInterval(() => {
        counter++;
        setUploadProgress(counter)
        if (counter === 100) {
          clearInterval(interval);
          onDialogClose(false);
          onCompleted(data);
          setStep(1);
        }
      }, 200)
      var data = {}
      uploadFile(url, formData).then(res => {
        data = {
          imported: res.data.data.totalCount,
          failed: res.data.data.unSucessfullUsersCount,
          no_matched: res.data.data.unSucessfullUsersCount,
          sucess: res.data.data.totalCount - res.data.data.unSucessfullUsersCount
        };
      }).catch(error => {
        showErrorDialog(error);
        clearInterval(interval);
        onDialogClose(false);
        onCompleted({
          imported: 0,
          failed: 0,
          no_matched: 0,
          sucess: 0
        });
        setStep(1);
      });
    }
  }

  const handleUploadChange = event => {
    handleImport(event, setAlertDialogMessage, setFileState, setImgCompressionLoading, setDialogOpen1, uploadType);
  }
  const handleDialogClose = () => {
    setDialogOpen1(false);
    setAlertDialogMessage('');
  };

  const handleFieldChange = index => event => {
    event.persist();
    let operations = [...testFileData];

    if (event.target.type === 'checkbox')
      operations[index].checked = event.target.checked;
    else
      operations[index].value = event.target.value;
    setTestFieldData(operations);
  }

  const handleMapChange = index => event => {
    event.persist();
    let operations = [...testFileData];
    operations[index].checked = event.target.checked;
    setTestFieldData(operations);
  };

  useEffect(() => {
  }, [testFileData])

  function Row(props) {
    const { data, rowIndex } = props;
    // const classes = useRowStyles();

    return (
      <React.Fragment key={rowIndex}>
        <TableRow
          hover
          // onClick={(event) => handleClick(event, row.name)}
          tabIndex={-1}
          className={rowIndex % 2 !== 0 ? '' : brandClasses.tableRow2}>
          <TableCell className={brandClasses.tableCell}>
            <div className={classes.cellDiv}>{data.label}</div>
          </TableCell>
          <TableCell className={brandClasses.tableCell}>
            <FormControl
              className={clsx(classes.stationSelect, brandClasses.shrinkTextField)}
              variant="outlined"
            >
              <Select
                onChange={handleFieldChange(rowIndex)}
                value={data.value || 0}
              >
                <ListSubheader>Custom Field</ListSubheader>
                <MenuItem value={0}>
                  <Typography className={classes.stateSelect}>Add your own field</Typography>
                </MenuItem>
                <ListSubheader>TESTD DB Field User</ListSubheader>
                {testFileData.map((testField, index) => (
                  <MenuItem value={testField.id} key={index}>{testField.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </TableCell>
          <TableCell className={brandClasses.tableCell}>
            <FormControlLabel
              control={<Checkbox onChange={handleMapChange(rowIndex)} checked={data.checked} />}
              className={classes.mapFieldCheckbox}
            />
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }


  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      maxWidth={'md'}
      classes={{ paper: classes.dialogContainer }}
    >
      <DialogTitle onClose={handleClose} className={brandClasses.headerContainer}>
      </DialogTitle>
      <DialogContent>
        {
          step === 1 ?
            <>
              <Typography variant="h3" className={classes.connectTitle}>PICK YOUR IMPORT FILE TYPE</Typography>
              <Grid container spacing={0}>
                <Grid item xs={4}>
                  <div className={uploadType === 'csv' ? clsx(classes.typeContainer, classes.active) : classes.typeContainer} onClick={() => setUploadType('csv')}>CSV File</div>
                </Grid>
                <Grid item xs={4}>
                  <div className={uploadType === 'xlsx' ? clsx(classes.typeContainer, classes.active) : classes.typeContainer} onClick={() => setUploadType('xlsx')}>XLSX File</div>
                </Grid>
                {/* <Grid item xs={4}>
                  <div className={uploadType === 'pdf' ? clsx(classes.typeContainer, classes.active) : classes.typeContainer} onClick={() => setUploadType('pdf')}>PDF File</div>
                </Grid> */}
              </Grid>
              <br />
              <Typography variant="h3" className={classes.connectTitle}>OR CONNECT TO:</Typography>
              <Grid container spacing={0}>
                <Grid item xs={4}>
                  <div className={clsx(classes.typeContainer, classes.typeInActiveContainer)}>ULTIPro</div>
                </Grid>
                <Grid item xs={4}>
                  <div className={clsx(classes.typeContainer, classes.typeInActiveContainer)}>Kronos</div>
                </Grid>
                <Grid item xs={4}>
                </Grid>
              </Grid>
              <div className={classes.footer}>
                <Button
                  variant="contained"
                  onClick={onHandleNext}
                  disabled={uploadType === null ? true : false}
                  className={brandClasses.button}>
                  NEXT
                </Button>
              </div>
            </>
            :
            step === 2 ?
              <>
                <Typography variant="h3" className={classes.connectTitle}>
                  IMPORT {uploadType} FILE
            </Typography>
                <Grid container spacing={0} justify="center">
                  <Grid item xs={8}>
                    <div className={classes.roundContainer}>
                      Select a file or drag and drop it here
                    <div className={classes.uploadImageContainer} >
                        <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .pdf" className={brandClasses.uploadInput} id="icon-button-file" onChange={handleUploadChange} />
                        <label style={{ cursor: 'pointer' }} htmlFor="icon-button-file">
                          <img src="/images/svg/upload.svg" alt="" />
                          <Typography >{fileState.name ? fileState.name : 'UPLOAD FILE'}</Typography>
                          {imgCompressionLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                        </label>

                      </div>
                    </div>
                  </Grid>
                </Grid>
                <br />
                <div className={classes.footer}>
                  <Button
                    variant="contained"
                    onClick={onHandleNext}
                    disabled={nextStep}
                    className={brandClasses.button}>
                    UPLOAD
                </Button>
                </div>
              </>
              :
              step === 4 ?
                <>
                  <Typography variant="h3" className={classes.connectTitle}>
                    UPLOAD YOUR LIST TO THE FOLLOWING
          </Typography>
                  <Grid container spacing={0} justify="center">
                    <FormControl
                      className={brandClasses.shrinkTextField}
                      required
                      fullWidth
                      variant="outlined" style={{ paddingBottom: 30 }}
                    >
                      <InputLabel shrink className={brandClasses.selectShrinkLabel}>Locations</InputLabel>
                      <Select
                        onChange={handleChange}
                        label="Locations* "
                        name="location_id"
                        displayEmpty
                        value={formState.location_id || ''}
                      >
                        <MenuItem value=''>
                          <Typography className={brandClasses.selectPlaceholder}>Select Location</Typography>
                        </MenuItem>
                        {locations.map((location, index) => (
                          <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      className={brandClasses.shrinkTextField}
                      required
                      fullWidth
                      variant="outlined" style={{ paddingBottom: 20 }}
                    >
                      <InputLabel shrink className={brandClasses.selectShrinkLabel}>Department</InputLabel>
                      <Select
                        onChange={handleChange}
                        label="Department* "
                        name="department_id"
                        displayEmpty
                        value={formState.department_id || ''}
                      >
                        <MenuItem value=''>
                          <Typography className={brandClasses.selectPlaceholder}>Select Department</Typography>
                        </MenuItem>
                        {locationDepartments.map((location, index) => (
                          <MenuItem key={index} value={location._id}>{location.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Departments will be based on Locations</FormHelperText>
                    </FormControl>

                    <FormControl
                      className={brandClasses.shrinkTextField}
                      required
                      fullWidth
                      variant="outlined"
                      style={{ paddingBottom: 30 }}>
                      <InputLabel shrink className={brandClasses.selectShrinkLabel}>Populationsettings</InputLabel>
                      <Select
                        onChange={handleChange}
                        label="Population* "
                        name="populationsettings_id"
                        displayEmpty
                        value={formState.populationsettings_id || ''}
                      >
                        <MenuItem value=''>
                          <Typography className={brandClasses.selectPlaceholder}>Select Populationsettings</Typography>
                        </MenuItem>
                        {locationPopulation.map((location, index) => (
                          <MenuItem key={index} value={location._id}>{location.type}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Population will be based on Locations</FormHelperText>
                    </FormControl>
                  </Grid>
                  <br />
                  <div className={classes.footer}>
                    <Button
                      variant="contained"
                      onClick={onHandleNext}
                      disabled={nextStep}
                      className={brandClasses.button}>
                      UPLOAD
              </Button>
                  </div>
                </>
                :
                step === 3 ?
                  <>
                    <Typography variant="h3" className={classes.connectTitle}>
                      Match Import Fields to  Testd | DB fields
        </Typography>
                    <Grid container spacing={0} justify="center">
                      <Grid item xs={12}>
                        <TableContainer className={classes.container}>
                          <Table stickyHeader >
                            <EnhancedTableHead
                              classes={classes}
                              order={order}
                              orderBy={orderBy}
                              // onSelectAllClick={handleSelectAllClick}
                              onRequestSort={handleRequestSort}
                              rowCount={testFileData.length}
                            />
                            <TableBody>
                              {
                                !testFileData.length ?
                                  <TableRow>
                                    <TableCell colSpan={headCells.length} align="center">
                                      {'No data to display...'}
                                    </TableCell>
                                  </TableRow>
                                  :
                                  stableSort(testFileData, getComparator(order, orderBy))
                                    .map((item, rowIndex) => {

                                      return (
                                        <Row data={item} rowIndex={rowIndex} key={rowIndex} />
                                      );
                                    })
                              }

                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={testFileData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            /> */}
                      </Grid>

                    </Grid>
                    <div className={classes.footer}>
                      <Button
                        variant="contained"
                        onClick={onHandleNext}
                        className={brandClasses.button}>
                        NEXT
            </Button>
                    </div>
                  </>
                  :
                  step === 5 ?
                    <>
                      <Typography variant="h3" className={classes.connectTitle}>
                        IMPORT {uploadType} FILE
          </Typography>
                      <Grid container spacing={0} justify="center">
                        <Grid item xs={8}>
                          <div className={classes.roundContainer}>
                            <div className={classes.uploadImageContainer} >
                              <img src="/images/products/FileLoading.gif" alt="" width="240px" />
                            </div>
                          </div>
                        </Grid>
                        <br />
                        <Grid item xs={9} >
                          <Box mt={2}>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                          </Box>
                        </Grid>

                      </Grid>

                      <div className={classes.footer}>
                        {/* <Button
                          variant="contained"
                          onClick={onHandleNext}
                          className={brandClasses.button}>
                          NEXT
            </Button> */}
                      </div>
                    </>
                    : ''}

      </DialogContent>
      <DialogAlert
        open={dialogOpen1}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={alertDialogMessage}
        onClose={handleDialogClose}
      />
    </Dialog>
  );
};
const mapStateToProps = state => ({
  locations: state.data.locations,
  departments: state.data.departments,
  populationSettings: state.data.populationSettings,
});
ImportDialog.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getDepartments: PropTypes.func.isRequired,
  getAllPopulationSetting: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { getLocations1, getDepartments, getAllPopulationSetting, showErrorDialog })(ImportDialog);