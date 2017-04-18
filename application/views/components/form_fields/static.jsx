import React from 'react';

/**
 * Static form field
 * @param {Object} props passed from parent component
 * @returns {Object} jsx
 */
function Static(props) {
  return (
    <div style={{ margin: '10px 0 0 0' }}>
      <span style={{ marginRight: 15 }}><b>{props.label}:</b></span>
      <span>{props.text}</span>
    </div>
  );
}

Static.propTypes = {
  label: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
};

export default Static;
