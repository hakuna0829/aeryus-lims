import React from 'react';
import NumberFormat from 'react-number-format';
import { TextField } from '@material-ui/core';

const ZipCodeInput = (props) => {
  return (
    <NumberFormat
      customInput={TextField}
      // format={props.value.length === 5 ? "#####" : "##### ####"}
      format={"#####"}
      mask=" "
      {...props}
    />
  )
}

export default ZipCodeInput;
