import sendAjaxRequest from '../components/common/ajax';

export const updatePhoneNumbers = data => (
  {
    type: 'UPDATE_PHONE_NUMBERS',
    data: data.data,
    error: data.error,
    count: data.count,
  }
);

export const updateAvailablePhoneNumbers = data => (
  {
    type: 'UPDATE_AVAILABLE_PHONE_NUMBERS',
    data: data.data,
    error: data.error,
    count: data.count,
  }
);

const ERROR_FETCH_PHONE_NUMBERS = 'There was an error fetching your phone numbers. Please refresh the page.';

export const fetchPhoneNumbers = obj => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'web',
      path: '/phone-numbers',
      method: 'GET',
      data,
      successCallback: response => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(updatePhoneNumbers({
          data: response.data,
          count: response.count
        }));
      },
      errorCallback: error => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_FETCH_PHONE_NUMBERS);
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

const ERROR_AVAILABLE_NUMBERS = `There was an error fetching available phone numbers. Please refresh the page.`;

export const fetchAvailablePhoneNumbers = obj => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'web',
      path: '/phone-numbers/twilio',
      method: 'GET',
      data: data,
      successCallback: response => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(updateAvailablePhoneNumbers({
          data: response.data,
          count: response.count
        }));
      },
      errorCallback: error => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_AVAILABLE_NUMBERS);
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

let ERROR_CREATE_PHONE_NUMBER = `Cannot purchase this phone number.`;

export const createPhoneNumber = obj => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'web',
      path: '/phone-numbers/twilio',
      method: 'POST',
      data,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: (response) => {
        if (response.responseJSON.error.code === 'no_credits') {
          ERROR_CREATE_PHONE_NUMBER = 'Not enough credits (120 required).'
        }

        if (typeof onFailure === 'function') {
          onFailure(ERROR_CREATE_PHONE_NUMBER);
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

const ERROR_DELETE_PHONE_NUMBER = `Cannot delete this phone number.`;

export const deletePhoneNumber = (obj) => {
  if (typeof obj === 'object') {
    var { id, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'web',
      path: '/phone-numbers/twilio/' + id,
      method: 'DELETE',
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: () => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_DELETE_PHONE_NUMBER);
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

const ERROR_REACTIVATE_PHONE_NUMBER = `Cannot reactivate this phone number.`;

export const updatePhoneNumber = (obj) => {
  if (typeof obj === 'object') {
    var { id, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'web',
      path: '/phone-numbers/twilio/' + id,
      method: 'PUT',
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: () => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_REACTIVATE_PHONE_NUMBER);
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
