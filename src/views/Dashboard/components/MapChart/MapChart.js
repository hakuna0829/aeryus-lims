import React, { useState, useEffect } from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

import allStates from "./allStates.json";
import { getStates } from "helpers/index.js";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// const offsets = [
//   { location: 'NY', value: 10, cord: [42.933334, -76.566666] },
//   // { location:'TN', value: 20},
//   { location: 'GA', value: 30, cord: [33.247875, -83.441162] },
//   { location: 'FL', value: 40, cord: [27.192223, -80.243057] },
//   { location: 'AZ', value: 20, cord: [34.048927, -111.093735] },
// ];

const MapChart = (props) => {
  const { value } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (value) {
      let chartData = [];
      value.forEach(v => {
        let location = getStates.find(s => s.text === v.state);
        // TODO: AS state is giving error, find others too
        if (location && location.value !== 'AS')
          chartData.push({ location: location.value, value: v.count });
      });
      setData(chartData);
    }
  }, [value]);

  return (
    <div>
      <ComposableMap projection="geoAlbersUsa" className={props.class}>
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map(geo => {
                const cur = allStates.find(s =>
                  s.val === geo.id //&& s.id === data.location
                );
                const activeState = data.find(offset => offset.location === cur.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#043B5D"
                    geography={geo}
                    fill={activeState ? "#0F84A9" : "#fff"}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  ></Geography>
                )
              })}
              {/* eslint-disable-next-line */}
              {geographies.map(geo => {
                const centroid = geoCentroid(geo);
                const cur = allStates.find(s => s.val === geo.id);
                const activeState = data.find(offset => offset.location === cur.id);
                if (activeState) {
                  return (
                    <Marker key={geo.rsmKey + "-name"} coordinates={centroid}>
                      <g
                        fill="#ED1C24"
                        stroke="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(-12, -24)"
                      >
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                      </g>
                      <g
                        fill="#ED1C24"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(-12, -24)"
                      >
                        <circle cx="12" cy="10" r="3" />
                      </g>
                      <text y="2" fontSize={14} textAnchor="middle">
                        {/* {cur.id} */}
                      </text>
                    </Marker>
                  )
                }
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
