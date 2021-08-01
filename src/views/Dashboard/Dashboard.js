import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import { Grid, Typography, FormControl, Select, MenuItem, InputLabel, Box, useMediaQuery } from '@material-ui/core';
// import OrderBox from "../../components/OrderBox";
import BlueBox from '../../components/BlueBox';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getDashboardCounts, getDashboardSymptomTracker, getDashboardAgeRisk, getDashboardLocationRisk, getLocations1 } from 'actions/api';
import clsx from 'clsx';

import {
  StaticBox,
  // MapChart,
  AgeRiskChart,
  SymptomTracker,
  // LocationRiskChart,
  GoogleMapChart
} from './components';

const defaultCenter = {
  lat: 37.784546,
  lng: -122.433523
}

const data = [
  { lat: 37.782551, lng: -122.44536800000003 },
  { lat: 37.782745, lng: -122.44458600000002 },
  { lat: 37.782842, lng: -122.44368800000001 },
  { lat: 37.782919, lng: -122.442815 },
  { lat: 37.782992, lng: -122.44211200000001 },
  { lat: 37.7831, lng: -122.441461 },
  { lat: 37.783206, lng: -122.44082900000001 },
  { lat: 37.783273, lng: -122.44032400000003 },
  { lat: 37.783316, lng: -122.440023 },
  { lat: 37.783357, lng: -122.439794 },
  { lat: 37.783371, lng: -122.43968699999999 },
  { lat: 37.783368, lng: -122.43966599999999 },
  { lat: 37.783383, lng: -122.439594 },
  { lat: 37.783508, lng: -122.439525 },
  { lat: 37.783842, lng: -122.43959100000001 },
  { lat: 37.784147, lng: -122.43966799999998 },
  { lat: 37.784206, lng: -122.439686 },
  { lat: 37.784386, lng: -122.43979000000002 },
  { lat: 37.784701, lng: -122.43990200000002 },
  { lat: 37.784965, lng: -122.43993799999998 },
  { lat: 37.78501, lng: -122.43994700000002 },
  { lat: 37.78536, lng: -122.439952 },
  { lat: 37.785715, lng: -122.44002999999998 },
  { lat: 37.786117, lng: -122.44011899999998 },
  { lat: 37.786564, lng: -122.44020899999998 },
  { lat: 37.786905, lng: -122.44027 },
  { lat: 37.786956, lng: -122.44027900000003 },
  { lat: 37.800224, lng: -122.43351999999999 },
  { lat: 37.800155, lng: -122.434101 },
  { lat: 37.80016, lng: -122.43443000000002 },
];

