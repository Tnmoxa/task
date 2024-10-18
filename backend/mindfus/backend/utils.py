from datetime import timedelta
from uuid import UUID
from mindfus.dependencies import ACCESS_TOKEN_EXPIRE_MINUTES, database, storage

import redis.asyncio as redis
from fastapi import Depends, HTTPException, status


async def get_current_user_by_session(session_key: UUID, redis_storage: redis.Redis = Depends(storage)):
    user_email = await redis_storage.get(f"session:{session_key}")

    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session or session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    session_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    await redis_storage.setex(f"session:{session_key}", session_expires, user_email)
    return user_email.decode('utf-8')
