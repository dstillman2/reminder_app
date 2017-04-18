import os

port = os.getenv("PORT", 4444)

production = os.getenv("PRODUCTION", False)

mysql_user = os.getenv("MYSQL_USER", "root")
mysql_password = os.getenv("MYSQL_PASSWORD", "mysql")
mysql_host = os.getenv("MYSQL_HOST", "127.0.0.1")
mysql_schema = os.getenv("MYSQL_SCHEMA", "cb")

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_db = os.getenv("REDIS_DB", 0)

twilio_sid = os.getenv("TWILIO_SID")
twilio_auth = os.getenv("TWILIO_AUTH")

domain = os.getenv("DOMAIN")

rabbit_user = os.getenv("RABBIT_USER", "guest")
rabbit_password = os.getenv("RABBIT_PASSWORD", "guest")
rabbit_host = os.getenv("RABBIT_HOST", "192.168.99.100")
rabbit_port = os.getenv("RABBIT_PORT", "5672")
