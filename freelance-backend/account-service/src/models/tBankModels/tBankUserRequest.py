from pydantic import BaseModel


class tBankUserRequest(BaseModel):
    serviceName: str
    userID: str
    PIN: str
    OTP: str

    def __repr__(self):
        return '<tBankUserLogin %r>' % (self.username)
