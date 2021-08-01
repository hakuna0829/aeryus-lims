import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import brandStyles from 'theme/brand';
import {
  Grid, Typography, Select, MenuItem, FormControl, Button, CircularProgress, Box
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// import { Users } from 'icons';
// import { useTheme } from '@material-ui/styles';
import BlueBox from "components/BlueBox";
import FilterSettingPopup from '../UserManager/UserDetails/components/FilterSettingPopup';
import { getAllInventory, deleteInventory, getInventoryCounts, getLocations1, getInventoryManufacturer, searchInventory } from 'actions/api';
import AddInventory from './components/AddInventory';
import Actions from './components/Actions';
import CustomTable from 'components/CustomTable';
import SearchBar from 'components/SearchBar';
import DialogAlert from 'components/DialogAlert';
import moment from "moment";
import * as appConstants from 'constants/appConstants';
import { numberWithCommas } from 'helpers/utility';
import InventoryDialog from './components/InventoryDialog'
import TextButton from 'components/Button/TextButton';

// const cardMdWidth = 230;

const useStyles = makeStyles(theme => ({
  root: {
    // paddingTop: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: 600,
    padding: 0
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
  boxContainer: {
    '& p': {
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
    backgroundImage: 'url("/images/svg/filter_inactive.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    '&:hover':{
      background: theme.palette.brandDark,
      backgroundImage: 'url("/images/svg/filter_active.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }
  },
  quickFitler: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    color: '#0F84A9',
    border: '0.78px solid #0F84A9',
    borderRadius: '4px',
    padding: '9px 8px 5px',
    marginRight: '12px',
    cursor: 'pointer',
  },
  locationContanier: {
    width: '250px',
    margin: '18px 0 48px'
  },
  topBoxRoot: {
    minHeight: '130px',
    marginRight: 10,
    padding: `${theme.spacing(3)}px 12px`,
    marginBottom: '48px !important'

  },
  vaccineAmount: {
    // fontFamily: 'Montserrat',
    fontWeight: 600,
    // fontSize: '45px',
    lineHeight: '56px',
    textAlign: 'center',
    color: '#0F84A9'
  },
  vaccineName: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '17px',
    lineHeight: '21px',
    textAlign: 'center',
    color: '#0F84A9',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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
    textTransform: 'uppercase'
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
  paperRoot: {
    marginTop: '10px',
    marginLeft: '-6px',
    border: 'solid 1px',
    padding: '8px',
    '&:hover': {
      backgroundColor: '#3ECCCD'
    }
  },
  typeDiv: {
    width: '24px',
    height: '24px',
    margin: '0 auto',
    borderRadius: '50%',
    display: 'block'
  },
  statusLabel: {
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: '12px'
  },
  legend:{
    fontSize:14,
    color:theme.palette.blueDark,
    textDecoration:'underline',
    marginRight:12
  },
  legendLabel:{
    fontSize: 14,
    fontWeight: 500,
    marginRight:12
  }
}));

const DotType = withStyles((theme) => ({
  root: {
    fontSize: 34,
    color: props => {
      switch (props.type) {
        case 'Vaccine':
          return '#DE50A4';
        case 'Rapid':
          return '#FBC23C';

        default:
          return '#25DD83';
      }
    }
  },
}))(FiberManualRecordIcon);

const FilterInit = [
  {
    groupKey: 'SHIPMENT',
    children: [
      { id: 'Pending', label: 'In Transit', value: false },
      { id: 'delivered', label: 'Delivered', value: false }
    ]
  },
  {
    groupKey: 'MANUFACTURER',
    children: [
      { id: 'Pfizer', label: 'Pfizer', value: false },
      { id: 'Moderna', label: 'Moderna', value: false },
      { id: 'Johnson & Johnson', label: 'Johnson & Johnson', value: false }
    ]
  },
  {
    groupKey: 'PRODUCT',
    children: [
      { id: 'Vaccine', label: 'Vaccines', value: false },
      { id: 'Tests', label: 'Tests', value: false },
    ]
  }
];

const metaData = [
  { key: 'item_name', label: 'Item Name', align: 'left', sortable: true },
  { key: 'quantity', label: 'Quantity', align: 'center', sortable: true },
  { key: 'item_type', label: 'Type', align: 'center', sortable: false },
  { key: 'serial_number', label: 'Serial Number', align: 'center', sortable: true },
  { key: 'lot_number', label: 'Lot Number', align: 'center', sortable: true },
  { key: 'exp_date', label: 'Expiration Date', align: 'center', sortable: true },
  { key: 'location_assign', label: 'Location', align: 'center', sortable: true, minWidth: 220 },
  { key: 'manufacturer', label: 'Manufacturer', align: 'center', sortable: true },
  { key: 'status', label: 'Status', align: 'center', sortable: true },
  { key: 'actions', label: 'Actions', align: 'center', sortable: false, minWidth: 100 },
];

const InventoryManager = (props) => {
  const { getAllInventory, deleteInventory, getInventoryCounts, getLocations1, locations, getInventoryManufacturer, searchInventory } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [inventoryCounts, setInventoryCounts] = useState(null);
  const [inventoryList, setInventoryList] = useState([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const [refetch, setRefetch] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [location_id, setLocationId] = useState(0);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openAddInventory, setOpenAddInventory] = useState(false);
  // const [selected, setSelected] = useState([]);
  const [arrGroupData, setArrGroupData] = useState([...FilterInit]);
  const [inventorydialog, setInventoryDialog] = useState(false);
  const [inventoryId, setInventoryId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectToday, setSelectToday] = useState(false);
  const [selectExpire, setSelectExpire] = useState(false);

  useEffect(() => {
    (async () => {
      if (!locations)
        await getLocations1();
    })();
    // eslint-disable-next-line
  }, [locations]);

  useEffect(() => {
    (async () => {
      let queryParams;
      if (location_id)
        queryParams = `&location_id=${location_id}`;
      setInventoryCounts(null);
      let res = await getInventoryCounts(queryParams);
      if (res.success) {
        setInventoryCounts(res.data || {});
      }
      let manufacturerRes = await getInventoryManufacturer();
      if (manufacturerRes.success && manufacturerRes.data) {
        let temp = FilterInit.map(f => {
          if (f.groupKey === 'MANUFACTER')
            f.children = manufacturerRes.data.map(l => { return ({ id: l, label: l, value: false }) });
          return f;
        });
        setArrGroupData(temp);
      }
    })();
    // eslint-disable-next-line
  }, [location_id, refetch]);

  useEffect(() => {
    (async () => {
      let queryParams = `page=${page}&rowsPerPage=${rowsPerPage}&order=${order}&orderBy=${orderBy}`;
      if (location_id)
        queryParams += `&location_id=${location_id}`;
      if (selectedFilter)
        queryParams += `&filter=${selectedFilter}`;
      if (selectExpire)
        queryParams += `&selectExpire=${selectExpire}`;
      if (selectToday)
        queryParams += `&selectToday=${selectToday}`
      let res = {};
      setLoading(true);
      if (submittedSearch.length)
        res = await searchInventory({ search_string: submittedSearch }, queryParams);
      else
        res = await getAllInventory(queryParams);
      setLoading(false);
      if (res.success) {
        setInventoryList(res.data);
        setCount(res.count);
        if(selectExpire) {
          setOrder('asc');
          setOrderBy('exp_date')
        }
      }
    })();
    // eslint-disable-next-line
  }, [location_id, page, rowsPerPage, order, orderBy, refetch, selectedFilter, submittedSearch, selectExpire, selectToday]);

  const handleSearchSubmit = async (str) => {
    setPage(0);
    setSubmittedSearch(str);
  };

  const handleLocationChange = (event) => {
    setLocationId(event.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleApplyFilterOption = (appliedFilters) => {
    setAnchorEl(null);
    updateFilter(appliedFilters);
  };

  const updateFilter = (updatedFilters) => {
    setPage(0);
    let filters = {};
    if (updatedFilters) {
      filters['status'] = updatedFilters.find(f => f.groupKey === 'SHIPMENT').children.filter(c => c.value).map(c => c.id);
      filters['manufacturer'] = updatedFilters.find(f => f.groupKey === 'MANUFACTER').children.filter(c => c.value).map(c => c.id);
      filters['item_type'] = updatedFilters.find(f => f.groupKey === 'PRODUCT').children.filter(c => c.value).map(c => c.id);
      setSelectedFilter(JSON.stringify(filters));
    }
  };

  const handleSelectToday = () => {
    setSelectToday(!selectToday)
    if (selectExpire)
      setSelectExpire(!selectExpire)
  };

  const handleSelectExpire = () => {
    setSelectExpire(!selectExpire)
    if (selectToday)
      setSelectToday(!selectToday)
  };

  const onAddInventory = () => {
    setOpenAddInventory(true);
  };

  const onAddInventoryDialogClose = (doRefetch) => {
    setOpenAddInventory(false);
    if (doRefetch)
      setRefetch(refetch => refetch + 1);
  };

  const handleView = (id) => {
    setInventoryDialog(true)
    setInventoryId(id)
  };

  const handleDelete = async (id, name) => {
    setSelectedItem({ id, name });
    setConfirmDialogOpen(true);
  };

  const handleDeleteDialogAction = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    let res = await deleteInventory(selectedItem.id);
    setLoading(false);
    if (res.success) {
      setRefetch(refetch => refetch + 1);
    }
  };

  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleInventoryDialog = (doRefetch) => {
    setInventoryDialog(false);
    setInventoryId(null)
    if (doRefetch)
      setRefetch(refetch => refetch + 1);
  };

  const MakeStatusCell = ({ status }) => {
    if (status === 'In transit') {
      return (
        <div className={classes.statusDiv} >
          <Typography className={classes.statusLabel}>{status}</Typography>
          <img src="/images/svg/delivering.svg" alt="" />
        </div>
      )
    } else if (status === 'Delivered') {
      return (
        <div className={classes.statusDiv} >
          <Typography className={classes.statusLabel}>{status}</Typography>
          <img src="/images/svg/delivered.svg" alt=""></img>
        </div>
      )
    } else {
      return (
        <div className={classes.statusDiv} >
          <img src="/images/svg/location.svg" alt=""></img>
        </div>
      )
    }
  };

  // eslint-disable-next-line react/no-multi-comp
  const CustomTableData = (data) => {
    const column = data.column;
    const row = data.row;
    const value = row[column.key];

    if (column.key === 'item_type') {
      return (
        <DotType
          type={row.item_type}
        />
      )
    }
    if (column.key === 'exp_date') {
      return (
        <div>
          {value ? moment(value).format('MM/DD/YYYY') : ''}
        </div>
      )
    }
    if (column.key === 'location_assign') {
      return (
        <div>
          {row.location_assign && row.location_assign.map((loc, index) => (
            <div key={index}>{loc.location_id.name}: {loc.quantity} {row.location_assign.length === (index + 1) ?'':','} </div>
          ))}
        </div>
      )
    }
    if (column.key === 'status') {
      return (
        <MakeStatusCell
          status={row.status}
        />
      )
    }
    if (column.key === 'actions') {
      return (
        <Actions
          handleView={() => handleView(row._id)}
          handleDelete={() => handleDelete(row._id, row.item_name)}
        />
      )
    }
    return (
      <div>{value}</div>
    )
  };

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
              {locations
                ?
                <FormControl
                  className={brandClasses.shrinkTextField}
                  fullWidth
                  variant="outlined"
                >
                  <Select
                    value={location_id}
                    onChange={handleLocationChange}
                  >
                    <MenuItem value={0}>
                      <em>{'All Locations'}</em>
                    </MenuItem>
                    {locations.map((location, index) => (
                      <MenuItem value={location._id} key={index}>{location.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                :
                <CircularProgress />
              }
            </Grid>
          </Grid>
        </div>

        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={12} sm={2}>
            <BlueBox class={classes.topBoxRoot}>
              {/* <p className={classes.vaccineAmount}>10,500</p> */}
              <Typography className={classes.vaccineAmount} variant="h1">
                {inventoryCounts
                  ? numberWithCommas(inventoryCounts.total_inventory)
                  : <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />
                }
                <p className={classes.vaccineName}>Total Company Inventory</p>
              </Typography>
            </BlueBox>
          </Grid>
          <Grid item xs={12} sm={2}>
            <BlueBox class={classes.topBoxRoot}>
              <Typography className={classes.vaccineAmount} variant="h1">
                {inventoryCounts
                  ? numberWithCommas(inventoryCounts.total_vaccines)
                  : <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />
                }
              </Typography>
              <p className={classes.vaccineName}>Total Vaccines</p>
            </BlueBox>
          </Grid>
          {inventoryCounts ?
            inventoryCounts.categorized_by_manufacturer && inventoryCounts.categorized_by_manufacturer.map((manufacturer, index) => (
              <Grid item xs={12} sm={2} key={index}>
                <BlueBox class={classes.topBoxRoot}>
                  <Typography className={classes.vaccineAmount} variant="h1">{numberWithCommas(manufacturer.total_quantity)}</Typography>
                  <p className={classes.vaccineName}>{manufacturer.manufacturer}</p>
                </BlueBox>
              </Grid>
            ))
            :
            <CircularProgress size={20} className={brandClasses.fetchProgressSpinner} />
          }
        </Grid>

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
                <div className={classes.settingIconBox} >
                  <Typography onClick={handleClick} style={{height:'100%'}}>&nbsp;</Typography>
                  {/* <img
                    src="/images/svg/filter_inactive.svg"
                    alt=""
                    onClick={handleClick}
                  // onClick={() => setDialogFilterOpen(true)}
                  /> */}
                  <FilterSettingPopup
                    groupInfo={arrGroupData}
                    updateGroupData={setArrGroupData}
                    setAnchorEl={setAnchorEl}
                    anchorEl={anchorEl}
                    onClose={handleApplyFilterOption}
                    onApply={handleApplyFilterOption}
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
                <Button
                  variant="contained"
                  onClick={handleSelectToday}
                  className={classes.quickFitler}
                  style={{ backgroundColor: selectToday ? '#0F84A9' : '#FFFFFF', color: selectToday ? '#FFFFFF' : '#0F84A9' }}>
                  RECEIVED TODAY
                </Button>
              </div>
              <div className={classes.boxContainer}>
                <p>&nbsp;</p>
                {/* <div className={classes.quickFitler} onClick ={handleSelectExpire}>
                  EXPIRATION DATE
                </div> */}
                <Button
                  variant="contained"
                  onClick={handleSelectExpire}
                  className={classes.quickFitler}
                  style={{ backgroundColor: selectExpire ? '#0F84A9' : '#FFFFFF', color: selectExpire ? '#FFFFFF' : '#0F84A9' }}>
                  EXPIRATION DATE
                </Button>
              </div>
              <div className={classes.boxContainer}>
                <p>&nbsp;</p>
                <SearchBar
                  handleSearchSubmit={handleSearchSubmit}
                />
              </div>
            </div>
          </Grid>
          <Grid item style={{ paddingRight: 15 }}>
            {/* <Button
              variant="contained"
              onClick={onAddInventory}
              className={classes.greenBtn}>
              <AddIcon /> ADD INVENTORY
            </Button> */}
            <TextButton type="Icon" onClick={onAddInventory}><AddIcon />ADD INVENTORY</TextButton>
            
          </Grid>
        </Grid>
        <Box display="flex" alignItems="center">
          <Typography className={classes.legend}>LEGEND</Typography>
          <Box display="flex" alignItems="center">
            <DotType type="Vaccine" />
            <Typography className={classes.legendLabel}>VACCINE</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <DotType />
            <Typography className={classes.legendLabel}>LAB</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <DotType type="Rapid" />
            <Typography className={classes.legendLabel}>ANTIGEN</Typography>
          </Box>
          
        </Box>
      </div>

      <CustomTable
        metaData={metaData}
        loading={loading}
        CustomTableData={CustomTableData}
        data={inventoryList}
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
        hover={false}
      />

      <AddInventory
        dialogOpen={openAddInventory}
        onDialogClose={onAddInventoryDialogClose}
        locations={locations}
      />

      <DialogAlert
        open={confirmDialogOpen}
        type={appConstants.DIALOG_TYPE_CONFIRMATION}
        title={'Are you sure ?'}
        message={`Do you want to Delete ${selectedItem.name}?`}
        onClose={handleDialogClose}
        onAction={handleDeleteDialogAction}
      />

      <InventoryDialog
        dialogOpen={inventorydialog}
        onDialogClose={handleInventoryDialog}
        inventoryId={inventoryId}
        locations={locations}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  locations: state.data.locations
});

InventoryManager.propTypes = {
  getLocations1: PropTypes.func.isRequired,
  getAllInventory: PropTypes.func.isRequired,
  deleteInventory: PropTypes.func.isRequired,
  getInventoryCounts: PropTypes.func.isRequired,
  getInventoryManufacturer: PropTypes.func.isRequired,
  searchInventory: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getAllInventory, deleteInventory, getInventoryCounts, getLocations1, getInventoryManufacturer, searchInventory })(InventoryManager);
