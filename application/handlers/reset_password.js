import async from 'async';
import bcrypt from 'bcryptjs';

import { redis, knex } from '../config/db_setup';

/**
 * Reset password handler
 */
class ResetPasswordHandler {
  /**
   * Reset password
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static post(req, res) {
    const data = {
      token: req.body.token,
      password: req.body.password,
    };

    async.series([
      (callback) => {
        // user id is associated with the token in redis
        redis.get(`cb:${data.token}:forgotpassword`, (error, reply) => {
          if (error) {
            res.status(400).json({ error: 'invalid token' });

            return;
          }

          const userId = JSON.parse(reply).userId;

          // remove the token to prevent multiple resets
          redis.del(`cb:${data.token}:forgotpassword`);

          callback(null, userId);
        });
      },
      (callback) => {
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(data.password, salt, (bcryptError, hash) => {
            if (bcryptError) {
              res.status(500).json({ error: 'internal' });

              return;
            }

            callback(null, hash);
          });
        });
      },
    ], (error, results) => {
      if (error) {
        res.status(500).end();

        return;
      }

      // write new password to database
      knex('users').where({ id: results[0] })
        .update({ password: results[1] })
        .then(() => { res.status(200).end(); })
        .catch(() => { res.status(500).end(); });
    });
  }
}

export default ResetPasswordHandler;
