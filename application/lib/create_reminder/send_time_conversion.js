/**
 * Input appointment time. Output reminder send time
 * @param {Object} obj Input appointment time object
 * @returns {Number} send time as epoch time
 */
function sendTimeCalculation(obj) {
  const { appointmentTime, hour, ampm, daysPrior, timeZone } = obj;

  let sendTime;

  // Subtract <days> from appointmentTime (specified in ISO8601)
  sendTime = moment(appointmentTime).tz(timeZone).subtract(daysPrior, 'days');

  // <hour> is the hour you want to send out the appointment. Convert <hour> to
  // military time.
  let hourMilitarySendTime = null;

  if (ampm === 'AM' && hour !== 12) {
    hourMilitarySendTime = hour;
  } else if (ampm === 'AM' && hour === 12) {
    hourMilitarySendTime = 0;
  } else if (ampm === 'PM' && hour === 12) {
    hourMilitarySendTime = hour;
  } else if (ampm === 'PM' && hour !== 12) {
    hourMilitarySendTime = hour + 12;
  } else {
    throw new Error('Invalid military send time conversion');
  }

  // Get the hour for the appointment time. moment defaults to military time.
  const hourMilitaryAppointmentTime = moment(appointmentTime).tz(timeZone).hour();

  // Calculate the hour difference between the send time and appointment time
  const hourDifference = hourMilitarySendTime - hourMilitaryAppointmentTime;

  // Example: 2AM appt 11AM send time +9
  if (hourDifference > 0) {
    sendTime = moment(sendTime).tz(timeZone).add(hourDifference, 'hours');
  }

  // Example: 5PM appt 11AM send time -6
  if (hourDifference < 0) {
    sendTime = moment(sendTime).tz(timeZone).subtract(Math.abs(hourDifference), 'hours');
  }

  // Remove minutes from send time
  const minutesToRemove = moment(appointmentTime).tz(timeZone).minutes();

  sendTime = moment(sendTime).tz(timeZone).subtract(minutesToRemove, 'minutes');

  return sendTime;
}

export default sendTimeCalculation;
