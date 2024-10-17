import pydantic
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import MappedAsDataclass, DeclarativeBase


class Base(DeclarativeBase, MappedAsDataclass, dataclass_callable=pydantic.dataclasses.dataclass):
    pass


class User(Base):
    """ User's table """
    __tablename__ = 'users'

    email: Mapped[str] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
