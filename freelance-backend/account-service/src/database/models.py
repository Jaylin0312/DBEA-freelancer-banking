from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Account(Base):
    __tablename__ = "account"
    id = Column(Integer, primary_key=True, index=True)
    userID = Column(String)
    transactionsLastTwelveMonths = Column(String)
    lastRequested = Column(String)
    accountID = Column(String)

    def to_dict(self):
        return {field.name:getattr(self, field.name) for field in self.__table__.c}

