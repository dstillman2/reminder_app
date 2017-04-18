import sendAjaxRequest from '../components/common/ajax';

const CREATE_EVENT_ERROR = 'Unable to schedule this reminder. Please try again.';
const FETCH_EVENT_ERROR = 'Unable to retrieve list of scheduled reminders. Please try again.';
const DELETE_EVENT_ERROR = 'Failed to delete this event.';

export const updateEvent = (data) => {
  const obj = {
    type: 'UPDATE_EVENT',
  };

  for (let key in data) {
    obj[key] = data[key];
  }

  return obj;
};

export const resetEventFields = () => (
  {
    type: 'RESET_EVENT',
  }
);

export const fetchEvents = (obj) => {
  if (typeof obj === 'object') {
    var { eventId, onSuccess, onFailure, onComplete } = obj;
  } else {
    eventId = obj;
  }

  return (dispatch) => {
    let path = '/events';

    if (eventId) {
      path = `${path}/${eventId}`;
    }

    sendAjaxRequest({
      api: 'reminders',
      path,
      method: 'GET',
      authentication: true,
      data: {
        offset: 0,
        limit: 9999,
        order_by: 'desc'
      },
      successCallback: response => {
        let data;

        if (eventId) {
          data = response.data[0];
        } else {
          data = response.data;
        }

        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(updateEvent({ events: data }));
      },
      errorCallback: error => {
        if (typeof onFailure === 'function') {
          onFailure(FETCH_EVENT_ERROR);
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

export const createEvent = obj => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'reminders',
      path: '/events',
      method: 'POST',
      authentication: true,
      data,
      successCallback: response => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(resetEventFields());
      },
      errorCallback: response => {
        if (typeof onFailure === 'function') {
          onFailure(CREATE_EVENT_ERROR);
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


export const createDemoEvent = ({ data, onSuccess, onFailure, onComplete }) => (
  (dispatch) => {
    sendAjaxRequest({
      api: 'reminders',
      path: '/events/demo',
      method: 'POST',
      authentication: false,
      data,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(resetEventFields());
      },
      errorCallback: (response) => {
        if (typeof onFailure === 'function') {
          onFailure(CREATE_EVENT_ERROR);
        }
      },
      completeCallback: () => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      },
    });
  }
);


export const deleteEvent = obj => {
  if (typeof obj === 'object') {
    var { eventId, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'reminders',
      path: `/events/${eventId}`,
      method: 'DELETE',
      authentication: true,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: (response) => {
        if (typeof onFailure === 'function') {
            onFailure(DELETE_EVENT_ERROR);
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
