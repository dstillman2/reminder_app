function contactName(item) {
  const targets = JSON.parse(item.targets);
  const target = targets[0];
  const len = targets.length;

  let val;

  if (target.first_name && target.last_name) {
    val = `${target.first_name[0]}. ${target.last_name}`
  } else if (target.first_name || target.last_name) {
    val = target.first_name || target.last_name;
  } else {
    val = target.phone_number;
  }

  if (len > 1) {
    val = val + ' +' + (len - 1);
  }

  return val;
}

const tableSchema = function(timeZone) {
  return {
    heading: [
      'Contact',
      'Appt. Time',
      'Reminder Time',
      'Status',
    ],
    collapsedViewMoreButton: true,
    collapsedTitle: (item) => {
      const mapping = {
        text: 'Text',
        phone: 'Phone',
        pending: 'Pending',
        complete: 'Complete',
        failed: 'Failed',
      };

      const type = mapping[item.type];
      const status = mapping[item.status];

      return type + ' to ' + contactName(item) + ' (' + status + ')';
    },
    body: [
      {
        classes: 'col-xs-4',

        response: item => contactName(item),
      },
      {
        classes: 'col-xs-4',

        response: item => {
          const time = moment.tz(item.appointment_time * 1000, timeZone)
                             .format('MMM Do, h:mm a');

          return time;
        }
      },
      {
        classes: 'col-xs-4',

        response: (item) => {
          const time = moment.tz(item.send_time * 1000, timeZone)
            .format('MMM Do, h:mm a');

          return time;
        },
      },
      {
        classes: 'col-xs-4',

        response: (item) => {
          const mapping = {
            pending: 'Pending',
            complete: 'Complete',
            failed: 'Failed',
          };

          return mapping[item.status];
        },
      },
    ],
  };
};

export default tableSchema;
