from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database import Base
import enum


class QuestStatus(str, enum.Enum):
    active = "active"
    completed = "completed"


class PlayerQuest(Base):
    __tablename__ = "player_quests"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    location_slug = Column(String(50), nullable=False)
    quest_title = Column(String(100), nullable=False)
    quest_description = Column(String(500), nullable=False)
    status = Column(SAEnum(QuestStatus), default=QuestStatus.active)
    xp_reward = Column(Integer, default=0)
    gold_reward = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PlayerVisit(Base):
    __tablename__ = "player_visits"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    location_slug = Column(String(50), nullable=False)
    visited_at = Column(DateTime(timezone=True), server_default=func.now())


# Quêtes déclenchées par lieu
LOCATION_QUESTS = {
    "village": {
        "title": "L'appel du village",
        "description": "Le maire de Cendremont vous demande d'explorer les environs. Des disparitions inexpliquées troublent la région.",
        "xp_reward": 50,
        "gold_reward": 20,
    },
    "forest": {
        "title": "Les ombres de la forêt",
        "description": "Une meute de loups des ombres terrorise les voyageurs. Éliminez leur chef pour sécuriser le chemin.",
        "xp_reward": 100,
        "gold_reward": 30,
    },
    "ruins": {
        "title": "Secrets d'Eldrath",
        "description": "Un érudit vous demande de retrouver une tablette ancienne cachée dans les ruines. Des golems gardent jalousement ces lieux.",
        "xp_reward": 180,
        "gold_reward": 50,
    },
    "dungeon": {
        "title": "Descente dans l'Abîme",
        "description": "Une force obscure s'est réveillée dans les profondeurs. Il faut briser les chaînes du Démon avant qu'il ne soit trop tard.",
        "xp_reward": 300,
        "gold_reward": 80,
    },
}