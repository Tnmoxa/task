from datetime import timedelta
from select import select
from uuid import UUID, uuid4

import mindfus.database.api_models as am
import mindfus.database.storage_models as sm
import redis.asyncio as redis
from fastapi import Depends, FastAPI, HTTPException, status
from mindfus.backend.utils import get_current_user_by_session
from mindfus.dependencies import ACCESS_TOKEN_EXPIRE_SECONDS, database, storage
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()


# Регистрация пользователя
@app.post("/registration")
async def create_user(user: am.User, db: AsyncSession = Depends(database)):
    check_acc = (await db.execute(select(sm.User).where(sm.User.email == user.email))).scalar_one_or_none()
    if check_acc:
        raise HTTPException(status_code=404, detail='Account already exists')
    user_instance = sm.User(
        email=user.email,
        first_name=user.first_name,
        tg_id=user.tg_id,
        password=user.password
    )
    db.add(user_instance)
    await db.commit()
    await db.refresh(user_instance)


# Аутентификация пользователя, создание сессии
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

    session_expires = timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    session_key = uuid4()

    await redis_storage.setex(f"session:{session_key}", session_expires, user.email)
    await redis_storage.sadd(f"user_sessions:{user.email}", str(session_key))

    return am.Session(email=user.email, session_key=session_key)


# Проверка существования сессии
@app.get("/user")
async def session(user_email: str = Depends(get_current_user_by_session)):
    return user_email


# Проверка существования сессии
@app.get("/get_users")
async def session(db: AsyncSession = Depends(database)):
    users = (await db.execute(select(sm.User))).scalars().all()
    return  [{'email': user.email} for user in users]


# Удаление сессии
@app.delete("/exit")
async def session(session_key: UUID, redis_storage: redis.Redis = Depends(storage)):
    await redis_storage.delete(f"session:{session_key}")
