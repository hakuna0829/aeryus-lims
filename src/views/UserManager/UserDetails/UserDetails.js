import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Alert from '@material-ui/lab/Alert';
import { Button, CircularProgress,Grid } from '@material-ui/core';
import { showFailedDialog, showErrorDialog } from 'actions/dialogAlert';
// import SideBarInfo from './components/SideBarInfo';
import Content from './components/Content';
import { getUser } from 'actions/api';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(0)
  },
  container: {
    display: 'flex'
  },
  contentWrap: {
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  sidebar: {
    width: '290px',
    [theme.breakpoints.up('lg')]: {
      width: '290px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: '290px',
    },
    [theme.breakpoints.down('sm')]: {
      // width: '100%',
      display: 'none'
    },
  },
  content: {
    // width: '100%',
    width: 'calc(100% - 290px)',
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 290px)',
      // width:'100%'
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 'calc(100% - 290px)',
      // width:'100%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100% ',
    },
  },
}));

const UserDetails = (props) => {
  const { showFailedDialog, showErrorDialog, history } = props;

  const classes = useStyles();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = props.match.params.id;
  // const tabId = props.match.params.tabId ? props.match.params.tabId : 'TestingHistory';

  useEffect(() => {
    console.log('UserDetails useEffect id:', userId);
    if (userId) {
      getUser(userId).then(res => {
        setLoading(false);
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          showFailedDialog(res);
        }
      }).catch(error => {
        setLoading(false);
        showErrorDialog(error);
      });
    } else {
      history.goBack();
    }
  }, [userId, history, showFailedDialog, showErrorDialog]);

  const goBack = () => {
    history.goBack();
  }

  return (
    <div className={classes.root}>
      {loading
        ? <CircularProgress />
        : user
          ?
          // <div className={classes.contentWrap}>
          //   <div className={classes.sidebar}>
          //     <SideBarInfo user={user} />
          //   </div>
          //   <div className={classes.content}>
          //     <Content user={user} setUser={setUser} />
          //   </div>
            <Grid container>
              <Grid item xs={12} >
                <Content user={user} setUser={setUser}/>
              </Grid>
              {/* <Grid item xs={12}>
                <SideBarInfo user={user} />
              </Grid> */}

            </Grid>
          // </div>
          : <div className={classes.alert}>
            <Alert severity="error">
              {'Unknown User ID passed as params. '}
              <Button
                onClick={goBack}
              >
                {'Go Back'}
              </Button>
            </Alert>
          </div>
      }
    </div>
  );
};

UserDetails.propTypes = {
  showFailedDialog: PropTypes.func.isRequired,
  showErrorDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};


export default connect(null, { showFailedDialog, showErrorDialog })(withRouter(UserDetails));