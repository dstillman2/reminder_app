import React, { Component } from 'react';

import DropDown from '../form_fields/dropdown';
import TextArea from '../form_fields/textarea';
import Button from '../widgets/button_new';
import { voiceOptions, typeOptions, tokenOptions } from '../data/phone_reminder_tokens';
import { fetchUploadUrl } from '../../actions/uploads';

class CustomizePhoneReminderItem extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    const type = this.props.content.type;
    const token = this.props.content.token;

    this.setState({
      isNewEntry: type === 'new',
      showAudio: type === 'upload',
      audioMessage: type === 'upload' ? 'Audio file is uploaded' : null,
      showTokenDropdown: type === 'tts' || type === 'new',
      showCustomField: token === 'custom',
    });
  }

  onTypeChange() {
    const type = this.typeDropdown.getValue();

    this.setState({
      showTokenDropdown: type === 'tts',
      showAudio: type === 'upload',
    });
  }

  onTokenChange() {
    const token = this.tokenDropdown.getValue();

    this.setState({
      showCustomField: token === 'custom',
    });
  }

  onClickUpload(file, fn) {
    // First fetch the signed url. Then, make a PUT request to that signed URL
    // with the file upload.
    this.props.dispatch(fetchUploadUrl({
      data: {
        file_type: file.type,
      },
      onSuccess: response => {
        const postData = new FormData();

        for (let key in response.data.fields) {
          postData.append(key, response.data.fields[key]);
        }

        postData.append('file', file);

        fn(postData, 'POST', response.data.url, {
          onSuccess: () => {
            this.setState({
              audioMessage: 'Successfully uploaded audio file',
              uploadUrl: response.url
            });
          },
        });
      }
    }));
  }

  getValues() {
    const type = this.typeDropdown.getValue();

    if (type === 'tts') {
      const token = this.tokenDropdown ? this.tokenDropdown.getValue() : null;
      const voice = this.voiceDropdown ? this.voiceDropdown.getValue() : null;
      const content = this.customField ? this.customField.getValue() : null;

      if (token && voice) {
        return { type, token, voice, content };
      }

      return null;
    } else if (type === 'upload') {
      const url = this.state.uploadUrl;

      if (url) {
        return { type, url };
      }

      return null;
    } else if (type === 'recording') {
      return null;
    }

    return null;
  }

  render() {
    return (
      <div>
        <DropDown label="Type"
                  ref={c => this.typeDropdown = c}
                  options={typeOptions}
                  onChange={() => this.onTypeChange()}
                  defaultValue={this.props.content.type} />
        {
          this.state.showTokenDropdown ? (
            <DropDown label="Token"
                      ref={c => this.tokenDropdown = c}
                      options={tokenOptions}
                      onChange={() => this.onTokenChange()}
                      defaultValue={this.props.content.token} />
          ) : null
        }
        {
          this.state.showTokenDropdown && this.state.showCustomField ? (
            <TextArea label="Custom Text to Speech"
                      ref={c => this.customField = c}
                      placeholder="What you write here will translate to voice"
                      rows={6}
                      defaultValue={this.props.content.content} />
          ) : null
        }
        {
          this.state.showTokenDropdown ? (
            <DropDown label="Voice Selection"
                      ref={c => this.voiceDropdown = c}
                      options={voiceOptions}
                      onChange={() => this.onTokenChange()}
                      defaultValue={this.props.content.voice} />
          ) : null
        }
        <div className="row">
          <div className="col-md-12">
          <hr/>
          <Button name={this.state.isNewEntry ? 'Create' : 'Update'}
                  pullRight={true}
                  onClick={() => this.props.update()}
                  isLoading={this.props.loading} />
          {
            !(this.state.isNewEntry && this.props.schemaLength === 1) ? (
              <button className="btn btn-default btn-styling pull-right"
                      onClick={() => this.props.onClickCancel()}>
                Cancel
              </button>
            ) : null
          }
          {
            !this.state.isNewEntry ? (
              <Button name="Delete"
                      color="btn-danger"
                      onClick={() => this.props.onClickDelete()}
                      isLoading={this.props.loading} />
            ) : null
          }
          </div>
        </div>
      </div>
    );
  }
}

CustomizePhoneReminderItem.defaultProps = {
  content: {}
};


export default CustomizePhoneReminderItem;
