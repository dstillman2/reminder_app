import { expect } from 'chai';
import registerHandlers from '../lib/express/register_handlers';

describe('lib/express/registerHandlers', () => {
  /**
   * Sample handler
   */
  class A {
    /**
     * @param {Object} req mock express request object
     * @param {Object} res mock express response object
     * @returns {void}
     */
    static get(req, res) {
      expect(req.path()).to.equal(0);
      expect(res.send()).to.equal(1);
    }

    /**
     * @param {Object} req mock express request object
     * @param {Object} res mock express response object
     * @returns {void}
     */
    static post(req, res) {
      expect(req.path()).to.equal(0);
      expect(res.send()).to.equal(1);
    }
  }

  // Array of handlers
  const handlers = [
    ['/test-route', A],
    ['/test-route2', A],
  ];

  // simuulate app
  const app = {
    req: {
      path() {
        return 0;
      },
    },

    res: {
      send() {
        return 1;
      },
    },

    get(originalUrl, method) {
      method(this.req, this.res);
    },

    post(originalUrl, method) {
      method(this.req, this.res);
    },
  };

  it('initializes the app handlers', () => {
    registerHandlers(app, handlers);
  });
});
