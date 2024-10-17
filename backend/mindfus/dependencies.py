import os

import redis.asyncio as redis
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

load_dotenv()


class Database:
    def __init__(self, link):
        self.engine = create_async_engine(link)
        self._async_session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def __call__(self):
        async with self._async_session() as session:
            yield session


class Storage:
    def __init__(self):
        self.client = redis.Redis()

    async def __call__(self):
        return self.client


ALGORITHM = "HS256"
storage = Storage()
database = Database(os.environ.get('DATABASE_URL'))
ACCESS_TOKEN_EXPIRE_MINUTES = 2
