from pydantic import BaseModel
from fastapi.exceptions import RequestValidationError

class GetTransactionHistoryRequest(BaseModel):
    userID: str
    pin: str
    otp: str
    accountID: str
    startDate: str
    endDate: str
    numRecordsPerPage: int = 100;

    def __repr__(self):
        return '<GetTransactionHistoryRequest %r>' % (self.accountNumber)
    
class GetMonthlyCashFlowRequest(BaseModel):
    userID: str
    pin: str
    otp: str
    accountID: str

    def __repr__(self):
        return '<GetTransactionHistoryRequest %r>' % (self.accountNumber)
    
class UserCredentials(BaseModel):
    userID: str
    pin: str
    otp: str

    def __repr__(self):
        return '<UserCredentials %r>' % (self.username)