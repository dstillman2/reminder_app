const PRODUCTION             = process.env.PRODUCTION;
const MYSQL_HOST             = process.env.MYSQL_HOST;
const MYSQL_USER             = process.env.MYSQL_USER;
const MYSQL_PASSWORD         = process.env.MYSQL_PASSWORD;
const MYSQL_SCHEMA           = process.env.MYSQL_SCHEMA;
const WEB_SERVER             = process.env.WEB_SERVER;
const PORT                   = process.env.PORT || 5555;
const API_ROOT               = process.env.API_ROOT;
const SENDGRID_API_KEY       = process.env.SENDGRID_API_KEY;
const COOKIE_SETTINGS_DOMAIN = process.env.COOKIE_SETTINGS_DOMAIN;
const COOKIE_SECRET          = process.env.COOKIE_SECRET;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY      = process.env.STRIPE_SECRET_KEY;
const TWILIO_SID             = process.env.TWILIO_SID;
const TWILIO_AUTH            = process.env.TWILIO_AUTH;
const API_REMINDERS          = process.env.API_REMINDERS;

const options = {
  PRODUCTION,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_SCHEMA,
  WEB_SERVER,
  PORT,
  API_ROOT,
  SENDGRID_API_KEY,
  COOKIE_SETTINGS_DOMAIN,
  COOKIE_SECRET,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  TWILIO_SID,
  TWILIO_AUTH,
  API_REMINDERS,
};

export {
  PRODUCTION,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_SCHEMA,
  WEB_SERVER,
  PORT,
  API_ROOT,
  SENDGRID_API_KEY,
  COOKIE_SETTINGS_DOMAIN,
  COOKIE_SECRET,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  TWILIO_SID,
  TWILIO_AUTH,
  API_REMINDERS,
};

export default options;
