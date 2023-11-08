from models.UserLoginRequest import UserLoginRequest;
from models.tBankModels.tBankUserRequest import tBankUserRequest;
from client.externalServices import *;
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from database import crud, models, schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session

# User request OTP 
def requestOTP(data: dict, db: Session):
    try:
        data = UserLoginRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    # Construct the tBankUserRequest object
    serviceName = "requestOTP"
    tBankUserRequestData = tBankUserRequest(
        serviceName=serviceName,
        userID=data.userID,
        PIN=data.pin,
        OTP=""
    )

    response = externalServiceSender(tBankUserRequestData.model_dump(exclude_unset=True), "POST")

    #Create an entry in the database if user does not exist - Will only execute if the request OTP passes
    createUser(data.userID, db)

    return {
        "message": "Login success, user has been sent an OTP",
    }

def getUserDetails(data: dict, db: Session):
    try:
        data = UserLoginRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    # Construct the tBankUserRequest object
    serviceName = "getCustomerDetails"
    tBankUserRequestData = tBankUserRequest(
        serviceName=serviceName,
        userID=data.userID,
        PIN=data.pin,
        OTP=data.otp
    )

    additionalUserInfo = getUser(data.userID, db)
    # Admin user (Temp)
    if additionalUserInfo["role"] == "ADMIN":
        return {
            "additionalUserInfo": additionalUserInfo,
        }

    # Regular user
    response = externalServiceSender(tBankUserRequestData.model_dump(exclude_unset=True), "POST")["CDMCustomer"]

    additionalUserInfo.pop("userDetails", None)
    response["additionalUserInfo"] = additionalUserInfo

    #Extra details of client later on
    updateUserDetails = {
        "userID": data.userID,
        "preferredAccount": "",
        "userDetails": json.dumps(response)
    }
    updateUser(updateUserDetails, db)

    return response;

def authenticate(data: dict, db: Session):
    try:
        data = UserLoginRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    # Construct the tBankUserRequest object
    serviceName = "loginCustomer"
    tBankUserRequestData = tBankUserRequest(
        serviceName=serviceName,
        userID=data.userID,
        PIN=data.pin,
        OTP=data.otp
    )

    # Admin user (Temp)
    additionalUserInfo = getUser(data.userID, db)
    if additionalUserInfo["role"] == "ADMIN":
        return {
            "customerID": data.userID,
            "bankID": "",
            "role": additionalUserInfo["role"]
        }

    # Regular user
    response = externalServiceSender(tBankUserRequestData.model_dump(exclude_unset=True), "POST")["Login_OTP_Authenticate-Response"]
    response["role"] = additionalUserInfo["role"]
    return response;

def adminGetUserDetails(userID: str, db: Session):
    # Check if user exists
    db_user = crud.getUser(db, userID)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    #Check if user has user details 
    if (db_user.userDetails == None or db_user.userDetails == ""):
        raise HTTPException(status_code=404, detail="User details not found")
    
    return json.loads(db_user.userDetails)

#CRUD Utils for database
def getUser(userId: str, db: Session):
    db_user = crud.getUser(db, userId)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user.to_dict();

def updateUser(updateDetails : schemas.UpdateUser, db: Session):
    # Check if user exists
    db_user = crud.getUser(db, updateDetails["userID"])
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.updateUser(db, updateDetails, db_user).to_dict();

def createUser(userID: str, db: Session):
    db_user = crud.getUser(db, userID)
    if db_user:
        return db_user.to_dict()
    user = schemas.UserCreate(userID=userID, preferredAccount="", userDetails="")
    return crud.createUser(db=db, user=user).to_dict()