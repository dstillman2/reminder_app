/**
 * Login reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function login(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_LOGIN_STATUS':
      return Object.assign({}, state, {
        loggedIn: action.loggedIn,
        loginAttempts: action.loginAttempts,
        failedLogout: action.failedLogout,
        error: action.error,
      });

    case 'FAILED_ACCOUNT_CREATION':
      return Object.assign({}, state, {
        createdAccount: false,
        failedAccountCreation: true,
        error: action.error,
      });

    case 'CREATED_NEW_ACCOUNT':
      return Object.assign({}, state, {
        createdAccount: true,
        failedAccountCreation: false,
        error: action.error,
      });

    default:
      return state;
  }
}

export default login;
