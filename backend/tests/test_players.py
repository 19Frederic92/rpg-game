import pytest

@pytest.mark.anyio
async def test_health_check(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.anyio
async def test_create_player(client):
    response = await client.post("/api/players/create", json={
        "username": "TestHero",
        "player_class": "warrior"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "TestHero"
    assert data["player_class"] == "warrior"
    assert data["hp"] == 120

@pytest.mark.anyio
async def test_get_player(client):
    # Création d'abord
    await client.post("/api/players/create", json={
        "username": "TestHero",
        "player_class": "warrior"
    })

    response = await client.get("/api/players/TestHero")
    assert response.status_code == 200
    data = response.json()
    assert data["exists"] is True
    assert data["player"]["username"] == "TestHero"

@pytest.mark.anyio
async def test_delete_player(client):
    # Création
    res_create = await client.post("/api/players/create", json={
        "username": "ToDelete",
        "player_class": "rogue"
    })
    player_id = res_create.json()["id"]

    # Suppression
    response = await client.delete(f"/api/players/{player_id}")
    assert response.status_code == 204

    # Vérification
    res_get = await client.get("/api/players/ToDelete")
    assert res_get.json()["exists"] is False
