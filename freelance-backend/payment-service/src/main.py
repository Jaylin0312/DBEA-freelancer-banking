from fastapi import Depends, FastAPI
import paymentService as paymentService;
from models.BaseModels import *;
from exception.BaseExceptionHandler import *;
from database.database import SessionLocal, engine
from sqlalchemy.orm import Session
from database import models
from fastapi.middleware.cors import CORSMiddleware

# Start the FastAPI app: uvicorn main:app --reload --port 8004
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
    return {"status": "payment service success"}

@app.post("/payment/authorize")
async def authorizeDirectDebit(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = paymentService.authorizeDirectDebit(requestBody.data, db);
    return BaseResponse(data=result, status="success");