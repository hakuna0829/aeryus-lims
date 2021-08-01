import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title:{
    fontWeight: 600,
    fontSize: '30px',
    lineHeight: '40px',
    textAlign: 'center',
    color: theme.palette.brandGreen
  },
  checkMark:{
    margin:'18px 0px',
  },
  description: {
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: '25px',
    textAlign: 'center',
    marginBottom:'24px',
    color: theme.palette.brandDark
  }
}));

const SuccessAlert = props => {

  const { open, population, onClose } = props;
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={'sm'} fullWidth={true}
      >
        <DialogContent>
          <Typography className={classes.title}>SUCCESS!</Typography>
          <Typography align="center" className={classes.checkMark}>
            <img src="/images/svg/status/check_green.svg" alt="" width="110"/>
          </Typography>
        
          <Typography className={classes.description}>
            {population.new_name} <br />
            has been added
          </Typography>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}

SuccessAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  population: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SuccessAlert;