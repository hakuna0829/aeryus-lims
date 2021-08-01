import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, RadioGroup, TextField, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
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
  footer: {
    display: 'flex',
    width: '80%',
    margin: '15px auto',
    justifyContent: 'flex-end'
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  radioGroup1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginBottom: 10
  },
  radioItem: {
    minWidth: 110
  },
  radioItem1: {
    minWidth: 80
  },
  radioItem2: {
    minWidth: 60
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right",
    width: '60%'
  },
  label1: {
    color: theme.palette.brandDark,
    textAlign: "right",
  },
  inputLabel: {
    minWidth: 120
  },
  title: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    margin: '20px auto'
  },
  titleText: {
    color: theme.palette.blueDark,
    paddingBottom: 20,
    textAlign: 'center'
  },
}));

const CovidScreeningInit = [
  { question: 'Do you have a fever?', value: null },
  { question: 'What was the last reading?', value: null, display: false },
  { question: 'Do you suffer from COPD or asthma?', value: null },
  { question: 'Are you having extreme difficulty breathing?', value: null },
  { question: 'Do you smoke?', value: null },
  { question: 'Do you have chest pain or tightness in the chest?', value: null },
  { question: 'Are you experiencing loss of taste or smell?', value: null },
  { question: 'Have you in the past or currently being treated for cancer?', value: null },
  { question: 'Are you experiencing slurred speech', value: null },
  { question: 'Have you ever had an organ or bone marrow transplant', value: null },
  { question: 'Are you having difficulty waking up', value: null },
  { question: 'Have you been exposed to anyone with the COVID-19 virus?', value: null },
  { question: 'Do you have a cough?', value: null },
  { question: 'Have you visited a nursing home in the last 14 days?', value: null },
  { question: 'Are you experiencing severe constant dizziness or lightheadedness?', value: null },
  { question: 'Have you traveled outside the US in the last 14 days?', value: null },
  { question: 'Are you experiencing any vomiting or diarrhea?', value: null },
  { question: 'Are you female and either nursing or pregnant?', value: null },
  { question: 'Heart Conditions?', value: null },
  { question: 'Diabetes?', value: null },
  { question: 'Liver Disease?', value: null },
  { question: 'Renal Failure?', value: null },
];

const OtherScreeningInit = [
  { question: 'Rapid HIV Test', value: null, options: ['Positive', 'Negative'] },
  { question: 'How is your health right now?', value: null, options: ['Fair', 'Good', 'Bad'] },
  { question: 'Are you currently experiencing symptoms or disabilities?', value: null, options: ['Yes', 'No'] },
  { question: 'How long since your last medical visit?', value: null, options: ['3 months', '6 months', '12 months'] },
];

const PersonalMedicalHistoryInit = [
  { question: 'Hypertension', value: null },
  { question: 'Neurological Disorder/Disease', value: null },
  { question: 'Diabetes', value: null },
  { question: 'Liver', value: null },
  { question: 'Thyroid', value: null },
  { question: 'Gastrointestinal Disease', value: null },
  { question: 'Heart Disease', value: null },
  { question: 'Urinary Disease', value: null },
  { question: 'Cancer', value: null },
  { question: 'Type of Cancer', value: '' },
];

