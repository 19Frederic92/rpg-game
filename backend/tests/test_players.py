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
    assert data["id"] is not None

@pytest.mark.anyio
async def test_persistence_flow(client):
    # 1. Create player
    username = "PersistHero"
    res_create = await client.post("/api/players/create", json={
        "username": username,
        "player_class": "mage"
    })
    assert res_create.status_code == 201
    player_id = res_create.json()["id"]

    # 2. Verify exists
    res_get = await client.get(f"/api/players/{username}")
    assert res_get.json()["exists"] is True

    # 3. Delete player
    res_del = await client.delete(f"/api/players/id/{player_id}")
    assert res_del.status_code == 204

    # 4. Verify gone (by name)
    res_get2 = await client.get(f"/api/players/{username}")
    assert res_get2.json()["exists"] is False

    # 5. Verify gone (by ID)
    res_get_id = await client.get(f"/api/players/id/{player_id}")
    assert res_get_id.status_code == 404

    # 6. Re-create same name (should succeed if truly deleted)
    res_recreate = await client.post("/api/players/create", json={
        "username": username,
        "player_class": "archer"
    })
    assert res_recreate.status_code == 201
