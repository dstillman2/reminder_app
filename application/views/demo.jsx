import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { polyfill } from 'es6-object-assign';

import Demo from './components/sub_pages/demo';
import rootReducer from './reducers/_base';

polyfill();

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

const component = (
  <Provider store={store}>
    <Demo />
  </Provider>
);

render(component, document.getElementById('app'));