const MedicalHistoryPage1 = (props) => {
  const {
    saveLoading,
    updatePatient,
    patient,
    nextTab,
    backTab,
    isTestdAcPage,
    isCovidScreeningRequired,
    isCurrentHealthRequired,
    isMedicalHistoryRequired,
    isCovidScreeningMandatory,
    isCurrentHealthMandatory,
    isMedicalHistoryMandatory,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [formState, setFormState] = useState({
    covid_19_screening: [...CovidScreeningInit],
    other_screening: [...OtherScreeningInit],
    personal_medical_history: [...PersonalMedicalHistoryInit]
  });

  useEffect(() => {
    console.log('MedicalHistoryPage1 useEffect');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (patient) {
      setFormState(formState => ({
        ...formState,
        height: patient.height,
        weight: patient.weight,
        bp_sys: patient.bp_sys,
        bp_dia: patient.bp_dia,
        temperature: patient.temperature,
      }));
      if (patient.covid_19_screening)
        setFormState(formState => ({ ...formState, covid_19_screening: patient.covid_19_screening }));
      if (patient.other_screening)
        setFormState(formState => ({ ...formState, other_screening: patient.other_screening }));
      if (patient.personal_medical_history)
        setFormState(formState => ({ ...formState, personal_medical_history: patient.personal_medical_history }));
    }
  }, [patient]);

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleCovidChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.covid_19_screening;
    if (index === 0) {
      temp[1].display = e.target.value === 'Yes';
      if (!temp[1].display) temp[1].value = null;
    }
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleOtherChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.other_screening;
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handlePersonalChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.personal_medical_history;
    if (index === 0) {
      temp[1].display = e.target.value === 'Yes';
      if (!temp[1].display) temp[1].value = null;
    }
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!didModified) return nextTab();
    updatePatient({
      height: formState.height,
      weight: formState.weight,
      bp_sys: formState.bp_sys,
      bp_dia: formState.bp_dia,
      temperature: formState.temperature,
      covid_19_screening: formState.covid_19_screening,
      other_screening: formState.other_screening,
      personal_medical_history: formState.personal_medical_history
    });
  };

  const clickBackBtn = e => {
    backTab();
  }

  return (
    <div className={classes.root}>
      {isTestdAcPage
        ?
        <Grid item>
          <Typography variant="h4" className={classes.titleText}>
            {'Please enter your information'}
          </Typography>
        </Grid>
        :
        <div className={classes.header}>
          <Typography variant="h2" className={brandClasses.headerTitle}>
            <img src="/images/svg/status/users_icon.svg" alt="" />
            {'User Manager'} |
        </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>MEDICAL HISTORY</Typography>
        </div>
      }

      <form
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2} style={{ padding: 10 }}>
          <Grid item md={2} >
            <TextField
              style={{ width: '100%', margin: '15px auto' }}
              type="number"
              label="Height"
              placeholder="Enter height"
              name="height"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.height || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item md={2} >
            <TextField
              style={{ width: '100%', margin: '15px auto' }}
              type="number"
              label="Weight"
              placeholder="Enter weight"
              name="weight"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.weight || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item md={2} >
            <TextField
              style={{ width: '100%', margin: '15px auto' }}
              type="number"
              label="BP/SYS"
              placeholder="Enter BP/SYS"
              name="bp_sys"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.bp_sys || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item md={2} >
            <TextField
              style={{ width: '100%', margin: '15px auto' }}
              type="number"
              label="BP/DIA"
              placeholder="Enter BP/DIA"
              name="bp_dia"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.bp_dia || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
          <Grid item md={2} >
            <TextField
              style={{ width: '100%', margin: '15px auto' }}
              type="number"
              label="Temp"
              placeholder="Enter your temperature"
              name="temperature"
              className={brandClasses.shrinkTextField}
              onChange={handleChange}
              value={formState.temperature || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        {isCovidScreeningRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >COVID-19 SCREENING</Typography>
            </div>
            <div className={classes.upContent}>
              <Grid container>
                {
                  formState.covid_19_screening.slice(0, 17).map((item, index) => (
                    <Grid item md={6} sm={10} key={index}>
                      <div className={classes.radioGroup}>
                        {item.question === 'What was the last reading?'
                          ?
                          (item.value || item.display) && (
                            <>
                              <Typography variant="body1" className={classes.label}>
                                {item.question}
                              </Typography>
                              <TextField
                                style={{ marginLeft: '15px', width: 120 }}
                                type="text"
                                label="Temp"
                                placeholder="Enter your temperature"
                                name={item.question}
                                className={brandClasses.shrinkTextField}
                                onChange={handleCovidChange(index)}
                                value={item.value || ''}
                                required={isCovidScreeningMandatory}
                                InputProps={{ classes: { root: classes.inputLabel } }}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                              />
                            </>
                          )
                          :
                          <>
                            <Typography variant="body1" className={classes.label}>
                              {item.question}
                            </Typography>
                            <RadioGroup
                              value={item.value}
                              onChange={handleCovidChange(index)}
                              name={item.question}
                              style={{ flexDirection: 'unset' }}
                            >
                              <RadioCheckButton label='Yes' value='Yes' required={isCovidScreeningMandatory} className={classes.radioItem2} />
                              <RadioCheckButton label='No' value='No' required={isCovidScreeningMandatory} className={classes.radioItem2} />
                            </RadioGroup>
                          </>
                        }
                      </div>
                    </Grid>
                  ))
                }
              </Grid>

              <Typography variant='h5' align='center' className={classes.title}>
                Thank you for that information we will NOW ask a few medical history questions.
          </Typography>
              <Grid item md={8} sm={10}>
                <div className={classes.radioGroup}>
                  <Typography variant="body1" className={classes.label}>
                    {formState.covid_19_screening[17].question}
                  </Typography>
                  <RadioGroup
                    value={formState.covid_19_screening[17].value}
                    onChange={handleCovidChange(17)}
                    name={formState.covid_19_screening[17].question}
                    style={{ flexDirection: 'unset' }}
                  >
                    <RadioCheckButton label='Yes' value='Yes' required={isCovidScreeningMandatory} className={classes.radioItem2} />
                    <RadioCheckButton label='No' value='No' required={isCovidScreeningMandatory} className={classes.radioItem2} />
                  </RadioGroup>
                </div>
              </Grid>

              <Typography variant='h5' align='center' className={classes.title}>
                Do you have ANY of the following conditions:
          </Typography>
              {formState.covid_19_screening.slice(18, 22).map((item, index) => (
                <Grid item md={8} sm={10} key={index}>
                  <div className={classes.radioGroup}>
                    <Typography variant="body1" className={classes.label}>
                      {item.question}
                    </Typography>
                    <RadioGroup
                      value={item.value}
                      onChange={handleCovidChange(index + 18)}
                      name={item.question}
                      style={{ flexDirection: 'unset' }}
                    >
                      <RadioCheckButton label='Yes' value='Yes' required={isCovidScreeningMandatory} className={classes.radioItem2} />
                      <RadioCheckButton label='No' value='No' required={isCovidScreeningMandatory} className={classes.radioItem2} />
                    </RadioGroup>
                  </div>
                </Grid>
              ))}
            </div>
          </>
        )}


        {isCurrentHealthRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >Do you have any of the following?</Typography>
            </div>
            {formState.other_screening.map((item, index) => (
              <Grid container key={index}>
                <Grid item md={6} sm={12} className={classes.radioGroup1}>
                  <div >
                    <Typography variant="body1" className={classes.label1}>
                      {item.question}
                    </Typography>
                  </div>
                </Grid>
                <Grid item md={6} sm={12} >
                  <RadioGroup
                    value={item.value}
                    onChange={handleOtherChange(index)}
                    name={item.question}
                    style={{ flexDirection: 'unset' }}
                  >
                    {OtherScreeningInit.find(o => o.question === item.question).options.map((option, idx) => (
                      <RadioCheckButton label={option} value={option} required={isCurrentHealthMandatory} className={classes.radioItem} key={idx} />
                    ))}
                  </RadioGroup>
                </Grid>
              </Grid>
            ))}
          </>
        )}


        <br />

        {isMedicalHistoryRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >Personal Medical History</Typography>
            </div>
            <Grid container>
              {formState.personal_medical_history.map((item, index) => (
                item.question !== 'Type of Cancer' && (
                  <Grid item md={6} container key={index} >
                    <Grid item md={4} sm={12} className={classes.radioGroup}>
                      <Typography variant="body1" className={classes.label1}>
                        {item.question}
                      </Typography>
                    </Grid>
                    <Grid item md={8} sm={12}>
                      <RadioGroup
                        value={item.value}
                        onChange={handlePersonalChange(index)}
                        name={item.question}
                        style={{ flexDirection: 'unset' }}
                      >
                        <RadioCheckButton label='Yes' value='Yes' required={isMedicalHistoryMandatory} className={classes.radioItem2} />
                        <RadioCheckButton label='No' value='No' required={isMedicalHistoryMandatory} className={classes.radioItem2} />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                )
              ))}
            </Grid>

            {formState.personal_medical_history[8].value === 'Yes' && (
              <Grid container>
                <Grid item md={4} className={classes.radioGroup}>
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    style={{ margin: '15px 0px', minWidth: 150 }}
                    required={isMedicalHistoryMandatory}
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Type of Cancer</InputLabel>
                    <Select
                      onChange={handlePersonalChange(9)}
                      label="Type of Cancer* "
                      name="Type of Cancer"
                      displayEmpty
                      value={formState.personal_medical_history[9].value}
                    >
                      <MenuItem value=''>
                        <Typography className={brandClasses.selectPlaceholder}>Select Type</Typography>
                      </MenuItem>
                      <MenuItem value='Lung'>Lung</MenuItem>
                      <MenuItem value='Breast'>Breast</MenuItem>
                      <MenuItem value='Skin'>Skin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} container></Grid>
              </Grid>
            )}
          </>
        )}


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

        {isTestdAcPage && <div style={{ marginBottom: 70 }}></div>}
      </form >
    </div>
  );
};

MedicalHistoryPage1.propTypes = {
  updatePatient: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  backTab: PropTypes.func,
  isCovidScreeningRequired: PropTypes.bool.isRequired,
  isCurrentHealthRequired: PropTypes.bool.isRequired,
  isMedicalHistoryRequired: PropTypes.bool.isRequired,
  isCovidScreeningMandatory: PropTypes.bool.isRequired,
  isCurrentHealthMandatory: PropTypes.bool.isRequired,
  isMedicalHistoryMandatory: PropTypes.bool.isRequired,
};

export default MedicalHistoryPage1;

