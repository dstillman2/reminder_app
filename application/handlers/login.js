import bcrypt from 'bcryptjs';
import uuid from 'node-uuid';

import { redis, knex } from '../config/db_setup';
import { PRODUCTION, COOKIE_SETTINGS_DOMAIN } from '../options';
import rateLimiter from '../middleware/rateLimiter';

let cookieSettings = {
  httpOnly: true,
  signed: true,
  sameSite: true,
};

if (PRODUCTION) {
  // Set the domain name for the cookie
  cookieSettings = Object.assign({}, cookieSettings, {
    domain: COOKIE_SETTINGS_DOMAIN,
    secure: true,
  });
}

const invalidCredentials = (res) => {
  res.status(401).json({
    error: 'Login credentials are invalid.',
  });
};

/**
 * Login handler
 */
class Login {
  constructor() {
    if (!PRODUCTION) {
      // Testing rate limiter functionality
      this.middleware = [rateLimiter()];
    }
  }

  /**
   * Validate credentials. If the user is valid, set a unique session ID and add
   * it to the redis database. This token should expire in 4 hours. Once the session
   * is placed in redis, set a cookie in the response. The cookie should not be
   * accessible by the browser (httpOnly) and not be tampered with (signed).
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static post(req, res) {
    const params = {
      emailAddress: req.body.username,
      password: req.body.password,
    };

    knex.from('users')
      .select('*')
      .where({ email_address: params.emailAddress, is_deleted: false })
      .then((response) => {
        // If the database doesn't return a valid entry, return an error
        if (response.length !== 1) {
          invalidCredentials(res);

          return;
        }

        const user = response[0];
        const dbPassword = response[0].password;

        if (bcrypt.compareSync(params.password, dbPassword) !== true) {
          invalidCredentials(res);

          return;
        }

        // If the passwords match, create a random unique session ID to set
        // in redis. The redis session will expire after 4 hours. */
        const sessionId = uuid.v4();

        // setex is a time dependent key:value store. After 14400 seconds, the
        // key will expire.
        redis.setex(`cb:${sessionId}:session`, 14400, JSON.stringify({
          session_id: sessionId,
          user_id: user.id,
          account_id: user.account_id,
        }), (error) => {
          if (error) {
            res.status(500).send({ error });

            return;
          }

          // Set a secure cookie. To validate the current user, They will sign
          // in/access the API by providing a valid cookie.
          res.cookie('session', sessionId, cookieSettings);

          res.json({ sessionId, active: true });
        });
      })
      .catch(error => res.status(500).send({ error }));
  }
}

module.exports = Login;
