import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function Edit(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 42 42">
        <g>
          <path d="M14.372 21.671l-1.363 6.672a.545.545 0 00.646.646l6.673-1.363c.071-.072.215-.072.287-.144l14.277-14.276c.144-.144.144-.287 0-.43l-5.668-5.668c-.143-.144-.287-.144-.43 0L14.516 21.384c-.072.072-.072.216-.144.287z"></path>
          <path d="M36.138 25.476h-2.443c-.431 0-.79.359-.79.79v11.495H4.167V9.023h9.412c.43 0 .79-.359.79-.79V5.79c0-.43-.36-.79-.79-.79H2.084C.934 5 0 5.934 0 7.083v32.834C0 41.066.934 42 2.083 42h32.834C36.066 42 37 41.066 37 39.916V26.338a.874.874 0 00-.862-.862zm5.416-20.792L37.316.446c-.595-.595-1.487-.595-2.082 0L32.111 3.57a.452.452 0 000 .595l5.726 5.725a.452.452 0 00.594 0l3.123-3.123c.595-.595.595-1.487 0-2.082z"></path>
        </g>
      </svg>
    </SvgIcon>
  );
}