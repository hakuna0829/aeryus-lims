import React from 'react'
import { Map, HeatMap, GoogleApiWrapper } from "google-maps-react";
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@material-ui/core';
// import { Icon } from '@iconify/react'
// import locationIcon from '@iconify/icons-mdi/map-marker'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%'
    },
}))

const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)"
];

const GoogleMapChart = ({ defaultCenter, locations, zoomLevel, google }) => {
    const classes = useStyles();


    // const onLoad = React.useCallback(function callback(map) {
    //     const bounds = new window.google.maps.LatLngBounds();
    //     map.fitBounds(bounds);
    //     setMap(map)
    // }, [])

    // const onUnmount = React.useCallback(function callback(map) {
    //     setMap(null)
    // }, [])
    // console.log( new window.google.maps.Geocoder(37.782, -122.447) )



    return (
        locations
            ?
            <Map
                google={google}
                className={classes.root}
                zoom={zoomLevel}
                initialCenter={defaultCenter}
            //   onReady={this.handleMapReady}
            >
                <HeatMap
                    gradient={gradient}
                    positions={locations}
                    opacity={1}
                    radius={20}
                />
            </Map>
            :
            <CircularProgress />
    )
}

// export default React.memo(GoogleMapChart)
export default GoogleApiWrapper({
    apiKey: "AIzaSyCt0Rt5bglANCaTrRfFamaXu_FvKWJQ6W0",
    libraries: ["visualization"]
})(GoogleMapChart);