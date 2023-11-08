from pydantic import BaseModel

class InvoiceBase(BaseModel):
    userID: str
    invoiceURL: str
    recipientEmail: str

class Invoice(InvoiceBase):
    id: int

    class Config:
        from_attributes = True

class InvoiceCreate(InvoiceBase):
    pass