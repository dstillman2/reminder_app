import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { changeTitle } from '../../actions/workspace';
import { userInfoFetch } from '../../actions/ajax';

import TextBox from '../form_fields/textbox';
import Dropdown from '../form_fields/dropdown';

import ajax from '../common/ajax';
import button from '../widgets/button';

/**
 * Credits component
 */
class Credits extends Component {
  /**
   * Set initial state
   * @param {Object} props default props
   */
  constructor(props) {
    super(props);

    this.state = {
      creditCount: 400,
      creditCost: '$20.00',
      panel: 1,
    };
  }

  componentWillMount() {
    // change title to 'Credits' in workspace.jsx
    this.props.dispatch(changeTitle('Add Credits'));
  }

  /**
   * Converts the credit count to a monetary value. If the price is below $10,
   * show an error message. If the price isn't a valid number, throw an error
   * message.
   * @returns {void}
  */
  onChangeCredits() {
    // value is the entered credit # by the user.
    const value = this.refs.credits.getValue();

    // verify the value is a valid int
    const creditCount = parseInt(value, 10) || 'N/A';

    if (/^\d+$/.test(value)) {
      // the customer input contains all numbers
      const price = parseFloat(value * 0.05).toFixed(2);

      if (price < 10) {
        // the customer input is invalid (less than $10)
        return this.setState({
          creditsErrorMessage: 'Minimum purchase of $10 is required.',
          creditCount,
          creditCost: `$${price}`,
        });
      }

      // the customer input is valid
      this.setState({
        creditsErrorMessage: null,
        creditCount,
        creditCost: `$${price}`,
      });
    } else {
      // the customer input is invalid (not a number)
      this.setState({
        creditsErrorMessage: 'An invalid number was entered.',
        creditCount,
        creditCost: 'N/A',
      });
    }
  }

  getStripeToken(data, successCallback, errorCallback) {
    /* Create a stripe source id, which is stripe's way of handling sensitive
    customer data so we don't have to. This function takes in credit card data
    and returns a source id. The source id is necessary to make a charge to the
    customer's credit card.
    */
    Stripe.setPublishableKey(window.stripePublishableKey);

    this.setState({ loading: true });

    Stripe.card.createToken({
      number: data.card_number || '',
      cvc: data.cvc,
      exp_month: data.exp_month,
      exp_year: data.exp_year,
      name: data.card_holder,
    }, (status, response) => {
      if (response.error) {
        this.setState({
          errorMessage: response.error.message,
          loading: false,
        });

        // TDOO: handle error message for on create
        if (errorCallback) {
          errorCallback(response.error);
        }
      } else {
        // sends back the tokenId in an opject
        successCallback({
          token: response.id,
        });
      }
    });
  }

  onPurchase() {
    /* First retrieve the stripe token id. To do this, the credit card information
    needs to be passed over to stripe. If this action is successful, make an
    ajax request in order to process the purchase.
    */
    const data = {
      card_number: this.refs.card_number.getValue(),
      cvc: this.refs.cvc.getValue(),
      exp_month: this.refs.exp_month.getValue(),
      exp_year: this.refs.exp_year.getValue(),
      name: this.refs.card_holder.getValue(),
    };

    this.getStripeToken(data, response => {
      const params = {
        api: 'web',
        path: '/billing',
        method: 'POST',
        data: {
          stripeToken: response.token,
          creditCount: this.state.creditCount,
          creditCost: this.state.creditCost,
          description: 'credit purchase'
        },
        successCallback: (response) => {
          this.props.dispatch(userInfoFetch(self));

          this.setState({
            panel: 3,
            creditsPurchased: response.numOfCredits,
            pricePurchased: response.price,
            loading: false,
          });
        },
        errorCallback: (error) => {
          if (error.responseJSON && error.responseJSON.error) {
            var errorMessage = error.responseJSON.error.message;
          }

          this.setState({
            errorMessage: errorMessage || 'Unable to process request. Please contact support.',
            loading: false,
          });
        }
      }

      ajax(params);
    });
  }

