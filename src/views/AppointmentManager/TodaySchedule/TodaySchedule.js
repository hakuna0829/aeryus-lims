import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import DateSchedule from '../components/DateSchedule';

const TodaySchedule = (props) => {
  const { location_id, refetch, submitScheduleAction } = props;

  return (
    <DateSchedule
      location_id={location_id}
      refetch={refetch}
      submitScheduleAction={submitScheduleAction}
      momentDate={moment()}
      scheduleTitle={`TODAY'S TEST SCHEDULE`}
      showScheduleButton={true}
    />
  )
}

TodaySchedule.propTypes = {
  location_id: PropTypes.any,
  refetch: PropTypes.any.isRequired,
};

export default TodaySchedule;
