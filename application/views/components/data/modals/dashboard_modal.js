import React from 'react';

import Static from '../../form_fields/static.jsx';
import { closeModal } from '../../../actions/modal';
import { fetchEvents, deleteEvent } from '../../../actions/events';

export default function modalDashboard(params={}, userInfo={}, dispatch) {
  const timeZone = userInfo.time_zone;

  const title = 'Reminder Details';

  const obj = {
    title,
    content: (
      <center>
        {
          params.errorMessageModal ? (
            <div className="login-error-message">
              <b>Error:</b> {params.errorMessageModal}
            </div>
          ): null
        }
        <Static label="Caller ID"
                text={params.phone_number ? params.phone_number.friendly_name : 'None'} />
        <Static label="Contacts"
                text={processTargets(params.targets)} />
        <Static label="Appointment Time"
                text={moment.tz(params.appointment_time * 1000, timeZone)
                                   .format('MMM Do, h:mm a')} />
        <Static label="Send Time"
                text={moment.tz(params.send_time * 1000, timeZone)
                                   .format('MMM Do, h:mm a')} />
        <Static label="Message Type"
                text={typeMapping(params.type) || params.type} />
        <Static label="Status"
                text={typeMapping(params.status) || params.status} />
      </center>
    ),
    footer: [
      <button key="footer-close"
              className="btn btn-default btn-styling"
              style={{marginRight: '5px'}}
              onClick={() => this.props.dispatch(closeModal())}>
              Close
      </button>
    ]
  }

  if (params.status === 'pending') {
    obj.footer.push(
      <button key="footer-delete"
              className="btn btn-primary btn-styling"
              style={{marginRight: '5px'}}
              onClick={() => onDeleteEvent()}>
              Delete Reminder
      </button>
    );
  }

  const onDeleteEvent = () => {
    this.props.dispatch(
      deleteEvent({
        eventId: params.id,
        onSuccess: () => {
          this.setState({ errorMessage: null });

          this.props.dispatch(fetchEvents({
            onSuccess: () => this.props.dispatch(closeModal())
          }));
        },
        onFailure: error => {
          this.setState({ errorMessageModal: error });
          this.onRowClick(params.id);
        }
      })
    );
  };

  return obj;
}

function processTargets(targets) {
  const targetsParsed = JSON.parse(targets);
  const target = targetsParsed[0];
  let str = '';

  if (target.first_name) {
    str += target.first_name + ' ';
  }

  if (target.last_name) {
    str += target.last_name + ' ';
  }

  str += target.phone_number;


  return str;
}

function typeMapping(param) {
  const obj = {
    'complete': 'Completed',
    'failed': 'Failed',
    'pending': 'Pending',
    'text': 'Text Reminder',
    'phone': 'Phone Reminder'
  }

  return obj[param];
}
