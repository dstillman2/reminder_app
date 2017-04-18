import { knex } from '../config/db_setup';

import authenticated from '../middleware/authentication';
import { TWILIO_SID, TWILIO_AUTH } from '../options';

import { getUnixTime, calcNextBillingDate } from '../lib/handlers/get_unix_time';
import recalculateCreditCount from '../lib/handlers/recalculateCreditCount';

const client = require('twilio')(TWILIO_SID, TWILIO_AUTH);

const PHONE_NUMBER_CREDITS = 120;

/**
* Twilio handler
*/
class PhoneNumbersTwilio {
  /**
  * Specify middleware and custom paths
  */
  constructor() {
    this.middleware = [authenticated];
  }

  /**
  * Search for available Twilio numbers. For reference, go to:
  * https://www.twilio.com/docs/api/rest/available-phone-numbers
  * Allowed parameters: areaCode, contains, countryCode
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {void}
  */
  static get(req, res) {
    client.availablePhoneNumbers(req.user.country_code).local.list({
      areaCode: req.query.areaCode,
      contains: req.query.contains,
      smsEnabled: true,
      voiceEnabled: true,
      excludeAllAddressRequired: true,
      beta: true,
    }, (error, data) => {
      if (error) {
        res.status(500).json({
          error: 'Cannot retrieve list of available phone numbers',
        });

        return;
      }

      res.json({
        data: data.available_phone_numbers,
        count: data.available_phone_numbers.length,
      });
    });
  }

  /**
  * Purchase a Twilio phone number. For reference, go to:
  * https://www.twilio.com/docs/api/rest/available-phone-numbers
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {void} no return value
  */
  static post(req, res) {
    const phoneNumber = req.body.phoneNumber;

    if (req.user.credits < PHONE_NUMBER_CREDITS) {
      res.status(401).json({
        error: {
          message: "You don't have enough credits.",
          code: 'no_credits',
        },
      });

      return;
    }
    client.incomingPhoneNumbers.create({
      phoneNumber, // "+17067055553" FORMAT
    }, (error, purchasedNumber) => {
      if (error) {
        // If invalid # supplied or cannot purchase:
        res.status(422).json({
          error: {
            message: 'Cannot purchase this phone number.',
            code: 'phone_number_error',
            error,
          },
        });

        return;
      }

      knex.transaction(trx => knex('phone_numbers')
        .transacting(trx)
        .insert({
          account_id: req.user.account_id,
          provider: 'twilio',
          phone_number: purchasedNumber.phoneNumber,
          friendly_name: purchasedNumber.friendlyName,
          sid: purchasedNumber.sid,
          next_billing_cycle: calcNextBillingDate(),
          is_active: 1,
          created_at: getUnixTime(),
        })
        .then(response => knex('credit_transactions')
        .transacting(trx)
        .insert({
          account_id: req.user.account_id,
          phone_number_id: response[0],
          credits: -PHONE_NUMBER_CREDITS,
          price: -PHONE_NUMBER_CREDITS * 5,
          reason: 'phone_number',
          created_at: getUnixTime(),
        })))
        .then(recalculateCreditCount(req.user.account_id))
        .then(() => {
          res.json({
            data: { phoneNumber: purchasedNumber.phoneNumber },
          });
        })
        .catch(catchError => res.status(500).json({ error: catchError }));
    });
  }

  /**
  * Update twilio phone number to active state
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {void} no return value
  */
  static put(req, res) {
    knex('phone_numbers').where({
      id: req.params.id,
      account_id: req.user.account_id,
      is_active: 0,
      is_deleted: 0,
    }).update({
      is_active: 1,
    })
    .then((response) => {
      if (response > 0) {
        res.end();
      } else {
        res.status(400).end();
      }
    })
    .catch(() => {
      res.status(400).end();
    });
  }

  /**
  * Update twilio phone number to active state
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {void} no return value
  */
  static delete(req, res) {
    knex('phone_numbers').where({
      id: req.params.id,
      account_id: req.user.account_id,
      is_active: 1,
      is_deleted: 0,
    }).update({
      is_active: 0,
    })
    .then((response) => {
      if (response > 0) {
        res.end();
      } else {
        res.status(400).end();
      }
    })
    .catch(() => {
      res.status(400).end();
    });
  }
}

export default PhoneNumbersTwilio;
