import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import expressValidator from 'express-validator';
import compression from 'compression';

import logHttpRequests from './log_http_requests';
import favicon from './favicon';
import { COOKIE_SECRET, PRODUCTION } from '../options';

const getPath = (...args) => (
  path.join(__dirname, '../views', 'static', ...args)
);

const staticOptions = {
  etag: false,

  setHeaders: (res) => {
    if (PRODUCTION) {
      res.setHeader('Cache-Control', 'private, max-age=86400');
    }
  },
};

const config = (app) => {
  app.use(compression());

  app.use('/static/css', express.static(getPath('css'), staticOptions));
  app.use('/static/fonts', express.static(getPath('fonts'), staticOptions));
  app.use('/static/img', express.static(getPath('img'), staticOptions));
  app.use('/static/js/vendor', express.static(getPath('js', 'vendor'), staticOptions));
  app.use('/static/js/dist', express.static(getPath('js', 'dist'), staticOptions));

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(expressValidator({
    customValidators: {
      gte: (param, num) => (param.length >= num),
    },
  }));

  app.use(cookieParser(COOKIE_SECRET));

  app.use(helmet());

  if (!PRODUCTION) {
    app.use(logHttpRequests());
  }

  app.use(favicon());

  app.set('view engine', 'jade');
};

export default config;
