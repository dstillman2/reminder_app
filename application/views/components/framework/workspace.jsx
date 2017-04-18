import React, { Component } from 'react';
import { connect } from 'react-redux';

import SideBar from './sidebar';
import Modal from './modal';
import { userInfoFetch } from '../../actions/ajax';
import { fetchEvents } from '../../actions/events';
import { fetchScripts } from '../../actions/scripts';
import { fetchPhoneNumbers } from '../../actions/phone_numbers';

const $ = window.$;

/**
 * Workspace component is the root component containing the sidebar, titlebar,
 * and the main content as its children.
 */
class Workspace extends Component {
  /**
   * ComponentDidMount - fetch user information, phone numbers, events, and
   * scripts. Pre-fetch reduces loading times for other screens.
   * @returns {void}
   */
  componentDidMount() {
    this.props.dispatch(userInfoFetch());
    this.props.dispatch(fetchPhoneNumbers());
    this.props.dispatch(fetchEvents());
    this.props.dispatch(fetchScripts());
  }

  /**
   * Function is triggered when the user wishes to expand the sidebar. The sidebar
   * is removed due to media query sizing and can be expanded by clicking the
   * hamburger icon.
   * @returns {void}
   */
  onToggleSidebar() {
    $('#main').toggleClass('show-sidebar');
    $('#sidebar').toggleClass('add-z-index');
  }

  /**
   * React component render method
   * @returns {Object} returns jsx
   */
  render() {
    return (
      <div>
        <div id="workspace">
          <SideBar />
          <div id="main">
            <div className="header">
              <div
                className="glyphicon glyphicon-menu-hamburger header-nav sidebar-menu"
                onClick={this.onToggleSidebar}
              />
              <div className="header-title text-center">
                <div className="header-title-name">
                  {this.props.title}
                </div>
              </div>
            </div>
            <div id="content">
              {this.props.children}
            </div>
          </div>
        </div>
        <Modal />
      </div>
    );
  }
}

Workspace.defaultProps = {
  title: '',
};

Workspace.propTypes = {
  children: React.PropTypes.any.isRequired,
  title: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
};

export default connect(state => state.workspace)(Workspace);
