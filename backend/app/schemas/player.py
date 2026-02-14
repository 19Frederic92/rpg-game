from pydantic import BaseModel, field_validator
from datetime import datetime
from app.models.player import PlayerClass


class PlayerCreate(BaseModel):
    username: str
    player_class: PlayerClass

    @field_validator("username")
    @classmethod
    def username_valid(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Le nom doit faire au moins 3 caractères")
        if len(v) > 20:
            raise ValueError("Le nom ne peut pas dépasser 20 caractères")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Caractères autorisés : lettres, chiffres, - et _")
        return v


class PlayerResponse(BaseModel):
    id: int
    username: str
    player_class: PlayerClass
    level: int
    xp: int
    xp_next_level: int
    hp: int
    max_hp: int
    energy: int
    max_energy: int
    strength: int
    agility: int
    gold: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PlayerExists(BaseModel):
    exists: bool
    player: PlayerResponse | None = None
