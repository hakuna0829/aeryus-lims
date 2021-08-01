import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  MenuItem,
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import { getStates } from 'helpers';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import validate from 'validate.js';
import * as appConstants from 'constants/appConstants';
import DialogAlert from 'components/DialogAlert';
// import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import CheckButton from 'components/CheckButton';

const providerValidatorSchema = {
  name: { presence: { allowEmpty: false } },
  phone: { presence: { allowEmpty: false } },
  address: { presence: { allowEmpty: false } },
  city: { presence: { allowEmpty: false } },
  state: { presence: { allowEmpty: false } },
  zip_code: { presence: { allowEmpty: false } },
  policy_number: { presence: { allowEmpty: false } },
  group_number: { presence: { allowEmpty: false } },
};

const pharmacyValidatorSchema = {
  primary_pharmacy: { presence: { allowEmpty: false } },
  phone: { presence: { allowEmpty: false } },
  address: { presence: { allowEmpty: false } },
  city: { presence: { allowEmpty: false } },
  state: { presence: { allowEmpty: false } },
  zip_code: { presence: { allowEmpty: false } },
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
  upContent: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5)
    },
    // paddingTop: '0px'
  },
  footer: {
    marginTop: theme.spacing(4),
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
  uploadedPhoto: {
    maxWidth: 150,
    maxHeight: 150,
    paddingTop: 10
  },
  uploadContanier: {
    border: `solid 1px`,
    borderColor: theme.palette.brandDark,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    marginBottom: 32
  },
  uploadImageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& img': {
      marginRight: 10,
      width: 30
    }
  },
  uploadTitle: {
    color: '#0F84A9',
    fontSize: 10,
    position: 'absolute',
    top: -10,
    background: '#fff',
    padding: '0 4px'
  },
  uploadDesc: {
    color: '#9B9B9B',
    fontSize: 14,
    padding: '4px 10px'
  },
  uploadInput: {
    display: 'none',
  },
  titleText: {
    color: theme.palette.blueDark,
    paddingBottom: 20,
    textAlign: 'center'
  },
}));

// const ValidationTextField = withStyles({
//   root: {
//     width: '100%',
//     marginBottom: '10px',

//     '::placeholder': {
//       color: 'red',
//       fontSize: '14px'
//     }
//   }
//})(TextValidator);

// const addProviderInfo = ev => {
//   ev.preventDefault();
//}

const ProviderInit = {
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  policy_number: '',
  group_number: ''
};

const PharmacyInit = {
  primary_pharmacy: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
};

