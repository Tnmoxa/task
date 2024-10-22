FROM python:3.12

WORKDIR /backend

COPY /backend/requirements.txt .

COPY /backend/mindfus/celery .

RUN cd /backend && pip install -r requirements.txt

WORKDIR /backend
