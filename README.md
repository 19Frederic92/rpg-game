# ⚔️ Chronicles of the Void

RPG textuel enrichi — hébergé sur VPS avec FastAPI, PostgreSQL et Docker.

## Stack
- **Backend** : Python 3.12 + FastAPI + SQLAlchemy (async) + PostgreSQL
- **Frontend** : HTML/CSS/JS vanilla (dark fantasy)
- **Infra** : Docker Compose + Nginx + GitHub Actions

## Lancement en local

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 2. Lancer les services
docker compose up --build

# 3. Accéder au jeu
# → http://localhost
# → API docs : http://localhost/api/docs
```

## Déploiement automatique (GitHub Actions)

Ajouter ces secrets dans votre repo GitHub (Settings → Secrets) :

| Secret | Valeur |
|---|---|
| `VPS_IP` | `51.210.245.130` |
| `VPS_USER` | Votre user SSH (ex: `root` ou `ubuntu`) |
| `SSH_PRIVATE_KEY` | Contenu de votre clé privée `~/.ssh/id_rsa` |

Puis sur votre VPS, cloner le repo :
```bash
git clone https://github.com/VOTRE_USER/rpg-game.git /opt/rpg-game
cp /opt/rpg-game/.env.example /opt/rpg-game/.env
# Éditer .env
```

Chaque push sur `main` déclenche un déploiement automatique.

## Structure
```
rpg-game/
├── backend/          # API FastAPI
├── frontend/         # Interface navigateur
├── nginx/            # Reverse proxy
└── .github/          # CI/CD
```

## Roadmap
- [x] Étape 1 — Socle technique
- [ ] Étape 2 — Création de personnage
- [ ] Étape 3 — Exploration & quêtes
- [ ] Étape 4 — Inventaire
- [ ] Étape 5 — Combat temps réel (WebSocket)
- [ ] Étape 6 — Polish UI
