from mindfus.backend import auth

from fastapi import FastAPI

app = FastAPI()
app.mount('/auth', auth.app)
