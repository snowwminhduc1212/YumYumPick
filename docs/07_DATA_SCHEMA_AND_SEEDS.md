# 🍲 07. Data Schema, SQLite DDL & Food Seed Specification

Tài liệu này định nghĩa cấu trúc CSDL **SQLite**, kịch bản DDL tạo bảng, quy chuẩn chuẩn bị dữ liệu món ăn (Data Curation Process), bộ dữ liệu mẫu JSON và kịch bản tự động nạp dữ liệu (Seeding Script) cho dự án **YumYumPick**.

---

## 1. Kịch Bản Tạo Bảng CSDL SQLite (SQLite DDL Schema)

Toàn bộ CSDL được lưu trữ trong một file duy nhất: `backend/yumyumpick.db`.

```sql
-- Kích hoạt ràng buộc khóa ngoại trong SQLite
PRAGMA foreign_keys = ON;

-- 1. Bảng người dùng đơn giản (Simple Users)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng danh mục quốc gia / ẩm thực (Cuisines)
CREATE TABLE IF NOT EXISTS cuisines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    flag_emoji TEXT NOT NULL
);

-- 3. Bảng món ăn chính (Dishes)
CREATE TABLE IF NOT EXISTS dishes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    english_name TEXT,
    cuisine_id TEXT NOT NULL,
    region TEXT,
    image TEXT NOT NULL,
    cook_time_minutes INTEGER NOT NULL,
    prep_time_minutes INTEGER DEFAULT 10,
    difficulty TEXT DEFAULT 'Dễ',
    spicy_level INTEGER DEFAULT 0,
    calories_approx INTEGER DEFAULT 400,
    short_description TEXT NOT NULL,
    tips TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON UPDATE CASCADE
);

-- 4. Bảng nguyên liệu chi tiết (Ingredients)
CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount TEXT NOT NULL,
    unit TEXT NOT NULL,
    category TEXT DEFAULT 'nguyên liệu chính',
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- 5. Bảng các bước nấu ăn (Cooking Steps)
CREATE TABLE IF NOT EXISTS cooking_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- 6. Bảng nhãn gắn kèm (Tags)
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 7. Bảng liên kết Món ăn - Nhãn (Dish Tags)
CREATE TABLE IF NOT EXISTS dish_tags (
    dish_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (dish_id, tag_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 8. Bảng món ăn đã lưu của người dùng (User Saved Dishes)
CREATE TABLE IF NOT EXISTS user_saved_dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    dish_id TEXT NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, dish_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Tạo chỉ mục tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_dishes_cuisine ON dishes(cuisine_id);
CREATE INDEX IF NOT EXISTS idx_dishes_cook_time ON dishes(cook_time_minutes);
CREATE INDEX IF NOT EXISTS idx_saved_user ON user_saved_dishes(user_id);
```

---

## 2. Quy Trình Chuẩn Bị Dữ Liệu (Data Preparation Process)

Để đảm bảo dữ liệu chất lượng cao và hoàn thành kịp tiến độ 5 ngày, quy trình chuẩn bị dữ liệu được phân chia cụ thể như sau:

```mermaid
flowchart LR
    Step1["1. Nghiên cứu & Chọn 40-50 món phổ biến"] --> Step2["2. Thu thập hình ảnh nét từ Unsplash/Pexels"]
    Step2 --> Step3["3. Biên tập nguyên liệu & bước nấu 1-2-3"]
    Step3 --> Step4["4. Đóng gói vào dishes_seed.json"]
    Step4 --> Step5["5. Chạy seed_sqlite.py nạp vào DB"]
```

