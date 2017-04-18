from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, \
    DateTime, ForeignKey
from sqlalchemy.orm import relationship

from reminders.common.database import Base


class PhoneNumber(Base):
    __tablename__ = "phone_numbers"

    id = Column(Integer, primary_key=True)

    account_id = Column(Integer)

    phone_number = Column(String(45))
    friendly_name = Column(String(45))
    provider = Column(String(45))
    sid = Column(String(90))
    next_billing_cycle = Column(DateTime)

    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))
