import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormControl, Select, MenuItem, CircularProgress, Dialog, DialogContent, Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
// import GreenButton from '../../../layouts/Main/components/Button/GreenButton';
import ResultsDetail from '../../Dialog/ResultsDetail';
// import CustomSelectBox from 'components/SelectBox';
import brandStyles from 'theme/brand';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
import { updateTestingResult } from 'actions/api';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    width: '480px',
    // paddingRight: 15,
    // border: 'solid red 1px',
    margin: '0 auto 20px',
    [theme.breakpoints.between('md', 'lg')]: {
      width: '100%',
      paddingRight: 15
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '320px',
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      width: '320px',
    },
  },
  bgYellow: {
    backgroundColor: '#FF931E'
  },
  bgGreen: {
    backgroundColor: '#25DD83'
  },
  bgRed: {
    backgroundColor: '#DD2525'
  },
  borderYellow: {
    border: 'solid 1px #FF931E'
  },
  borderGreen: {
    border: 'solid 1px #25DD83'
  },
  borderRed: {
    border: 'solid 1px #DD2525'
  },
  total: {
    color: '#fff',
    fontSize: '22px',
    fontFamily: 'Montserrat',
    width: '120px',
    padding: '5px 16px',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: '18px',
    },
  },
  header: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'Montserrat',
    width: '100%',
    padding: '10px 20px',
    borderTopRightRadius: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
    },
  },
  body: {
    padding: '0px 40px'
  },
  fullname: {
    color: '#043B5D',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'Montserrat',
    lineHeight: '24px',
    margin: '5px 0',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
    },
  },
  location: {
    color: '#043B5D',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Montserrat',
    lineHeight: '24px',
    margin: '5px 0',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
    },
  },
  testDate: {
    color: '#043B5D',
    fontSize: '18px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    lineHeight: '24px',
    margin: '5px 0',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
    },
  },
  idNumber: {
    color: '#043B5D',
    fontSize: '18px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    lineHeight: '24px',
    margin: '5px 0 20px',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
    },
  },
  comesFromLab: {
    color: '#043B5D',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '5px 0 20px'
  },
  editBtnContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 35,
    cursor: 'pointer',
    [theme.breakpoints.between('sm', 'md')]: {
      width: 30,
    },
  },
  dialBtnContainer: {
    position: 'absolute',
    bottom: 22,
    left: -30,
    width: 22,
    cursor: 'pointer',
    '& img': {
      width: '100%'
    }
  },
  greenButton: {
    padding: '5px'
  },
  TestItemContainer: {
    position: 'relative',
    margin: '30px auto 20px',
    borderBottom: 'solid 1px rgba(15,132,169,0.5)',
    '&:last-child': {
      borderBottom: 'solid 0px'
    }
  },
  selectOption: {
    color: '#0F84A9'
  },
  // dialog css
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

