/**
 * Phone number reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function updatePhoneNumbers(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_PHONE_NUMBERS':
      return Object.assign({}, state, {
        data: action.data,
        count: action.count,
        error: action.error,
      });

    case 'UPDATE_AVAILABLE_PHONE_NUMBERS':
      return Object.assign({}, state, {
        availableNumbers: {
          data: action.data,
          count: action.count,
          error: action.error,
        },
      });

    default:
      return state;
  }
}

export default updatePhoneNumbers;
