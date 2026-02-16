from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.location import Location, LOCATIONS_DATA
from app.models.quest import PlayerQuest, PlayerVisit, QuestStatus, LOCATION_QUESTS
from app.models.player import Player

router = APIRouter(prefix="/api/locations", tags=["locations"])


class VisitResponse(BaseModel):
    location: dict
    quest: Optional[dict] = None
    first_visit: bool
    player_xp: int
    player_gold: int
    player_level: int


async def ensure_locations(db: AsyncSession):
    result = await db.execute(select(Location))
    if not result.scalars().first():
        for data in LOCATIONS_DATA:
            db.add(Location(**data))
        await db.flush()


@router.get("/all")
async def get_all_locations(db: AsyncSession = Depends(get_db)):
    await ensure_locations(db)
    result = await db.execute(select(Location))
    locations = result.scalars().all()
    return [
        {
            "slug": l.slug,
            "name": l.name,
            "description": l.description,
            "flavor_text": l.flavor_text,
            "enemies": l.enemies,
            "connected_to": l.connected_to,
            "min_level": l.min_level,
        }
        for l in locations
    ]


@router.post("/visit/{player_id}/{location_slug}", response_model=VisitResponse)
async def visit_location(
    player_id: int,
    location_slug: str,
    db: AsyncSession = Depends(get_db),
):
    await ensure_locations(db)

    # Vérifier joueur
    p_result = await db.execute(select(Player).where(Player.id == player_id))
    player = p_result.scalar_one_or_none()
    if not player:
        raise HTTPException(status_code=404, detail="Joueur introuvable")

    # Vérifier lieu
    l_result = await db.execute(select(Location).where(Location.slug == location_slug))
    location = l_result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=404, detail="Lieu introuvable")

    if player.level < location.min_level:
        raise HTTPException(
            status_code=403,
            detail=f"Niveau {location.min_level} requis pour accéder à ce lieu"
        )

    # Première visite ?
    v_result = await db.execute(
        select(PlayerVisit).where(
            PlayerVisit.player_id == player_id,
            PlayerVisit.location_slug == location_slug,
        )
    )
    first_visit = v_result.scalar_one_or_none() is None

    quest_data = None

    if first_visit:
        # Enregistrer la visite
        db.add(PlayerVisit(player_id=player_id, location_slug=location_slug))

        # Déclencher la quête
        if location_slug in LOCATION_QUESTS:
            q = LOCATION_QUESTS[location_slug]
            new_quest = PlayerQuest(
                player_id=player_id,
                location_slug=location_slug,
                quest_title=q["title"],
                quest_description=q["description"],
                xp_reward=q["xp_reward"],
                gold_reward=q["gold_reward"],
                status=QuestStatus.active,
            )
            db.add(new_quest)
            await db.flush()
            quest_data = {
                "id": new_quest.id,
                "title": new_quest.quest_title,
                "description": new_quest.quest_description,
                "xp_reward": new_quest.xp_reward,
                "gold_reward": new_quest.gold_reward,
                "status": new_quest.status,
            }
    else:
        # Récupérer quête existante
        q_result = await db.execute(
            select(PlayerQuest).where(
                PlayerQuest.player_id == player_id,
                PlayerQuest.location_slug == location_slug,
            )
        )
        existing_quest = q_result.scalar_one_or_none()
        if existing_quest:
            quest_data = {
                "id": existing_quest.id,
                "title": existing_quest.quest_title,
                "description": existing_quest.quest_description,
                "xp_reward": existing_quest.xp_reward,
                "gold_reward": existing_quest.gold_reward,
                "status": existing_quest.status,
            }

    await db.flush()

    return VisitResponse(
        location={
            "slug": location.slug,
            "name": location.name,
            "description": location.description,
            "flavor_text": location.flavor_text,
            "enemies": location.enemies,
            "connected_to": location.connected_to,
            "min_level": location.min_level,
        },
        quest=quest_data,
        first_visit=first_visit,
        player_xp=player.xp,
        player_gold=player.gold,
        player_level=player.level,
    )


@router.get("/visits/{player_id}")
async def get_player_visits(player_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PlayerVisit.location_slug).where(PlayerVisit.player_id == player_id)
    )
    return {"visited": [r[0] for r in result.fetchall()]}