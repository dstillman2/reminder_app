import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Textbox from '../form_fields/textbox';
import Modal from '../framework/modal_full';
import Embed from '../sub_pages/embed';
import validateFieldsAndReturnValues from '../common/verifyValidFields';
import { login } from '../../actions/login';
import button from '../widgets/button';

const $ = window.$;

/**
 * Login component
 */
export class Login extends Component {
  /**
   * Set bindings and initial state
   */
  constructor(props) {
    super(props);

    this.state = {};

    this.onSubmit = this.onSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  /**
   * If the url points to sign up, open the sign up modal else, focus
   * the username form field.
   * @returns {void}
   */
  componentDidMount() {
    if (window.location.href.split('#')[1] === 'sign_up') {
      this.openModal();
    } else {
      this.username.focus();
    }
  }

  /**
   * Ajax request to validate credentials
   * @param {Object} e event object
   * @returns {void}
   */
  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    const fields = {
      username: 'No email address was provided.',
      password: 'No password was provided.',
    };

    const data = validateFieldsAndReturnValues.call(this, fields);

    if (data) {
      this.setState({ loading: true });

      this.props.dispatch(login({
        data,
        onSuccess: () => { window.location.href = '/dashboard'; },
        onFailure: () => {
          this.setState({
            errorMessage: 'The email address / password is incorrect.',
            showLoader: false,
            loading: false,
          });

          this.password.clearField();
        },
      }));
    }
  }

  /**
   * Opens the modal
   * @param {Object} e event object
   * @returns {void}
   */
  openModal(e) {
    e.preventDefault();

    this.modal.openModal(() => {
      $('#country').focus();
    });
  }

  /**
   * React render method
   * @returns {Object} jsx
   */
  render() {
    return (
      <div className="login-form">
        <form onSubmit={this.onSubmit}>
          <div className="login-box">
            <div className="login-box-logo" />
            <div className="login-error-message text-center">
              {this.state.errorMessage}
            </div>
            <Textbox ref={(c) => { this.username = c; }} placeholder="Email Address" />
            <Textbox ref={(c) => { this.password = c; }} inputType="password" placeholder="Password" />
            {
              button({
                buttonName: 'Sign In',
                fullWidth: true,
                isLoading: this.state.loading,
                onClick: this.onSubmit,
              })
            }
            <div className="login-forgot-password-link">
              <Link to="/forgot_password">Forgot Password</Link>
            </div>
            <hr />
            <div className="text-center">
              Need an Account?&nbsp;
              <b>
                <a
                  href="#openModal"
                  onClick={this.openModal}
                >
                   Sign up here.
                </a>
              </b>
            </div>
          </div>
        </form>
        <Modal ref={(c) => { this.modal = c; }} content={<Embed {...this.props} />} />
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default connect(state => state.login)(Login);
