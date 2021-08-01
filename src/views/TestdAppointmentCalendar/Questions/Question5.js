import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import BlueBox from "components/BlueBox";
import CheckCircleButton from 'components/CheckCircleButton';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from '@date-io/moment';
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
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
      lineHeight: 1.5
    }
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 20,
    [theme.breakpoints.up(415)]: {
      fontSize: 20,
      marginBottom: 25,
    }
  },
  tempBox: {
    width: 100,
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    marginLeft: 8,
    '& input': {
      padding: 6
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
  boxContainer: {
    width: 360,
    margin: '0 auto',
    [theme.breakpoints.up(376)]: {
      width: 320,
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px'
  },
  utilRoot: {
    width: 100,
    border: 'solid 1px #0F84A9',
    borderRadius: 8,
    marginLeft: 8,
    '& input': {
      padding: 6
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
  }


}));

const initialValues = [
  {
    name: 'option1',
    checked: false,
    label: 'Do you live in an area where COVID-19 is widespread?'
  },
  {
    name: 'option2',
    checked: false,
    label: 'Have you visited a nursing home in the last 14 days? '
  },
  {
    name: 'option3',
    checked: moment(),
    label: 'When did you last visit?'
  },
  {
    name: 'option4',
    checked: '',
    label: 'Where did you visit?'
  },
  {
    name: 'option5',
    checked: false,
    label: 'Have you traveled outside the US in the last 14 days?'
  },
  {
    name: 'option6',
    checked: moment(),
    label: 'When did you last visit?'
  },
  {
    name: 'option7',
    checked: '',
    label: 'Where did you visit?'
  },
];

const Question5 = (props) => {
  const { handleQuestionsSubmit, backTab, id } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();
  const [values, setValues] = React.useState(initialValues);

  React.useEffect(() => {
    setValues(initialValues);
  }, [id]);

  const onChange = (e, index) => {
    var prevValues = values;
    prevValues[index].checked = !prevValues[index].checked;
    setValues([...prevValues]);
  }

  const handleEmpDateChange = (e, index) => {
    console.log(e, index)
    var prevValues = values;
    prevValues[index].checked = e;
    setValues([...prevValues]);
  };

  const onChangeLocation = (e, index) => {
    var prevValues = values;
    prevValues[index].checked = e.target.value;
    setValues([...prevValues]);
  }

  const handleSubmit = async event => {
    // const validation_checked = values.filter(value => value.checked === true);
    // if (validation_checked.length < 1) {
    //   setDisplayError('Please select one option at least.');
    //   return;
    // }
    // if (values[3].checked === true && values[5].checked === '') {
    //   setDisplayError('Please input your location that you visited.');
    //   return;
    // }
    handleQuestionsSubmit(values);
  };

  const handleBack = () => {
    backTab('question');
  }

  return (
    <div className={classes.content} >
      <form
        onSubmit={handleSubmit}
      >
        <div className={classes.contentBody}>
          <Typography className={classes.title}>
            In the last 14 days, have<br />
            you been in an area where<br />
            COVID-19 is widespread?
          </Typography>
          <br />
          <Typography className={classes.description}>
            Select all that apply. If none,<br />
            proceed to the next screen.
          </Typography>

          <div className={classes.boxContainer}>

            {values.map((value, index) => (
              <div key={index}>
                {index === 2
                  ?
                  values[1].checked === true ?
                    (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30 }}>
                        <Typography > When did you last visit? </Typography>
                        <MuiPickersUtilsProvider utils={MomentUtils} >
                          <DatePicker
                            value={value.checked}
                            showTodayButton={true}
                            maxDate={moment()}
                            required
                            format="MM/DD/yyyy"
                            onChange={(e) => handleEmpDateChange(e, index)}
                            className={classes.utilRoot}
                            id="weekCalendar"
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    )
                    :
                    (<></>)
                  :
                  index === 3
                    ?
                    values[1].checked === true ?
                      (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30 }}>
                          <Typography >Where did you visit?</Typography>
                          <TextField
                            onChange={(e) => onChangeLocation(e, index)}
                            defaultValue={value.checked}
                            helperText=""
                            required
                            inputProps={{ maxLength: 20 }}
                            variant="outlined"
                            className={classes.tempBox}
                          />
                        </div>
                      )
                      :
                      (<></>)
                    :
                    index === 5
                      ?
                      values[4].checked === true
                        ?
                        (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30 }}>
                            <Typography > When did you last visit? </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils} >
                              <DatePicker
                                // {moment(empDate).weekday(0), moment(empDate).weekday(6) }
                                value={value.checked}
                                showTodayButton={true}
                                maxDate={moment()}
                                required
                                format="MM/DD/yyyy"
                                onChange={(e) => handleEmpDateChange(e, index)}
                                className={classes.utilRoot}
                                id="weekCalendar"
                              />
                            </MuiPickersUtilsProvider>
                          </div>
                        )
                        :
                        (<></>)
                      :
                      index === 6
                        ?
                        values[4].checked === true ?
                          (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30 }}>
                              <Typography >Where did you visit?</Typography>
                              <TextField
                                onChange={(e) => onChangeLocation(e, index)}
                                defaultValue={value.checked}
                                helperText=""
                                required
                                inputProps={{ maxLength: 20 }}
                                variant="outlined"
                                className={classes.tempBox}
                              />
                            </div>
                          )
                          :
                          (<></>)
                        // <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30 }}>
                        //   <Typography >Where did you visit?</Typography>
                        //   <TextField
                        //     onChange={onChangeLocation}
                        //     defaultValue={value.checked}
                        //     helperText=""
                        //     variant="outlined"
                        //     className={classes.tempBox}
                        //   />
                        // </div>
                        :
                        <BlueBox class={classes.box}>
                          <CheckCircleButton
                            checked={value.checked}
                            label={value.label}
                            name={value.index}
                            onChange={(e) => onChange(e, index)}
                          />
                        </BlueBox>
                }
              </div>
            )
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px auto 50px' }}>
            {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, padding: '6px 8px', cursor: 'pointer' }} onClick={handleBack} />
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
        </div>
      </form>
    </div>
  )
}

Question5.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Question5;
