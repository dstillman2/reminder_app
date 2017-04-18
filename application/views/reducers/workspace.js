/**
 * Workspace reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function workspace(state = {}, action) {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return Object.assign({}, state, {
        title: action.title,
      });

    case 'ADD_LINK':
      return Object.assign({}, state, {
        linkTo: action.linkTo,
      });

    case 'REMOVE_LINK_TO':
      return Object.assign({}, state, {
        linkTo: null,
      });

    default:
      return state;
  }
}

export default workspace;
