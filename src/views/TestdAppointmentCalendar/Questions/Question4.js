import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import brandStyles from 'theme/brand';
import BlueBox from "components/BlueBox";
import CheckCircleButton from 'components/CheckCircleButton';
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
      '& span svg':{
          color:"white !important"
      }
    },
    [theme.breakpoints.up(440)]: {
      marginTop: 30,
    }
  },
  boxContainer: {
    width: 360,
    margin: '0 auto',
    [theme.breakpoints.up(376)]: {
      width: 370,
    }
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px'
  }


}));

const initialValues = [
  {
    name: 'option1',
    checked: false,
    label: 'Do you have chest pain or tightness in your chest?'
  },
  {
    name: 'option2',
    checked: false,
    label: 'Are you experiencing vomiting or diarrhea?'
  },
  {
    name: 'option3',
    checked: false,
    label: 'Have you ever had an organ or bone marrow transplant?'
  }
];

const Question4 = (props) => {
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
  const handleSubmit = async event => {
    handleQuestionsSubmit(values);
  };

  const handleBack = () => {
    backTab('question');
  }

  return (
    <div className={classes.content} >
      <div className={classes.contentBody}>
        <Typography className={classes.title}>
          Are you experiencing <br /> any of these symptoms?
        </Typography>
        <br />
        <Typography className={classes.description}>
          Select all that apply. If none,<br />
            proceed to the next screen.
        </Typography>

        <div className={classes.boxContainer}>

          {values.map((value, index) => (
            <BlueBox class={classes.box} key={index}>
              <CheckCircleButton
                required={true}
                checked={value.checked}
                label={value.label}
                name={value.index}
                onChange={(e) => onChange(e, index)}
              />
            </BlueBox>
          )
          )}

        </div>


        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px auto 50px' }}>
          {/* <img src='/images/svg/back_button.svg' alt='back' style={{ marginRight: 30, padding: '6px 8px', cursor: 'pointer' }} onClick={handleBack} />
          <Button onClick={handleSubmit} >
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
            onClick={handleSubmit}
          >
            Next
            <ArrowRightAltIcon style={{color:"#fff"}} />
          </Button>
        </div>
        <br /><br /><br /><br />
      </div>

    </div>
  )
}

Question4.propTypes = {
  handleQuestionsSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default Question4;