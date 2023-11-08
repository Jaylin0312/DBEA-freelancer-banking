from models.tBankModels.tBankUserRequest import tBankUserRequest;
from models.AccountRequestModels import *;
from models.tBankModels.tBankGetTransactionHistoryRequest import tBankGetTransactionContentRequest;
import client.externalServices as client;
from fastapi.exceptions import RequestValidationError;
from pydantic import ValidationError
import datetime;
from database import crud, models, schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session
import json


def getAccounts(requestData: dict):
    try:
        requestData = UserCredentials.model_validate(requestData);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    # Construct the tBankUserRequest object
    serviceName = "getCustomerAccounts"
    tBankUserRequestData = tBankUserRequest(
        serviceName=serviceName,
        userID=requestData.userID,
        PIN=requestData.pin,
        OTP=requestData.otp
    )

    response = client.externalServiceSender(tBankUserRequestData.model_dump(exclude_unset=True), "POST")["AccountList"]
    if (isinstance(response["account"], dict)):
        print(type(response["account"]))
        response["account"] = [response["account"]]

    return response;

def getTransactionHistory(requestData: dict):
    try:
        requestData = GetTransactionHistoryRequest.model_validate(requestData);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    serviceName = "getTransactionHistory"
    #Construct the tBankGetTransactionHistoryRequest object
    tBankUserRequestData = tBankUserRequest(
        serviceName=serviceName,
        userID=requestData.userID,
        PIN=requestData.pin,
        OTP=requestData.otp
    )

    tBankGetTransactionHistoryContentData = tBankGetTransactionContentRequest(
        accountID=requestData.accountID,
        startDate=requestData.startDate,
        endDate=requestData.endDate,
        numRecordsPerPage=requestData.numRecordsPerPage,
        pageNum=1
    )   

    response = client.externalServiceSenderWithContent(tBankUserRequestData.model_dump(exclude_unset=True),tBankGetTransactionHistoryContentData.model_dump(exclude_unset=True),"POST")["CDMTransactionDetail"]
    return response;

def getMonthlyCashflow(requestData: dict, db: Session):
    # Construct the tBankUserRequest object
    try:
        requestData = GetMonthlyCashFlowRequest.model_validate(requestData);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    dbAccountMonthlyCashFlow = getAccountTwelveMonthTransactionHistory(db, requestData.userID, requestData.accountID)

    # If the user has already requested for the monthly cashflow, return the cached result
    if dbAccountMonthlyCashFlow is not None and dbAccountMonthlyCashFlow.transactionsLastTwelveMonths is not None:
        print("Monthly transaction retrieved from database")
        return {
            "cashflow": json.loads(dbAccountMonthlyCashFlow.transactionsLastTwelveMonths)
        }

    #Construct request for get transaction history for last 12 months
    getTransactionHistoryRequest = GetTransactionHistoryRequest(
        userID=requestData.userID,
        pin=requestData.pin,
        otp=requestData.otp,
        accountID=requestData.accountID,
        startDate=str(getStartMonth(getEndMonth())),
        endDate=str(getEndMonth()),
        numRecordsPerPage=1000
    )

    clientTwelveMonthTransactionHistory = getTransactionHistory(getTransactionHistoryRequest.model_dump(exclude_unset=True));
    if (clientTwelveMonthTransactionHistory.keys().__contains__("transaction_Detail")):
        tabulatedMonthlyCashFlow = tabulateMonthlyCashFlow(clientTwelveMonthTransactionHistory["transaction_Detail"], requestData.accountID)
    else:
        tabulatedMonthlyCashFlow = []


    #Save to database
    newAccount = schemas.AccountCreate(
        userID = requestData.userID,
        transactionsLastTwelveMonths = json.dumps(tabulatedMonthlyCashFlow),
        lastRequested = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        accountID= requestData.accountID
    )
    createAccount(db, newAccount)

    return {
        "cashflow": tabulatedMonthlyCashFlow
    }

def tabulateMonthlyCashFlow(clientTwelveMonthTransactionHistory, accountID):
    cashflow = {}
    for transaction in clientTwelveMonthTransactionHistory:
        transactionDate = getMonthYearFromDate(transaction["transactionDate"])
        transactionAmount = float(transaction["transactionAmount"])
        if transactionDate in cashflow:
            if transaction["accountFrom"] == accountID:
                cashflow[transactionDate]["outgoing"] += transactionAmount
            else:
                cashflow[transactionDate]["incoming"] += transactionAmount
        else:
            cashflow[transactionDate] = {
                "incoming": 0,
                "outgoing": 0,
            }
            if transaction["accountFrom"] == accountID:
                cashflow[transactionDate]["outgoing"] = transactionAmount
            else:
                cashflow[transactionDate]["incoming"] = transactionAmount

    #Convert into an array
    cashFlowArray = []
    for key in cashflow.keys(): 
        monthCashFlow = {}
        monthCashFlow["date"] = key
        monthCashFlow["incoming"] = cashflow[key]["incoming"]
        monthCashFlow["outgoing"] = cashflow[key]["outgoing"]
        cashFlowArray.append(monthCashFlow)
    return cashFlowArray

#Util functions
def getEndMonth():
    today = datetime.date.today()
    first_day_of_current_month = today.replace(day=1)
    last_day_of_last_month = first_day_of_current_month - datetime.timedelta(days=1)
    return last_day_of_last_month;

def getStartMonth(endDate):
    # Get the start month 12 months ago from given end date
    startDate = endDate - datetime.timedelta(days=365)
    return startDate.strftime("%Y-%m-%d")

def getMonthYearFromDate(date):
    date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    return date.strftime("%b-%Y")

#CRUD Utils 
def getAccountTwelveMonthTransactionHistory(db: Session, userID: str, accountID: str):
    result = crud.getAccount(db, userID, accountID)
    return result

def createAccount(db: Session, newAccount: schemas.AccountCreate):
    return crud.createAccount(db, newAccount)