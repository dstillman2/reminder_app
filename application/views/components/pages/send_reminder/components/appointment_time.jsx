import React, { Component } from 'react';

import DateTimePicker from '../../../form_fields/datetimepicker';
import Static from '../../../form_fields/static';

import { updateEvent } from '../../../../actions/events';

import validateFieldsAndReturnValues from '../../../common/verifyValidFields';

const moment = window.moment;

class AppointmentTime extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getValues = this.getValues.bind(this);
  }

  getValues() {
    const fields = {
      appointmentTimeISO8601: 'Date is a required field',
    };

    const data = validateFieldsAndReturnValues.call(this, fields);

    if (data) {
      this.props.dispatch(updateEvent(data));

      return true;
    }

    return false;
  }

  render() {
    const timeZone = this.props.userInfo.time_zone;

    let renderComponent, error = null;

    if (this.props.isEditPanel) {
      renderComponent = (
        <div className="row">
          <div className="col-sm-8">
            <DateTimePicker
              ref={(c) => { this.appointmentTimeISO8601 = c; }}
              dateTimePicker={this.props.events.appointmentTimeISO8601}
              timeZone={timeZone}
              label="What time is the appointment?"
            />
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
            <Static label="Appointment Time"
                    text={moment(this.props.events.appointmentTimeISO8601)
                              .tz(timeZone)
                              .format('LLLL')} />
            <Static label="Time Zone"
                    text={timeZone} />
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

export default AppointmentTime;
