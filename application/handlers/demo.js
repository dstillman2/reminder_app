import path from 'path';

import uuid from 'node-uuid';

import { redis } from '../config/db_setup';
import { PRODUCTION, WEB_SERVER, API_REMINDERS,
  COOKIE_SETTINGS_DOMAIN } from '../options';

const bundlePath = PRODUCTION
  ? '/static/js/dist/demo.bundle.min.js'
  : 'http://localhost:8080/demo.bundle.js';

const params = (addObj = {}) => {
  const obj = {
    bundleUri: bundlePath,
    isDemo: true,
    webServer: PRODUCTION ? WEB_SERVER : 'http://localhost:5555',
    reminderServer: PRODUCTION ? API_REMINDERS : 'http://localhost:4444',
  };

  return Object.assign({}, obj, addObj);
};

/**
 * Renders the demo widget. This is used as the source of an iframe on the main
 * website.
 */
class DemoHandler {
  /**
   * Remove X-Frame-Options header set by the helmet middleware.
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void}
   */
  static get(req, res) {
    res.removeHeader('X-Frame-Options');

    const cookie = req.cookies.demo_session;

    // If the cookie has been set, do not add the cookie.
    if (cookie) {
      res.render(
        path.join(__dirname, '../views', 'templates', 'demo.jade'),
        params(),
      );

      return;
    }

    const uniqueId = uuid.v4();
    const key = `cb:demo:${uniqueId}:reminder`;

    // Sets a counter that is read by the events handler demo authentication.
    redis.set(key, JSON.stringify({ count: 0 }), (error) => {
      if (error) {
        res.status(500).end();

        return;
      }

      res.cookie(
        'demo_session',
        key,
        { maxAge: 10000000, httpOnly: true, domain: COOKIE_SETTINGS_DOMAIN },
      );

      res.render(
        path.join(__dirname, '../views', 'templates', 'demo.jade'),
        params(),
      );
    },
    );
  }
}

export default DemoHandler;
