from client.externalServices import *;
from client.notificationServices import *;
from models.InvoiceModels import *;
from models.tBankRequestModels import *;
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from database import crud, models, schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def generateInvoice(data: dict, db: Session):
    try:
        data = CreateInvoiceRequest.model_validate(data);
    except ValidationError as e:
        raise RequestValidationError(errors=e.errors());

    dbInvoice = createInvoice(data, db).to_dict();

    # Send email to recipient
    emailBody = f"Dear Sir/Madam,\n\nYou have been billed by our customer with an invoice. \n\nPlease find attached invoice in the following URL: {data.invoiceURL}\n\nThank you.\n\nBest Regards,\n Bank Team";

    bodyContent = SendNotificationRequest(userID=data.userID, pin=data.PIN, otp=data.OTP, emailAddress=data.recipientEmail, emailSubject="Invoice Payment", emailBody=emailBody).model_dump(exclude_unset=True);

    notificationServiceEmailSender(bodyContent, "POST")

    return dbInvoice;

# CRUD Utils for database
def createInvoice(data: dict, db: Session):
    invoiceInformation = schemas.InvoiceCreate(
        userID=data.userID,
        invoiceURL= data.invoiceURL,
        recipientEmail = data.recipientEmail,
    )
    return crud.createInvoice(db=db, invoice=invoiceInformation);