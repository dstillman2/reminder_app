from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, DateTime

from reminders.common.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)

    address_1 = Column(String(90))
    address_2 = Column(String(90))

    company = Column(String(45))

    country_code = Column(String(11))
    city = Column(String(90))
    state = Column(String(10))
    zip_code = Column(String(10))

    time_zone = Column(String(45))

    credits = Column(Integer)
    api_key = Column(String(90))

    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))
