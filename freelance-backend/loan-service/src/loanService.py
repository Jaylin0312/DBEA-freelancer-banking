from client.externalServices import *;
from client.internalServices import *;
from models.LoanModels import *;
from models.tBankRequestModels import *;
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from database import crud, models, schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import json

productMapping = {'101': 'CASA','151': 'TD 5 Year','201': 'Home Loan','202': 'Auto Loan', '203': 'Education Loan', '204': 'Renovation Loan', '205': 'Personal Loan','401': 'Dual Currency Deposit'}
billingOrgAccountID = "0000011192"

# User applying for loan
def applyForLoan(data: dict, db: Session):
    try:
        data = ApplyLoanRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    # Fire the loan application request to tBank
    # serviceName = "applyForLoan"
    # headerContent = tBankUserRequest(userID=data.userID, PIN=data.pin, OTP=999999, serviceName=serviceName).model_dump(exclude_unset=True);
    # contentBody = tBankApplyLoanRequest(productID=data.productID, loanPurpose=data.loanPurpose, loanAmount=data.loanAmount, numberOfMonths=data.numberOfMonths, assetValue=data.assetValue, title=data.title, currency=data.currency, settlementAccount=data.settlementAccount).model_dump(exclude_unset=True);
    # loanResponse = externalServiceSenderWithContent(headerContent, contentBody, "POST");
    # print("Loan Response: ", loanResponse);

    #Calculate the loan terms based on our bank's interest
    loanTerms = calculateLoanInstallment(data);
    data.loanTerms = loanTerms;

    # Fire request to notification service to send notification to user
    # SMS Notification
    smsRequest = NotificationSMSRequest(userID=data.userID, pin=data.pin, otp="999999", mobileNumber=data.mobileNumber, message="Your loan application has been received. Please wait for approval.");
    emailRequest = NotificationEmailRequest(userID=data.userID, pin=data.pin, otp="999999", emailAddress=data.email, emailSubject="Loan Application Received", emailBody="Your loan application has been received. Please wait for approval.");

    try:
        notificationServiceSMSSender(smsRequest.model_dump(exclude_unset=True), "POST");
        notificationServiceEmailSender(emailRequest.model_dump(exclude_unset=True), "POST");
    except Exception as e:
        print("Error in notification service: ", e)

    # Create the loan in our database - Set to unapproved (Simulated POC)
    dbLoan = createLoan(data, db).to_dict();
    dbLoan["loanTerms"] = json.loads(dbLoan["loanTerms"]);
    return dbLoan;

def loanApproval(data: dict, db: Session):
    try:
        data = ApproveLoanRequest.model_validate(data)
        values = set(item.value for item in schemas.approvalStatus)
        if data.approvalStatus not in values:
            raise RequestValidationError(errors=[{"message": "Invalid approval status"}]);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    loan = crud.getLoanById(db, data.id);
    if loan is None:
        raise HTTPException(status_code=404, detail="Loan not found");

    loanTerms=json.loads(loan.loanTerms);

    # If approved/rejected, send notification back to user
    message = "";
    subject = "";
    if data.approvalStatus == schemas.approvalStatus.APPROVED:
        message = "Your loan application has been approved. Please wait for payment to be processed.";
        subject = "Loan Application Approved";
    
        # Fire request to payment service to trigger payment for loan
        debitRequestBody = DirectDebitPaymentRequestBody(userID=loan.userID, pin=loan.pin, otp="999999", maturityDate=loanTerms["MaturityDate"], transactionID=loan.id, customerAccountID=loan.settlementAccount, billingOrgAccountID=billingOrgAccountID, monthlyInstallment=loanTerms["MonthlyInstallmentAdditional"]);
        debitRequest = DirectDebitPaymentRequest(data=debitRequestBody.model_dump(exclude_unset=True));
        
        print(debitRequest.model_dump(exclude_unset=True));
        try:
            paymentServiceDirectDebitPayment(debitRequest.model_dump(exclude_unset=True), "POST");
        except Exception as e:
            print("Error in payment service: ", e)

    else:
        message = "Your loan application has been rejected.\nReason: " + data.additionalComments;
        subject = "Loan Application Rejected";

    # Prepare the notification request
    smsRequest = NotificationSMSRequest(userID=loan.userID, pin=loan.pin, otp="999999", mobileNumber=loan.mobileNumber, message=message);
    emailRequest = NotificationEmailRequest(userID=loan.userID, pin=loan.pin, otp="999999", emailAddress=loan.email, emailSubject=subject, emailBody=message);

    try:
        notificationServiceSMSSender(smsRequest.model_dump(exclude_unset=True), "POST");
        notificationServiceEmailSender(emailRequest.model_dump(exclude_unset=True), "POST");
    except Exception as e:
        print("Error in notification service: ", e)

    # Update the loan status
    updatedLoan = crud.updateLoan(db, schemas.LoanApproval(id=data.id, approvalStatus=data.approvalStatus)).to_dict();
    updatedLoan["loanTerms"] = json.loads(updatedLoan["loanTerms"]);
    return updatedLoan;

