from pydantic import BaseModel

class CreateInvoiceRequest(BaseModel):
    userID: str
    PIN: str
    OTP: str
    invoiceURL: str
    recipientEmail: str

class SendNotificationRequest(BaseModel):
    userID: str
    pin: str
    otp: str
    emailAddress: str
    emailSubject: str
    emailBody: str