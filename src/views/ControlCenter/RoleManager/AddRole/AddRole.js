import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Dialog, DialogContent, withStyles, Grid, TextField } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import brandStyles from 'theme/brand';

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
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  headerTitle: {
    marginLeft: theme.spacing(4),
    color: theme.palette.brandText,
    fontSize: 24,
  },
}));

const AddRole = (props) => {
  const { dialogOpen, onDialogClose } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [roleName, setRoleName] = useState(null);

  const handleChange = e => {
    e.persist();
    setRoleName(e.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    onDialogClose(roleName);
  };

  const handleClose = () => {
    onDialogClose();
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle onClose={handleClose}>
        <Typography className={classes.headerTitle}>
          Enter the name of the role <br></br> you wish to create
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <Grid container>
            <Grid item xs={12} sm={12}>
              <TextField
                type="text"
                label="Role Name"
                placeholder="Enter role name"
                name="last_name"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={roleName || ''}
                required
                fullWidth
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <div className={brandClasses.footerButton}>
            <Button
              className={brandClasses.button}
              classes={{ disabled: brandClasses.buttonDisabled }}
              type="submit"
            >
              CREATE
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddRole.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  onDialogClose: PropTypes.func.isRequired,
};

export default AddRole;