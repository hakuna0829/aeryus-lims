import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ReactApexChart from 'react-apexcharts';
import { CircularProgress } from "@material-ui/core";
import brandStyles from 'theme/brand';

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
  container: {
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
  },
  label: {
    color: '#0F84A9',
    textAlign: 'center',
    margin: '15px auto 30px',
    [theme.breakpoints.up('lg')]: {
      fontSize: '26px'
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '22px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    },
  },
  yAxisStyle: {
    color: '#0F84A9',
    fontSize: 12,
    fontFamily: 'Montserrat'
  }
}));

const barColors = ['#FDCA21', '#0F84A9', '#3ECCCD', '#25DD83'];

const LocationRiskChart = (props) => {
  const { value } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const chartRef = useRef();

  const [barOptions, setBarOption] = useState({});
  const [dataLabels, setDataLabels] = useState(['']);
  const [data, setData] = useState([{ data: [] }]);

  // const [categoryBarLabel] = useState(['Atlanta', 'Boston', 'Clevland', 'Detroit', 'Fayettville', 'Knoxville', 'Miami', 'New York']);
  // const [barSeries] = React.useState([{ data: [230, 130, 400, 170, 340, 280, 190, 100] }]);

  useEffect(() => {
    if (value) {
      let chartLabels = [];
      let chartData = [];
      value.forEach(x => {
        chartLabels.push(x.state);
        chartData.push(x.count);
      });
      setDataLabels(chartLabels);
      setData([{ data: chartData }]);
    }
  }, [value]);

  useEffect(() => {
    // Handler to call on window resize

    function handleResize() {
      setBarOption({
        chart: {
          type: 'bar',
          height: 480
        },
        plotOptions: {
          bar: {
            barHeight: '70%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            },
            colors: {
              // ranges: [{
              //     from: 0,
              //     to: 300,
              //     color: 'undefined'
              // }],
              // backgroundBarColors: ['#CECECE','#CECECE','#CECECE','#CECECE'],
              backgroundBarOpacity: 1,
              backgroundBarRadius: 0,
            },
          }
        },
        colors: barColors,
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function (val, opt) {
            return val
          },
          offsetX: 0,
          dropShadow: {
            enabled: false
          }
        },
        stroke: {
          width: 0,
          colors: ['#fff']
        },
        xaxis: {
          categories: dataLabels,
        },
        yaxis: {
          labels: {
            // show: false
            style: {
              colors: ['#0F84A9', '#0F84A9', '#0F84A9', '#0F84A9', '#0F84A9', '#0F84A9', '#0F84A9', '#0F84A9'],
              fontSize: '12px',
              fontFamily: 'Montserrat',
              fontWeight: 400,
            },
          },
        },
        // title: {
        //     text: 'Custom DataLabels',
        //     align: 'center',
        //     floating: true
        // },
        // subtitle: {
        //     text: 'Category Names as DataLabels inside bars',
        //     align: 'center',
        // },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        }
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [dataLabels]); // Empty array ensures that effect is only run on mount

  return (
    <div className={classes.root} ref={chartRef}>
      {value
        ?
        <ReactApexChart
          options={barOptions}
          series={data}
          type="bar"
          height={500}
        />
        :
        <CircularProgress className={brandClasses.fetchProgressSpinner} />
      }
    </div>
  )
};

LocationRiskChart.propTypes = {
  value: PropTypes.array
};

export default LocationRiskChart;
