/**
 * User info reducer
 * @param {Object} state redux state
 * @param {String} action string action
 * @returns {Object} returns new state
 */
function userInfo(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_CREDITS':
      return Object.assign({}, state, {
        credits: action.credits,
      });

    case 'UPDATE_USER':
      return {
        company: action.company || state.company,
        email_address: action.email_address || state.email_address,
        first_name: action.first_name || state.first_name,
        last_name: action.last_name || state.last_name,
        address_1: action.address_1 || state.address_1,
        address_2: (action.address_2 || action.address_2 === '') ? action.address_2 : state.address_2,
        zip_code: action.zip_code || state.zip_code,
        city: action.city || state.city,
        state: action.state || state.state,
        country_code: action.country_code || state.country_code,
        credits: action.credits || state.credits,
        time_zone: action.time_zone || state.time_zone,
      };

    default:
      return state;
  }
}

export default userInfo;
