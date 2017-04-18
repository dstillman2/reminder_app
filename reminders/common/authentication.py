import json
import urllib

from functools import wraps
from flask import request, Response

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from reminders.common.database import redis_connection, mysql_connection
from reminders.models import Account, User


def send_401_response():
    return Response("Could not verify your access level for that URL.\n", 401)


def send_429_response():
    return Response("Too many requests for that URL.\n", 429)


def get_user_account(username):
    if not username:
        return None

    session = redis_connection.session.get("cb:%s:session" % username)

    if not session:
        return None

    user_id = json.loads(session).get("user_id")

    query = mysql_connection.session.query(User) \
        .filter(User.id == user_id) \
        .filter(User.is_deleted is False)

    try:
        user = query.one()
    except (NoResultFound, MultipleResultsFound), e:
        return None
    else:
        return user


def is_demo_cookie_valid(value):
    # decode UTF-8 encoded bytes escaped with URL quoting
    decoded_value = urllib.unquote(value)
    demo_session = redis_connection.session.get(decoded_value)

    if demo_session:
        redis_cookie_content = json.loads(demo_session)

        count = redis_cookie_content["count"]

        if count < 3:
            new_count = json.dumps({"count": count + 1})

            redis_connection.session.set(decoded_value, new_count)

            return True

    return False


def demo_authenticate(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        demo_session_cookie_value = request.cookies.get("demo_session")

        if demo_session_cookie_value:
            # User is authorized to access the events handler for
            if is_demo_cookie_valid(demo_session_cookie_value):
                request.valid_demo_session = True

                return f(*args, **kwargs)
            else:
                return send_429_response()

        return send_401_response()

    return decorated


def authenticate(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization

        if not auth:
            return send_401_response()

        user_account = get_user_account(auth.username)

        if not user_account:
            return send_401_response()

        request.user = user_account

        return f(*args, **kwargs)

    return decorated
