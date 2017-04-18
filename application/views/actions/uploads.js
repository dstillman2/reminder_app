import sendAjaxRequest from '../components/common/ajax';

const ERROR_UPLOAD = 'Cannot upload at this time';

export const fetchUploadUrl = (obj) => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch, getState) => {
    sendAjaxRequest({
      api: 'reminders',
      path: '/s3_key',
      method: 'GET',
      authentication: true,
      data,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: () => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_UPLOAD);
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
