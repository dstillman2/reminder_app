import express from 'express';

import * as handlers from './handlers';
import middleware from './middleware';
import registerHandlers from './lib/express/register_handlers';
import { PORT } from './options';

const app = express();

middleware(app);

const routes = [
  ['/accounts', handlers.accountsHandler],
  ['/users', handlers.userHandler],
  ['/users/password', handlers.userPasswordHandler],
  ['/phone-numbers', handlers.phoneNumbersHandler],
  ['/phone-numbers/twilio/:id?', handlers.phoneNumbersTwilioHandler],
  ['/billing', handlers.billingHandler],
  ['/demo', handlers.demoHandler],
  ['/forgot_password', handlers.forgotPasswordHandler],
  ['/sign-up', handlers.signUpHandler],
  ['/reset_password', handlers.resetPasswordHandler],
  ['/login', handlers.loginHandler],
  ['/logout', handlers.logoutHandler],
  ['*', handlers.indexHandler],
];

registerHandlers(app, routes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
