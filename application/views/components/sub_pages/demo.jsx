import React from 'react';
import { connect } from 'react-redux';

import DropDown from '../form_fields/dropdown';
import TextBox from '../form_fields/textbox';
import Button from '../widgets/button_new';
import { createDemoEvent } from '../../actions/events';

/**
 * DemoReminder
 */
class DemoReminder extends React.Component {
  /**
   * set initial state
   */
  constructor() {
    super();

    this.state = {
      panel: 1,
    };
  }

  onSendReminder() {
    const phoneNumber = this.phoneNumber.getValue();
    const reminderType = this.reminderTypes.getValue();

    if (!(phoneNumber && reminderType)) {
      return this.setState({
        errorMessage: 'A phone number is required.',
      });
    }

    const data = {
      type: reminderType,
      targets: JSON.stringify([
        {
          phone_number: phoneNumber,
        },
      ]),
    };

    this.props.dispatch(createDemoEvent({
      data,
      authorization: false,
      onSuccess: () => { this.setState({ panel: 2 }); },
      onFailure: () => { this.setState({ panel: 3 }); },
      onComplete: () => { this.setState({ isLoading: false }); },
    }));

    this.setState({ errorMessage: null, isLoading: true });
  }

  render() {
    const DemoPanel = (
      <div style={{ marginTop: 35 }}>
        <div className="col-xs-12">
        {
          this.state.errorMessage && (
            <div className="login-error-message text-center">
              <b>{this.state.errorMessage}</b>
            </div>
          )
        }
        <DropDown
          ref={(c) => this.reminderTypes = c}
          options={reminderTypes()}
          label="Reminder Type"
        />
        <TextBox
          ref={(c) => this.phoneNumber = c}
          label="Phone Number *"
          placeholder="Phone Number"
        />
        </div>
        <div className="col-xs-12">
        <hr style={{ margin: '5px 0 15px 0' }} />
        <Button
          name="Send Reminder"
          fullWidth="true"
          onClick={() => this.onSendReminder()}
          isLoading={this.state.isLoading}
        />
        </div>
      </div>
    );

    const SuccessPanel = (
      <div style={{ marginTop: 35 }}>
        <div className="col-xs-12">
          <div style={{ marginBottom: 25 }}>
            A reminder has been sent to the specified phone number.
          </div>
          <button
            className="btn btn-default btn-styling login"
            style={{ height: '15px 0' }}
            onClick={() => this.setState({ panel: 1 })}
          >
            Back
          </button>
        </div>
      </div>
    );

    const FailedPanel = (
      <div style={{ marginTop: 35 }}>
        <div className="col-xs-12">
          <div style={{ marginBottom: 20 }}>
            Please create an account to send additional appointment reminders.
          </div>
          <button
            className="btn btn-primary btn-styling login"
            style={{ height: '15px 0' }}
            onClick={() => { top.location.href = 'https://app.cloudbroadcast.com/login#sign_up'; }}
          >
            Create an Account
          </button>
        </div>
      </div>
    );

    return (
      <div id="demo-reminder">
        <div className="row">
          {this.state.panel === 1 ? DemoPanel : null}
          {this.state.panel === 2 ? SuccessPanel : null}
          {this.state.panel === 3 ? FailedPanel : null}
        </div>
      </div>
    );
  }
}

const reminderTypes = () => {
  const options = [
    {
      label: 'Text Reminder',
      value: 'text',
    },
    {
      label: 'Phone Reminder',
      value: 'phone',
    },
  ];

  return options;
};

export default connect()(DemoReminder);