### 2.1. Phân Bổ Danh Mục Món Ăn (Target 40-50 món)
1. 🇻🇳 **Việt Nam (15 món):** Phở bò tái nạm, Cơm tấm sườn bì chả, Bún chả Hà Nội, Bánh mì chảo, Bún bò Huế, Gỏi cuốn tôm thịt, Canh chua cá lóc, Bánh xèo miền Tây, Bò kho bánh mì, Chả giò chiên giòn, Cá kho tộ, Cơm chiên dương châu, Hủ tiếu Nam Vang, Bún riêu cua, Gà kho gừng.
2. 🇰🇷 **Hàn Quốc (8 món):** Cơm trộn Bibimbap, Canh kim chi đậu hũ thịt ba chỉ, Bánh gạo cay Tokbokki, Thịt bò xào Bulgogi, Miến xào rau củ Japchae, Gà rán sốt cay ngọt, Canh rong biển thịt bò, Trứng hấp Gyeran-jjim.
3. 🇯🇵 **Nhật Bản (8 món):** Mì Ramen thịt xá xíu, Cơm cà ri bò Nhật Bản, Mì Udon xào thịt bò, Cơm bò sốt hành Gyudon, Trứng cuộn ngọt Tamagoyaki, Cơm lươn nướng Unadon, Bánh xèo Okonomiyaki, Gà chiên giòn Karaage.
4. 🇹🇭 **Thái Lan (8 món):** Mì xào kiểu Thái (Pad Thai), Canh chua tôm cay (Tom Yum Goong), Cơm thịt heo băm xào lá quế (Pad Krapow), Gỏi đu đủ tôm khô (Som Tum), Cà ri xanh thịt gà, Cơm chiên trái thơm, Súp gà nước cốt dừa (Tom Kha Gai), Cánh gà chiên mắm Thái.
5. 🇮🇹 **Ý / Phương Tây (8 món):** Mì Ý sốt bò băm (Spaghetti Bolognese), Mì Ý sốt kem thịt xông khói (Spaghetti Carbonara), Pizza Margherita phô mai, Salad cá ngừ trứng luộc, Beefsteak sốt tiêu đen, Súp bí đỏ kem tươi, Mì Ý hải sản sốt cà chua, Bánh kẹp gà nướng sốt Pesto.

### 2.2. Tiêu Chí Chuẩn Hóa Hình Ảnh
- **Độ phân giải:** Tối thiểu $800 \times 600\text{px}$, tỉ lệ khung ảnh dọc hoặc $4:3$.
- **Nguồn:** Sử dụng ảnh Unsplash hoặc Pexels miễn phí bản quyền kèm thông số query tối ưu tải nhanh (`auto=format&fit=crop&w=800&q=80`).

---

## 3. Cấu Trúc File Dữ Liệu Mẫu (`dishes_seed.json`)

File được lưu trữ tại `backend/app/data/dishes_seed.json`:

