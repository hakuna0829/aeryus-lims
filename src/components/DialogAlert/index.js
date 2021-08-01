import React from 'react';
import PropTypes from 'prop-types';
import * as appConstants from 'constants/appConstants';
import Alert from './Alert';
import Confirmation from './Confirmation';

const DialogAlert = props => {

  const { open, type, title, subTitle, message, onClose, onAction } = props;

  return (
    <div>
      {type === appConstants.DIALOG_TYPE_ALERT ?
        <Alert
          open={open}
          title={title}
          subTitle={subTitle}
          message={message}
          onClose={onClose}
        />
        : null}
      {type === appConstants.DIALOG_TYPE_CONFIRMATION ?
        <Confirmation
          open={open}
          title={title}
          subTitle={subTitle}
          message={message}
          onClose={onClose}
          onAction={onAction}
        />
        : null}
    </div>
  )
};
DialogAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  onClose: PropTypes.any
};

export default DialogAlert;