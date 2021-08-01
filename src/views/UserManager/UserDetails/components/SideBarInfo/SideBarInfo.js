import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Grid, Typography, Divider, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import { GreenShield, RedShield } from 'icons';
import { apiUrl, explorerUrl, getUserDependents } from 'actions/api';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
const useStyles = makeStyles(theme => ({
  root: {
    padding: `0 ${theme.spacing(2)}px`,
    backgroundColor: '#D9EEF4',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      padding: `0 ${theme.spacing(1)}px`,
    }
  },
  avatar: {
    border: '1.72px solid #979797',
    backgroundColor: '#D8D8D8',
    width: 50,
    height: 50
  },
  divider: {
    // marginTop: theme.spacing(3),
    // marginBottom: theme.spacing(3),
    width: 1,
    backgroundColor: 'rgba(15, 132, 169, 0.3)'
  },
  name: {
    display: 'inline-flex',
    color: '#0F84A9',
    fontWeight: 600,
    fontSize: '18px',
    [theme.breakpoints.down('md')]: {
      fontSize: 16
    }
  },
  info: {
    color: '#0F84A9',
    fontWeight: 600
  },
  accountId: {
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    // whiteSpace: 'nowrap',
    color: '#0F84A9',
    fontSize: '12px',
    width: 'auto',
    margin: '10px 0 5px 0',
    padding: '8px',
    '& .clone_avatar': {
      visibility: 'hidden'
    },
    '& span': {
      color: theme.palette.blueDark,
      fontSize: 12,
      fontWeight: 600,
      [theme.breakpoints.down('md')]: {
        fontSize: 10
      }
    },
    '& a': {
      textDecoration: 'underline',
      color: theme.palette.brandDark,
      fontSize: 13,
      [theme.breakpoints.down('md')]: {
        fontSize: 11
      }
    }
  },
  statusItem: {
    paddingLeft: '16px',
    paddingTop: 12,
    '& .status': {
      fontSize: 16,
      color: theme.palette.blueDark,
      fontWeight: 600,
      lineHeight: '1.8rem',
      [theme.breakpoints.down('md')]: {
        fontSize: 12,
        lineHeight: '1.5rem'
      }
    },
    '& .condition': {
      fontSize: 12,
      color: theme.palette.brandDark,
      fontWeight: 400,
      lineHeight: '16px',
      [theme.breakpoints.down('md')]: {
        fontSize: 11,
        lineHeight: '14px'
      }
    },
    '& .date': {
      fontSize: 12,
      color: theme.palette.blueDark,
      fontWeight: 400,
      lineHeight: '16px',
      [theme.breakpoints.down('md')]: {
        fontSize: 11,
        lineHeight: '14px'
      }
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: '5px'
    }
  },
  otherItem:{
    paddingLeft:18,
    [theme.breakpoints.down('md')]: {
      paddingLeft:8,
    },
    '& .title':{
      fontSize: 16,
      color: theme.palette.brandDark,
      fontWeight: 500,
      lineHeight: '1.8rem',
      [theme.breakpoints.down('md')]: {
        fontSize: 12,
        lineHeight: '1.6rem',
        fontWeight: 600,
      }
    },
    '& .dependent':{
      fontSize: 14,
      color: theme.palette.blueDark,
      fontWeight: 600,
      lineHeight: '1.5rem',
      [theme.breakpoints.down('md')]: {
        fontSize: 12,
        lineHeight: '1.3rem'
      }
    },
    '& .address':{
      fontSize: 16,
      color: theme.palette.blueDark,
      fontWeight: 600,
      lineHeight: '1.8rem',
      [theme.breakpoints.down('md')]: {
        fontSize: 12,
        lineHeight: '1.5rem'
      }
    },
    '& .property':{
      fontSize: 12,
      color: theme.palette.brandDark,
      fontWeight: 400,
      lineHeight: '16px',
      [theme.breakpoints.down('md')]: {
        fontSize: 11,
        lineHeight: '14px'
      }
    },
    '& .compliance':{
      fontSize: 14,
      color: theme.palette.blueDark,
      fontWeight: 600,
      lineHeight: '1.8rem',
      [theme.breakpoints.down('md')]: {
        fontSize: 12,
        lineHeight: '1.5rem'
      }
    },
    '& .file':{
      cursor:'pointer',
      textDecoration:'underline',
      color:theme.palette.brandDark
    }
  },
  gridBorder: {
    // borderRight: '1.72px solid #0F84A9',
    paddingTop:'12px',
    height: '100%'
  },
  address: {
    color: theme.palette.brandDark,
    textAlign: 'center',
    fontWeight: 600,
    marginBottom: theme.spacing(1)
  },
  active: {
    color: theme.palette.brandGreen
  },
  inActive: {
    color: theme.palette.brandRed
  },
  statusShield: {
    fontSize: '2rem'
  },
  viewmore:{
    background: '#87C1D4',
    margin: '8px 0 0 0px',
    lineHeight: '30px',
    '& p':{
      color:'white',
      fontSize:14,
      lineHeight:'2rem',
      fontWeight: 500,
      [theme.breakpoints.down('md')]: {
        fontSize:12,
      }
    }
  }
}));

