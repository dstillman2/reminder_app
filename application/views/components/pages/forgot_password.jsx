import React, { Component } from 'react';
import { Link } from 'react-router';

import Textbox from '../form_fields/textbox';
import ajax from '../common/ajax';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onSubmit = this.onSubmit.bind(this);
    this.ajaxForgotPasswordRequest = this.ajaxForgotPasswordRequest.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    const fields = {
      emailAddress: this.refs.email_address.getValue(),
    };

    if (this.verifyValidFields(fields)) {
      this.ajaxForgotPasswordRequest(fields);
    }
  }

  verifyValidFields(fields) {
    if (!fields.emailAddress) {
      this.setState({
        error_message: 'No email address was provided.',
      });

      return false;
    }

    return true;
  }

  ajaxForgotPasswordRequest({ emailAddress }) {
    const self = this;

    const params = {
      api: 'web',
      path: '/forgot_password',
      method: 'POST',
      data: {emailAddress},
      successCallback (response) {
        self.setState({
          success_message: 'Please check your email.'
        });
      },
      errorCallback (error) {
        self.setState({
          error_message: 'There was an error with this request.'
        });

        self.refs.email_address.clearField();
      }
    }

    ajax(params);
  }

  render() {
    if (this.state.success_message) {
      return (
        <div className="login-form">
          <div className="login-box">
            <center>
              <div className="login-box-logo" />
            </center>
            <div className="login-error-message text-center" style={{ color: '#000' }}>
              {this.state.success_message}
            </div>
            <hr />
            <p className="text-center">
              <b><Link to="login">Back to Login Page</Link></b>
            </p>
            <div className="clearfix" />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="login-form">
          <form onSubmit={this.onSubmit}>
            <div className="login-box">
              <center>
                <div className="login-box-logo" />
              </center>
              <div className="login-error-message text-center">
                {this.state.error_message}
              </div>
              <Textbox
                ref="email_address"
                placeholder="Email Address"
              />
              <button
                onClick={this.onSubmit}
                className="btn btn-primary btn-styling login"
              >
                Reset Password
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
