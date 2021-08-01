import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Divider, Button } from '@material-ui/core';
import brandStyles from 'theme/brand';
import BlueBox from "components/BlueBox";
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px 0px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(1)}px`,
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  gridBody: {
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(7),
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  },
  labelTitle: {
    marginTop: theme.spacing(2),
    color: theme.palette.brandDark,
    fontWeight: 600
  },
  dividerTop: {
    marginBottom: theme.spacing(3),
    width: '90%',
    height: 1.5,
    backgroundColor: theme.palette.brandDark,
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: '90%',
    height: 1.5,
    backgroundColor: theme.palette.brandDark,
  },
  textValue: {
    color: theme.palette.brandGray,
  },
  textValueSpan: {
    color: theme.palette.brandDark,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  footer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    width: '90%',
    margin: '0 auto',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  box: {
    width: 300,
    marginTop: 130,
    cursor: 'pointer',
    '& img': {
      margin: '20px auto 35px',
      width: 100
    },
    '& h3': {
      color: theme.palette.brandGreen,
      margin: '20px auto 10px',
      fontWeight: 600
    },
    [theme.breakpoints.up('lg')]: {
      width: 300,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 280,
      '& img': {
        margin: '20px auto 30px',
        width: 100
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: 300,
      marginTop: 20,
      '& img': {
        margin: '10px auto 30px',
        width: 100
      },
    },
  }
}));

const PairedSuccess = (props) => {
  const { nextTab, previousTab, testing, user } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = () => {
    nextTab();
  }
  const handleBack = () => {
    previousTab();
    previousTab();
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <>
            <img src="/images/svg/status/users_icon.svg" alt="" />
            {'User Manager'} |
          </>
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>
          {'PAIRED SUCCESS'}
        </Typography>
      </div>
      <Grid
        className={classes.gridBody}
        container
        // direction="column"
        justify="center"
        alignItems="flex-start"
      // spacing={2}
      >
        <Grid item md={7}>

          <Typography variant="h4" className={classes.labelTitle}>
            PATIENT NAME
        </Typography>
          <Divider className={classes.dividerTop} />
          {testing.dependent_id
            ?
            <Typography variant="h4" className={classes.textValue}>
              {testing.dependent_id.first_name}, {testing.dependent_id.last_name}
            </Typography>
            :
            <Typography variant="h4" className={classes.textValue}>
              {user.first_name}, {user.last_name}
            </Typography>
          }
          <Divider className={classes.divider} />

          <Typography variant="h4" className={classes.labelTitle}>
            SESSION ID
        </Typography>
          <Divider className={classes.dividerTop} />
          <Typography variant="h4" className={classes.textValue}>
            {testing.test_session_id}
          </Typography>
          <Divider className={classes.divider} />

          <Typography variant="h4" className={classes.labelTitle}>
            TEST KIT ID
        </Typography>
          <Divider className={classes.dividerTop} />
          <Typography variant="h4" className={classes.textValue}>
            {testing.testkit_id}
          </Typography>
          <Divider className={classes.divider} />

          <br />
          <Typography variant="h3" className={classes.textValue}>
            You have successfully paired
          {/* <span className={classes.textValueSpan}> {user.last_name}</span> */}
          </Typography>
          {testing.dependent_id
            ?
            <Typography variant="h4" className={classes.textValueSpan}>
              {testing.dependent_id.first_name}, {testing.dependent_id.last_name}
            </Typography>
            :
            <Typography variant="h4" className={classes.textValueSpan}>
              {user.first_name}, {user.last_name}
            </Typography>
          }
          <br />
          <Typography variant="h3" className={classes.textValue}>
            with test kit id:
          {/* <span className={classes.textValueSpan}> {testing.testkit_id}</span> */}
          </Typography>
          <Typography variant="h3" className={classes.textValueSpan}>
            {testing.testkit_id}
          </Typography>
        </Grid>
        <Grid item container md={5} justify="center">
          <BlueBox class={classes.box}>
            <Typography variant="h3" >
              PAIRING <br />COMPLETE!
            </Typography>
            <img src="/images/svg/status/check_green.svg" alt="" />
          </BlueBox>
        </Grid>
      </Grid>

      <div className={classes.footer}>
        <Grid>
          <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item>
              <Button
                className={clsx(brandClasses.button, brandClasses.whiteButton)}
                onClick={handleBack}
              >
                {'BACK'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={brandClasses.button}
                onClick={handleNext}
              >
                {'NEXT'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

PairedSuccess.prototype = {
  nextTab: PropTypes.func.isRequired,
  previousTab: PropTypes.func.isRequired,
  testing: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default PairedSuccess;
