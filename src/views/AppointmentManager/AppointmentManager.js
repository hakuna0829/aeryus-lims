import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import brandStyles from 'theme/brand';
import SideBar from './Sidebar';
import MonthSchedule from './MonthSchedule';
import TodaySchedule from './TodaySchedule';
import TomorrowSchedule from './TomorrowSchedule';
import WeekSchedule from './WeekSchedule/WeekSchedule';
import ScheduleSelector from './ScheduleSelector';
import SearchSchedule from './components/SearchSchedule';
import RadioRoundCheckButton from 'components/RadioRoundCheckButton';
import { clientServer, scheduleAction } from 'actions/api';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, RadioGroup, TextField } from '@material-ui/core';
import { getPaymentTypes } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 0
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
      width: '100%',
    },
  },
  content: {
    // width: '100%'
    width: 'calc(100% - 290px)',
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 290px)',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 'calc(100% - 290px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100% ',
    },
  },
  paymentFormRoot: {
    padding: 10
  }
}));

const AppointmentManager = (props) => {
  const { match, history, scheduleAction } = props;

  const classes = useStyles();
  const brandClasses = brandStyles();

  const [location_id, setLocationId] = useState(0);
  const [refetch, setRefetch] = useState(0);

  const [open, setOpen] = useState(false);
  const [submittedAction, setSubmittedAction] = useState({});
  const [message, setMessage] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [formState, setFormState] = useState({});

  const activeTab = match.params.tab;
  const [selectedSchedule, setSelectedSchedule] = useState(activeTab);

  useEffect(() => {
    setSelectedSchedule(activeTab);
  }, [activeTab]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const selectedChange = (selected) => {
    setSelectedSchedule(selected);
    history.push('/appointment-manager/' + selected);
  }

  const redirectOnSubmit = (user_id) => {
    history.push(`/user-details/${user_id}?tab=visit_tracker`);
    // if (clientServer === 'prod002' || clientServer === 'prod007' )
    //   history.push(`/user-details/${user_id}?tab=testing`);
    // else
    //   history.push(`/user-details/${user_id}?tab=patient_intake`);
  }

  const submitScheduleAction = async (body) => {
    setSubmittedAction(body);
    if (body.action === 'Check' && clientServer === 'prod007' && !body.payment_type) {
      setPaymentDialogOpen(true);
      setFormState({});
      return { success: false };
    }
    return new Promise(async (resolve) => {
      let res = await scheduleAction(body);
      resolve(res);
      if (res.success) {
        if (body.action === 'Check') {
          redirectOnSubmit(res.data.user_id);
        } else {
          doRefetch();
        }
      } else {
        // if already pending/unsubmitted testing is there
        if (res.data && res.data.user_id) {
          setSubmittedAction(ssa => ({
            ...ssa,
            user_id: res.data.user_id
          }));
          setMessage(res.message);
          setOpen(true);
        }
      }
    });
  }

  const doRefetch = () => {
    setRefetch(refetch => refetch + 1);
  }

  const onCreateNew = () => {
    setOpen(false);
    let body = {
      ...submittedAction,
      force: true
    }
    submitScheduleAction(body);
  }

  const onContinue = () => {
    setOpen(false);
    history.push(`/user-details/${submittedAction.user_id}?tab=visit_tracker`);
  }

  const onClose = () => {
    setOpen(false);
  }

  const onPaymentDialogClose = () => {
    setPaymentDialogOpen(false);
  }

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    onPaymentDialogClose();
    submitScheduleAction({
      ...submittedAction,
      payment_type: formState.payment_type,
      complementary_code: formState.complementary_code,
      complementary_room_number: formState.complementary_room_number
    });
  }

  return (
    <div className={classes.root}>
      <div className={classes.contentWrap}>
        <div className={classes.sidebar}>
          <SideBar
            selectedSchedule={selectedSchedule}
            selectedChange={selectedChange}
            location_id={location_id}
            setLocationId={setLocationId}
            refetch={refetch}
          />
        </div>
        <div className={classes.content}>
          {selectedSchedule === 'monthly' && (
            <MonthSchedule
              location_id={location_id}
              refetch={refetch}
              submitScheduleAction={submitScheduleAction}
            />
          )}
          {selectedSchedule === 'today' && (
            <TodaySchedule
              location_id={location_id}
              refetch={refetch}
              submitScheduleAction={submitScheduleAction}
            />
          )}
          {selectedSchedule === 'tomorrow' && (
            <TomorrowSchedule
              location_id={location_id}
              refetch={refetch}
              submitScheduleAction={submitScheduleAction}
            />
          )}
          {selectedSchedule === 'weekly' && (
            <WeekSchedule
              location_id={location_id}
              refetch={refetch}
              submitScheduleAction={submitScheduleAction}
            />
          )}
          {selectedSchedule === 'search' && (
            <SearchSchedule
              location_id={location_id}
              refetch={refetch}
              submitScheduleAction={submitScheduleAction}
            />
          )}
          {selectedSchedule === 'selector' && (
            <ScheduleSelector />
          )}
        </div>
      </div>

      {/* previous unsubmitted dialog */}
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle>
          Alert!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCreateNew} color="primary">
            Create new session
          </Button>
          <Button onClick={onContinue} color="primary" autoFocus>
            Continue with previous session
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={paymentDialogOpen}
        onClose={onPaymentDialogClose}
      >
        <DialogTitle>
          Select Payment type
        </DialogTitle>
        <DialogContent>
          <form
            className={classes.paymentFormRoot}
            onSubmit={handlePaymentSubmit}
          >
            <RadioGroup
              name="payment_type"
              value={formState.payment_type}
              onChange={handleChange}
              required
            >
              {getPaymentTypes.map((payment, index) => (
                <RadioRoundCheckButton key={index} label={payment} value={payment} required={true} />
              ))}
            </RadioGroup>

            <br />
            {formState.payment_type === 'Complementary' &&
              <>
                <TextField
                  type="text"
                  label="Code"
                  placeholder="Enter code"
                  name="complementary_code"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.complementary_code || ''}
                  required
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
                <br />
                <TextField
                  type="number"
                  label="Room number"
                  placeholder="Enter room number"
                  name="complementary_room_number"
                  className={brandClasses.shrinkTextField}
                  onChange={handleChange}
                  value={formState.complementary_room_number || ''}
                  required
                  fullWidth
                  InputProps={{ classes: { root: classes.inputLabel } }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </>
            }

            <div className={brandClasses.footerButton}>
              <Button
                className={brandClasses.button}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AppointmentManager.propTypes = {
  scheduleAction: PropTypes.func.isRequired,
};

export default connect(null, { scheduleAction })(AppointmentManager);