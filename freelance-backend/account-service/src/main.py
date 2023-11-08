from fastapi import Depends, FastAPI
import accountService;
from models.BaseModels import *;
from exception.BaseExceptionHandler import *;
from fastapi.middleware.cors import CORSMiddleware
from database.database import SessionLocal, engine
from sqlalchemy.orm import Session
from database import models
from fastapi.middleware.cors import CORSMiddleware

# Start the FastAPI app: uvicorn main:app --reload --port 8001
# Documentation: http://127.0.0.1:8000/docs
app = FastAPI()
# Custom exception handler
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
    return {"status": "account service success"}

@app.post("/account/get-all-accounts")
async def getAllAccounts(request: BaseRequest):
    result = accountService.getAccounts(request.data);
    return BaseResponse(data=result, status="success");

@app.post("/account/transaction-history")
async def getTransactionHistory(request: BaseRequest, db: Session = Depends(get_db)):
    result = accountService.getTransactionHistory(request.data);
    return BaseResponse(data=result, status="success")
    
@app.post("/account/monthly-cashflow")
async def getMonthEndBalanceTrend(request: BaseRequest, db: Session = Depends(get_db)):
    result = accountService.getMonthlyCashflow(request.data, db);
    return BaseResponse(data=result, status="success");