import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

const PhoneNumberFormat = (props) => {
  return (
    <NumberFormat value={props.value} displayType={'text'} format="###-###-####" />
  )
}

PhoneNumberFormat.propTypes = {
  value: PropTypes.string,
}

export default PhoneNumberFormat;