  render() {
    /* Panel totalPricePanel shows the user their selection on the number of
    credits they wish to purchase.
    */
    const buttons = (
      <div className="row">
        <div className="col-md-12" style={{marginBottom: 20}}>
          <div className="btn btn-primary btn-styling disabled pills"
                  style={{marginRight: 10, marginBottom: 5}}>
            Add Credits
          </div>
          <button className="btn btn-primary btn-styling pills"
                  style={{marginBottom: 5}}
                  onClick={() => browserHistory.push('/credits/transaction_history/1')}>
            Transaction History
          </button>
        </div>
      </div>
    );

    const totalPricePanel = (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <hr style={{marginTop: 0}} />
            <button
              data-id="account_info"
              onClick={() => this.setState({ panel: 1 })}
              style={{marginTop: -5, marginBottom: 15}}
              className="btn btn-info btn-styling sm pull-right">
              Back
            </button>
            <h5>Credits Summary</h5>
            <hr/>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h5><b>Credits:</b>&nbsp;&nbsp; {this.state.creditCount}</h5>
            <h5><b>Total Price:</b>&nbsp;&nbsp; {this.state.creditCost}</h5>
          </div>
        </div>
      </div>
    );

    /* Panel addCreditPanel allows the user to input how many credits they want
    to purchase.
    */
    const addCreditPanel = (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <hr style={{marginTop: 0}}/>
            <h5>Add Credits (5 cents / credit)</h5>
            <hr/>
          </div>
        </div>
        <form>
          <div className="row">
            <div className="col-md-8">
              <TextBox ref="credits"
                       onChange={() => this.onChangeCredits()}
                       maxLength="6"
                       defaultValue={this.state.creditCount}
                       label="Number of Credits"
                       placeholder="# of Credits"/>
            </div>
          </div>
          {
            this.state.creditsErrorMessage ? (
              <div className="login-error-message"
                   style={{margin: '5px 0 -5px 0'}}>
                {this.state.creditsErrorMessage}
              </div>
            ) : null
          }
          <div className="row">
            <div className="col-md-8">
              <button className="btn btn-primary btn-styling pull-right"
                      onClick={e => {
                        e.preventDefault();

                        if (!this.state.creditsErrorMessage) {
                          this.setState({ panel: 2 })
                        }
                      }}>
                Next Step
              </button>
            </div>
          </div>
        </form>
      </div>
    );

    // Credit card form fields
    const creditCardPanel = (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <hr/>
            <h5>Credit Card</h5>
            <hr/>
          </div>
        </div>
        {
          this.state.errorMessage ? (
            <center>
              <div className="login-error-message"
                   style={{margin: '5px 0 -5px 0'}}>
                {this.state.errorMessage}
              </div>
            </center>
          ) : null
        }
        <div className="row">
          <div className="col-md-8">
            <TextBox ref="card_holder"
                     label="Name"
                     placeholder="Full Name"/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <TextBox ref="card_number"
                     maxLength="20"
                     label="Card Number"
                     placeholder="Card Number"/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <Dropdown ref="exp_month"
                      label="Expiration Month"
                      options={expMonthOptions}/>
          </div>
          <div className="col-sm-6 col-md-4">
            <Dropdown ref="exp_year"
                      label="Expiration Year"
                      options={expYearOptions}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <TextBox ref="cvc"
                     maxLength="5"
                     label="CVC"
                     placeholder="CVC"/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <hr/>
            {
              button({
                buttonName: 'Purchase',
                pullRight: true,
                isLoading: this.state.loading,
                onClick: () => this.onPurchase()
              })
            }
            <button className="btn btn-default btn-styling pull-right"
                    style={{marginRight: 10}}
                    onClick={() => {
                      this.setState({panel: 1})
                    }}>
              Back
            </button>
          </div>
        </div>
      </div>
    );

    /* After the user has successfully completed a purchase, the screen will swap
    over to the onPurchase window.
    */
    const onPurchasePanel = (
      <div>
        <div className="row">
          <div className="col-md-12">
            <hr/>
          </div>
          <div className="col-md-12" style={{margin: '15px 0'}}>
            Thank you for your purchase of ${this.state.pricePurchased / 100}. <b>
            {this.state.creditsPurchased}</b> credits have been added to your account.
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-primary btn-styling pull-right"
                    onClick={() => {
                      this.setState({panel: 1})
                    }}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );

    /* Panel #s are stored in the state and dictate what is shown to the user.
    */
    return (
      <div className="form-contents">
        {buttons}
        {
          this.state.panel === 1 ? (
              addCreditPanel
          ) : null
        }
        {
          this.state.panel === 2 ? ([
            totalPricePanel,
            creditCardPanel
          ]) : null
        }
        {
          this.state.panel === 3 ? (
            onPurchasePanel
          ) : null
        }
      </div>
    );
  }
}

// generate exp Months and exp Years in an array
const expMonthOptions = [], expYearOptions = [];

for (let i = 1; i <= 12; i++) {
  expMonthOptions.push({
    label: i,
    value: i,
  });
}

for (let i = 2016; i <= 2050; i++) {
  expYearOptions.push({
    label: i,
    value: i,
  });
}

export default connect()(Credits);
