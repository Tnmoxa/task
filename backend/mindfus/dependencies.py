import os

import redis.asyncio as redis
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

load_dotenv()


# Класс базы данных для работы с fastapi
class Database:
    def __init__(self, link):
        self.engine = create_async_engine(link)
        self._async_session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def __call__(self):
        async with self._async_session() as session:
            yield session


# Класс хранилища redis для работы с fastapi
class Storage:
    def __init__(self, url):
        self.client = redis.from_url(url)

    async def __call__(self):
        return self.client


ALGORITHM = "HS256"
storage = Storage(os.environ.get('REDIS_URL'))
database = Database(os.environ.get('DATABASE_URL'))
# Время существования сессии
ACCESS_TOKEN_EXPIRE_MINUTES = 2
