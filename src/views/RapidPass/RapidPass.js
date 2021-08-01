import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getScheduleRapidPass } from 'actions/api';
import QRCode from 'qrcode.react';
import { RapidPassCard } from 'icons';
import Alert from '@material-ui/lab/Alert';

const fetchHeaderToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3IiOiJTY2hlZHVsZSIsImlhdCI6MTU5NzI0NzY2MX0.3tRBEgvdIlKADm7kTagLLbzNxm1Gnc70VA49MX406xM';

const useStyles = makeStyles(theme => ({
  spinner: {
    color: '#0F84A9',
  },
  rapidPass: {
    width: '20em',
    height: '20em',
    fontSize: 'unset'
  },
  titleText: {
    textAlign: 'center',
  },
}));

const RapidPass = props => {
  const { getScheduleRapidPass } = props;

  // styles
  const classes = useStyles();

  // hooks
  const [loading, setLoading] = useState(true);
  const [displayError, setDisplayError] = useState(null);
  const [qrcodeValue, setQRcodeValue] = useState('');

  const scheduleId = props.match.params.id;

  useEffect(() => {
    (async () => {
      let res = await getScheduleRapidPass(fetchHeaderToken, scheduleId);
      setLoading(false);
      if (res.success) {
        setQRcodeValue(res.data);
      } else {
        setDisplayError("Something went wrong. Please contact Administrator");
      }
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (document.getElementById("rapid-pass-qr-code-id")) {
      let qrCodeId = document.getElementById("rapid-pass-qr-code-id");
      qrCodeId.removeAttribute("width");
      qrCodeId.removeAttribute("height");
      qrCodeId.setAttribute("viewBox", "0 0 22 80");
      qrCodeId.childNodes[0].setAttribute("transform", "translate(44.000000, 22.000000) rotate(45.267395)");
      qrCodeId.childNodes[1].setAttribute("transform", "translate(44.000000, 22.000000) rotate(45.267395)");
    }
  }, [qrcodeValue]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <div className={classes.error}>
        {displayError ? <Alert severity="error">{displayError}</Alert> : null}
      </div>

      {loading
        ?
        <CircularProgress className={classes.spinner} />
        :
        qrcodeValue &&
        <>
          <RapidPassCard
            className={classes.rapidPass}
            qrcode={<QRCode
              id="rapid-pass-qr-code-id"
              renderAs="svg"
              fgColor="#0F84A9"
              value={qrcodeValue}
            />}
          />
          <Typography variant="h4" className={classes.titleText}>
            SHOW THE PASS ABOVE <br /> AT THE CHECK-IN FOR TESTING
          </Typography>
        </>
      }
    </Grid>
  );
};

RapidPass.propTypes = {
  getScheduleRapidPass: PropTypes.func.isRequired,
};

export default connect(null, { getScheduleRapidPass })(RapidPass);
