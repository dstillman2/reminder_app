from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, \
    DateTime, ForeignKey
from sqlalchemy.orm import relationship

from reminders.common.database import Base


class Script(Base):
    __tablename__ = "scripts"

    id = Column(Integer, primary_key=True)

    account_id = Column(Integer)

    name = Column(String(45))
    type = Column(String(45))
    content = Column(Text())

    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))
