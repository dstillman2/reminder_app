const $ = global.$;

window.servers = {
  web: 'https://web.testdomain.com',
  reminders: 'https://reminders.testdomain.com',
};

// Ajax mock
$.ajax = ({ url, method, error, success }) => {
  const sim = global.simHTTPRequest;
  const data = sim[url + method];
  const resp = data.response;

  if (data.statusCode >= 200 && data.statusCode < 300) {
    success(resp);
  } else {
    error(resp.jqXHR, resp.textStatus);
  }
};

/**
 * Simulate an HTTP request. This function must be called prior to calling
 * $.ajax as it holds the response values in memory. $.ajax will later pull the
 * response information from this function using global.simHTTPRequest, where the
 * data is stored.
 * @returns {Function} CRUD methods for simulation
 */
const simHTTPRequest = (function simHTTPRequest() {
  const sim = {};

  global.simHTTPRequest = sim;

  const send = function send(url, path, method) {
    return (statusCode, response) => {
      sim[url + path + method] = {
        statusCode,
        response,
        method,
      };
    };
  };

  return url => ({
    get(path) {
      return { send: send(url, path, 'GET') };
    },

    post(path) {
      return { send: send(url, path, 'POST') };
    },

    put(path) {
      return { send: send(url, path, 'PUT') };
    },

    delete(path) {
      return { send: send(url, path, 'DELETE') };
    },
  });
}());

export default simHTTPRequest;
