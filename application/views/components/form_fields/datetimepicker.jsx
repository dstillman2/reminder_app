import React, { Component } from 'react';

const moment = window.moment;

/**
 * DateTimePicker component
 */
export default class Dropdown extends Component {
  /**
   * define bindings
   * @param {Object} props props passed from parent component
   */
  constructor(props) {
    super(props);

    this.uniqueIdentifier = Math.random().toString();
    this.fieldOnClick = this.fieldOnClick.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  /**
   * React componentDidMount method
   * @returns {void}
   */
  componentDidMount() {
    let defaultDate;

    if (this.props.dateTimePicker && this.props.timeZone) {
      defaultDate = moment.tz(this.props.dateTimePicker, this.props.timeZone).format('YYYY-MM-DDTHH:mm:ss');
    }

    $(this.datetimepicker).datetimepicker({
      defaultDate: defaultDate || moment().format('YYYY-MM-DDTHH:mm:ss'),
      stepping: 5,
    });
  }

  getValue() {
    const time = $(this.datetimepicker).data('DateTimePicker').date();

    return moment.tz(time.format('YYYY-MM-DDTHH:mm:ss'), this.props.timeZone).format();
  }

  fieldOnClick() {
    $(this.datetimepicker).data('DateTimePicker').show();
  }

  /**
   * React render method
   * @returns {object} jsx
   */
  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.uniqueIdentifier}>
          {this.props.label}
        </label>
        <div
          className="input-group date"
          ref={(c) => { this.dateTimePicker = c; }}
        >
          <input
            type="text"
            id={this.uniqueIdentifier}
            onClick={this.fieldOnClick}
            className="form-control"
          />
          <span
            className="input-group-addon"
            onClick={this.fieldOnClick}
          >
            <span className="glyphicon glyphicon-calendar" />
          </span>
        </div>
      </div>
    );
  }
}
