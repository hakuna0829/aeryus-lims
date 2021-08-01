import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress, Typography } from '@material-ui/core';
import { getOrdersCounts } from 'actions/api';
import { numberWithCommas } from 'helpers/utility';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    // width: 294
  },
  overviewTitle: {
    color: theme.palette.blueDark,
    backgroundColor: theme.palette.sideMenuBgColor,
    textAlign: 'center',
    padding: '25px 30px',
    fontWeight: 600
  },
  totalOrders: {
    backgroundColor: 'rgba(62,204,205,0.5)',
    padding: '20px',
    border: 'solid 1px #3ECCCD',
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  totalTitle: {
    color: '#043B5D',
    textAlign: 'center'
  },
  totalValue: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 36
  },
  divider: {
    width: '80%',
    color: 'white',
    border: 'solid 1px',
    margin: '20px auto'
  },
}));

const Sidebar = (props) => {
  const { refetch, getOrdersCounts } = props;

  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      let res = await getOrdersCounts();
      setLoading(false);
      if (res.success) {
        setTotals(res.data);
      }
    })();
    // eslint-disable-next-line
  }, [refetch]);

  return (
    <div className={classes.root}>
      <Typography className={classes.overviewTitle} variant="h4">
        {'OVERVIEW'}
      </Typography>
      <div className={classes.totalOrders} >
        <Typography variant="h6" className={classes.totalTitle}>Total orders</Typography>
        <Typography variant="h1" className={classes.totalValue}>
          {loading
            ?
            <CircularProgress />
            :
            numberWithCommas(totals.total_orders)
          }
        </Typography>
        <hr className={classes.divider} />
        <Typography variant="h6" className={classes.totalTitle}>Total orders resulted</Typography>
        <Typography variant="h1" className={classes.totalValue}>
          {loading
            ?
            <CircularProgress />
            :
            numberWithCommas(totals.total_orders_resulted)
          }
        </Typography>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  getOrdersCounts: PropTypes.func.isRequired,
};

export default connect(null, { getOrdersCounts })(Sidebar);