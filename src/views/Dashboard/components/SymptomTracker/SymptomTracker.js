import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Box, Typography, CircularProgress } from "@material-ui/core";
import brandStyles from 'theme/brand';
import ItemsCarousel from 'react-items-carousel';
import moment from "moment";
import clsx from 'clsx';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

// var data = [
//   {
//     label: 'Fever or Chills',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
//   {
//     label: 'Difficulty breathing',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
//   {
//     label: 'Cough',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
//   {
//     label: 'Sore throat',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
//   {
//     label: 'Loss of smell/taste',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
//   {
//     label: 'Headache',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
//   {
//     label: 'Muscle or body aches',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   }, {
//     label: 'Congestion/runny nose',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   }, {
//     label: 'Nausea/Vomiting',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   }, {
//     label: 'Fatigue',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   }, {
//     label: 'Chest pain',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   }, {
//     label: 'Have you traveled outside the US in the past 14 days?',
//     data: [
//       { date: '2021-05-01', value: 2 },
//       { date: '2021-05-02', value: 1 },
//       { date: '2021-05-03', value: 6 },
//       { date: '2021-05-04', value: 2 },
//       { date: '2021-05-05', value: 16 },
//       { date: '2021-05-06', value: 1 },
//       { date: '2021-05-07', value: 21 },
//       { date: '2021-05-08', value: 1 }
//     ]
//   },
// ];

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
    // margin: '15px 30px',
    // [theme.breakpoints.up('lg')]: {
    //     margin: '30px auto',
    // },
    // [theme.breakpoints.between('md', 'lg')]: {
    //     margin: '30px auto',
    // },
    // [theme.breakpoints.down('sm')]: {
    //     margin: '20px 10px 10px',
    // },
  },
  labelColor: {
    width: '16px',
    height: '16px',
    marginRight: '5px'
  },
  bgColorGreen: {
    backgroundColor: '#90E0A9'
  },
  bgColorYellow: {
    backgroundColor: '#F9CE62'
  },
  bgColorNavy: {
    backgroundColor: '#FF9C40'
  },
  bgColorRed: {
    backgroundColor: '#E81A20'
  },
  colorGreen: {
    color: '#90E0A9'
  },
  colorYellow: {
    color: '#F9CE62'
  },
  colorNavy: {
    color: '#FF9C40'
  },
  colorRed: {
    color: '#E81A20'
  },
  label: {
    color: theme.palette.brandDisableGray,
    fontWeight: 500,
    fontSize: '10px',
    fontFamily: 'Montserrat'
  },
  trackerLabel: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '15px',
    padding: '12px',
    color: theme.palette.brandDark,
    border: '0.5px solid #D8D8D8',
    borderBottom: 'none',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      borderBottom: '0.5px solid #D8D8D8'
    }
  },
  trackerValue: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '16px',
    border: '0.5px solid #D8D8D8',
    borderLeft: 0,
    borderBottom: 0,
    // '&:last-child':{
    // borderBottom: '0.5px solid #D8D8D8'
    // },
    '&:nth-last-child(2)': {
      borderBottom: '0.5px solid #D8D8D8'
    }
  },
  trackerDateLabel: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    color: theme.palette.brandDark
  },
  chevronLeftContanier: {
    top: 'unset',
    bottom: '8px',
    height: 'auto',
    left: '-20px'
  },
  chevronRightContanier: {
    top: 'unset',
    bottom: '8px',
    height: 'auto',
    right: '-20px'
  }

}));

const SymptomTracker = (props) => {
  const { value } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const chevronWidth = 25;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [data, setData] = useState([]);
  const [dateArr, setDateArr] = useState([]);

  useEffect(() => {
    if (value) {
      setData(value);
      setDateArr(value[0].data);
    }
  }, [value]);

  const ColorLabel = (color, label) => {
    return (
      <Box display="flex" alignItems="center" marginRight="20px">
        {color === 'green' && <div className={clsx(classes.labelColor, classes.bgColorGreen)}>&nbsp;</div>}
        {color === 'yellow' && <div className={clsx(classes.labelColor, classes.bgColorYellow)}>&nbsp;</div>}
        {color === 'navy' && <div className={clsx(classes.labelColor, classes.bgColorNavy)}>&nbsp;</div>}
        {color === 'red' && <div className={clsx(classes.labelColor, classes.bgColorRed)}>&nbsp;</div>}
        <Typography className={classes.label}>{label}</Typography>
      </Box>
    )
  };

  const ColorValue = ({ value }) => {
    return (
      <span
        className={
          value > 20 ?
            classes.colorRed :
            value > 10 ?
              classes.colorNavy :
              value > 5 ?
                classes.colorYellow : classes.colorGreen
        }
      >{value}</span>
    )
  };

  const TableDateColumn = ({ item, type }) => {
    return (
      <div className={type ? classes.trackerDateLabel : classes.trackerValue}>
        {!type
          ? <ColorValue value={item} />
          : moment(item, 'YYYY-MM-DD').format("MMMM") + ' ' + moment(item, 'YYYY-MM-DD').format("D")
        }
      </div>
    )
  };

  return (
    <>
      <Box display="flex" justifyContent="center" marginTop="16px">
        {ColorLabel('green', 'Low 5% or less')}
        {ColorLabel('yellow', 'Med 6-10% or less')}
        {ColorLabel('navy', 'High 11-20% or less')}
        {ColorLabel('red', 'High 20 ')}
      </Box>

      {value
        ?
        <Box display="flex" marginTop="20px">
          <Box textAlign="left" width="190px">
            {data.map((item, index) => (
              <div key={index} className={classes.trackerLabel}>{item.label}</div>
            ))}
          </Box>
          <div style={{ padding: `0px`, width: 'calc(100% - 190px)' }}>
            {dateArr.length !== 0 &&
              <ItemsCarousel
                requestToChangeActive={setActiveItemIndex}
                activeItemIndex={activeItemIndex}
                numberOfCards={matches ? 7 : 5}
                gutter={0}
                leftChevron={<ArrowLeftIcon style={{ color: '#989898' }} />}
                rightChevron={<ArrowRightIcon style={{ color: '#989898' }} />}
                outsideChevron
                chevronWidth={chevronWidth}
                classes={{ rightChevronWrapper: classes.chevronRightContanier, leftChevronWrapper: classes.chevronLeftContanier }}
              >
                {dateArr.map((dateItem, index) =>
                  <div key={index}>
                    {data.map((item, i) => (
                      <TableDateColumn item={item.data[index].value} key={i} />
                    ))}
                    <TableDateColumn item={dateItem.date} type="date" key={index} />
                  </div>
                )}
              </ItemsCarousel>
            }
          </div>
        </Box>
        :
        <CircularProgress className={brandClasses.fetchProgressSpinner} />
      }
    </>
  )
};

SymptomTracker.propTypes = {
  value: PropTypes.array
};

export default SymptomTracker;