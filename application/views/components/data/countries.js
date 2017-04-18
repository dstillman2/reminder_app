const countries = function countries(addEmptyLabel = false) {
  const countriesList = [];

  const initialCountries = [
    {
      label: 'United States',
      value: 'US',
    },
    {
      label: 'Canada',
      value: 'CA',
    },
  ];

  if (addEmptyLabel) {
    countriesList.push({
      label: '',
    });

    return countriesList.concat(initialCountries);
  }

  return initialCountries;
}

export default countries;
