import { combineReducers } from 'redux';

import workspace from './workspace';
import modal from './modal';
import userInfo from './userInfo';
import phoneNumbers from './phone_numbers';
import login from './login';
import creditTransactions from './credit_transactions';
import events from './events';
import scripts from './scripts';


export default combineReducers({
  workspace,
  modal,
  userInfo,
  phoneNumbers,
  login,
  creditTransactions,
  events,
  scripts,
});
