import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import DateSchedule from '../components/DateSchedule';

const TomorrowSchedule = (props) => {
  const { location_id, refetch, submitScheduleAction } = props;

  return (
    <DateSchedule
      location_id={location_id}
      refetch={refetch}
      momentDate={moment().add(1, 'd')}
      scheduleTitle={`TOMORROW'S TEST SCHEDULE`}
      showScheduleButton={true}
      submitScheduleAction={submitScheduleAction}
    />
  )
}

TomorrowSchedule.propTypes = {
  location_id: PropTypes.any,
  refetch: PropTypes.any.isRequired,
  submitScheduleAction: PropTypes.func.isRequired,
};

export default TomorrowSchedule;
