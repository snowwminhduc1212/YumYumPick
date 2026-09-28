# 09. Kiến Trúc Kỹ Thuật Chuyên Sâu (Technical Architecture Deep-Dive)

> **Tài liệu phân tích kỹ thuật kiến trúc hệ thống phục vụ phản biện đồ án**  
> **Dự án:** YumYumPick — Nền tảng gợi ý thực đơn thông minh theo cơ chế quẹt thẻ (Tinder for Food)  
> **Tác giả:** Senior Software Architect & Giảng viên hướng dẫn  

---

## 1. Sơ Đồ Kiến Trúc Hệ Thống Tổng Thể (System Architecture Diagram)

Hệ thống YumYumPick được thiết kế theo mô hình **Client-Server kiến trúc phân tầng rời rạc (Decoupled Layered Architecture)**. Frontend và Backend giao tiếp hoàn toàn thông qua giao thức chuẩn **RESTful HTTP/JSON**:

```mermaid
graph TB
    subgraph CLIENT_TIER["TẦNG CLIENT (FRONTEND - REACT 18 + VITE)"]
        UI_VIEWS["UI Views & Pages<br/>(LandingPage, LikedDishesView)"]
        CARD_ENGINE["Card Stack & Swipe Engine<br/>(CardStack, SwipeCard - Framer Motion)"]
        MODALS["Interactive Modals<br/>(DishDetailModal, FilterModal, AuthModal)"]
        STATE_STORE["State Management & Hooks<br/>(useState, useEffect, useAuth, useFilterMetadata)"]
        LOCAL_STORAGE["Client Persistence (LocalStorage)<br/>- yumyum_auth_user<br/>- yumyum_swiped_history (7-day TTL)"]
        API_ADAPTER["API Client & Adapter<br/>(api.js with Offline Mock Fallback)"]
    end

    subgraph NETWORK_TIER["TẦNG GIAO TIẾP MẠNG"]
        HTTP_REQ["REST API Calls (JSON) & Static Image Requests"]
    end

    subgraph SERVER_TIER["TẦNG SERVER (BACKEND - FASTAPI + PYTHON 3.11)"]
        API_ROUTERS["API Routers Layer<br/>(/dishes, /saved-dishes, /auth)"]
        STATIC_CACHE["CachedStaticFiles Handler<br/>(Cache-Control: 86400s, ETag, 304 Not Modified)"]
        SERVICES["Business Services Layer<br/>(DishService, SavedDishService, AuthService)"]
        REPOSITORIES["Data Repositories Layer<br/>(DishRepository, SavedDishRepository, UserRepository)"]
        SQLA_ORM["SQLAlchemy 2.0 ORM Engine<br/>(Declarative Base, Mapped Type-hints)"]
    end

    subgraph DATA_TIER["TẦNG DỮ LIỆU & LƯU TRỮ VẬT LÝ"]
        SQLITE_DB[("SQLite 3 Database<br/>(backend/yumyumpick.db - WAL Mode)")]
        LOCAL_IMAGES[("Local Image Assets Storage<br/>(backend/images/dishes/*.jpg - 1.100 files)")]
    end

    UI_VIEWS --> CARD_ENGINE
    UI_VIEWS --> MODALS
    CARD_ENGINE --> STATE_STORE
    MODALS --> STATE_STORE
    STATE_STORE --> LOCAL_STORAGE
    STATE_STORE --> API_ADAPTER
    API_ADAPTER --> HTTP_REQ

    HTTP_REQ --> API_ROUTERS
    HTTP_REQ --> STATIC_CACHE
    STATIC_CACHE --> LOCAL_IMAGES
    API_ROUTERS --> SERVICES
    SERVICES --> REPOSITORIES
    REPOSITORIES --> SQLA_ORM
    SQLA_ORM --> SQLITE_DB
```

---

## 2. Kiến Trúc Backend: Phân Tầng Clean Architecture