def calculateLoanInstallment(data: dict):
    try:
        data = ApplyLoanRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    serviceName = "calculateLoanInstallment";
    headerContent = tBankUserRequest(userID=data.userID, PIN=data.pin, OTP="999999", serviceName=serviceName).model_dump(exclude_unset=True);
    content = tBankCalculateLoanInstallment(productID=data.productID, principle=data.loanAmount, numberOfMonths=data.numberOfMonths).model_dump(exclude_unset=True);

    response = externalServiceSenderWithContent(headerContent, content, "POST")["InstallmentResponse"];

    response["AdditionalInterest"] = "0.01"
    response["MonthlyInstallmentAdditional"] = calculateLoanInstallmentForInternal(response);

    response["MonthlyInstallment"] = str(round(float(response["MonthlyInstallment"]) + float(response["MonthlyInstallmentAdditional"]), 2));
    response["TotalLoanAmount"] = str(float(response["MonthlyInstallment"]) * float(data.numberOfMonths));
    response["Interest"] = str(round(float(response["Interest"]) + float(response["MonthlyInstallmentAdditional"])*float(data.numberOfMonths), 2));

    return response;

def calculateLoanInstallmentForInternal(data: dict):
    additionalInterestRate = 0.01
    baseAmount = float(data["MonthlyInstallment"]) * (1 / (1 + float(data["InterestRate"])))
    additionalInterest = baseAmount * additionalInterestRate;
    return str(round(additionalInterest, 2));

# CRUD Utils for database
def createLoan(data: dict, db: Session):
    loanInformation = schemas.LoanCreate(
        userID=data.userID,
        pin= data.pin,
        otp = "999999",
        productID=data.productID,
        loanPurpose=data.loanPurpose,
        loanAmount=data.loanAmount,
        numberOfMonths=data.numberOfMonths,
        assetValue=data.assetValue,
        title=data.title,
        currency=data.currency,
        settlementAccount=data.settlementAccount,
        approvalStatus=schemas.approvalStatus.PENDING,
        createdAt=getCurrentTime(),
        updatedAt=getCurrentTime(),
        email=data.email,
        loanTerms= json.dumps(data.loanTerms),
        mobileNumber=data.mobileNumber
    )
    return crud.createLoan(db=db, loan=loanInformation)

def getAllLoans(db: Session):
    loans = crud.getAllLoans(db);
    return convertLoansToArray(loans);

def getAllApprovedLoans(db: Session):
    loans = crud.getAllApprovedLoans(db)
    return convertLoansToArray(loans);

def getAllPendingLoans(db: Session):
    loans = crud.getAllUnapprovedLoans(db)
    return convertLoansToArray(loans);

def getLoanByUserID(userID: str, db: Session):
    loans = crud.getAllLoansByUserID(db, userID)
    return convertLoansToArray(loans);

def getCurrentTime():
    return str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

def convertLoansToArray(loans):
    result = [];
    for loan in loans:
        #Map it to Schema.LoanRetrieve
        result.append(schemas.LoanRetrieve(
            id=loan.id,
            userID=loan.userID,
            productName=productMapping[loan.productID],
            loanPurpose=loan.loanPurpose,
            loanAmount=loan.loanAmount,
            numberOfMonths=loan.numberOfMonths,
            assetValue=loan.assetValue,
            title=loan.title,
            currency=loan.currency,
            settlementAccount=loan.settlementAccount,
            approvalStatus=loan.approvalStatus,
            email=loan.email,
            loanTerms=json.loads(loan.loanTerms),
            createdAt=loan.createdAt,
            
        ).model_dump(exclude_unset=True));
    return {
        "loans": result
    };