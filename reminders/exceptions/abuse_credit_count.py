# User has attempted to send a very long text reminder.
class AbuseCreditCount(Exception):
    def __init__(self, length):
        self.value = "no_credits"

    def __str__(self):
        return self.value
