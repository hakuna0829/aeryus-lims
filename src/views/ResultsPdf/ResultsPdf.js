import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import brandStyles from 'theme/brand';
import clsx from 'clsx';
import { Button, Grid, CircularProgress, AppBar, Toolbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { getScheduleResultsPdf } from 'actions/api';
import NumberFormat from 'react-number-format';

const fetchHeaderToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3IiOiJTY2hlZHVsZSIsImlhdCI6MTU5NzI0NzY2MX0.3tRBEgvdIlKADm7kTagLLbzNxm1Gnc70VA49MX406xM';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  header: {
    backgroundColor: '#0F84A9',
    boxShadow: 'none',
    height: '65px'
  },
  footer: {
    backgroundColor: '#0F84A9',
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    justifyContent: 'center'
  },
  footerButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(15),
    // margin: theme.spacing(8),
  },
  inputField: {
    marginTop: 50,
    width: 320
  }
}));

const ScheduleAppointment = (props) => {
  const { getScheduleResultsPdf } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({});
  const [displayError, setDisplayError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileName = props.match.params.fileName;

  useEffect(() => {
    if (!fileName) {
      setDisplayError('FileName is empty.');
    }
    // eslint-disable-next-line
  }, [fileName]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res = await getScheduleResultsPdf(fetchHeaderToken, {
      fileName: fileName,
      dobYear: formState.dobYear
    });
    setLoading(false);
    if (res.success) {
      setIsSuccess(true);
      window.open(res.data, "_self");
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header}>
        <Toolbar className={classes.toolbar}>
          <img src='/images/svg/Testd_ID_logo.svg' alt='Testd_logo' style={{ height: 50, marginTop: 10 }} />
        </Toolbar>
      </AppBar>

      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >

        <div className={classes.error}>
          {displayError ? <Alert severity="error">{displayError}</Alert> : null}
        </div>

        {isSuccess
          ?
          <Grid item style={{ marginTop: 60, marginBottom: 20 }}>
            <Alert severity="success">Request Success</Alert>
            {/* <iframe src="http://localhost:3001/api/pdf/7E109D-5D1DE-E48F_2021-04-27.pdf" ></iframe> */}
          </Grid>
          :
          <form
            onSubmit={handleSubmit}
          >
            <Grid item xs={12} sm={6}>
              <NumberFormat
                customInput={TextField}
                format="####"
                mask=" "
                label="Year"
                placeholder="Enter your date of birth Year"
                name="dobYear"
                className={clsx(brandClasses.shrinkTextField, classes.inputField)}
                onChange={handleChange}
                value={formState.dobYear || ''}
                fullWidth
                required
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <div className={classes.footerButton}>
              <Button
                className={brandClasses.button}
                classes={{ disabled: brandClasses.buttonDisabled }}
                disabled={loading}
                type="submit"
              >
                {'Submit'} {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
              </Button>
            </div>
          </form>
        }
      </Grid>
    </div >
  )
}

export default connect(null, { getScheduleResultsPdf })(withRouter(ScheduleAppointment));