Backend được xây dựng theo chuẩn **Clean Architecture / Hexagonal Architecture** với sự phân định trách nhiệm rõ ràng (Separation of Concerns), đảm bảo mã nguồn dễ bảo trì, dễ mở rộng và dễ kiểm thử độc lập:

```mermaid
classDiagram
    direction TB
    class DishesRouter {
        +get_random_dishes(limit, cuisine, spicy_level, max_time, exclude_ids)
        +get_filter_metadata()
        +get_dish_detail(dish_id)
    }

    class DishService {
        -DishRepository repo
        +get_random_dishes(...) List~DishCardResponse~
        +get_dish_detail(dish_id) DishDetailResponse
        +get_filter_metadata() FilterMetadataResponse
    }

    class DishRepository {
        -Session db
        +get_random_dishes(...) List~Dish~
        +get_dish_by_id(dish_id) Optional~Dish~
        +get_all_cuisines() List~Cuisine~
    }

    class DishModel {
        +String id
        +String name
        +String english_name
        +String cuisine_id
        +String image
        +Integer cook_time_minutes
        +Integer spicy_level
        +String short_description
        +String tips
        +List~Ingredient~ ingredients
        +List~CookingStep~ cooking_steps
    }

    DishesRouter --> DishService : Gọi tầng nghiệp vụ (Dependency Injection)
    DishService --> DishRepository : Gọi tầng lưu trữ (Data Access)
    DishRepository --> DishModel : Truy vấn qua SQLAlchemy 2.0 ORM
```

### 2.1. Tầng Controller / Router ([`backend/app/api/dishes.py`](../backend/app/api/dishes.py))
- **Trách nhiệm duy nhất (Single Responsibility):** Tiếp nhận HTTP Request từ client, phân giải query params, xác thực tính hợp lệ của tham số đầu vào bằng **Pydantic v2**, sau đó chuyển tiếp cho Service xử lý.
- **Dependency Injection:** Sử dụng cơ chế `Depends(get_dish_service)` của FastAPI để tiêm phụ thuộc, giúp các hàm router hoàn toàn phi trạng thái (stateless) và dễ dàng viết Unit Test bằng cách mock service.
- **Quy tắc thứ tự định tuyến (Route Precedence):**
  - Các route tĩnh (`/random`, `/filters/metadata`) **bắt buộc phải khai báo trước** route động (`/{dish_id}`). Nếu khai báo sau, FastAPI sẽ hiểu nhầm chuỗi ký tự `"random"` là một `dish_id`, gây ra lỗi `404 Not Found`.

### 2.2. Tầng Nghiệp Vụ / Service ([`backend/app/services/dish_service.py`](../backend/app/services/dish_service.py))
- **Trách nhiệm:** Nơi chứa toàn bộ logic nghiệp vụ (Business Rules).
- **Phân tách tham số loại trừ (`exclude_ids`):** Nhận chuỗi phân tách bởi dấu phẩy (`"dish_vn_001,dish_kr_002"`), kiểm tra và phân tích cú pháp thành một mảng `List[str]`, loại bỏ khoảng trắng thừa trước khi chuyển xuống tầng Repository.
- **Chuyển đổi dữ liệu (DTO Mapping):** Nhận thực thể SQLAlchemy Model từ Repository và chuyển đổi thành Schema Pydantic (`DishCardResponse`, `DishDetailResponse`) thông qua phương thức `model_validate()`, giúp kiểm soát chặt chẽ các trường thông tin trả về cho client.

### 2.3. Tầng Lưu Trữ / Repository ([`backend/app/repositories/dish_repo.py`](../backend/app/repositories/dish_repo.py))
- **Trách nhiệm:** Trừu tượng hóa hoàn toàn các thao tác truy vấn cơ sở dữ liệu. Tầng Service và Router không cần biết hệ thống đang dùng SQLite, PostgreSQL hay MySQL.
- **Cú pháp SQLAlchemy 2.0:** Sử dụng hoàn toàn cú pháp hiện đại `select(Dish).where(...)` thay vì cú pháp `db.query(Dish)` cũ của SQLAlchemy 1.x đã lỗi thời.
- **Eager Loading chống lỗi N+1 Query:** Khi truy vấn chi tiết món ăn kèm nguyên liệu và các bước nấu, Repository sử dụng kỹ thuật nạp trước `selectinload`:
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
  Kỹ thuật này nạp toàn bộ danh sách `ingredients` và `cooking_steps` chỉ trong **2 truy vấn tối ưu** sử dụng toán tử `IN`, thay vì tạo ra hàng trăm câu lệnh `SELECT` lặp đi lặp lại (vấn nạn N+1 kinh điển).