const Card = props => {
  const classes = useStyles();
  const brandClasses = brandStyles();

  const [isShowResultsDetailDlg, setIsShowResultDetailDlg] = useState(false);
  const [isShowResultsDetailNoBtnDlg, setIsShowResultNoBtnDlg] = useState(false);
  const [selectedTested, setSelectedTested] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState({});

  // const fieldData = [
  //   { value: 0, label: '' },
  //   { value: 1, label: 'Positive' },
  //   { value: 2, label: 'Negative' },
  // ];

  const MakeTotalRow = () => {
    if (props.data.type === 'pending')
      return <Typography className={clsx(classes.total, classes.bgYellow)}>{props.data.total}</Typography>
    if (props.data.type === 'negative')
      return <Typography className={clsx(classes.total, classes.bgGreen)}>{props.data.total}</Typography>
    if (props.data.type === 'positive')
      return <Typography className={clsx(classes.total, classes.bgRed)}>{props.data.total}</Typography>
  }

  const MakeHeader = () => {
    if (props.data.type === 'pending')
      return <Typography className={clsx(classes.header, classes.bgYellow)}>{props.data.type}</Typography>
    if (props.data.type === 'negative')
      return <Typography className={clsx(classes.header, classes.bgGreen)}>{props.data.type}</Typography>
    if (props.data.type === 'positive')
      return <Typography className={clsx(classes.header, classes.bgRed)}>{props.data.type}</Typography>
  }

  // const onClickINTERPRET = (data) => {
  //   console.log('clicked Interpret button', data);
  //   setSelectedTested(data);
  //   setIsShowResultDetailDlg(true)
  // }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleConfirm = () => {
    setLoading(true);
    updateTestingResult(selectedResult).then(res => {
      setDialogOpen(false);
      setLoading(false);
      if (res.data.success) {
        props.setRefetch(refetch => refetch + 1);
      } else {
        showFailedDialog(res);
      }
    }).catch(error => {
      setLoading(false);
      showErrorDialog(error);
    });
  }

  const onClickSummary = (data) => {
    console.log('clicked summary icon', data);
    // setIsResultSummaryDlg(true);
  }

  const onClickEdit = (data) => {
    console.log('clicked Edit button', data);
    setSelectedTested(data);
    setIsShowResultNoBtnDlg(true)
  }

  const handleResultChange = (data) => e => {
    e.persist();
    let body = {
      testing_id: data.data._id,
      name: `${data.lastName}, ${data.firstName}`,
      result: e.target.value,
    };
    setSelectedResult(body);
    setDialogOpen(true);
  }

  const MakeTestItem = () => {
    return (
      props.data.data.map((item, index) =>
        (
          <div className={classes.TestItemContainer} key={index}>
            <Typography variant="h4" className={classes.fullname}> {item.lastName}, {item.firstName}</Typography>
            <Typography variant="h4" className={classes.location}> Location: {item.locaiton}</Typography>
            <Typography variant="h4" className={classes.testDate}> Test Date: {item.collected_timestamp}</Typography>
            <Typography variant="h4" className={classes.idNumber}> ID Number: {item.id}</Typography>
            {props.data.type === 'pending' ? (
              <div className={classes.buttonContainer}>
                {/* <GreenButton label="INTERPRET" className={classes.greenButton} onClick={() => onClickINTERPRET(item.data)} /> */}
                {/* <CustomSelectBox
                  className={classes.selectOption}
                  data={fieldData}
                /> */}
                {loading
                  ?
                  <CircularProgress />
                  :
                  <>
                    {item.type_type !== 'Antigen'
                      ?
                      <Typography variant="h6" className={classes.comesFromLab}>Comes from LAB</Typography>
                      :
                      <FormControl
                        className={brandClasses.shrinkTextField}
                        variant="outlined"
                      >
                        <Select
                          onChange={handleResultChange(item)}
                          name="result"
                          value={'Select'}
                        >
                          <MenuItem value='Select'>
                            <Typography className={brandClasses.selectPlaceholder}>Select Results</Typography>
                          </MenuItem>
                          <MenuItem value='Positive'>Positive</MenuItem>
                          <MenuItem value='Negative'>Negative</MenuItem>
                        </Select>
                      </FormControl>
                    }
                    <div className={classes.editBtnContainer} onClick={() => onClickSummary(item.data)}>
                      <img src="./images/svg/document_icon.svg" alt="edit" />
                    </div>
                  </>
                }
              </div>
            ) : props.data.type !== 'positive' ? (
              <div className={classes.editBtnContainer} onClick={() => onClickEdit(item.data)}>
                <img src="./images/svg/document_icon.svg" alt="edit" />
              </div>) : (
                  <>
                    <div className={classes.editBtnContainer} onClick={() => onClickEdit(item.data)}>
                      <img src="./images/svg/document_icon.svg" alt="edit" />
                    </div>
                    <div className={classes.dialBtnContainer} >
                      <img src="./images/svg/telephone_icon–blue.svg" alt="edit" />
                    </div>
                  </>)}


          </div>
        )
      )
    )

  }
  return (
    <div className={classes.root}>
      <MakeTotalRow />
      <MakeHeader />
      <div className={props.data.type === 'pending' ? clsx(classes.body, classes.borderYellow) : props.data.type === 'negative' ? clsx(classes.body, classes.borderGreen) : clsx(classes.body, classes.borderRed)}>
        <MakeTestItem />
      </div>
      <ResultsDetail
        isShowResultsDetailDlg={isShowResultsDetailDlg}
        toggleResultsDetailDlg={setIsShowResultDetailDlg}
        data={selectedTested}
        setRefetch={props.setRefetch}
        isActionBtn={true}
      />
      <ResultsDetail
        isShowResultsDetailDlg={isShowResultsDetailNoBtnDlg}
        toggleResultsDetailDlg={setIsShowResultNoBtnDlg}
        data={selectedTested}
        isActionBtn={false}
      />

      {/* confirm result status */}
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
            Please confirm test result for <br />
            {selectedResult.name} <br />
            {selectedResult.result}
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
                    onClick={handleConfirm}
                    className={brandClasses.button}
                    classes={{ disabled: brandClasses.buttonDisabled }}
                    disabled={loading}
                  >
                    {'CONFIRM'} {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
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

Card.propTypes = {
  data: PropTypes.any,
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
};

export default connect(null, { showFailedDialog, showErrorDialog })(Card);