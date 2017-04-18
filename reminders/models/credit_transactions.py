from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, Boolean, Text, DateTime

from reminders.common.database import Base


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id = Column(Integer, primary_key=True)
    account_id = Column(Integer)

    event_id = Column(Integer)
    credits = Column(Integer)
    price = Column(Integer)
    reason = Column(String(45))

    phone_number_id = Column(String(45))

    created_at = Column(DateTime, default=(lambda: datetime.utcnow()))
    updated_at = Column(DateTime, onupdate=(lambda: datetime.utcnow()))

    # TODO: Add indexes
    # (account_id, event_id)
