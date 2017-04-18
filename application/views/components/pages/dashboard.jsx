import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { changeTitle } from '../../actions/workspace';
import { fetchEvents } from '../../actions/events';
import { userInfoFetch } from '../../actions/ajax';
import { openModal } from '../../actions/modal';
import modalContents from '../data/modals/dashboard_modal';
import tableSchema from '../data/tableSchemas/events_table';
import TableWidget from '../widgets/table';

/**
 * Dashboard component
 */
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(userInfoFetch());
    this.props.dispatch(changeTitle('Dashboard'));
    this.props.dispatch(fetchEvents({
      onFailure: error => this.setState({ errorMessage: error })
    }));
  }

  onRowClick(id) {
    const eventId = id;
    const events = this.props.events.events;

    for (let i = 0; i < events.length; i++) {
      if (eventId === events[i].id) {
        var data = events[i];
        break;
      }
    }

    this.props.dispatch(
      openModal(modalContents.call(this,
        Object.assign({}, data, { errorMessageModal: this.state.errorMessageModal }),
        this.props.userInfo,
    )));

    this.setState({
      errorMessageModal: null,
    });
  }

  render() {
    let renderComponent;
    const data = this.props.events.events;

    const tabs = (
      <div className="row">
        <div className="col-md-12">
          <div>
            <button
              className="btn btn-primary btn-styling pills"
              onClick={() => browserHistory.push('/reminders/schedule')}
              style={{ marginRight: 10, marginBottom: 5 }}
            >
              Schedule a Reminder
            </button>
          </div>
        </div>
      </div>
    );

    if (data && data.length === 0) {
      renderComponent = (
        <div>
          <div className="row">
            <div className="col-md-12">
              <hr />
              <div className="text-center">
                No appointments have been scheduled yet.
              </div>
            </div>
          </div>
          <hr />
        </div>
      );
    } else if (data && data.length > 0) {
      renderComponent = (
        <div>
          <hr/>
            <h5>Reminders (Page {this.props.params.pageId || 1})</h5>
          <hr/>
          <TableWidget
            enableCollapsed={true}
            schema={tableSchema(this.props.userInfo.time_zone)}
            data={data}
            onRowClick={e => this.onRowClick(e)}
            pageId={ Number(this.props.params.pageId) || 1 }
            route='/dashboard'
          />
        </div>
      );
    } else {
      renderComponent = (
        <div style={{ margin: '15px 0' }}>
          <hr />
          <center>
            {this.state.errorMessage || 'loading ...'}
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
}

const mapStateToProps = state => (
  {
    events: state.events,
    userInfo: state.userInfo,
  }
);

export default connect(mapStateToProps)(Dashboard);
