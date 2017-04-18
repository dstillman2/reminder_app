import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import createButton from '../widgets/button';

import { changeTitle } from '../../actions/workspace';
import { openModal, closeModal } from '../../actions/modal';
import { fetchPhoneNumbers, deletePhoneNumber, updatePhoneNumber } from '../../actions/phone_numbers';
import { userInfoFetch } from '../../actions/ajax';

import tableSchema from '../data/tableSchemas/phone_numbers_table';
import TableWidget from '../widgets/table';

const ROUTE_AVAILABLE_NUMBERS = '/phone_numbers/available';

/**
 * PhoneNumbers component
 */
class PhoneNumbers extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(userInfoFetch());
    this.props.dispatch(changeTitle('Caller ID\'s'));
    this.props.dispatch(fetchPhoneNumbers({
      onSuccess: () => this.setState({ errorMessage: null }),
      onFailure: error => this.setState({ errorMessage: error })
    }))
  }

  onRowClick(id, loading=false) {
    let data;

    for (let i = 0; i < this.props.data.length; i++) {
      if (this.props.data[i].id === id) {
        data = this.props.data[i];

        break;
      }
    }

    if (data.is_active) {
      this.props.dispatch(openModal(this.modalContents(
        this.state.errorMessageModal, data, id, loading
      )));
    } else {
      this.props.dispatch(openModal(this.modalDeleted(
        this.state.errorMessageModal, data, id, loading
      )));
    }
  }

  render() {
    const phoneNumbers = this.props.phoneNumbers;

    let renderComponent;

    const tabs = (
      <div className="row">
        <div className="col-md-12">
          <div>
          <div className="btn btn-primary btn-styling pills disabled"
                  style={{marginRight: 10, marginBottom: 5}}>
            View Caller ID's
          </div>
            <button className="btn btn-primary btn-styling pills"
                    style={{marginBottom: 5}}
                    onClick={() => browserHistory.push(ROUTE_AVAILABLE_NUMBERS)}>
              Add Caller ID
            </button>
          </div>
        </div>
      </div>
    );

    if (this.props.data && this.props.data.length > 0) {
      renderComponent = (
        <div>
          <hr/>
            <h5>Phone Numbers (Page {this.props.params.pageId || 1})</h5>
          <hr/>
          <TableWidget
            schema={tableSchema}
            data={this.props.data}
            onRowClick={e => this.onRowClick(e)}
            pageId={Number(this.props.params.pageId) || 1}
            route='/phone_numbers' />
        </div>
      );
    } else if (this.props.data) {
      renderComponent = (
        <div>
          <div className="row">
            <div className="col-md-12">
              <hr/>
              <div className="text-center">
                There are no registered caller IDs tied to this account.
              </div>
            </div>
          </div>
          <hr/>
        </div>
      );
    } else {
      renderComponent = (
        <div style={{margin: '15px 0'}}>
          <hr/>
          <center>
            { this.state.errorMessage || 'loading ...' }
          </center>
        </div>
      );
    }

    return (
      <div className="form-contents">
        {tabs}
        {renderComponent}
      </div>
    );
  }

  modalDeleted(error, data, id, isLoading) {
    return {
      title: 'Phone Number Details',
      content: (
        <center>
          <div style={{padding: 15}}>
            <u>{data.friendly_name}</u> has been unsubscribed and will remain active until the end of this billing cycle.
          </div>
        </center>
      ),
      footer: [
        <button className="btn btn-default btn-styling"
                style={{marginRight: '5px'}}
                onClick={() => this.props.dispatch(closeModal())}>
                Close
        </button>,
        createButton({
          buttonName: 'Reactivate',
          onClick: () => this.onDeleteClick(id, 'reactivate'),
          isLoading
        })
      ]
    }
  }

  modalContents(error, data, id, isLoading) {
    return {
      title: 'Phone Number Details',
      content: (
        <center>
          {
            error ? (
              <div className="login-error-message">
                <b>Error:</b> {error}
              </div>
            ): null
          }
          <div style={{padding: 15}}>
            Do you want to unsubscribe <u>{data.friendly_name}</u>? This number will remain active until the end of the billing cycle.
          </div>
        </center>
      ),
      footer: [
        createButton({
          buttonName: 'Unsubscribe',
          pullRight: true,
          onClick: () => this.onDeleteClick(id, 'unsubscribe'),
          isLoading
        }),
        <button className="btn btn-default btn-styling"
                onClick={() => this.props.dispatch(closeModal())}>
                Close
        </button>
      ]
    }
  }

  onDeleteClick(id, task) {
    this.onRowClick(id, true);

    let taskFunc = deletePhoneNumber;

    if (task === 'reactivate') {
      taskFunc = updatePhoneNumber;
    }

    this.props.dispatch(taskFunc({
      id,
      onSuccess: () => {
        this.props.dispatch(closeModal());
        this.props.dispatch(fetchPhoneNumbers());
      },
      onFailure: error => {
        this.setState({ errorMessageModal: error });

        this.setState({ loadingModal: false });
        this.onRowClick(id, false);
      }
    }));
  }
}

export default connect(state => state.phoneNumbers)(PhoneNumbers);
