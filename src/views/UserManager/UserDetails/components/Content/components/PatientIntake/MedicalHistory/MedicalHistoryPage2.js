import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  MenuItem,
  Button,
  RadioGroup,
  Select,
  InputLabel,
  FormControl,
  TextField,
  CircularProgress
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import RadioCheckButton from 'components/RadioCheckButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DialogAlert from 'components/DialogAlert';
import * as appConstants from 'constants/appConstants';
import validate from 'validate.js';
import clsx from 'clsx';

const procedureValidatorSchema = {
  procedure: { presence: { allowEmpty: false } },
  year: { presence: { allowEmpty: false } },
};

const medicationValidatorSchema = {
  medication: { presence: { allowEmpty: false } },
  reason_prescribed: { presence: { allowEmpty: false } },
  dosage: { presence: { allowEmpty: false } },
};

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
  tableRoot: {
    marginTop: theme.spacing(4)
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
  actionBar: {
    display: 'flex',
    width: '80%',
    margin: '15px auto',
    justifyContent: 'flex-end'
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    borderRadius: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  redBtn: {
    backgroundColor: theme.palette.brandRed,
    color: theme.palette.white,
    marginLeft: 10,
    borderRadius: '10px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.brandDark,
    },
  },
  radioGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
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
  gridItem: {
    margin: '15px 0'
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right"
  },
  inputLabel: {
    minWidth: 120
  },
  titleText: {
    color: theme.palette.blueDark,
    paddingBottom: 20,
    textAlign: 'center'
  },
}));

const FamilyMedicalHistoryInit = [
  { question: 'Hypertension', value: null },
  { question: 'Heart Disease', value: null },
  { question: 'Diabetes', value: null },
  { question: 'Cancer', value: null },
  { question: 'Type of Cancer', value: '' },
];

const SurgicalProcedureInit = {
  procedure: '',
  year: '',
};

const MedicationsInit = {
  medication: '',
  reason_prescribed: '',
  dosage: '',
};

