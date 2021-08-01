import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as appConstants from 'constants/appConstants';
import Alert from './Alert';
import Confirmation from './Confirmation';

const ReduxDialogAlert = props => {

  const { open, type, title, subTitle, message, onClose, onAction } = props.dialog;

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

const mapStateToProps = state => ({
  dialog: state.dialog
});

ReduxDialogAlert.propTypes = {
  dialog: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ReduxDialogAlert);