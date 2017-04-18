/**
 * Register methods as part of the application for each handler
 * @param {Object} app express instance
 * @param {Array} handlers array of route and handler pairs
 * @returns {void} no return value
 */
function registerHandlers(app, handlers) {
  const methods = ['get', 'post', 'put', 'delete'];

  handlers.forEach((route) => {
    const baseUrl = route[0];
    const handler = new route[1]();

    methods.forEach((method) => {
      if (typeof route[1][method] === 'function') {
        const originalUrl = handler.route ? baseUrl + handler.route[method] : baseUrl;

        if (handler.middleware && handler.middleware.length > 0) {
          app[method](originalUrl, handler.middleware, route[1][method]);
        } else {
          app[method](originalUrl, route[1][method]);
        }
      }
    });
  });
}

export default registerHandlers;
