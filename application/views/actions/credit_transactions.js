import sendAjaxRequest from '../components/common/ajax';

export const updateCreditTransactions = data => (
  {
    type: 'UPDATE_CREDIT_TRANSACTIONS',
    data: data.data,
    error: data.error,
    count: data.count,
    pagination: 1,
  }
);

export const changeCreditTransactionsPage = ({ pageId }) => (
  {
    type: 'CHANGE_CREDIT_TRANSACTIONS_PAGE',
    pagiation: pageId,
  }
);

const ERROR_FETCH_CREDIT_TRANSACTIONS = 'Error fetching credit transactions. Please try again.';

export const fetchCreditTransactions = (obj) => {
  if (typeof obj === 'object') {
    var { data, onSuccess, onFailure, onComplete } = obj;
  }

  return (dispatch) => {
    sendAjaxRequest({
      api: 'web',
      path: '/billing',
      method: 'GET',
      data,
      successCallback: (response) => {
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        }

        dispatch(updateCreditTransactions({
          data: response.data,
          count: response.count,
        }));
      },
      errorCallback: (error) => {
        if (typeof onFailure === 'function') {
          onFailure(ERROR_FETCH_CREDIT_TRANSACTIONS);
        }

        dispatch(updateCreditTransactions({
          data: [],
        }));
      },
      completeCallback: () => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      },
    });
  };
};
