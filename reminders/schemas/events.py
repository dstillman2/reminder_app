from datetime import datetime
from marshmallow import Schema, fields

from reminders import models

from phone_numbers import PhoneNumber

class Event(Schema):
    id = fields.Integer(dump_only=True)

    type = fields.String(required=True)

    send_time = fields.Integer(required=True)
    appointment_time = fields.Integer(required=True)
    caller_id = fields.Integer(required=False)
    targets = fields.Raw(required=True)

    status = fields.String(dump_only=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    phone_number = fields.Nested(PhoneNumber)

    class Meta:
        strict = True
