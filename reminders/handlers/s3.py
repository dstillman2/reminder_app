import uuid

import boto3

from flask import Blueprint, jsonify, request

from webargs import fields
from webargs.flaskparser import use_args, use_kwargs

from reminders.common.authentication import authenticate
from reminders.exceptions import InvalidResourceAPIError, invalid_resource_api_error


client = boto3.client("s3")


s3 = Blueprint("s3", __name__)


# Register error messages
invalid_resource_api_error(s3)


# Scripts GET Handler
@s3.route("/s3_key", methods=["get"])
def get():
    s3_bucket = "cloudbroadcast-media"

    file_name = str(uuid.uuid4())
    file_type = request.args.get("file_type")

    s3 = boto3.client("s3")

    presigned_post = s3.generate_presigned_post(
        Bucket=s3_bucket,
        Key=file_name,
        Fields={"acl": "public-read", "Content-Type": file_type},
        Conditions=[
            {"acl": "public-read"},
            {"Content-Type": file_type}
        ],
        ExpiresIn=3600
    )

    output = {
        "data": presigned_post,
        "url": "https://%s.s3.amazonaws.com/%s" % (s3_bucket, file_name)
    }

    return jsonify(output)
