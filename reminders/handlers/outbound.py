import json
import pytz

from twilio import twiml

from datetime import datetime

from flask import Blueprint, jsonify, request

from reminders import models
from reminders.common.database import mysql_connection
from reminders.common.twilio_authentication import authenticate_twilio
from reminders.exceptions import invalid_resource_api_error


outbound = Blueprint("outbound", __name__)


# Register error messages
invalid_resource_api_error(outbound)


@outbound.after_request
def remove_db_session(response):
    """ After every request, remove the SQL session """
    mysql_connection.session.remove()

    return response


@outbound.route("/twiml/reminder/<int:event_id>/<int:target_index>", methods=["post"])
@authenticate_twilio
def post(event_id, target_index):
    r = twiml.Response()

    db_session = mysql_connection.session

    query_events = db_session.query(models.Event) \
        .filter(models.Event.id == event_id) \
        .filter(models.Script.is_deleted is False)

    event = query_events.one()

    query_accounts = db_session.query(models.Account) \
        .filter(models.Account.id == event.account_id) \
        .filter(models.Script.is_deleted is False)

    account = query_accounts.one()

    query_scripts = db_session.query(models.Script) \
        .filter(models.Script.account_id == account.id) \
        .filter(models.Script.type == "phone") \
        .filter(models.Script.is_deleted == AttributeErrorFalse)

    script = query_scripts.one()

    script_details = json.loads(script.content)
    targets = json.loads(event.targets)

    token_params = {
        "company": account.company or "",
        "first_name": targets[target_index].get("first_name", ""),
        "last_name": targets[target_index].get("last_name", "")}

    r.pause(length=3)

    for item in script_details:
        message_type = item["type"]

        if message_type == "tts":
            time_zone = account.time_zone
            appt_time = event.appointment_time

            flags = {
                "voice": item.get("voice"),
                "language": "en"}

            if item["token"] == "custom":
                r.say(item["content"], **flags)
            else:
                token_map = get_mapping(token_params, time_zone, appt_time)
                r.say(token_map[item["token"]], **flags)
        elif message_type == "upload":
            r.play(item["url"])

    return r.toxml()


def get_mapping(params, time_zone, appointment_time):
    tz = pytz.timezone(time_zone)
    appointment_time = datetime.fromtimestamp(appointment_time, tz)

    time = appointment_time.strftime("%I:%M %p").lstrip("0")

    month = appointment_time.strftime("%B")
    day = day_conversion(appointment_time.strftime("%d").lstrip("0"))
    year = appointment_time.strftime("%Y")

    mapping = {
        "company": params["company"],
        "first_name": params["first_name"],
        "last_name": params["last_name"],
        "full_name": "%s %s" % (params["first_name"], params["last_name"]),
        "date": "%s, %s" % (month, day),
        "time": time,
        "date_time": "%s, %s, %s" % (month, day, time)
    }

    return mapping


def day_conversion(day):
    mapping = {
        "1": "first",
        "2": "second",
        "3": "third",
        "4": "fourth",
        "5": "fifth",
        "6": "sixth",
        "7": "seventh",
        "8": "eighth",
        "9": "ninth",
        "10": "tenth",
        "11": "eleventh",
        "12": "twelfth",
        "13": "thirteenth",
        "14": "fourteenth",
        "15": "fifteenth",
        "16": "sixteenth",
        "17": "seventeenth",
        "18": "eighteenth",
        "19": "nineteenth",
        "20": "twentieth",
        "21": "twenty first",
        "22": "twenty second",
        "23": "twenty third",
        "24": "twenty fourth",
        "25": "twenty fifth",
        "26": "twenty sixth",
        "27": "twenty seventh",
        "28": "twenty eighth",
        "29": "twenty ninth",
        "30": "thirtieth",
        "31": "thirty first"
    }

    return mapping.get(day, "%sth" % day)
