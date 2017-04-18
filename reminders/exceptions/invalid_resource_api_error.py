from flask import jsonify


class InvalidResourceAPIError(Exception):
    status_code = 404
    message = "No such resource"
    error_type = "invalid_request_error"

    def __init__(self, resource_name, resource_id):
        super(InvalidResourceAPIError, self).__init__()

        if resource_name and resource_id:
            self.message = "Cannot access %s of %s" % (resource_name,
                                                       resource_id)

    def to_dict(self):
        response = {}

        response["status_code"] = self.status_code
        response["message"] = self.message
        response["type"] = self.error_type

        return response


def invalid_resource_api_error(handler):

    @handler.errorhandler(InvalidResourceAPIError)
    def handle_bad_request(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code

        return response
