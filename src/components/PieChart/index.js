import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import ReactApexChart from 'react-apexcharts';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
    margin:'15px 30px',
    [theme.breakpoints.up('lg')]: {
      margin:'30px auto',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      margin:'30px auto',
    },
    [theme.breakpoints.down('sm')]: {
      margin:'20px 10px 10px',
    },
  },
  container: {
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    boxShadow: `4px 4px 8px 2px ${theme.palette.brandBackLight}`,
  },
  label: {
    color: '#0F84A9',
    textAlign: 'center',
    margin:'15px auto 30px',
    [theme.breakpoints.up('lg')]: {
      fontSize:'26px'
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize:'22px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize:'18px'
    },
  }
}))
export default function SemiPieChart(props) {
  // console.log(props)
  const classes = useStyles();
  
  const [pieSeries] = React.useState([props.value]);
  const chartRef = React.useRef();
  // const [chartSize, setChartSize] = React.useState({
  //   width: undefined,
  //   height: undefined,
  // });
  const [pieOptions,setPieOption] = React.useState({});
 
  useEffect(() => {
    // Handler to call on window resize
  
    function handleResize() {
      // Set window width/height to state
      const tempWidth = chartRef.current.offsetWidth;
     
      // setChartSize({
      //   width: tempWidth,
      //   height: tempWidth,
      // });
      setPieOption({
        chart: {
          type: 'radialBar',
          offsetY: -20,
          sparkline: {
            enabled: true
          }
        },
        colors: [props.color],
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#CECECE",
              strokeWidth: '97%',
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#999',
                opacity: 1,
                blur: 2
              }
            },
            dataLabels: {
              name: {
                show: false
              },
              // enabled: true,
              value: {
                show: true,
                offsetY: -10,
                fontSize:  tempWidth > 400 ? '50px' : '25px',
                fontWeight: 600,
                color: '#0F84A9',
                fontFamily: 'Montserrat',
              },
              formatter: function (val) {
                return val + "%"
              },
    
    
            }
          }
        },
        grid: {
          padding: {
            top: -10
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: '#FF931E'
          },
        },
        // labels: ['Average Results'],
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [props.color]); // Empty array ensures that effect is only run on mount
  
  return (
    <div className={classes.root}>
      <div className={classes.container} ref={chartRef}> 
        <div>
          <Typography variant="h4" className={classes.label}>{props.label}</Typography>
        </div>
        <ReactApexChart options={pieOptions} series={pieSeries} type="radialBar" />
      </div>
    </div>
  )
};

// export default SemiPieChart();
