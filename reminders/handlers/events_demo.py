import time
import json

from flask import Blueprint, jsonify, request

from webargs import fields
from webargs.flaskparser import use_args, use_kwargs

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from reminders.worker import app

from reminders import schemas, models
from reminders.common.database import redis_connection, mysql_connection
from reminders.common.authentication import authenticate, demo_authenticate
from reminders.exceptions import InvalidResourceAPIError, invalid_resource_api_error
from reminders.tasks import send_text_reminder, send_phone_reminder


events_demo = Blueprint("events_demo", __name__)


# Register error messages
invalid_resource_api_error(events_demo)


@events_demo.after_request
def remove_db_session(response):
    """ After every request, remove the SQL session """
    mysql_connection.session.remove()

    return response


# Events Demo POST Handler
@events_demo.route("/events/demo", methods=["post"])
@demo_authenticate
@use_args({
    "type": fields.Str(required=True),
    "targets": fields.Str(required=True)
})
def post(args):
    output, params = {}, {}

    params.update(args)
    contact = json.loads(args["targets"])

    contact[0]["first_name"] = "John"
    contact[0]["last_name"] = "Doe"

    params["account_id"] = 4
    params["send_time"] = 0
    params["appointment_time"] = int(time.time())
    params["targets"] = json.dumps(contact)
    params["status"] = "pending"

    event = models.Event(**params)

    mysql_connection.session.add(event)
    mysql_connection.session.commit()

    countdown_in_seconds = event.send_time - int(time.time())

    task = None

    try:
        if event.type == "text":
            task = send_text_reminder.apply_async(
                args=[event.id, event.account_id],
                countdown=countdown_in_seconds)
        if event.type == "phone":
            task = send_phone_reminder.apply_async(
                args=[event.id, event.account_id],
                countdown=countdown_in_seconds)
    except Exception:
        pass

    if not (task and task.id):
        event.is_deleted = True
        mysql_connection.session.commit()

        return ("", 500)

    event.task_id = task.id

    mysql_connection.session.commit()

    output["data"] = schemas.Event().dump(event).data

    return jsonify(output)
