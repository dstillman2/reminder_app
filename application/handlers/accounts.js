import { knex } from '../config/db_setup';
import schemas from '../schemas/schemas';

import authenticated from '../middleware/authentication';
import { getUnixTime } from '../lib/handlers/get_unix_time';

/**
* Fetch, update user account infomration
*/
class Accounts {
  /**
   * Specify handler middleware
   */
  constructor() {
    this.middleware = [authenticated];
  }

  /**
   * Fetches and returns json object with user information
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static get(req, res) {
    res.json(schemas.Accounts([req.user]));
  }

  /**
   * Updates account information and returns json object with updated parameters
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static put(req, res) {
    const obj = {
      updated_at: getUnixTime(),
    };

    const data = {
      company: req.body.company,
      address_1: req.body.address_1,
      address_2: req.body.address_2 || '',
      city: req.body.city,
      state: req.body.state,
      zip_code: req.body.zip_code,
      time_zone: req.body.time_zone,
    };

    // Remove entries that weren't updated
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        obj[key] = value;
      }
    });

    knex('accounts').where({
      id: req.user.account_id,
      is_deleted: 0,
    })
    .update(obj)
    .then(() => {
      knex('accounts').select('*').where({
        id: req.user.account_id,
      }).then((response) => {
        const output = schemas.Accounts(response);

        res.json(output);
      })
      .catch((error) => {
        res.status(500).send({ error });
      });
    });
  }
}

export default Accounts;
