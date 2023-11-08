from pydantic import BaseModel
from enum import Enum

class PaymentBase(BaseModel):
    transactionID: str
    userID: str
    maturityDate: str
    customerAccountID: str
    billingOrgAccountID: str
    monthlyInstallment: float

class Payment(PaymentBase):
    id: int

    class Config:
        from_attributes = True

class PaymentCreate(PaymentBase):
    pass

