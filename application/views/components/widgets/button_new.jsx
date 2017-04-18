import React from 'react';

/**
 * Create a button
 * @param {object} props props from parent
 * @returns {object} jsx
 */
function createButton(props) {
  let render;

  if (props.isLoading) {
    render = (
      <div
        className={'btn btn-primary btn-styling opacity-6 ' +
        (props.pullRight ? 'pull-right ' : '') +
        (props.fullWidth ? 'full-width ' : '') +
        (props.color ? props.color : '')}
        key={`${props.buttonName} loading`}
        style={{ cursor: 'default' }}
      >
        loading...
      </div>
    );
  } else {
    render = (
      <button className={'btn btn-primary btn-styling ' +
        (props.pullRight ? 'pull-right ' : '') +
        (props.fullWidth ? 'full-width ' : '') +
        (props.color ? props.color : '')}
        key={props.name}
        onClick={props.onClick}
      >
        {props.name}
      </button>
    );
  }

  return render;
}

export default createButton;
