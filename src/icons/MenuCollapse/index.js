import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function MenuCollapse(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 14 16">
        <g fill="none" stroke="#043B5D" opacity="0.5">
          <path
            strokeWidth="1.8"
            d="M5.8 13.65c0-.171.086-.3.173-.387l5.7-5.685-5.7-5.641a.545.545 0 010-.776.548.548 0 01.777 0l6.088 6.073a.545.545 0 010 .775L6.75 14.04a.548.548 0 01-.777 0 .545.545 0 01-.173-.388z"
          ></path>
          <path strokeLinecap="round" strokeWidth="3" d="M1.6 1.6v12.16"></path>
        </g>
      </svg>
    </SvgIcon>
  );
}
