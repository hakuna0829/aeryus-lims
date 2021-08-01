import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography, CircularProgress } from '@material-ui/core';
import { getAuditById } from 'actions/api';

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

const AuditDetails = props => {
  const { getAuditById, selectedRecord, detailsDialogOpen, setDetailsDialogOpen } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState({});

  useEffect(() => {
    if (selectedRecord._id) {
      setAudit({});
      (async () => {
        setLoading(true);
        let res = await getAuditById(selectedRecord._id);
        setLoading(false);
        if (res.success) {
          setAudit(res.data);
        }
      })();
    }
    // eslint-disable-next-line
  }, [selectedRecord._id]);

  const handleClose = () => {
    setDetailsDialogOpen(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={detailsDialogOpen}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle onClose={handleClose}>
          <div className={classes.header}>
            <Typography className={classes.headerTitle}>
              {'Audit Details'}
            </Typography>
          </div>
        </DialogTitle>

        {loading && <CircularProgress className={brandClasses.progressSpinner} />}

        <DialogContent >
          <Typography className={classes.title}>
            {audit.account_id &&
              "Account Name: " + audit.account_id.first_name + ", " + audit.account_id.last_name
            }
          </Typography>
          <Typography className={classes.description}>
            Component: {audit.component}<br />
            Action: {audit.action}<br />
            Timestamp: {moment(audit.timestamp).format('MMM DD, YYYY h:mm A')}<br /><br />

            Summary: {audit.summary}<br />
            {audit.db_id &&
              `Component ID: ${audit.db_id}`
            }
          </Typography>
          <br />

          {audit.json &&
            <div className={classes.card} style={{ width: '100%' }} >
              <div className={classes.cardHeader}>
                <Typography className={classes.cardTitle}>
                  JSON
              </Typography>
              </div>
              <div className={classes.cardBody}>
                <Typography className={classes.description}>
                  {audit.json}
                </Typography>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  )
};

AuditDetails.propTypes = {
  selectedRecord: PropTypes.object.isRequired,
  detailsDialogOpen: PropTypes.bool.isRequired,
  getAuditById: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { getAuditById })(withRouter(AuditDetails));