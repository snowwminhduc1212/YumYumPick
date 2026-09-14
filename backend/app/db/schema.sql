-- ==========================================================
-- YumYumPick Database Schema (SQLite 3)
-- File: backend/yumyumpick.db
-- ==========================================================

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

-- 6. Bảng món ăn đã lưu của người dùng (User Saved Dishes)
CREATE TABLE IF NOT EXISTS user_saved_dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    dish_id TEXT NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, dish_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- 7. Chỉ mục tối ưu hóa tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_dishes_cuisine ON dishes(cuisine_id);
CREATE INDEX IF NOT EXISTS idx_dishes_cook_time ON dishes(cook_time_minutes);
CREATE INDEX IF NOT EXISTS idx_saved_user ON user_saved_dishes(user_id);
