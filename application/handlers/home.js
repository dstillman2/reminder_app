import path from 'path';

import { redis } from '../config/db_setup';
import { PRODUCTION, STRIPE_PUBLISHABLE_KEY, WEB_SERVER,
  API_REMINDERS } from '../options';

// unauthPaths are paths in the application that don't require the user to be
// logged in.
const unauthPaths = [
  '/login',
  '/forgot_password',
  '/forgot_password/reset',
  '/sign_up',
];

const bundlePath = PRODUCTION ?
  '/static/js/dist/web.bundle.min.js' : 'http://localhost:8080/web.bundle.js';

/**
 * params
 * @param {String} sessionToken session token
 * @param {Object} addObj additional params
 * @returns {obj} variables to pass to template
 */
const params = (sessionToken, addObj = {}) => {
  const obj = {
    apiToken: sessionToken,
    bundleUri: bundlePath,
    isApplication: true,
    production: PRODUCTION,
    phoneReminderFlag: false,
    reduxInitialStore: '{}',
    stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
    webServer: PRODUCTION ? WEB_SERVER : 'http://localhost:5555',
    reminderServer: PRODUCTION ? API_REMINDERS : 'http://localhost:4444',
  };

  return Object.assign({}, obj, addObj);
};

/**
 * Home handler
 */
class HomeHandler {
  /**
  * If the user has a valid session cookie, redirect them to dashboard.
  * Otherwise, reroute them to the login page.
  * @param {Object} req request object
  * @param {Object} res response object
  * @returns {void}
  */
  static get(req, res) {
    if (PRODUCTION) {
      // checks xForwardedProto (added by load balancer). http -> https
      if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(path.join('https://', req.headers.host, req.url));

        return;
      }
    }

    const session = req.signedCookies.session;

    redis.get(`cb:${session}:session`, (error, reply) => {
      if (error) {
        res.redirect('/login');

        return;
      }

      if (reply && (req.path === '/login' || req.path === '/')) {
        res.redirect('/dashboard');

        return;
      } else if (!reply && unauthPaths.indexOf(req.path) === -1) {
        res.redirect('/login');

        return;
      }

      res.render(
        path.join(__dirname, '../views', 'templates', 'index.jade'),
        params(session));
    });
  }
}

export default HomeHandler;
