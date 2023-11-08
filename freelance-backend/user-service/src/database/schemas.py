from pydantic import BaseModel

class UserBase(BaseModel):
    userID: str
    preferredAccount: str
    userDetails: str

class User(UserBase):
    preferredAccount: str

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    pass

class UpdateUser(UserBase):
    pass