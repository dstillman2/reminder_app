import { fields, dump } from '../lib/schemas/schema_tools';

/**
 * Accounts
 * @returns {void}
 */
function Accounts() {
  this.email_address = fields.String();

  this.first_name = fields.String();
  this.last_name = fields.String();

  this.address_1 = fields.String();
  this.address_2 = fields.String();

  this.company = fields.String();
  this.zip_code = fields.String();
  this.city = fields.String();
  this.state = fields.String();
  this.country_code = fields.String();
  this.time_zone = fields.String();

  this.is_paying_customer = fields.Boolean();

  this.credits = fields.Integer();

  this.created_at = fields.DateTime();
  this.updated_at = fields.DateTime();
}

/**
 * Phone numbers
 * @returns {void}
 */
function PhoneNumbers() {
  this.id = fields.Integer();

  this.phone_number = fields.String();
  this.friendly_name = fields.String();
  this.provider = fields.String();
  this.type = fields.String();

  this.is_active = fields.Boolean();

  this.next_billing_cycle = fields.DateTime();

  this.created_at = fields.DateTime();
  this.updated_at = fields.DateTime();
}

/**
 * Credit transactions
 * @returns {void}
 */
function CreditTransactions() {
  this.id = fields.Integer();

  this.phone_number = fields.String();
  this.type = fields.String();
  this.price = fields.Integer();
  this.next_billing_cycle = fields.String();
  this.credits = fields.Integer();
  this.reason = fields.String();

  this.created_at = fields.DateTime();
  this.updated_at = fields.DateTime();
}

const schemas = {
  Accounts,
  PhoneNumbers,
  CreditTransactions,
};

export default dump(schemas);
