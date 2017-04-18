import React from 'react';

/**
 * createButton component
 * @returns {object} jsx
 */
export default function createButton({
  isLoading,
  onClick,
  buttonName,
  pullRight,
  fullWidth,
  type }) {
  let render;

  if (isLoading) {
    render = (
      <div
        className={"btn btn-primary btn-styling opacity-6 " + (pullRight ? 'pull-right ' : '') + (fullWidth ? 'full-width ' : '')}
        key={`${buttonName}loading`}
        style={{ cursor: 'default' }}
      >
        loading...
      </div>
    );
  } else {
    render = (
      <button
        className={"btn btn-primary btn-styling " + (pullRight ? 'pull-right ' : '') + (fullWidth ? 'full-width ' : '')}
        key={buttonName}
        type={type}
        onClick={onClick}
      >
        {buttonName}
      </button>
    );
  }

  return render;
}
