import { knex } from '../config/db_setup';
import schemas from '../schemas/schemas';

import authenticated from '../middleware/authentication';
import { getUnixTime } from '../lib/handlers/get_unix_time';

/**
 * Users class
 */
class Users {
  /**
   * constructor define middleware && paths
   */
  constructor() {
    this.middleware = [authenticated];
  }

  /**
   * Update user information
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static put(req, res) {
    const obj = {
      updated_at: getUnixTime(),
    };

    const params = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        obj[key] = params[key];
      }
    });

    knex('users').where({
      id: req.user.user_id,
    }).update(obj).then(() => {
      knex('users').select('*').where({
        id: req.user.user_id,
      }).then((response) => {
        const output = schemas.Accounts(response);

        res.json(output);
      });
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
  }
}

export default Users;
