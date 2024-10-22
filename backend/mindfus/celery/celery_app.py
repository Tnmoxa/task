import asyncio
import os

from celery import Celery
from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

bot = Bot(token=os.environ.get('TOKEN'), default=DefaultBotProperties(parse_mode=ParseMode.HTML))

app = Celery(
    'tasks',
    broker=os.environ.get('REDIS_URL'),
    backend=os.environ.get('REDIS_URL')
)


@app.task(name="mindfus.backend.utils.send_tg_message")
def send_tg_message(author, message, chat_id):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        loop.run_until_complete(bot.send_message(chat_id=chat_id, text=f'Сообщение от {author}: {message}'))
    except Exception as e:
        print(f'Ошибка send_tg_message {e}')
