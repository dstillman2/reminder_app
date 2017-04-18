const moment = window.moment;

const tableSchema = {
  heading: [
    'Caller ID',
    'Status',
    'Next Bill Date',
  ],
  body: [
    {
      classes: 'col-xs-4',

      response: (item) => {
        return (
          item.friendly_name
        );
      },
    },
    {
      classes: 'col-xs-4',

      response: (item) => {
        return (
          item.is_active ? 'Active' : 'Cancelled'
        );
      },
    },
    {
      classes: 'col-xs-4',

      response: (item) => {
        const time = moment(item.next_billing_cycle).format('MMM Do YYYY');

        return (
          item.is_active ? time : <del>{time}</del>
        );
      },
    }
  ]
};

export default tableSchema;
