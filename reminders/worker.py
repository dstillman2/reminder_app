from celery import Celery

from reminders.common.database import mysql_connection
from reminders import options


BROKER_REDIS = "redis://localhost:6379/0"

BROKER_RABBIT = "amqp://%s:%s@%s:%s" % (
    options.rabbit_user,
    options.rabbit_password,
    options.rabbit_host,
    options.rabbit_port,
)

BROKER_URL = BROKER_RABBIT if options.production else BROKER_REDIS

app = Celery(
    'tasks',
    broker=BROKER_URL,
    include=["reminders.tasks"],
)

# <CELERY_TASK_RESULT_EXPIRES> old results are cleaned up automatically.
app.conf.update(CELERY_TASK_RESULT_EXPIRES=3600)

# Initialize MySQL database
mysql_connection.init_db(
    user=options.mysql_user,
    password=options.mysql_password,
    host=options.mysql_host,
    name=options.mysql_schema,
)

if __name__ == "__main__":
    # Starts the worker. To boot up, use the following command in bash:
    # celery -A reminders.worker worker --loglevel=info
    app.start()
