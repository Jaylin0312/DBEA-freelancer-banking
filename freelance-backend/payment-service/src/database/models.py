from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy import REAL

from .database import Base

class Payment(Base):
    __tablename__ = "payment"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transactionID = Column(String)
    userID= Column(String)
    maturityDate= Column(String)
    customerAccountID= Column(String)
    billingOrgAccountID= Column(String)
    monthlyInstallment= Column(REAL)
    createdAt = Column(String)
    updatedAt = Column(String)

    def to_dict(self):
        return {field.name:getattr(self, field.name) for field in self.__table__.c}
