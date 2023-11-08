from pydantic import BaseModel

class AccountBase(BaseModel):
    userID: str
    transactionsLastTwelveMonths: str
    lastRequested: str
    accountID: str

class Account(AccountBase):
    pass

    class Config:
        from_attributes = True

class AccountCreate(AccountBase):
    pass

class AccountUpdate(AccountBase):
    pass