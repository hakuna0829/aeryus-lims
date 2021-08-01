import React, {
  //  useEffect,
  useState
} from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import brandStyles from 'theme/brand';
import {
  Typography,
  // Button,
  Box,
  // Tooltip,
  Container, MenuItem, MenuList,
  Popper,
  Grow, Paper,
  ClickAwayListener,
  // CircularProgress,
  Grid
} from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';
// import HelpIcon from '@material-ui/icons/Help';
import { withRouter } from 'react-router-dom';
import parse from 'html-react-parser';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddAlert from './AddAlert';
import ViewAlert from './ViewAlert';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
  content: {
    // paddingTop: 50,
    textAlign: 'center'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
    '& div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  headerSubTitle: {
    fontSize: '24px',
    color: theme.palette.brandText,
    textTransform: 'uppercase',
    marginLeft: 8
  },
  greenBtn: {
    backgroundColor: theme.palette.brandGreen,
    color: theme.palette.white,
    textTransform: 'capitalize',
    fontSize: '16px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.brandDark
    }
  },
  itemContainer: {
    height: 250,
    maxWidth: 250,
    border: '1px solid #0F84A9',
    borderRadius: '8px',
    boxShadow: '3px 4px 8px rgba(4, 59, 93, 0.1)',
    textAlign: 'center',
    margin: '0 auto',
    position: 'relative',
    '&>div': {
      // height:140,
      // margin:'40px auto 30px'
    },
    '& img': {
      height: '100%',

    },
    '& p': {
      fontSize: '18px',
      lineHeight: '24px'
    },
    '& svg': {
      position: 'absolute',
      top: 20,
      right: 20,
      cursor: 'pointer',
      color: '#788081'
    },
    [theme.breakpoints.down('sm')]: {
      height: 180,
      maxWidth: 180,
      '& p': {
        fontSize: '14px',
        lineHeight: '22px'
      },
    },
  },
  imageBox:{
    margin:'40px auto 20px',
    height:'110px',
    [theme.breakpoints.down('sm')]: {
      height: 80,
      margin:'20px auto 10px',
    },
  }
}));

const data = [
  {
    id: 1,
    label: 'Appointment <br /> confirmation',
    image: 'appointment_confirmation.svg'
  },
  {
    id: 2,
    label: 'Test results <br /> are ready',
    image: 'test_results_ready.svg'
  },
  {
    id: 3,
    label: 'Thank you for <br /> getting tested',
    image: 'thanks_for_getting_tested.svg'
  },
  {
    id: 4,
    label: 'Forgot to schedule <br /> your test',
    image: 'forgot_schedule_your_test.svg'
  },
  {
    id: 5,
    label: 'Schedule <br /> appoinment type',
    image: 'schedule_appointment_type.svg'
  },
  {
    id: 6,
    label: 'Time to get <br /> tested again',
    image: 'time_get_tested_again.svg'

  },
  {
    id: 7,
    label: 'Vaccine appointment <br /> confirmation',
    image: 'vaccine_appointment_confirmation.svg'
  },
  {
    id: 8,

    label: 'Vaccine pass',
    image: 'vaccine_pass.svg'
  },
  {
    id: 9,
    label: '24 hour test reminder',
    image: '24hours_test_reminder.svg'
  }
]

const AppointmentAlerts = (props) => {
  const classes = useStyles();
  const brandClasses = brandStyles();
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [viewAlertOpen, setViewAlertOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [anchorRef, setAnchorRef] = React.useState();
  const [openPopId, setOpenPopId] = React.useState(null);

  const onAddAlert = () => {
    setNewAlertOpen(true);
    handleClose();
  };

  const onViewAlert = () => {
    setViewAlertOpen(true);
    handleClose();
  };

  const onNewAlertDialogClose = () => {
    setNewAlertOpen(false);
  };

  const onViewAlertDialogClose = () => {
    setViewAlertOpen(false);
  };

  const handlePopOpen = (event, popId) => {
    setOpenPopId(popId);
    setAnchorRef(event.target);
  }

  const handleClose = (event) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    // setOpen(false);
    setOpenPopId(null);
    setAnchorRef(null);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // const prevOpen = React.useRef(open);
  // React.useEffect(() => {
  //   if (prevOpen.current === true && open === false) {
  //     anchorRef.current.focus();
  //   }

  //   prevOpen.current = open;
  // }, [open]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Box >
          <Typography variant="h2" className={brandClasses.headerTitle2}>
            <img src="/images/svg/mailbox.svg" alt="" style={{ width: 35 }} />
            TESTD ALERTS |
          </Typography>
          <Typography variant="h4" className={classes.headerSubTitle}>Appointment alerts</Typography>
          {/* <sup>
            <Tooltip title="Appointment Alerts" placement="right-start" style={{ margin: '-10px 0 0 10px' }}>
              <HelpIcon />
            </Tooltip>
          </sup> */}
        </Box>
      </div>

      <Container>
        <Box maxWidth="1062px" margin="0 auto">
          <Grid container spacing={5}>
            <Grid
              item
              xs={4}
            />
            <Grid
              item
              xs={4}
            />
            <Grid
              item
              xs={4}
            >
              <Box justifyContent="flex-end" display="flex">
                {/* <Button
                  variant="contained"
                  className={classes.greenBtn}
                  startIcon={<AddIcon />}
                  onClick={onAddAlert}
                >
                  {'Add Alert'}
                </Button> */}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={5}>

            {
              data.map(item =>
                <Grid item xs={4} key={item.id}>
                  <Box className={classes.itemContainer} position="relative">
                    <Box className={classes.imageBox}>
                      <img src={'/images/svg/alerts/appointment/' + item.image} alt="item.label" />
                    </Box>

                    <Typography>{parse(item.label)}</Typography>
                    <MoreVertIcon
                      aria-controls={open ? 'menu-list-grow' : undefined}
                      aria-haspopup="true"
                      onClick={(e) => handlePopOpen(e, item.id)}
                      ref={anchorRef}
                    />
                    <Box
                      left="-60px"
                      position="absolute"
                      top="-20px"
                    >
                      <Popper open={openPopId === item.id} anchorEl={anchorRef} role={undefined} transition disablePortal style={{ position: 'relative', left: '100px', zIndex: 10 }}>
                        {({ TransitionProps }) => (
                          <Grow
                            {...TransitionProps}
                          // style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom' }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                  <MenuItem onClick={onAddAlert}>Create Alert</MenuItem>
                                  <MenuItem onClick={onViewAlert}>View Alert</MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>

                    </Box>
                  </Box>
                </Grid>
              )
            }
          </Grid>
        </Box>
      </Container>
      <AddAlert
        dialogOpen={newAlertOpen}
        onDialogClose={onNewAlertDialogClose}
      // userId={userId}
      />
      <ViewAlert
        dialogOpen={viewAlertOpen}
        onDialogClose={onViewAlertDialogClose}
      />

    </div>
  );
}

export default withRouter(AppointmentAlerts);