import { knex } from '../config/db_setup';
import schemas from '../schemas/schemas';

import authenticated from '../middleware/authentication';

/**
 * Phone numbers handler
 */
class PhoneNumbers {
  /**
   * specify middleware
   */
  constructor() {
    this.middleware = [authenticated];
  }

  /**
   * Returns array of phone numbers for the account
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static get(req, res) {
    knex('phone_numbers').select('*').where({
      account_id: req.user.account_id,
      is_deleted: 0,
    })
    .then((response) => {
      res.json(schemas.PhoneNumbers(response));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  }
}

export default PhoneNumbers;
