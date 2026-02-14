from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class PlayerClass(str, enum.Enum):
    warrior = "warrior"
    mage = "mage"
    archer = "archer"
    rogue = "rogue"


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    player_class = Column(SAEnum(PlayerClass), nullable=False)

    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    xp_next_level = Column(Integer, default=100)

    hp = Column(Integer, nullable=False)
    max_hp = Column(Integer, nullable=False)
    energy = Column(Integer, nullable=False)
    max_energy = Column(Integer, nullable=False)

    strength = Column(Integer, nullable=False)
    agility = Column(Integer, nullable=False)

    gold = Column(Integer, default=50)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Stats de départ par classe
CLASS_BASE_STATS = {
    PlayerClass.warrior: {"hp": 120, "energy": 60,  "strength": 15, "agility": 8},
    PlayerClass.mage:    {"hp": 70,  "energy": 120, "strength": 6,  "agility": 10},
    PlayerClass.archer:  {"hp": 90,  "energy": 90,  "strength": 10, "agility": 14},
    PlayerClass.rogue:   {"hp": 80,  "energy": 100, "strength": 8,  "agility": 16},
}
