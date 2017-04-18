import React, { Component } from 'react';

import Dropdown from '../../../form_fields/dropdown';
import Static from '../../../form_fields/static';

import { updateEvent } from '../../../../actions/events';

import validateFieldsAndReturnValues from '../../../common/verifyValidFields';

const NO_CALLER_IDS = "You have no Caller Id's - a random caller ID will be used.";

class CallerIDPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getValues = this.getValues.bind(this);
  }

  getValues() {
    if (this.props.phoneNumbers.count === 0) {
      return true;
    }

    const fields = {
      callerId: 'Error: A caller id is required.'
    };

    const data = validateFieldsAndReturnValues.call(this, fields);

    if (data) {
      this.props.dispatch(updateEvent(data));

      return true;
    }

    return false;
  }

  render() {
    const phoneNumbersCount = this.props.phoneNumbers.count;

    if (typeof phoneNumbersCount == 'undefined') {
      return <div/>;
    }

    const phoneNumbersData = this.props.phoneNumbers.data;
    const callerId = this.props.events.callerId;
    const options = processPhoneNumberInput(phoneNumbersData);

    let renderComponent, error, phoneNumber;

    if (this.state.errorMessage) {
      error = (
        <div className="login-error-message">
          { this.state.errorMessage }
        </div>
      );
    }

    if (this.props.isEditPanel) {
      if (options.length === 0) {
        renderComponent = (
          <div>
            Please add a caller ID to your account.
          </div>
        );
      } else {
        renderComponent = (
          <Dropdown
            ref={(c) => { this.callerId = c; }}
            defaultValue={ this.props.callerId }
            options={ options }
            label="Caller ID*"
          />
        );
      }
    }

    if (!this.props.isEditPanel) {
      if (callerId) {
        phoneNumber = lookUpPhoneNumberFromId(callerId, phoneNumbersData);
      }

      renderComponent = (
        <div className="row">
          <div className="col-xs-12">
            <Static
              label="Caller ID"
              text={phoneNumber || NO_CALLER_IDS}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        { error }
        { renderComponent }
      </div>
    );
  }
}

function processPhoneNumberInput(data = []) {
  const options = [];

  data.forEach((item) => {
    options.push({
      label: item.friendly_name,
      value: item.id,
    });
  });

  return options;
}

function lookUpPhoneNumberFromId (id, data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i].friendly_name;
    }
  }

  return null;
}

export default CallerIDPanel;
