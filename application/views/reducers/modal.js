/**
 * Modal reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function modal(state = {}, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return Object.assign({}, state, {
        isVisible: true,
        title: action.title || state.title,
        content: action.content || state.content,
        footer: action.footer || state.footer,
        schema: action.schema || state.schema,
      });

    case 'CLOSE_MODAL':
      return Object.assign({}, state, {
        isVisible: false,
        schema: {
          title: '',
          content: [],
          footer: [],
          ajax: {},
        },
        title: null,
        content: null,
        footer: null,
        loading: false,
        errorMessage: '',
      });

    default:
      return state;
  }
}

export default modal;
