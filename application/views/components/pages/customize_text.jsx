import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { changeTitle } from '../../actions/workspace';
import TextArea from '../form_fields/textarea';
import { fetchScripts, updateScripts } from '../../actions/scripts';

import button from '../widgets/button';

/**
 * CustomizeText component
 */
class CustomizeText extends Component {
  constructor(props) {
    super(props);

    let textScript;

    if (typeof this.props.scripts === 'object') {
      this.props.scripts.forEach(item => {
        if (item.type === 'text') {
          textScript = item;
        }
      });
    }

    this.state = {
      textReminderLength: null,
      panel: 1,
      textScript: textScript || {},
      loading: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(changeTitle('Customize Text Reminder'));

    if (this.props.textScript && this.props.textScript.content) {
      this.setState({
        textScript: this.props.textScript
      });
    }

    this.props.dispatch(fetchScripts({
      onFailure: error => this.setState({ errorMessage: error })
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.textScript && nextProps.textScript.content) {
      this.setState({
        textScript: nextProps.textScript
      });
    }
  }

  onGetTextReminderLength(val) {
    if (!this.textReminder) {
      return;
    }

    const textReminderValue = val || this.textReminder.getValue();
    const textReminderLength = textReminderValue ? textReminderValue.length : 0;

    this.setState({ textReminderLength });

    return textReminderLength;
  }

  onTextScriptUpdate() {
    const textReminderContent = this.textReminder.getValue();

    let errorMessage = '';

    if (textReminderContent.length > 140) {
      errorMessage = 'Maximum length is 140 characters';
    }

    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ loading: true, errorMessage: null });

    this.props.dispatch(updateScripts({
      scriptId: this.state.textScript.id,
      data: {
        name: this.state.textScript.name,
        type: this.state.textScript.type,
        content: textReminderContent,
      },
      onSuccess: () => {
        this.setState({
          panel: 1,
        });

        this.props.dispatch(fetchScripts({
          onFailure: error => this.setState({ errorMessage: error }),
        }));
      },
      onFailure: error => this.setState({ errorMessage: error }),
      onComplete: () => this.setState({ loading: false }),
    }));
  }

  render() {
    let renderComponent;

    const tabs = (
      <div className="row">
        <div className="col-md-12">
          <div>
            <button className='btn btn-primary btn-styling pills disabled'
                    style={{marginRight: 10, marginBottom: 5}}>
              Edit Text Reminder
            </button>
            <button className='btn btn-primary btn-styling pills'
                    onClick={() => browserHistory.push('/reminders/customize/phone')}
                    style={{marginBottom: 5}}>
              Edit Phone Reminder
            </button>
          </div>
        </div>
      </div>
    );

    const panelLoading = (
      <div style={{margin: '15px 0'}}>
        <hr/>
        <center>
          {this.state.errorMessage || 'loading ...'}
        </center>
      </div>
    );

    const tokens = (
      <div className="col-md-4 reminder-tokens">
        <u style={{display: 'block', marginBottom: 10}}>Tokens</u>
        <div className="btn btn-info btn-styling"
             key="company"
             style={{display: 'block', marginBottom: 5}}
             onClick={() => this.textReminder.setValue('{%Company%}')}>
          Company
        </div>
        <div className="btn btn-info btn-styling"
             style={{display: 'block', marginBottom: 5}}
             onClick={() => this.textReminder.setValue('{%FirstName%}')}>
          First Name
        </div>
        <div className="btn btn-info btn-styling"
             style={{display: 'block', marginBottom: 5}}
             onClick={() => this.textReminder.setValue('{%LastName%}')}>
          Last Name
        </div>
        <div className="btn btn-info btn-styling"
             style={{display: 'block', marginBottom: 5}}
             onClick={() => this.textReminder.setValue('{%Date%}')}>
          Appointment Date
        </div>
        <div className="btn btn-info btn-styling"
             style={{display: 'block', marginBottom: 5}}
             onClick={() => this.textReminder.setValue('{%Time%}')}>
          Appointment Time
        </div>
      </div>
    );

    const panelViewTextReminder = (
      <div className="row">
        <div className="col-md-12">
          <hr/>
          <h5>View Text Reminder</h5>
          <hr/>
        </div>
        <div className="col-md-8 text-reminder-script">
          {addTokenHtmlToScript(this.state.textScript.content)}
          <div className="clearfix"/>
          <hr/>
          <button className="btn btn-primary btn-styling pull-right"
                  onClick={() => this.setState({ panel: 2 })}>
            Edit
          </button>
        </div>
      </div>
    );

    const panelEditTextReminder = (
      <div className="row">
        <div className="col-md-12">
          <hr/>
          <h5>Edit Text Reminder</h5>
          <hr />
          <div className="login-error-message text-center">
            {this.state.errorMessage}
          </div>
        </div>
        {tokens}
        <div className="col-md-8">
          <u style={{ display: 'block', marginBottom: 10 }}>Script</u>
          <TextArea
            ref={(c) => { this.textReminder = c; }}
            defaultValue={this.state.textScript.content}
            onChange={val => this.onGetTextReminderLength(val)}
            rows="5"
          />
          {
            this.state.textReminderLength ? (
              <div className="pull-right">
                ({this.state.textReminderLength} / 140)
              </div>
            ) : null
          }
          <div className="clearfix"/>
          <hr/>
          {
            button({
              buttonName: 'Update',
              pullRight: true,
              onClick: () => this.onTextScriptUpdate(),
              isLoading: this.state.loading
            })
          }
          <button className="btn btn-default btn-styling pull-right"
                  onClick={() => this.setState({ panel: 1, errorMessage: null, })}>
            Back
          </button>
        </div>
      </div>
    );

    if (this.state.panel === 2 && this.state.textScript.content) {
      renderComponent = panelEditTextReminder;
    } else if (this.state.panel === 1 && this.state.textScript.content) {
      renderComponent = panelViewTextReminder;
    } else {
      renderComponent = panelLoading;
    }

    return (
      <div className="form-contents">
        {tabs}
        {renderComponent}
      </div>
    );
  }
}

export default connect(state => state.scripts)(CustomizeText);


function getAllIndexes(string, token) {
  const indexes = [];

  let startFrom = 0;

  while (string.indexOf(token, startFrom) > -1) {
    const index = string.indexOf(token, startFrom);

    indexes.push(index);

    startFrom = index + token.length;
  }

  return indexes;
}

function addTokenHtmlToScript(script) {
  if (!script) return;

  const index = [
    { name: 'company',
      token: '{%Company%}',
      indexes: getAllIndexes(script, '{%Company%}') },
    { name: 'first name',
      token: '{%FirstName%}',
      indexes: getAllIndexes(script, '{%FirstName%}') },
    { name: 'last name',
      token: '{%LastName%}',
      indexes: getAllIndexes(script, '{%LastName%}') },
    { name: 'date',
      token: '{%Date%}',
      indexes: getAllIndexes(script, '{%Date%}') },
    { name: 'time',
      token: '{%Time%}',
      indexes: getAllIndexes(script, '{%Time%}') }
  ];

  const unorderedItems = [];

  for (let i = 0; i < index.length; i++) {
    index[i].indexes.forEach(indexLocation => {
      unorderedItems.push({
        name: index[i].name,
        token: index[i].token,
        index: indexLocation
      })
    });
  }

  const orderedItems = unorderedItems.sort((a, b) => {
    if (a.index < b.index) {
      return -1;
    } else if (a.index > b.index) {
      return 1;
    }

    return 0;
  });

  const arr = [];

  let lastIndex = 0;

  orderedItems.forEach(item => {
    if (item.index > -1) {
      arr.push(script.substring(lastIndex, item.index));
      arr.push(<span className="token">{item.name}</span>);

      lastIndex = item.index + item.token.length;
    }
  });

  arr.push(script.substring(lastIndex));

  return arr;
}
