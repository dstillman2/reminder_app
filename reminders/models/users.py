from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, \
    DateTime, ForeignKey
from sqlalchemy.orm import relationship

from reminders.common.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    account_id = Column(Integer, ForeignKey("accounts.id"))
    password = Column(String(90))

    first_name = Column(String(45))
    last_name = Column(String(45))
    email_address = Column(String(90))

    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))

    account = relationship("Account", foreign_keys=[account_id])