const MedicalHistoryPage2 = (props) => {
  const {
    saveLoading,
    updatePatient,
    patient,
    nextTab,
    backTab,
    isTestdAcPage,
    isFamilyMedicalHistoryRequired,
    isSurgicalProcedureRequired,
    isMedicationsRequired,
    isFamilyMedicalHistoryMandatory,
    isSurgicalProcedureMandatory,
    isMedicationsMandatory,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [didModified, setDidModified] = useState(false);
  const [formState, setFormState] = useState({
    family_medical_history: [...FamilyMedicalHistoryInit],
    surgical_procedure: [{ ...SurgicalProcedureInit }],
    medications: [{ ...MedicationsInit }]
  });

  useEffect(() => {
    console.log('MedicalHistoryPage2 useEffect');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (patient) {
      if (patient.family_medical_history)
        setFormState(formState => ({ ...formState, family_medical_history: patient.family_medical_history }));
      if (patient.surgical_procedure)
        setFormState(formState => ({ ...formState, surgical_procedure: patient.surgical_procedure }));
      if (patient.medications)
        setFormState(formState => ({ ...formState, medications: patient.medications }));
    }
  }, [patient]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage('');
  }

  const handleFamilyChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.family_medical_history;
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleProcedureChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.surgical_procedure;
    temp[index][e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleMedicationChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.medications;
    temp[index][e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleAddProcedure = () => {
    const isInvalid = validate(formState.surgical_procedure[formState.surgical_procedure.length - 1], procedureValidatorSchema);
    if (isInvalid) {
      setDialogOpen(true);
      setDialogMessage('Please enter all the Surgical procedure history fields to add new Procedure');
    } else {
      let temp = formState.surgical_procedure;
      temp.push({ ...SurgicalProcedureInit });
      setFormState({ ...formState, temp });
    }
  };

  const handleAddMedication = () => {
    const isInvalid = validate(formState.medications[formState.medications.length - 1], medicationValidatorSchema);
    if (isInvalid) {
      setDialogOpen(true);
      setDialogMessage('Please enter all the Medication fields to add new Medication');
    } else {
      let temp = formState.medications;
      temp.push({ ...MedicationsInit });
      setFormState({ ...formState, temp });
    }
  };

  const handleRemoveProcedure = () => {
    let temp = formState.surgical_procedure;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleRemoveMedication = () => {
    let temp = formState.medications;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!didModified) return nextTab();
    updatePatient({
      family_medical_history: formState.family_medical_history,
      surgical_procedure: formState.surgical_procedure,
      medications: formState.medications
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
        {isFamilyMedicalHistoryRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >Family History (M) mother , (F) Father, (S) Sibling</Typography>
            </div>
            <Grid container>
              {formState.family_medical_history.map((item, index) => (
                item.question !== 'Type of Cancer' && (
                  <Grid item md={6} container key={index} >
                    <Grid item md={5} sm={12} className={classes.radioGroup}>
                      <Typography variant="body1" className={classes.label}>
                        {item.question}
                      </Typography>
                    </Grid>
                    <Grid item md={7} sm={12}>
                      <RadioGroup
                        value={item.value}
                        onChange={handleFamilyChange(index)}
                        name={item.question}
                        style={{ flexDirection: 'unset' }}
                      >
                        <RadioCheckButton label='M' value='M' required={isFamilyMedicalHistoryMandatory} className={classes.radioItem2} />
                        <RadioCheckButton label='F' value='F' required={isFamilyMedicalHistoryMandatory} className={classes.radioItem2} />
                        <RadioCheckButton label='S' value='S' required={isFamilyMedicalHistoryMandatory} className={classes.radioItem2} />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                )
              ))}
            </Grid>

            {formState.family_medical_history[3].value && (
              <Grid container>
                <Grid item md={6}></Grid>
                <Grid item md={4} className={classes.radioGroup} >
                  <FormControl
                    className={brandClasses.shrinkTextField}
                    style={{ margin: '15px 0px', minWidth: 150 }}
                    required={isFamilyMedicalHistoryMandatory}
                    variant="outlined"
                  >
                    <InputLabel shrink className={brandClasses.selectShrinkLabel}>Type of Cancer</InputLabel>
                    <Select
                      onChange={handleFamilyChange(4)}
                      label="Type of Cancer* "
                      name="Type of Cancer"
                      displayEmpty
                      value={formState.family_medical_history[4].value}
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
              </Grid>
            )}
          </>
        )}

        {/* <Grid container>
          <Grid item md={6}></Grid>
          <Grid item md={4} className={classes.radioGroup} >
            <FormControl
              className={brandClasses.shrinkTextField}
              style={{ margin: '15px 0px' }}
              required
              variant="outlined"
            >
              <InputLabel>Type of Cancer</InputLabel>
              <Select
                // onChange={handlePharmacyChange(index)}
                label="Type of Cancer* "
                name="state"
                value={'Select Type'}
              >
                <MenuItem value='Select Type'>
                  <Typography className={brandClasses.selectPlaceholder}>Select Type</Typography>
                </MenuItem>
                <MenuItem value='Lung'>Lung</MenuItem>
                <MenuItem value='Breast'>Breast</MenuItem>
                <MenuItem value='Skin'>Skin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid> */}

        {isSurgicalProcedureRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >LIST ALL PAST/PRESENT SURGICAL HISTORY</Typography>
            </div>
            <div className={classes.upContent} >
              {formState.surgical_procedure.map((procedure, index) => (
                <Grid container spacing={4} key={index}>
                  <Grid item md={5}>
                    <TextField
                      type="text"
                      label="Procedure"
                      placeholder="Enter procedure"
                      name="procedure"
                      className={brandClasses.shrinkTextField}
                      onChange={handleProcedureChange(index)}
                      value={procedure.procedure || ''}
                      fullWidth
                      required={isSurgicalProcedureMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      type="text"
                      label="Year"
                      placeholder="Enter year"
                      name="year"
                      className={brandClasses.shrinkTextField}
                      onChange={handleProcedureChange(index)}
                      value={procedure.year || ''}
                      fullWidth
                      required={isSurgicalProcedureMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              ))}
            </div>
            <div className={classes.actionBar}>
              <Button variant="contained" onClick={handleAddProcedure} className={classes.greenBtn}>
                <AddIcon />  ADD PROCEDURE
          </Button>
              {formState.surgical_procedure.length > 1 && (
                <Button variant="contained" onClick={handleRemoveProcedure} className={classes.redBtn}>
                  <RemoveIcon />
                  {' REMOVE'}
                </Button>
              )}
            </div>
          </>
        )}


        {isMedicationsRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >LIST ALL MEDICATIONS/DOSAGE</Typography>
            </div>
            <div className={classes.upContent} >
              {formState.medications.map((medication, index) => (
                <Grid container spacing={4} key={index}>
                  <Grid item md={4}>
                    <TextField
                      type="text"
                      label="Medication"
                      placeholder="Enter medication name"
                      name="medication"
                      className={brandClasses.shrinkTextField}
                      onChange={handleMedicationChange(index)}
                      value={medication.medication || ''}
                      fullWidth
                      required={isMedicationsMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      type="text"
                      label="Reason Prescribed"
                      placeholder="Enter reason"
                      name="reason_prescribed"
                      className={brandClasses.shrinkTextField}
                      onChange={handleMedicationChange(index)}
                      value={medication.reason_prescribed || ''}
                      fullWidth
                      required={isMedicationsMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      type="text"
                      label="Dosage"
                      placeholder="Enter dosage"
                      name="dosage"
                      className={brandClasses.shrinkTextField}
                      onChange={handleMedicationChange(index)}
                      value={medication.dosage || ''}
                      fullWidth
                      required={isMedicationsMandatory}
                      InputProps={{ classes: { root: classes.inputLabel } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              ))}
            </div>
            <div className={classes.actionBar}>
              <Button variant="contained" onClick={handleAddMedication} className={classes.greenBtn}>
                <AddIcon />  ADD MEDICATION
          </Button>
              {formState.medications.length > 1 && (
                <Button variant="contained" onClick={handleRemoveMedication} className={classes.redBtn}>
                  <RemoveIcon />
                  {' REMOVE'}
                </Button>
              )}
            </div>
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
      </form>

      {isTestdAcPage && <div style={{ marginBottom: 70 }}></div>}

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={dialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

MedicalHistoryPage2.propTypes = {
  updatePatient: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  backTab: PropTypes.func,
  isFamilyMedicalHistoryRequired: PropTypes.bool.isRequired,
  isSurgicalProcedureRequired: PropTypes.bool.isRequired,
  isMedicationsRequired: PropTypes.bool.isRequired,
  isFamilyMedicalHistoryMandatory: PropTypes.bool.isRequired,
  isSurgicalProcedureMandatory: PropTypes.bool.isRequired,
  isMedicationsMandatory: PropTypes.bool.isRequired,
};

export default MedicalHistoryPage2;

