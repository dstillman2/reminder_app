import React, { Component } from 'react';

/**
 * TableCollapsedElement component
 */
class TableCollapsedElement extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClick(e) {
    this.setState({
      showDetails: !this.state.showDetails,
    });
  }

  render() {
    const title = this.props.schema.collapsedTitle(this.props.data);

    const components = this.props.schema.body.map((item, index) => {
      const value = item.response(this.props.data);
      const heading = this.props.schema.heading[index];

      return (
        <li className="table-element" key={
          'table-element' + heading + this.props.data.id}>
          <div>
            <u>{heading}</u>: {value}
          </div>
        </li>
      );
    });

    let viewMoreDetailsRow;

    if (this.props.schema.collapsedViewMoreButton) {
      viewMoreDetailsRow = (
        <div className="table-element text-center"
             key={'firstElement' + this.props.data.id}
             style={{padding: '15px 0', borderBottom: 0}}>
          <button
            onClick={e => {
              e.stopPropagation();

              this.props.onClick(this.props.data.id);
            }}
            className="btn btn-info btn-styling">
            More Details
          </button>
        </div>
      );
    } else {
      viewMoreDetailsRow = [];
    }

    return (
      <div className="table-collapsed-element">
        <button
          onClick={e => this.onClick(e)}
          className={'table-title ' + (this.state.showDetails ? 'selected' : '')}
        >
          {title}
        </button>
        {
          this.state.showDetails ? (
            [].concat(components, viewMoreDetailsRow)
          ) : null
        }
      </div>
    );
  }
}

TableCollapsedElement.defaultProps = {
  data: []
};

export default TableCollapsedElement;
