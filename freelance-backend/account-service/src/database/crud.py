from sqlalchemy.orm import Session
import datetime

from . import models, schemas

def getAccount(db: Session, userID: str, accountID: str):
    account = db.query(models.Account).filter(models.Account.userID == userID).filter(models.Account.accountID == accountID).first()
    # less than current time by more than 30 minutes 
    if (account == None):
        return None

    if (datetime.datetime.strptime(account.lastRequested, '%Y-%m-%d %H:%M:%S') < datetime.datetime.now() - datetime.timedelta(minutes=30)):
        account.transactionsLastTwelveMonths = None

    return account

def updateAccount(db: Session, updateDetails: schemas.AccountUpdate):
    db_account = getAccount(db, updateDetails.userID, updateDetails.accountID)
    db_account.transactionsLastTwelveMonths = updateDetails.transactionsLastTwelveMonths;
    db.commit()
    db.refresh(db_account)
    return db_account

def createAccount(db: Session, newAccount: schemas.AccountCreate):
    #Check if account already exists 
    db_account = getAccount(db, newAccount.userID, newAccount.accountID)
    if (db_account == None):
        db_account = models.Account(userID = newAccount.userID, transactionsLastTwelveMonths = newAccount.transactionsLastTwelveMonths, lastRequested = newAccount.lastRequested, accountID = newAccount.accountID)
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return db_account
    
    else:
        return updateAccount(db, newAccount)