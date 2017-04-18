import { WEB_SERVER } from '../options';

/**
 * Set cors headers: access-control origin, methods, credentials, and allowable
 * headers.
 * @returns {void}
 */
function cors() {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', WEB_SERVER);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization');

    if (req.method === 'OPTIONS') {
      res.end();

      return;
    }

    next();
  };
}

export default cors;
