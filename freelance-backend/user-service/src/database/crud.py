from sqlalchemy.orm import Session

from . import models, schemas

def getUser(db: Session, userID: str):
    user = db.query(models.User).filter(models.User.userID == userID).first()
    return user

def updateUser(db: Session, updateDetails: schemas.UpdateUser, db_user: models.User):
    db_user.preferredAccount = updateDetails["preferredAccount"];
    db_user.userDetails = updateDetails["userDetails"];
    db.commit()
    db.refresh(db_user)
    return db_user

def createUser(db: Session, user: schemas.UserCreate):
    db_user = models.User(userID=user.userID, preferredAccount=user.preferredAccount, userDetails=user.userDetails)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user