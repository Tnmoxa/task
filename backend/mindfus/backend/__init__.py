from fastapi import FastAPI
from mindfus.backend import auth, message
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(redirect_slashes=False, root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount('/auth', auth.app)
app.mount('/message', message.app)
