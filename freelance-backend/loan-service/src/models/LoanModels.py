from pydantic import BaseModel

class ApplyLoanRequest(BaseModel):
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
    email: str
    loanTerms: str = None
    mobileNumber: str = None

class ApproveLoanRequest(BaseModel):
    id: str
    approvalStatus: str
    additionalComments: str = None

#To be passed to our Payment service
class CalculatedInstallmentPlan(BaseModel):
    interest: str
    maturityDate: str
    interestRate: str
    monthlyInstallmentAmount: str

class NotificationSMSRequest(BaseModel):
    userID: str
    pin: str
    otp: str
    mobileNumber: str
    message: str

class NotificationEmailRequest(BaseModel):
    userID: str
    pin: str
    otp: str
    emailAddress: str
    emailSubject: str
    emailBody: str

class DirectDebitPaymentRequest(BaseModel):
    data: dict

class DirectDebitPaymentRequestBody(BaseModel):
    userID: str
    pin: str
    otp: str
    maturityDate: str
    transactionID: str
    customerAccountID: str
    billingOrgAccountID: str
    monthlyInstallment: str
