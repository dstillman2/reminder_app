import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

const $ = window.$;

/**
 * Sidebar component of the overall framework
 */
class Sidebar extends Component {
  /**
   * Define initial state
   * @param {Object} props default props from parent component
   */
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * React componentDidMount method
   * @returns {void}
   */
  componentDidMount() {
    this.bodyEl = document.getElementsByTagName('body')[0];

    this.task = (e) => {
      this.setState({ isSidebarVisible: true });

      if (e.target.className !== 'email') {
        this.setState({ isSidebarVisible: false });
      }
    };

    this.bodyEl.addEventListener('click', this.task);

    // add a highlighted background to the selected sidebar element
    this.linkHighlight();
  }

  /**
   * React componentWillReceiveProps method
   * @returns {void}
   */
  componentWillReceiveProps() {
    // on every page change, add a linkHighlight
    this.linkHighlight();
  }

  /**
   * React componentWillMount method
   * @returns {void}
   */
  componentWillUnmount() {
    // Unbind document click listener. The login pages do not use the sidebar.
    this.bodyEl.removeEventListener('click', this.task);
  }

  /**
   * Highlights the active link.
   * @returns {void}
   */
  linkHighlight() {
    const tests = {
      credits: /credits/,
      dashboard: /dashboard/,
      contacts: /contacts/,
      send_reminder: /reminders.schedule/,
      phone_numbers: /phone_numbers/,
      customize_reminder: /reminders.customize/,
      settings: /settings/,
    };

    Object.keys(tests).forEach((key) => {
      if (tests[key].test(window.location.href)) {
        if (this.$activeLink) {
          this.$activeLink.removeClass('active');
        }

        this.$activeLink = $(this[key]);
        this.$activeLink.addClass('active');
      }
    });
  }

  /**
   * React render component
   * @returns {Object} jsx
   */
  render() {
    let displayBlock = { display: 'block' };

    if (!this.state.isSidebarVisible) {
      displayBlock = {};
    }

    const userPanel = (
      <div className="user">
        <li className="email" role="button">
          {this.props.email_address}
          <span className="glyphicon glyphicon-chevron-down nav-icons" />
          <ul style={displayBlock}>
            <li>
              <a
                href="#logout"
                onClick={(e) => {
                  e.preventDefault();

                  window.location.href = '/logout';
                }}
              >
                Logout
                <span className="glyphicon glyphicon-lock nav-glyph" />
              </a>
            </li>
          </ul>
        </li>
      </div>
    );

    return (
      <div id="sidebar">
        <div className="title">
          <div className="logo" />
        </div>
        {this.props.email_address && userPanel}
        <ul>
          <li data-seid="dashboard" ref={(c) => { this.dashboard = c; }}>
            <Link to="/dashboard">
              <span className="glyphicon glyphicon-list-alt nav-icons" />
              Dashboard
            </Link>
          </li>
          <li data-seid="send_reminder" ref={(c) => { this.send_reminder = c; }}>
            <Link to="/reminders/schedule">
              <span className="glyphicon glyphicon-send nav-icons" />
              Send a Reminder
            </Link>
          </li>
          <li data-seid="customize_reminder" ref={(c) => { this.customize_reminder = c; }}>
            <Link to="/reminders/customize/text">
              <span className="glyphicon glyphicon-pencil nav-icons" />
              Customize Reminders
            </Link>
          </li>
          <li data-seid="phone_numbers" ref={(c) => { this.phone_numbers = c; }}>
            <Link to="/phone_numbers">
              <span className="glyphicon glyphicon-earphone nav-icons" />
              Caller Identification
            </Link>
          </li>
          <li data-seid="credits" className="credits" ref={(c) => { this.credits = c; }}>
            <Link to="/credits/purchase">
              <span className="glyphicon glyphicon-grain nav-icons" />
              Credits
              <span className="badge">
                {this.props.credits}
              </span>
            </Link>
          </li>
          <li data-seid="settings" ref={(c) => { this.settings = c; }}>
            <Link to="/settings">
              <span className="glyphicon glyphicon-cog nav-icons" />
              Settings
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => (
  // gf random is to trigger link highlight on each page change
  {
    gf: Math.random(),
    email_address: state.userInfo.email_address,
    credits: state.userInfo.credits,
    loggedIn: state.login.loggedIn,
  }
);

export default connect(mapStateToProps)(Sidebar);

export { Sidebar };
