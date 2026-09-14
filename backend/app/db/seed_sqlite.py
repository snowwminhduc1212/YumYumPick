import json
import sqlite3
import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Xác định đường dẫn file
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DB_PATH = os.path.join(BASE_DIR, "yumyumpick.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")
SEED_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "dishes_seed.json")

def seed_database():
    print(f"🚀 [SEED] Đang kết nối tới CSDL SQLite: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Kích hoạt ràng buộc khóa ngoại
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 2. Khởi tạo cấu trúc bảng từ schema.sql
    if os.path.exists(SCHEMA_PATH):
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_sql = f.read()
        cursor.executescript(schema_sql)
        print("✅ [SEED] Đã khởi tạo các bảng SQLite thành công.")
    else:
        print(f"❌ [SEED] Không tìm thấy file schema tại {SCHEMA_PATH}")
        sys.exit(1)

    # 3. Nạp danh mục ẩm thực chuẩn (Cuisines)
    cuisines_data = [
        ("Vietnam", "Việt Nam", "🇻🇳"),
        ("Korea", "Hàn Quốc", "🇰🇷"),
        ("Japan", "Nhật Bản", "🇯🇵"),
        ("Thailand", "Thái Lan", "🇹🇭"),
        ("Italy", "Ý / Phương Tây", "🇮🇹")
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO cuisines (id, name, flag_emoji) VALUES (?, ?, ?)",
        cuisines_data
    )
    print(f"✅ [SEED] Đã đồng bộ {len(cuisines_data)} danh mục ẩm thực.")

    # 4. Tạo tài khoản mẫu (Demo user)
    cursor.execute("""
    INSERT OR IGNORE INTO users (id, username, password, full_name)
    VALUES (1, 'demo', '123', 'Người Dùng Mẫu')
    """)
    print("✅ [SEED] Đã tạo tài khoản test: username='demo' / password='123'")

    # 5. Đọc dữ liệu món ăn từ dishes_seed.json
    if not os.path.exists(SEED_FILE):
        print(f"❌ [SEED] Không tìm thấy file seed data tại {SEED_FILE}")
        sys.exit(1)

    with open(SEED_FILE, "r", encoding="utf-8") as f:
        dishes = json.load(f)

    inserted_dishes = 0
    total_ingredients = 0
    total_steps = 0

    for d in dishes:
        cursor.execute("""
        INSERT OR REPLACE INTO dishes (
            id, name, english_name, cuisine_id, region, image,
            cook_time_minutes, prep_time_minutes, difficulty,
            spicy_level, calories_approx, short_description, tips
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            d["id"],
            d["name"],
            d.get("english_name"),
            d["cuisine"],
            d.get("region"),
            d["image"],
            d["cook_time_minutes"],
            d.get("prep_time_minutes", 10),
            d.get("difficulty", "Dễ"),
            d.get("spicy_level", 0),
            d.get("calories_approx", 450),
            d["short_description"],
            d.get("tips")
        ))
        inserted_dishes += 1

        # Xóa các bản ghi phụ cũ nếu đang ghi đè để tránh rác
        cursor.execute("DELETE FROM ingredients WHERE dish_id = ?", (d["id"],))
        cursor.execute("DELETE FROM cooking_steps WHERE dish_id = ?", (d["id"],))

        # Nạp nguyên liệu
        for ing in d.get("ingredients", []):
            cursor.execute("""
            INSERT INTO ingredients (dish_id, name, amount, unit, category)
            VALUES (?, ?, ?, ?, ?)
            """, (d["id"], ing["name"], ing["amount"], ing["unit"], ing.get("category", "nguyên liệu chính")))
            total_ingredients += 1

        # Nạp bước nấu
        for st in d.get("steps", []):
            cursor.execute("""
            INSERT INTO cooking_steps (dish_id, step_number, title, description)
            VALUES (?, ?, ?, ?)
            """, (d["id"], st["step_number"], st["title"], st["description"]))
            total_steps += 1

    conn.commit()
    conn.close()

    print("\n🎉 ========================================================")
    print(f"  HOÀN THÀNH SEEDING DỮ LIỆU SQLITE CHO YUMYUMPICK!")
    print(f"  • Tổng số món ăn đã nạp:      {inserted_dishes} món")
    print(f"  • Tổng số nguyên liệu chi tiết: {total_ingredients} bản ghi")
    print(f"  • Tổng số bước chế biến 1-2-3: {total_steps} bước")
    print(f"  • Vị trí file CSDL:             {DB_PATH}")
    print("========================================================\n")

if __name__ == "__main__":
    seed_database()
