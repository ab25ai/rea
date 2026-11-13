"""HTTP API + static PWA client. Run: uvicorn server.main:app --host 0.0.0.0 --port 8000"""
import hmac
from pathlib import Path

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agent.config import get_settings
from agent.core import Agent

settings = get_settings()
app = FastAPI(title="PersonalAgent-Minz")
_agent: Agent | None = None


def get_agent() -> Agent:
    global _agent
    if _agent is None:
        _agent = Agent(settings)
    return _agent


def require_token(authorization: str = Header(default="")):
    expected = settings.api_token
    supplied = authorization.removeprefix("Bearer ").strip()
    if not expected or not hmac.compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="Unauthorized")


class ChatIn(BaseModel):
    message: str
    session_id: str = "default"


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/api/chat", dependencies=[Depends(require_token)])
def chat(body: ChatIn, agent: Agent = Depends(get_agent)):
    return {"reply": agent.run(body.session_id, body.message)}


CLIENT_DIR = Path(__file__).resolve().parent.parent / "client"
app.mount("/", StaticFiles(directory=CLIENT_DIR, html=True), name="client")
