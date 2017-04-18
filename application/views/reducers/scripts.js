/**
 * Scripts reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function scripts(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_SCRIPTS_STATE':
      return Object.assign({}, state, {
        phoneScript: action.phoneScript || state.phoneScript,
        textScript: action.textScript || state.textScript,
        scripts: action.scripts || state.scripts,
        script: action.script || state.script,
        count: action.count || state.count,
        error: action.error,
      });

    case 'RESET_SCRIPTS_STATE':
      return {};

    default:
      return state;
  }
}

export default scripts;
