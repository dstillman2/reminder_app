import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { changeTitle } from '../../../actions/workspace';
import { createEvent } from '../../../actions/events';

import createButton from '../../widgets/button';

import Panel1 from './components/caller_id';
import Panel2 from './components/reminder_type';
import Panel3 from './components/contact';
import Panel4 from './components/appointment_time';
import Panel5 from './components/settings';

import sendTimeCalculation from '../../../../lib/create_reminder/send_time_conversion';

/**
 * Create reminder component
 */
class CreateReminder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      panel: 1,
      completedPanels: {}
    }
  }

  componentWillMount() {
    this.props.dispatch(changeTitle('Schedule an Appointment Reminder'));
  }

  componentWillReceiveProps(nextProps) {
    // If the user has no usable phone numbers to be used as a caller ID, skip
    // panel 1.
    if (this.state.panel === 1 && this.props.phoneNumbers.count < 1) {
      this.setState({
        panel: 2,
        completedPanels: { 1: true }
      });
    }
  }

  verifyValidValuesAndPushToState() {
    return this.refs['step' + this.state.panel].getValues();
  }

  onCreateEvent() {
    const event = this.props.events;

    const data = {
      send_time: sendTimeCalculation({
          appointmentTime: event.appointmentTimeISO8601,
          hour: Number(event.timeHours),
          ampm: event.timeAmPm,
          daysPrior: Number(event.daysPrior),
          timeZone: this.props.userInfo.time_zone
        }).unix(),
      appointment_time: moment(event.appointmentTimeISO8601).unix(),
      caller_id: event.callerId,
      targets: JSON.stringify([
        {
          first_name: event.firstName,
          last_name: event.lastName,
          phone_number: event.phoneNumber
        }
      ]),
      type: event.reminderType,
    }

    this.setState({ loading: true });

    this.props.dispatch(createEvent({
      data: data,
      onSuccess: () => browserHistory.push('/dashboard'),
      onFailure: error => {
        this.setState({ errorCreateEvent: error });
        this.setState({ loading: false });
      }
    }));
  }

  onClickUpdate(obj) {
    if (this.verifyValidValuesAndPushToState()) {
      let panelNumber = this.state.panel + 1;

      // Mark the panels that the user already filled out
      let completedPanels = this.state.completedPanels;
      completedPanels[obj.id] = true;

      while (completedPanels[panelNumber]) {
        panelNumber++;
      }

      this.setState({
        panel: panelNumber,
        completedPanels: completedPanels,
        isEditButtonClicked: false
      });
    }
  }

  onClickEdit(obj) {
    this.setState({
      panel: obj.id,
      isEditButtonClicked: true,
      errorCreateEvent: null
    });
  }

  render() {
    let unit, completedPanels;

    unit = obj => {
      return (
        <div className="unit">
          <div className="row">
            <div className="col-sm-12">
              <h5 style={{display: 'inline'}}>{obj.heading}</h5>
              {
                (this.state.panel !== obj.id) && this.state.completedPanels[obj.id] && (
                  <span className="pull-right">
                    <button
                      onClick={() => this.onClickEdit(obj)}
                      className="btn btn-info btn-styling sm">
                      edit
                    </button>
                  </span>
                )
              }
            </div>
          </div>
          <div className="row">
          {
            this.state.panel === obj.id && (
              <div className="col-sm-12 col-md-9" style={{marginTop: 15}}>
                {obj.panelOpen}
                <button className="btn btn-primary btn-styling"
                        style={{float: 'right', marginTop: 10}}
                        onClick={() => this.onClickUpdate(obj)}>
                  {this.state.isEditButtonClicked ? 'Update' : obj.buttonText}
                </button>
              </div>
            )
          }
          {
            this.state.panel !== obj.id && this.state.completedPanels[obj.id] && (
              <div className="col-sm-12">
                {obj.panelClosed}
              </div>
            )
          }
          </div>
          <div className="row">
            <div className="col-sm-12">
              <hr/>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="form-contents">
        {
          unit({
            id: 1,
            heading: 'Step 1: Select a Caller ID',
            panelOpen: <Panel1 ref="step1" {...this.props} isEditPanel={true} />,
            panelClosed: <Panel1 ref="step1" {...this.props} />,
            buttonText: 'Next Step',
          })
        }
        {
          unit({
            id: 2,
            heading: 'Step 2: Select a Reminder Type',
            panelOpen: <Panel2 ref="step2" {...this.props} isEditPanel={true} />,
            panelClosed: <Panel2 ref="step2" {...this.props} />,
            buttonText: 'Next Step',
          })
        }
        {
          unit({
            id: 3,
            heading: 'Step 3: Enter Contact Details',
            panelOpen: <Panel3 ref="step3" {...this.props} isEditPanel={true} />,
            panelClosed: <Panel3 ref="step3" {...this.props} />,
            buttonText: 'Next Step',
          })
        }
        {
          unit({
            id: 4,
            heading: 'Step 4: Appointment Time',
            panelOpen: <Panel4 ref="step4" {...this.props} isEditPanel={true} />,
            panelClosed: <Panel4 ref="step4" {...this.props} />,
            buttonText: 'Next Step',
          })
        }
        {
          unit({
            id: 5,
            heading: 'Step 5: Send Time',
            panelOpen: <Panel5 ref="step5" {...this.props} isEditPanel={true} />,
            panelClosed: <Panel5 ref="step5" {...this.props} />,
            buttonText: 'Next Step',
          })
        }
        {
          this.state.panel === 6 && (
            <div className="row">
              <div className="col-md-12">
                <div className="login-error-message">
                  {this.state.errorCreateEvent}
                </div>
              </div>
              <div className="col-md-12">
                {
                  createButton({
                    buttonName: 'Schedule Reminder',
                    onClick: () => this.onCreateEvent(),
                    isLoading: this.state.loading,
                  })
                }
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(state => state)(CreateReminder);
