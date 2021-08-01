import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Typography, TextField, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import { updateTestdAcPatient } from 'actions/api';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Montserrat',
    margin: 0
  },
  content: {
    position: 'fixed',
    top: 65,
    width: '100%',
    height: 'calc(100% - 97px)',
    backgroundSize: 'cover',
    overflowY: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.up(415)]: {
      top: 80,
      height: 'calc(100% - 128px)',
    }
  },
  contentBody: {
    height: '100%',
    paddingTop: '2vh'
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 20,
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
    }
  },
  description: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 24,
    [theme.breakpoints.up(415)]: {
      fontSize: 14,
      marginBottom: 12,
    }
  },
  tempBox: {
    width: '100%',
    // height: '100%',
    border: 'solid 1px #0F84A9',
    padding: 0,
    borderRadius: 8,
    marginTop: 16,
    // '& input': {
    //   padding: '4px 10px',
    // },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    },
  },
  utilRoot: {
    width: '100%',
    height: '100%',
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    padding: 0,
    marginLeft: 8,
    marginTop: 16,
    '& input': {
      padding: 16,
    },
    '&>div:before': {
      borderBottom: 0
    },
    '&>div:after': {
      borderBottom: 0
    },
    '&>div:before:hover': {
      borderBottom: 0
    }
  },
  logonButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#0F84A9',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 30,
    [theme.breakpoints.up(376)]: {
      marginTop: 50,
    }
  },
  backButton: {
    height: 50,
    width: 250,
    borderRadius: 10,
    backgroundColor: '#FFF',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 25,
    color: '#0F84A9',
    border: '#0F84A9 solid 1px',
    '&:hover': {
      backgroundColor: '#0F84A9',
      color: '#fff',
    },
    [theme.breakpoints.up(440)]: {
      marginTop: 30,
    }
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '45%',
    margin: 0
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  boxContainer: {
    width: 360,
    margin: '0 auto',
    [theme.breakpoints.up(376)]: {
      width: 340,
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px'
  },
  inputTextField: {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-input': {
        padding: '15px !important',
      },
      '& fieldset': {
      },
      '&:hover fieldset': {
      },
      '&.Mui-focused fieldset': {
      },
    },
    '& .MuiInputLabel-shrink': {
    },
  },


}));

const Inputs = (props) => {
  const { user, patient, testdAcToken, handleInsuranceSubmit, backTab, updateTestdAcPatient } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = React.useState(false);
  const [formState, setFormState] = React.useState({ insurance: {} });

  React.useEffect(() => {
    if (patient && patient.insurance)
      setFormState(patient);
  }, [patient]);

  const handleChange = e => {
    e.persist();
    let temp = formState.insurance;
    temp[e.target.name] = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    const res = await updateTestdAcPatient(testdAcToken, user._id, formState);
    setLoading(false);
    if (res.success) {
      handleInsuranceSubmit(formState);
    }
  };

  const handleBack = () => {
    backTab('insurance');
  }

  return (
    <div className={classes.content}>
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          Insurance Information
        </Typography>
        <Typography className={classes.description}>
          You can find this information on <br />your insurance card.
        </Typography>
        <br />

        <form
          onSubmit={handleSubmit}
        >
          <div className={classes.boxContainer}>
            <TextField
              type="text"
              label="Insurance Name"
              placeholder="Enter Insurance name"
              name="primary_insurance"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              value={formState.insurance.primary_insurance || ''}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="PCN"
              placeholder="Enter PCN"
              name="primary_pcn"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              value={formState.insurance.primary_pcn || ''}
              onChange={handleChange}
              fullWidth
              // required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="Policy Number"
              placeholder="Enter policy number"
              name="primary_id_number"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.insurance.primary_id_number || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="Group Number"
              placeholder="Enter group number"
              name="primary_rx_group"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.insurance.primary_rx_group || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="BIN Number"
              placeholder="Enter BIN number"
              name="primary_bin"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.insurance.primary_bin || ''}
              fullWidth
              // required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px auto 50px' }}>
            {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, cursor: 'pointer' }} onClick={handleBack} />
            {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
            <Button type="submit" >
              <img src='/images/svg/next_button.svg' alt='next' disabled={loading} />
            </Button> */}
            <Button
              className={clsx(brandClasses.backButton, brandClasses.loginButton)}
              onClick={handleBack}
            >
              <KeyboardBackspaceIcon style={{color:"#0F84A9"}} />
              Back
            </Button>

            <Button
              className={clsx(brandClasses.logonButton, brandClasses.loginButton)}
              type="submit"
            >
              Next
              {loading ? <CircularProgress size={20} style={{color:"#fff"}} /> : ''}
              <ArrowRightAltIcon style={{color:"#fff"}} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

Inputs.propTypes = {
  handleInsuranceSubmit: PropTypes.func.isRequired,
  updateTestdAcPatient: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default connect(null, { updateTestdAcPatient })(Inputs);

