from pydantic import BaseModel

class tBankGetTransactionContentRequest(BaseModel):
    accountID: str
    startDate: str
    endDate: str
    numRecordsPerPage: int = 100;
    pageNum: int = 1

    def __repr__(self):
        return '<tBankGetTransactionHistoryRequest %r>' % (self.accountNumber)