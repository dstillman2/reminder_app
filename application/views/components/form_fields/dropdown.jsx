import React, { Component } from 'react';

/**
 * Dropdown uncontrolled component
 */
class Dropdown extends Component {
  /**
   * Returns field value
   * @returns {String} {null} string value if present, otherwise null
   */
  getValue() {
    return this.field.value || null;
  }

  /**
   * Returns field object
   * @returns {Object} returns dropdown element object
   */
  getField() {
    return this.field;
  }

  /**
   * React render method
   * @returns {Object} jsx dropdown menu
   */
  render() {
    return (
      <div className="form-group">
        {
          this.props.label && (
            <label htmlFor={this.props.uniqueIdentifier}>{this.props.label}</label>
          )
        }
        <select
          className="form-control"
          id={this.props.uniqueIdentifier}
          ref={(c) => { this.field = c; }}
          name={this.props.name}
          onChange={this.props.onChange}
          defaultValue={this.props.defaultValue}
        >
          {
            this.props.defaultSelected ? (
              <option value="" disabled selected>
                {this.props.defaultSelected}]
              </option>
            ) : null
          }
          {
            this.props.options.map((option, index) => (
              <option key={option.key || index} value={option.value}>{option.label}</option>
            ))
          }
        </select>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  onChange: null,
  defaultValue: null,
  defaultSelected: null,
  label: null,
  name: null,
  uniqueIdentifier: Math.random().toString(),
};

Dropdown.propTypes = {
  name: React.PropTypes.string,
  label: React.PropTypes.string,
  options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChange: React.PropTypes.func,
  defaultValue: React.PropTypes.string,
  defaultSelected: React.PropTypes.string,
  uniqueIdentifier: React.PropTypes.string,
};

export default Dropdown;
