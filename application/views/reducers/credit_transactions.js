/**
 * Credit transactions reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function creditTransactions(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_CREDIT_TRANSACTIONS':
      return Object.assign({}, state, {
        data: action.data,
        count: action.count,
        error: action.error,
      });

    default:
      return state;
  }
}

export default creditTransactions;
