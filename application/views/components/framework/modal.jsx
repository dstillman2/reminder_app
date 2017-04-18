import React, { Component } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal';
import createButton from '../widgets/button';

import ajax from '../common/ajax';

import TextBox from '../form_fields/textbox';
import Dropdown from '../form_fields/dropdown';

/**
 * Modal
 */
class Modal extends Component {
  /**
   * set initial state
   * @param {object} props props
   */
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.$('.modal').on('hidden.bs.modal', () => {
      this.props.dispatch(closeModal());
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible) {
      this.openModal();
    } else {
      this.closeModal();
    }
  }

  componentDidUpdate() {
    window.$('form:first *:input[type!=hidden]:first').focus();
  }

  toggleLoader() {
    window.$(this.loader).toggleClass('hide');
  }

  addLoader() {
    window.$(this.loader).addClass('hide');
  }

  removeLoader() {
    window.$(this.loader).removeClass('hide');
  }

  openModal() {
    window.$(this.modal).modal();
  }

  closeModal() {
    window.$(this.modal).modal('hide');
  }

  validateAndGetValues() {
    const fields = this.props.schema.content;
    const output = {};

    for (let i = 0; i < fields.length; i++) {
      output[fields[i].ref] = this[fields[i].ref].getValue();

      if (fields[i].validation) {
        const fieldValue = this[fields[i].ref].getValue();

        if (fieldValue === null) {
          this.setState({ errorMessage: fields[i].validation });

          return false;
        }
      }
    }

    return output;
  }

  /**
   * Modal ajax request
   * @returns {undefined} no return value
   */
  ajaxRequest() {
    const data = this.validateAndGetValues();

    if (data === false) {
      return;
    }

    const params = this.props.schema.ajax;

    const request = {
      api: params.api,
      path: params.path,
      method: params.method,
      data,
      successCallback: (response) => {
        if (params.returnSingleObject) {
          this.props.dispatch(params.success(response.data[0]));
        } else if (params.returnResponse) {
          this.props.dispatch(params.success(response));
        }

        this.props.dispatch(closeModal());
      },
      errorCallback: () => {
        this.setState({
          errorMessage: 'There was an error with this request.',
        });
      },
      completeCallback: () => {
        this.setState({ loading: false });
      },
    };

    this.setState({ loading: true });

    ajax(request);
  }

  /**
   * render
   * @returns {object} jsx
   */
  render() {
    const content = this.props.content || [];
    const footer = this.props.footer || [];
    const schema = this.props.schema || {};

    if (schema.content) {
      schema.content.forEach((item) => {
        if (item.type === 'textbox') {
          content.push(
            <div className={item.size ? `col-sm-${item.size}` : 'col-sm-12'} key={item.ref}>
              <TextBox
                ref={(c) => { this[item.ref] = c; }}
                label={item.label}
                inputType={item.inputType}
                defaultValue={item.defaultValue}
                placeholder={item.placeholder}
              />
            </div>,
          );
        } else if (item.type === 'dropdown') {
          content.push(
            <div className={item.size ? `col-sm${item.size}` : 'col-sm-12'} key={item.ref}>
              <Dropdown
                ref={(c) => { this[item.ref] = c; }}
                name={item.name}
                label={item.label}
                onChange={item.onChange}
                defaultValue={item.defaultValue}
                options={item.options}
                defaultSelected={item.defaultSelected}
              />
            </div>,
          );
        }
      });
    }

    if (schema.footer) {
      schema.footer.forEach((item) => {
        if (item.type === 'primary') {
          footer.push(
            createButton({
              buttonName: 'Update',
              pullRight: true,
              type: 'submit',
              onClick: (e) => {
                e.preventDefault();

                if (item.ajax) {
                  this.ajaxRequest();
                }
              },
              isLoading: this.props.loading,
            }),
          );
        } else if (item.type === 'default') {
          footer.push(
            <button
              key={'default'}
              className="btn btn-styling btn-default pull-right"
              data-dismiss={item.dismiss ? 'modal' : ''}
            >
              Cancel
            </button>,
          );
        }
      });
    }

    return (
      <div
        className="modal"
        tabIndex="-1"
        data-backdrop="static"
        ref={(c) => { this.modal = c; }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header" style={{ marginTop: '15px' }} >
              <button
                type="button"
                className="close"
                style={{ marginRight: 10 }}
                data-dismiss="modal"
              >
                &times;
              </button>
              <h4 className="modal-title">
                {this.props.title || schema.title}
              </h4>
            </div>
            <div className="modal-body">
              <form onSubmit={() => { item.ajax ? this.ajaxRequest() : null }}>
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="login-error-message"
                      style={{ textAlign: 'center' }}
                    >
                      {this.props.errorMessage}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {content}
                </div>
                <div className="modal-footer">
                  <div className="row">
                    <div
                      ref={(c) => { this.loader = c; }}
                      className="pull-left hide"
                      style={{ padding: 5 }}
                    />
                    {footer}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  schema: {},
  content: [],
  footer: [],
};

Modal.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  schema: React.PropTypes.objectOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.array,
      React.PropTypes.bool,
      React.PropTypes.object,
    ]),
  ),
  footer: React.PropTypes.arrayOf(React.PropTypes.object),
  content: React.PropTypes.arrayOf(React.PropTypes.object),
};

const mapStateToProps = state => state.modal;

export default connect(mapStateToProps)(Modal);
