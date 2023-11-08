from pydantic import BaseModel
from enum import Enum

class LoanBase(BaseModel):
    userID: str
    pin: str
    otp: str
    productID: str
    loanPurpose: str
    loanAmount: str
    numberOfMonths: str
    assetValue: str
    title: str
    currency: str
    settlementAccount: str
    approvalStatus: str
    email: str
    loanTerms: str
    createdAt: str
    updatedAt: str
    mobileNumber: str

class LoanCreate(LoanBase):
    pass

class LoanApproval(BaseModel):
    id: str
    approvalStatus: str

class Loan(LoanBase):
    id: str

    class Config:
        from_attributes = True

class approvalStatus(str, Enum):
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PENDING = "PENDING"

class LoanRetrieve(BaseModel):
    id: str
    userID: str
    productName: str
    loanPurpose: str
    loanAmount: str
    numberOfMonths: str
    assetValue: str
    title: str
    currency: str
    settlementAccount: str
    approvalStatus: str
    email: str
    loanTerms: dict
    createdAt: str