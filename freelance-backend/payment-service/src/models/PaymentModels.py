from pydantic import BaseModel

class PaymentDebitAuthorizationRequest(BaseModel):
    userID: str
    pin: str
    otp: str
    maturityDate: str
    transactionID : str
    customerAccountID: str
    billingOrgAccountID: str
    monthlyInstallment: str