from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routers import players, locations, quests
import app.models.player    # noqa: F401 — enregistre les modèles
import app.models.location  # noqa: F401
import app.models.quest     # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Création des tables au démarrage
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Nettoyage à l'arrêt
    await engine.dispose()


app = FastAPI(
    title="RPG Game API",
    description="Backend du jeu RPG textuel",
    version="0.3.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router)
app.include_router(locations.router)
app.include_router(quests.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "RPG Game API is running 🗡️"}