```json
[
  {
    "id": "dish_vn_001",
    "name": "Phở Bò Tái Nạm",
    "english_name": "Traditional Beef Pho",
    "cuisine": "Vietnam",
    "region": "Miền Bắc",
    "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    "cook_time_minutes": 45,
    "prep_time_minutes": 15,
    "difficulty": "Trung bình",
    "spicy_level": 0,
    "calories_approx": 480,
    "short_description": "Món quốc hồn quốc túy với nước dùng thanh ngọt hầm từ xương bò, thơm mùi hồi quế đặc trưng.",
    "tips": "Nướng gừng và hành tím trước khi thả vào nồi nước dùng sẽ giúp nước trong và thơm dậy mùi gấp đôi.",
    "ingredients": [
      { "name": "Bánh phở tươi", "amount": "500", "unit": "g", "category": "tinh bột" },
      { "name": "Thịt bò nạm và thăn", "amount": "300", "unit": "g", "category": "thịt" },
      { "name": "Xương ống bò", "amount": "1", "unit": "kg", "category": "thịt" },
      { "name": "Gừng và hành tím nướng", "amount": "3", "unit": "củ", "category": "gia vị" },
      { "name": "Hoa hồi, quế, thảo quả", "amount": "1", "unit": "gói", "category": "gia vị" },
      { "name": "Hành lá, ngò gai, chanh, ớt", "amount": "1", "unit": "ít", "category": "rau thơm" }
    ],
    "steps": [
      { "step_number": 1, "title": "Sơ chế & Trụng xương", "description": "Rửa sạch xương bò với nước muối, đun sôi 5 phút để khử bọt bẩn rồi rửa lại bằng nước lạnh." },
      { "step_number": 2, "title": "Hầm nước dùng", "description": "Ninh xương bò cùng gừng hành tím nướng và gói thảo quả quế hồi trên lửa nhỏ liu riu trong 40 phút, hớt bọt thường xuyên." },
      { "step_number": 3, "title": "Hoàn thiện & Thưởng thức", "description": "Trụng bánh phở vào tô, xếp thịt bò thái mỏng lên trên, chan nước dùng thật sôi vào để thịt chín tái, rắc hành lá và ớt tươi." }
    ]
  },
  {
    "id": "dish_kr_001",
    "name": "Cơm Trộn Bibimbap",
    "english_name": "Korean Mixed Rice",
    "cuisine": "Korea",
    "region": "Seoul",
    "image": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80",
    "cook_time_minutes": 25,
    "prep_time_minutes": 15,
    "difficulty": "Dễ",
    "spicy_level": 1,
    "calories_approx": 520,
    "short_description": "Tô cơm trộn rực rỡ sắc màu ngũ hành với thịt bò xào, rau củ xào mè thơm phức và sốt Gochujang cay dịu.",
    "tips": "Nếu dùng thố đá, quét một lớp dầu mè dưới đáy thố trước khi cho cơm vào để tạo lớp cháy giòn rụm khó cưỡng.",
    "ingredients": [
      { "name": "Cơm trắng nấu dẻo", "amount": "2", "unit": "chén", "category": "tinh bột" },
      { "name": "Thịt bò thái lát mỏng", "amount": "150", "unit": "g", "category": "thịt" },
      { "name": "Cà rốt, bí ngòi, giá đỗ", "amount": "100", "unit": "g mỗi loại", "category": "rau củ" },
      { "name": "Nấm đông cô tươi", "amount": "50", "unit": "g", "category": "rau củ" },
      { "name": "Trứng gà", "amount": "1", "unit": "quả", "category": "trứng" },
      { "name": "Tương ớt Hàn Quốc Gochujang", "amount": "2", "unit": "muỗng canh", "category": "gia vị" }
    ],
    "steps": [
      { "step_number": 1, "title": "Sơ chế rau củ", "description": "Thái sợi cà rốt, bí ngòi và nấm. Luộc sơ giá đỗ rồi vắt ráo nước." },
      { "step_number": 2, "title": "Xào nguyên liệu", "description": "Xào riêng từng loại rau củ với một chút dầu mè và tỏi phi. Xào chín tới thịt bò ướp nước tương." },
      { "step_number": 3, "title": "Trình bày", "description": "Xới cơm ra tô, xếp rau củ và thịt bò theo vòng tròn, đặt trứng ốp la lòng đào vào giữa kèm muỗng sốt Gochujang." }
    ]
  },
  {
    "id": "dish_jp_001",
    "name": "Mì Ramen Thịt Xá Xíu",
    "english_name": "Japanese Chashu Ramen",
    "cuisine": "Japan",
    "region": "Tokyo",
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    "cook_time_minutes": 30,
    "prep_time_minutes": 10,
    "difficulty": "Trung bình",
    "spicy_level": 0,
    "calories_approx": 580,
    "short_description": "Món mì trứ danh xứ Phù Tang với sợi mì dai vàng óng, thịt cuộn mềm tan và nước dùng xương béo ngậy.",
    "tips": "Trứng ngâm tương lòng đào nên luộc đúng 6 phút rồi ngâm ngay vào nước đá lạnh để lòng đào dẻo mịn.",
    "ingredients": [
      { "name": "Mì Ramen tươi", "amount": "2", "unit": "vắt", "category": "tinh bột" },
      { "name": "Thịt ba chỉ xá xíu", "amount": "150", "unit": "g", "category": "thịt" },
      { "name": "Nước cốt xương hầm Tonkotsu", "amount": "600", "unit": "ml", "category": "nước dùng" },
      { "name": "Trứng ngâm tương lòng đào", "amount": "1", "unit": "quả", "category": "trứng" },
      { "name": "Rong biển khô Nori", "amount": "2", "unit": "miếng", "category": "gia vị" }
    ],
    "steps": [
      { "step_number": 1, "title": "Nấu nước cốt", "description": "Đun nóng nước hầm xương với nước tương Nhật Shoyu và gừng băm cho sôi lăn tăn." },
      { "step_number": 2, "title": "Trụng mì", "description": "Trụng vắt mì tươi trong nước sôi 2 phút cho mì vừa chín tới, vớt ra để ráo nước." },
      { "step_number": 3, "title": "Xếp tô mì", "description": "Cho mì vào tô sâu lòng, rót nước súp nóng, xếp thịt xá xíu thái lát, nửa quả trứng lòng đào và lá rong biển lên trên." }
    ]
  },
  {
    "id": "dish_th_001",
    "name": "Pad Thai Tôm Tươi",
    "english_name": "Traditional Pad Thai",
    "cuisine": "Thailand",
    "region": "Bangkok",
    "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    "cook_time_minutes": 20,
    "prep_time_minutes": 10,
    "difficulty": "Dễ",
    "spicy_level": 2,
    "calories_approx": 460,
    "short_description": "Món xào biểu tượng của ẩm thực đường phố Thái Lan hòa quyện vị chua ngọt của sốt me, tôm tươi giòn và đậu phộng rang.",
    "tips": "Xào trên chảo thật nóng với lửa lớn để sợi hủ tiếu ngấm gia vị mà không bị nát nhũn.",
    "ingredients": [
      { "name": "Bánh hủ tiếu xào Pad Thai", "amount": "200", "unit": "g", "category": "tinh bột" },
      { "name": "Tôm sú tươi bóc vỏ", "amount": "150", "unit": "g", "category": "thịt" },
      { "name": "Đậu hũ chiên thái hạt lựu", "amount": "1", "unit": "bìa", "category": "khác" },
      { "name": "Nước cốt me chua ngọt", "amount": "3", "unit": "muỗng canh", "category": "gia vị" },
      { "name": "Đậu phộng rang giã dập", "amount": "2", "unit": "muỗng canh", "category": "gia vị" }
    ],
    "steps": [
      { "step_number": 1, "title": "Xào tôm & đậu hũ", "description": "Phi thơm tỏi và ớt, cho tôm và đậu hũ vào đảo đều cho săn lại." },
      { "step_number": 2, "title": "Xào mì với sốt me", "description": "Cho sợi hủ tiếu đã ngâm mềm vào chảo, rưới nước sốt me, đập thêm quả trứng vào xào đảo nhanh tay." },
      { "step_number": 3, "title": "Hoàn tất", "description": "Thêm giá đỗ và hẹ lá, đảo thêm 30 giây rồi tắt bếp. Múc ra đĩa, rắc đậu phộng rang và vắt chanh thưởng thức." }
    ]
  },
  {
    "id": "dish_it_001",
    "name": "Mì Ý Sốt Bò Băm Bolognese",
    "english_name": "Spaghetti Bolognese",
    "cuisine": "Italy",
    "region": "Bologna",
    "image": "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80",
    "cook_time_minutes": 25,
    "prep_time_minutes": 10,
    "difficulty": "Dễ",
    "spicy_level": 0,
    "calories_approx": 510,
    "short_description": "Món mì Ý cổ điển với sốt cà chua đượm vị ninh cùng thịt bò băm thơm lừng lá nguyệt quế và phô mai Parmesan.",
    "tips": "Luộc mì theo tiêu chuẩn 'Al dente' (còn độ sần sật nhẹ ở lõi) bằng cách vớt ra sớm hơn hướng dẫn 1 phút rồi đảo cùng sốt nóng.",
    "ingredients": [
      { "name": "Mì sợi Spaghetti", "amount": "200", "unit": "g", "category": "tinh bột" },
      { "name": "Thịt bò nạc xay nhuyễn", "amount": "200", "unit": "g", "category": "thịt" },
      { "name": "Cà chua chín băm nhỏ", "amount": "3", "unit": "quả", "category": "rau củ" },
      { "name": "Hành tây & tỏi băm", "amount": "1", "unit": "củ", "category": "gia vị" },
      { "name": "Phô mai bột Parmesan", "amount": "2", "unit": "muỗng", "category": "khác" }
    ],
    "steps": [
      { "step_number": 1, "title": "Luộc mì Spaghetti", "description": "Đun nồi nước lớn với 1 muỗng cà phê muối, cho mì vào luộc trong 8 phút rồi vớt ra xóc với một chút dầu ô-liu." },
      { "step_number": 2, "title": "Nấu sốt Bolognese", "description": "Phi thơm hành tây tỏi băm, cho thịt bò xay vào xào săn. Thêm cà chua băm và tương cà, nêm gia vị rồi đun nhỏ lửa 10 phút." },
      { "step_number": 3, "title": "Trình bày", "description": "Gắp mì ra đĩa tròn, rưới sốt bò băm đỏ sánh lên trên và rắc phô mai bột thơm béo." }
    ]
  }
]
```

