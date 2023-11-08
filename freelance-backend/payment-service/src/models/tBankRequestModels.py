from pydantic import BaseModel

class tBankUserRequest(BaseModel):
    serviceName: str
    userID: str
    PIN: str
    OTP: str

class tBankDirectDebitAuthorization(BaseModel):
    customerAccountID: str
    billingOrgAccountID: str