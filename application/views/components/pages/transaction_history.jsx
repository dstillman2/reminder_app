import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { changeTitle } from '../../actions/workspace';
import { fetchCreditTransactions } from '../../actions/credit_transactions';

import tableSchema from '../data/tableSchemas/credit_transactions_table';
import TableWidget from '../widgets/table';

class TransactionHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(changeTitle('Transaction History'));
    this.props.dispatch(fetchCreditTransactions({
      onFailure: error => this.setState({ errorMessage: error })
    }));
  }

  render() {
    const buttons = (
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary btn-styling pills"
                  style={{marginBottom: 5}}
                  onClick={() => {browserHistory.push('/credits/purchase')}}>
            Add Credits
          </button>
          <div className="btn btn-primary btn-styling disabled pills"
               style={{marginBottom: 5}}>
            Transaction History
          </div>
        </div>
      </div>
    );

    const data = this.props.creditTransactions.data;

    let renderComponent;

    if (data && data.length === 0) {
      renderComponent = (
        <div>
          <div className="row">
            <div className="col-md-12">
              <hr />
              <div className="text-center">
                No transactions have been created yet.
              </div>
            </div>
          </div>
          <hr />
        </div>
      );
    } else if (data && data.length > 0) {
      renderComponent = (
        <div>
          <hr />
            <h5>Transaction History (Page {this.props.params.pageId || 1})</h5>
          <hr/>
          <TableWidget
            schema={tableSchema(this.props.userInfo.time_zone)}
            data={data}
            enableCollapsed={true}
            pageId={Number(this.props.params.pageId)}
            route="/credits/transaction_history"
          />
        </div>
      )
    } else {
      renderComponent = (
        <div style={{ margin: '15px 0' }}>
          <hr />
          <center>
            { this.state.errorMessage || 'loading ...' }
          </center>
        </div>
      )
    }

    return (
      <div className="form-contents">
        {buttons}
        {renderComponent}
      </div>
    );
  }
}

export default connect(state => state)(TransactionHistory);
