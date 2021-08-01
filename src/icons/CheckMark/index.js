import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function CheckMark(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 18 17">
        <path d="M18 2.095L15.371 0 6.686 11.57 2.514 6.551 0 8.795 6.829 17z"></path>
      </svg>
    </SvgIcon>
  );
}
