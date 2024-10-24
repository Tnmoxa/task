# Запуск через докер
```console
$ docker compose build
```
Для корректного первого запуска в Docker необходимо сначала запустить контейнер с бд
```console
$ docker compose up postgresql
```
После этого можно запускать проект
```console
$ docker compose up
```

Для того чтобы бот смог писать вам сообщение, необходимо написать ему '/start' (https://t.me/mf_test_sending_bot)

Сервис доступен по ссылке
"http://localhost:8080/"

# Описание функциональности проекта

## Регистрация и аутентификация пользователей:
- Пользователи могут создавать учетные записи и регистрироваться в системе.
- После регистрации доступна функция аутентификации.

## Отправка и получение сообщений:
- Система предоставляет возможность пользователям отправлять и получать сообщения.
- Сообщения могут передаваться между пользователями в реальном времени, с уведомлениями о доставке и прочтении.

## Уведомления через Telegram-бота:
- Для оповещения пользователей о новых сообщениях, если он офлайн, используется Telegram-бот.

Для работы необходим docker-compose.override.yml с примерно таким содержанием

services:
  postgresql:
    build:
      args:
        POSTGRESQL_PASSWORD: 23456
    restart: 'no'
    ports:
      - "5432:5432/tcp"

  backend:
    environment:
      TOKEN: "TOKEN"
      DATABASE_URL: "postgresql+asyncpg://postgres:23456@postgresql:5432/mf"
      REDIS_URL: "redis://redis:6379"

  alembic:
    environment:
      SYNC_DATABASE_URL: "postgresql+psycopg2://postgres:23456@postgresql:5432/mf"

  celery:
    environment:
      TOKEN: "TOKEN"
      DATABASE_URL: "postgresql+asyncpg://postgres:23456@postgresql:5432/mf"
      REDIS_URL: "redis://redis:6379"
