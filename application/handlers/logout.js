import { redis } from '../config/db_setup';

/**
 * Logout handler
 */
class Logout {
  /**
  * Get the session cookie and remove it from the database
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {void}
  */
  static get(req, res) {
    const sessionId = req.signedCookies.session;

    redis.del(`cb:${sessionId}:session`, (error) => {
      if (error) {
        res.status(500).error({ error });

        return;
      }

      res.clearCookie('session');

      res.redirect('/login');
    });
  }
}

export default Logout;