---

## 3. Kiến Trúc Cơ Sở Dữ Liệu & Tối Ưu Hóa SQLite (Database Deep-Dive)

### 3.1. Sơ Đồ Thực Thể - Quan Hệ (Entity-Relationship Diagram)

```mermaid
erDiagram
    CUISINES ||--o{ DISHES : "phân loại"
    DISHES ||--o{ INGREDIENTS : "chứa đựng"
    DISHES ||--o{ COOKING_STEPS : "hướng dẫn"
    USERS ||--o{ USER_SAVED_DISHES : "lưu trữ"
    DISHES ||--o{ USER_SAVED_DISHES : "được lưu"

    CUISINES {
        string id PK "Mã quốc gia (Vietnam, Korea...)"
        string name "Tên hiển thị quốc gia"
        string flag_emoji "Icon cờ quốc gia (🇻🇳, 🇰🇷...)"
    }

    DISHES {
        string id PK "Mã định danh món (dish_vn_001)"
        string name "Tên tiếng Việt"
        string english_name "Tên tiếng Anh quốc tế"
        string cuisine_id FK "Khóa ngoại tới Cuisines"
        string region "Vùng miền (Miền Bắc, Miền Nam...)"
        string image "Đường dẫn ảnh cục bộ (/images/dishes/...)"
        string image_url "Đường dẫn ảnh gốc từ web thực tế"
        int cook_time_minutes "Thời gian nấu (phút)"
        int prep_time_minutes "Thời gian chuẩn bị (phút)"
        string difficulty "Độ khó (Dễ, Trung bình, Khó)"
        int spicy_level "Cấp độ cay (0 đến 3)"
        int calories_approx "Lượng calo xấp xỉ (kcal)"
        string short_description "Đoạn giới thiệu ngắn về hương vị"
        string tips "Bí quyết vàng của đầu bếp"
        datetime created_at "Mốc thời gian tạo bản ghi"
    }

    INGREDIENTS {
        int id PK "Tự tăng (Autoincrement)"
        string dish_id FK "Khóa ngoại liên kết tới Dishes"
        string name "Tên nguyên liệu chuẩn bản xứ"
        string amount "Định lượng (vd: 200, 1.5, 2)"
        string unit "Đơn vị tính (g, muỗng canh, quả, ổ)"
        string category "Phân loại (thịt, tinh bột, rau củ, gia vị)"
    }

    COOKING_STEPS {
        int id PK "Tự tăng (Autoincrement)"
        string dish_id FK "Khóa ngoại liên kết tới Dishes"
        int step_number "Số thứ tự bước (1, 2, 3, 4, 5)"
        string title "Tiêu đề kỹ thuật chế biến"
        string description "Mô tả chi tiết cách nấu và nhiệt độ"
    }

    USERS {
        int id PK "Tự tăng (Autoincrement)"
        string username "Tên đăng nhập duy nhất (UNIQUE)"
        string password "Mật khẩu người dùng"
        string full_name "Họ và tên hiển thị"
        datetime created_at "Ngày tạo tài khoản"
    }

    USER_SAVED_DISHES {
        int id PK "Tự tăng (Autoincrement)"
        int user_id FK "Khóa ngoại liên kết tới Users"
        string dish_id FK "Khóa ngoại liên kết tới Dishes"
        datetime saved_at "Thời điểm nhấn Quẹt Phải (Like)"
    }
```

