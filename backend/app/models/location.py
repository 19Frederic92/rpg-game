from sqlalchemy import Column, Integer, String, JSON
from app.database import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    flavor_text = Column(String(300))
    enemies = Column(JSON, default=list)
    connected_to = Column(JSON, default=list)
    min_level = Column(Integer, default=1)


# Données initiales des lieux
LOCATIONS_DATA = [
    {
        "slug": "village",
        "name": "Village de Cendremont",
        "description": "Un village paisible au carrefour des routes. Les habitants vous accueillent avec méfiance mais espoir.",
        "flavor_text": "Des fumées s'élèvent des cheminées. Un forgeron martèle le fer dans l'aube grise.",
        "enemies": [],
        "connected_to": ["forest", "ruins"],
        "min_level": 1,
    },
    {
        "slug": "forest",
        "name": "Forêt des Murmures",
        "description": "Une forêt ancienne où les arbres semblent vous observer. Des créatures rôdent entre les ombres.",
        "flavor_text": "Les branches craquent. Quelque chose vous suit depuis un moment.",
        "enemies": [{"name": "Loup des ombres", "hp": 30, "strength": 6, "xp": 40, "gold": 5}],
        "connected_to": ["village", "ruins", "dungeon"],
        "min_level": 1,
    },
    {
        "slug": "ruins",
        "name": "Ruines d'Eldrath",
        "description": "Les vestiges d'une civilisation oubliée. Des golems de pierre gardent encore ces lieux maudits.",
        "flavor_text": "Des inscriptions anciennes couvrent les murs. Certaines semblent... récentes.",
        "enemies": [{"name": "Golem de pierre", "hp": 60, "strength": 10, "xp": 80, "gold": 12}],
        "connected_to": ["village", "forest", "dungeon"],
        "min_level": 2,
    },
    {
        "slug": "dungeon",
        "name": "Donjon de l'Abîme",
        "description": "Un donjon sans fond où règne une obscurité totale. Seuls les plus courageux osent y descendre.",
        "flavor_text": "Un vent glacial remonte des profondeurs. On entend des chaînes tinter dans le noir.",
        "enemies": [{"name": "Démon enchaîné", "hp": 100, "strength": 16, "xp": 150, "gold": 25}],
        "connected_to": ["forest", "ruins"],
        "min_level": 3,
    },
]