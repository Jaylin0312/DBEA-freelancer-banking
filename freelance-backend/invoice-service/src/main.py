from fastapi import Depends, FastAPI
import invoiceService as invoiceService;
from models.BaseModels import *;
from exception.BaseExceptionHandler import *;
from database.database import SessionLocal, engine
from sqlalchemy.orm import Session
from database import models
from fastapi.middleware.cors import CORSMiddleware

# Start the FastAPI app: uvicorn main:app --reload
# Documentation: http://127.0.0.1:8000/docs
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
    return {"status": "invoice service success"}

@app.post("/invoice/generate")
async def generateInvoice(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = invoiceService.generateInvoice(requestBody.data, db);
    return BaseResponse(data=result, status="success");
