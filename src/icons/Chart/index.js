import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function Chart(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 22 22">
        <g>
          <path d="M6.21 6.486l6.584 2.718 4.2-5.638 1.532.705V.445L14.27 2.357l1.533.654-3.576 4.732-6.584-2.718-1.135 1.56-3.349 4.43v2.165l4.881-6.444zm6.8 4.467l-.273.406v7.612h4.631V6.64l-.653-.305-.327-.101z"></path>
          <path d="M8.105 18.97h4.632v-7.34l-.162-.05-4.47-1.872zM5.79 9.709l-3.446 5.028-1.185 1.747v2.488h4.631z"></path>
          <path d="M1.297 19.96V.445H0v20.843h22V19.96z"></path>
        </g>
      </svg>
    </SvgIcon>
  );
}
