import uuid from 'node-uuid';
import moment from 'moment';
import sendgrid from 'sendgrid';
import async from 'async';

import { knex, redis } from '../config/db_setup';
import { SENDGRID_API_KEY } from '../options';
import createEmail from '../lib/handlers/createEmail';

/**
 * Forgot password handler
 */
class ForgotPasswordHandler {
  /**
   * Send a forgot password email to reset
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static post(req, res) {
    async.waterfall([
      // Check if email is in the database
      (callback) => {
        knex('users')
        .where({ email_address: req.body.emailAddress })
        .then((response) => {
          if (response.length !== 1) {
            // Return success if email not in db
            callback({
              location: 'InvalidEmailAddress',
              statusCode: 200,
            });

            return;
          }

          callback(null, response[0].id, response[0].email_address);
        })
        .catch((error) => {
          callback({
            location: 'InvalidEmailAddress',
            statusCode: 500,
            error,
          });
        });
      },
      // set redis reset password token
      (userId, emailAddress, callback) => {
        const uniqueId = uuid.v4() + moment().unix();

        redis.setex(
          `cb:${uniqueId}:forgotpassword`,
          1800,
          JSON.stringify({ userId }),
          (error) => {
            if (error) {
              callback({
                location: 'InvalidEmailAddress',
                statusCode: 500,
                error,
              });

              return;
            }

            callback(null, uniqueId, emailAddress);
          },
        );
      },
      // send sendgrid email
      (uniqueId, emailAddress, callback) => {
        const sg = sendgrid(SENDGRID_API_KEY);
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: createEmail(emailAddress, uniqueId).toJSON(),
        });

        sg.API(request, (error) => {
          if (error) {
            callback({
              location: 'sendSendGridEmail',
              statusCode: 500,
              error,
            });
          }

          callback(null);
        });
      },
    ], (error) => {
      if (error) {
        const { location, statusCode, errorMessage } = error;

        console.log(`ERROR: Forgot Password POST: ${location} status: ${status} error: ${errorMessage}`);

        res.status(statusCode).json({ error });

        return;
      }

      res.status(200).end();
    });
  }
}

export default ForgotPasswordHandler;
