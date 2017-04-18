import useActionElseState from '../../lib/reducers/useActionElseState';

/**
 * Events reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
const events = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_EVENT':
      return Object.assign({}, state, useActionElseState(action, state));

    case 'RESET_EVENT':
      return {};

    default:
      return state;
  }
};

export default events;
