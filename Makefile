#!make
PYTHON_EXEC ?= python3.12
NODE_VERSION ?= 20.15.1
VENV ?= "./.venv"
PNPM ?= pnpm@9.6.0
SHELL := /bin/bash

venv:
	[ -d $(VENV) ] || $(PYTHON_EXEC) -m venv $(VENV)
	source $(VENV)/bin/activate && pip install -U pip wheel setuptools
	source $(VENV)/bin/activate && pip install nodeenv
	source $(VENV)/bin/activate && nodeenv -p -n $(NODE_VERSION)
	source $(VENV)/bin/activate && npm install -g $(PNPM)

init:
	source $(VENV)/bin/activate && cd backend && SETUPTOOLS_SCM_PRETEND_VERSION="0.1.0" pip install -e .
	sudo docker compose build
	sudo docker compose up -d
	sudo docker compose stop
	sudo docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

start:
	sudo docker compose up -d
	source $(VENV)/bin/activate && cd backend && alembic upgrade head
	source $(VENV)/bin/activate && uvicorn backend.mindfus.backend:app
