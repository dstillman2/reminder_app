import json
import pytz
from datetime import datetime

from sqlalchemy.sql import func
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from reminders import models, options
from reminders.worker import app
from reminders.tasks._base import BaseReminderTask
from reminders.models import Event, Script, Account
from reminders.tasks_lib import get_shared_caller_id


@app.task(base=BaseReminderTask, bind=True)
def send_phone_reminder(self, event_id, account_id):
    """ Celery task: send a text reminder to recipient(s) """
    twilio_client = self.twilio
    mysql_session = self.mysql

    # Query events, scripts, and accounts table
    query_events = mysql_session.query(models.Event) \
        .filter(models.Event.id == event_id) \
        .filter(models.Event.account_id == account_id) \
        .filter(models.Event.status == "pending") \
        .filter(models.Event.is_deleted is False)

    event = query_events.one()

    query_scripts = mysql_session.query(models.Script) \
        .filter(models.Script.account_id == account_id) \
        .filter(models.Script.type == "text") \
        .filter(models.Script.is_deleted is False)

    query_accounts = mysql_session.query(models.Account) \
        .filter(models.Account.id == account_id) \
        .filter(models.Account.is_deleted is False)

    script = query_scripts.one()
    account = query_accounts.one()

    caller_id = None

    # Determine if a caller_id is specified. If not, use a random caller_id.
    if event.caller_id:
        query_phone_numbers = mysql_session.query(models.PhoneNumber) \
            .filter(models.PhoneNumber.id == event.caller_id) \
            .filter(models.PhoneNumber.account_id == account_id) \
            .filter(models.PhoneNumber.is_active is True) \
            .filter(models.PhoneNumber.is_deleted is False)

        try:
            phone_number = query_phone_numbers.one()
        except (NoResultFound, MultipleResultsFound), e:
            caller_id = get_shared_caller_id()
        else:
            caller_id = phone_number.phone_number
    else:
        caller_id = get_shared_caller_id()

    # Convert epoch time to available variable parameters
    tz = pytz.timezone(account.time_zone)
    appt_time = datetime.fromtimestamp(event.appointment_time, tz)

    date = appt_time.strftime("%x").lstrip("0")
    time = appt_time.strftime("%I:%M %p").lstrip("0")

    # Call each of the targets
    targets = json.loads(event.targets)

    # counts the number of successful text messages
    credit_count = 0

    # make calls to targets
    for index, target in enumerate(targets):
        status = None
        reason = None

        try:
            results = {
                "event_id": event.id,
                "account_id": account.id,
                "type": "phone",
                "script": script.content,
                "caller_id": caller_id,
                "target_first_name": target.get("first_name"),
                "target_last_name": target.get("last_name"),
                "reason": reason,
            }

            event_log = models.EventLog(**results)
            mysql_session.add(event_log)
            mysql_session.flush()

            call = twilio_client.calls.create(
                to=target["phone_number"],
                from_=caller_id,
                if_machine='Continue',
                url="https://%s/twiml/reminder/%s/%s" % (
                    options.domain, event.id, index))
        except Exception, e:
            reason = str(e)
        else:
            status = "completed"

            transaction_params = {
                "account_id": account.id,
                "event_id": event.id,
                "credits": -1,
                "price": -5,
                "reason": "event"
            }

            credit_transactions = models.CreditTransaction(**transaction_params)

            mysql_session.add(credit_transactions)
            mysql_session.commit()

            credit_count += 1
        finally:
            if not status:
                status = "failed"

            if reason and status == "failed":
                event_log.status = status
                event_log.reason = reason

            mysql_session.commit()

    # Update event status
    if credit_count == 0:
        event.status = "failed"
    else:
        event.status = "complete"

    # Recalculate account credits: sum all transactions
    credits = mysql_session.query(models.CreditTransaction.account_id, \
                func.sum(models.CreditTransaction.credits).label("sum")) \
        .filter(models.CreditTransaction.account_id==account.id) \
        .one()

    # Update accounts
    account.credits = credits.sum

    mysql_session.commit()