---

## 4. Script Python Tự Động Nạp Dữ Liệu (`seed_sqlite.py`)

File script đặt tại `backend/app/db/seed_sqlite.py`. Chỉ cần chạy lệnh:
```bash
python -m app.db.seed_sqlite
```

```python
import json
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "yumyumpick.db")
SEED_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "dishes_seed.json")

def init_and_seed():
    print(f"Connecting to SQLite: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Kích hoạt Foreign Keys
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 2. Tạo bảng nếu chưa có
    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cuisines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        flag_emoji TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dishes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        english_name TEXT,
        cuisine_id TEXT NOT NULL,
        region TEXT,
        image TEXT NOT NULL,
        cook_time_minutes INTEGER NOT NULL,
        prep_time_minutes INTEGER DEFAULT 10,
        difficulty TEXT DEFAULT 'Dễ',
        spicy_level INTEGER DEFAULT 0,
        calories_approx INTEGER DEFAULT 400,
        short_description TEXT NOT NULL,
        tips TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cuisine_id) REFERENCES cuisines(id)
    );

    CREATE TABLE IF NOT EXISTS ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish_id TEXT NOT NULL,
        name TEXT NOT NULL,
        amount TEXT NOT NULL,
        unit TEXT NOT NULL,
        category TEXT,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cooking_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish_id TEXT NOT NULL,
        step_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_saved_dishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        dish_id TEXT NOT NULL,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, dish_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
    );
    """)

    # 3. Nạp danh mục ẩm thực chuẩn
    cuisines_data = [
        ("Vietnam", "Việt Nam", "🇻🇳"),
        ("Korea", "Hàn Quốc", "🇰🇷"),
        ("Japan", "Nhật Bản", "🇯🇵"),
        ("Thailand", "Thái Lan", "🇹🇭"),
        ("Italy", "Ý / Châu Âu", "🇮🇹")
    ]
    cursor.executemany(
        "INSERT OR IGNORE INTO cuisines (id, name, flag_emoji) VALUES (?, ?, ?)",
        cuisines_data
    )

    # 4. Tạo sẵn 1 tài khoản mẫu để test ngay
    cursor.execute("""
    INSERT OR IGNORE INTO users (id, username, password, full_name)
    VALUES (1, 'demo', '123', 'Người Dùng Mẫu')
    """)

    # 5. Đọc file seed JSON và nạp vào DB
    if os.path.exists(SEED_FILE):
        with open(SEED_FILE, "r", encoding="utf-8") as f:
            dishes = json.load(f)

        for d in dishes:
            cursor.execute("""
            INSERT OR REPLACE INTO dishes (
                id, name, english_name, cuisine_id, region, image, 
                cook_time_minutes, prep_time_minutes, difficulty, 
                spicy_level, calories_approx, short_description, tips
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                d["id"], d["name"], d.get("english_name"), d["cuisine"],
                d.get("region"), d["image"], d["cook_time_minutes"],
                d.get("prep_time_minutes", 10), d.get("difficulty", "Dễ"),
                d.get("spicy_level", 0), d.get("calories_approx", 450),
                d["short_description"], d.get("tips")
            ))

            # Xóa nguyên liệu và bước nấu cũ để tránh trùng lặp
            cursor.execute("DELETE FROM ingredients WHERE dish_id = ?", (d["id"],))
            cursor.execute("DELETE FROM cooking_steps WHERE dish_id = ?", (d["id"],))

            # Nạp nguyên liệu
            for ing in d.get("ingredients", []):
                cursor.execute("""
                INSERT INTO ingredients (dish_id, name, amount, unit, category)
                VALUES (?, ?, ?, ?, ?)
                """, (d["id"], ing["name"], ing["amount"], ing["unit"], ing.get("category")))

            # Nạp bước nấu
            for st in d.get("steps", []):
                cursor.execute("""
                INSERT INTO cooking_steps (dish_id, step_number, title, description)
                VALUES (?, ?, ?, ?)
                """, (d["id"], st["step_number"], st["title"], st["description"]))

        print(f"Đã nạp thành công {len(dishes)} món ăn vào CSDL SQLite!")
    else:
        print(f"Cảnh báo: Không tìm thấy file {SEED_FILE}")

    conn.commit()
    conn.close()
    print("Khởi tạo và Seed dữ liệu hoàn tất!")

if __name__ == "__main__":
    init_and_seed()
```

---

## 5. Quản Lý Dữ Liệu Trực Tiếp Bằng "DB Browser for SQLite"

Sau khi bỏ trang Admin CMS, nhóm phát triển có thể tự mở và chỉnh sửa CSDL một cách trực quan trong 3 bước:
1. Tải phần mềm miễn phí **DB Browser for SQLite** (tại [sqlitebrowser.org](https://sqlitebrowser.org)).
2. Bấm **Open Database** $\rightarrow$ chọn file `backend/yumyumpick.db`.
3. Chuyển sang tab **Browse Data** để xem, thêm trực tiếp món ăn mới hoặc chỉnh sửa câu chữ ngay trên bảng dữ liệu mà không cần viết bất kỳ dòng code giao diện quản trị nào.
