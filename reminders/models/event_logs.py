from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, \
    DateTime, ForeignKey
from sqlalchemy.orm import relationship

from reminders.common.database import Base


class EventLog(Base):
    __tablename__ = "event_logs"

    id = Column(Integer, primary_key=True)

    event_id = Column(Integer, ForeignKey("events.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    type = Column(String(45))
    caller_id = Column(String(45))
    target_phone_number = Column(String(45))
    target_first_name = Column(String(45))
    target_last_name = Column(String(45))
    status = Column(String(45))
    reason = Column(Text)
    error_code = Column(String(45))
    script = Column(Text)
    sid = Column(String(45))

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))
