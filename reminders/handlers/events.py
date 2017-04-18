import time

from flask import Blueprint, jsonify, request

from webargs import fields
from webargs.flaskparser import use_args, use_kwargs

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from reminders.worker import app

from reminders import schemas, models
from reminders.common.database import redis_connection, mysql_connection
from reminders.common.authentication import authenticate
from reminders.exceptions import InvalidResourceAPIError, invalid_resource_api_error
from reminders.tasks import send_text_reminder, send_phone_reminder


events = Blueprint("events", __name__)


# Register error messages
invalid_resource_api_error(events)


@events.after_request
def remove_db_session(response):
    """ After every request, remove the SQL session """
    mysql_connection.session.remove()

    return response


# Events GET Handler
@events.route("/events", methods=["get"])
@events.route("/events/<int:event_id>", methods=["get"])
@use_kwargs({
    "offset": fields.Int(missing=0, location="query"),
    "limit": fields.Int(missing=10, location="query"),
    "order_by": fields.String(missing=None, location="query")
})
@authenticate
def get(event_id=None, offset=0, limit=10, order_by=None):
    output = {}

    query = mysql_connection.session.query(models.Event) \
        .filter(models.Event.account_id == request.user.account_id) \
        .filter(models.Event.is_deleted is False)

    if event_id:
        try:
            event = query.filter(models.Event.id == event_id) \
                .one()
        except (NoResultFound, MultipleResultsFound), e:
            raise InvalidResourceAPIError("event_id", event_id)
        else:
            output["data"] = schemas.Event().dump(event).data
    else:
        output["count"] = query.count()

        if order_by == "desc":
            query = query.order_by(models.Event.id.desc())

        events = query.offset(offset).limit(limit).all()

        output["data"] = schemas.Event(many=True).dump(events).data

    return jsonify(output)


# Events POST Handler
@events.route("/events", methods=["post"])
@authenticate
@use_args(schemas.Event())
def post(args):
    output, params = {}, {}

    params["account_id"] = request.user.account_id
    params["status"] = "pending"
    params.update(args)

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


# Events PUT Handler
@events.route("/events/<int:event_id>", methods=["put"])
@authenticate
@use_args(schemas.Event())
def put(args, event_id):
    output = {}

    query = mysql_connection.session.query(models.Event) \
        .filter(models.Event.id == event_id) \
        .filter(models.Event.account_id == request.user.account_id) \
        .filter(models.Event.is_deleted is False)

    try:
        event = query.one()
    except (NoResultFound, MultipleResultsFound), e:
        raise InvalidResourceAPIError("event_id", event_id)
    else:
        for key in args:
            setattr(event, key, args[key])

        # mysql_connection.session.commit()

        output["data"] = schemas.Event().dump(event).data

    return jsonify(output)


# Events DELETE Handler
@events.route("/events/<int:event_id>", methods=["delete"])
@authenticate
def delete(event_id):
    output = {}

    query = mysql_connection.session.query(models.Event) \
        .filter(models.Event.id == event_id) \
        .filter(models.Event.status == "pending") \
        .filter(models.Event.account_id == request.user.account_id) \
        .filter(models.Event.is_deleted is False)

    try:
        event = query.one()
    except (NoResultFound, MultipleResultsFound), e:
        raise InvalidResourceAPIError("event_id", event_id)

    try:
        app.control.revoke(event.task_id)
    except Exception, e:
        print e

    event.status = "deleted"
    event.is_deleted = True

    mysql_connection.session.commit()

    output["data"] = schemas.Event().dump(event).data

    return jsonify(output)
