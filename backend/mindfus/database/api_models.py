from datetime import datetime
from uuid import UUID

import bcrypt
from pydantic import model_validator, BaseModel


class Message(BaseModel):
    content: str
    recipient_mail: str


class MessageResponse(BaseModel):
    id: int
    content: str
    timestamp: datetime
    companion: str
    checked: bool


class MessageRequest(BaseModel):
    content: str
    recipient: str


class User(BaseModel):
    email: str
    first_name: str
    last_name: str | None = None
    password: str

    @model_validator(mode='after')
    def hash_password(self) -> 'User':
        self.set_password(self.password)
        return self

    def set_password(self, password: str):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))


class UserPartial(BaseModel):
    email: str
    password: str


class Session(BaseModel):
    email: str
    session_key: UUID
