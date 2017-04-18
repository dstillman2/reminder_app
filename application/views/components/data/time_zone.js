function timeZones(addEmptyLabel = false) {
  const timeZones = [];

  const initialTimeZones = [
    {
      label: 'United States/Pacific',
      value: 'US/Pacific',
    },
    {
      label: 'United States/Mountain',
      value: 'US/Mountain',
    },
    {
      label: 'United States/Central',
      value: 'US/Central',
    },
    {
      label: 'United States/Eastern',
      value: 'US/Eastern',
    },
    {
      label: 'United States/Arizona',
      value: 'US/Arizona',
    },
    {
      label: 'United States/Hawaii',
      value: 'US/Hawaii',
    },
    {
      label: 'United States/Alaska',
      value: 'US/Alaska',
    },
    {
      label: 'Canada/Pacific',
      value: 'Canada/Pacific',
    },
    {
      label: 'Canada/Mountain',
      value: 'Canada/Mountain',
    },
    {
      label: 'Canada/Central',
      value: 'Canada/Central',
    },
    {
      label: 'Canada/Eastern',
      value: 'Canada/Eastern',
    },
    {
      label: 'Canada/Atlantic',
      value: 'Canada/Atlantic',
    },
    {
      label: 'Canada/Newfoundland',
      value: 'Canada/Newfoundland',
    },
  ];

  if (addEmptyLabel) {
    timeZones.push({
      label: '',
    });

    return timeZones.concat(initialTimeZones);
  }

  return initialTimeZones;
}

export default timeZones;
