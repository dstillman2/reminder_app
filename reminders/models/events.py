from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, \
    DateTime, ForeignKey
from sqlalchemy.orm import relationship

from reminders.common.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    account_id = Column(Integer)

    send_time = Column(Integer)
    appointment_time = Column(Integer)
    targets = Column(Text)
    caller_id = Column(Integer, ForeignKey('phone_numbers.id'))
    task_id = Column(String(90))

    type = Column(String(45))
    status = Column(String(45))

    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))

    phone_number = relationship("PhoneNumber", foreign_keys=[caller_id])
