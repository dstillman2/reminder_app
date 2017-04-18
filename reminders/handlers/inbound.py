from flask import Blueprint, jsonify, request

from webargs import fields
from webargs.flaskparser import use_args, use_kwargs

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from reminders import schemas, models
from reminders.common.database import redis_connection, mysql_connection
from reminders.common.authentication import authenticate
from reminders.common.twilio_authentication import authenticate_twilio
from reminders.exceptions import InvalidResourceAPIError, invalid_resource_api_error


sms_inbound = Blueprint("sms_inbound", __name__)
voice_inbound = Blueprint("voice_inbound", __name__)


# Register error messages
invalid_resource_api_error(sms_inbound)
invalid_resource_api_error(voice_inbound)


@sms_inbound.after_request
def remove_db_session(response):
    """ After every request, remove the SQL session """
    mysql_connection.session.remove()

    return response


@voice_inbound.after_request
def remove_db_session(response):
    """ After every request, remove the SQL session """
    mysql_connection.session.remove()

    return response


@sms_inbound.route("/twilio/sms/<int:event_log_id>", methods=["post"])
@authenticate_twilio
@use_args({
    "MessageSid": fields.Str(),
    "SmsStatus": fields.Str(),
    "To": fields.Str(),
    "MessageStatus": fields.Str()
})
def post(args, event_log_id):
    query = mysql_connection.session.query(models.EventLog) \
        .filter(models.EventLog.id == event_log_id)

    event_log = query.one()

    event_log.target_phone_number = args.get("To")
    event_log.status = args.get("MessageStatus")
    event_log.sid = args.get("MessageSid")

    mysql_connection.session.commit()

    return ("", 204)
