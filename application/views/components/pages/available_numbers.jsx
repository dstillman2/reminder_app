import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import createButton from '../widgets/button';

import Textbox from '../form_fields/textbox';
import { changeTitle } from '../../actions/workspace';
import { openModal, closeModal } from '../../actions/modal';
import { fetchAvailablePhoneNumbers, createPhoneNumber } from '../../actions/phone_numbers';

import tableSchema from '../data/tableSchemas/available_numbers_table';
import TableWidget from '../widgets/table';

class AvailableNumbers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentWillMount() {
    this.props.dispatch(changeTitle('Add Caller ID'));
    this.props.dispatch(fetchAvailablePhoneNumbers({
      onFailure: error => this.setState({ errorMessage: error }),
      onComplete: () => this.setState({ loading: false })
    }));
  }

  componentWillReceiveProps(nextProps) {
    const availableNumbers = nextProps.phoneNumbers.availableNumbers;

    if (availableNumbers && availableNumbers.data) {
      this.setState({ loading: false });
    }
  }

  onRowClick(id, loading=false) {
    this.props.dispatch(
      openModal(this.modalContents.call(this,
        this.state.errorMessageModal,
        this.props.phoneNumbers.availableNumbers.data[id],
        id,
        loading
    )));

    this.setState({
      errorMessageModal: null
    });
  }

  onFilterClick() {
    const data = {
      areaCode: this.areaCode.getValue(),
      contains: this.contains.getValue()
    }

    this.setState({ loading: true });

    this.props.dispatch(fetchAvailablePhoneNumbers({
      data,
      onSuccess: () => this.setState({ errorMessage: null }),
      onFailure: error => this.setState({ errorMessage: error }),
      onComplete: () => this.setState({ loading: false }),
    }));
  }

  render() {
    const availablePhoneNumbers = this.props.phoneNumbers.availableNumbers;
    const data = availablePhoneNumbers && availablePhoneNumbers.data ?
      availablePhoneNumbers.data.slice(0, 10) : null;

    if (data) {
      data.forEach((number, index) => {
        number.id = index;
      });
    }

    let renderComponent;

    const buttons = (
      <div className="row">
        <div className="col-md-12">
          <div>
            <button className="btn btn-primary btn-styling pills"
                    style={{marginRight: 10, marginBottom: 5}}
                    onClick={() => {browserHistory.push('/phone_numbers')}}>
              View Caller ID's
            </button>
            <button className="btn btn-primary btn-styling disabled pills"
                    style={{marginBottom: 5}}>
              Add Caller ID
            </button>
          </div>
        </div>
      </div>
    );

    const heading = (
      <div className="row">
        <div className="col-md-12">
          <hr />
          <div className="text-center">
            Caller ID's are billed at 120 credits ($6) / month.
          </div>
          <hr />
        </div>
      </div>
    );

    const filters = (
      <form>
        <div className="row">
          <div className="col-sm-6">
            <Textbox
              ref={(c) => { this.areaCode = c; }}
              label="Filter by Area Code (optional)"
              placeholder="i.e. 510"
              maxLength="3"
            />
          </div>
          <div className="col-sm-6">
            <Textbox
              ref={(c) => { this.contains = c; }}
              label="Must contain.. (optional)"
              placeholder="i.e. 777"
              maxLength="5"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {
              createButton({
                buttonName: 'Filter',
                onClick: () => this.onFilterClick(),
                isLoading: this.state.loading,
              })
            }
          </div>
        </div>
      </form>
    );

    if (data && data.length === 0) {
      renderComponent = (
        <div>
          <div className="row">
            <div className="col-md-12">
              <hr />
              <div className="text-center" style={{ height: '25px' }}>
                There are no available phone numbers with your requirements.
              </div>
            </div>
          </div>
          <hr />
        </div>
      );
    } else if (data && data.length > 0) {
      if (this.state.errorMessage) {
        renderComponent = (
          <div>
            <hr />
            <div className="text-center" style={{ height: '25px' }}>
              {this.state.errorMessage}
            </div>
          </div>
        );
      } else {
        renderComponent = (
          <div>
            <hr />
            <h5>Purchasable Phone Numbers</h5>
            <hr />
            <TableWidget
              schema={tableSchema()}
              data={data}
              onRowClick={e => this.onRowClick(e)}
              pagination={false}
              pageId={Number(this.props.params.pageId)}
              route="/phone_numbers/available" />
          </div>
        )
      }
    } else {
      renderComponent = (
        <div style={{ margin: '15px 0' }}>
          <hr />
          <center>
            { this.state.errorMessage || 'loading ...' }
          </center>
        </div>
      );
    }

    return (
      <div className="form-contents">
        {buttons}
        {heading}
        {filters}
        {renderComponent}
      </div>
    );
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
          <div>
            Do you want to purchase <u>{data.friendly_name}</u>? 120 credits will be deducted.
          </div>
        </center>
      ),
      footer: [
        createButton({
          buttonName: 'Purchase',
          pullRight: true,
          onClick: () => this.onPurchaseClick(data, id),
          isLoading
        }),
        <button
          className="btn btn-default btn-styling"
          onClick={() => this.props.dispatch(closeModal())}>
            Close
        </button>
      ]
    }
  }

  onPurchaseClick(data, id) {
    this.onRowClick(id, true);

    this.props.dispatch(createPhoneNumber({
      data: { phoneNumber: data.phoneNumber },
      onSuccess: () => {
        this.props.dispatch(closeModal());

        browserHistory.push('/phone_numbers');
      },
      onFailure: (error) => {
        this.setState({ errorMessageModal: error });
        this.onRowClick(id, false);
      },
      onComplete: () => {
        this.setState({ loadingModal: false });
      },
    }));
  }
}

const mapStateToProps = state => ({ phoneNumbers: state.phoneNumbers });

export default connect(mapStateToProps)(AvailableNumbers);