const ProviderInformation = (props) => {
  const {
    saveLoading,
    updatePatient,
    patient,
    nextTab,
    backTab,
    isTestdAcPage,
    isProviderRequired,
    isPharmacyRequired,
    isInsuranceRequired,
    isProviderMandatory,
    isPharmacyMandatory,
    isInsuranceMandatory,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  // const history = useHistory();

  const [didModified, setDidModified] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    providers: [{ ...ProviderInit }],
    pharmacy: [{ ...PharmacyInit }],
    insurance: {}
  });

  useEffect(() => {
    console.log('ProviderInformation useEffect');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (patient) {
      if (patient.providers)
        setFormState(formState => ({ ...formState, providers: patient.providers }));
      if (patient.pharmacy)
        setFormState(formState => ({ ...formState, pharmacy: patient.pharmacy }));
      if (patient.insurance)
        setFormState(formState => ({ ...formState, insurance: patient.insurance }));
    }
  }, [patient]);

  const handleAddProvider = () => {
    const isInvalid = validate(formState.providers[formState.providers.length - 1], providerValidatorSchema);
    if (isInvalid) {
      setDialogOpen(true);
      setDialogMessage('Please enter all the Provider fields to add new Provider');
    } else {
      let temp = formState.providers;
      temp.push({ ...ProviderInit });
      setFormState({ ...formState, temp });
    }
  };

  const handleAddPharmacy = () => {
    const isInvalid = validate(formState.pharmacy[formState.pharmacy.length - 1], pharmacyValidatorSchema);
    if (isInvalid) {
      setDialogOpen(true);
      setDialogMessage('Please enter all the Pharmacy fields to add new Pharmacy');
    } else {
      let temp = formState.pharmacy;
      temp.push({ ...ProviderInit });
      setFormState({ ...formState, temp });
    }
  };

  const handleRemoveProvider = () => {
    let temp = formState.providers;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleRemovePharmacy = () => {
    let temp = formState.pharmacy;
    temp.pop();
    setFormState({ ...formState, temp });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage('');
  }

  const handleNotApplicableChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    if (e.target.name === 'provider') {
      let temp = formState.providers;
      Object.keys(formState.providers[0]).forEach(key => {
        if (key !== '_id')
          if (e.target.checked)
            temp[0][key] = 'n/a';
          else
            temp[0][key] = '';
      });
      setFormState({ ...formState, temp });
    }
    if (e.target.name === 'pharmacy') {
      let temp = formState.pharmacy;
      Object.keys(formState.pharmacy[0]).forEach(key => {
        if (key !== '_id')
          if (e.target.checked)
            temp[0][key] = 'n/a';
          else
            temp[0][key] = '';
      });
      setFormState({ ...formState, temp });
    }
    if (e.target.name === 'insurance') {
      let temp = formState.insurance;
      ['name_of_insured', 'insureds_workplace', 'primary_insurance', 'primary_pcn', 'primary_id_number', 'primary_rx_group', 'primary_bin', 'secondary_insurance', 'secondary_pcn', 'secondary_id_number', 'secondary_rx_group', 'secondary_bin']
        .forEach(key => {
          if (key !== '_id')
            if (e.target.checked)
              temp[key] = 'n/a';
            else
              temp[key] = '';
        });
      setFormState({ ...formState, temp });
    }
  };

  const handleProviderChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.providers;
    temp[index][e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handlePharmacyChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.pharmacy;
    temp[index][e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleInsuranceChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.insurance;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  }

  const handleSubmit = event => {
    event.preventDefault();
    if (!didModified) return nextTab();
    updatePatient({
      providers: formState.providers,
      pharmacy: formState.pharmacy,
      insurance: formState.insurance
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
            {'User Manager | '}
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>PROVIDER INFORMATION</Typography>
        </div>
      }

      <form
        onSubmit={handleSubmit}
      >
        {isProviderRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" className={brandClasses.naTitle}>OTHER PROVIDERS</Typography>
              <CheckButton
                label={"Not Applicable"}
                name={'provider'}
                className={brandClasses.naCheckbox}
                onChange={handleNotApplicableChange}
              />
              <Typography></Typography>
            </div>

            {
              formState.providers.map((provider, index) => (
                <div className={classes.upContent} key={index}>
                  <Grid container spacing={4}>
                    <Grid item md={5}>
                      <TextField
                        type="text"
                        label="Provider Name"
                        placeholder="Enter provider’s name"
                        name="name"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.name || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={5}>
                      <TextField
                        type="tel"
                        label="Phone"
                        placeholder="000.000.0000"
                        name="phone"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.phone || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        type="text"
                        label="Address"
                        placeholder="Enter address"
                        name="address"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.address || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        type="text"
                        label="City"
                        placeholder="Enter City"
                        name="city"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.city || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        fullWidth
                        required={isProviderMandatory}
                        variant="outlined"
                      >
                        <InputLabel>State</InputLabel>
                        <Select
                          onChange={handleProviderChange(index)}
                          label="State* "
                          name="state"
                          value={provider.state || 'Select State'}
                        >
                          <MenuItem value='Select State'>
                            <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                          </MenuItem>
                          {getStates.map((state, index) => (
                            <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        type="text"
                        label="Zip Code"
                        placeholder="12345"
                        name="zip_code"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.zip_code || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        type="text"
                        label="Policy Number"
                        placeholder="00000-00000"
                        name="policy_number"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.policy_number || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        type="text"
                        label="Group Number"
                        placeholder="00000-00000"
                        name="group_number"
                        className={brandClasses.shrinkTextField}
                        onChange={handleProviderChange(index)}
                        value={provider.group_number || ''}
                        fullWidth
                        required={isProviderMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </div>
              ))
            }
            < div className={classes.actionBar} >
              <Button variant="contained" onClick={handleAddProvider} className={classes.greenBtn}>
                <AddIcon />
                {' ADD PROVIDER'}
              </Button>
              {
                formState.providers.length > 1 && (
                  <Button variant="contained" onClick={handleRemoveProvider} className={classes.redBtn}>
                    <RemoveIcon />
                    {' REMOVE'}
                  </Button>
                )
              }
            </div>
          </>
        )}


        {isPharmacyRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" className={brandClasses.naTitle}>PHARMACY INFORMATION</Typography>
              <CheckButton
                label={"Not Applicable"}
                name={'pharmacy'}
                className={brandClasses.naCheckbox}
                onChange={handleNotApplicableChange}
              />
              <Typography></Typography>
            </div>

            {
              formState.pharmacy.map((pharmacy, index) => (
                <div className={classes.upContent} key={index}>
                  <Grid container spacing={4}>
                    <Grid item md={5}>
                      <TextField
                        type="text"
                        label="Primary Pharmacy"
                        placeholder="Enter pharmacy name"
                        name="primary_pharmacy"
                        className={brandClasses.shrinkTextField}
                        onChange={handlePharmacyChange(index)}
                        value={pharmacy.primary_pharmacy || ''}
                        fullWidth
                        required={isPharmacyMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={5}>
                      <TextField
                        type="tel"
                        label="Phone"
                        placeholder="000.000.0000"
                        name="phone"
                        className={brandClasses.shrinkTextField}
                        onChange={handlePharmacyChange(index)}
                        value={pharmacy.phone || ''}
                        fullWidth
                        required={isPharmacyMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        type="text"
                        label="Address"
                        placeholder="Enter address"
                        name="address"
                        className={brandClasses.shrinkTextField}
                        onChange={handlePharmacyChange(index)}
                        value={pharmacy.address || ''}
                        fullWidth
                        required={isPharmacyMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        type="text"
                        label="City"
                        placeholder="Enter City"
                        name="city"
                        className={brandClasses.shrinkTextField}
                        onChange={handlePharmacyChange(index)}
                        value={pharmacy.city || ''}
                        fullWidth
                        required={isPharmacyMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        fullWidth
                        required={isPharmacyMandatory}
                        variant="outlined"
                      >
                        <InputLabel>State</InputLabel>
                        <Select
                          onChange={handlePharmacyChange(index)}
                          label="State* "
                          name="state"
                          value={pharmacy.state || 'Select State'}
                        >
                          <MenuItem value='Select State'>
                            <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                          </MenuItem>
                          {getStates.map((state, index) => (
                            <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        type="text"
                        label="Zip Code"
                        placeholder="12345"
                        name="zip_code"
                        className={brandClasses.shrinkTextField}
                        onChange={handlePharmacyChange(index)}
                        value={pharmacy.zip_code || ''}
                        fullWidth
                        required={isPharmacyMandatory}
                        InputProps={{ classes: { root: classes.inputLabel } }}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </div>
              ))
            }

            <div className={classes.actionBar}>
              <Button variant="contained" onClick={handleAddPharmacy} className={classes.greenBtn}>
                <AddIcon />
                {' ADD Pharmacy'}
              </Button>
              {formState.pharmacy.length > 1 && (
                <Button variant="contained" onClick={handleRemovePharmacy} className={classes.redBtn}>
                  <RemoveIcon />
                  {' REMOVE'}
                </Button>
              )}
            </div>
          </>
        )}


        {isInsuranceRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" className={brandClasses.naTitle}>INSURANCE INFORMATION</Typography>
              <CheckButton
                label={"Not Applicable"}
                name={'insurance'}
                className={brandClasses.naCheckbox}
                onChange={handleNotApplicableChange}
              />
              <Typography></Typography>
            </div>

            <div className={classes.upContent}>
              <Grid container spacing={4}>
                <Grid item md={5}>
                  <TextField
                    type="text"
                    label="Name of Insured"
                    placeholder="Enter name"
                    name="name_of_insured"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.name_of_insured || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={5}>
                  <TextField
                    type="text"
                    label="Insured’s Workplace"
                    placeholder="Enter workplace name"
                    name="insureds_workplace"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.insureds_workplace || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={5}>
                  <TextField
                    type="text"
                    label="Primary Insurance"
                    placeholder="Enter Insurance compnay name"
                    name="primary_insurance"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.primary_insurance || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={5}></Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="PCN"
                    placeholder="0000"
                    name="primary_pcn"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.primary_pcn || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="ID Number"
                    placeholder="000000-0000"
                    name="primary_id_number"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.primary_id_number || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="RX Group"
                    placeholder="0000-0000"
                    name="primary_rx_group"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.primary_rx_group || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="BIN"
                    placeholder="0000"
                    name="primary_bin"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.primary_bin || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4}>
                  <div className={classes.uploadContanier}>
                    <Typography className={classes.uploadTitle}>Insurance Card</Typography>
                    {formState.insurance.front_card
                      ? <img src={formState.insurance.front_card} className={classes.uploadedPhoto} alt="img" />
                      : <Typography className={classes.uploadDesc}>Front of card</Typography>
                    }
                    <div className={classes.uploadImageContainer}>
                      <input type="file" accept="image/*" className={classes.uploadInput} name="front_card" onChange={null} />
                      <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                        <img src="/images/svg/UploadPhoto.svg" alt="" />
                        <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                      </label>
                    </div>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div className={classes.uploadContanier}>
                    <Typography className={classes.uploadTitle}>Insurance Card</Typography>
                    {formState.insurance.back_card
                      ? <img src={formState.insurance.back_card} className={classes.uploadedPhoto} alt="img" />
                      : <Typography className={classes.uploadDesc}>Back of card</Typography>
                    }
                    <div className={classes.uploadImageContainer}>
                      <input type="file" accept="image/*" className={classes.uploadInput} name="back_card" onChange={null} />
                      <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                        <img src="/images/svg/UploadPhoto.svg" alt="" />
                        <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                      </label>
                    </div>
                  </div>
                </Grid>

                <Grid item md={5}>
                  <TextField
                    type="text"
                    label="Secondary Insurance"
                    placeholder="Enter Insurance compnay name"
                    name="secondary_insurance"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.secondary_insurance || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={5}></Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="PCN"
                    placeholder="0000"
                    name="secondary_pcn"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.secondary_pcn || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="ID Number"
                    placeholder="000000-0000"
                    name="secondary_id_number"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.secondary_id_number || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="RX Group"
                    placeholder="0000-0000"
                    name="secondary_rx_group"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.secondary_rx_group || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    type="text"
                    label="BIN"
                    placeholder="0000"
                    name="secondary_bin"
                    className={brandClasses.shrinkTextField}
                    onChange={handleInsuranceChange}
                    value={formState.insurance.secondary_bin || ''}
                    required={isInsuranceMandatory}
                    fullWidth
                    InputProps={{ classes: { root: classes.inputLabel } }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4}>
                  <div className={classes.uploadContanier}>
                    <Typography className={classes.uploadTitle}>Insurance Card</Typography>
                    {formState.insurance.front_card
                      ? <img src={formState.insurance.front_card} className={classes.uploadedPhoto} alt="img" />
                      : <Typography className={classes.uploadDesc}>Front of card</Typography>
                    }
                    <div className={classes.uploadImageContainer}>
                      <input type="file" accept="image/*" className={classes.uploadInput} name="front_card" onChange={null} />
                      <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                        <img src="/images/svg/UploadPhoto.svg" alt="" />
                        <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                      </label>
                    </div>
                  </div>
                </Grid>
                <Grid item md={4}>
                  <div className={classes.uploadContanier}>
                    <Typography className={classes.uploadTitle}>Insurance Card</Typography>
                    {formState.insurance.back_card
                      ? <img src={formState.insurance.back_card} className={classes.uploadedPhoto} alt="img" />
                      : <Typography className={classes.uploadDesc}>Back of card</Typography>
                    }
                    <div className={classes.uploadImageContainer}>
                      <input type="file" accept="image/*" className={classes.uploadInput} name="back_card" onChange={null} />
                      <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                        <img src="/images/svg/UploadPhoto.svg" alt="" />
                        <img src="/images/svg/UploadIcon.svg" alt="" htmlFor="icon-button-file" />
                      </label>
                    </div>
                  </div>
                </Grid>
              </Grid>
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
      </form >

      {isTestdAcPage && <div style={{ marginBottom: 70 }}></div>}

      <DialogAlert
        open={dialogOpen}
        type={appConstants.DIALOG_TYPE_ALERT}
        title={'Alert'}
        message={dialogMessage}
        onClose={handleDialogClose}
      />
    </div >
  );
};

ProviderInformation.propTypes = {
  saveLoading: PropTypes.bool.isRequired,
  updatePatient: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  backTab: PropTypes.func,
  isProviderRequired: PropTypes.bool.isRequired,
  isPharmacyRequired: PropTypes.bool.isRequired,
  isInsuranceRequired: PropTypes.bool.isRequired,
  isProviderMandatory: PropTypes.bool.isRequired,
  isPharmacyMandatory: PropTypes.bool.isRequired,
  isInsuranceMandatory: PropTypes.bool.isRequired,
};

export default ProviderInformation;
