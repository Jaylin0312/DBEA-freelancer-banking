from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "user"

    userID = Column(String, primary_key=True, index=True)
    preferredAccount = Column(String)
    role = Column(String, default="USER")
    userDetails = Column(String)

    def to_dict(self):
        return {field.name:getattr(self, field.name) for field in self.__table__.c}

