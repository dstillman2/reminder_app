import { expect } from 'chai';
import rateLimiter from '../middleware/rate_limiter';

describe('lib/middleware/rateLimiter', () => {
  const req = {
    ip: '127.0.0.1',
  };

  it('blocks the IP address', (done) => {
    let times = 1;
    let nextCount = 0;
    let failCount = 0;

    const middleware = rateLimiter(3, 4);
    const res = {
      status() {
        return {
          json() {
            failCount += 1;

            expect(nextCount).to.equal(3);
            expect(failCount).to.equal(1);

            done();
          },
        };
      },
    };
    const next = function next() {
      nextCount += 1;
    };
    const callMiddleware = function callMiddleware() {
      middleware(req, res, next);

      if (times < 10) {
        setTimeout(() => {
          callMiddleware();
          times += 1;
        }, 500);
      }
    };

    callMiddleware();
  }).timeout(5000);
});
