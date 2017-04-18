export const updateCredits = credits => (
  {
    type: 'UPDATE_CREDITS',
    credits,
  }
);

export const updateUser = ({
  email_address,
  first_name,
  last_name,
  address_1,
  address_2,
  zip_code,
  city,
  state,
  country_code,
  credits,
  time_zone,
  error,
  company }) => (
  {
    type: 'UPDATE_USER',
    company,
    email_address,
    first_name,
    last_name,
    address_1,
    address_2,
    zip_code,
    city,
    state,
    country_code,
    credits,
    time_zone,
    error,
  }
);
