import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTitle } from '../../actions/workspace';
import { openModal } from '../../actions/modal';
import { updateUser } from '../../actions/userInfo';
import { userInfoFetch } from '../../actions/ajax';

import { modalUpdateTimeZone, modalEditUsers, modalUpdatePassword, modalEditAddress } from '../data/modals/settings_modal';

/**
 * Settings page
 */
class Settings extends Component {
  /**
   * set bindings
   * @param {object} props parent passed props from <Workspace />
   */
  constructor(props) {
    super(props);

    this.onEdit = this.onEdit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(userInfoFetch());
    this.props.dispatch(changeTitle('Settings'));
  }

  onEdit(e) {
    const type = $(e.target).data('id');

    switch(type) {
      case 'user_details':
        return this.props.dispatch(
          openModal(modalEditUsers({
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            updateUser,
          }))
        );
      case 'account_info':
        return this.props.dispatch(
          openModal(modalEditAddress({
            company: this.props.company,
            address_1: this.props.address_1,
            address_2: this.props.address_2,
            city: this.props.city,
            state: this.props.state,
            zip_code: this.props.zip_code,
            updateUser,
          }))
        );
      case 'change_password':
        return this.props.dispatch(
          openModal(modalUpdatePassword())
        );
      case 'update_timezone':
        return this.props.dispatch(
          openModal(modalUpdateTimeZone({
            time_zone: this.props.time_zone,
            updateUser,
          }))
        );
    }
  }

  render() {
    const userDetails = (
      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <h5>User Details</h5>
        </div>
        <div className="col-xs-8 col-sm-7" style={{marginBottom: 15}}>
          <div className="row" style={{marginBottom: 15}}>
            <div className="col-xs-5"><b>First Name</b></div>
            <div className="col-xs-7">{this.props.first_name}</div>
          </div>
          <div className="row">
            <div className="col-xs-5"><b>Last Name</b></div>
            <div className="col-xs-7">{this.props.last_name}</div>
          </div>
        </div>
        <div className="col-sm-1">
          <button
            data-id="user_details"
            onClick={this.onEdit}
            className="btn btn-info btn-styling sm pull-right">
            edit
          </button>
        </div>
      </div>
    );

    const addressDetails = (
      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <h5>Address</h5>
        </div>
        <div className="col-xs-8 col-sm-7">
          <div className="row" style={{ marginBottom: 15 }}>
            <div className="col-xs-5"><b>Company</b></div>
            <div className="col-xs-7">{this.props.company}</div>
          </div>
          <div className="row">
            <div className="col-xs-5"><b>Address</b></div>
            <div className="col-xs-7">{this.props.address_1}</div>
          </div>
          <div className="row" style={{ marginBottom: 15 }}>
            <div className="col-xs-5"><b></b></div>
            <div className="col-xs-7">{this.props.address_2}</div>
          </div>
          <div className="row" style={{ marginBottom: 15 }}>
            <div className="col-xs-5"><b>City</b></div>
            <div className="col-xs-7">{this.props.city}</div>
          </div>
          <div className="row" style={{ marginBottom: 15 }}>
            <div className="col-xs-5"><b>State</b></div>
            <div className="col-xs-7">{this.props.state}</div>
          </div>
          <div className="row" style={{ marginBottom: 15 }}>
            <div className="col-xs-5"><b>Zip Code</b></div>
            <div className="col-xs-7">{this.props.zip_code}</div>
          </div>
        </div>
        <div className="col-sm-1">
          <button
            data-id="account_info"
            onClick={this.onEdit}
            className="btn btn-info btn-styling sm pull-right">
            edit
          </button>
        </div>
      </div>
    );

    const updatePassword = (
      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <h5>Update Password</h5>
        </div>
        <div className="col-xs-8 col-sm-7">
          <div className="row" style={{marginBottom: 15}}>
            <div className="col-xs-5"><b>Password</b></div>
            <div className="col-xs-7">*********</div>
          </div>
        </div>
        <div className="col-sm-1">
          <button
            data-id="change_password"
            onClick={this.onEdit}
            className="btn btn-info btn-styling sm pull-right">
            edit
          </button>
        </div>
      </div>
    );

    const updateTimeZone = (
      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <h5>Time Zone</h5>
        </div>
        <div className="col-xs-8 col-sm-7">
          <div className="row" style={{ marginBottom: 15 }}>
            <div className="col-xs-5"><b>Time Zone</b></div>
            <div className="col-xs-7">{this.props.time_zone}</div>
          </div>
        </div>
        <div className="col-sm-1">
          <button
            data-id="update_timezone"
            onClick={this.onEdit}
            className="btn btn-info btn-styling sm pull-right">
            edit
          </button>
        </div>
      </div>
    );

    return (
      <div className="form-contents">
        <div id="settings">
          {userDetails}
          <hr/>
          {addressDetails}
          <hr/>
          {updateTimeZone}
          <hr/>
          {updatePassword}
          <hr/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state.userInfo;

export default connect(mapStateToProps)(Settings);
