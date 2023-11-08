from pydantic import BaseModel

class tBankCalculateLoanInstallment(BaseModel):
    productID: str
    principle: str
    numberOfMonths: str

class tBankUserRequest(BaseModel):
    serviceName: str
    userID: str
    PIN: str
    OTP: str

class tBankApplyLoanRequest(BaseModel):
    productID: str
    loanPurpose: str
    loanAmount: str
    numberOfMonths: str
    assetValue: str
    title: str
    currency: str
    settlementAccount: str