import redis

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base


class MysqlConnection(object):
    def __init__(self):
        self._engine = None
        self._session = None

    def init_db(self, user, password, host, name):
        self._engine = create_engine("mysql+pymysql://%s:%s@%s/%s" % (
            user,
            password,
            host,
            name
        ), pool_recycle=3600)

        self._session = scoped_session(sessionmaker(bind=self._engine))

    @property
    def session(self):
        return self._session


class RedisConnection(object):
    def __init__(self):
        self._redis = None

    def init_db(self, host="localhost", port=6379, db=0):
        self._redis = redis.StrictRedis(
            host=host,
            port=port,
            db=db
        )

    @property
    def session(self):
        return self._redis


mysql_connection = MysqlConnection()
redis_connection = RedisConnection()

Base = declarative_base()
