import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Chart } from "react-google-charts";
import { CircularProgress } from '@material-ui/core';
import brandStyles from 'theme/brand';

const useStyles = makeStyles(() => ({
  root: {
    padding: 15,
    width: 'calc(100% - 15px)'
  },
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const AgeRiskChart = props => {
  const { value } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [data, setData] = useState([['', '',]]);

  useEffect(() => {
    if (value) {
      let chartData = [['', '',]];
      value.forEach(x => {
        chartData.push([x.age, x.count]);
      });
      setData(chartData);
      // let dummy = [
      //   ['', '',],
      //   ['20-25', 150],
      //   ['25-30', 220],
      //   ['30-35', 250],
      //   ['35-40', 310],
      //   ['40-45', 420],
      //   ['45-50', 680],
      //   ['50-55', 480],
      //   ['55-60', 380],
      //   ['60-65', 80],
      //   ['65-70', 180],
      // ];
      // setData(dummy);
    }
  }, [value]);

  return (
    <div className={classes.root}>
      {value
        ?
        <Chart
          width={'100%'}
          height={'565px'}
          chartType="Bar"
          loader={<CircularProgress className={brandClasses.fetchProgressSpinner} />}
          data={data}
          options={{
            // Material design options
            chart: {
              title: '',
              subtitle: '',
            },
            hAxis: { title: 'Year', color: '#0F84A9' },
            colors: ['#0F84A9'],

          }}
          // For tests
          rootProps={{ 'data-testid': '2' }}
        />
        :
        <CircularProgress className={brandClasses.fetchProgressSpinner} />
      }
    </div>

  );
};

AgeRiskChart.propTypes = {
  value: PropTypes.array
};

export default AgeRiskChart;
