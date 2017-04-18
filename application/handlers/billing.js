import stripe from 'stripe';
import async from 'async';

import { STRIPE_SECRET_KEY } from '../options';
import { knex } from '../config/db_setup';

import schemas from '../schemas/schemas';
import authenticated from '../middleware/authentication';
import { getUnixTime } from '../lib/handlers/get_unix_time';

const stripeInit = stripe(STRIPE_SECRET_KEY);

/**
 * Billing handler
 */
class Billing {
  /**
   * specify middleware and paths
   */
  constructor() {
    this.middleware = [authenticated];
  }

  /**
   * Remove array of transactions from sql database
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static get(req, res) {
    knex('credit_transactions')
    .where({
      account_id: req.user.account_id,
    }).orderBy('id', 'desc')
    .then(response => (
      res.json(schemas.CreditTransactions(response))
    ))
    .catch((error) => {
      res.status(500).json({ error });
    });
  }

  /**
   * Create billing transaction
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static post(req, res) {
    const data = {
      stripeToken: req.body.stripeToken,
      numOfCredits: req.body.creditCount,
      currency: 'usd',
      price: req.body.creditCount * 5,
    };

    async.waterfall([
      // Create a Stripe charge
      (callback) => {
        stripeInit.charges.create({
          amount: data.price,
          currency: data.currency,
          source: data.stripeToken,
          description: 'credit purchase',
        }, (error, charge) => {
          if (error) {
            callback({
              location: 'createStripeCharge',
              statusCode: 500,
              errorMessage: error,
            });

            return;
          }

          callback(null, charge);
        });
      },
      // Create credit transaction entry in sql database
      (charge, callback) => {
        knex('credit_transactions')
        .insert({
          account_id: req.user.account_id,
          credits: data.numOfCredits,
          price: data.price,
          reason: 'purchase',
          created_at: getUnixTime(),
        }).then(() => {
          callback(null, charge);
        }).catch((error) => {
          callback({
            location: 'createCreditTransaction',
            statusCode: 500,
            errorMessge: error,
          }, null);
        });
      },
      // Recalculate credit count and update database
      (charge, callback) => {
        knex.transaction((trx) => {
          knex('credit_transactions')
          .transacting(trx)
          .where({ account_id: req.user.account_id })
          .sum('credits')
          .then(response => (
            knex('accounts')
              .where({ id: req.user.account_id })
              .update({ credits: response[0]['sum(`credits`)'] }))
              .then(trx.commit)
              .catch(trx.rollback),
            )
          .catch((error) => {
            callback({
              location: 'sumCreditTransactions',
              statusCode: 500,
              errorMessage: error,
            }, null);
          });
        })
        .then(() => {
          callback(null, charge);
        }).catch((error) => {
          callback({
            location: 'sumCreditTransactions',
            statusCode: 500,
            errorMessage: error,
          }, null);
        });
      },
    ], (error, charge) => {
      if (error) {
        const { location, statusCode, errorMessage } = error;

        console.log(`ERROR: Billing POST: ${location} status: ${statusCode} error: ${errorMessage}`);

        res.status(statusCode).json({ error });

        return;
      }

      res.json({
        price: data.price,
        currency: data.currency,
        numOfCredits: data.numOfCredits,
        charge,
      });
    });
  }
}

export default Billing;
