from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.player import Player, CLASS_BASE_STATS
from app.schemas.player import PlayerCreate, PlayerResponse, PlayerExists

router = APIRouter(prefix="/api/players", tags=["players"])


@router.post("/create", response_model=PlayerResponse, status_code=201)
async def create_player(data: PlayerCreate, db: AsyncSession = Depends(get_db)):
    # Vérifier que le nom n'est pas déjà pris
    existing = await db.execute(select(Player).where(Player.username == data.username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Ce nom est déjà pris")

    stats = CLASS_BASE_STATS[data.player_class]
    player = Player(
        username=data.username,
        player_class=data.player_class,
        hp=stats["hp"],
        max_hp=stats["hp"],
        energy=stats["energy"],
        max_energy=stats["energy"],
        strength=stats["strength"],
        agility=stats["agility"],
    )
    db.add(player)
    await db.flush()
    await db.commit()
    await db.refresh(player)
    return player


@router.get("/{username}", response_model=PlayerExists)
async def get_player(username: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if not player:
        return PlayerExists(exists=False)
    return PlayerExists(exists=True, player=PlayerResponse.model_validate(player))


@router.get("/id/{player_id}", response_model=PlayerResponse)
async def get_player_by_id(player_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalar_one_or_none()
    if not player:
        raise HTTPException(status_code=404, detail="Personnage introuvable")
    return player


@router.delete("/id/{player_id}", status_code=204)
async def delete_player(player_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalar_one_or_none()
    if not player:
        raise HTTPException(status_code=404, detail="Personnage introuvable")
    await db.delete(player)
    await db.commit()
    return None