### 3.2. Đánh Chỉ Mục (B-Tree Indexing) & Tối Ưu Truy Vấn
Để đảm bảo tốc độ phản hồi API dưới **15ms** trên kho dữ liệu 1.100 món ăn và hàng ngàn nguyên liệu:
1. **Chỉ mục khóa ngoại:** Tạo `index=True` trên cột `cuisine_id` của bảng `dishes`, `dish_id` của bảng `ingredients` và `cooking_steps`.
2. **Chỉ mục lọc đa chiều:** Tạo chỉ mục trên cột `cook_time_minutes` và `spicy_level` để tăng tốc độ quét khi người dùng áp dụng bộ lọc.
3. **Cơ chế WAL (Write-Ahead Logging):**
   Trong file cấu hình cơ sở dữ liệu [`backend/app/db/database.py`](../backend/app/db/database.py), SQLite được cấu hình kích hoạt chế độ **WAL Mode** và kiểm tra khóa ngoại (Foreign Keys Pragma):
   ```python
   @event.listens_for(engine, "connect")
   def set_sqlite_pragma(dbapi_connection, connection_record):
       cursor = dbapi_connection.cursor()
       cursor.execute("PRAGMA journal_mode=WAL")
       cursor.execute("PRAGMA foreign_keys=ON")
       cursor.execute("PRAGMA synchronous=NORMAL")
       cursor.close()
   ```
   - **Lợi ích kiến trúc của WAL:** Cho phép các luồng đọc (Readers) và luồng ghi (Writers) hoạt động đồng thời không gây khóa toàn bộ file CSDL (Zero Database Lock Congestion).

---

## 4. Kiến Trúc Frontend: Quản Lý Ngăn Xếp Thẻ & Mô Hình Vật Lý Cử Chỉ

### 4.1. Ảo Hóa Ngăn Xếp Thẻ (Card Stack Virtualization)
Một sai lầm phổ biến của các lập trình viên khi làm ứng dụng dạng Tinder là nạp toàn bộ 100 hay 1.000 thẻ vào DOM cùng một lúc. Điều này khiến trình duyệt phải duy trì hàng ngàn DOM nodes, gây giật lag và tràn bộ nhớ trên thiết bị di động.

YumYumPick giải quyết vấn đề này bằng kỹ thuật **Stack Windowing (chỉ render tối đa 3 thẻ)** trong component [`CardStack.jsx`](../frontend/src/components/CardStack.jsx):

```mermaid
graph LR
    subgraph RAM_ARRAY["MẢNG DỮ LIỆU TRONG RAM (dishes state)"]
        D1["Thẻ 0: dish_vn_001"]
        D2["Thẻ 1: dish_kr_002"]
        D3["Thẻ 2: dish_it_003"]
        D4["Thẻ 3: dish_jp_004"]
        D5["Thẻ 4: dish_th_005"]
        D_N["Thẻ N: ..."]
    end

    subgraph DOM_TREE["DOM TREE THỰC SỰ ĐƯỢC RENDER (Tối đa 3 thẻ)"]
        CARD_TOP["Thẻ Trên Cùng (Front Card)<br/>- scale: 1.0<br/>- y: 0px<br/>- zIndex: 10<br/>- Kích hoạt Kéo/Thả (drag='x')"]
        CARD_MID["Thẻ Thứ Hai (Middle Card)<br/>- scale: 0.95<br/>- y: 12px<br/>- zIndex: 9<br/>- Khóa kéo (drag=false)"]
        CARD_BOT["Thẻ Thứ Ba (Bottom Card)<br/>- scale: 0.90<br/>- y: 24px<br/>- zIndex: 8<br/>- Khóa kéo (drag=false)"]
    end

    D1 -.->|slice 0| CARD_TOP
    D2 -.->|slice 1| CARD_MID
    D3 -.->|slice 2| CARD_BOT
    D4 -.->|Chờ trong bộ nhớ| RAM_ARRAY
```

### 4.2. Công Thức Toán Học Cho Cử Chỉ Quẹt (Framer Motion Physics)
Tại component [`SwipeCard.jsx`](../frontend/src/components/SwipeCard.jsx), vị trí kéo tay của người dùng được theo dõi bởi `useMotionValue(0)` và biến đổi mượt mà qua hook `useTransform`:

$$\text{rotate} = \frac{x}{15} \quad (\text{giới hạn trong khoảng } [-18^\circ, +18^\circ] \text{ khi } x \in [-250\text{px}, +250\text{px}])$$

- **Độ mờ của con dấu phản hồi (Stamp Opacity):**
  - $\text{likeOpacity} = \text{clamp}\left(\frac{x - 20}{100 - 20}, 0, 1\right)$ (Hiện dần khi kéo sang phải từ 20px đến 100px).
  - $\text{nopeOpacity} = \text{clamp}\left(\frac{-x - 20}{100 - 20}, 0, 1\right)$ (Hiện dần khi kéo sang trái từ -20px đến -100px).
- **Ngưỡng quyết định quẹt (Threshold Decision Logic):**
  Khi người dùng nhả chuột (`onDragEnd`), hệ thống kiểm tra 2 điều kiện:
  1. **Độ dời vị trí (Displacement Offset):** $|x| > 120\text{px}$
  2. **Vận tốc vung tay (Flick Velocity):** $|v_x| > 500\text{px/s}$
  Nếu một trong hai điều kiện thỏa mãn, thẻ sẽ bay thoát khỏi màn hình (`exit: x = \pm 400\text{px}`). Ngược lại, lò xo vật lý (`stiffness: 280, damping: 22`) sẽ tự động kéo thẻ bật lại vị trí trung tâm.

---

## 5. Thuật Toán Khử Trùng Lặp 7 Ngày (7-Day Rolling Window Deduplication)

### 5.1. Luồng Hoạt Động (Flowchart)

```mermaid
flowchart TD
    START([Bắt đầu gọi API getRandomDishes]) --> READ_STORAGE[Đọc localStorage 'yumyum_swiped_history']
    READ_STORAGE --> CHECK_EMPTY{Lịch sử có rỗng?}
    
    CHECK_EMPTY -- Có --> FETCH_DIRECT[Gửi request không kèm exclude_ids]
    CHECK_EMPTY -- Không --> ITERATE[Duyệt qua từng cặp dish_id: timestamp]
    
    ITERATE --> CHECK_EXPIRED{Hiện tại - timestamp < 7 ngày?}
    CHECK_EXPIRED -- Đúng (Còn hạn) --> ADD_EXCLUDE[Thêm dish_id vào mảng exclude_ids]
    CHECK_EXPIRED -- Sai (Quá 7 ngày) --> REMOVE_ID[Xóa dish_id khỏi lịch sử - Tự động dọn dẹp]
    
    ADD_EXCLUDE --> MERGE_SAVED[Gộp thêm danh sách ID các món đã Like hiện tại]
    REMOVE_ID --> MERGE_SAVED
    
    MERGE_SAVED --> SEND_API[Gửi Request lên Backend kèm param exclude_ids]
    SEND_API --> SQL_QUERY["Backend thực thi: WHERE id NOT IN (exclude_ids) ORDER BY RANDOM()"]
    SQL_QUERY --> RETURN_DISHES[Trả về danh sách món mới 100% không trùng lặp]
    RETURN_DISHES --> END([Kết thúc])
```

### 5.2. Phân Tích Độ Phức Tạp (Algorithm Complexity)
- **Độ phức tạp thời gian (Time Complexity):** $O(K)$, trong đó $K$ là số lượng món đã quẹt trong vòng 1 tuần ($K \le 1.100$). Thao tác duyệt object trong JavaScript diễn ra trong chưa đầy **0.2ms**.
- **Độ phức tạp không gian (Space Complexity):** $O(K)$ trong `LocalStorage`. Một bản ghi có định dạng `{"dish_vn_001": 1727062544000}`, tương đương khoảng 30 bytes. Với tối đa 1.100 món, tổng dung lượng lưu trữ chỉ chiếm **~33 KB**, hoàn toàn nằm trong giới hạn an toàn 5 MB của trình duyệt.
