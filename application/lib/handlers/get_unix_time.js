/**
 * Creates instance from the Date constructor in utc time.
 * @returns {Object} utc date object
 */
function getUnixTime() {
  const now = new Date();

  const nowUtc = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  );

  return nowUtc;
}

export { getUnixTime };

export default getUnixTime;
