import redis from 'redis';
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_SCHEMA, PRODUCTION } from '../options';

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_SCHEMA,
  },
});

const redisClient = PRODUCTION ? redis.createClient(6379, 'redis') : redis.createClient();

export { knex, redisClient as redis };

export default {
  knex,
  redis: redisClient,
};
