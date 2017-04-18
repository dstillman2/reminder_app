import sendAjaxRequest from '../components/common/ajax';

const ERROR_FETCH_SCRIPT = 'There was an error with this request.';
const ERROR_UPDATE_SCRIPT = 'There was an error with this request.';

export const updateScriptsState = (data) => {
  if (data.scripts && data.scripts.constructor === Array) {
    const scripts = data.scripts;

    for (let i = 0; i < scripts.length; i += 1) {
      if (scripts[i].type === 'text') {
        var textScript = scripts[i];
      } else if (scripts[i].type === 'phone') {
        var phoneScript = scripts[i];
      }
    }
  }

  return {
    type: 'UPDATE_SCRIPTS_STATE',
    phoneScript: phoneScript || data.phoneScript,
    textScript: textScript || data.textScript,
    scripts: data.scripts,
    script: data.script,
    count: data.count,
    error: data.error,
  };
}

export const fetchScripts = (obj) => {
  /* If a script ID is passed in, only fetch 1 script. Otherwise fetch all
  * scripts.
  */
  if (typeof obj === 'object') {
    var { scriptId, onSuccess, onFailure, onComplete, data } = obj;
  }

  return (dispatch, getState) => {
    let path = '/scripts';

    if (typeof scriptId !== 'undefined') {
      path = path + `/${scriptId}`;
    } else {
      var params = { offset: 0, limit: 9999, order_by: 'desc' };
    }

    if (params && typeof data === 'object') {
      data = Object.assign({}, data, params);
    } else {
      data = params;
    }

    sendAjaxRequest({
      api: 'reminders',
      path,
      method: 'GET',
      authentication: true,
      data,
      successCallback: response => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        const data = {};

        if (typeof scriptId !== 'undefined') {
          data.script = response.data;
        } else {
          data.scripts = response.data;
          data.count = response.data.length;
        }

        dispatch(updateScriptsState(data));
      },
      errorCallback: error => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_FETCH_SCRIPT);
        }
      },
      completeCallback: () => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    });
  }
}

export const updateScripts = (obj) => {
  if (typeof obj === 'object') {
    var { scriptId, onSuccess, onFailure, onComplete, data } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'reminders',
      path: '/scripts/' + scriptId,
      method: 'PUT',
      authentication: true,
      data,
      successCallback: response => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(updateScriptsState({
          phoneScript: response.data
        }));
      },
      errorCallback: error => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_UPDATE_SCRIPT);
        }
      },
      completeCallback: () => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    });
  }
}
