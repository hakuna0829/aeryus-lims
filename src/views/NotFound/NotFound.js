import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { Button, Link } from '@material-ui/core';
import brandStyles from 'theme/brand';
import { Link as RouterLink, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    // paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    // marginTop: 10,
    display: 'inline-block',
    // maxWidth: '100%',
    width: '24%'
  },
  text404: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '70px',
    textAlign: 'center',
    color: '#0F84A9'
  },
  errorContent: {
    color: '#0F84A9',
    fontSize: '16px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    lineHeight: ' 24px',
    letterSpacing: '-0.05px',
    paddingTop: '24px',
  },
  logonButton: {
    margin: 'auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: '#FFFFFF',
    // border: '1px solid #0F84A9',
    display: 'flex',
    minWidth: '120px',
    fontWeight: '600',
    lineHeight: '2',
    borderRadius: '10px',
    letterSpacing: '1px',
    textTransform: 'none',
    backgroundColor: '#3ECCCD',
    '&:hover': {
      backgroundColor: '#3ECCCD',
    },
  }
}));

const NotFound = () => {
  const classes = useStyles();
  const history = useHistory();
  const brandClasses = brandStyles();

  const goBack = () => {
    history.goBack()
  }
  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={4} >
        <Grid item lg={6} xs={12} >
          <div className={classes.content}>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/svg/404_error_message.svg"
            />
            <Typography variant="h1" className={classes.text404}>
              404
            </Typography>
            <Typography variant="subtitle2" className={classes.errorContent}>
              The page your are looking <br></br>
                for does not exist
            </Typography>
            <Button className={classes.logonButton} type="button" onClick={goBack}>  GO BACK </Button>
            <Typography variant="h6"> {`or`} </Typography>
            <Link className={brandClasses.brandDarkText} component={RouterLink} to="/dashboard" variant="h6"> Go to Main Dashboard </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
