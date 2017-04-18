import React from 'react';
import { browserHistory } from 'react-router';

/**
 * Tabs
 * @returns {Object} jsx
 */
export default function Tabs() {
  return (
    <div className="row">
      <div className="col-md-12">
        <div>
          <button
            className="btn btn-primary btn-styling pills"
            onClick={() => browserHistory.push('/reminders/customize/text')}
            style={{ marginRight: 10, marginBottom: 5 }}
          >
            Edit Text Reminder
          </button>
          <div
            className="btn btn-primary btn-styling pills disabled"
            style={{ marginBottom: 5 }}
          >
            Edit Phone Reminder
          </div>
        </div>
      </div>
    </div>
  );
}
