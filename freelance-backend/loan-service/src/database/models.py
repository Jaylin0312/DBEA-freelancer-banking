from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Loan(Base):
    __tablename__ = "loan"
    
    id = Column(String, primary_key=True, index=True)
    userID = Column(String)
    pin = Column(String)
    otp = Column(String)
    productID = Column(String)
    loanPurpose = Column(String)
    loanAmount = Column(String)
    numberOfMonths = Column(String)
    assetValue = Column(String)
    title = Column(String)
    currency = Column(String)
    settlementAccount = Column(String)
    approvalStatus = Column(String)
    email = Column(String)
    createdAt = Column(String)
    updatedAt = Column(String)
    loanTerms = Column(String)
    mobileNumber = Column(String)

    def to_dict(self):
        return {field.name:getattr(self, field.name) for field in self.__table__.c}

