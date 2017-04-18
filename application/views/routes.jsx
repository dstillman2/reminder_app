import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { polyfill } from 'es6-object-assign';

import Workspace from './components/framework/workspace';
import Login from './components/pages/login';
import ForgotPassword from './components/pages/forgot_password';
import ResetPassword from './components/pages/reset_password';
import CreditPurchases from './components/pages/purchases';
import Settings from './components/pages/settings';
import PhoneNumbers from './components/pages/phone_numbers';
import Dashboard from './components/pages/dashboard';
import CustomizeText from './components/pages/customize_text';
import CustomizePhone from './components/pages/customize_phone';
import ReminderCreate from './components/pages/send_reminder/create';
import AvailableNumbers from './components/pages/available_numbers';
import TransactionHistory from './components/pages/transaction_history';

import rootReducer from './reducers/_base';

polyfill();

const routes = (
  <Router history={browserHistory}>
    <Route path="login" component={Login} />
    <Route path="forgot_password" component={ForgotPassword} />
    <Route path="forgot_password/reset" component={ResetPassword} />
    <Route path="/" component={Workspace}>
      <IndexRedirect to="/login" />
      <Route path="dashboard" component={Dashboard} />
      <Route path="dashboard/:pageId" component={Dashboard} />
      <Route path="settings" component={Settings} />
      <Route path="phone_numbers" component={PhoneNumbers} />
      <Route path="phone_numbers/available" component={AvailableNumbers} />
      <Route path="phone_numbers/:pageId" component={PhoneNumbers} />
      <Route path="credits/purchase" component={CreditPurchases} />
      <Route path="credits/transaction_history" component={TransactionHistory} />
      <Route path="credits/transaction_history/:pageId" component={TransactionHistory} />
      <Route path="reminders/customize/text" component={CustomizeText} />
      <Route path="reminders/customize/phone" component={CustomizePhone} />
      <Route path="reminders/schedule" component={ReminderCreate} />
      <Redirect from="*" to="/dashboard" />
    </Route>
  </Router>
);

if (typeof window !== 'undefined') {
  const store = createStore(rootReducer, window.reduxInitialStore || {}, applyMiddleware(thunk));

  render(
    <Provider store={store}>
      {routes}
    </Provider>,
    document.getElementById('app'));
}

const middleware = applyMiddleware(thunk);

export { rootReducer, routes, middleware };
