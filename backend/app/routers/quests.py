from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.quest import PlayerQuest, QuestStatus
from app.models.player import Player

router = APIRouter(prefix="/api/quests", tags=["quests"])


@router.get("/{player_id}")
async def get_player_quests(player_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PlayerQuest).where(PlayerQuest.player_id == player_id)
    )
    quests = result.scalars().all()
    return [
        {
            "id": q.id,
            "location_slug": q.location_slug,
            "title": q.quest_title,
            "description": q.quest_description,
            "xp_reward": q.xp_reward,
            "gold_reward": q.gold_reward,
            "status": q.status,
        }
        for q in quests
    ]


@router.post("/{quest_id}/complete")
async def complete_quest(quest_id: int, db: AsyncSession = Depends(get_db)):
    q_result = await db.execute(select(PlayerQuest).where(PlayerQuest.id == quest_id))
    quest = q_result.scalar_one_or_none()
    if not quest:
        raise HTTPException(status_code=404, detail="Quête introuvable")
    if quest.status == QuestStatus.completed:
        raise HTTPException(status_code=400, detail="Quête déjà complétée")

    p_result = await db.execute(select(Player).where(Player.id == quest.player_id))
    player = p_result.scalar_one_or_none()

    # Récompenses
    player.xp += quest.xp_reward
    player.gold += quest.gold_reward

    # Level up
    while player.xp >= player.xp_next_level:
        player.xp -= player.xp_next_level
        player.level += 1
        player.xp_next_level = int(player.xp_next_level * 1.5)
        player.max_hp += 10
        player.hp = player.max_hp
        player.max_energy += 5
        player.energy = player.max_energy
        player.strength += 2
        player.agility += 2

    quest.status = QuestStatus.completed
    await db.flush()

    return {
        "message": "Quête complétée !",
        "xp_gained": quest.xp_reward,
        "gold_gained": quest.gold_reward,
        "player_level": player.level,
        "player_xp": player.xp,
        "player_gold": player.gold,
    }