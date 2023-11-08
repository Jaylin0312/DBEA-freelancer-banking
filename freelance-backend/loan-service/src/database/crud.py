from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from . import models, schemas

def getAllLoans(db: Session):
    return db.query(models.Loan).all()

def getAllUnapprovedLoans(db: Session):
    return db.query(models.Loan).filter(models.Loan.approvalStatus == schemas.approvalStatus.PENDING).all()

def getAllApprovedLoans(db: Session):
    return db.query(models.Loan).filter(models.Loan.approvalStatus == schemas.approvalStatus.APPROVED).all()

def getAllLoansByUserID(db: Session, userID: str):
    return db.query(models.Loan).filter(models.Loan.userID == userID).all()


def getLoanById(db: Session, loanID: str):
    return db.query(models.Loan).filter(models.Loan.id == loanID).first()

def createLoan(db: Session, loan: schemas.LoanCreate):
    db_loan = models.Loan(id=str(uuid.uuid1()), userID=loan.userID, pin=loan.pin, otp=loan.otp, productID=loan.productID, loanPurpose=loan.loanPurpose, loanAmount=loan.loanAmount, numberOfMonths=loan.numberOfMonths, assetValue=loan.assetValue, title=loan.title, currency=loan.currency, settlementAccount=loan.settlementAccount, approvalStatus=loan.approvalStatus, createdAt=loan.createdAt, updatedAt=loan.updatedAt, email=loan.email, loanTerms=loan.loanTerms, mobileNumber=loan.mobileNumber)
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

#  Used to approve / reject loan
def updateLoan(db: Session, updateDetails: schemas.LoanApproval):
    db_loan = db.query(models.Loan).filter(models.Loan.id == updateDetails.id).first()
    db_loan.approvalStatus = updateDetails.approvalStatus;
    db_loan.updatedTime = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    db.commit()
    db.refresh(db_loan)
    return db_loan