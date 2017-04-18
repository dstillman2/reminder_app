import path from 'path';

/**
 * Returns favicon when requested
 * @returns {void}
 */
function favicon() {
  return (req, res, next) => {
    if (req.method === 'GET' && req.path.indexOf('favicon.') !== -1) {
      const options = {
        root: path.join(__dirname, '../views'),
        headers: {
          'content-type': 'image/x-icon',
          'cache-control': 'public, max-age=31536000',
        },
      };

      res.sendFile('/static/img/favicon.ico', options);

      return;
    }

    next();
  };
}

export default favicon;
