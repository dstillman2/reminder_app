import { expect } from 'chai';
import sinon from 'sinon';

import '../lib/test_utils/ajax.globals';
import { Login } from '../views/components/pages/login';
import Textbox from '../views/components/form_fields/textbox';

import render from '../lib/test_utils/component.setup';

const props = {
  dispatch: sinon.spy(),
};

const LoginComponent = render(props, Login).shallowComponent;
/**
 * 1. Two textfields present on page: username && password
 * 2. Checks for forgot password link
 * 3. Checks for sign up link
 * 4. Check for presence of logo (search for .login-box-logo)
 */
describe('<Login />', () => {
  it('verify existence of 2 text fields', () => {
    expect(LoginComponent.find(Textbox)).to.have.length(2);
  });

  it('renders forgot password link', () => {
    const forgotPwText = LoginComponent
      .find('.login-forgot-password-link')
      .contains('Forgot Password');

    expect(forgotPwText).to.equal(true);
  });

  it('renders a sign up link', () => {
    expect(LoginComponent.find('a').text()).to.equal('Sign up here.');
  });

  it('has a logo', () => {
    expect(LoginComponent.find('.login-box-logo')).to.have.length(1);
  });
});
