import React, { Component } from 'react';

import DropDown from '../../../form_fields/dropdown';
import Static from '../../../form_fields/static';

import { updateEvent } from '../../../../actions/events';

import validateFieldsAndReturnValues from '../../../common/verifyValidFields';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getValues = this.getValues.bind(this);
  }

  getValues() {
    const fields = {
      daysPrior: 'Days prior is a required field',
      timeHours: 'Hour is a required field',
      timeAmPm: 'Am Pm is a required field'
    };

    const data = validateFieldsAndReturnValues.call(this, fields);

    if (data) {
      this.props.dispatch(updateEvent(data));

      return true;
    }

    return false;
  }

  render() {
    let renderComponent;
    let error = null;

    if (this.props.isEditPanel) {
      renderComponent = (
        <div>
          <div className="row">
            <div className="col-sm-8">
              <DropDown
                ref={(c) => { this.daysPrior = c; }}
                label="When do you want to send the reminder?"
                defaultValue={this.props.events.daysPrior || 1}
                options={generateDaysPrior()} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <DropDown
                ref={(c) => { this.timeHours = c; }}
                label="What time?"
                defaultValue={this.props.events.timeHours || '11'}
                options={generateHours()} />
            </div>
            <div className="col-xs-4">
              <DropDown
                ref={(c) => { this.timeAmPm = c; }}
                label="&nbsp;"
                defaultValue={this.props.events.timeAmPm || 'AM'}
                options={generateAmPm()} />
            </div>
          </div>
        </div>
      );

      if (this.state.errorMessage) {
        error = (
          <div className="login-error-message">
            {this.state.errorMessage}
          </div>
        );
      }
    } else {
      renderComponent = (
        <div className="row">
          <div className="col-xs-12">
            <Static
              label="Days Prior"
              text={this.props.events.daysPrior + ' day(s) prior to the appointment'}
            />
            <Static
              label="Time"
              text={this.props.events.timeHours + ' ' + this.props.events.timeAmPm}
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

function generateDaysPrior() {
  const obj = [];

  for (let i = 1; i <= 7; i++) {
    obj.push({
      label: `${i} Day(s) Prior to the Appointment`,
      value: i,
    });
  }

  return obj;
}

function generateHours() {
  const obj = [];

  for (let i = 1; i <= 12; i++) {
    obj.push({
      label: i,
      value: i,
    });
  }

  return obj;
}

function generateAmPm() {
  const obj = [];

  obj.push({
    label: 'AM',
    value: 'AM',
  });

  obj.push({
    label: 'PM',
    value: 'PM',
  });

  return obj;
}

export default Settings;
