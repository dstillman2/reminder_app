import React, { Component } from 'react';

import Static from '../../../form_fields/static';

import { updateEvent } from '../../../../actions/events';

import validateFieldsAndReturnValues from '../../../common/verifyValidFields';

class ReminderTypePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.events.reminderType
    };
  }

  componentDidMount() {
    const reminderType = this.props.events.reminderType;
    // If a value has been specified previously and the user is wanting to change
    // the reminder type, highlight the appropriate message type
    if (this.props.isEditPanel) {
      if (reminderType === 'text') {
        $(this.refs.text_reminder).addClass('selected');
      } else if (reminderType === 'phone') {
        $(this.refs.phone_reminder).addClass('selected');
      }
    }
  }

  getValues() {
    if (!this.state.selected) {
      this.setState({
        errorMessage: 'Please select a reminder type.'
      });

      return false;
    }

    this.props.dispatch(
      updateEvent({ reminderType: this.state.selected })
    );

    return true;
  }

  render() {
    let error, renderComponent;

    if (this.state.errorMessage) {
      error = (
        <div className="login-error-message">
          {this.state.errorMessage}
        </div>
      );
    }

    if (this.props.isEditPanel) {
      renderComponent = (
        <div style={{minWidth: 250}}>
          <button ref="text_reminder"
               className="col-xs-4 reminder-type"
               style={{ border: 0}}
               onClick={e => {
                 this.setState({ selected: 'text' });

                 $(this.refs.text_reminder).addClass('selected');
                 $(this.refs.phone_reminder).removeClass('selected');
               }}>
            <div className="glyphicon glyphicon-comment text-center" />
            <div className="text-center" style={{ fontSize: 16, marginTop: 10 }}>
              Text
            </div>
          </button>
          <button
            ref="phone_reminder"
            className="col-xs-4 reminder-type" style={{ marginLeft: 10, border: 0 }}
            onClick={() => {
              this.setState({ selected: 'phone' });

              $(this.refs.phone_reminder).addClass('selected');
              $(this.refs.text_reminder).removeClass('selected');
            }}
          >
            <div className="glyphicon glyphicon-phone text-center"></div>
            <div className="text-center" style={{ fontSize: 16, marginTop: 10 }}>
              Phone
            </div>
          </button>
          <div className="clearfix" />
        </div>
      )
    }

    if (!this.props.isEditPanel) {
      const reminderType = this.props.events.reminderType;

      const mapReminderMessage = {
        text: 'Text Reminder',
        phone: 'Phone Reminder'
      };

      renderComponent = (
        <div className="row">
          <div className="col-xs-12">
            <Static
              label="Reminder Type"
              text={mapReminderMessage[reminderType]}
            />
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

export default ReminderTypePanel;