const SideBarInfo = props => {
  const { user, getUserDependents } = props;
  const classes = useStyles();
  const [dependentList, setDependentsList] = useState([]);
  useEffect(() => {
    if (user._id) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [user._id]);

  const fetchData = async () => {
    const res = await getUserDependents(user._id);
    if (res.success) {
      setDependentsList(res.data || []);
    }
  };

  return (
    <div className={classes.root}>
      <Grid
        alignItems="flex-start"
        container
        direction="row"
        justify="flex-start"
      >
        <Grid
          className={classes.gridBorder}
          item
          xs={3}
        >
          <Box
            alignItems="flex-start"
            direction="row"
            display="flex"
            justify="flex-start"
            paddingTop="8px"
          >
            <div>
              <Avatar
                className={classes.avatar}
                src={user.photo ? `${apiUrl}${user.photo}` : ''}
              />
            </div>
            <div>
              <Typography
                className={clsx(classes.info, classes.name)}
                variant="h5"
              >
                <span style={{ padding: '5px' }}>
                  {user.last_name} {user.first_name}
                </span>
              </Typography>
              <Typography
                // align="center"
                variant="h6"
              >
                {user.department}
              </Typography>
            </div>
          </Box>
          {/* <Grid direction="row"
            justify="center"
            alignItems="center"> <Typography variant="h6" align="center">
              {user.department}testingggg
          </Typography>
          </Grid> */}
          <Box
            alignItems="flex-start"
            className={classes.accountId}
            direction="row"
            display="flex"
            justify="flex-start"
          >
            <div className="clone_avatar">
              <Avatar
                className={classes.avatar}
                src={user.photo ? `${apiUrl}${user.photo}` : ''}
              />
            </div>
            <div>
              <Typography variant="h6">
                <span> Account ID: </span>
                <a
                  href={explorerUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {user.verification_id}
                </a>
              </Typography>
            </div>
          </Box>
          <Grid
            alignItems="center"
            className={classes.viewmore}
            container
            direction="row"
            justify="center"
          >
            <Typography
              align="center"
            >
              View more details
            </Typography>
            <ChevronRightIcon />
          </Grid>
        </Grid>
        <Divider
          className={classes.divider}
          flexItem
          orientation="vertical"
        />
        <Grid
          className={classes.gridBorder}
          item
          xs={2}
        >
          <Grid
            alignItems="center"
            className={classes.statusItem}
            container
            direction="row"
            justify="center"
          >
            <Grid
              item
              sm={9}
            >
              <Typography className="status">Health Status</Typography>
              <Typography className="condition">Last tested</Typography>
              <Typography className="date">
                June 20, 2020
                {user.latest_test_result &&
                  moment(user.latest_test_result.date).format(
                    'MMMM DD, YYYY'
                  )}{' '}
                &nbsp;
              </Typography>
            </Grid>
            <Grid
              className={classes.Status}
              container
              item
              sm={3}
            >
              {/* {user.latest_test_result &&
                user.latest_test_result.result === 'Negative' && ( */}
              <GreenShield className={classes.statusShield} />
              {/* )} */}
              {user.latest_test_result &&
                user.latest_test_result.result === 'Positive' && (
                <RedShield className={classes.statusShield} />
              )}
            </Grid>
          </Grid>

          <Grid
            alignItems="center"
            className={classes.statusItem}
            container
            direction="row"
            justify="center"
          >
            <Grid
              item
              sm={9}
            >
              <Typography className="status">Vaccine Status</Typography>
              <Typography className="condition">Dose 1:</Typography>
              <Typography className="date">
                {user.latest_test_result &&
                  moment(user.latest_test_result.date).format('MMMM DD, YYYY')}
                June 20, 2020
              </Typography>
            </Grid>
            <Grid
              className={classes.Status}
              item
              sm={3}
            >
              {user.latest_test_result &&
                user.latest_test_result.result === 'Negative' && (
                <GreenShield className={classes.statusShield} />
              )}
              {/* {user.latest_test_result &&
                user.latest_test_result.result === 'Positive' && ( */}
                <RedShield className={classes.statusShield} />
              {/* )} */}
            </Grid>
          </Grid>
        </Grid>
        <Divider
          className={classes.divider}
          flexItem
          orientation="vertical"
        />
        <Grid
          className={clsx(classes.gridBorder, classes.otherItem)}
          item
          xs={2}
        >
          <Grid
            alignItems="center"
            container
            direction="row"
            // justify="center"
          >
            <Typography className="title">DEPENDENTS</Typography>
          </Grid>
          {dependentList.map((value, index) => (
            <Grid
              alignItems="center"
              container
              direction="row"
              // justify="center"
              key={index}
            >
              <Typography
                variant="h5"
                className="dependent"
              >
                {value.first_name} {value.last_name}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider
          className={classes.divider}
          flexItem
          orientation="vertical"
        />
        <Grid
          className={clsx(classes.gridBorder, classes.otherItem)}
          item
          xs={2}
        >
          <Grid
            alignItems="center"
            container
            direction="row"
          >
            <Typography className="title">
              VISIT HISTORY
            </Typography>
            <Grid
              alignItems="flex-start"
              container
              direction="column"
            >
              <Typography
                variant="h5"
                className="address"
              >
                Address:
              </Typography>
              <Typography
                variant="h5"
                className="property"
              >
                123 Any street
              </Typography>
              <Typography
                variant="h5"
                className="property"
              >
                00 unit number
              </Typography>
              <Typography
                variant="h5"
                className="property"
              >
                Any Town, ST 12345
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider
          className={classes.divider}
          flexItem
          orientation="vertical"
        />
        <Grid
          className={clsx(classes.gridBorder, classes.otherItem)}
          item
          xs={2}
        >
          <Grid
            alignItems="center"
            container
            direction="row"
            // justify="center"
          >
            <Typography className="title">DOCUMENTS</Typography>
            <Grid
              alignItems="flex-start"
              container
              direction="column"
            >
              <Typography
                variant="h5"
                className="compliance"
              >
                Compliance:
              </Typography>
              <Typography ><a href="#/" className="file">file</a></Typography>
              <Typography ><a href="#/" className="file">file</a></Typography>
              <Typography ><a href="#/" className="file">file</a></Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item>
          <Typography variant="h4" className={clsx(classes.info, classes.name)}>
            {user.last_name} {user.first_name}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            {user.department}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            {user.title}
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
        <Typography variant="h4" className={classes.info}>
            {'Account ID'}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              {user.verification_id}
            </a>
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Office Phone:'}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            {user.office_phone}
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Office Email:'}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            {user.email}
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Cell Phone:'}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            <PhoneNumberFormat value={user.phone} />
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Address:'}
          </Typography>
          <Typography variant="h5" className={classes.address}>
            {user.address}<br /> {user.address2} {user.city}, {user.state}
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Date of Birth'}
          </Typography>
          <Typography variant="h5" className={classes.info}>
            {user.dob && moment.utc(user.dob).format('MM-DD-YYYY')}
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Location Sharing:'}
          </Typography>
          <Typography variant="h4" className={clsx(classes.info, classes.active)}>
            {'ACTIVE'}
          </Typography>
          <Typography variant="h4" className={classes.info}>
            {'Contact Tracing:'}
          </Typography>
          <Typography variant="h4" className={clsx(classes.info, classes.inActive)}>
            {'INACTIVE'}
          </Typography>
        </Grid> */}

        {/* <Grid item>
          <Divider className={classes.divider} />
        </Grid> */}

        {/* <Grid item>
          <Typography variant="h4" className={classes.info}>
            {'Health Status:'}
          </Typography>
        </Grid>
        {user.latest_test_result
          ?
          <>
            <Grid item className={classes.Status}>
              {user.latest_test_result.result === 'Negative' && (
                <GreenShield className={classes.statusShield} />
              )}
              {user.latest_test_result.result === 'Positive' && (
                <RedShield className={classes.statusShield} />
              )}
            </Grid>

            <Grid item>
              <Typography variant="h4" className={classes.info}>
                {user.latest_test_result.result === 'Negative' && (
                  'TESTED NEGATIVE'
                )}
                {user.latest_test_result.result === 'Positive' && (
                  'TESTED POSITIVE'
                )}
                {user.latest_test_result.result === 'Pending' && (
                  'TESTED PENDING'
                )}
              </Typography>
              <Typography variant="h5" className={classes.info}>
                {moment(user.latest_test_result.date).format('MMMM DD, YYYY')}
              </Typography>
            </Grid>

            <Grid item>
              <Divider className={classes.divider} />
            </Grid>

            <Grid item>
              <Typography variant="h4" className={classes.info}>
                {'14 days until return work'}
              </Typography>
            </Grid>
          </>
          :
          <Grid item>
            <Typography variant="h4" className={classes.info}>
              {'NOT TESTED YET'}
            </Typography>
          </Grid>
        } */}
      </Grid>
    </div>
  );
};

SideBarInfo.propTypes = {
  user: PropTypes.object.isRequired,
  getUserDependents: PropTypes.func.isRequired
};
export default connect(null, { getUserDependents })(SideBarInfo);
