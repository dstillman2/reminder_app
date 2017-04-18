const tableSchema = () => ({
  heading: [
    'ID',
    'Phone Number',
    'Region',
  ],
  body: [
    {
      classes: 'col-xs-2',

      count: 0,

      response: function() {
        this.count++;

        return (
          this.count
        );
      },
    },
    {
      classes: 'col-xs-6',

      response: item => {
        return (
          item.friendlyName
        );
      },
    },
    {
      classes: 'col-xs-4',

      response: item => {
        return (
          item.region
        );
      },
    }
  ]
});

export default tableSchema;
