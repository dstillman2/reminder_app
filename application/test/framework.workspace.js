import React from 'react';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Workspace from '../views/components/framework/workspace';
import Dashboard from '../views/components/pages/dashboard';
import rootReducer from '../views/reducers/_base';

import '../lib/test_utils/ajax.globals';
import render from '../lib/test_utils/component.setup';

const props = {
  store: createStore(rootReducer, {}, applyMiddleware(thunk)),
};

const child = React.createElement(
  Workspace,
  {},
  React.createElement(Dashboard, {}, null),
);

const ProviderComponent = (
  render(props, Provider, child).mountComponent
);

describe('<Workspace />', () => {
  it('check title name', () => {
    const title = ProviderComponent.find('.header-title-name').text();

    expect(title).to.equal('Dashboard');
  });
});
