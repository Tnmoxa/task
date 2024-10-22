from select import select
from typing import Any

import mindfus.database.api_models as am
import mindfus.database.storage_models as sm
import redis.asyncio as redis
from fastapi import Depends, FastAPI
from fastapi import HTTPException
from mindfus.backend.utils import get_current_user_by_session, get_active_sessions
from mindfus.celery.celery_app import send_tg_message
from mindfus.dependencies import database, storage
from sqlalchemy import delete
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()


# Получение полученных и отправленных сообщений
@app.get("/")
async def get_messages(user_email: str = Depends(get_current_user_by_session), db: AsyncSession = Depends(database)) -> \
        dict[str, list[Any]]:
    inbox = (await db.execute(
        select(sm.Message).where(sm.Message.recipient_mail == user_email)
    )).scalars().all()
    outbox = (await db.execute(
        select(sm.Message).where(sm.Message.sender_mail == user_email)
    )).scalars().all()

    return {'inbox': [am.MessageResponse(
        id=message.id,
        content=message.content,
        timestamp=message.timestamp,
        companion=message.sender_mail,
        checked=message.checked
    ) for message in inbox],
        'outbox': [
            am.MessageResponse(
                id=message.id,
                content=message.content,
                timestamp=message.timestamp,
                companion=message.sender_mail,
                checked=message.checked
            ) for message in outbox]}


# Подтверждение прочтения сообщения
@app.get("/change_check")
async def check_messages(message_id: int, user_email: str = Depends(get_current_user_by_session),
                         db: AsyncSession = Depends(database)):
    message = (await db.execute(
        select(sm.Message).where(sm.Message.id == message_id)
    )).scalars().one_or_none()
    if not message:
        raise HTTPException(status_code=404, detail='Message not found')
    if message.sender_mail != user_email:
        HTTPException(
            status_code=401, detail='UNAUTHORIZED',
        )
    message.checked = True
    await db.merge(message)
    await db.commit()


# Отправка сообщения
@app.post("/")
async def save_messages(message: am.MessageRequest, user_email: str = Depends(get_current_user_by_session),
                        db: AsyncSession = Depends(database), redis_storage: redis.Redis = Depends(storage)):
    check_acc = (await db.execute(select(sm.User).where(sm.User.email == message.recipient))).scalar_one_or_none()
    if not check_acc:
        raise HTTPException(status_code=404, detail='Account not found')

    new_message = sm.Message(
        content=message.content,
        sender_mail=user_email,
        recipient_mail=message.recipient
    )

    if not (await get_active_sessions(message.recipient, redis_storage)):
        send_tg_message.delay(user_email, message.content, check_acc.tg_id)

    db.add(new_message)
    await db.commit()


# удаление сообщения
@app.delete("/")
async def delete_messages(message_ids: list[int], user_email: str = Depends(get_current_user_by_session),
                          db: AsyncSession = Depends(database)):
    # Выбираем сообщения, принадлежащие текущему пользователю, и проверяем их наличие
    messages = (await db.execute(
        select(sm.Message)
        .where(sm.Message.id.in_(message_ids))
        .where((sm.Message.sender_mail == user_email) | (sm.Message.recipient_mail == user_email))
    )).scalars().all()
    if not messages:
        raise HTTPException(status_code=404, detail='Messages not found or unauthorized')

    await db.execute(
        delete(sm.Message)
        .where(sm.Message.id.in_(message_ids))
        .where((sm.Message.sender_mail == user_email) | (sm.Message.recipient_mail == user_email))
    )

    await db.commit()
