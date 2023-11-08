from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from . import models, schemas

def getPaymentByTransactionID(db: Session, transactionID: str):
    payment = db.query(models.Payment).filter(models.Payment.transactionID == transactionID).first()
    return payment

def createPayment(db: Session, paymentDetails: schemas.PaymentCreate):
    db_payment = models.Payment(transactionID = paymentDetails.transactionID, userID = paymentDetails.userID, customerAccountID = paymentDetails.customerAccountID, billingOrgAccountID = paymentDetails.billingOrgAccountID, monthlyInstallment = paymentDetails.monthlyInstallment, maturityDate = paymentDetails.maturityDate, createdAt = datetime.now().strftime("%Y-%m-%d %H:%M:%S"), updatedAt = datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
