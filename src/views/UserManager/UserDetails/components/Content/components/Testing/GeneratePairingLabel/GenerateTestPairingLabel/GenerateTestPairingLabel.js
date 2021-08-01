import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Paper, Grid, Divider, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem,
  Avatar
} from '@material-ui/core';
import brandStyles from 'theme/brand';
import { Print } from 'icons';
import { generateTestKit, updateUserTesting, clientServer } from 'actions/api';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import { useReactToPrint } from 'react-to-print';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import { getTestTypes } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(0)}px 0px`,
  },
  userBarContainer: {
    width: '50%',
    backgroundColor: theme.palette.brandLightBlue,
    // '&.full':{
    //   width:'100%'
    // }
  },
  avatar: {
    backgroundColor: '#D8D8D8',
    width: 61,
    height: 61
  },
  fullContainer: {
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(1)}px`,
    marginTop: `${theme.spacing(2)}px`,
    alignItems: 'center'
  },
  headerSubTitle: {
    color: theme.palette.brandText,
    marginLeft: 8
  },
  gridBody: {
    marginTop: theme.spacing(8)
  },
  paperQR: {
    height: 266,
    width: 266,
    boxSizing: 'border-box',
    border: `1px solid ${theme.palette.brandDark}`,
    boxShadow: '5px 5px 10px 3px rgba(15,132,169,0.3)'
  },
  qrcode: {
    margin: theme.spacing(4)
  },
  qrSubText: {
    color: theme.palette.brand,
    textAlign: 'center',
    fontWeight: 600
  },
  generateButton: {
    marginTop: theme.spacing(10),
    margin: theme.spacing(4),
    fontSize: 14,
    lineHeight: 1.5
  },
  labelTitle: {
    marginTop: theme.spacing(8),
    color: theme.palette.brandDark,
    fontWeight: 600
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: '80%',
    backgroundColor: theme.palette.brandDark,
  },
  label: {
    color: theme.palette.brandGray,
  },
  footer: {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  printLabel: {
    color: theme.palette.brandDark,
    fontWeight: 600,
    textAlign: 'center'
  },
  nextButton: {
    marginTop: 18
  },
  printPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // rotation
    // margin: 80,
    // '-webkit-transform': 'rotate(90deg)',
    // '-moz-transform': 'rotate(90deg)',
    // '-o-transform': 'rotate(90deg)',
    // '-ms-transform': 'rotate(90deg)',
    // transform: 'rotate(90deg)',
  },
  flexContainer: {
    display: 'flex',
  }
}));

