import { expect } from 'chai';
import reducer from '../views/reducers/userInfo';

describe('reducers/userInfo/userInfo', () => {
  describe('case UPDATE_CREDITS', () => {
    it('should return a new state', () => {
      const action = {
        type: 'UPDATE_CREDITS',
        credits: 500,
      };

      expect(reducer(null, action)).to.deep.equal({
        credits: 500,
      });
    });
  });

  describe('case UPDATE_USER', () => {
    it('should return a new state', () => {
      const initialState = {
        zip_code: 94539,
        last_name: 'Frank',
      };

      const action = {
        type: 'UPDATE_USER',
        email_address: 'email',
        first_name: 'Daniel',
        last_name: 'Stillman',
      };

      expect(reducer(initialState, action)).to.deep.equal({
        email_address: 'email',
        first_name: 'Daniel',
        last_name: 'Stillman',
        address_1: undefined,
        address_2: undefined,
        company: undefined,
        zip_code: 94539,
        city: undefined,
        state: undefined,
        country_code: undefined,
        credits: undefined,
        time_zone: undefined,
      });
    });
  });

  describe('case default', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.eql({});
    });
  });
});
