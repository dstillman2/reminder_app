import sendAjaxRequest from '../components/common/ajax';
import { updateUser } from './userInfo';

export const USER_INFO_FETCH_ERROR = 'Unable to fetch account details';

export const userInfoFetch = () => (
  (dispatch) => {
    sendAjaxRequest({
      api: 'web',
      path: '/accounts',
      method: 'GET',
      successCallback: (response) => {
        const data = response.data[0];

        dispatch(updateUser(data));
      },
      errorCallback: () => {
        dispatch(updateUser({
          error: USER_INFO_FETCH_ERROR,
        }));
      },
    });
  }
);

const CREATE_ACCOUNT_ERROR = 'Unable to create a new account. Please try again.';

export const createNewAccount = (obj) => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return () => {
    sendAjaxRequest({
      api: 'web',
      path: '/sign-up',
      method: 'POST',
      data,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }
      },
      errorCallback: (response) => {
        let error;

        if (typeof response.responseJSON.error === 'string') {
          error = response.responseJSON.error;
        }

        if (typeof onFailure === 'function') {
          onFailure(error || CREATE_ACCOUNT_ERROR);
        }
      }
    });
  }
}
