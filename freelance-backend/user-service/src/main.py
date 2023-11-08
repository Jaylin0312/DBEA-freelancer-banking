from fastapi import Depends, FastAPI
import userService as userService;
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
    return {"status": "user service success"}

@app.post("/user/otp")
async def userRequestOTP(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = userService.requestOTP(requestBody.data, db);
    return BaseResponse(data=result, status="success");

@app.post("/user/details")
async def userDetails(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = userService.getUserDetails(requestBody.data, db);
    return BaseResponse(data=result, status="success");

@app.post("/user/authenticate", response_model=BaseResponse)
async def authenticateUser(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = userService.authenticate(requestBody.data, db);
    return BaseResponse(data=result, status="success");

# Endpoint to update a user's details - Preferred account
@app.post("/user/update-details")
async def test(requestBody: BaseRequest, db: Session = Depends(get_db)):
    result = userService.updateUser(requestBody.data, db);
    return BaseResponse(data=result, status="success");

@app.get("/admin/user-details/{userID}")
async def test(userID: str, db: Session = Depends(get_db)):
    result = userService.adminGetUserDetails(userID, db);
    return BaseResponse(data=result, status="success");