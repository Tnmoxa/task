from fastapi import FastAPI

from mindfus.backend import auth

app = FastAPI()
app.mount('/auth', auth.app)