const GenerateTestPairingLabel = (props) => {
  const { nextTab, testing, setTesting, updateUserTesting, generateTestKit } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const componentRef = useRef();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formState, setFormState] = useState({});
  const [didModified, setDidModified] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (testing.test_type) {
      setFormState(formState => ({
        ...formState,
        test_type: testing.test_type
      }));
    }
    // eslint-disable-next-line
  }, [testing.test_type]);

  const handlePrint = () => {
    if (testing.testkit_id) {
      // const canvas = document.getElementById("qr-code");
      // const pngUrl = canvas
      //   .toDataURL("image/png")
      //   .replace("image/png", "image/octet-stream");
      // let downloadLink = document.createElement("a");
      // downloadLink.href = pngUrl;
      // downloadLink.download = "qr-code.png";
      // document.body.appendChild(downloadLink);
      // downloadLink.click();
      // document.body.removeChild(downloadLink);
      setIsPrinting(true);
      setTimeout(() => {
        printQR();
        setTimeout(() => { setIsPrinting(false) }, 1000);
      }, 500);
    } else {
      setDisplayError('Please Generate Test Kit ID');
    }
  }

  const printQR = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleChange = e => {
    e.persist();
    if (!didModified) setDidModified(true);
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const closeErrorMessage = () => {
    setDisplayError(null);
  };

  const generateTestKitId = async () => {
    setLoading(true);
    const res = await generateTestKit(testing._id);
    if (res.success) {
      setTesting(testing => ({
        ...testing,
        testkit_id: res.data.testkit_id,
        test_session_id: res.data.test_session_id,
      }));
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testing.testkit_id)
      return setDisplayError('Please Generate Test Kit ID');
    if (didModified) {
      let body = {
        test_type: formState.test_type
      }
      setSaveLoading(true);
      const res = await updateUserTesting(testing._id, body);
      setSaveLoading(false);
      if (res.success) {
        setTesting(testing => ({
          ...testing,
          test_type: formState.test_type,
        }));
        nextTab();
        if (testing.paired) {
          nextTab();
        }
      }
    } else {
      nextTab();
      if (testing.paired) {
        nextTab();
      }
    }
  };

  class PrintingPage extends React.Component {
    render() {
      return (
        <div className={classes.printPage}>
          <QRCode
            id="qr-code"
            value={testing.testkit_id}
            size={80}
          />
          &nbsp; &nbsp;
          {testing.testkit_id}
        </div>
      );
    }
  }
  // eslint-disable-next-line
  const [isExpandedUserBar, setExpandedUserBar] = useState(false);

  return (
    <div className={classes.root}>
      {isPrinting && <PrintingPage ref={componentRef} />}
      <form
        onSubmit={handleSubmit}
      >
        {/* new user bar */}
        <div
          className={isExpandedUserBar ? clsx(classes.userBarContainer, classes.fullContainer) : classes.userBarContainer}
          style={{ display: 'none' }}
        >
          <Grid container>
            <Grid item xs={isExpandedUserBar ? 2 : 4} style={{ border: 'solid 1px' }}>
              <div className={classes.flexContainer}>
                <Avatar
                  className={classes.avatar}
                />
                <div>
                  <Typography variant="h2" className={brandClasses.headerTitle}>
                    User Bar
                  </Typography>
                </div>
              </div>
              <ChevronRightIcon onClick={() => setExpandedUserBar(true)} />
              <CloseIcon onClick={() => setExpandedUserBar(false)} />
            </Grid>
            <Grid item xs={isExpandedUserBar ? 2 : 4} style={{ border: 'solid 1px' }}> b</Grid>
            <Grid item xs={isExpandedUserBar ? 2 : 4} style={{ border: 'solid 1px' }}> a</Grid>
            <Grid item xs={2} style={isExpandedUserBar ? { border: 'solid 1px' } : { display: 'none' }}> b</Grid>
            <Grid item xs={2} style={isExpandedUserBar ? { border: 'solid 1px' } : { display: 'none' }}> b</Grid>
            <Grid item xs={2} style={isExpandedUserBar ? { border: 'solid 1px' } : { display: 'none' }}> b</Grid>
          </Grid>
        </div>
        {/*  */}
        <div className={classes.header}>
          <Typography variant="h2" className={brandClasses.headerTitle}>
            <>
              <img src="/images/svg/status/users_icon.svg" alt="" />
              {'User Manager'} |
          </>
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>
            {'CHECK-IN | GENERATE TEST PAIRING LABEL'}
          </Typography>
        </div>
        <Grid
          className={classes.gridBody}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Paper className={classes.paperQR} >
            <Grid container direction="column" justify="center" alignItems="center" >
              {testing.testkit_id
                ?
                <QRCode
                  id="qr-code"
                  value={testing.testkit_id}
                  fgColor="#3ECCCD"
                  className={classes.qrcode}
                />
                :
                <Button
                  className={clsx(brandClasses.button, classes.generateButton)}
                  classes={{ disabled: brandClasses.buttonDisabled }}
                  disabled={loading}
                  onClick={generateTestKitId}
                >
                  GENERATE <br></br> TEST KIT ID
                {loading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                </Button>
              }
              <Typography variant="h4" className={classes.qrSubText}>
                GENERATE <br></br> TEST KIT ID
            </Typography>
            </Grid>
          </Paper>

          <FormControl
            className={brandClasses.shrinkTextField}
            required
            variant="outlined"
            style={{ width: 266, marginTop: 70 }}
          >
            <InputLabel shrink className={brandClasses.selectShrinkLabel}>Select Test Type</InputLabel>
            <Select
              onChange={handleChange}
              label="Select Test Type* "
              name="test_type"
              displayEmpty
              value={formState.test_type || ''}
            >
              <MenuItem value=''>
                <Typography className={brandClasses.selectPlaceholder}>Select Test Type</Typography>
              </MenuItem>
              {getTestTypes.map((type, index) => (
                <MenuItem key={index} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h4" className={classes.labelTitle}>
            TEST KIT ID
        </Typography>

          <Divider className={classes.divider} />
          <Typography variant="h2" className={classes.label}>
            {testing.testkit_id
              ? testing.testkit_id
              : 'Not Generated Yet'
            }
          </Typography>
          <Divider className={classes.divider} />
        </Grid>

        <div className={classes.footer}>
          <Grid>
            {displayError ? <Alert severity="error" onClose={() => { closeErrorMessage() }}>{displayError}</Alert> : null}
            <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
              {clientServer !== 'prod003' &&
                <Grid item>
                  <Typography variant="h6" className={classes.printLabel}>
                    {'Print Test QR Code'}
                  </Typography>
                  <Button
                    className={brandClasses.button}
                    onClick={handlePrint}
                    startIcon={<Print />}
                  >
                    {'PRINT'}
                  </Button>
                </Grid>
              }
              <Grid item>
                <Button
                  type="submit"
                  className={clsx(brandClasses.button, brandClasses.whiteButton, classes.nextButton)}
                  classes={{ disabled: brandClasses.buttonDisabled }}
                  disabled={saveLoading}
                >
                  {'NEXT'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </form>
    </div>
  );
};

GenerateTestPairingLabel.prototype = {
  nextTab: PropTypes.func.isRequired,
  generateTestKit: PropTypes.func.isRequired,
  testing: PropTypes.object.isRequired,
  setTesting: PropTypes.func.isRequired,
  updateUserTesting: PropTypes.func.isRequired,
};

export default connect(null, { generateTestKit, updateUserTesting })(GenerateTestPairingLabel);
