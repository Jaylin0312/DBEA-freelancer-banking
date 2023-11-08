from sqlalchemy.orm import Session

from . import models, schemas

def getAllInvoicesByUser(db: Session, userID: str):
    invoice = db.query(models.Invoice).filter(models.Invoice.userID == userID).first()
    return invoice

def getInvoice(db: Session, invoiceID: str):
    invoice = db.query(models.Invoice).filter(models.Invoice.invoiceID == invoiceID).first()
    return invoice

def createInvoice(db: Session, invoice: schemas.InvoiceCreate):
    db_invoice = models.Invoice(userID=invoice.userID, invoiceURL=invoice.invoiceURL, recipientEmail=invoice.recipientEmail)
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice