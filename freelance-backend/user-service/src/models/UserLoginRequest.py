from pydantic import BaseModel
from typing import Optional
from fastapi.exceptions import RequestValidationError


class UserLoginRequest(BaseModel):
    userID: str
    pin: str
    otp: Optional[str] = None

    def __repr__(self):
        return '<UserLoginRequest %r>' % (self.username)
    

    #Check if all fields are provided
    def validate(self):
        if self.username == None or self.pin == None:
            raise RequestValidationError(errors=[{"message": "username and password are required"}])
        return True