from flask import Blueprint, jsonify, request

from webargs import fields
from webargs.flaskparser import use_args, use_kwargs

from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from reminders import schemas, models
from reminders.common.database import redis_connection, mysql_connection
from reminders.common.authentication import authenticate
from reminders.exceptions import InvalidResourceAPIError, invalid_resource_api_error


scripts = Blueprint("scripts", __name__)


# Register error messages
invalid_resource_api_error(scripts)


@scripts.after_request
def remove_db_session(response):
    """ After every request, remove the SQL session """
    mysql_connection.session.remove()

    return response


# Scripts GET Handler
@scripts.route("/scripts", methods=["get"])
@scripts.route("/scripts/<int:script_id>", methods=["get"])
@use_kwargs({
    "offset": fields.Int(location="query"),
    "limit": fields.Int(location="query"),
    "message_type": fields.String(location="query")
})
@authenticate
def get(script_id=None, message_type=None, offset=0, limit=10):
    output = {}

    query = mysql_connection.session.query(models.Script) \
        .filter(models.Script.account_id == request.user.account_id) \
        .filter(models.Script.is_deleted is False)

    if script_id:
        try:
            script = query.filter(models.Script.id == script_id) \
                .one()
        except (NoResultFound, MultipleResultsFound), e:
            raise InvalidResourceAPIError("script_id", script_id)
        else:
            output["data"] = schemas.Script().dump(script).data
    else:
        if message_type:
            query = query.filter(models.Script.type == message_type)

        output["count"] = query.count()

        scripts = query.offset(offset).limit(limit).all()

        output["data"] = schemas.Script(many=True).dump(scripts).data

    return jsonify(output)


# Scripts PUT Handler
@scripts.route("/scripts/<int:script_id>", methods=["put"])
@authenticate
@use_args(schemas.Script())
def put(args, script_id):
    output = {}

    query = mysql_connection.session.query(models.Script) \
        .filter(models.Script.id == script_id) \
        .filter(models.Script.account_id == request.user.account_id) \
        .filter(models.Script.is_deleted is False)

    try:
        script = query.one()
    except (NoResultFound, MultipleResultsFound), e:
        raise InvalidResourceAPIError("script_id", script_id)
    else:
        for key in args:
            setattr(script, key, args[key])

        mysql_connection.session.commit()

        output["data"] = schemas.Script().dump(script).data

    return jsonify(output)
