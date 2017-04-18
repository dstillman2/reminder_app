import React from 'react';

import TableCollapsedElement from './table_collapsed_element';

/**
 * TableCollapsed component
 * @param {Object} props passed props from parent
 * @returns {Object} jsx
 */
function TableCollapsed(props) {
  return (
    <div className="tableCollapsed">
      {
        props.data.map(element => (
          <TableCollapsedElement
            key={`tableCollapsedElement${element.id}`}
            onClick={props.onClick}
            data={element}
            schema={props.schema}
          />
        ))
      }
    </div>
  );
}

TableCollapsed.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object),
  schema: React.PropTypes.objectOf(React.PropTypes.object).isRequired,
};

TableCollapsed.defaultProps = {
  data: [],
};

export default TableCollapsed;
