import { redis, knex } from '../config/db_setup';

/**
 * Authentication middleware
 * TODO: implement CSRF protection.
 *    - Check origin header and limit to web server
 *    - Remove CORS headers -> handlers refractored to all be on one server
 *    - CSRF token on each request
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next function
 * @returns {void}
 */
function authenticated(req, res, next) {
  const session = req.signedCookies.session;

  redis.get(`cb:${session}:session`, (error, reply) => {
    if (!reply) {
      res.status(403).end();

      return;
    }

    const response = JSON.parse(reply);

    knex.from('users')
      .innerJoin('accounts', 'users.account_id', '=', 'accounts.id')
      .select('users.id as user_id', 'users.*', 'accounts.*')
      .where({ 'users.id': response.user_id, 'users.is_deleted': false })
      .then((entry) => {
        if (entry.length !== 1) {
          res.status(403).end();

          return;
        }

        const output = entry[0];

        delete output.id;

        req.user = output;

        next();
      })
      .catch((catchError) => {
        res.status(500).json({ error: catchError });
      });
  });
}

export default authenticated;
