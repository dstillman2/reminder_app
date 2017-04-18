# User has attempted to send a very long text reminder.
class AbuseTextMessageLength(Exception):
    def __init__(self, length):
        self.value = "text_message_too_long_%s" % length

    def __str__(self):
        return self.value
