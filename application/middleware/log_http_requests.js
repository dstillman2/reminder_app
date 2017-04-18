/**
 * Logs http requests
 * @returns {void}
 */
function logHttpRequests() {
  return (req, res, next) => {
    // log http method and path
    console.log('%s: %s: %s', req.method, req.path, req.headers.referer);

    next();
  };
}

export default logHttpRequests;
