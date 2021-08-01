import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import ReactApexChart from 'react-apexcharts';

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
}))
export default function LineChart(props) {
    // console.log(props)
    const classes = useStyles();
    //   const [loaded, setLoaded] = React.useState(false);
    const [lineSeries, setLineSeries] = React.useState(props.seriesData);
    const chartRef = React.useRef();
    const [lineOptions, setLineOption] = React.useState({});

    useEffect(() => {
        setLineSeries(props.seriesData);
    }, [props.seriesData]);

    useEffect(() => {
        // Handler to call on window resize

        function handleResize() {
            setLineOption({
                chart: {
                    type: 'line',
                    height: 320,
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                colors: props.colors,
                xaxis: {
                    categories: props.label,
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
    }, [props]); // Empty array ensures that effect is only run on mount

    return (
        <div className={classes.root} ref={chartRef}>
            <ReactApexChart
                options={lineOptions}
                series={lineSeries}
                type="line"
                height={355}
            />
        </div>
    )
};
