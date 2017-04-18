const voiceOptions = [
  {
    label: 'Man',
    value: 'man',
  },
  {
    label: 'Woman',
    value: 'woman',
  },
];

const typeOptions = [
  {
    label: 'Text to Speech',
    value: 'tts',
  },
  {
    label: 'Upload Audio File',
    value: 'upload',
  },
];

const tokenOptions = [
  {
    label: 'Full Name (i.e. John Doe)',
    value: 'full_name',
  },
  {
    label: 'First Name (i.e. John)',
    value: 'first_name',
  },
  {
    label: 'Last Name (i.e. Doe)',
    value: 'last_name',
  },
  {
    label: 'Date (i.e. January 5th)',
    value: 'date',
  },
  {
    label: 'Time (i.e. 5:30 PM)',
    value: 'time',
  },
  {
    label: 'Date Time (i.e. January 5th, 5:30 PM)',
    value: 'date_time',
  },
  {
    label: 'Company',
    value: 'company',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export { voiceOptions, typeOptions, tokenOptions };
