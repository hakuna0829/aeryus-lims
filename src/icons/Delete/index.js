import React from 'react';

import { SvgIcon } from '@material-ui/core';

export default function Delete(props) {
  return (
    <SvgIcon {...props}>
      <svg viewBox="0 0 24 25">
        <g fill="#546466">
          <path d="M9.719 2.358h3.677v.619h1.327v-.705c0-.685-.556-1.242-1.24-1.242H9.63c-.684 0-1.24.557-1.24 1.242v.705h1.328v-.619zm8.071 5.88H5.324a.585.585 0 00-.583.632l1.043 12.887c.058.72.658 1.273 1.379 1.273h8.789c.72 0 1.32-.554 1.379-1.273L18.373 8.87a.585.585 0 00-.583-.632zM8.343 21.656a.664.664 0 01-.704-.622l-.653-10.58a.664.664 0 011.326-.081l.652 10.58a.664.664 0 01-.621.703zm3.886-.663a.664.664 0 01-1.328 0v-10.58a.664.664 0 111.328 0v10.58zm3.9-10.54l-.624 10.58a.664.664 0 11-1.326-.079l.624-10.58a.663.663 0 111.325.079zm3.957-4.263l-.436-1.308a.844.844 0 00-.8-.577H4.264a.844.844 0 00-.8.577l-.437 1.307a.547.547 0 00.52.721h16.019a.547.547 0 00.52-.721z"></path>
        </g>
      </svg>
    </SvgIcon>
  );
}