import React, { Component } from 'react';

/**
 * Textbox controlled component
 */
class TextBox extends Component {
  /**
   * Textbox constructor
   * @param {Object} props props passed from parent
   */
  constructor(props) {
    super(props);

    this.state = { value: this.props.defaultValue };

    this.uniqueIdentifier = Math.random().toString();
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * If onChange function supplied from parent, call the function.
   * @returns {void}
   */
  componentDidUpdate() {
    if (this.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  /**
   * Returns textbox value after removing whitespace (front && back)
   * @returns {String} string value from component state
   */
  getValue() {
    return this.state.value.trim() || null;
  }

  /**
   * Returns textbox component
   * @returns {Object} returns textbox element
   */
  getField() {
    return this.field;
  }

  /**
   * Clears textbox field
   * @returns {void}
   */
  clearField() {
    this.setState({ value: '' });
  }

  /**
   * Controlled component - update state on change
   * @param {Object} event event object
   * @returns {void}
   */
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  /**
   * Focus textbox element
   * @returns {void}
   */
  focus() {
    this.field.focus();
  }

  /**
   * Render textbox element
   * @returns {Object} jsx textbox component
   */
  render() {
    return (
      <div className="form-group">
        {
          this.props.label && (
            <label htmlFor={this.uniqueIdentifier} className="pull-left">
              {this.props.label}
            </label>
          )
        }
        <input
          className="form-control textbox-style"
          id={this.uniqueIdentifier}
          ref={(c) => { this.field = c; }}
          tabIndex={this.props.tabIndex}
          maxLength={this.props.maxLength}
          value={this.state.value}
          onChange={this.handleChange}
          type={this.props.inputType}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

TextBox.defaultProps = {
  inputType: 'text',
  defaultValue: '',
  placeholder: '',
  label: '',
  tabIndex: null,
  onChange: null,
  maxLength: null,
};

TextBox.propTypes = {
  onChange: React.PropTypes.func,
  defaultValue: React.PropTypes.string,
  tabIndex: React.PropTypes.number,
  label: React.PropTypes.string,
  maxLength: React.PropTypes.number,
  inputType: React.PropTypes.string,
  placeholder: React.PropTypes.string,
};

export default TextBox;
