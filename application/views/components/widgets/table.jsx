import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import TableCollapsed from './table_collapsed';

const ELEMENTS_PER_PAGE = 10;

/**
 * TableWidget component
 */
class TableWidget extends Component {
  constructor(props) {
    super(props);

    this.getEntry = this.getEntry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      const data = nextProps.data.slice(this.getEntry(), this.getExit());
      const numOfPages = this.calculateNumberOfPages(nextProps.data);

      if (data.length === 0) {
        return browserHistory.push(`${this.props.route}/${numOfPages}`);
      }
    }
  }

  calculateNumberOfPages(data) {
    const numOfElements = data ? data.length : this.props.data.length;
    const estimatedPagesNeeded = Math.floor(numOfElements / ELEMENTS_PER_PAGE);

    if (estimatedPagesNeeded == (numOfElements / ELEMENTS_PER_PAGE)) {
      return estimatedPagesNeeded;
    }

    return estimatedPagesNeeded + 1;
  }

  getEntry() {
    const pageId = (this.props.pageId || 1);

    return (ELEMENTS_PER_PAGE * pageId) - ELEMENTS_PER_PAGE;
  }

  getExit() {
    return this.getEntry() + ELEMENTS_PER_PAGE;
  }

  showLeftArrow() {
    if ((this.props.pageId || 1) <= 1) {
      return false;
    }

    return true;
  }

  showRightArrow() {
    if ((this.props.pageId || 1) >= this.calculateNumberOfPages()) {
      return false;
    }

    return true;
  }

  render() {
    if (!this.props.schema || !this.props.data) {
      return (
        <div/>
      );
    }

    // PAGINATION
    let break0, break1;
    const pagination0 = [], pagination1 = [], pagination2 = [];
    const numOfPages = this.calculateNumberOfPages();

    // First pass pagination
    const addToPagination = (pagination, i) => {
      pagination.push(
        <li key={'pagination' + i}
            className={this.props.pageId == i ? 'selected' : ''}
            onClick={e => {
              e.preventDefault();

              browserHistory.push(`${this.props.route}/${i}`);

              this.setState({ pageId: i })
            }}>
            <a href="#">{i}</a>
        </li>
      );
    }

    if (numOfPages <= 6) {
      for (let i = 1; i <= numOfPages; i++) {
        addToPagination(pagination1, i);
      }
    } else if (numOfPages > 6) {
      break1 = true;
      let currentPage = this.props.pageId;

      let bottomIndex = (currentPage - 1 < 1) ? 1 : (currentPage - 1);
      let upperIndex = bottomIndex + 2;

      if (upperIndex >= numOfPages - 2) {
        upperIndex = numOfPages - 3;
        bottomIndex = upperIndex - 2;
      }

      if (upperIndex + 1 >= numOfPages - 2) {
        break1 = false;
      }
      // populate pagination 1
      for (let i = bottomIndex; i <= upperIndex; i++) {
        addToPagination(pagination1, i);
      }

      for (let i = numOfPages - 2; i <= numOfPages; i++) {
        addToPagination(pagination2, i);
      }
    }

    // Slice data based on current pageId and display entries
    const data = this.props.data.slice(this.getEntry(), this.getExit());

    return (
      <div className="table-widget">
        <div className="row">
          <div className="col-md-12">
            <div className="table-collapsed"
                 style={!this.props.enableCollapsed ? {display: 'none'} : {}}>
              {
                this.props.enableCollapsed ? (
                  <TableCollapsed
                              onClick={this.props.onRowClick}
                              schema={this.props.schema}
                              data={data} />
                ) : null
              }
            </div>
            <div className={this.props.enableCollapsed ? 'full-width-table' : ''}>
              <table className="table table-hover">
                <thead>
                  <tr>
                  {
                    this.props.schema.heading.map(heading => <th>{heading}</th>)
                  }
                  </tr>
                </thead>
                <tbody className="list-of-posts">
                  {
                    data.map((post, index) => {
                      return (
                        <tr key={post.id + 'row'}
                            role="button"
                            style={!this.props.onRowClick ? {cursor: 'default'} : null}
                            key={index}
                            onClick={() => {
                              if (typeof this.props.onRowClick === 'function') {
                                this.props.onRowClick(post.id);
                              }
                            }}>
                            {
                              this.props.schema.body.map(item => {
                                const val = item.response(post);

                                return (
                                  <td key={item.id + val}
                                      className={'td-settings ' + item.classes}>
                                    {val}
                                  </td>
                                )
                              })
                            }
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
          {
            this.props.pagination ? (
              <div className="text-center">
                <nav>
                  <ul className="pagination">
                    {
                      this.showLeftArrow() ? (
                        <li onClick={e => {
                          e.preventDefault();

                          browserHistory.push(
                            `${this.props.route}/${(this.props.pageId || 1) - 1}`);
                        }}>
                          <a href="#">
                            <span>{'<'}</span>
                          </a>
                        </li>
                      ) : null
                    }
                    {
                      pagination0.length > 0 ? pagination0 : null
                    }
                    {
                      break0 ? (
                        <div style={{ float: 'left', margin: '0 7px' }}>...</div>
                      ) : null
                    }
                    {pagination1}
                    {
                      break1 ? (
                        <div style={{ float: 'left', margin: '0 7px' }}>...</div>
                      ) : null
                    }
                    {
                      pagination2.length > 0 ? pagination2 : null
                    }
                    {
                      this.showRightArrow() ? (
                        <li onClick={e => {
                          e.preventDefault();

                          browserHistory.push(
                            `${this.props.route}/${(this.props.pageId || 1) + 1}`);
                        }}>
                          <a href="#">
                            <span>{'>'}</span>
                          </a>
                        </li>
                      ) : null
                    }
                  </ul>
                </nav>
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
};

TableWidget.propTypes = {
  pageId: React.PropTypes.number,
  route: React.PropTypes.string,
}

TableWidget.defaultProps = {
  pagination: true,
  enableCollapsed: false
}

export default TableWidget
