import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, CircularProgress } from '@material-ui/core';
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
    justifyContent: 'flex-end'
  },
  gridItem: {
    margin: '15px 0'
  },
  label: {
    color: theme.palette.brandDark,
    textAlign: "right"
  }
}));


const SupportServicesInit = [
  { question: 'Housing/Shelter', value: null },
  { question: 'Safer Sex', value: null },
  { question: 'Medical & HIV/AIDS Information', value: null },
  { question: 'Public Benefits', value: null },
  { question: 'Support Groups', value: null },
  { question: 'Individual/Couple/Family Therapy', value: null },
  { question: 'Transportation', value: null },
  { question: 'Food Resources', value: null },
];

const SupportQuestionsInit = [
  { question: 'Do you have any difficulty understanding English?', value: null },
  { question: 'Do you find it easier to talk to your doctor using an interpreter?', value: null },
  { question: 'Do you have any trouble understanding medical instructions?', value: null },
  { question: 'Do you ever feel unsafe in your current living situation?', value: null },
  { question: 'In the past, have you ever been involved in a violent relationship?', value: null },
  { question: 'What is your highest level of education?', value: null },
  { question: 'Do your children, partner(s), or other close support have needs that affect your ability to get healthcare and stay healthy?', value: null },
  { question: 'Do you have a steady source of emotional support from family and friends?', value: null },
  { question: 'Do you have a steady source of income right now?', value: null },
  { question: 'Does your current income meet your basic needs?', value: null },
  { question: 'Are you currently receiving any public assistance?', value: null },
  { question: 'Have you used drugs in the past?', value: null },
  { question: 'Are you currently using drugs?', value: null },
  { question: 'If currently using are you using harm reduction methods?', value: null },
  { question: 'If yes, are you currently enrolled in treatment?', value: null },
];

const SupportService = (props) => {
  const {
    saveLoading,
    updatePatient,
    patient,
    nextTab,
    backTab,
    isSupportServiceRequired,
    isSupportQuesionsRequired,
    isSupportServiceMandatory,
    isSupportQuesionsMandatory,
  } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [didModified, setDidModified] = useState(false);
  const [formState, setFormState] = useState({
    support_services: [...SupportServicesInit],
    support_questions: [...SupportQuestionsInit]
  });

  useEffect(() => {
    console.log('SupportService useEffect');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (patient) {
      if (patient.support_services)
        setFormState(formState => ({ ...formState, support_services: patient.support_services }));
      if (patient.support_questions)
        setFormState(formState => ({ ...formState, support_questions: patient.support_questions }));
    }
  }, [patient]);

  const handleServiceChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.support_services;
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleQuestionChange = index => e => {
    e.persist();
    if (!didModified) setDidModified(true);
    let temp = formState.support_questions;
    temp[index].value = e.target.value;
    setFormState({ ...formState, temp });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!didModified) return nextTab();
    updatePatient({
      support_services: formState.support_services,
      support_questions: formState.support_questions
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
        <Typography variant="h4" className={classes.headerSubTitle}>SUPPORT SERVICES</Typography>
      </div>

      <form
        onSubmit={handleSubmit}
      >
        {isSupportServiceRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >ARE YOU INTERESTED IN RECEIVING SERVICES, INFORMATION OR REFFERALS</Typography>
            </div>
            <div>
              <Grid container>
                {formState.support_services.map((item, index) => (
                  <Grid item lg={5} md={5} sm={6} key={index}>
                    <div className={classes.radioGroup}>
                      <Typography variant="body1" className={classes.label}>
                        {item.question}
                      </Typography>
                      <RadioGroup
                        value={item.value}
                        onChange={handleServiceChange(index)}
                        name={item.question}
                        style={{ flexDirection: 'unset' }}
                      >
                        <RadioCheckButton label='Yes' value='Yes' required={isSupportServiceMandatory} />
                        <RadioCheckButton label='No' value='No' required={isSupportServiceMandatory} />
                      </RadioGroup>
                    </div>
                  </Grid>
                ))}
              </Grid>
              {/* <Grid container>
          <Grid item lg={4} md={4} sm={6} className={classes.gridItem}>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Public Benefits
                        </Typography>
              <RadioGroup
                defaultValue={1}
                name="chk_benefits"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Public Benefits
                        </Typography>
              <RadioGroup
                defaultValue={1}
                name="chk_benefits"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Transportation
                        </Typography>
              <RadioGroup
                defaultValue={1}
                // aria-label="Housing/Shelter"
                name="chk_housing"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>

          </Grid>
          <Grid item lg={4} md={4} sm={6} className={classes.gridItem}>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Safer Sex
                        </Typography>
              <RadioGroup
                defaultValue={1}
                // aria-label="Housing/Shelter"
                name="chk_housing"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Support Groups
                        </Typography>
              <RadioGroup
                defaultValue={1}
                // aria-label="Housing/Shelter"
                name="chk_housing"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Food Resources
                            </Typography>
              <RadioGroup
                defaultValue={1}
                name="chk_housing"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
          </Grid>
          <Grid item lg={4} md={4} sm={6} className={classes.gridItem}>
            <div className={classes.radioGroup}>
              <Typography variant="body1" className={classes.label}>
                Medical & HIV/AIDS<br />
                Information
                            </Typography>
              <RadioGroup
                defaultValue={1}
                name="chk_housing"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
            <div className={classes.radioGroup} >
              <Typography variant="body1" className={classes.label}>
                Individual/Couple/<br />
                Family Therapy
                            </Typography>
              <RadioGroup
                defaultValue={1}
                name="chk_housing"
                style={{ flexDirection: 'unset' }}
              >
                <RadioCheckButton disabled={false} label='Yes' value='1' />
                <RadioCheckButton label='No' value='0' />
              </RadioGroup>
            </div>
          </Grid>
        </Grid> */}
            </div>
          </>
        )}

        {isSupportQuesionsRequired && (
          <>
            <div className={brandClasses.subHeaderBlueDark}>
              <Typography variant="h5" >PLEASE CHECK BEST ANSWER</Typography>
            </div>
            <div>
              <Grid container>
                <Grid item lg={9} md={9} sm={10} className={classes.gridItem}>
                  {formState.support_questions.map((item, index) => (
                    <div className={classes.radioGroup} key={index}>
                      <Typography variant="body1" className={classes.label}>
                        {item.question}
                      </Typography>
                      <RadioGroup
                        value={item.value}
                        onChange={handleQuestionChange(index)}
                        name={item.question}
                        style={{ flexDirection: 'unset' }}
                      >
                        <RadioCheckButton label='Yes' value='Yes' required={isSupportQuesionsMandatory} />
                        <RadioCheckButton label='No' value='No' required={isSupportQuesionsMandatory} />
                      </RadioGroup>
                    </div>
                  ))}
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
      </form>
    </div>
  );
};

SupportService.propTypes = {
  updatePatient: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
  saveLoading: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  backTab: PropTypes.func,
  isSupportServiceRequired: PropTypes.bool.isRequired,
  isSupportQuesionsRequired: PropTypes.bool.isRequired,
  isSupportServiceMandatory: PropTypes.bool.isRequired,
  isSupportQuesionsMandatory: PropTypes.bool.isRequired,
};

export default SupportService;
