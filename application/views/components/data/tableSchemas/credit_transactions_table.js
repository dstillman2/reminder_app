const tableSchema = timeZone => {
  return {
    heading: [
      'Purchase/Debit Date',
      'Credits',
      'Cost',
      'Reason',
    ],
    collapsedTitle: item => {
      const time = moment.tz(item.created_at, timeZone).format('MMM Do, h:mm a');
      const credits = item.credits;

      return time + ` ( ${credits} Credits )`;
    },
    body: [
      {
        classes: 'col-xs-3',

        response: item => {
          return (
            moment.tz(item.created_at, timeZone).format('MMM Do, h:mm a')
          );
        },
      },
      {
        classes: 'col-xs-3',

        response: item => {
          return (
            item.credits
          );
        },
      },
      {
        classes: 'col-xs-3',

        response: item => {
          return (
            item.price ? '$' + (item.price / 100.0).toFixed(2) : 'N/A'
          );
        },
      },
      {
        classes: 'col-xs-3',

        response: item => {
          return (
            reasonMapping[item.reason] || item.reason
          );
        }
      },
    ]
  };
};


const reasonMapping = {
  phone_number: 'Phone Number',
  event: 'Sent Reminder',
  purchase: 'Purchase',
  new_account: 'New Account'
};


export default tableSchema;
