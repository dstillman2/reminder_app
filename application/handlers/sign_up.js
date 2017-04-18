import bcrypt from 'bcryptjs';
import sendgrid from 'sendgrid';
import async from 'async';
import { knex } from '../config/db_setup';

import createEmail from '../lib/handlers/createEmail';
import { getUnixTime } from '../lib/handlers/get_unix_time';
import { SENDGRID_API_KEY } from '../options';

const DEFAULT_TEXT_REMINDER_SCRIPT = 'This is {%Company%} reminding {%FirstName%} {%LastName%} of an upcoming appt. on {%Date%} @ {%Time%}.';

const DEFAULT_PHONE_REMINDER_SCRIPT = JSON.stringify([
  {
    id: 1,
    type: 'tts',
    token: 'custom',
    voice: 'woman',
    content: 'Hello, this is a reminder notification from ,',
  },
  {
    id: 2,
    type: 'tts',
    token: 'company',
    voice: 'woman',
    content: null,
  },
  {
    id: 3,
    type: 'tts',
    token: 'custom',
    voice: 'woman',
    content: ', for ,',
  },
  {
    id: 4,
    type: 'tts',
    token: 'full_name',
    voice: 'woman',
    content: null,
  },
  {
    id: 5,
    type: 'tts',
    token: 'custom',
    voice: 'woman',
    content: '. You have an appointment on ,',
  },
  {
    id: 6,
    type: 'tts',
    token: 'date_time',
    voice: 'woman',
    content: null,
  },
  {
    id: 7,
    type: 'tts',
    token: 'custom',
    voice: 'woman',
    content: 'Please call us if you cannot make this appointment. Thank you.',
  },
]);

/**
 * Sign up handler
 */
class SignUpHandler {
  /**
   * Create a new user account
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static post(req, res) {
    async.waterfall([
      // validate parameters
      (callback) => {
        req.checkBody('emailAddress', '<emailAddress> must be an email').isEmail();
        req.checkBody('countryCode', '<countryCode> is a required field').notEmpty();
        req.checkBody('firstName', '<firstName> is a required field').notEmpty();
        req.checkBody('lastName', '<lastName> is a required field').notEmpty();
        req.checkBody('timeZone', '<timeZone> is a required field').notEmpty();

        const errors = req.validationErrors();

        if (errors) {
          callback({
            location: 'validation',
            statusCode: 404,
            errorMessage: errors,
          }, null);

          return;
        }

        const params = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          company: req.body.company,
          emailAddress: req.body.emailAddress,
          countryCode: req.body.countryCode,
          timeZone: req.body.timeZone,
          content: DEFAULT_TEXT_REMINDER_SCRIPT,
        };

        callback(null, params);
      },
      // check if email address already exists
      (params, callback) => {
        knex('users')
          .where({ email_address: params.emailAddress })
          .then((response) => {
            if (response.length > 0) {
              const error = 'Email Address already exists. If you don\'t know your password, please reset it by clicking the forgot password link.';

              callback({
                location: 'emailCheck',
                statusCode: 404,
                errorMessage: error,
              }, null);

              return;
            }

            callback(null, params);
          })
          .catch((error) => {
            callback({
              location: 'emailCheck',
              statusCode: 500,
              errorMessage: error,
            }, null);
          });
      },
      // generate password
      (params, callback) => {
        const tempPassword = Math.random().toString(36).slice(-8);

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(tempPassword, salt, (hashError, hash) => {
            if (error) {
              callback({
                location: 'hash_password',
                statusCode: 500,
                errorMessage: hashError,
              });

              return;
            }

            callback(null, params, hash, tempPassword);
          });
        });
      },
      // create entries transaction
      (params, hash, tempPassword, callback) => {
        const {
          firstName,
          lastName,
          company,
          emailAddress,
          countryCode,
          timeZone,
          content,
        } = params;

        let accountId;

        knex.transaction(trx => knex('accounts')
          .transacting(trx)
          .insert({
            company,
            time_zone: timeZone,
            country_code: countryCode,
            credits: 100,
            created_at: getUnixTime(),
          })
          .then((response) => {
            accountId = response[0];

            return knex('users')
              .transacting(trx)
              .insert({
                account_id: accountId,
                password: hash,
                first_name: firstName,
                last_name: lastName,
                email_address: emailAddress.toLowerCase(),
                created_at: getUnixTime(),
              });
          })
          .then(() => knex('credit_transactions')
          .transacting(trx)
          .insert({
            account_id: accountId,
            reason: 'new_account',
            credits: 100,
            price: 0,
            created_at: getUnixTime(),
          }))
          .then(() =>
            // Create default text reminder script
            knex('scripts')
              .transacting(trx)
              .insert({
                account_id: accountId,
                name: 'default_text1',
                type: 'text',
                content,
                created_at: getUnixTime(),
              }))
          .then(() =>
            // Create default phone reminder script
            knex('scripts')
              .transacting(trx)
              .insert({
                account_id: accountId,
                name: 'default_phone1',
                type: 'phone',
                content: DEFAULT_PHONE_REMINDER_SCRIPT,
                created_at: getUnixTime(),
              })))
          .then(() => {
            // Transaction is complete
            callback(null, params, tempPassword, accountId);
          })
          .catch((error) => {
            // Transaction failed
            callback({
              location: 'transactionCreation',
              statusCode: 500,
              errorMessage: error,
            }, null);
          });
      },
      // send sendgrid email
      (params, tempPassword, accountId, callback) => {
        const sg = sendgrid(SENDGRID_API_KEY);
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: createEmail(
              params,
              tempPassword,
              'New Account Created',
              `Your password is ${tempPassword}. You can sign in at ___`,
            ).toJSON(),
        });

        sg.API(request, (error) => {
          if (error) {
            callback({
              location: 'sendSendGridEmail',
              statusCode: 500,
              errorMessage: error,
            });

            return;
          }

          callback(null);
        });
      },
    ], (error) => {
      if (error) {
        const { location, statusCode, errorMessage } = error;

        console.log(`ERROR: Billing POST: ${location} status: ${statusCode} error: ${errorMessage}`);

        res.status(statusCode).json({ error });

        return;
      }

      res.json({
        status: 'success',
      });
    });
  }
}

export default SignUpHandler;
