import React from 'react';

const Loading = props => (
  <div style={{ margin: '15px 0' }}>
    <hr />
    <center>
      {props.error || 'loading ...'}
    </center>
  </div>
);

Loading.defaultProps = {
  error: '',
};

Loading.propTypes = {
  error: React.PropTypes.string,
};

export default Loading;
