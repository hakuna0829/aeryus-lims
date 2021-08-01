import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import { getOrder, submitOrder } from 'actions/api';
import Alert from '@material-ui/lab/Alert';
import UserDialog from 'views/UserManager/UserDialog';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },

});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30
  },
  headerTitle: {
    color: '#043B5D',
    fontFamily: 'Montserrat',
    fontSize: '32px',
    fontWeight: 600,
    paddingRight: '40px'
  },
  title: {
    color: '#043B5D',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '22px',
    marginBottom: 10
  },
  description: {
    color: '#043B5D',
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '22px',
    overflowWrap: 'break-word'
  },
  dialogPaper: {
    maxWidth: '1200px',
    width: '1120px',
  },
  cardContainer: {
    margin: '30px 0'
  },
  cardContainer2: {
    margin: '30px 0',
    width: '940px'
  },
  card: {
    width: 300,
    margin: '20px 0',
    border: '1px solid #0F84A9',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    boxShadow: '4px 4px 8px 2px rgba(15,132,169,0.15)',
    [theme.breakpoints.up('lg')]: {
      width: 340,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 300,
    },
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
  },
  cardHeader: {
    backgroundColor: '#0F84A9',
    color: '#fff',

  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    padding: '10px 16px',
    [theme.breakpoints.up('lg')]: {

    },
    [theme.breakpoints.between('md', 'lg')]: {

    },
    [theme.breakpoints.down('sm')]: {

    },
  },
  cardBody: {
    padding: 16
  },
  greenButton: {
    margin: '20px 0',
    minWidth: 100,

  },
  table2: {
    width: '100%'
  },
  table2Header: {
    display: 'flex'
  },
  table2head: {
    backgroundColor: '#0F84A9',
    color: '#fff',
    padding: '10px 6px',
    fontFamily: 'Montserrat',
    fontSize: 14,
    borderRight: 'solid 1px #fff',
    textAlign: 'center',
    '&:last-child': {
      borderRightWidth: 0,
    },
    [theme.breakpoints.up('lg')]: {

    },
    [theme.breakpoints.between('md', 'lg')]: {

    },
    [theme.breakpoints.down('sm')]: {

    },
  },
  table2Row: {
    display: 'flex',
    // border: '1px solid #0F84A9',
    // borderBottomLeftRadius: 8,
    // borderBottomRightRadius: 8,
  },
  table2Cell: {
    padding: '10px 6px',
    color: '#043B5D',
    fontFamily: 'Montserrat',
    fontSize: 14,
    border: '1px solid #0F84A9',
    borderLeftWidth: 0,
    textAlign: 'center',
    '&:first-child': {
      borderBottomLeftRadius: 8,
      borderLeftWidth: 1,
    },
    '&:last-child': {
      borderBottomRightRadius: 8,
    },
  },
  width15: {
    width: '15%'
  },
  width20: {
    width: '20%'
  },
  width25: {
    width: '25%'
  },
  width30: {
    width: '30%'
  },
  width80: {
    width: '80%'
  },
  cardContainer3: {
    margin: '30px 0',
    width: '840px'
  },
  table3Header: {
    display: 'flex'
  },
  table3head: {
    backgroundColor: '#0F84A9',
    color: '#fff',
    padding: '10px 6px',
    fontFamily: 'Montserrat',
    fontSize: 14,
    textAlign: 'center',
    [theme.breakpoints.up('lg')]: {

    },
    [theme.breakpoints.between('md', 'lg')]: {

    },
    [theme.breakpoints.down('sm')]: {

    },
  },
  table3Cell: {
    padding: '10px 6px',
    color: '#043B5D',
    fontFamily: 'Montserrat',
    fontSize: 14,
    border: '1px solid #0F84A9',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    textAlign: 'center',
    '&:first-child': {
      borderLeftWidth: 1,
    },
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    border: 'solid 1px #0F84A9',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  totalCell: {
    padding: '10px 6px',
    color: '#043B5D',
    fontFamily: 'Montserrat',
    fontSize: 14,
    border: '1px solid #0F84A9',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    textAlign: 'center',
    '&:first-child': {
      // borderLeftWidth: 1,
    },
    '&:last-child': {
      // borderRightWidth: 1,
    },
  },
  leftAlgin: {
    textAlign: 'left'
  }
}))

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


