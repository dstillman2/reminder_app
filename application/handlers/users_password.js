import bcrypt from 'bcryptjs';
import async from 'async';

import { knex } from '../config/db_setup';

import authenticated from '../middleware/authentication';
import { getUnixTime } from '../lib/handlers/get_unix_time';

/**
 * User password handler
 */
class UsersPassword {
  /**
   * set middleware
   */
  constructor() {
    this.middleware = [authenticated];
  }

  /**
   * Update user password
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static put(req, res) {
    const data = {
      oldPassword: req.body.old_password,
      newPassword: req.body.new_password,
    };

    if (!(data.oldPassword && data.newPassword)) {
      res.status(400).json({
        error: 'Both the old password and new password are required.',
      });

      return;
    }

    async.waterfall([
      // Get user information
      (callback) => {
        knex('users').select('*').where({
          id: req.user.user_id,
          is_deleted: 0,
        })
        .then((response) => {
          if (response.length !== 1) {
            callback({
              location: 'getUser',
              statusCode: 400,
              errorMessage: 'User does not exist',
            }, null);

            return;
          }

          const currentPassword = response[0].password;

          callback(null, currentPassword);
        })
        .catch((error) => {
          callback({
            location: 'updatePassword',
            statusCode: 500,
            errorMessage: error,
          }, null);
        });
      },
      // Validate password
      (currentPassword, callback) => {
        if (bcrypt.compareSync(data.oldPassword, currentPassword) === true) {
          callback(null);

          return;
        }

        callback({
          location: 'getUser',
          statusCode: 400,
          errorMessage: 'Password is incorrect',
        }, null);
      },
      // Hash password
      (callback) => {
        bcrypt.genSalt(10, (saltError, salt) => {
          bcrypt.hash(data.newPassword, salt, (hashError, hashedPassword) => {
            if (hashError) {
              callback({
                location: 'hashPassword',
                statusCode: 500,
                errorMessage: hashError,
              });

              return;
            }

            callback(null, hashedPassword);
          });
        });
      },
      // Add new password to database
      (hashedPassword, callback) => {
        knex('users').where({
          id: req.user.user_id,
          is_deleted: 0,
        })
        .update({
          updated_at: getUnixTime(),
          password: hashedPassword,
        })
        .then(() => {
          callback(null);
        })
        .catch((error) => {
          callback({
            location: 'pwToDb',
            statusCode: 500,
            errorMessage: error,
          });
        });
      },
    ], (error) => {
      if (error) {
        const { location, statusCode, errorMessage } = error;

        console.log(`ERROR: Billing POST: ${location} status: ${status} error: ${errorMessage}`);

        res.status(statusCode).json({ error });

        return;
      }

      res.json({
        status: 'success',
      });
    });
  }
}

export default UsersPassword;
