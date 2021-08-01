import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import {
  Grid,
  Button,
  Typography,
  CircularProgress,
  useMediaQuery
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Department } from 'icons';
import { getDepartments, updateDepartment } from 'actions/api';
import { clearDepartments } from 'actions/clear';
import useWindowDimensions from 'helpers/useWindowDimensions';
import TextButton from 'components/Button/TextButton';

const cardLgWidth = 280;
// const cardMdWidth = 230;

const useStyles = makeStyles(theme => ({
  container: {
    padding: `0px ${theme.spacing(0)}px`
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2)
    // marginBottom: theme.spacing(2),
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 30
    }
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    color: theme.palette.brandText
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
  department: {
    margin: '50px 0'
  },
  departmentGrid: {
    // margin: theme.spacing(2),
    // padding: 15,
    // border: `1px solid ${theme.palette.brand}`,
    // borderRadius: 8,
    margin: '0 auto',
    // maxWidth: cardLgWidth,
    width: '100%',
    // boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)',
    [theme.breakpoints.up('lg')]: {
      // maxWidth: cardLgWidth,
    },
    [theme.breakpoints.down('md')]: {
      // maxWidth: cardLgWidth,
    }
  },
  departmentGridGray: {
    border: `1px solid ${theme.palette.brandGray}`,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)'
  },
  activeDepartmentIcon: {
    fontSize: 112,
    color: theme.palette.brandDark,
    stroke: theme.palette.brandDark
  },
  inActiveDepartmentIcon: {
    fontSize: 112,
    color: theme.palette.brandGray,
    stroke: theme.palette.brandGray
  },
  activeDepartmentText: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '80%',
    whiteSpace: 'nowrap',
    margin: '0 auto'
  },
  inActiveDepartmentText: {
    color: theme.palette.brandGray,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '80%',
    whiteSpace: 'nowrap',
    margin: '0 auto'
  },
  activateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandGreen,
    borderColor: theme.palette.brandGreen,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none'
  },
  deactivateButton: {
    margin: '10px auto 5px',
    color: theme.palette.brandRed,
    borderColor: theme.palette.brandRed,
    borderRadius: 10,
    lineHeight: '18px',
    textTransform: 'none'
  },
  viewLink: {
    color: theme.palette.brandDark,
    fontSize: 14,
    textDecoration: 'underline',
    textTransform: 'capitalize',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  colorGray: {
    color: '#9B9B9B !important' // remove important
  },
  locationGrid: {
    margin: theme.spacing(2),
    padding: 15,
    border: `1px solid ${theme.palette.brandDark}`,
    borderRadius: 8,
    // maxHeight: 260,
    maxWidth: 260,
    boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)',
    position: 'relative'
  }
}));

