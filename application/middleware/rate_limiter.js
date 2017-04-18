import { PRODUCTION } from '../options';

// TODO: move over to Redis for clean up and for permitting multiple server instances
// Redis use SETEX, stringify ipAddress array. key is the IP Address used

// In-memory IP log
const ipLog = {};

/**
 * Rate limiter to limit the number of attempts the user can perform a task during
 * a specified time period.
 * @param {Number} attempts The number of attempts allowed for a specified time period
 * @param {Number} seconds The number of seconds the number of attempts must not exceed
 * @returns {void}
 */
function rateLimiter(attempts = 3, seconds = 5) {
  return (req, res, next) => {
    const ipAddress = PRODUCTION
      ? (req.header('x-forwarded-for') || req.connection.remoteAddress)
      : req.ip;
    const currentEpochTime = new Date().getTime() / 1000;

    // returns an array of epoch times
    const userIpLogArray = ipLog[ipAddress];

    if (userIpLogArray) {
      userIpLogArray.push(currentEpochTime);
    } else {
      ipLog[ipAddress] = [currentEpochTime];

      next();

      return;
    }

    // The user has not attempted to log in sufficient times to block authentication
    if (userIpLogArray.length <= attempts) {
      next();

      return;
    }

    const lastIndex = userIpLogArray.length - 1;

    if (userIpLogArray[lastIndex] - userIpLogArray[lastIndex - attempts] < seconds) {
      res.status(401).json({ error: 'Too many attempts' });

      return;
    }

    next();
  };
}

export default rateLimiter;
export { ipLog };
