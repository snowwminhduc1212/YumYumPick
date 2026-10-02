# 10. Giải Phẫu Chi Tiết Từng Dòng Code & Từng Function Backend (Backend Line-by-Line Code & Function Breakdown)

> **Tài liệu đặc tả chi tiết 100% từng file, từng function, từng tham số, giá trị trả về và từng dòng lệnh của toàn bộ Backend**  
> **Dự án:** YumYumPick ("Tinder for Food")  
> **Ngôn ngữ & Công nghệ:** Python 3.11+, FastAPI 0.110+, SQLAlchemy 2.0 Typed Mapping, Pydantic v2, SQLite 3 (WAL Mode)  

---

## 📑 Mục Lục Các File Backend

1. [`backend/app/db/database.py`](#1-backendappdbdatabasepy-kết-nối-csdl--cấu-hình-wal)
2. [`backend/app/models/models.py`](#2-backendappmodelsmodelspy-định-nghĩa-6-bảng-csdl-orm)
3. [`backend/app/schemas/`](#3-backendappschemas-pydantic-validation--dtos)
   - `auth.py`
   - `dish.py`
   - `filter.py`
   - `saved_dish.py`
4. [`backend/app/repositories/`](#4-backendapprepositories-tầng-truy-vấn-trực-tiếp-csdl)
   - `dish_repo.py`
   - `saved_dish_repo.py`
5. [`backend/app/services/`](#5-backendappservices-tầng-logic-nghiệp-vụ)
   - `dish_service.py`
   - `saved_dish_service.py`
6. [`backend/app/api/`](#6-backendappapi-tầng-định-tuyến-endpoints)
   - `auth.py`
   - `dishes.py`
   - `saved_dishes.py`
7. [`backend/app/main.py`](#7-backendappmainpy-khởi-chạy-cors--caching-ảnh)

---

## 1. `backend/app/db/database.py` (Kết Nối CSDL & Cấu Hình WAL)

### Toàn bộ code & Giải thích từng dòng:

```python
1: import os
2: from pathlib import Path
3: from sqlalchemy import create_engine, event
4: from sqlalchemy.orm import DeclarativeBase, sessionmaker
```
- **Dòng 1-4:** Import các thư viện lõi: `os` (đọc biến môi trường), `pathlib.Path` (xử lý đường dẫn file đa nền tảng), `create_engine` (tạo connection pool), `event` (lắng nghe sự kiện kết nối SQLite), `DeclarativeBase` và `sessionmaker` từ SQLAlchemy 2.0.

```python
7: BASE_DIR = Path(__file__).resolve().parent.parent.parent
8: DB_PATH = BASE_DIR / "yumyumpick.db"
9: 
10: DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
```
- **Dòng 7:** `Path(__file__).resolve().parent.parent.parent`: Tìm đường dẫn tuyệt đối của thư mục gốc `backend/`.
- **Dòng 8:** `DB_PATH = BASE_DIR / "yumyumpick.db"`: Xác định đường dẫn file SQLite vật lý `yumyumpick.db`.
- **Dòng 10:** `DATABASE_URL`: Đọc chuỗi kết nối từ biến môi trường `DATABASE_URL` (nếu có), nếu không có thì mặc định trỏ về `sqlite:///{DB_PATH}`.

```python
12: engine = create_engine(
13:     DATABASE_URL,
14:     connect_args={
15:         "check_same_thread": False,
16:         "timeout" : 30,
17:     },
18: )
```
- **Dòng 12-18:** Khởi tạo SQLAlchemy Engine:
  - `"check_same_thread": False`: Bắt buộc với SQLite trong FastAPI. Cho phép nhiều luồng bất đồng bộ (worker threads) dùng chung connection mà không bị Python chặn lỗi `SQLite objects created in a thread can only be used in that same thread`.
  - `"timeout": 30`: Nếu có một transaction đang ghi đĩa, các luồng khác sẽ kiên nhẫn chờ tối đa 30 giây thay vì lập tức báo lỗi `database is locked`.

```python
21: @event.listens_for(engine, "connect")
22: def set_sqlite_pragma(dbapi_connection, connection_record):
23:     cursor = dbapi_connection.cursor()
24:     cursor.execute("PRAGMA foreign_keys=ON")
25:     cursor.execute("PRAGMA journal_mode=WAL")
26:     cursor.execute("PRAGMA synchronous=NORMAL")
27:     cursor.execute("PRAGMA busy_timeout=30000") #30,000ms = 30s
28:     cursor.close()
```
- **Dòng 21-28:** Hàm `set_sqlite_pragma` lắng nghe sự kiện mỗi khi một kết nối vật lý mới được mở tới SQLite:
  - `PRAGMA foreign_keys=ON`: Kích hoạt ràng buộc khóa ngoại (mặc định SQLite tắt, nếu tắt thì `ON DELETE CASCADE` sẽ vô hiệu).
  - `PRAGMA journal_mode=WAL`: Kích hoạt chế độ **Write-Ahead Logging**. Các luồng đọc (Readers) không bao giờ bị chặn bởi luồng ghi (Writer), và ngược lại. Tăng thông lượng đồng thời lên gấp nhiều lần.
  - `PRAGMA synchronous=NORMAL`: Chỉ đồng bộ dữ liệu đĩa ở các điểm kiểm tra then chốt (WAL checkpoints), tăng tốc độ ghi nhanh gấp 3 lần so với chế độ `FULL`.
  - `PRAGMA busy_timeout=30000`: Thiết lập timeout ở tầng C driver là 30.000 ms.

```python
30: SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
31: 
32: class Base(DeclarativeBase):
33:     pass
```
- **Dòng 30:** Tạo nhà máy tạo phiên `SessionLocal` gắn liền với `engine`. Tắt `autocommit` và `autoflush` để lập trình viên chủ động kiểm soát transaction.
- **Dòng 32-33:** Lớp cơ sở `Base` kế thừa `DeclarativeBase` theo chuẩn mới nhất của SQLAlchemy 2.0.

```python
35: def get_db():
36:     """FastAPI dependency for database sessions."""
37:     db = SessionLocal()
38:     try:
39:         yield db
40:     finally:
41:         db.close()
```
- **Dòng 35-41:** Hàm generator `get_db()`:
  - Mở một session mới `db = SessionLocal()`.
  - `yield db`: Cung cấp session cho endpoint thông qua cơ chế Dependency Injection `Depends(get_db)`.
  - Khối `finally: db.close()`: Đảm bảo session **luôn luôn được đóng** và trả connection về pool, kể cả khi endpoint ném ra Exception.

---

## 2. `backend/app/models/models.py` (Định Nghĩa 6 Bảng CSDL ORM)

Sử dụng cú pháp **SQLAlchemy 2.0 Typed Mapping** (`Mapped[...]` và `mapped_column`):

### 2.1. Model `User` (Bảng `users` - Dòng 16-33)
```python
16: class User(Base):
17:     __tablename__ = "users"
18: 
19:     id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
20:     username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
21:     password: Mapped[str] = mapped_column(String, nullable=False)
22:     full_name: Mapped[str] = mapped_column(String, nullable=False)
23:     created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())
24: 
25:     # Relationships
26:     saved_dishes: Mapped[List["UserSavedDish"]] = relationship(
27:         back_populates="user",
28:         cascade="all, delete-orphan",
29:     )
30:     skipped_dishes: Mapped[List["UserSkippedDish"]] = relationship(
31:         back_populates="user",
32:         cascade="all, delete-orphan",
33:     )
```
- `id`: Khóa chính số nguyên tự tăng.
- `username`: Tên đăng nhập duy nhất (`unique=True`), có đánh chỉ mục `index=True` để tìm kiếm `WHERE username = ?` trong $O(\log N)$.
- `password`: Chuỗi mật khẩu.
- `full_name`: Họ và tên hiển thị của người dùng.
- `created_at`: Thời điểm tạo tài khoản, mặc định lấy thời gian máy chủ `func.now()`.
- `saved_dishes` & `skipped_dishes`: Quan hệ 1-N trỏ tới `UserSavedDish` và `UserSkippedDish`. `cascade="all, delete-orphan"` đảm bảo khi xóa tài khoản User, toàn bộ danh sách món đã lưu và đã skip sẽ tự động bị xóa sạch khỏi CSDL.

### 2.2. Model `Cuisine` (Bảng `cuisines` - Dòng 36-45)
```python
36: class Cuisine(Base):
37:     __tablename__ = "cuisines"
38: 
39:     id: Mapped[str] = mapped_column(String, primary_key=True)
40:     name: Mapped[str] = mapped_column(String, nullable=False)
41:     flag_emoji: Mapped[str] = mapped_column(String, nullable=False)
42: 
43:     # Relationships
44:     dishes: Mapped[List["Dish"]] = relationship(back_populates="cuisine_rel")
```
- `id`: Mã quốc gia chuỗi (ví dụ: `"Vietnam"`, `"Korea"`, `"Japan"`, `"Italy"`).
- `name`: Tên tiếng Việt hiển thị (ví dụ: `"Việt Nam"`, `"Hàn Quốc"`).
- `flag_emoji`: Emoji cờ quốc gia (ví dụ: `"🇻🇳"`, `"🇰🇷"`).
- `dishes`: Quan hệ 1-N tới bảng `Dish`.

### 2.3. Model `Dish` (Bảng `dishes` - Dòng 47-93)
```python
47: class Dish(Base):
48:     __tablename__ = "dishes"
49: 
50:     id: Mapped[str] = mapped_column(String, primary_key=True)
51:     name: Mapped[str] = mapped_column(String, nullable=False)
52:     english_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
53:     cuisine: Mapped[str] = mapped_column(
54:         "cuisine_id",
55:         String,
56:         ForeignKey("cuisines.id", onupdate="CASCADE"),
57:         nullable=False,
58:         index=True,
59:     )
60:     cuisine_id = synonym("cuisine")
61: 
62:     region: Mapped[Optional[str]] = mapped_column(String, nullable=True)
63:     image: Mapped[str] = mapped_column(String, nullable=False)
64:     image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
65:     cook_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
66:     prep_time_minutes: Mapped[int] = mapped_column(Integer, default=10)
67:     difficulty: Mapped[str] = mapped_column(String, default="Dễ")
68:     spicy_level: Mapped[int] = mapped_column(Integer, default=0)
69:     calories_approx: Mapped[int] = mapped_column(Integer, default=400)
70:     short_description: Mapped[str] = mapped_column(String, nullable=False)
71:     tips: Mapped[Optional[str]] = mapped_column(String, nullable=True)
72:     created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())
73: 
74:     # Relationships
75:     cuisine_rel: Mapped[Optional["Cuisine"]] = relationship(back_populates="dishes")
76:     ingredients: Mapped[List["Ingredient"]] = relationship(
77:         back_populates="dish", cascade="all, delete-orphan",
78:     )
79:     cooking_steps: Mapped[List["CookingStep"]] = relationship(
80:         back_populates="dish", cascade="all, delete-orphan", order_by="CookingStep.step_number",
81:     )
82:     steps = synonym("cooking_steps")
83:     saved_by_users: Mapped[List["UserSavedDish"]] = relationship(
84:         back_populates="dish", cascade="all, delete-orphan",
85:     )
```
- `id`: Mã món (ví dụ: `"dish_vn_001"`).
- `name` & `english_name`: Tên món tiếng Việt và tiếng Anh.
- `cuisine` / `cuisine_id`: Khóa ngoại liên kết tới `cuisines.id`. Thiết lập `synonym("cuisine")` giúp lập trình viên truy cập `dish.cuisine` hay `dish.cuisine_id` đều đồng nhất.
- `image`: Đường dẫn tương đối `/images/dishes/dish_vn_001.jpg`.
- `cook_time_minutes`: Thời gian nấu, đánh chỉ mục `index=True` để lọc nhanh `WHERE cook_time_minutes <= ?`.
- `difficulty`: Độ khó ("Dễ", "Trung bình", "Kỳ công").
- `spicy_level`: Cấp độ cay (0, 1, 2, 3).
- `short_description`: Đoạn mô tả hương vị ngắn hiển thị trên thẻ quẹt.
- `tips`: Bí quyết riêng của đầu bếp.
- `steps = synonym("cooking_steps")`: Đồng nghĩa tên thuộc tính để khớp với cấu trúc JSON DTO phía frontend.

### 2.4. Model `Ingredient` (Bảng `ingredients` - Dòng 95-112)
- `id`: Khóa chính tự tăng.
- `dish_id`: Khóa ngoại trỏ về `dishes.id`, đánh chỉ mục `index=True`, ràng buộc `ON DELETE CASCADE`.
- `name`, `amount`, `unit`, `category`: Tên nguyên liệu (thịt bò), định lượng (300), đơn vị (g), phân loại (nguyên liệu chính).

### 2.5. Model `CookingStep` (Bảng `cooking_steps` - Dòng 114-130)
- `id`: Khóa chính tự tăng.
- `dish_id`: Khóa ngoại trỏ về `dishes.id`.
- `step_number`: Thứ tự bước (1, 2, 3, 4, 5).
- `title` & `description`: Tiêu đề bước (Sơ chế) và mô tả kỹ thuật chi tiết.

### 2.6. Model `UserSavedDish` (Bảng `user_saved_dishes` - Dòng 132-157)
- `id`: Khóa chính tự tăng.
- `user_id` & `dish_id`: Khóa ngoại trỏ về User và Dish.
- `saved_at`: Mốc thời gian bấm Like (server default `func.now()`).
- `UniqueConstraint("user_id", "dish_id", name="uq_user_saved_dish")`: Đảm bảo một người dùng không thể có 2 bản ghi thích cùng 1 món ăn trong CSDL.

### 2.7. Model `UserSkippedDish` (Bảng `user_skipped_dishes` - Dòng 159-184)
- `id`: Khóa chính tự tăng.
- `user_id` & `dish_id`: Khóa ngoại.
- `skipped_at`: Mốc thời gian bấm Skip.
- `UniqueConstraint("user_id", "dish_id", name="uq_user_skipped_dish")`: Đảm bảo 1 món bị skip bởi 1 user chỉ tồn tại 1 dòng duy nhất, cập nhật lại thời gian khi skip lại.

---

## 3. `backend/app/schemas/` (Pydantic Validation & DTOs)

### 3.1. `app/schemas/auth.py`:
- `UserCreate`: Kiểm thực dữ liệu đăng ký:
  - `validate_username`: Cắt khoảng trắng `strip()`, kiểm tra độ dài 3-20 ký tự, chỉ chứa chữ số và gạch dưới qua `v.replace("_", "").isalnum()`, tự động chuyển về chữ thường `.lower()`.
  - `validate_password`: Kiểm tra độ dài $\ge 6$ ký tự.
  - `valitdate_full_name`: Kiểm tra độ dài $\ge 2$ ký tự.
- `UserLogin`: Nhận `username` và `password`.
- `UserData`: DTO chứa `{id, username, full_name}` (chế độ `from_attributes = True`).
- `AuthResponse`: Response chuẩn `{success: bool, message: str, user: UserData}`.

### 3.2. `app/schemas/dish.py`:
- `IngredientResponse`: DTO nguyên liệu `{name, amount, unit, category}`.
- `CookingStepResponse`: DTO bước nấu `{step_number, title, description}`.
- `DishCardResponse`: DTO thẻ quẹt thu gọn (không chứa steps và ingredients để tiết kiệm băng thông):
  - Field validator `extract_cuisine_name`: Kiểm tra nếu `v` là đối tượng Cuisine thì lấy `v.name`, đảm bảo tương thích ngược.
- `DishDetailResponse`: DTO chi tiết đầy đủ của món ăn kèm danh sách `ingredients: List[IngredientResponse]` và `steps: List[CookingStepResponse]`.
- `DishSkipCreate`: Payload gửi lên khi skip `{user_id: int, dish_id: str}`.
- `DishSkipResponse`: Response xác nhận `{success: bool, message: str}`.

### 3.3. `app/schemas/filter.py`:
- `CuisineFilterItem`: `{id: str, name: str, flag: str}` (ánh xạ `validation_alias="flag_emoji"`).
- `FilterOptionItem`: `{value: Optional[Union[int, str]], label: str}`.
- `FilterMetadataResponse`: Trả về toàn bộ danh mục quốc gia, mức độ khó, độ cay, và khoảng thời gian để render giao diện Modal lọc.

### 3.4. `app/schemas/saved_dish.py`:
- `SavedDishCreate`: Payload lưu món `{user_id: int, dish_id: str}`.
- `SavedDishItemResponse`: DTO hiển thị thẻ trong danh sách yêu thích.
- `MessageResponse`: `{success: bool, message: str, saved_id: Optional[int]}`.

---

## 4. `backend/app/repositories/` (Tầng Truy Vấn Trực Tiếp CSDL)

### 4.1. File `app/repositories/dish_repo.py`:

#### Function `__init__(self, db: Session)`:
- Nhận và lưu trữ phiên làm việc `self.db = db`.

#### Function `get_random_dishes(...)`:
```python
def get_random_dishes(
    self,
    limit: int = 10,
    cuisine: Optional[str] = None,
    difficulty: Optional[str] = None,
    spicy_level: Optional[int] = None,
    max_time: Optional[int] = None,
    exclude_ids: Optional[List[str]] = None,
    user_id: Optional[int] = None,
) -> List[Dish]:
```
- **Dòng 23:** Khởi tạo câu truy vấn cơ sở `stmt = select(Dish)`.
- **Dòng 25:** Khởi tạo tập hợp loại trừ `final_exclude_ids: Set[str] = set(exclude_ids or [])`.
- **Dòng 27-44:** **Logic Khử Trùng Lặp 7 Ngày:**
  - Nếu có `user_id`:
    - Tính thời điểm 7 ngày trước: `seven_days_ago = datetime.utcnow() - timedelta(days=7)`.
    - Truy vấn món đã thích trong 7 ngày: `select(UserSavedDish.dish_id).where(UserSavedDish.user_id == user_id, UserSavedDish.saved_at >= seven_days_ago)`.
    - Truy vấn món đã skip trong 7 ngày: `select(UserSkippedDish.dish_id).where(UserSkippedDish.user_id == user_id, UserSkippedDish.skipped_at >= seven_days_ago)`.
    - Cập nhật toàn bộ vào `final_exclude_ids`.
- **Dòng 46-57:** Ghép các điều kiện lọc động:
  - `cuisine`: `.where(func.lower(Dish.cuisine) == cuisine.strip().lower())`.
  - `difficulty`: `.where(func.lower(Dish.difficulty) == difficulty.strip().lower())`.
  - `spicy_level`: `.where(Dish.spicy_level == spicy_level)`.
  - `max_time`: `.where(Dish.cook_time_minutes <= max_time)`.
- **Dòng 58-59:** Loại trừ các ID đã xem: `.where(Dish.id.notin_(list(final_exclude_ids)))`.
- **Dòng 61-62:** Trộn ngẫu nhiên và lấy số lượng: `stmt.order_by(func.random()).limit(limit)`, thực thi và trả về `list(self.db.scalars(stmt).all())`.

#### Function `skip_dish(self, user_id: int, dish_id: str) -> None`:
- Tìm kiếm bản ghi skip hiện có trong `UserSkippedDish`.
- Nếu đã tồn tại: Cập nhật lại thời điểm `existing.skipped_at = datetime.utcnow()`.
- Nếu chưa có: Tạo mới `UserSkippedDish(user_id=user_id, dish_id=dish_id, skipped_at=datetime.utcnow())` và thêm vào `self.db.add(...)`.
- Gọi `self.db.commit()`.

#### Function `clear_user_skips(self, user_id: int) -> int`:
- Thực thi lệnh xóa `delete(UserSkippedDish).where(UserSkippedDish.user_id == user_id)`.
- Commit và trả về số dòng đã xóa `result.rowcount`.

#### Function `get_dish_by_id(self, dish_id: str) -> Optional[Dish]`:
- Sử dụng kỹ thuật Eager Loading:
  ```python
  stmt = (
      select(Dish)
      .options(
          selectinload(Dish.ingredients),
          selectinload(Dish.cooking_steps),
      )
      .where(Dish.id == dish_id)
  )
  ```
- Nạp đầy đủ món ăn, nguyên liệu và các bước nấu trong 1 câu SQL duy nhất.

#### Function `get_all_cuisines(self) -> List[Cuisine]`:
- Thực thi `select(Cuisine)` lấy danh mục 15 quốc gia.

---

### 4.2. File `app/repositories/saved_dish_repo.py`:

#### Function `create_saved_dish(self, user_id: int, dish_id: str) -> UserSavedDish`:
- Kiểm tra xem bản ghi đã tồn tại trong `UserSavedDish` hay chưa.
- Nếu đã có: Cập nhật `existing.saved_at = datetime.utcnow()`, gọi `self.db.flush()`.
- Nếu chưa: Tạo `UserSavedDish(...)`, thêm vào db và flush.

#### Function `get_saved_dishes_by_user(self, user_id: int) -> List[UserSavedDish]`:
- Thực thi truy vấn kèm `selectinload(UserSavedDish.dish)`, sắp xếp giảm dần theo thời gian thích `UserSavedDish.saved_at.desc()`.

#### Function `delete_saved_dish(self, user_id: int, dish_id: str) -> bool`:
- Tìm bản ghi theo `user_id` và `dish_id`. Nếu không tìm thấy trả về `False`.
- Gọi `self.db.delete(saved)`, `self.db.flush()` và trả về `True`.

---

## 5. `backend/app/services/` (Tầng Logic Nghiệp Vụ)

### 5.1. File `app/services/dish_service.py`:
- `get_random_dishes(...)`:
  - Phân tích chuỗi `exclude_ids` dạng `"dish_01,dish_02"` thành mảng `List[str]`, cắt bỏ khoảng trắng thừa.
  - Gọi Repository lấy danh sách thực thể `Dish`.
  - Sử dụng list comprehension và `DishCardResponse.model_validate(d)` để chuyển đổi sang DTO an toàn.
- `skip_dish(user_id, dish_id)`: Gọi repo ghi nhận skip và trả về `DishSkipResponse(success=True, message="Đã ghi nhận bỏ qua món ăn")`.
- `clear_user_skips(user_id)`: Gọi repo xóa lịch sử skip và trả về thông điệp số lượng món đã đặt lại.
- `get_dish_detail(dish_id)`: Lấy chi tiết món, nếu không thấy thì ném `HTTPException(status_code=404, detail="Không tìm thấy món ăn")`.
- `get_filter_metadata()`: Lấy danh sách quốc gia từ DB và ghép với các danh mục tùy chọn lọc cố định.

### 5.2. File `app/services/saved_dish_service.py`:
- `save_dish(payload)`: Bọc trong khối `try...except IntegrityError`. Nếu xảy ra trùng lặp khóa thì `self.db.rollback()` và ném `HTTPException(status_code=409, detail="Món ăn đã được lưu trước đó")`. Nếu thành công thì commit và trả về `MessageResponse`.
- `get_user_saved_dishes(user_id)`: Duyệt qua các bản ghi `UserSavedDish`, trích xuất thông tin món ăn liên kết và ánh xạ thành danh sách `SavedDishItemResponse`.
- `unsave_dish(user_id, dish_id)`: Gọi repo xóa món. Nếu kết quả `False`, ném lỗi 404 `HTTPException`.

---

## 6. `backend/app/api/` (Tầng Định Tuyến Endpoints)

### 6.1. File `app/api/auth.py`:
- `POST /api/v1/auth/signup`:
  - Kiểm tra username đã tồn tại chưa: `db.query(User).filter(User.username == user_data.username).first()`.
  - Nếu đã tồn tại: Ném lỗi `HTTPException(400, "Username đã tồn tại")`.
  - Tạo thực thể `User`, lưu vào DB, commit, refresh và trả về `AuthResponse` với HTTP 201 Created.
- `POST /api/v1/auth/login`:
  - Tìm user theo username. So khớp chuỗi mật khẩu thô `user.password != user_data.password`.
  - Nếu sai tài khoản hoặc mật khẩu: Ném lỗi `HTTPException(401, "Sai username hoặc mật khẩu")`.
  - Trả về `AuthResponse` thành công.
- `GET /api/v1/auth/me/{user_id}`:
  - Lấy thông tin user theo ID, trả về 404 nếu không tìm thấy.

### 6.2. File `app/api/dishes.py`:
- Khởi tạo Dependencies: `get_dish_repo` và `get_dish_service`.
- `GET /random`: Nhận query params `limit` (1-50), `cuisine`, `difficulty`, `spicy_level` (0-3), `max_time`, `exclude_ids`, `user_id`. Gọi `service.get_random_dishes`.
- `POST /skip`: Nhận body `DishSkipCreate`, gọi `service.skip_dish`.
- `DELETE /skip/{user_id}`: Gọi `service.clear_user_skips`.
- `GET /filters/metadata`: Gọi `service.get_filter_metadata`.
- `GET /{dish_id}`: Nhận dynamic path parameter `dish_id`, gọi `service.get_dish_detail`.

### 6.3. File `app/api/saved_dishes.py`:
- `POST /`: Nhận `SavedDishCreate`, gọi `service.save_dish`.
- `GET /{user_id}`: Gọi `service.get_user_saved_dishes`.
- `DELETE /{user_id}/{dish_id}`: Gọi `service.unsave_dish`.

---

## 7. `backend/app/main.py` (Khởi Chạy, CORS & Caching Ảnh)

```python
1: import os
2: from fastapi import FastAPI
3: from fastapi.middleware.cors import CORSMiddleware
4: from fastapi.staticfiles import StaticFiles
5: from app.api.auth import router as auth_router
8: app = FastAPI(
9:     title="YumYumPick API",
10:     description="Tinder for Food - Backend",
11:     version="1.0.0"
12: )
```
- Khởi tạo ứng dụng FastAPI với tiêu đề, mô tả và phiên bản OpenAPI Swagger.

```python
15: app.add_middleware(
16:     CORSMiddleware,
17:     allow_origins=["*"],
18:     allow_credentials=False,
19:     allow_methods=["*"],
20:     allow_headers=["*"]
21: )
```
- Cấu hình CORS mở cho phép tất cả các nguồn truy cập phục vụ chạy thử nghiệm cục bộ.

```python
35: app.include_router(dishes_router, prefix="/api/v1/dishes", tags=["Dishes"])
36: app.include_router(saved_dishes_router, prefix="/api/v1/saved-dishes", tags=["Saved Dishes"])
37: 
38: app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
39: @app.get("/")
40: def health_check():
41:     return{"status":"ok","message":"Backend is running"}
```
- Đăng ký 3 router chính với tiền tố chuẩn `/api/v1/...` và endpoint kiểm tra sức khỏe hệ thống `GET /`.

```python
43: class CachedStaticFiles(StaticFiles):
44:     def is_not_modified(self, response_headers, request_headers) -> bool:
45:         return super().is_not_modified(response_headers, request_headers)
46: 
47:     async def get_response(self, path: str, scope):
48:         response = await super().get_response(path, scope)
49: 
50:         response.headers["Cache-Control"] = "public, max-age=86400"
51:         return response
52: 
53: if os.path.exists(IMAGES_DIR):
54:     app.mount("/images", CachedStaticFiles(directory=IMAGES_DIR), name="images")
```
- Lớp `CachedStaticFiles` kế thừa `StaticFiles` của Starlette/FastAPI:
  - Hàm `get_response`: Bổ sung header HTTP `Cache-Control: public, max-age=86400` (lưu cache trình duyệt 24 giờ).
  - Trình duyệt tự động kiểm tra `ETag` / `If-None-Match`. Nếu ảnh không đổi, máy chủ trả về `304 Not Modified`, tiết kiệm 100% băng thông tải file ảnh.
- `app.mount("/images", ...)`: Gắn thư mục ảnh vật lý vào URL `/images`.
