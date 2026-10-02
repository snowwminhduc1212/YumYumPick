# 13. Toàn Tập Kiến Trúc Hệ Thống, Giải Thích Toàn Bộ Mã Nguồn & Luồng Hoạt Động (Comprehensive System Architecture, Codebase Breakdown & End-to-End Flows)

> **Tài liệu tham chiếu tối cao và toàn diện nhất về hệ thống YumYumPick**  
> **Dành cho:** Toàn bộ thành viên đội ngũ kỹ thuật, Hội đồng chấm đồ án, Giảng viên hướng dẫn & Kỹ sư gia nhập dự án  
> **Phiên bản:** 2.0 (Cập nhật chuẩn xác 100% theo mã nguồn thực tế)  

---

## 📑 Mục Lục Chi Tiết

1. [Tổng Quan Hệ Thống & Triết Lý Thiết Kế (System Overview & Philosophy)](#1-tổng-quan-hệ-thống--triết-lý-thiết-kế)
2. [Ngăn Xếp Công Nghệ Thực Tế (Actual Technology Stack)](#2-ngăn-xếp-công-nghệ-thực-tế)
3. [Cấu Trúc Thư Mục & Bản Đồ Mã Nguồn Toàn Dự Án (Whole Codebase Structure)](#3-cấu-trúc-thư-mục--bản-đồ-mã-nguồn-toàn-dự-án)
4. [Sơ Đồ Kiến Trúc Hệ Thống & Tương Tác Phân Tầng (System Architecture)](#4-sơ-đồ-kiến-trúc-hệ-thống--tương-tác-phân-tầng)
5. [Toàn Bộ Các Luồng Hoạt Động Cốt Lõi (End-to-End System & User Flows)](#5-toàn-bộ-các-luồng-hoạt-động-cốt-lõi)
   - [Luồng 1: Khởi Động & Proxy Định Tuyến Mạng](#luồng-1-khởi-động--proxy-định-tuyến-mạng)
   - [Luồng 2: Xác Thực & Điều Phối Phiên Người Dùng (Auth Gate)](#luồng-2-xác-thực--điều-phối-phiên-người-dùng-auth-gate)
   - [Luồng 3: Quẹt Thẻ Ngẫu Nhiên, Nạp Thẻ Ngầm & Ảo Hóa Ngăn Xếp](#luồng-3-quẹt-thẻ-ngẫu-nhiên-nạp-thẻ-ngầm--ảo-hóa-ngăn-xếp)
   - [Luồng 4: Bỏ Qua Món & Thuật Toán Khử Trùng Lặp 7 Ngày](#luồng-4-bỏ-qua-món--thuật-toán-khử-trùng-lặp-7-ngày)
   - [Luồng 5: Thích Món & Quản Lý Bộ Sưu Tập Món Đã Lưu](#luồng-5-thích-món--quản-lý-bộ-sưu-tập-món-đã-lưu)
   - [Luồng 6: Khám Phá Công Thức, Checklist & Thanh Tiến Độ](#luồng-6-khám-phá-công-thức-checklist--thanh-tiến-độ)
   - [Luồng 7: Lọc Đa Tiêu Chí Động](#luồng-7-lọc-đa-tiêu-chí-động)
   - [Luồng 8: Phân Phối Ảnh Tĩnh 100% Offline & HTTP Caching](#luồng-8-phân-phối-ảnh-tĩnh-100-offline--http-caching)
6. [Giải Phẫu Chi Tiết Toàn Bộ Mã Nguồn Backend (Backend Code Explanation)](#6-giải-phẫu-chi-tiết-toàn-bộ-mã-nguồn-backend)
7. [Giải Phẫu Chi Tiết Toàn Bộ Mã Nguồn Frontend (Frontend Code Explanation)](#7-giải-phẫu-chi-tiết-toàn-bộ-mã-nguồn-frontend)
8. [Các Cạm Bẫy Kỹ Thuật & Giải Pháp Khắc Phục (Gotchas & Best Practices)](#8-các-cạm-bẫy-kỹ-thuật--giải-pháp-khắc-phục)

---

## 1. Tổng Quan Hệ Thống & Triết Lý Thiết Kế

### 1.1. Vấn đề giải quyết: Tê liệt phân tích (Analysis Paralysis)
Mỗi ngày, hàng triệu người lãng phí 20 - 45 phút chỉ để trả lời câu hỏi: *"Hôm nay ăn gì?"*. Khi mở các ứng dụng giao đồ ăn truyền thống (GrabFood, ShopeeFood), người dùng bị choáng ngợp bởi hàng nghìn nhà hàng, ma trận khuyến mãi, đánh giá phức tạp và menu bất tận.

**YumYumPick ("Quẹt là măm – Không lăn tăn nghĩ món")** áp dụng mô hình tương tác trực quan của **Tinder**:
- Mỗi lần chỉ tập trung vào **một món ăn duy nhất**.
- Cử chỉ đơn giản: **Quẹt phải (Like)** nếu thèm, **Quẹt trái (Skip)** nếu muốn bỏ qua.
- Hỗ trợ phím tắt PC siêu tốc: Phím mũi tên `[←]` (Skip) và `[→]` (Like).
- Không lo bị lặp món nhờ **Thuật toán loại trừ 7 ngày (7-Day Rolling Window)** lưu trực tiếp trên SQLite.
- Khám phá chi tiết công thức chuẩn ẩm thực bản xứ với **Checklist nguyên liệu tương tác** và **thanh tiến độ hoàn thành %**.

### 1.2. Ngôn ngữ thiết kế: Limón Flat Dark Brasserie
- **Màu nền chủ đạo:** Dark Olive / Black Olive (`#1d0b0d`) tạo cảm giác ấm cúng, sang trọng như một nhà hàng ẩm thực buổi tối.
- **Màu nhấn thương hiệu:** Lemon Zest neon (`#f7ea48`) nổi bật rực rỡ, kích thích thị giác và vị giác.
- **Màu chữ:** Warm Cream (`#fcf9f0`) với độ tương phản cao, êm dịu cho mắt.
- **Typography:** Font **Montserrat** phong cách typography mạnh mẽ, tracking rộng (Stenciled / Neon).

---

## 2. Ngăn Xếp Công Nghệ Thực Tế

| Phân Vùng | Công Nghệ / Thư Viện | Phiên Bản | Vai Trò & Lý Do Lựa Chọn |
|:---|:---|:---:|:---|
| **Frontend Framework** | **React.js** | **19.2.8** | Thư viện UI hiện đại nhất, hỗ trợ Concurrent Rendering tối ưu cho cử chỉ mượt mà. |
| **Frontend Tooling** | **Vite** | **8.3.0** | Tốc độ Hot Module Replacement (HMR) tính bằng mili-giây, tích hợp Reverse Proxy sang Backend. |
| **Styling Engine** | **Tailwind CSS v4** | **4.3.3** | Engine CSS thế hệ mới thông qua gói `@tailwindcss/vite`, build siêu nhanh, không cần `tailwind.config.js`. |
| **Physics Animation** | **Framer Motion** | **13.3.0** | Quản lý chuyển động vật lý đàn hồi lò xo, góc nghiêng theo kéo tay `rotate = x / 15`, animation đóng dấu. |
| **Iconography** | **Lucide React** | **1.46.0** | Hệ thống icon vector tối giản, sắc nét và nhẹ. |
| **Backend Framework** | **Python FastAPI** | **0.110+** | Web framework bất đồng bộ hiệu năng cao, tự sinh Swagger OpenAPI tại `/docs`. |
| **ORM / Database Tool** | **SQLAlchemy** | **2.0+** | Sử dụng cú pháp `Mapped` và `mapped_column` chuẩn Type-Hints, hỗ trợ Eager Loading `selectinload`. |
| **Data Validation** | **Pydantic** | **v2 (2.6+)** | Kiểm thực dữ liệu vào/ra với tốc độ biên dịch lõi Rust cực nhanh. |
| **Database Engine** | **SQLite 3** | Cục bộ | Cơ sở dữ liệu nhúng nhẹ (~7.6 MB), không cần cài đặt server riêng, kích hoạt chế độ **WAL Mode**. |
| **Web Server Gateway** | **Uvicorn (Standard)** | **0.28+** | ASGI Web Server chạy ứng dụng Python siêu tốc. |

---

## 3. Cấu Trúc Thư Mục & Bản Đồ Mã Nguồn Toàn Dự Án

Toàn bộ dự án được tổ chức gọn gàng, tách biệt rành mạch giữa Backend, Frontend và Tài liệu:

```text
YunYumPick/
├── backend/                             # MÃ NGUỒN PHÍA MÁY CHỦ (FASTAPI + SQLITE)
│   ├── app/
│   │   ├── api/                         # TẦNG CONTROLLER / ROUTING
│   │   │   ├── __init__.py              # Khai báo package api
│   │   │   ├── auth.py                  # API Đăng ký, Đăng nhập, Xem hồ sơ người dùng
│   │   │   ├── dishes.py                # API Quẹt thẻ ngẫu nhiên, Skip món, Chi tiết món, Metadata lọc
│   │   │   └── saved_dishes.py          # API Lưu món, Xóa món đã lưu, Danh sách yêu thích
│   │   ├── data/
│   │   │   └── dishes_seed.json         # Dữ liệu nguồn 1.100 món ăn chuẩn hóa (8.15 MB)
│   │   ├── db/
│   │   │   ├── __init__.py              # Khai báo package db
│   │   │   └── database.py              # Cấu hình kết nối SQLite, Engine, Session, PRAGMA WAL & FK
│   │   ├── models/
│   │   │   ├── __init__.py              # Export các models
│   │   │   └── models.py                # 6 Models SQLAlchemy 2.0: User, Cuisine, Dish, Ingredient, CookingStep, UserSavedDish, UserSkippedDish
│   │   ├── repositories/                # TẦNG TRUY VẤN CƠ SỞ DỮ LIỆU (DATA ACCESS LAYER)
│   │   │   ├── __init__.py              # Khai báo package repositories
│   │   │   ├── dish_repo.py             # Truy vấn món ăn, lọc đa chiều, tự động trừ 7 ngày, Eager Loading
│   │   │   └── saved_dish_repo.py       # Thêm/Xóa/Đọc món ăn đã lưu theo user_id
│   │   ├── schemas/                     # TẦNG DTO / PYDANTIC VALIDATION SCHEMAS
│   │   │   ├── __init__.py              # Export các schemas
│   │   │   ├── auth.py                  # UserCreate, UserLogin, UserData, AuthResponse
│   │   │   ├── dish.py                  # DishCardResponse, DishDetailResponse, DishSkipCreate, DishSkipResponse
│   │   │   ├── filter.py                # CuisineFilterItem, FilterOptionItem, FilterMetadataResponse
│   │   │   └── saved_dish.py            # SavedDishCreate, SavedDishItemResponse, MessageResponse
│   │   ├── services/                    # TẦNG NGHIỆP VỤ (BUSINESS LOGIC LAYER)
│   │   │   ├── __init__.py              # Khai báo package services
│   │   │   ├── dish_service.py          # Nghiệp vụ lọc ngẫu nhiên, parse exclude_ids, DTO mapping
│   │   │   └── saved_dish_service.py    # Nghiệp vụ lưu/hủy món, xử lý xung đột 409 Conflict, rollback
│   │   └── main.py                      # Điểm khởi chạy FastAPI, CORS, Caching ảnh tĩnh 24h
│   ├── images/
│   │   └── dishes/                      # Thư mục lưu 1.100 file ảnh JPG chụp món ăn thật 100%
│   ├── requirements.txt                 # Danh sách gói phụ thuộc Python
│   └── yumyumpick.db                    # Tệp CSDL SQLite vật lý (~7.6 MB)
│
├── frontend/                            # MÃ NGUỒN PHÍA GIAO DIỆN (REACT 19 + VITE + TAILWIND V4)
│   ├── public/
│   │   ├── favicon.svg                  # Icon thương hiệu trình duyệt
│   │   └── icons.svg                    # Vector icons
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png                 # Ảnh minh họa banner trang chủ
│   │   │   └── react.svg, vite.svg      # Logo mặc định
│   │   ├── components/                  # CÁC THÀNH PHẦN GIAO DIỆN NGƯỜI DÙNG
│   │   │   ├── AuthModal.jsx            # Modal Đăng nhập / Đăng ký kèm Client Validation
│   │   │   ├── CardStack.jsx            # Ngăn xếp ảo hóa 3 thẻ, Prebuffering ảnh, phím tắt PC [←], [→]
│   │   │   ├── DishDetailModal.jsx      # Modal công thức chi tiết, Checklist nguyên liệu & thanh tiến độ %
│   │   │   ├── FilterModal.jsx          # Modal bộ lọc đa tiêu chí (quốc gia, độ khó, độ cay, thời gian)
│   │   │   ├── LandingPage.jsx          # Trang nhận diện thương hiệu, Showcase xoay vòng 4s, Collage nền
│   │   │   ├── LikedDishesView.jsx      # Quản lý món đã thích, tìm kiếm không dấu, lọc theo cờ quốc gia
│   │   │   └── SwipeCard.jsx            # Thẻ quẹt vật lý: MotionValue x, rotate = x / 15, YUMMY/NOPE stamps
│   │   ├── config/
│   │   │   └── api.js                   # Cấu hình API prefix tương đối cho Vite Proxy (/api/v1)
│   │   ├── hooks/                       # CUSTOM REACT HOOKS
│   │   │   ├── useAuth.js               # Quản lý phiên đăng nhập trực tiếp từ localStorage (yumyum_session)
│   │   │   └── useFilterMetadata.js     # Nạp metadata bộ lọc động từ backend (/dishes/filters/metadata)
│   │   ├── services/
│   │   │   └── api.js                   # API Client gọi fetch, chuẩn hóa DTO, xử lý URL query
│   │   ├── App.jsx                      # Động cơ điều phối trạng thái trung tâm & Global Sticky Navbar
│   │   ├── index.css                    # Tailwind CSS v4, Limón Dark Palette, font typography
│   │   └── main.jsx                     # Entry point khởi tạo React 19 Root
│   ├── index.html                       # HTML template chính
│   ├── package.json                     # Quản lý phiên bản dependencies npm
│   └── vite.config.js                   # Cấu hình Vite Dev Server & Reverse Proxy (/api, /images)
│
└── docs/                                # TRUNG TÂM TÀI LIỆU KỸ THUẬT TOÀN DIỆN (15 CHUYÊN ĐỀ)
    ├── 00_PROJECT_OVERVIEW.md
    ├── 01_PROJECT_CHARTER_AND_SCOPE.md
    ├── 02_SYSTEM_ARCHITECTURE_AND_DESIGN.md
    ├── 03_USER_FLOW_AND_UIUX_SPEC.md
    ├── 04_TEAM_ROLES_AND_RACI.md
    ├── 05_GIT_WORKFLOW_AND_COLLABORATION_RULES.md
    ├── 06_SPRINT_ROADMAP_AND_TODO_PER_ROLE.md
    ├── 07_DATA_SCHEMA_AND_SEEDS.md
    ├── 08_CORE_FEATURES_SPEC.md
    ├── 09_TECHNICAL_ARCHITECTURE_DEEP_DIVE.md
    ├── 10_CODE_DEEP_DIVE_BACKEND.md
    ├── 11_CODE_DEEP_DIVE_FRONTEND.md
    ├── 12_SYSTEM_EVALUATION_AND_SCALABILITY_ROADMAP.md
    ├── 13_COMPREHENSIVE_SYSTEM_ARCHITECTURE_CODE_AND_FLOWS.md (Tài liệu hiện tại)
    ├── CODEBASE_READING_GUIDE.md
    └── README.md
```

---

## 4. Sơ Đồ Kiến Trúc Hệ Thống & Tương Tác Phân Tầng

Hệ thống được thiết kế theo mô hình **Client-Server kiến trúc phân tầng rời rạc (Decoupled Layered Architecture)** với nguyên tắc **Clean Architecture**:

```mermaid
graph TB
    subgraph CLIENT_TIER["TẦNG CLIENT (FRONTEND: REACT 19 + VITE 8 :5173)"]
        direction TB
        APP_ROOT["App.jsx (Central State Machine & Sticky Navbar)"]
        
        subgraph VIEWS["Giao Diện Chính (View Toggling)"]
            LANDING["LandingPage.jsx<br/>(Showcase 7 Nước, Collage Nền, Auto 4s)"]
            SWIPE_VIEW["CardStack.jsx & SwipeCard.jsx<br/>(Ảo Hóa 3 Thẻ, Kéo Thả 60 FPS, Phím Tắt)"]
            LIKED_VIEW["LikedDishesView.jsx<br/>(Lưới Món Yêu Thích, Search Không Dấu)"]
        end

        subgraph MODALS["Cửa Sổ Tương Tác (Modals)"]
            AUTH_MODAL["AuthModal.jsx<br/>(Đăng nhập / Đăng ký)"]
            FILTER_MODAL["FilterModal.jsx<br/>(Bộ lọc đa tiêu chí)"]
            DETAIL_MODAL["DishDetailModal.jsx<br/>(Công thức, Checklist %, 5 Bước Nấu)"]
        end

        subgraph HOOKS_SERVICES["Tầng Dịch Vụ & State Hooks"]
            USE_AUTH["useAuth.js<br/>(localStorage: yumyum_session)"]
            USE_FILTER["useFilterMetadata.js<br/>(Cuisine, Difficulty, Spicy, Time)"]
            API_CLIENT["services/api.js<br/>(Fetch Client & DTO Normalization)"]
        end

        APP_ROOT --> VIEWS
        APP_ROOT --> MODALS
        APP_ROOT --> HOOKS_SERVICES
    end

    subgraph NETWORK_TIER["TẦNG MẠNG & PROXY TRUNG GIAN"]
        VITE_PROXY["Vite Reverse Proxy (vite.config.js)<br/>Chuyển tiếp /api và /images sang :8000"]
    end

    subgraph SERVER_TIER["TẦNG SERVER (BACKEND: FASTAPI + PYTHON 3.11 :8000)"]
        direction TB
        MAIN_ENTRY["main.py (FastAPI App, CORS Middleware)"]
        CACHED_STATIC["CachedStaticFiles Handler<br/>(Cache-Control: public, max-age=86400)"]

        subgraph ROUTERS["Tầng Router (API Endpoints)"]
            ROUTER_AUTH["api/auth.py (/api/v1/auth)"]
            ROUTER_DISH["api/dishes.py (/api/v1/dishes)"]
            ROUTER_SAVED["api/saved_dishes.py (/api/v1/saved-dishes)"]
        end

        subgraph SERVICES_LAYER["Tầng Nghiệp Vụ (Services)"]
            SRV_DISH["DishService (dish_service.py)"]
            SRV_SAVED["SavedDishService (saved_dish_service.py)"]
        end

        subgraph REPOSITORIES_LAYER["Tầng Truy Vấn (Repositories)"]
            REPO_DISH["DishRepository (dish_repo.py)<br/>- 7-Day Auto Deduplication<br/>- func.random() Sampling<br/>- selectinload() Eager Loading"]
            REPO_SAVED["SavedDishRepository (saved_dish_repo.py)<br/>- Upsert Timestamp<br/>- Eager Loading Dish Rel"]
        end

        subgraph ORM_LAYER["Tầng Ánh Xạ Quan Hệ (SQLAlchemy 2.0 ORM)"]
            MODELS["models.py<br/>(User, Cuisine, Dish, Ingredient, CookingStep, UserSavedDish, UserSkippedDish)"]
        end

        MAIN_ENTRY --> ROUTERS
        MAIN_ENTRY --> CACHED_STATIC
        ROUTERS --> SERVICES_LAYER
        SERVICES_LAYER --> REPOSITORIES_LAYER
        REPOSITORIES_LAYER --> ORM_LAYER
    end

    subgraph STORAGE_TIER["TẦNG LƯU TRỮ VẬT LÝ"]
        SQLITE_DB[("SQLite 3 Database (backend/yumyumpick.db)<br/>- PRAGMA journal_mode=WAL<br/>- PRAGMA foreign_keys=ON<br/>- PRAGMA synchronous=NORMAL<br/>- PRAGMA busy_timeout=30000")]
        IMAGE_STORE[("Thư Mục Ảnh Cục Bộ (backend/images/dishes/*.jpg)<br/>1.100 Ảnh Chụp Thực Tế (Không AI)")]
    end

    API_CLIENT --> VITE_PROXY
    VITE_PROXY --> MAIN_ENTRY
    CACHED_STATIC --> IMAGE_STORE
    ORM_LAYER --> SQLITE_DB
```

---

## 5. Toàn Bộ Các Luồng Hoạt Động Cốt Lõi (End-to-End System & User Flows)

### Luồng 1: Khởi Động & Proxy Định Tuyến Mạng

1. **Khởi chạy Backend:** Chạy `uvicorn app.main:app --reload --port 8000` tại thư mục `backend/`. FastAPI mở kết nối SQLite với cấu hình PRAGMA WAL. Thư mục ảnh cục bộ được mount tại `/images`.
2. **Khởi chạy Frontend:** Chạy `npm run dev` tại thư mục `frontend/`. Vite lắng nghe tại cổng `5173`.
3. **Cơ chế Reverse Proxy:** Trong [`frontend/vite.config.js`](../frontend/vite.config.js), tất cả các yêu cầu gửi đến `/api` hoặc `/images` được chuyển tiếp tự động sang `http://127.0.0.1:8000`. Phía Client chỉ cần gọi đường dẫn tương đối `/api/v1/...`, triệt tiêu hoàn toàn rủi ro bị chặn bởi chính sách CORS khi trình duyệt giao tiếp qua lại.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Browser as Trình duyệt (Port 5173)
    participant ViteProxy as Vite Reverse Proxy
    participant Backend as FastAPI Server (Port 8000)
    participant SQLite as SQLite DB (WAL)

    User->>Browser: Truy cập http://localhost:5173
    Browser->>ViteProxy: GET /api/v1/dishes/filters/metadata
    ViteProxy->>Backend: Forward GET /api/v1/dishes/filters/metadata
    Backend->>SQLite: select(Cuisine)
    SQLite-->>Backend: 15 Quốc gia
    Backend-->>ViteProxy: JSON Metadata
    ViteProxy-->>Browser: Trả về cho hook useFilterMetadata
```

---

### Luồng 2: Xác Thực & Điều Phối Phiên Người Dùng (Auth Gate)

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách ghé thăm
    participant App as App.jsx
    participant AuthHook as hooks/useAuth.js
    participant Modal as AuthModal.jsx
    participant API as services/api.js
    participant Backend as api/auth.py
    participant DB as SQLite (users)

    User->>App: Mở trang web (chưa đăng nhập)
    App->>AuthHook: useAuth() đọc localStorage 'yumyum_session'
    AuthHook-->>App: user === null -> Hiển thị LandingPage
    User->>App: Bấm "Khám Phá Ngay" / "Bắt đầu quẹt"
    App->>Modal: setAuthOpen(true)
    User->>Modal: Nhập username, password, họ tên -> Bấm "Đăng nhập" / "Đăng ký"
    Modal->>API: POST /api/v1/auth/login hoặc /signup
    API->>Backend: Gửi JSON UserLogin / UserCreate
    Backend->>DB: Kiểm tra hoặc thêm User mới
    DB-->>Backend: Bản ghi User hợp lệ
    Backend-->>API: AuthResponse {success: true, user: {id, username, full_name}}
    API-->>Modal: Dữ liệu thành công
    Modal->>App: onLoginSuccess(userData)
    App->>AuthHook: login(userData) -> Lưu localStorage 'yumyum_session'
    App->>App: changeView('swipe') & fetchSavedDishes(user.id)
    App-->>User: Mở giao diện Quẹt Thẻ (Swipe Deck)
```

---

### Luồng 3: Quẹt Thẻ Ngẫu Nhiên, Nạp Thẻ Ngầm & Ảo Hóa Ngăn Xếp

Đảm bảo hiệu năng **60 khung hình/giây (60 FPS)** bất chấp số lượng món ăn:

1. **Khởi tạo:** `App.jsx` gọi `api.getRandomDishes({ user_id: currentUserId, limit: 10 })`.
2. **Asset Pre-buffering:** Trình duyệt khởi tạo ngầm `new Image().src = ...` cho 3 thẻ đầu tiên để nạp sẵn ảnh vào Disk Cache.
3. **Ảo hóa 3 thẻ trong `CardStack.jsx`:**
   - Dù mảng `dishes` có 10, 20 hay 50 phần tử, `dishes.slice(0, 3).map(...)` đảm bảo **chỉ đúng 3 thẻ** tồn tại trên DOM tree.
   - Thẻ `index === 0`: Thẻ trên cùng, bật `drag='x'`, scale `1.0`.
   - Thẻ `index === 1`: Thẻ giữa, scale `0.95`, dịch xuống `12px`, mờ nhẹ `opacity: 0.8`.
   - Thẻ `index === 2`: Thẻ đáy, scale `0.90`, dịch xuống `24px`, mờ hơn `opacity: 0.6`.
4. **Vật lý cử chỉ trong `SwipeCard.jsx`:**
   - Kéo tay làm biến đổi MotionValue `x`.
   - Góc xoay tính theo công thức: $\text{rotate} = \frac{x}{15}$ (dao động $[-18^\circ, +18^\circ]$).
   - Độ mờ con dấu: Khi $x > 20\text{px}$, con dấu **YUMMY!** hiện dần lên. Khi $x < -20\text{px}$, con dấu **NOPE** hiện dần lên.
   - Khi nhả tay (`onDragEnd`), nếu khoảng cách $|x| > 120\text{px}$ hoặc vận tốc $|v_x| > 500\text{px/s}$, thẻ sẽ bay ra khỏi màn hình. Lực đàn hồi lò xo (`spring: stiffness 280, damping 22`) kéo thẻ về vị trí cũ nếu chưa đạt ngưỡng.
5. **Cơ chế nạp ngầm (Infinite Prefetching Watermark):**
   - Khi số thẻ còn lại trong RAM $\le 3$, `CardStack` tự động phát tín hiệu `onPrefetch(remaining)`.
   - `App.jsx` gửi request `api.getRandomDishes` lấy thêm mẻ 10 món tiếp theo, kèm mảng `exclude_ids` gồm toàn bộ các thẻ đang có trong RAM để tránh trùng lặp.
   - Mẻ mới được nối vào đuôi mảng `swipeDishes`. Trải nghiệm người dùng hoàn toàn liên tục, không bao giờ phải thấy màn hình chờ nạp dữ liệu!

---

### Luồng 4: Bỏ Qua Món & Thuật Toán Khử Trùng Lặp 7 Ngày

```mermaid
flowchart TD
    SWIPE_LEFT["Người dùng Quẹt Trái (Skip) hoặc bấm phím [←]"] --> CLIENT_SKIP["handleSkipDish() trong App.jsx"]
    CLIENT_SKIP --> API_SKIP["api.skipDish(user_id, dish_id)"]
    API_SKIP --> ROUTER_SKIP["POST /api/v1/dishes/skip"]
    ROUTER_SKIP --> REPO_SKIP["DishRepository.skip_dish()"]
    REPO_SKIP --> DB_SKIP["Upsert vào bảng user_skipped_dishes: (user_id, dish_id, skipped_at = UTC NOW)"]

    DB_SKIP -.-> NEXT_FETCH["Lần lấy thẻ tiếp theo: api.getRandomDishes(user_id)"]
    NEXT_FETCH --> REPO_QUERY["DishRepository.get_random_dishes()"]
    
    subgraph SEVEN_DAY_LOGIC["Thuật Toán Loại Trừ 7 Ngày Tại CSDL"]
        CALC_TIME["Tính mốc thời gian: seven_days_ago = UTC NOW - 7 ngày"]
        QUERY_SAVED["SELECT dish_id FROM user_saved_dishes WHERE user_id = ? AND saved_at >= seven_days_ago"]
        QUERY_SKIPPED["SELECT dish_id FROM user_skipped_dishes WHERE user_id = ? AND skipped_at >= seven_days_ago"]
        UNION_IDS["Hợp nhất ID -> final_exclude_ids"]
        FINAL_SQL["WHERE dishes.id NOT IN (final_exclude_ids)<br/>ORDER BY RANDOM() LIMIT 10"]
    end

    REPO_QUERY --> CALC_TIME
    CALC_TIME --> QUERY_SAVED
    CALC_TIME --> QUERY_SKIPPED
    QUERY_SAVED --> UNION_IDS
    QUERY_SKIPPED --> UNION_IDS
    UNION_IDS --> FINAL_SQL
    FINAL_SQL --> CLEAN_DECK["Trả về 10 món ăn mới 100% không trùng lặp"]
```

---

### Luồng 5: Thích Món & Quản Lý Bộ Sưu Tập Món Đã Lưu

1. **Quẹt Phải:** Người dùng quẹt phải hoặc nhấn phím `[→]`.
2. **Ghi nhận DB:** `api.saveDish(userId, dishId)` gửi `POST /api/v1/saved-dishes`.
3. **Xử lý xung đột (Idempotency):** CSDL có ràng buộc `UniqueConstraint("user_id", "dish_id")`. Nếu người dùng thích lại một món trước đó, `SavedDishRepository` sẽ cập nhật lại `saved_at = datetime.utcnow()` thay vì gây lỗi.
4. **Màn hình Món Đã Lưu (`LikedDishesView.jsx`):**
   - Hiển thị danh sách thẻ dạng Grid responsive.
   - **Tìm kiếm không dấu:** Hàm `removeVietnameseDiacritics` bóc tách toàn bộ dấu tiếng Việt (`phở gà` $\to$ `pho ga`), cho phép tìm kiếm mượt mà không phụ thuộc vào bộ gõ Unikey.
   - **Lọc theo quốc gia:** Nhấp chọn các chip quốc gia (`🇻🇳 Việt Nam`, `🇰🇷 Hàn Quốc`, `🇯🇵 Nhật Bản`...) để lọc danh sách món ăn ngay tại bộ nhớ máy khách.
   - **Hủy thích tức thì:** Bấm nút Thùng rác `Trash2` để gọi `api.unsaveDish`, xóa ngay bản ghi khỏi SQLite và cập nhật lại giao diện.

---

### Luồng 6: Khám Phá Công Thức, Checklist & Thanh Tiến Độ

Khi người dùng nhấn vào bất kỳ thẻ món ăn nào trong danh sách đã lưu:

1. **Nạp chi tiết:** `handleOpenDetail(dish)` kích hoạt `api.getDishDetail(dishId)`.
2. **FastAPI Eager Loading:** Backend thực thi truy vấn kèm `selectinload(Dish.ingredients)` và `selectinload(Dish.cooking_steps)`, trả về đầy đủ nguyên liệu và 5 bước nấu trong **1 câu truy vấn duy nhất**, loại bỏ hoàn toàn vấn đề N+1 query.
3. **Mở Modal `DishDetailModal.jsx`:**
   - **Tab Nguyên Liệu (Checklist):** Người dùng đánh dấu vào các ô checkbox nguyên liệu đã chuẩn bị.
   - **Thanh tiến độ (Progress Bar):** Tính toán tỷ lệ phần trăm trực tiếp theo công thức:
     $$\text{progressPercent} = \text{round}\left(\frac{\text{checkedCount}}{\text{totalIngredients}} \times 100\right)$$
     Thanh tiến độ co dãn bằng hiệu ứng CSS transition màu vàng neon `#f7ea48`.
   - **Tab Hướng Dẫn:** Danh sách các bước nấu 1, 2, 3, 4, 5 với tiêu đề phương pháp nấu và mô tả chi tiết độ lửa, thời gian.
   - **Bí Quyết Đầu Bếp:** Chia sẻ kinh nghiệm mẹo vặt nấu nướng cho món ăn đó.

---

### Luồng 7: Lọc Đa Tiêu Chí Động

1. Người dùng bấm biểu tượng `SlidersHorizontal` trên thanh Navbar.
2. `FilterModal.jsx` hiển thị dữ liệu được nạp động từ hook `useFilterMetadata`:
   - 15 Quốc gia kèm cờ biểu tượng.
   - 4 Cấp độ cay: Không cay, Cay nhẹ, Cay vừa, Cay nhiều.
   - 4 Khoảng thời gian: Dưới 15p, 30p, 45p, 60p.
   - 3 Độ khó: Dễ, Trung bình, Kỳ công.
3. Khi bấm **"Áp Dụng Bộ Lọc"**, `App.jsx` lưu bộ lọc vào state `activeFilters`, reset lại biến cờ `hasMoreRef.current = true`, và gọi `fetchRandomDishes(filters)` để tái tạo lại toàn bộ ngăn xếp thẻ quẹt theo tiêu chí mới.

---

### Luồng 8: Phân Phối Ảnh Tĩnh 100% Offline & HTTP Caching

- Toàn bộ **1.100 bức ảnh món ăn thật** được lưu vật lý tại thư mục `backend/images/dishes/`.
- Lớp `CachedStaticFiles` kế thừa `StaticFiles` của FastAPI, tự động thêm HTTP Header:
  ```http
  Cache-Control: public, max-age=86400
  ```
- **Lợi ích:** Khi người dùng xem một món ăn, trình duyệt sẽ lưu bức ảnh vào Browser Disk Cache. Ở các lần quẹt thẻ tiếp theo, trình duyệt không tải lại ảnh từ server mà đọc trực tiếp từ bộ nhớ đệm ổ cứng với mã HTTP `304 Not Modified`, tải ảnh tức thì trong **0ms** và giảm thiểu 100% tải I/O cho máy chủ.

---

## 6. Giải Phẫu Chi Tiết Toàn Bộ Mã Nguồn Backend

### 6.1. File `backend/app/db/database.py` (Khởi Tạo Động Cơ SQLite Tối Ưu)

```python
# 1. Đường dẫn tuyệt đối tới CSDL vật lý
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "yumyumpick.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# 2. Khởi tạo engine với check_same_thread=False (cho phép đa luồng) và timeout=30s
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
        "timeout": 30,
    },
)

# 3. Kích hoạt PRAGMA WAL & Foreign Keys
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")       # Bật kiểm tra khóa ngoại
    cursor.execute("PRAGMA journal_mode=WAL")      # Bật Write-Ahead Logging (đọc/ghi song song)
    cursor.execute("PRAGMA synchronous=NORMAL")   # Tối ưu hóa tốc độ ghi đĩa
    cursor.execute("PRAGMA busy_timeout=30000")   # Timeout chờ khóa tối đa 30s
    cursor.close()

# 4. Dependency Injection Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase): pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 6.2. File `backend/app/models/models.py` (Khai Báo Cấu Trúc 6 Bảng Quan Hệ)

- `User`: Tài khoản người dùng (`id`, `username`, `password`, `full_name`, `created_at`), liên kết 1-N với `UserSavedDish` và `UserSkippedDish` với ràng buộc `cascade="all, delete-orphan"`.
- `Cuisine`: Quốc gia ẩm thực (`id`, `name`, `flag_emoji`), liên kết 1-N với `Dish`.
- `Dish`: Món ăn trung tâm (`id`, `name`, `english_name`, `cuisine_id`, `cook_time_minutes`, `prep_time_minutes`, `difficulty`, `spicy_level`, `calories_approx`, `image`, `short_description`, `tips`). Đánh chỉ mục `index=True` trên `cuisine_id`, `cook_time_minutes`.
- `Ingredient`: Nguyên liệu món ăn (`id`, `dish_id`, `name`, `amount`, `unit`, `category`).
- `CookingStep`: Bước nấu ăn (`id`, `dish_id`, `step_number`, `title`, `description`).
- `UserSavedDish`: Món ăn người dùng đã quẹt phải (Thích), có ràng buộc `UniqueConstraint("user_id", "dish_id")`.
- `UserSkippedDish`: Món ăn người dùng đã quẹt trái (Bỏ qua), có ràng buộc `UniqueConstraint("user_id", "dish_id")` và cột mốc thời gian `skipped_at`.

### 6.3. File `backend/app/repositories/dish_repo.py` (Tầng Truy Vấn CSDL)

- `get_random_dishes(...)`:
  - Kiểm tra nếu có `user_id`: Tự động tính mốc `seven_days_ago = datetime.utcnow() - timedelta(days=7)`, truy vấn toàn bộ các món user đã lưu và đã skip trong 7 ngày qua, đưa vào tập hợp `final_exclude_ids`.
  - Bổ sung các bộ lọc động: `cuisine`, `difficulty`, `spicy_level`, `cook_time_minutes <= max_time`.
  - Thêm điều kiện loại trừ: `Dish.id.notin_(final_exclude_ids)`.
  - Trộn ngẫu nhiên: `.order_by(func.random()).limit(limit)`.
- `skip_dish(user_id, dish_id)`: Ghi nhận quẹt trái. Nếu bản ghi đã tồn tại, cập nhật lại `skipped_at = datetime.utcnow()` (Upsert).
- `clear_user_skips(user_id)`: Xóa toàn bộ lịch sử skip của user trong bảng `user_skipped_dishes`.
- `get_dish_by_id(dish_id)`: Nạp chi tiết món kèm `selectinload(Dish.ingredients)` và `selectinload(Dish.cooking_steps)` để triệt tiêu lỗi N+1 Query.

---

## 7. Giải Phẫu Chi Tiết Toàn Bộ Mã Nguồn Frontend

### 7.1. File `frontend/src/App.jsx` (Động Cơ Điều Phối Trạng Thái)

- **Quản lý View:** Sử dụng `currentView` ('landing' | 'swipe' | 'liked') lưu trong `sessionStorage` để không mất trạng thái khi F5.
- **Thanh điều hướng thông minh (Inline Header):**
  - Chỉ xuất hiện khi người dùng đã vào ứng dụng (không hiển thị ở Landing Page).
  - Tích hợp Logo YumYumPick, nút chuyển tab Quẹt Thẻ, tab Món Đã Lưu kèm Badge số lượng trực quan, nút mở Bộ Lọc và nút Tài Khoản / Đăng Xuất.
- **Xử lý sự kiện quẹt:**
  - `handleCardSwiped`: Xóa thẻ vừa quẹt khỏi state `swipeDishes` trong RAM ngay lập tức.
  - `handleLikeDish`: Lưu món vào DB via `api.saveDish`.
  - `handleSkipDish`: Lưu vào server via `api.skipDish` (loại trừ 7 ngày).
  - `handlePrefetchDishes`: Tự động nạp ngầm 10 thẻ tiếp theo khi số thẻ còn lại $\le 3$.

### 7.2. File `frontend/src/components/CardStack.jsx` (Ảo Hóa Ngăn Xếp Thẻ)

- Sử dụng `AnimatePresence custom={exitDirection}` để tạo hiệu ứng thẻ bay mượt mà theo đúng hướng quẹt (trái hoặc phải).
- Cắt mảng lấy đúng 3 thẻ đầu tiên `dishes.slice(0, 3)` để dựng DOM nodes.
- Quản lý sự kiện phím tắt bàn phím `ArrowLeft` và `ArrowRight` toàn cục.
- Cụm nút bấm nổi bổ trợ `[←] Skip` và `[→] Like` cho người dùng PC sử dụng chuột.

### 7.3. File `frontend/src/components/SwipeCard.jsx` (Vật Lý Cử Chỉ Kéo Thả)

- `x = useMotionValue(0)` theo dõi vị trí con trỏ.
- `rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18])` tạo góc xoay tự nhiên như cầm một lá bài ngoài đời thật.
- Con dấu **YUMMY!** và **NOPE** hiển thị động theo độ dời vị trí.
- Xử lý `onDragEnd` dựa trên cả khoảng cách kéo (Offset > 120px) và vận tốc vung chuột (Velocity > 500px/s).

### 7.4. File `frontend/src/components/DishDetailModal.jsx` (Checklist Tương Tác & Thanh Tiến Độ)

- Chuyển đổi giữa 2 tab: `ingredients` và `steps`.
- State `checkedIngredients` lưu trữ trạng thái các nguyên liệu người dùng đã tích chọn.
- Tính toán thanh tiến độ phần trăm `progressPercent` hiển thị thời gian thực.
- Đóng modal thuận tiện bằng phím `Escape` hoặc nút `X`.

---

## 8. Các Cạm Bẫy Kỹ Thuật & Giải Pháp Khắc Phục (Gotchas & Best Practices)

| Cạm Bẫy Tiềm Ẩn (Pitfall) | Hậu Quả Nếu Không Xử Lý | Giải Pháp Kỹ Thuật Trong Dự Án |
|:---|:---|:---|
| **Lỗi SQLite "Database is Locked"** | Khi nhiều request đọc/ghi đồng thời xảy ra, SQLite sẽ báo lỗi khóa cơ sở dữ liệu. | Đã kích hoạt **PRAGMA journal_mode=WAL** và đặt **PRAGMA busy_timeout=30000** (30 giây) trong `database.py`. |
| **Lỗi tràn bộ nhớ DOM khi quẹt nhiều** | Render hàng trăm thẻ vào DOM cùng lúc sẽ gây giật lag và đơ trình duyệt di động. | Đã áp dụng **Stack Windowing (dishes.slice(0, 3))**, DOM luôn chỉ chứa đúng 3 thẻ thẻ tại mọi thời điểm. |
| **Lỗi N+1 Query Problem** | Khi xem chi tiết món ăn, nếu truy vấn nguyên liệu và bước nấu riêng lẻ sẽ tốn hàng chục truy vấn SQL. | Đã áp dụng kỹ thuật **Eager Loading với `selectinload`** trong SQLAlchemy để lấy toàn bộ dữ liệu trong 1 câu SQL. |
| **Lỗi nháy giao diện khi F5 (Auth Flicker)** | Nếu kiểm tra phiên đăng nhập bằng `useEffect`, trang web sẽ bị nháy từ trang Đăng nhập sang trang Quẹt thẻ. | Đã khởi tạo state `user` **đồng bộ (Synchronous Read)** trực tiếp từ `localStorage` trong hàm `readSession` của `useAuth.js`. |
| **Lỗi mất đồng bộ loại trừ 7 ngày** | Nếu chỉ lưu lịch sử skip vào LocalStorage, khi người dùng đổi máy tính hoặc xóa cache thì món cũ sẽ bị quẹt lại. | Đã chuyển toàn bộ cơ chế Skip sang **Bảng CSDL `user_skipped_dishes` trên máy chủ**, tự động đồng bộ hóa trên mọi thiết bị. |
| **Lỗi tìm kiếm tiếng Việt có dấu** | Người dùng gõ "bun cha" không tìm thấy món "Bún chả". | Đã xây dựng hàm chuẩn hóa **`removeVietnameseDiacritics`** bóc tách toàn bộ dấu tiếng Việt trước khi so khớp chuỗi. |

---

> **Kết luận:** Hệ thống YumYumPick được xây dựng với sự cân bằng tuyệt đối giữa **tính khoa học trong kiến trúc** (Clean Architecture, WAL Mode, Eager Loading), **trải nghiệm người dùng đỉnh cao** (60 FPS Framer Motion, 3-Card Virtualization, Checklist tương tác) và **sự toàn vẹn dữ liệu** (1.100 món ăn chuẩn bản xứ, 100% ảnh thật offline).
