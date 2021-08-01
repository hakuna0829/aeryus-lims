import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function Profile(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 22 23">
        <g transform="translate(0 .778)">
          <ellipse cx="11.2" cy="6.535" rx="6.333" ry="6.147"></ellipse>
          <path d="M16 12.035a7.501 7.501 0 01-9.467 0 11.048 11.048 0 00-6.066 9.383H22c-.133-4.142-2.533-7.636-6-9.383z"></path>
        </g>
      </svg>
    </SvgIcon>
  );
}
