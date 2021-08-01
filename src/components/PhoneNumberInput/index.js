import React from 'react';
import NumberFormat from 'react-number-format';
import { TextField } from '@material-ui/core';

const PhoneNumberInput = (props) => {
  return (
    <NumberFormat
      customInput={TextField}
      format="### ### ####"
      mask=" "
      {...props}
    />
  )
}

export default PhoneNumberInput;

