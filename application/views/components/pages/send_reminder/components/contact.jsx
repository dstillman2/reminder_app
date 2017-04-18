import React, { Component } from 'react';

import TextBox from '../../../form_fields/textbox';
import Static from '../../../form_fields/static';

import { updateEvent } from '../../../../actions/events';

import validateFieldsAndReturnValues from '../../../common/verifyValidFields';

class ContactsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getValues = this.getValues.bind(this);
  }

  getValues() {
    const fields = {
      firstName: false,
      lastName: false,
      phoneNumber: 'A phone number is required.',
    };

    const data = validateFieldsAndReturnValues.call(this, fields);

    if (data) {
      this.props.dispatch(updateEvent(data));

      return true;
    }

    return false;
  }

  render() {
    let renderComponent, error;

    if (this.state.errorMessage) {
      error = (
        <div className="login-error-message">
          {this.state.errorMessage}
        </div>
      );
    }

    renderComponent = (
      <div>
        <div className="row">
          <div className="col-sm-6">
            <TextBox
              ref={(c) => { this.firstName = c; }}
              label="First Name"
              defaultValue={this.props.events.firstName}
              placeholder="First Name" />
          </div>
          <div className="col-sm-6">
            <TextBox
              ref={(c) => { this.lastName = c; }}
              label="Last Name"
              defaultValue={this.props.events.lastName}
              placeholder="Last Name" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <TextBox
              ref={(c) => { this.phoneNumber = c; }}
              label="Phone Number *"
              custom="phone"
              maxLength="50"
              type="number"
              defaultValue={this.props.events.phoneNumber}
              placeholder="Phone Number" />
          </div>
        </div>
      </div>
    );

    if (!this.props.isEditPanel) {
      renderComponent = (
        <div className="row">
          <div className="col-xs-12">
            {
              this.props.events.firstName ? (
                <Static label="First Name"
                        text={this.props.events.firstName} />
              ) : null
            }
            {
              this.props.events.lastName ? (
                <Static label="Last Name"
                        text={this.props.events.lastName}/>
              ) : null
            }
            <Static label="Phone Number"
                    text={phoneFormatting(this.props.events.phoneNumber)} />
          </div>
        </div>
      );
    }

    return (
      <div>
        {error}
        {renderComponent}
      </div>
    );
  }
}

export default ContactsPanel;

const phoneFormatting = (value = '') => {
  let digits = [];

  // ^ matches everything not enclosed in the bracket
  digits = value.replace(/[^0-9]/g, '').split('');

  if (digits[0] !== '1') {
    digits.unshift('1');
  }

  const len = digits.length;

  const phoneNumber = [];
  let firstDigit = false;

  digits.forEach((digit, index) => {
    phoneNumber.push(digit);

    if (index === 0 && digit === 1 && len > 1) {
      firstDigit = true;
      phoneNumber.push('-');
    }

    if ((index === 2 && firstDigit === false && len > 3) ||
        (index === 3 && firstDigit === true && len > 4) ||
        (index === 5 && firstDigit === false && len > 6) ||
        (index === 6 && firstDigit === true && len > 7)) {
      phoneNumber.push('-');
    }
  });

  return phoneNumber.join('');
};
