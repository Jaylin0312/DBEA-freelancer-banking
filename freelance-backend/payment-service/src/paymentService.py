from client.externalServices import *;
from models.tBankRequestModels import *;
from models.PaymentModels import *;
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from database import crud, models, schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

def authorizeDirectDebit(data: dict, db: Session):
    try:
        data = PaymentDebitAuthorizationRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    # Fire the direct debit authorization request to tBank
    serviceName = "directDebitAuthorization"
    headerContent = tBankUserRequest(userID=data.userID, PIN=data.pin, OTP=data.otp, serviceName=serviceName).model_dump(exclude_unset=True);
    contentBody = tBankDirectDebitAuthorization(customerAccountID=data.customerAccountID, billingOrgAccountID=data.billingOrgAccountID).model_dump(exclude_unset=True);
    debitAuthorizationResponse = externalServiceSenderWithContent(headerContent, contentBody, "POST")["DirectDebitAuthorizationID"];

    # Save the payment details to the database
    paymentAuthorizationDetails = schemas.PaymentCreate(transactionID=data.transactionID, userID=data.userID, customerAccountID=data.customerAccountID, billingOrgAccountID=data.billingOrgAccountID, monthlyInstallment=data.monthlyInstallment, maturityDate=data.maturityDate);
    crud.createPayment(db=db, paymentDetails=paymentAuthorizationDetails);

    return {
        "message": "Direct debit authorization successful",
        "authorizationID": debitAuthorizationResponse["_content_"],
    }; 

def debitMonthlyPayment():
    #Cron job to debit monthly payment
    return True;