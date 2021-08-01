import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { Grid, Typography, Select, MenuItem, FormControl, Button, Box, Table, TableHead, TableBody, TableSortLabel, 
  TableRow, TableCell, Checkbox, TableContainer, Paper, TablePagination, 
  // CircularProgress,FormControlLabel,useMediaQuery,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Actions from './Actions';
// import { Users } from 'icons';
// import { getAllPopulationSetting } from 'actions/api';
// import { useTheme } from '@material-ui/styles';
import BlueBox from "components/BlueBox";
import FilterSettingPopup from '../UserManager/UserDetails/components/FilterSettingPopup';
import { SearchBar } from 'layouts/Main/components';
import AddDialog from './AddDialog';

// const cardMdWidth = 230;

const useStyles = makeStyles(theme => ({
  root: {
    // paddingTop: theme.spacing(2),
  },
  tableContainer:{
    maxHeight: 600,
    padding:0
  },
  container: {
    padding: `0px ${theme.spacing(2)}px`,
  },
  header: {
    padding: theme.spacing(2),
  },
  header2: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `0px 0px`,
    marginBottom: theme.spacing(2),
  },
  boxContainer:{
    '& p':{
      fontFamily: 'Montserrat',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '17px',
      display: 'flex',
      alignItems: 'center',
      color: '#0F84A9'
    }
  },
  settingIconBox: {
    width: '42px',
    height: '40px',
    display: 'block',
    fontFamily: 'verdana',
    fontSize: '22px',
    padding: 0,
    margin: '0px 15px 0 0',
    border: 'solid 1px',
    borderColor: theme.palette.brandDark,
    borderRadius: '3px',
    boxShadow: '2.34545px 3.12727px 3.90909px rgba(4, 59, 93, 0.15)',
    outline: 0,
    lineHeight: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
    background: '#fff',
  },
  quickFitler:{
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    color: '#0F84A9',
    border: '0.78px solid #0F84A9',
    borderRadius: '4px',
    padding:'9px 8px 5px',
    marginRight:'12px',
    cursor: 'pointer'
  },
  locationContanier:{
    width:'250px',
    margin:'10px 0'
  },
  topBoxRoot:{
    minHeight:'130px'
  },
  vaccineAmount:{
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '45px',
    lineHeight: '56px',
    textAlign: 'center',
    color: '#0F84A9'
  },
  vaccineName:{
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '17px',
    lineHeight: '21px',
    textAlign: 'center',
    color: '#0F84A9'
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 16
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText,
    textTransform:'uppercase'
  },
  title: {
    color: '#0F84A9',
    lineHeight: '27px'
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    textTransform: 'capitalize',
    fontSize: '16px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  statusCellDiv: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '60px',
    whiteSpace: 'nowrap',
    padding: '0px',
    [theme.breakpoints.between('md', 'lg')]: {
      width: '60px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '60px',
    },
  },
  paperRoot:{
    marginTop:'10px',
    marginLeft:'-6px',
    border:'solid 1px',
    padding:'8px'
  },
  typeDiv:{
    width:'24px', 
    height:'24px', 
    margin:'0 auto', 
    borderRadius:'50%', 
    display:'block'
  },
  statusLabel:{
    fontSize:'10px',
    fontWeight:500,
    lineHeight:'12px'
  }  
}));

const headCells = [
  { id: 'item_name', numeric: false, disablePadding: true, label: 'Item Name', align:'left' },
  { id: 'quantity', numeric: false, disablePadding: true, label: 'Quantity', align:'center' },
  { id: 'type', numeric: false, disablePadding: true, label: 'Type', align:'center' },
  { id: 'serial_number', numeric: false, disablePadding: true, label: 'Location', align:'center' },
  { id: 'lot_number', numeric: false, disablePadding: true, label: 'Lot Number', align:'center' },
  { id: 'exp_date', numeric: false, disablePadding: true, label: 'Expiration Date', align:'center' },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location', align:'center' },
  { id: 'manufactor', numeric: false, disablePadding: false, label: 'Manufactor', align:'center' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status', align:'center' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions', align:'center' },
];

