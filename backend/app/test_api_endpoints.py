import sys
from fastapi.testclient import TestClient

from app.main import app

# Ensure stdout handles utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

client = TestClient(app)


def test_dishes_endpoints():
    print("=== Testing Dishes Endpoints ===")

    # 1. Default Random Dishes (limit 10)
    res = client.get("/api/v1/dishes/random")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    dishes = res.json()
    assert len(dishes) == 10, f"Expected 10 dishes, got {len(dishes)}"
    first = dishes[0]
    for required_key in ["id", "name", "cuisine", "cook_time_minutes", "spicy_level", "image", "short_description"]:
        assert required_key in first, f"Missing key '{required_key}' in DishCardResponse"
    print("  [PASS] GET /api/v1/dishes/random (default limit=10)")

    # 2. Limit boundary test
    res = client.get("/api/v1/dishes/random?limit=3")
    assert res.status_code == 200
    assert len(res.json()) == 3, f"Expected 3 dishes, got {len(res.json())}"
    print("  [PASS] GET /api/v1/dishes/random?limit=3")

    # 3. Limit validation failure (limit > 50)
    res = client.get("/api/v1/dishes/random?limit=99")
    assert res.status_code == 422, f"Expected 422 for limit=99, got {res.status_code}"
    print("  [PASS] GET /api/v1/dishes/random?limit=99 (validation error 422)")

    # 4. Spicy level validation failure (spicy_level > 3)
    res = client.get("/api/v1/dishes/random?spicy_level=5")
    assert res.status_code == 422, f"Expected 422 for spicy_level=5, got {res.status_code}"
    print("  [PASS] GET /api/v1/dishes/random?spicy_level=5 (validation error 422)")

    # 5. Cuisine filter case-insensitivity
    res_exact = client.get("/api/v1/dishes/random?cuisine=Vietnam&limit=5")
    assert res_exact.status_code == 200
    for d in res_exact.json():
        assert d["cuisine"].lower() == "vietnam", f"Expected Vietnam, got {d['cuisine']}"

    res_lower = client.get("/api/v1/dishes/random?cuisine=vietnam&limit=5")
    assert res_lower.status_code == 200
    for d in res_lower.json():
        assert d["cuisine"].lower() == "vietnam", f"Expected Vietnam, got {d['cuisine']}"
    print("  [PASS] GET /api/v1/dishes/random?cuisine=Vietnam & cuisine=vietnam (case-insensitivity)")

    # 6. Exclude IDs
    exclude = "dish_vn_001,dish_vn_002"
    res = client.get(f"/api/v1/dishes/random?limit=20&exclude_ids={exclude}")
    assert res.status_code == 200
    ids = [d["id"] for d in res.json()]
    assert "dish_vn_001" not in ids, "dish_vn_001 should be excluded"
    assert "dish_vn_002" not in ids, "dish_vn_002 should be excluded"
    print("  [PASS] GET /api/v1/dishes/random?exclude_ids=... (exclusion works)")

    # 7. Filters Metadata
    res = client.get("/api/v1/dishes/filters/metadata")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    meta = res.json()
    assert len(meta["cuisines"]) == 5, f"Expected 5 cuisines, got {len(meta['cuisines'])}"
    for c in meta["cuisines"]:
        assert "id" in c and "name" in c and "flag" in c, f"Incomplete cuisine item: {c}"
        assert c["flag"], f"Missing flag emoji value for {c['id']}"
    assert len(meta["spicy_levels"]) == 5
    assert len(meta["time_ranges"]) == 5
    print("  [PASS] GET /api/v1/dishes/filters/metadata (canonical route, flag emoji populated)")

    # 8. Detail of valid dish
    res = client.get("/api/v1/dishes/dish_vn_001")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    detail = res.json()
    assert detail["id"] == "dish_vn_001"
    assert len(detail["ingredients"]) > 0, "Expected ingredients in dish detail"
    assert len(detail["steps"]) > 0, "Expected cooking steps in dish detail"
    print(f"  [PASS] GET /api/v1/dishes/dish_vn_001 (ingredients: {len(detail['ingredients'])}, steps: {len(detail['steps'])})")

    # 9. Detail of non-existent dish
    res = client.get("/api/v1/dishes/dish_non_existent_999")
    assert res.status_code == 404, f"Expected 404, got {res.status_code}"
    print("  [PASS] GET /api/v1/dishes/non_existent (404 Not Found)")


def test_saved_dishes_endpoints():
    print("\n=== Testing Saved Dishes Endpoints ===")
    user_id = 1
    dish_id = "dish_vn_001"

    # Pre-clean if already saved
    client.delete(f"/api/v1/saved-dishes/{user_id}/{dish_id}")

    # 1. Save dish
    res = client.post("/api/v1/saved-dishes", json={"user_id": user_id, "dish_id": dish_id})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    saved_res = res.json()
    assert saved_res["success"] is True
    assert saved_res["saved_id"] is not None
    print(f"  [PASS] POST /api/v1/saved-dishes (saved_id: {saved_res['saved_id']})")

    # 2. Duplicate Save (should return 409 Conflict with session rollback)
    res = client.post("/api/v1/saved-dishes", json={"user_id": user_id, "dish_id": dish_id})
    assert res.status_code == 409, f"Expected 409 Conflict, got {res.status_code}: {res.text}"
    print("  [PASS] POST /api/v1/saved-dishes duplicate (409 Conflict handled cleanly)")

    # 3. Get user saved dishes (flattened fields check)
    res = client.get(f"/api/v1/saved-dishes/{user_id}")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    items = res.json()
    assert len(items) >= 1, "Expected at least 1 saved dish"
    found = next((item for item in items if item["dish_id"] == dish_id), None)
    assert found is not None, f"Saved dish {dish_id} not found in user list"
    assert found["name"] == "Phở Bò Tái Nạm"
    assert found["cuisine"] == "Vietnam"
    assert "saved_id" in found and "saved_at" in found
    print("  [PASS] GET /api/v1/saved-dishes/{user_id} (flattened fields verified)")

    # 4. Unsave dish
    res = client.delete(f"/api/v1/saved-dishes/{user_id}/{dish_id}")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    assert res.json()["success"] is True
    print("  [PASS] DELETE /api/v1/saved-dishes/{user_id}/{dish_id} (200 OK)")

    # 5. Unsave non-existent dish (should return 404)
    res = client.delete(f"/api/v1/saved-dishes/{user_id}/{dish_id}")
    assert res.status_code == 404, f"Expected 404, got {res.status_code}"
    print("  [PASS] DELETE /api/v1/saved-dishes/{user_id}/{dish_id} second time (404 Not Found)")


def main():
    test_dishes_endpoints()
    test_saved_dishes_endpoints()
    print("\n>>> ALL API INTEGRATION TESTS PASSED SUCCESSFULLY! <<<")


if __name__ == "__main__":
    main()
