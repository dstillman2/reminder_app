import React, { Component } from 'react';

const $ = window.$;

/**
 * Modal full width does not input a schema - use as a general modal.
 */
class Modal extends Component {
  /**
   * React componentDidMount method.
   * Assign a modal dismiss handler if onModallDismiss prop is present.
   * @returns {void}
   */
  componentDidMount() {
    if (this.props.onModalDismiss) {
      window.$('.modal').on('hidden.bs.modal', () => {
        this.props.onModalDismiss();
      });
    }
  }

  /**
   * Opens the modal and executes the callback if provided.
   * @param {function} [fn] optional callback executed upon modal opening
   * @returns {void}
   */
  openModal(fn) {
    $(this.modal).modal();

    if (typeof fn === 'function') {
      fn();
    }
  }

  /**
   * React render method
   * @returns {object} jsx
   */
  render() {
    return (
      <div
        className="modal"
        tabIndex="-1"
        data-backdrop="static"
        ref={(c) => { this.modal = c; }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header" style={{ border: 0 }}>
              <button
                type="button"
                className="close"
                style={{ margin: '5px 15px 0 0' }}
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div
              className="modal-body"
              style={{ paddingTop: 0, margin: 25 }}
            >
              <div className="row">
                {this.props.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  onModalDismiss: null,
  content: null,
};

Modal.propTypes = {
  onModalDismiss: React.PropTypes.func,
  content: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
};

export default Modal;
