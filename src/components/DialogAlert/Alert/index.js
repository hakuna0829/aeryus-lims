import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const Alert = props => {

  const { open, title, subTitle, message, onClose } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
            <br></br>
            {subTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

Alert.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Alert;