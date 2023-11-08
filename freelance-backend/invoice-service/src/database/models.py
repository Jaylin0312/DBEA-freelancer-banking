from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Invoice(Base):
    __tablename__ = "invoice"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    userID = Column(String)
    invoiceURL = Column(String)
    recipientEmail = Column(String)

    def to_dict(self):
        return {field.name:getattr(self, field.name) for field in self.__table__.c}

