from datetime import datetime

import pydantic
from sqlalchemy import ForeignKey
from sqlalchemy import Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm import MappedAsDataclass, DeclarativeBase


class Base(DeclarativeBase, MappedAsDataclass, dataclass_callable=pydantic.dataclasses.dataclass):
    pass


class User(Base):
    """ User's table """
    __tablename__ = 'users'

    email: Mapped[str] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(nullable=False)
    tg_id: Mapped[str] = mapped_column()
    password: Mapped[str] = mapped_column(nullable=False)

class Message(Base):
    """ Messages table """
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    content: Mapped[str] = mapped_column(nullable=False)
    sender_mail: Mapped[str] = mapped_column(ForeignKey('users.email'), nullable=False)
    recipient_mail: Mapped[str] = mapped_column(ForeignKey('users.email'), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(default=datetime.now())

    checked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


