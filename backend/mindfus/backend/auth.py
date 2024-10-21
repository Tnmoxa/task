from datetime import timedelta
from select import select
from uuid import UUID, uuid4

import mindfus.database.api_models as am
import mindfus.database.storage_models as sm
from mindfus.dependencies import ACCESS_TOKEN_EXPIRE_MINUTES, database, storage
from mindfus.backend.utils import get_current_user_by_session

import redis.asyncio as redis
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()


@app.post("/registration")
async def create_user(user: am.User, db: AsyncSession = Depends(database)):
    check_acc = (await db.execute(select(sm.User).where(sm.User.email == user.email))).scalar_one_or_none()
    if check_acc:
        raise HTTPException(status_code=404, detail='Account already exists')
    user_instance = sm.User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        password=user.password
    )
    db.add(user_instance)
    await db.commit()
    await db.refresh(user_instance)


@app.post("/authentication")
async def authentication(user_form: am.UserPartial, db: AsyncSession = Depends(database),
                         redis_storage: redis.Redis = Depends(storage)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    check_acc = (await db.execute(select(sm.User).where(sm.User.email == user_form.email))).scalar_one_or_none()

    if not check_acc:
        raise credentials_exception
    user = am.User.construct(**check_acc.__dict__)
    if not user.verify_password(user_form.password):
        raise credentials_exception

    session_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    session_key = uuid4()

    await redis_storage.setex(f"session:{session_key}", session_expires, user.email)
    return am.Session(email=user.email, session_key=session_key)


@app.get("/user")
async def session(user_email: str = Depends(get_current_user_by_session)):
    return user_email


@app.delete("/exit")
async def session(session_key: UUID, redis_storage: redis.Redis = Depends(storage)):
    await redis_storage.delete(f"session:{session_key}")

