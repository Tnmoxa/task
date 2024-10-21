FROM python:3.12

WORKDIR /backend

COPY /backend .

RUN cd /backend && SETUPTOOLS_SCM_PRETEND_VERSION="0.1.0" pip install -e .

WORKDIR /backend

CMD ["alembic", "upgrade", "head"]