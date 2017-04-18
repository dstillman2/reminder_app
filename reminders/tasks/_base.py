from twilio.rest import TwilioRestClient

from reminders import options
from reminders.worker import app
from reminders.common.database import mysql_connection, redis_connection
from reminders.models import Event


class BaseReminderTask(app.Task):
    abstract = True

    @property
    def mysql(self):
        return mysql_connection.session

    @property
    def redis(self):
        return redis_connection.session

    @property
    def twilio(self):
        client = TwilioRestClient(options.twilio_sid, options.twilio_auth)

        return client

    def after_return(self, status, retval, task_id, args, *gargs):
        mysql_session = self.mysql

        mysql_session.remove()

    def on_failure(self, exc, task_id, args, kwargs, ico):
        mysql_session = self.mysql

        query = mysql_session.query(Event) \
            .filter(Event.id == args[0]) \
            .filter(Event.account_id == args[1]) \
            .filter(Event.is_deleted is False)

        try:
            event = query.one()
        except Exception:
            pass
        else:
            event.status = "failed"

            mysql_session.commit()
