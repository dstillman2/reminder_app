import React, { Component } from 'react';

import { connect } from 'react-redux';
import { changeTitle } from '../../actions/workspace';
import { fetchScripts, updateScripts } from '../../actions/scripts';

import Tabs from '../widgets/tabs';
import Loading from '../widgets/loading';
import DragDropComponent from '../widgets/drag_drop_voice';
import CustomizePhoneReminderItem from '../widgets/customize_phone_reminder_item';

const SUCCESS_MESSAGE = 'Successfully updated your script.';

/**
 * CustomizePhone component
 */
class CustomizePhone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      schema: [],
    };
  }

  componentWillMount() {
    this.props.dispatch(changeTitle('Customize Phone Reminder'));

    if (this.props.phoneScript) {
      const schema = JSON.parse(this.props.phoneScript.content);

      this.setState({ schema });
    }

    this.props.dispatch(fetchScripts({
      data: { message_type: 'phone' },
      onFailure: error => this.setState({ errorMessage: error })
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.phoneScript && nextProps.phoneScript.content) {
      const schema = JSON.parse(nextProps.phoneScript.content);

      this.setState({ schema });
    }
  }

  onPhoneScriptUpdate(schema, flag=true) {
    if (flag) {
      this.setState({ loading: true, errorMessage: null });
    }

    this.props.dispatch(updateScripts({
      scriptId: this.props.phoneScript.id,
      data: {
        name: this.props.phoneScript.name,
        type: this.props.phoneScript.type,
        content: JSON.stringify(schema)
      },
      onSuccess: () => {
        if (flag) {
          this.setState({ success: SUCCESS_MESSAGE, phoneItemContent: null });
        }
      },
      onFailure: error => this.setState({ errorMessage: error }),
      onComplete: () => this.setState({ loading: false })
    }));
  }

  onClickCallTree(id) {
    const schema = this.state.schema;

    if (this.state.phoneItemContent &&
        (id === this.state.phoneItemContent.id)) {
      return;
    }

    for (var i = 0; i < schema.length; i++) {
      if (schema[i].id === id) {
        break;
      }
    }

    this.setState({
      schema,
      phoneItemContent: schema[i]
    });
  }

  addNewEntry() {
    const arr = [];
    const newSchema = this.state.schema.slice(0);

    if (newSchema.length > 12) {
      this.setState({
        errorMessage: 'Max 12 entries on the call tree.'
      });
    }

    for (let i = 0; i < newSchema.length; i++) {
      arr.push(newSchema[i]);

      if (newSchema[i].type === 'new') {
        this.setState({
          errorMessage: 'Please complete the existing new entry.'
        });

        return;
      }
    }

    let counter = 0;

    if (arr.length !== 0) {
      while (true) {
        let found = false;

        counter++;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === counter) {
            found = true;
            break;
          }
        }

        if (found === false) {
          break;
        }
      }
    }

    const newItem = {
      id: counter,
      type: 'new',
    };

    newSchema.push(newItem);

    this.setState({
      schema: newSchema,
      phoneItemContent: newItem,
      errorMessage: null,
    });
  }

  onClickUpdate() {
    const values = this.customizePhoneReminderItem.getValues();
    const id = this.state.phoneItemContent.id;

    if (values) {
      var updatedEntry = Object.assign({}, { id }, values);

      // get index
      for (var i = 0; i < this.state.schema.length; i++) {
        if (this.state.schema[i].id === id) {
          break;
        }
      }

      const newSchema = this.state.schema.slice(0);

      newSchema[i] = updatedEntry;

      this.onPhoneScriptUpdate(newSchema);
    }
  }

  onClickCancel() {
    const newSchema = filterOutNewEntries(this.state.schema);

    this.setState({
      schema: newSchema,
      phoneItemContent: null,
      errorMessage: null
    });

    this.onPhoneScriptUpdate(newSchema);
  }

  onClickDelete() {
    const schema = filterOutNewEntries(this.state.schema);
    const newSchema = [];

    const deleteId = this.state.phoneItemContent.id;

    for (let i = 0; i < schema.length; i++) {
      if (schema[i].id !== deleteId) {
        newSchema.push(schema[i]);
      }
    }

    this.onPhoneScriptUpdate(newSchema);
  }

  moveArrow(id1, direction) {
    let id1Index, id2Index, id2;

    for (var i = 0; i < this.state.schema.length; i++) {
      if (this.state.schema[i].id === id1) {
        break;
      }
    }

    if (direction === 'up') {
      id2Index = i - 1;
    } else if (direction === 'down') {
      id2Index = i + 1;
    }

    if (id2Index > this.state.schema.length - 1 || id2Index < 0) {
      return;
    }

    id2 = this.state.schema[id2Index].id;

    this.dragDropComponent.swapElement(id1, id2);
  }

  render() {
    let renderComponent;

    let selectedItem;

    if (this.state.phoneItemContent) {
      const item = this.state.phoneItemContent;

      if (item && item.type) {
        var type = mapping[item.type].name;
      }
    }

    const panelPhoneReminder = (
      <div>
        <div className="row">
          <div className="col-md-12">
            <hr />
            <h5>Edit Phone Reminder</h5>
            <hr />
          </div>
          <div className="col-md-12">
            <div className="login-error-message text-center">
              {this.state.errorMessage}
            </div>
          </div>
        </div>
        <div className="row">
          <div className={this.state.phoneItemContent ? 'col-md-5' : 'col-md-8'}>
            <u style={{display: 'block', marginBottom: 10}}>Calling Tree*</u>
            <DragDropComponent
              ref={c => this.dragDropComponent = c}
              schema={this.state.schema}
              onClick={e => this.onClickCallTree(e)}
              onChange={schema => this.setState({ schema })}
              onElementSwap={schema => {
                this.onPhoneScriptUpdate(schema, false);
              }} />
            <button className="btn btn-default btn-styling"
                    onClick={e => this.addNewEntry(e)}>
              + Add New Entry
            </button>
            <div className="clearfix" />
            <div style={{margin: '10px 0'}}>
            * Calls are made in order from top to bottom.
            </div>
          </div>
          <div className="col-md-7">
            {
              this.state.phoneItemContent ? (
                <div>
                  <u style={{display: 'block', marginBottom: 10}}>
                    Details ({type})
                  </u>
                  <CustomizePhoneReminderItem
                    {...this.props}
                    ref={c => (this.customizePhoneReminderItem = c)}
                    key={this.state.phoneItemContent.id}
                    id={this.state.phoneItemContent.id}
                    content={this.state.phoneItemContent}
                    onClickCancel={() => this.onClickCancel()}
                    onClickDelete={() => this.onClickDelete()}
                    schemaLength={this.state.schema.length}
                    update={() => this.onClickUpdate()}
                    upArrow={id => this.moveArrow(id, 'up')}
                    downArrow={id => this.moveArrow(id, 'down')}
                    loading={this.state.loading} />
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    );

    if (this.props.scripts && this.props.scripts[0].content) {
      renderComponent = panelPhoneReminder;
    } else {
      renderComponent = <Loading error={this.state.errorMessage} />;
    }

    return (
      <div className="form-contents">
        <Tabs />
        {renderComponent}
      </div>
    );
  }
}


export default connect(state => state.scripts)(CustomizePhone);


const mapping = {
  tts: {
    color: 'red',
    name: 'Text to Speech'
  },
  upload: {
    color: 'blue',
    name: 'Upload'
  },
  recording: {
    color: 'red',
    name: 'Recording'
  },
  new: {
    color: 'grey',
    name: 'New Entry'
  }
};


function filterOutNewEntries(schema) {
  // Remove all type=="new" items from the calling tree
  const arr = [];

  for (let i = 0; i < schema.length; i++) {
    if (schema[i] && schema[i].type !== 'new') {
      arr.push(schema[i]);
    }
  }

  return arr;
}
