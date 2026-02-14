from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base


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
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "RPG Game API is running 🗡️"}
