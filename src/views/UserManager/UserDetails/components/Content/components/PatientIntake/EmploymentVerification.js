import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, TextField, Button, CircularProgress } from '@material-ui/core';
import RadioGroup from "@material-ui/core/RadioGroup";
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
  checkbox: {
    color: theme.palette.brandDark,
    marginLeft: theme.spacing(2),
    '& .MuiTypography-body1': {
      color: theme.palette.brandDark
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.brandDark
    }
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end'
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'flex-end'
  },
  gridItem: {
    margin: '15px 0'
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right"
  },
  upContent: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5)
    },
    paddingTop: '0px'
  },
}));

const EmploymentVerificationInit = {
  type: '',
  explain_other: '',
  suite: '',
  gross_wages: '',
  frequency_of_pay: '',
};

const EmploymentVerification = (props) => {
  const { 
    saveLoading, 
    updatePatient, 
    patient, 
    nextTab, 
    backTab,
    isEmploymentMandatory, 
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [formState, setFormState] = useState({
    employment_verification: { ...EmploymentVerificationInit }
  });

  useEffect(() => {
    console.log('EmploymentVerification useEffect');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (patient) {
      if (patient.employment_verification)
        setFormState(formState => ({ ...formState, employment_verification: patient.employment_verification }));
    }
  }, [patient]);

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.employment_verification;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!didModified) return nextTab();
    updatePatient({
      employment_verification: formState.employment_verification,
    });
  };

  const clickBackBtn = e => {
    backTab();
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h2" className={brandClasses.headerTitle}>
          <img src="/images/svg/status/users_icon.svg" alt="" />
          {'User Manager'} |
        </Typography>
        <Typography variant="h4" className={classes.headerSubTitle}>USER VERIFICATION</Typography>
      </div>

      <form
        onSubmit={handleSubmit}
      >
        <div className={brandClasses.subHeaderBlueDark}>
          <Typography variant="h5" >EMPLOYMENT VERIFICATON</Typography>
        </div>
        <div>
          <Grid container>
            <Grid item lg={7} md={7} sm={12} className={classes.gridItem}>
              <div className={classes.radioGroup}>
                <RadioGroup
                  value={formState.employment_verification.type}
                  onChange={handleChange}
                  name={'type'}
                  style={{ flexDirection: 'unset' }}
                >
                  <Grid container>
                    <Grid item lg={4} md={6}>
                      <RadioCheckButton label='Self-Employed' value='Self-Employed' required={isEmploymentMandatory} />
                    </Grid>
                    <Grid item lg={4} md={6}>
                      <RadioCheckButton label='SSI' value='SSI' required={isEmploymentMandatory} />
                    </Grid>
                    <Grid item lg={4} md={6}>
                      <RadioCheckButton label='Child Support' value='Child Support' required={isEmploymentMandatory} />
                    </Grid>
                    <Grid item lg={4} md={6}>
                      <RadioCheckButton label='Employed' value='Employed' required={isEmploymentMandatory} />
                    </Grid>
                    <Grid item lg={4} md={6}>
                      <RadioCheckButton label='SSDI' value='SSDI' required={isEmploymentMandatory} />
                    </Grid>
                    <Grid item lg={4} md={6}>
                      <RadioCheckButton label='Other' value='Other' required={isEmploymentMandatory} />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </div>
            </Grid>

            <Grid item lg={5} md={5} sm={12} className={classes.gridItem}>
              <div className={classes.radioGroup}>
                <TextField
                  type="text"
                  label="Explain Other"
                  placeholder="Explain Other"
                  name="explain_other"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.employment_verification.explain_other || ''}
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item md={6} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="Employer Name"
                placeholder="<Enter employer name>"
                name="employer_name"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.employer_name || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={5} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="Address"
                placeholder="<Enter address>"
                name="address"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.address || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={3} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="City"
                placeholder="Enter city"
                name="city"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.city || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={3} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="Suite"
                placeholder="<Enter suite>"
                name="suite"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.suite || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={3} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="State"
                placeholder="Enter state"
                name="state"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.state || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={3} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="Zip code"
                placeholder="1234"
                name="zip_code"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.zip_code || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item md={5} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="Office Phone"
                placeholder="Enter office number"
                name="office_phone"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.office_phone || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item md={6} sm={10} xs={12} className={classes.gridItem}>
              <TextField
                type="text"
                label="Gross Wages"
                placeholder="Enter amount"
                name="gross_wages"
                className={brandClasses.shrinkTextField}
                onChange={handleChange}
                value={formState.employment_verification.gross_wages || ''}
                required={isEmploymentMandatory}
                InputProps={{ classes: { root: classes.inputLabel } }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item lg={12} md={10} sm={12} className={classes.gridItem}>
              <div className={classes.radioGroup}>
                <Typography variant="body1" className={classes.label}>
                  Frequency of pay:
                </Typography>
                <RadioGroup
                  value={formState.employment_verification.frequency_of_pay || ''}
                  onChange={handleChange}
                  name={'frequency_of_pay'}
                  style={{ flexDirection: 'unset' }}
                >
                  <RadioCheckButton label='Weekly' value='Weekly' required={isEmploymentMandatory} />
                  <RadioCheckButton label='Bi-Weekly' value='Bi-Weekly' required={isEmploymentMandatory} />
                  <RadioCheckButton label='Twice a month' value='Twice a month' required={isEmploymentMandatory} />
                  <RadioCheckButton label='Monthly' value='Monthly' required={isEmploymentMandatory} />
                </RadioGroup>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className={classes.footer}>
          <Button
            className={clsx(brandClasses.button, brandClasses.whiteButton)}
            classes={{ disabled: brandClasses.buttonDisabled }}
            onClick={clickBackBtn}
          >
            BACK {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
          &ensp;
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={saveLoading}
            type="submit"
          >
            NEXT {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </div>
      </form>
    </div>
  );
};

EmploymentVerification.propTypes = {
  updatePatient: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  backTab: PropTypes.func,
  isEmploymentRequired: PropTypes.bool.isRequired,
  isEmploymentMandatory: PropTypes.bool.isRequired,
};

export default EmploymentVerification;