const DepartmentManager = props => {
  const {
    departments,
    getDepartments,
    updateDepartment,
    clearDepartments
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const cardContainerRef = React.useRef();
  // const cardItemRef = React.useRef();
  const [containerWidth, setContainerWidth] = useState(0);
  // const [cardItemWidth, setCardItemWidth] = useState(0);
  const [cardCountRow, setCardCountRow] = useState(0);
  const [cardPadding, setCardPadding] = useState(0);
  const [emptyCardCount, setEmptyCardCount] = useState(0);
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const mobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  // const offset = 48;

  useEffect(() => {
    const perRow = mobileScreen
      ? parseInt((width - 16 * 3) / (260 + 16 * 2))
      : parseInt((width - 260 - 16 * 3) / (260 + 16 * 2));
    const tempEmptyCardCounts = departments
      ? perRow - (departments.length % perRow)
      : 0;
    setEmptyCardCount(tempEmptyCardCounts);
    // console.log('tempEmptyCardCounts', tempEmptyCardCounts)
  }, [width, departments, mobileScreen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleResize() {
      // Set window width/height to state
      const tempContainerWidth = cardContainerRef.current.offsetWidth;
      // console.log('cardContainer -- ', cardContainerRef.current.offsetWidth)
      // console.log('cardItem -- ', Math.floor(tempContainerWidth/(cardLgWidth+16)));
      // const itemWidth = cardItemRef.current;
      setContainerWidth(tempContainerWidth);
      // setCardItemWidth(Math.floor((tempContainerWidth - 3*offset)/4));
      setCardCountRow(Math.floor(tempContainerWidth / cardLgWidth));
      setCardPadding(
        Math.floor((tempContainerWidth % cardLgWidth) / (cardCountRow - 1)) - 1
      );
      // console.log('---cardPadding-- ', cardPadding)
      // if(cardPadding < 48){

      //   setCardPadding(Math.floor (tempContainerWidth%cardItemWidth / (cardCountRow - 2)) - 1);
      //   setCardCountRow(cardCountRow - 1);
      // }

      // console.log('containerWidth', tempContainerWidth)
      // console.log('cardItemWidth', cardItemWidth)
      // console.log('cardCountRow', cardCountRow)
      // console.log('cardPadding', cardPadding)
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [cardPadding, cardCountRow, containerWidth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleResize() {
      // Set window width/height to state
      // const tempCardItemWidth = cardItemRef.current.offsetWidth;
      // console.log('--- tempcard item  -- ', cardItemRef.current);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!departments) await getDepartments();
    }
    fetchData();
  }, [departments, getDepartments]);

  const handleStatusUpdate = async (id, active) => {
    let res = await updateDepartment(id, { active });
    if (res.success) {
      await clearDepartments();
    }
  };

  return (
    <div>
      <div className={classes.header}>
        <div className={classes.subHeader}>
          <img
            alt=""
            src="/images/svg/building_icon_2.svg"
          />
          &ensp;
          <Typography
            className={brandClasses.headerTitle}
            variant="h2"
          >
            Site Manager |
          </Typography>
          <Typography
            className={classes.headerSubTitle}
            variant="h4"
          >
            {'DEPARTMENT MANAGER'}
          </Typography>
        </div>
        {/* <Button
          className={classes.greenBtn}
          component={Link}
          startIcon={<AddIcon />}
          to="/site-manager/add-department"
          variant="contained"
        >
          ADD DEPARTMENT
        </Button> */}
        <TextButton
          category="Icon"
          component={Link}
          startIcon={<AddIcon />}
          to="/site-manager/add-department"
        >
          ADD DEPARTMENT
        </TextButton>
      </div>

      <div className={classes.container}>
        <Grid
          container
          ref={cardContainerRef}
        >
          {!departments ? (
            <CircularProgress className={brandClasses.fetchProgressSpinner} />
          ) : !departments.length ? (
            <Typography
              className={brandClasses.headerTitle}
              variant="h2"
            >
              {'No data to display...'}
            </Typography>
          ) : (
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="space-between"
            >
              {departments.map((department, index) => (
                <Grid
                  // alignItems="center"
                  className={classes.locationGrid}
                  item
                  key={index}
                  lg={3}
                  md={4}
                  sm={6}
                  xm={12}
                  // // container
                  // direction="column"
                  // justify="center"
                  // alignItems="center"

                  // spacing={2}
                  // ref={cardItemRef}
                  // style={index % cardCountRow !== 0 ? { marginLeft: cardPadding, marginBottom: cardPadding } : { marginLeft: 0, marginBottom: cardPadding }}
                >
                  <div
                    className={clsx(
                      classes.departmentGrid,
                      !department.active && classes.departmentGridGray
                    )}
                    style={{ textAlign: 'center' }}
                  >
                    <Department
                      className={
                        department.active
                          ? classes.activeDepartmentIcon
                          : classes.inActiveDepartmentIcon
                      }
                    />
                    <Typography
                      className={
                        department.active
                          ? classes.activeDepartmentText
                          : classes.inActiveDepartmentText
                      }
                      variant="h3"
                    >
                      {department.name}
                    </Typography>
                    <Typography
                      className={
                        department.active
                          ? classes.activeDepartmentText
                          : classes.inActiveDepartmentText
                      }
                      variant="h4"
                    >
                      {department.location_id && department.location_id.name}
                    </Typography>

                    <Grid
                      alignItems="center"
                      container
                      direction="row"
                      justify="space-between"
                      style={{ display: 'none' }}
                    >
                      <Button
                        className={classes.activateButton}
                        disabled={department.active}
                        onClick={() =>
                          handleStatusUpdate(department._id, true)
                        }
                        variant="outlined"
                      >
                        {'Activate'}
                      </Button>
                      <Button
                        className={classes.deactivateButton}
                        disabled={!department.active}
                        onClick={() =>
                          handleStatusUpdate(department._id, false)
                        }
                        variant="outlined"
                      >
                        {'Deactivate'}
                      </Button>
                    </Grid>
                    <br />

                    <Grid
                      alignItems="center"
                      container
                      direction="row"
                      justify="space-between"
                    >
                      <Button
                        className={clsx(
                          classes.viewLink,
                          !department.active && classes.colorGray
                        )}
                        component={Link}
                        to={`/site-manager/department-details?department_id=${department._id}`}
                      >
                        {'View Details'}
                      </Button>
                      <Button
                        className={clsx(
                          classes.viewLink,
                          !department.active && classes.colorGray
                        )}
                        component={Link}
                        to={`/site-manager/department-staff?department_id=${department._id}&department_name=${department.name}`}
                      >
                        {'View Staff'}
                      </Button>
                    </Grid>
                  </div>
                </Grid>
              ))}
              {[...Array(emptyCardCount)].map((x, i) => (
                <Grid
                  alignItems="center"
                  className={classes.locationGrid}
                  container
                  direction="column"
                  item
                  justify="center"
                  key={i}
                  lg={3}
                  md={3}
                  style={{ visibility: 'hidden' }}
                />
              ))}
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  departments: state.data.departments
});

DepartmentManager.propTypes = {
  getDepartments: PropTypes.func.isRequired,
  updateDepartment: PropTypes.func.isRequired,
  clearDepartments: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  getDepartments,
  updateDepartment,
  clearDepartments
})(DepartmentManager);
