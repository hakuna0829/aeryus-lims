import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, RadioGroup, CircularProgress, Dialog, DialogContent } from '@material-ui/core';
import brandStyles from 'theme/brand';
import RadioCheckButton from 'components/RadioCheckButton';
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
  gridItem: {
    margin: '15px 0'
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right",
    marginRight: 20
  },
  footer: {
    marginTop: 10,
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  dialogRoot: {
    minWidth: 400,
    padding: 20
  },
  dialogTitle: {
    textAlign: 'center',
    color: theme.palette.brandRed,
    fontSize: 120,
    fontWeight: 800,
    lineHeight: '146px',
  },
  dialogMessage: {
    textAlign: 'center'
  },
}));

const CheckList = (props) => {
  const { previousTab, updateTesting, saveLoading } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFinish = event => {
    event.preventDefault();
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleSend = () => {
    updateTesting({ completed: true });
  }

  return (
    <div className={classes.root}>

      <form
        onSubmit={handleFinish}
      >
        <div className={classes.header}>
          <Typography variant="h2" className={brandClasses.headerTitle}>
            <>
              <img src="/images/svg/status/users_icon.svg" alt="" />
              {'User Manager'} |
          </>
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>
            {'CHECK LIST'}
          </Typography>
        </div>

        <Grid container>
          <Grid item lg={9} md={9} sm={10} className={classes.gridItem}>
            <div className={classes.radioGroup}>
              <Typography variant="h5" className={classes.label}>
                {'Specimen taken?'}
              </Typography>
              <RadioGroup
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton label='Yes' value='1' required={true} />
                <RadioCheckButton label='No' value='0' required={true} />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="h5" className={classes.label}>
                {'Did you label the specimen?'}
              </Typography>
              <RadioGroup
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton label='Yes' value='1' required={true} />
                <RadioCheckButton label='No' value='0' required={true} />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="h5" className={classes.label}>
                {'Label of specimen and patient match?'}
              </Typography>
              <RadioGroup
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton label='Yes' value='1' required={true} />
                <RadioCheckButton label='No' value='0' required={true} />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="h5" className={classes.label}>
                {'Is test in package ready to send to the lab?'}
              </Typography>
              <RadioGroup
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton label='Yes' value='1' required={true} />
                <RadioCheckButton label='No' value='0' required={true} />
              </RadioGroup>
            </div>
          </Grid>
        </Grid>

        <div className={classes.footer}>
          <Grid>
            <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
              <Grid item>
                <Button
                  className={clsx(brandClasses.button, brandClasses.whiteButton)}
                  onClick={previousTab}
                >
                  {'BACK'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={brandClasses.button}
                  type="submit"
                >
                  {'FINISH'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </form>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogContent
          className={classes.dialogRoot}
        >
          <Typography className={classes.dialogTitle}>
            {'!'}
          </Typography>
          <Typography variant="h5" className={classes.dialogMessage}>
            This test session is ready <br />
            to be transmitted to the lab. <br />
            Please make a final review <br />
            before submitting.
          </Typography>
          <br />
          <div className={classes.footer}>
            <Grid>
              <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
                <Grid item>
                  <Button
                    className={clsx(brandClasses.button, brandClasses.whiteButton)}
                    onClick={handleDialogClose}
                  >
                    {'BACK'}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleSend}
                    className={brandClasses.button}
                    classes={{ disabled: brandClasses.buttonDisabled }}
                    disabled={saveLoading}
                    type="submit"
                  >
                    {'SEND'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

CheckList.prototype = {
  nextTab: PropTypes.func.isRequired,
  previousTab: PropTypes.func.isRequired,
  updateTesting: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
};

export default CheckList;