const OrderDetails = props => {
  const { getOrder, submitOrder, selectedOrder, detailsDialogOpen, setDetailsDialogOpen, setRefetch } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [displaySuccess, setDisplaySuccess] = useState(null);
  const [order, setOrder] = useState({});

  useEffect(() => {
    if (selectedOrder._id) {
      setDisplaySuccess(null);
      setOrder({});
      setUserId(null);
      (async () => {
        setLoading(true);
        let res = await getOrder(selectedOrder._id);
        setLoading(false);
        if (res.success) {
          setOrder(res.data);
        }
      })();
    }
    // eslint-disable-next-line
  }, [selectedOrder._id]);

  const handleClose = () => {
    setDetailsDialogOpen(false);
  };

  const onDialogClose = () => {
    setUserDialogOpen(false);
  };

  const closeSuccessMessage = () => {
    setDisplaySuccess(null);
  };

  const handleEditUser = () => {
    setUserId(order.user_id._id);
    setUserDialogOpen(true);
    // history.push(`/user-list/all?open_user_id=${order.user_id._id}`);
  };

  const handlePushToLab = async () => {
    setDisplaySuccess(null);
    setSaveLoading(true);
    let body = {
      testing_id: selectedOrder.testing_id._id,
      order_id: selectedOrder._id
    };
    let res = await submitOrder(body);
    setSaveLoading(false);
    if (res.success) {
      setDisplaySuccess(res.data);
      setTimeout(() => {
        setRefetch(refetch => refetch + 1);
        setDetailsDialogOpen(false);        
      }, 2000);
    }
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={detailsDialogOpen}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div className={classes.header}>
            <Typography className={classes.headerTitle}>
              {'Order Details'}
            </Typography>
          </div>
        </DialogTitle>

        {loading && <CircularProgress className={brandClasses.progressSpinner} />}

        <DialogContent >
          {order.user_id &&
            <>
              <Typography className={classes.title}>
                {order.user_id.first_name}, {order.user_id.last_name}
              </Typography>
              <Typography className={classes.description}>
                {order.user_id.address}<br />
                {order.user_id.address2 && <>{order.user_id.address2}<br /></>}
                {order.user_id.city}, {order.user_id.state} {order.user_id.zip_code}<br /><br />

                {order.user_id.phone}<br />
                {order.user_id.email}
              </Typography>
            </>
          }

          <div className={classes.card} style={{ width: '100%' }} >
            <div className={classes.cardHeader}>
              <Typography className={classes.cardTitle}>
                REQUEST
            </Typography>
            </div>
            <div className={classes.cardBody}>
              {order.request &&
                <Typography className={classes.description}>
                  {order.request}
                </Typography>
              }
            </div>
          </div>

          <div className={classes.card} style={{ width: '100%' }} >
            <div className={classes.cardHeader}>
              <Typography className={classes.cardTitle}>
                RESPONSE
            </Typography>
            </div>
            <div className={classes.cardBody}>
              <Typography className={classes.description}>
                {order.response}
              </Typography>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <div className={brandClasses.footerButton}>
            {displaySuccess ? <Alert severity="success" onClose={() => { closeSuccessMessage() }}>{displaySuccess}</Alert> : null}
          </div>

          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            onClick={handleEditUser}
          >
            {'Edit User'}
          </Button>
          <Button
            className={brandClasses.button}
            classes={{ disabled: brandClasses.buttonDisabled }}
            disabled={saveLoading || loading}
            onClick={handlePushToLab}
          >
            {'Submit Order'} {saveLoading ? <CircularProgress size={20} className={brandClasses.progressSpinner} /> : ''}
          </Button>
        </DialogActions>
      </Dialog>

      <UserDialog
        dialogOpen={userDialogOpen}
        onDialogClose={onDialogClose}
        userId={userId}
      />
    </div>
  )
};

OrderDetails.propTypes = {
  selectedOrder: PropTypes.object.isRequired,
  detailsDialogOpen: PropTypes.bool.isRequired,
  getOrder: PropTypes.func.isRequired,
  submitOrder: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { getOrder, submitOrder })(withRouter(OrderDetails));