from datetime import datetime
from marshmallow import Schema, fields


class Script(Schema):
    id = fields.Integer(dump_only=True)

    name = fields.String(required=True)
    type = fields.String(required=True)
    content = fields.Raw(required=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    class Meta:
        strict = True
