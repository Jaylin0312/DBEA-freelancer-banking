from fastapi import Depends, FastAPI
import loanService as loanService;
from models.BaseModels import *;
from exception.BaseExceptionHandler import *;
from database.database import SessionLocal, engine
from sqlalchemy.orm import Session
from database import models
from fastapi.middleware.cors import CORSMiddleware

# Start the FastAPI app: uvicorn main:app --reload --port 8002
app = FastAPI()
add_unicorn_exception_handler(app);
models.Base.metadata.create_all(bind=engine)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 

@app.get("/health")
async def health_check():
    return {"status": "loan service success"}

#Apply for loan
@app.post("/loan/apply")
async def applyForLoan(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = loanService.applyForLoan(requestBody.data, db);
    return BaseResponse(data=result, status="success");

@app.get("/loan/get-all")
async def getAllLoans(db: Session = Depends(get_db)):
    result = loanService.getAllLoans(db);
    return BaseResponse(data=result, status="success");

@app.get("/loan/approved")
async def getAllApprovedLoans(db: Session = Depends(get_db)):
    result = loanService.getAllApprovedLoans(db);
    return BaseResponse(data=result, status="success");

@app.get("/loan/pending")
async def getAllPendingLoans(db: Session = Depends(get_db)):
    result = loanService.getAllPendingLoans(db);
    return BaseResponse(data=result, status="success");

@app.get("/loan/{userID}")
async def getLoanByUserID(userID: str, db: Session = Depends(get_db)):
    result = loanService.getLoanByUserID(userID, db);
    return BaseResponse(data=result, status="success");

@app.patch("/loan/approval")
async def approveLoan(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = loanService.loanApproval(requestBody.data, db);
    return BaseResponse(data=result, status="success");

# To calculate the loan amount and the interest rate
@app.post("/loan/calculate-loan-installment")
async def calculateLoan(requestBody: BaseRequest):
    result = loanService.calculateLoanInstallment(requestBody.data);
    return BaseResponse(data=result, status="success");