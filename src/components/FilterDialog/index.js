import React from 'react';
// import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  // Button,
  Dialog,
  DialogContent,
  withStyles,
  Tooltip,
  Button,
  DialogActions,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import brandStyles from 'theme/brand';
import HelpIcon from '@material-ui/icons/Help';
import CheckButton from 'components/CheckButton';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div variant="h6">{children}</div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

// const useStyles = makeStyles(theme => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }));

const FilterDialog = (props) => {
  const { dialogOpen, onDialogClose, settings, onChange, onSubmit } = props;

  // const classes = useStyles();
  const brandClasses = brandStyles();

  const handleClose = () => {
    onDialogClose(false);
  };

  const handleSubmitClick = () => {
    onSubmit();
  }

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      maxWidth={'md'}
    >
      <DialogTitle onClose={handleClose} className={brandClasses.headerContainer}>
        <Typography component={'span'} className={brandClasses.headerTitle}>
          Filter Setting
          <sup>
            {' '}
            <Tooltip title={'Filter Setting'} placement="right-start">
              <HelpIcon />
            </Tooltip>{' '}
          </sup>
          &nbsp;&nbsp;
        </Typography>
      </DialogTitle>
      <DialogContent>
        {settings && settings !== [] ?
          settings.map((item, index) => (
            <div key={index}>
              <CheckButton label={item.label} checked={item.checked} onChange={(e) => onChange(index, e)} name={item.id} />
            </div>
          )) :
          <Typography >There is no any filter options.</Typography>
        }
        <br />
      </DialogContent>
      <DialogActions>
        <Button
          className={brandClasses.button}
          onClick={handleSubmitClick}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;