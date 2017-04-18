import React, { Component } from 'react';
import { Link } from 'react-router';

import timeZoneData from '../data/time_zone';
import countryData from '../data/countries';
import DropDown from '../form_fields/dropdown.jsx';
import TextArea from '../form_fields/textarea.jsx';
import TextBox from '../form_fields/textbox.jsx';
import { createNewAccount } from '../../actions/ajax';

const TEXT_REMINDER_DEFAULT = `This is {%Company%} reminding {%FirstName%} {%LastName%} of an upcoming appt. on {%Date%} at {%Time%}.`;

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panel: 1,
      percent: '16%',
      config: {},
    };
  }

  changeState({ panel }) {
    const numOfPanels = 4;

    this.setState({
      panel: panel,
      percent: Math.floor(100 / numOfPanels * panel) + '%',
      errorMessage: null
    });
  }

  componentDidMount() {
    this.focusElement();
  }

  componentDidUpdate() {
    this.focusElement();
  }

  render() {
    const PanelTimeZone = index => {
      return (
        <div>
          <h5>Step {index}: Country & Time Zone</h5>
          <hr style={{margin: '10px 0 15px 0'}}/>
          <DropDown
              ref={c => this.country = c}
              id="country"
              defaultValue={this.state.config.countryCode}
              options={countryData()}
              label="Country" />
          <DropDown
              ref={c => this.timeZone = c}
              defaultValue={this.state.config.timeZone}
              options={timeZoneData()}
              label="Time Zone" />
          <hr/>
          <button className="btn btn-primary btn-styling login"
               onClick={() => {
                 const timeZone = this.timeZone.getValue();
                 const countryCode = this.country.getValue();

                 this.changeState({ panel: index + 1 });

                 this.setState({
                   config: Object.assign(this.state.config, { timeZone, countryCode }),
                 });
               }}>
            Next Step
          </button>
        </div>
      );
    };

    const PanelSettings = index => {
      return (
        <div>
          <h5>Step {index}: Your Details</h5>
          <hr style={{margin: '10px 0 15px 0'}}/>
          <div className="login-error-message text-center">
            {this.state.errorMessage}
          </div>
          <TextBox ref={c => this.company = c}
                   defaultValue={this.state.config.company}
                   label="Company *"
                   placeholder="Company or Full Name"/>
          <TextBox ref={c => this.firstName = c}
                   defaultValue={this.state.config.firstName}
                   label="First Name *"
                   placeholder="First Name"/>
          <TextBox ref={c => this.lastName = c}
                   defaultValue={this.state.config.lastName}
                   label="Last Name *"
                   placeholder="Last Name"/>
          <hr/>
          <button className="btn btn-primary btn-styling login"
               onClick={() => {
                 const firstName = this.firstName.getValue();
                 const lastName = this.lastName.getValue();
                 const company = this.company.getValue();

                 if (firstName && lastName && company) {
                   this.changeState({ panel: index + 1 });
                   this.setState({
                     config: Object.assign(this.state.config, { firstName, lastName, company })
                   });
                 } else {
                   this.setState({
                     errorMessage: 'All fields are required.'
                   });
                 }
               }}>
            Next Step
          </button>
          <button className="btn btn-default btn-styling login"
               style={{marginTop: 10}}
               onClick={() => {
                 this.changeState({ panel: index - 1 });
               }}>
            Back
          </button>
        </div>
      );
    };

    const PanelEmailAddress = index => {
      return (
        <div>
          <h5>Step {index}: Email Address</h5>
          <hr style={{margin: '10px 0 15px 0'}}/>
          <div className="login-error-message text-center">
            {this.state.errorMessage}
          </div>
          <p style={{marginBottom: 10}}>Your email address will be your username.</p>
          <TextBox ref={c => this.emailAddress = c}
                   label="Email Address *"
                   placeholder="Email Address"/>
          <hr/>
          <button className="btn btn-primary btn-styling login"
               onClick={() => {
                 const emailAddress = this.emailAddress.getValue();
                 if (emailAddress) {
                   let data;

                   this.changeState({ panel: index + 1 });

                   data = Object.assign(this.state.config, { emailAddress });

                   this.props.dispatch(createNewAccount({
                     data,
                     onSuccess: () => this.setState({ panel: index + 2 }),
                     onFailure: error => this.setState({ panel: index + 3, errorMessage: error })
                   }));

                   this.setState({ config: data });
                 } else {
                   this.setState({
                     errorMessage: 'Email address is required.'
                   })
                 }
               }}>
            Complete
          </button>
          <button className="btn btn-default btn-styling login"
               style={{marginTop: 10}}
               onClick={() => this.changeState({ panel: index - 1 })}>
            Back
          </button>
        </div>
      );
    };

    const PanelSigningUp = index => {
      return (
        <div>
          <h5>Account Creation in Progress</h5>
          <hr style={{margin: '10px 0 15px 0'}}/>
          Please wait while we create your account.
          <hr/>
        </div>
      );
    };

    const PanelSuccess = index => {
      return (
        <div>
          <h5>Success!</h5>
          <hr style={{margin: '10px 0 15px 0'}}/>
          Your password has been emailed to you. You may now sign in.
          <hr/>
          <button className="btn btn-primary btn-styling login"
               style={{marginTop: 10}}
               onClick={() => this.setState({ panel: 1 })}
               data-dismiss="modal">
               Close
          </button>
        </div>
      );
    }

    const PanelFailure = index => {
      return (
        <div>
          <h5>Failed to Create Your Account</h5>
          <hr style={{margin: '10px 0 15px 0'}}/>
          {this.state.errorMessage}
          <hr/>
          <button className="btn btn-default btn-styling login"
               style={{marginTop: 10}}
               onClick={() => this.changeState({ panel: index - 3 })}>
            Back
          </button>
        </div>
      );
    };

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className="progress">
              <div className="progress-bar" style={{width: this.state.percent}}>
                {this.state.percent}
              </div>
            </div>
          </div>
        </div>
        {this.state.panel === 1 ? PanelTimeZone(1) : null}
        {this.state.panel === 2 ? PanelSettings(2) : null}
        {this.state.panel === 3 ? PanelEmailAddress(3) : null}
        {this.state.panel === 4 ? PanelSigningUp(4) : null}
        {this.state.panel === 5 ? PanelSuccess(5) : null}
        {this.state.panel === 6 ? PanelFailure(6) : null}
      </div>
    );
  }

  focusElement() {
    if (this.country) {
      this.country.getField().focus();
    } else if (this.company) {
      this.company.getField().focus();
    } else if (this.emailAddress) {
      this.emailAddress.getField().focus();
    }
  }
}
