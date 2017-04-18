from functools import wraps

from flask import request, Response
from twilio.util import RequestValidator

from reminders.options import twilio_auth, domain


def send_401_response():
    return Response(
            "Could not verify your access level for that URL.\n", 401
        )


def authenticate_twilio(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        twilio_signature = request.headers.get("X-Twilio-Signature")

        if not twilio_signature:
            return send_401_response()

        validator = RequestValidator(twilio_auth)

        url = request.url.replace(
            "http://",
            request.headers.get("X-Forwarded-Proto", "http") + "://")

        if validator.validate(url, request.form, twilio_signature):
            return f(*args, **kwargs)
        else:
            return send_401_response()

    return decorated
