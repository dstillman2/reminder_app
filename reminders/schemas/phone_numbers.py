from datetime import datetime
from marshmallow import Schema, fields

from reminders import models


class PhoneNumber(Schema):
    id = fields.Integer(dump_only=True)

    phone_number = fields.String(required=True)
    friendly_name = fields.String(required=True)

    next_billing_cycle = fields.DateTime(required=True)

    active = fields.DateTime(required=True)
    is_deleted = fields.Boolean(required=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
