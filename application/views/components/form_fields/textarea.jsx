import React from 'react';

/**
 * Textarea controlled component
 */
export default class TextArea extends React.Component {
  /**
   * Set initial state
   * @param {Object} props default props
   */
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.defaultValue,
    };

    this.uniqueIdentifier = Math.random().toString();
    this.onChange = this.onChange.bind(this);
  }

  /**
   * @returns {String} textarea value
   */
  getValue() {
    return this.state.value.trim() || null;
  }

  /**
   * Change textarea value
   * @param {String} val new value to append to string
   * @returns {void}
   */
  setValue(val) {
    this.setState({
      value: `${this.state.value}${val}`,
    });

    if (this.props.onChange) {
      this.props.onChange(`${this.state.value}${val}`);
    }
  }

  /**
   * Resets the textarea value
   * @returns {void}
   */
  clearValue() {
    this.setState({
      value: '',
    });
  }

  /**
   * onChange handler for controlled component
   * @param {Object} e event object
   */
  onChange(e) {
    this.setState({
      value: e.target.value,
    });

    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  /**
   * React render method
   * @returns {Object} jsx
   */
  render() {
    return (
      <div className="form-group">
        {
          this.props.label ? (
            <label htmlFor={this.uniqueIdentifier}>{this.props.label}</label>
          ) : null
        }
        <textarea
          className="form-control"
          ref={(c) => { this.field = c; }}
          id={this.uniqueIdentifier}
          name={this.props.name}
          rows={this.props.rows}
          onChange={this.onChange}
          value={this.state.value}
          placeholder={this.props.placeholder}
          maxLength={this.props.maxLength} />
      </div>
    );
  }
}
