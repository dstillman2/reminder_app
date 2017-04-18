/**
 * jQuery ajax call
 * @returns {void}
 */
export default function ajax({
  api,
  path,
  method,
  data,
  successCallback,
  errorCallback,
  completeCallback,
  contentType,
  authentication,
  processData,
}) {
  /* API_ROOT specifies the API IP address we want to request data from. However
  we may also want to send a request to the same web domain (i.e. a signup request).
  If web is true, set to path only.
  */
  if (typeof window.servers === 'undefined') {
    return;
  }

  if (!window.servers[api]) {
    throw new ReferenceError('Invalid server specified for ajax request.');
  }

  const url = window.servers[api] + path;

  const options = {
    url,

    method,

    success(response) {
      successCallback(response);
    },

    error(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401 || jqXHR.status === 403) {
        // The user is not logged in - redirect them back to the login page
        if (window.flagDemo) {
          // do not redirect if using the demo embed on the main website.
          errorCallback();

          return;
        }

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';

          return;
        }
      }

      errorCallback({
        responseJSON: jqXHR.responseJSON || { error: {} },
        errorThrown,
      });
    },

    complete() {
      if (typeof completeCallback === 'function') {
        completeCallback();
      }
    },

    xhrFields: {
      withCredentials: true,
    },
  };

  // if data is present, set the data
  if (data) {
    options.data = data;
  }

  if (authentication) {
    options.headers = {
      Authorization: 'Basic'.concat(' ', btoa(`${window.sessionToken}:`)),
    };
  }

  if (processData) {
    options.processData = processData;
  }

  if (contentType) {
    options.contentType = contentType;
  }

  $.ajax(options);
}