const locatinLinks = [
  { label: 'Location1', href: '#' },
  { label: 'Location2', href: '#' },
  { label: 'Location3', href: '#' },
  { label: 'Location4', href: '#' },
  { label: 'Location5', href: '#' }
]

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`
  },
  mapClass: {
    width: '80%',
    height: '100%',
    marginTop: -30,
    [theme.breakpoints.down('sm')]: {
      marginTop: -10,
    },
  },
  testInventoryTypography: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    padding: theme.spacing(2),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  orangeBoard: {
    marginBottom: 30,
    width: '100%',
    backgroundColor: '#FF931E',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
    '& h1, h3, h6': {
      color: '#fff',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      // marginBottom:0,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '70%',
    },
    [theme.breakpoints.down('sm')]: {

    },
  },
  skyBlueBoard: {
    marginBottom: 30,
    width: '100%',
    backgroundColor: '#3ECCCD',
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
    '& h1, h3, h6': {
      color: '#fff',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '70%',
    },
  },
  stateMapContainer: {
    border: 'solid 1px rgba(15,132,169,0.8)',
    borderRadius: 10,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  typography: {
    color: theme.palette.brandDark,
    paddingTop: '10px',
    textAlign: 'center',
    fontWeight: 600,
    [theme.breakpoints.up('lg')]: {
      paddingTop: '20px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      paddingTop: '15px',
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: '10px',
    },
  },
  barChartTitle: {
    color: '#0F84A9',
    marginBottom: '5px'
  },
  barChartTitle2: {
    color: '#0F84A9',
    fontSize: '16px',
    fontWeight: 500
  },
  barChartSubTitle: {
    color: '#3ECCCD',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'

  },
  topBoxRoot: {
    width: 'calc(20% - 15px)',
    marginRight: 15,
    '&:last-child': {
      marginRight: 0,
    },
    // [theme.breakpoints.up('md')]: {
    //   width:'calc(33% - 15px)',
    //   marginRight:15,
    //   marginBottom:15,
    // },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 'calc(33% - 15px)',
      marginRight: 15,
      marginBottom: 15,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: 0,
      marginBottom: 15,
    },
  },
  mapContainer: {
    padding: 0,
    '& > div': {
      position: 'relative',
      height: 650
    }
  },
  locationLink: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '29px',
    textDecoration: 'underline',
    color: theme.palette.brandText,
    borderRight: '1px solid #D8D8D8',
    paddingLeft: '8px',
    paddingRight: '8px',
    cursor: 'pointer',
    '&:first-child': {
      paddingLeft: '0px',
    },
    '&:last-child': {
      borderRight: 'none',
      paddingRight: '0px',
    }
  },
  iconColor:{
    color:theme.palette.brandDark
  },
  flexControl:{
    display:'flex !important'
  }
}));

const Dashboard = (props) => {
  const { getDashboardCounts, getDashboardSymptomTracker, getDashboardAgeRisk, getDashboardLocationRisk, getLocations1, dashboardCounts, dashboardSymptomTracker, dashboardAgeRisk, dashboardLocationRisk, locations } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [formState, setFormState] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!dashboardCounts)
        await getDashboardCounts();
      if (!dashboardSymptomTracker)
        await getDashboardSymptomTracker();
      if (!dashboardAgeRisk)
        await getDashboardAgeRisk();
      if (!dashboardLocationRisk)
        await getDashboardLocationRisk();
      if (!locations)
        await getLocations1();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  // eslint-disable-next-line react/no-multi-comp
  const LocationLink = ({ item }) => {
    return (
      <Typography className={classes.locationLink}>{item.label}</Typography>
    )
  }

  return (
    <div className={classes.root}>
      <Box width="200px" marginBottom="24px">
        <FormControl
          variant="outlined"
          // required
          // style={{display:'flex !important'}}
          className={clsx(brandClasses.shrinkTextField, classes.flexControl)}
        >
          <InputLabel shrink className={brandClasses.selectShrinkLabel}>Population Type</InputLabel>
          <Select
            onChange={handleChange}
            label="Population Type"
            name="populationType"
            IconComponent={KeyboardArrowDownIcon}
            displayEmpty
            value={formState.populationType || ''}
            classes={{ select: brandClasses.selected, icon: classes.iconColor }}
          >
            <MenuItem value=''>
              <Typography className={brandClasses.selectDarkPlaceholder}>Choose a Population</Typography>
            </MenuItem>
            <MenuItem value="employees">Employees</MenuItem>
            <MenuItem value="visitors">Visitors</MenuItem>
            <MenuItem value="patients">Patients</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {matches
        ?
        <>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"

          >
            <BlueBox class={classes.topBoxRoot} key={'totalEmployees'}>
              <StaticBox value={2500} label="Total Employees" type="percent" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'postiveResults'}>
              <StaticBox value={55} label="Positive Results" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'testsPerformed'}>
              <StaticBox value={3000} label="Tests Performed" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'vaccineRate'}>
              <StaticBox value={5} label="Vaccine Rate%" type="percent" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'phase1Vaccine'}>
              <StaticBox value={100} label="Phase 1 Vaccine" />
            </BlueBox>
          </Grid>

          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"

          >
            <BlueBox class={classes.topBoxRoot} key={'positivityRate'}>
              <StaticBox value={20} label="Positivity Rate" type="percent" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'negativeResults'}>
              <StaticBox value={755} label="Negative Results" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'locations'}>
              <StaticBox value={5} label="Locations" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'notVaccinated'}>
              <StaticBox value={2350} label="Not Vaccinated" />
            </BlueBox>
            <BlueBox class={classes.topBoxRoot} key={'phase2Vaccine'}>
              <StaticBox value={50} label="Phase 2 Vaccine" />
            </BlueBox>
          </Grid>
        </>
        :
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"

        >
          <BlueBox class={classes.topBoxRoot} key={'totalEmployees'}>
            <StaticBox value={2500} label="Total Employees" type="percent" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'postiveResults'}>
            <StaticBox value={55} label="Positive Results" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'testsPerformed'}>
            <StaticBox value={3000} label="Tests Performed" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'vaccineRate'}>
            <StaticBox value={5} label="Vaccine Rate%" type="percent" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'phase1Vaccine'}>
            <StaticBox value={100} label="Phase 1 Vaccine" />
          </BlueBox>

          <BlueBox class={classes.topBoxRoot} key={'positivityRate'}>
            <StaticBox value={20} label="Positivity Rate" type="percent" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'negativeResults'}>
            <StaticBox value={755} label="Negative Results" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'locations'}>
            <StaticBox value={5} label="Locations" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'notVaccinated'}>
            <StaticBox value={2350} label="Not Vaccinated" />
          </BlueBox>
          <BlueBox class={classes.topBoxRoot} key={'phase2Vaccine'}>
            <StaticBox value={50} label="Phase 2 Vaccine" />
          </BlueBox>
        </Grid>
      }

      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
          {/* <UsersByDevice /> */}
          <BlueBox>
            <Typography className={classes.barChartTitle} variant="h4">
              Symptom Tracker
            </Typography>
            <Typography className={classes.barChartTitle2}>Number of employees affected</Typography>
            <SymptomTracker value={dashboardSymptomTracker} />
          </BlueBox>

        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
          <BlueBox>
            <Typography className={classes.barChartTitle} variant="h4">
              Age Distribution of Employees | <span className={classes.barChartSubTitle}>AT-RISK</span>
            </Typography>
            <AgeRiskChart value={dashboardAgeRisk} />
          </BlueBox>
        </Grid>
      </Grid>

      <Grid container>
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          {/* <MapDistributionOfUsers /> */}
          <Typography className={classes.typography} variant="h4">Location Explorer</Typography>

          <Box textAlign="center">
            <Typography className={classes.barChartTitle2}>Click any location icon to view more details or use the quick links to zoom in below</Typography>
          </Box>
          <Box margin="10px auto" display="flex" justifyContent="center">
            {locatinLinks.map((location, index) => <LocationLink item={location} key={index} />)}
          </Box>
          <BlueBox class={classes.mapContainer}>
            {/* <MapChart class={classes.mapClass} value={locations} /> */}
            <GoogleMapChart
              defaultCenter={defaultCenter}
              locations={data}
              zoomLevel={13}
            />
            {/* include it here */}
          </BlueBox>
        </Grid>

      </Grid>
    </div>
  );
};

const mapStateToProps = state => ({
  dashboardCounts: state.data.dashboardCounts,
  dashboardSymptomTracker: state.data.dashboardSymptomTracker,
  dashboardAgeRisk: state.data.dashboardAgeRisk,
  dashboardLocationRisk: state.data.dashboardLocationRisk,
  locations: state.data.locations,
});

Dashboard.propTypes = {
  getDashboardCounts: PropTypes.func.isRequired,
  getDashboardSymptomTracker: PropTypes.func.isRequired,
  getDashboardAgeRisk: PropTypes.func.isRequired,
  getDashboardLocationRisk: PropTypes.func.isRequired,
  getLocations1: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { getDashboardCounts, getDashboardSymptomTracker, getDashboardAgeRisk, getDashboardLocationRisk, getLocations1 })(Dashboard);
