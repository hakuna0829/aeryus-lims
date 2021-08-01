import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import SideBar from './Sidebar';
import MonthSchedule from './MonthSchedule';
import TodaySchedule from './TodaySchedule';
import TomorrowSchedule from './TomorrowSchedule';
import WeekSchedule from './WeekSchedule/WeekSchedule';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
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
}));

const TestScheduleManager = (props) => {
  const { match, history } = props;
  const classes = useStyles();
  
  
  const [location_id, setLocationId] = useState(0);
  const [refetch, setRefetch] = useState(0);
  
  const activeTab = match.params.tab;
  const [selectedSchedule, setSelectedSchedule] = useState(activeTab);
 
  React.useEffect(() =>{
    setSelectedSchedule(activeTab);
  },[activeTab])
  const selectedChange = (selected) => {
    setSelectedSchedule(selected);
    console.log('test-schedule-manager/'+selected)
    history.push('/test-schedule-manager/'+selected);
  }

  const doRefetch = () => {
    setRefetch(refetch => refetch + 1);
  }
 console.log('activeTab - ', )
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
              doRefetch={doRefetch}
            />
          )}
          {selectedSchedule === 'today' && (
            <TodaySchedule
              location_id={location_id}
              refetch={refetch}
              doRefetch={doRefetch}
            />
          )}
          {selectedSchedule === 'tomorrow' && (
            <TomorrowSchedule
              location_id={location_id}
              refetch={refetch}
              doRefetch={doRefetch}
            />
          )}
          {selectedSchedule === 'weekly' && (
            <WeekSchedule location_id={location_id} refetch={refetch}
            doRefetch={doRefetch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScheduleManager;