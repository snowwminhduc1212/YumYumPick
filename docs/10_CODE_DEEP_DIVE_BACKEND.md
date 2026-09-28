# 10. Giải Phẫu Chi Tiết 100% Mã Nguồn Backend (Backend Code Deep-Dive)

> **Tài liệu mổ xẻ chi tiết từng tệp, từng lớp, từng hàm, từng dòng lệnh và sự tương tác giữa các module Backend**  
> **Dự án:** YumYumPick — Nền tảng gợi ý thực đơn thông minh theo cơ chế quẹt thẻ (Tinder for Food)  
> **Tác giả:** Senior Software Architect & Giảng viên hướng dẫn  

---

## 1. Cấu Trúc Thư Mục & Vai Trò Các Module Backend

Mã nguồn Backend nằm hoàn toàn trong thư mục `backend/` và được tổ chức theo kiến trúc phân tầng chuẩn mực:

```text
backend/
├── app/
│   ├── api/                 # Tầng Controller / Định tuyến API (Endpoints)
│   │   ├── auth.py          # API Đăng ký, Đăng nhập, Xem thông tin người dùng
│   │   ├── dishes.py        # API Quẹt thẻ ngẫu nhiên, Chi tiết món, Metadata bộ lọc
│   │   └── saved_dishes.py  # API Lưu món, Xóa món, Xem danh sách đã thích
│   ├── data/
│   │   └── dishes_seed.json # File dữ liệu hạt giống 1.100 món ăn chuẩn hóa
│   ├── db/
│   │   └── database.py      # Kết nối CSDL SQLite, Cấu hình WAL Mode & Session
│   ├── models/
│   │   └── models.py        # Định nghĩa 6 bảng quan hệ bằng SQLAlchemy 2.0 ORM
│   ├── repositories/        # Tầng thao tác CSDL trực tiếp (Data Access Layer)
│   │   ├── dish_repo.py     # Truy vấn lọc, sắp xếp ngẫu nhiên, nạp trước Eager Loading
│   │   └── saved_dish_repo.py # Thêm, xóa, đọc bản ghi món đã lưu
│   ├── schemas/             # Pydantic v2 Models (Validation & Serialization DTOs)
│   │   ├── auth.py          # Schema xác thực tài khoản
│   │   ├── dish.py          # Schema thẻ quẹt, nguyên liệu, bước nấu, chi tiết món
│   │   ├── filter.py        # Schema metadata cho bộ lọc đa tiêu chí
│   │   └── saved_dish.py    # Schema payload lưu món và response kết quả
│   ├── services/            # Tầng Logic Nghiệp Vụ (Business Logic Layer)
│   │   ├── dish_service.py  # Xử lý chuỗi exclude_ids, DTO transformation
│   │   └── saved_dish_service.py # Xử lý lưu trùng lặp 409, phân trang món đã lưu
│   └── main.py              # Entry point: Khởi tạo FastAPI, CORS, Caching ảnh tĩnh
├── images/
│   └── dishes/              # Thư mục chứa 1.100 file ảnh JPG chụp thực tế
├── requirements.txt         # Danh sách thư viện Python phụ thuộc
└── yumyumpick.db            # Cơ sở dữ liệu SQLite vật lý (~7.6 MB)
```

---

## 2. Vòng Đời Xử Lý Một Request Backend (Request-Response Lifecycle)

Sơ đồ tuần tự thể hiện sự tương tác giữa các function từ lúc Client gửi HTTP Request đến khi nhận JSON Response:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend (Vite / React)
    participant Main as main.py (FastAPI App)
    participant Router as api/dishes.py (DishesRouter)
    participant Service as services/dish_service.py (DishService)
    participant Repo as repositories/dish_repo.py (DishRepository)
    participant DB as db/database.py (SQLite DB Session)

    Client->>Main: GET /api/v1/dishes/random?limit=10&exclude_ids=dish_001,dish_002
    Note over Main: Kiểm tra CORS Middleware & Routing
    Main->>Router: get_random_dishes(limit, exclude_ids, ...)
    Note over Router: Pydantic v2 xác thực query params<br/>Tiêm phụ thuộc via Depends()
    Router->>Service: get_random_dishes(limit, exclude_ids, ...)
    Note over Service: Parse chuỗi exclude_ids -> List[str]<br/>Loại bỏ khoảng trắng thừa
    Service->>Repo: get_random_dishes(limit, exclude_ids)
    Note over Repo: Xây dựng Dynamic Query select(Dish)<br/>.where(Dish.id.notin_(...))<br/>.order_by(func.random()).limit(10)
    Repo->>DB: Thực thi câu lệnh SQL trên kết nối SQLite WAL
    DB-->>Repo: Trả về 10 thực thể Dish (ORM Objects)
    Repo-->>Service: List[Dish]
    Note over Service: Chuyển đổi DTO sang DishCardResponse<br/>thông qua model_validate()
    Service-->>Router: List[DishCardResponse]
    Router-->>Main: HTTP 200 OK + JSON Payload
    Main-->>Client: Trả về mảng 10 thẻ món ăn cho Frontend quẹt
```

---

## 3. Mổ Xẻ Chi Tiết Từng File & Dòng Code Backend

---

### 3.1. File `backend/app/db/database.py` (Quản Lý Kết Nối & Cấu Hình CSDL)

Tệp này chịu trách nhiệm khởi tạo động cơ SQLAlchemy Engine, thiết lập kết nối tối ưu cho SQLite và cung cấp hàm Generator `get_db` để tiêm Session vào các API endpoints.

```python
# Dòng 1-4: Import các thư viện lõi
import os
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Dòng 6-8: Xác định đường dẫn tuyệt đối tới file SQLite database
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "yumyumpick.db"

# Dòng 10: Lấy chuỗi kết nối từ biến môi trường, fallback về file cục bộ
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# Dòng 12-18: Khởi tạo SQLAlchemy Engine
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False, # Cho phép FastAPI đa luồng truy cập cùng 1 connection SQLite
        "timeout": 30,              # Thời gian chờ tối đa 30s nếu có transaction khác đang ghi
    },
)

# Dòng 20-28: Lắng nghe sự kiện kết nối để kích hoạt các tính năng nâng cao của SQLite
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")       # BẬT ràng buộc khóa ngoại (mặc định SQLite tắt)
    cursor.execute("PRAGMA journal_mode=WAL")      # BẬT chế độ Write-Ahead Logging (đọc/ghi đồng thời)
    cursor.execute("PRAGMA synchronous=NORMAL")   # Cân bằng an toàn đĩa cứng & tốc độ ghi nhanh gấp 3 lần
    cursor.execute("PRAGMA busy_timeout=30000")   # Đặt timeout chờ khóa là 30.000 ms
    cursor.close()

# Dòng 30: Tạo Session Factory quản lý phiên làm việc CSDL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dòng 32-33: Lớp cơ sở cho toàn bộ SQLAlchemy Models (Chuẩn 2.0)
class Base(DeclarativeBase):
    pass

# Dòng 35-41: Hàm Dependency Injection cung cấp DB Session cho FastAPI
def get_db():
    db = SessionLocal() # Mở phiên làm việc mới
    try:
        yield db        # Chuyển quyền điều khiển cho router thực thi
    finally:
        db.close()      # ĐẢM BẢO luôn đóng session, giải phóng connection pool kể cả khi có Exception
```

---

### 3.2. File `backend/app/models/models.py` (Khai Báo Cấu Trúc Bảng Dữ Liệu)

Tệp này định nghĩa 6 bảng dữ liệu có quan hệ chặt chẽ với nhau theo chuẩn **SQLAlchemy 2.0 Typed Mapping**.

#### A. Model `Cuisine` (Bảng Quốc gia Ẩm thực)
```python
class Cuisine(Base):
    __tablename__ = "cuisines"

    id: Mapped[str] = mapped_column(String, primary_key=True)       # Khóa chính: 'Vietnam', 'Korea'...
    name: Mapped[str] = mapped_column(String, nullable=False)       # Tên hiển thị: 'Việt Nam', 'Hàn Quốc'...
    flag_emoji: Mapped[str] = mapped_column(String, nullable=False) # Icon cờ: '🇻🇳', '🇰🇷'...

    # Quan hệ 1-N: Một quốc gia có nhiều món ăn
    dishes: Mapped[List["Dish"]] = relationship(back_populates="cuisine_rel")
```

#### B. Model `Dish` (Bảng Món Ăn Trung Tâm)
```python
class Dish(Base):
    __tablename__ = "dishes"

    id: Mapped[str] = mapped_column(String, primary_key=True)               # Mã món: 'dish_vn_001'
    name: Mapped[str] = mapped_column(String, nullable=False)               # Tên tiếng Việt
    english_name: Mapped[Optional[str]] = mapped_column(String, nullable=True) # Tên tiếng Anh

    # Khóa ngoại trỏ về cuisines.id kèm onupdate CASCADE
    cuisine: Mapped[str] = mapped_column(
        "cuisine_id",
        String,
        ForeignKey("cuisines.id", onupdate="CASCADE"),
        nullable=False,
        index=True, # Đánh chỉ mục B-Tree để lọc quốc gia cực nhanh
    )
    cuisine_id = synonym("cuisine") # Alias 2 chiều: đọc dish.cuisine hoặc dish.cuisine_id đều được

    region: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image: Mapped[str] = mapped_column(String, nullable=False)              # Đường dẫn nội bộ: /images/dishes/...
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # URL gốc từ web thực tế
    cook_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False, index=True) # Đánh chỉ mục lọc thời gian
    prep_time_minutes: Mapped[int] = mapped_column(Integer, default=10)
    difficulty: Mapped[str] = mapped_column(String, default="Dễ")
    spicy_level: Mapped[int] = mapped_column(Integer, default=0, index=True) # Đánh chỉ mục lọc độ cay
    calories_approx: Mapped[int] = mapped_column(Integer, default=400)
    short_description: Mapped[str] = mapped_column(String, nullable=False)   # Giới thiệu hương vị trên mặt thẻ
    tips: Mapped[Optional[str]] = mapped_column(String, nullable=True)       # Bí quyết vàng của đầu bếp
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())

    # Quan hệ quan trọng:
    cuisine_rel: Mapped[Optional["Cuisine"]] = relationship(back_populates="dishes")
    
    # Quan hệ 1-N với Ingredients: Tự động xóa sạch nguyên liệu con nếu món bị xóa
    ingredients: Mapped[List["Ingredient"]] = relationship(
        back_populates="dish",
        cascade="all, delete-orphan",
    )
    
    # Quan hệ 1-N với CookingSteps: Tự động sắp xếp theo thứ tự bước nấu
    cooking_steps: Mapped[List["CookingStep"]] = relationship(
        back_populates="dish",
        cascade="all, delete-orphan",
        order_by="CookingStep.step_number",
    )
    steps = synonym("cooking_steps") # Tạo bí danh 'steps' để khớp với JSON Frontend
```

#### C. Model `Ingredient` (Nguyên Liệu Món Ăn)
```python
class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    dish_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("dishes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String, nullable=False)      # Tên nguyên liệu: 'Pate gan heo'
    amount: Mapped[str] = mapped_column(String, nullable=False)    # Định lượng: '60', '1.5'
    unit: Mapped[str] = mapped_column(String, nullable=False)      # Đơn vị: 'g', 'muỗng canh', 'quả'
    category: Mapped[str] = mapped_column(String, default="nguyên liệu chính") # Phân loại Smart Grocery

    dish: Mapped["Dish"] = relationship(back_populates="ingredients")
```

#### D. Model `CookingStep` (Các Bước Nấu Ăn)
```python
class CookingStep(Base):
    __tablename__ = "cooking_steps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    dish_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("dishes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    step_number: Mapped[int] = mapped_column(Integer, nullable=False) # Bước 1, 2, 3, 4, 5
    title: Mapped[str] = mapped_column(String, nullable=False)       # Tiêu đề kỹ thuật chế biến
    description: Mapped[str] = mapped_column(String, nullable=False) # Hướng dẫn chi tiết lửa, nhiệt độ

    dish: Mapped["Dish"] = relationship(back_populates="cooking_steps")
```

#### E. Model `User` & `UserSavedDish` (Xác Thực & Món Đã Lưu)
```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())

class UserSavedDish(Base):
    __tablename__ = "user_saved_dishes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    dish_id: Mapped[str] = mapped_column(String, ForeignKey("dishes.id", ondelete="CASCADE"), nullable=False)
    saved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())

    dish: Mapped["Dish"] = relationship(back_populates="saved_by_users")
```

---

### 3.3. File `backend/app/repositories/dish_repo.py` (Tầng Thao Tác CSDL Chuyên Biệt)

Tệp này độc quyền quản lý các câu lệnh SQL thông qua đối tượng `Session` của SQLAlchemy.

```python
class DishRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_random_dishes(
        self,
        limit: int = 10,
        cuisine: Optional[str] = None,
        spicy_level: Optional[int] = None,
        max_time: Optional[int] = None,
        exclude_ids: Optional[List[str]] = None,
    ) -> List[Dish]:
        # Khởi tạo câu lệnh select cơ sở
        stmt = select(Dish)

        # Lọc theo quốc gia (so khớp chữ thường, loại bỏ khoảng trắng)
        if cuisine:
            stmt = stmt.where(func.lower(Dish.cuisine) == cuisine.strip().lower())

        # Lọc theo độ cay (0, 1, 2, 3)
        if spicy_level is not None:
            stmt = stmt.where(Dish.spicy_level == spicy_level)

        # Lọc theo thời gian nấu tối đa
        if max_time is not None:
            stmt = stmt.where(Dish.cook_time_minutes <= max_time)

        # LOẠI TRỪ DANH SÁCH MÓN ĐÃ QUẸT TRONG 7 NGÀY
        if exclude_ids:
            stmt = stmt.where(Dish.id.notin_(exclude_ids))

        # Sắp xếp ngẫu nhiên bằng engine SQLite và giới hạn số lượng nạp
        stmt = stmt.order_by(func.random()).limit(limit)
        return list(self.db.scalars(stmt).all())

    def get_dish_by_id(self, dish_id: str) -> Optional[Dish]:
        # Kỹ thuật Eager Loading triệt tiêu N+1 Query Problem:
        stmt = (
            select(Dish)
            .options(
                selectinload(Dish.ingredients),   # Nạp trước toàn bộ nguyên liệu
                selectinload(Dish.cooking_steps), # Nạp trước toàn bộ bước nấu
            )
            .where(Dish.id == dish_id)
        )
        return self.db.scalars(stmt).first()
```

---

### 3.4. File `backend/app/services/dish_service.py` (Tầng Nghiệp Vụ & Xử Lý Dữ Liệu)

Tệp này xử lý logic nghiệp vụ và định dạng dữ liệu (DTO - Data Transfer Object) trước khi gửi về client:

```python
class DishService:
    def __init__(self, repo: DishRepository):
        self.repo = repo

    def get_random_dishes(
        self,
        limit: int = 10,
        cuisine: Optional[str] = None,
        spicy_level: Optional[int] = None,
        max_time: Optional[int] = None,
        exclude_ids: Optional[str] = None, # Nhận chuỗi phân tách bởi dấu phẩy từ query param
    ) -> List[DishCardResponse]:
        parsed_excludes: Optional[List[str]] = None
        
        # Xử lý chuỗi exclude_ids an toàn: tách mảng, loại bỏ khoảng trắng và phần tử rỗng
        if exclude_ids:
            parsed_excludes = [x.strip() for x in exclude_ids.split(",") if x.strip()]

        # Gọi repository lấy dữ liệu từ CSDL
        dishes = self.repo.get_random_dishes(
            limit=limit,
            cuisine=cuisine,
            spicy_level=spicy_level,
            max_time=max_time,
            exclude_ids=parsed_excludes,
        )
        
        # Validate và serialize sang Schema DishCardResponse
        return [DishCardResponse.model_validate(d) for d in dishes]

    def get_dish_detail(self, dish_id: str) -> DishDetailResponse:
        dish = self.repo.get_dish_by_id(dish_id)
        # Bắt lỗi không tìm thấy món ăn và trả về đúng chuẩn HTTP 404
        if not dish:
            raise HTTPException(status_code=404, detail="Không tìm thấy món ăn")
        return DishDetailResponse.model_validate(dish)
```

---

### 3.5. File `backend/app/main.py` (Cấu Hình Server & Caching Tệp Tĩnh)

```python
# Cấu hình đường dẫn thư mục ảnh tĩnh cục bộ
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "images")

# Kế thừa StaticFiles để chèn Header HTTP Caching 24 giờ (86.400 giây)
class CachedStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "public, max-age=86400"
        return response

# Mount thư mục ảnh vào URL /images
if os.path.exists(IMAGES_DIR):
    app.mount("/images", CachedStaticFiles(directory=IMAGES_DIR), name="images")
```
- **Tác dụng:** Trình duyệt khi tải ảnh món ăn lần đầu sẽ lưu ảnh vào Disk Cache. Trong các lần xem tiếp theo, trình duyệt gửi header `If-None-Match`, Server kiểm tra và trả về mã `304 Not Modified` ngay lập tức mà không cần truyền lại nội dung file ảnh, tiết kiệm 100% băng thông tải ảnh.
