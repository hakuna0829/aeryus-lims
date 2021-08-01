import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, TextField, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import Select from '@material-ui/core/Select';
import { getStates } from 'helpers';
import ZipCodeInput from 'components/ZipCodeInput';
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
    fontSize: 12,
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

const Question7 = (props) => {
  const { user, handleQuestionsSubmit, backTab } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [formState, setFormState] = React.useState({});
  // const [isMobileScreen, setIsMobileScreen] = React.useState(false);
  const containerRef = React.useRef();

  React.useEffect(() => {
    if (user)
      setFormState(user);
  }, [user]);

  React.useEffect(() => {
    function handleResize() {
      // Set window width/height to state
      // const tempWidth = containerRef.current.offsetWidth;
      // if(tempWidth < 600){
      //   setIsMobileScreen(true);
      // }else{
      //   setIsMobileScreen(false);
      // }
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    formState.zip_code = formState.zip_code.trim();
    handleQuestionsSubmit(formState);
  };

  const handleBack = () => {
    backTab('question');
  }

  return (
    <div className={classes.content} ref={containerRef} >
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          Tell us where you live?
        </Typography>
        <br />
        {/* <Typography className={classes.description}>
          Select all that apply
        </Typography> */}

        <form
          onSubmit={handleSubmit}
        >
          <div className={classes.boxContainer}>
            <TextField
              type="text"
              label="Address 1"
              placeholder="Address 1"
              name="address"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.address || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="Address 2"
              placeholder="Address 2"
              name="address2"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.address2 || ''}
              fullWidth
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <TextField
              type="text"
              label="City"
              placeholder="City"
              name="city"
              className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
              onChange={handleChange}
              value={formState.city || ''}
              fullWidth
              required
              InputProps={{ classes: { root: classes.inputLabel } }}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <br />
            <FormControl
              className={brandClasses.shrinkTextField}
              required
              fullWidth
              variant="outlined"
            >
              <InputLabel shrink className={brandClasses.selectShrinkLabel}>State</InputLabel>
              <Select
                onChange={handleChange}
                label="State* "
                name="state"
                required
                displayEmpty
                value={formState.state || ''}
              >
                <MenuItem value=''>
                  <Typography className={brandClasses.selectPlaceholder}>Select State</Typography>
                </MenuItem>
                {getStates.map((state, index) => (
                  <MenuItem key={index} value={state.text}>{state.text}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <br />
            <Grid container spacing={1}>
              <Grid item xs={7} sm={6}>
                <TextField
                  type="text"
                  label="County"
                  placeholder="County"
                  name="county"
                  className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
                  onChange={handleChange}
                  value={formState.county || ''}
                  fullWidth
                  required
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={5} sm={6}>
                <ZipCodeInput
                  label="Zip code"
                  placeholder="Zipcode"
                  name="zip_code"
                  className={clsx(brandClasses.shrinkTextField, classes.inputTextField)}
                  onChange={handleChange}
                  value={formState.zip_code || ''}
                  fullWidth
                  required
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>

          {/* <div style={{ textAlign: 'center' }}>
            <Typography className={classes.description}>
              *All your personal information <br /> is encrypted and secure.
            </Typography>
          </div> */}

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px auto 50px' }}>
            {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, cursor: 'pointer' }} onClick={handleBack} />
            <Button type="submit" >
              <img src='/images/svg/next_button.svg' alt='next' />
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
              <ArrowRightAltIcon style={{color:"#fff"}} />
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}

Question7.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Question7;
