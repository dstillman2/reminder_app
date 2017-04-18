import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import Textbox from '../form_fields/textbox';
import ajax from '../common/ajax';

const ERROR_MESSAGE = 'There was an error with your request. Please reset your password again.';

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onSubmit = this.onSubmit.bind(this);
    this.ajaxResetPassword = this.ajaxResetPassword.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    const fields = {
      password: this.refs.password.getValue(),
      token: window.location.href.split('?token=')[1]
    };

    if (this.verifyValidFields(fields)) {
      this.ajaxResetPassword(fields);
    }
  }

  verifyValidFields(fields) {
    if (!fields.password) {
      this.setState({
        error_message: 'A new password is required.',
      });

      return false;
    }

    return true;
  }

  ajaxResetPassword({ password, token }) {
    const params = {
      api: 'web',
      path: '/reset_password',
      method: 'POST',
      data: { password, token },
      successCallback: () => {
        browserHistory.push('/login?flag=reset_password_success');
      },
      errorCallback: () => {
        this.setState({
          errorMessage: ERROR_MESSAGE,
        });
      },
    };

    ajax(params);
  }

  render() {
    return (
      <div>
        <div className="login">
          <form onSubmit={this.onSubmit}>
            <div className="login-box">
              <center>
                <div className="login-box-logo" />
              </center>
              <div className="login-error-message text-center">
                {this.state.errorMessage}
              </div>
              <Textbox
                ref="password"
                inputType="password"
                placeholder="New Password"
              />
              <button
                onClick={this.onSubmit}
                className="btn btn-primary btn-styling login"
              >
                Change Password
              </button>
              <hr />
              <p className="text-center">
                <b><Link to="login">Back to Login Page</Link></b>
              </p>
              <div className="clearfix" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
