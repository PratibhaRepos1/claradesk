import logging
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env", override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import billing, bookings, inbox, leads, reviews, welcome

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ClaraDesk API", version="1.0.0")

_default_origins = "http://localhost:5173,https://claradesk.vercel.app"
_origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

app.include_router(inbox.router, prefix="/api/inbox", tags=["inbox"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(welcome.router, prefix="/api/welcome", tags=["welcome"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])


@app.get("/")
def health_check() -> dict:
    return {"status": "ClaraDesk API running", "modules": 6}


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
