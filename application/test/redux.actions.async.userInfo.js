import { expect } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import '../lib/test_utils/ajax.globals';
import simHTTPRequest from '../lib/test_utils/ajax.mockHTTPRequest';
import { userInfoFetch, USER_INFO_FETCH_ERROR } from '../views/actions/ajax';

const middlewares = [thunk];
const store = configureMockStore(middlewares)({});

describe('actions/ajax/userInfoFetch', () => {
  afterEach(() => {
    store.clearActions();
  });

  it('sends user info ajax request [SUCCESS]', () => {
    const response = {
      data: [
        {
          email_address: 'dstillman2@gmail.com',
          first_name: 'Daniel',
          last_name: 'Stillman',
          address_1: null,
          address_2: null,
          zip_code: '52748',
          city: null,
          state: null,
          country_code: 'US',
          time_zone: 'US/Alaska',
          credits: 50,
          is_deleted: false,
          created_at: '2016-08-15T04:06:02.000Z',
          updated_at: '2016-08-16T03:03:36.000Z',
        },
      ],
      count: 1,
    };

    // Apply ajax mock
    simHTTPRequest(window.servers.web).get('/accounts').send(200, response);

    store.dispatch(userInfoFetch());

    const expectedResult = [
      {
        type: 'UPDATE_USER',
        email_address: 'dstillman2@gmail.com',
        first_name: 'Daniel',
        last_name: 'Stillman',
        company: undefined,
        error: undefined,
        address_1: null,
        address_2: null,
        zip_code: '52748',
        city: null,
        state: null,
        country_code: 'US',
        time_zone: 'US/Alaska',
        credits: 50,
      },
    ];

    expect(store.getActions()).to.deep.equal(expectedResult);
  });

  it('sends user info ajax request [FAILURE]', () => {
    const response = {
      jqXHR: {
        status: 500,
      },

      textStatus: null,
    };

    // Apply ajax mock
    simHTTPRequest(window.servers.web).get('/accounts').send(404, response);

    store.dispatch(userInfoFetch());

    const expectedResult = [
      {
        type: 'UPDATE_USER',
        company: undefined,
        email_address: undefined,
        first_name: undefined,
        last_name: undefined,
        address_1: undefined,
        address_2: undefined,
        zip_code: undefined,
        city: undefined,
        state: undefined,
        country_code: undefined,
        credits: undefined,
        time_zone: undefined,
        error: USER_INFO_FETCH_ERROR,
      },
    ];

    expect(store.getActions()).to.deep.equal(expectedResult);
  });
});
