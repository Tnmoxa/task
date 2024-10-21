FROM python:3.12

WORKDIR /backend

COPY /backend .

RUN cd /backend && SETUPTOOLS_SCM_PRETEND_VERSION="0.1.0" pip install -e .

EXPOSE 8000

CMD ["uvicorn", "mindfus.backend:app", "--host", "0.0.0.0", "--port", "8000"]