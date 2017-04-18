/**
 * Only update the state if the parameter in the action has a value other than
 * undefined.
 * @param {Object} action redux passed action
 * @param {Object} state redux passed state
 * @returns {Object} if an action param is present, else use existing state
 */
function useActionElseState(action, state) {
  const obj = {};

  Object.entries(action).forEach(([key, value]) => {
    if (typeof value !== 'undefined') {
      obj[key] = value;
    } else {
      obj[key] = state[key];
    }
  });

  return obj;
}

export default useActionElseState;