function createData(itemName, quantity, type, serialNumber, lotNumber, expireDate, location, manufactor, status) {
  return {
      item_name: itemName,
      quantity,
      type,
      serial_number: serialNumber,
      lot_number: lotNumber,
      exp_date: expireDate,
      location,
      manufactor,
      status
  };
}

const rows = [
  createData('COVID-19 Vaccine', 500, 1, 3445, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'Delivered'),
  createData('Rapid Test', 1000, 2, 2521, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3443, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'Location'),
  createData('PCR Test', 1000, 3, 2522, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3446, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'In transit'),
  createData('Rapid Test', 1000, 2, 2524, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3447, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'Location'),
  createData('PCR Test', 1000, 3, 2525, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3448, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'In transit'),
  createData('Rapid Test', 1000, 2, 2526, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3449, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'Location'),
  createData('PCR Test', 1000, 3, 2527, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3450, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'In transit'),
  createData('Rapid Test', 1000, 2, 2528, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
  createData('COVID-19 Vaccine', 500, 1, 3451, 'A12Vdgd', '02/10/2021 9:00AM', 'Atlanta', 'Moderna', 'Location'),
  createData('PCR Test', 1000, 3, 2529, 'A12Vdgd', '02/10/2021 9:00AM', 'Hilton', 'Pfizer', 'Delivered'),
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
  const { order, orderBy, onRequestSort, rowCount, onSelectAllClick, numSelected } = props;
  const classes = useStyles();
  const brandClasses = brandStyles();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell className={classes.tableHead}></TableCell> */}
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.id === 'item_name' ? 'left' : 'center'}
            className={classes.tableHead}
          >
            { headCell.id === 'actions' || headCell.id === 'type' || headCell.id === 'status' ? headCell.label :
              headCell.id === 'status' ? 
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
                <div className={classes.statusCellDiv}>
                  {headCell.label}s
                </div> 
              </TableSortLabel>
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
                {headCell.id !== 'active' && headCell.id !== 'viewmore' ?
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
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
};

const InventoryManager = (props) => {
  // const { populationSettings, getAllPopulationSetting } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [formState, setFormState] = useState({ provider: {} });
  // const [filterItems, setFilterItems] = useState([]);
  // const [searchKeys, setSearchKeys] = useState([]);
  const [anchorEl, setAnchorEl] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('last_name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isShowAddDlg, setIsShowAddDlg] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  
  const [arrGroupData, setArrGroupData] = useState([
    {
      groupKey:'SHIPMENT', 
      // checked:false, 
      children:[
        {key:'In Transit', value: false},
        {key:'Delivered', value: true},
        {key:'Location', value: false}
      ]
    },
    {
      groupKey:'MANUFACTOR', 
      // checked:false, 
      children:[
        {key:'Pfizer', value: false},
        {key:'Moderna', value: false},
        {key:'Johnson & Johnson', value: false}
      ]
    },
    {
      groupKey:'PRODUCT', 
      // checked:false, 
      children:[
        {key:'Vaccines', value: false},
        {key:'Tests', value: false},
      ]
    }
  ]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.serial_number);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, serialNumber) => {
    const selectedIndex = selected.indexOf(serialNumber);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, serialNumber);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (serialNumber) => selected.indexOf(serialNumber) !== -1;

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleApplyFilterOption = () => {
    console.log('close popover')
    setAnchorEl(null);
  }

  const onChangeSearch = async (e) => {
    e.persist();
    // const keys = searchKeys;//['first_name', 'last_name', 'email', 'phone', 'location_id'];

    // if (userList && userList.length > 0) {
    //   setFilteredUserList(utility.filter(userList, e.target.value, keys));
    // }
  }

  const onAddInventory = () => {
    setIsShowAddDlg(true)
    // setEmplyeeId(null);
    // setDialogOpen(true);
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const MakeTypeCell = (data) => {
    if(data.type === 1){
      return (
        <div className={classes.typeDiv} style={{backgroundColor:'#DE50A4'}} />
      )
    }else if(data.type === 2){
      return (
       <div className={classes.typeDiv} style={{backgroundColor:'#FBC23C'}} ></div>
      )
    }else if(data.type === 3){
      return (
       <div className={classes.typeDiv} style={{backgroundColor:'#25DD83'}} ></div>
      )
    }
  }

  const MakeStatusCell = (data) => {
   
    if(data.status === 'In transit'){
      return (
        <div className={classes.statusDiv} >
          <Typography className={classes.statusLabel}>{data.status}</Typography>
          <img src="/images/svg/delivering.svg" alt=""></img>
        </div>
      )
    }else if(data.status === 'Delivered'){
      return (
        <div className={classes.statusDiv} >
          <Typography className={classes.statusLabel}>{data.status}</Typography>
          <img src="/images/svg/delivered.svg" alt=""></img>
        </div>
      )
    }else if(data.status === 'Location'){
      return (
        <div className={classes.statusDiv} >
          <img src="/images/svg/location.svg" alt=""></img>
        </div>
      )
    }
  }

  const MaketableRow = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.id];
    
    const handleEdit = (serialNumber) => {
      console.log('edit serialNumber',serialNumber)
    }

    const handleDelete = (serialNumber) => {
      console.log('delete serialNumber',serialNumber)
    }

    if (column.id === 'status') {
        return (
            <TableCell key={column.id} align={column.align} className={brandClasses.tableCell}>
                <MakeStatusCell status={row.status} />
            </TableCell>
        )
    }
    if (column.id === 'actions') {
        return (
          <TableCell key={column.id} align="center" className={brandClasses.tableCell}>
            <Actions
              serialNumber={row.serial_number}
              handleEdit = {()=>handleEdit(row.serial_number)}
              handleDelete = {()=>handleDelete(row.serial_number)}
            />
          </TableCell>
        )
    }
    if (column.id === 'type') {
      return(
        <TableCell key={column.id} align={column.align} className={brandClasses.tableCell}>
          <MakeTypeCell type={row.type} />
        </TableCell>
      )
        
    }
    return (
        <TableCell key={column.id} align={column.align} className={brandClasses.tableCell}>
            {value}
        </TableCell>
    )
  }

  return (
    <div >
      <div className={classes.header} >
        <div className={classes.subHeader}>
            <img src="/images/svg/inventory_icon.svg" alt="" />&ensp;
            <Typography variant="h2" className={brandClasses.headerTitle}>
              INVENTORY MANAGER
            </Typography>
        </div>
        <div className={classes.locationContanier}>
          <Grid container item className={classes.editAddressField}>
            <Grid item xs>
              <FormControl
                className={brandClasses.shrinkTextField}
                fullWidth
                variant="outlined"
              >
                {/* <InputLabel shrink className={brandClasses.selectShrinkLabel}>State</InputLabel> */}
                <Select
                  onChange={handleChange}
                  // label="State* "
                  name="location"
                  displayEmpty
                  value={formState.location || 'all'}
                >
                  <MenuItem value='all'>
                    <Typography className={brandClasses.selectPlaceholder}>All Locations</Typography>
                  </MenuItem>
                  <MenuItem value="location1">Location 1</MenuItem>
                  <MenuItem value="location2">Location 2</MenuItem>
                  <MenuItem value="location3">Location 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <BlueBox class={classes.topBoxRoot} key={'totaluser'}>
                <p className={classes.vaccineAmount}>2,500</p>
                <p className={classes.vaccineName}>Total Company Inventory</p>
              </BlueBox>
            </Grid>
            <Grid item xs={2}>
              <BlueBox class={classes.topBoxRoot} key={'totaluser'}>
                <p className={classes.vaccineAmount}>10,500</p>
                <p className={classes.vaccineName}>Total Vaccines</p>
              </BlueBox>
            </Grid>
            <Grid item xs={2}>
              <BlueBox class={classes.topBoxRoot} key={'totaluser'}>
                <p className={classes.vaccineAmount}>5,000</p>
                <p className={classes.vaccineName}>Moderna</p>
              </BlueBox>
            </Grid>
            <Grid item xs={2}>
              <BlueBox class={classes.topBoxRoot} key={'totaluser'}>
                <p className={classes.vaccineAmount}>7,000</p>
                <p className={classes.vaccineName}>Pfizer</p>
              </BlueBox>
            </Grid>
            <Grid item xs={2}>
              <BlueBox class={classes.topBoxRoot} key={'totaluser'}>
                <p className={classes.vaccineAmount}>0</p>
                <p className={classes.vaccineName}>Johnson & Johnson</p>
              </BlueBox>
            </Grid>
            
          </Grid>
        </div>
        

        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <div className={classes.header2}>
              <div className={classes.boxContainer}>
                <p>Filter</p>
                <div className={classes.settingIconBox}>
                  <img
                    src="/images/svg/Filter.svg"
                    alt=""
                    onClick={handleClick}
                    // onClick={() => setDialogFilterOpen(true)}
                  />
                  {/* <TuneIcon
                    className={classes.settingIcon}
                    onClick={() => setDialogFilterOpen(true)}
                  /> */}
                  <FilterSettingPopup
                    groupInfo={arrGroupData}
                    updateGroupData={setArrGroupData}
                    setAnchorEl={setAnchorEl}
                    anchorEl={anchorEl}
                    onClose={handleApplyFilterOption}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    classes={{ paper: classes.paperRoot }}
                  />
                  
                </div>
              </div>
              <div className={classes.boxContainer}>
                <p>Quick Filter</p>
                <div className={classes.quickFitler}>
                  RECEVIED TODAY
                </div>
              </div>
              <div className={classes.boxContainer}>
                <p>&nbsp;</p>
                <div className={classes.quickFitler}>
                  EXPIRATION DATE
                </div>
              </div>
              <div className={classes.boxContainer}>
                <p>&nbsp;</p>
                <SearchBar
                className={classes.searchBar}
                // onClick={onClickSearchInput}
                toggleOpen={setIsOpen}
                isOpen={isOpen}
                onChange={onChangeSearch}
              />
              </div>
              
            </div>
          </Grid>
          <Grid item style={{ paddingRight: 15, paddingBottom: 20 }}>
            <Box display="flex">
              
              <Button
                variant="contained"
                onClick={onAddInventory}
                className={classes.greenBtn}>
                <AddIcon /> ADD INVENTORY
              </Button>
            </Box>
        </Grid>
        </Grid> 
        
      </div>
      <Paper className={classes.root}>
          <TableContainer classes={{root:classes.tableContainer}}>
              <Table stickyHeader aria-label="sticky table" className={classes.tableContainer}>
                  <EnhancedTableHead
                      classes={classes}
                      order={order}
                      orderBy={orderBy}
                      // onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                      numSelected={selected.length}
                      onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                      {
                          !rows.length
                              ?
                              <TableRow>
                                  <TableCell colSpan={headCells.length} align="center">
                                      {'No data to display...'}
                                  </TableCell>
                              </TableRow>
                              : stableSort(rows, getComparator(order, orderBy))
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                    
                                    const isItemSelected = isSelected(row.serial_number);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                      return (
                                          <TableRow hover tabIndex={-1} 
                                          key={index} 
                                          className={index % 2 === 0 ? brandClasses.tableRow1 : ''}
                                          selected={isItemSelected}
                                          aria-checked={isItemSelected}
                                          // onClick={(event) => handleRowClick(event, row.serial_number)}
                                          >
                                            <TableCell className={brandClasses.tableCell}>
                                              <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                onClick={(event) => handleRowClick(event, row.serial_number)}
                                              />
                                            </TableCell>
                                              {headCells.map((column) => {
                                                  return (
                                                      <MaketableRow column={column} row={row} key={column.id} />
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
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={rows.length}
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
      </Paper>
     
     <AddDialog dialogOpen={isShowAddDlg} onDialogClose={setIsShowAddDlg} />
    </div>
  );
};

export default InventoryManager;
