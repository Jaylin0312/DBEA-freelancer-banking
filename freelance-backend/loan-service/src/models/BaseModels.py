from pydantic import BaseModel

#Standard request class to be used for all requests
class BaseRequest(BaseModel):
    data: dict

    def __repr__(self):
        return '<Request %r>' % (self.requestID)
    
class BaseResponse(BaseModel):
    status: str
    data: dict
    errors: list = []

    def __repr__(self):
        return '<Request %r>' % (self.requestID)
    
    