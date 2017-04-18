import sendAjaxRequest from '../components/common/ajax';

export const failedAccountCreation = error => (
  {
    type: 'FAILED_ACCOUNT_CREATION',
    error,
  }
);

export const createdAccount = () => (
  {
    type: 'CREATED_NEW_ACCOUNT',
  }
);

export const login = ({ data, onSuccess, onFailure, onComplete }) => (
  () => {
    sendAjaxRequest({
      api: 'web',
      path: '/login',
      method: 'POST',
      data,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: () => {
        if (typeof onFailure === 'function') {
          onFailure();
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
