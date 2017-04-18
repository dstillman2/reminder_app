from flask import Flask
from flask_cors import CORS

import options

from reminders import handlers
from reminders.common.database import mysql_connection, redis_connection


app = Flask(__name__, static_url_path="/static")


cors_options = {
    "app": app,
    "supports_credentials": True,
}

CORS(**cors_options)


# Register Application Handlers
app.register_blueprint(handlers.events)
app.register_blueprint(handlers.events_demo)
app.register_blueprint(handlers.s3)
app.register_blueprint(handlers.scripts)
app.register_blueprint(handlers.sms_inbound)
app.register_blueprint(handlers.voice_inbound)
app.register_blueprint(handlers.outbound)


# Initialize MySQL database
mysql_connection.init_db(
    user=options.mysql_user,
    password=options.mysql_password,
    host=options.mysql_host,
    name=options.mysql_schema
)


# Initialize Redis database
redis_connection.init_db(
    host=options.redis_host,
    port=options.redis_port,
    db=options.redis_db
)


if __name__ == "__main__":
    # <threaded> needs to be disabled for production. It makes the local env
    # faster. <host> should be "0.0.0.0" for prod.
    app.run(
        port=options.port,
        host="0.0.0.0" if options.production else "localhost",
        threaded=(False if options.production else True),
    )
