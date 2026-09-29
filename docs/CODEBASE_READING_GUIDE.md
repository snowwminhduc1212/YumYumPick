# Hướng Dẫn Đọc Hiểu Toàn Bộ Mã Nguồn YumYumPick
*(A Comprehensive Onboarding & Codebase Reading Guide for Newcomers)*

Chào mừng bạn gia nhập hoặc tìm hiểu mã nguồn dự án **YumYumPick ("Tinder for Food")**! 

Codebase này được xây dựng trong một Sprint 5 ngày tốc độ cao nhưng tuân thủ nghiêm ngặt các nguyên lý kiến trúc sạch (**Clean Architecture**), phân tách rõ ràng giữa Frontend (React/Vite) và Backend (FastAPI/SQLite), đồng thời áp dụng ngôn ngữ thiết kế đồng bộ **Limón Flat Dark Brasserie**.

Tài liệu này được biên soạn như một **kim chỉ nam (Roadmap)** từng bước giúp một kỹ sư mới (dù là Intern, Junior hay Fullstack) có thể tiếp cận, đọc hiểu và làm chủ 100% dự án trong vòng **1 - 2 ngày** mà không bị ngợp.

---

## 📑 Mục Lục
1. [Yêu Cầu Tiên Quyết (Prerequisites)](#1-yêu-cầu-tiên-quyết-prerequisites)
2. [Tư Duy Tổng Thể & Kiến Trúc Dự Án (Mental Model)](#2-tư-duy-tổng-thể--kiến-trúc-dự-án-mental-model)
3. [Lộ Trình Đọc Code Chuẩn 5 Bước (Step-by-Step Reading Roadmap)](#3-lộ-trình-đọc-code-chuẩn-5-bước-step-by-step-reading-roadmap)
   - [Bước 0: Chạy và Trải Nghiệm Ứng Dụng](#bước-0-chạy-và-trải-nghiệm-ứng-dụng-run--experience-first)
   - [Bước 1: Đọc CSDL & Models (Single Source of Truth)](#bước-1-đọc-csdl--models-single-source-of-truth)
   - [Bước 2: Đọc Backend từ Dưới lên (Repo -> Service -> Schema -> API)](#bước-2-đọc-backend-từ-dưới-lên-repo---service---schema---api)
   - [Bước 3: Đọc Frontend từ Gốc đến Ngọn (Entry -> State -> Components)](#bước-3-đọc-frontend-từ-gốc-đến-ngọn-entry---state---components)
   - [Bước 4: Trace luồng thực tế (Trace an End-to-End Feature)](#bước-4-trace-luồng-thực-tế-trace-an-end-to-end-feature)
4. [Bảng Tra Cứu File Cốt Lõi (Key Files Cheat Sheet)](#4-bảng-tra-cứu-file-cốt-lõi-key-files-cheat-sheet)
5. [Những Điểm Đặc Thù & Cạm Bẫy Cần Chú Ý (Gotchas & Highlights)](#5-những-điểm-đặc-thù--cạm-bẫy-cần-chú-ý-gotchas--highlights)
6. [Bộ Câu Hỏi Tự Đánh Giá (Self-Check Quiz)](#6-bộ-câu-hỏi-tự-đánh-giá-self-check-quiz)

---

## 1. Yêu Cầu Tiên Quyết (Prerequisites)

### 1.1. Kiến thức nền tảng
Để đọc hiểu thuận lợi, bạn nên có kiến thức cơ bản về:
- **Ngôn ngữ:**
  - Python 3.10+ (Type Hinting, Pydantic, SQLAlchemy 2.0).
  - JavaScript ES6+ (Promises, Async/Await, Destructuring, Array methods).
- **Frameworks & Thư viện:**
  - **Backend:** FastAPI (Routers, Dependency Injection `Depends()`, Pydantic models).
  - **Frontend:** React 18/19 (Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`), Tailwind CSS.
  - **Animation:** Framer Motion (`motion.div`, `useMotionValue`, `useTransform`, gesture drag).
- **Khái niệm kiến trúc:**
  - RESTful API, Single Page Application (SPA), Client-Side Routing/View Toggling, Repository-Service Pattern.

### 1.2. Môi trường phát triển cục bộ
- Node.js >= 18.x và npm >= 9.x.
- Python >= 3.10.
- VS Code với các extensions khuyên dùng: *Python*, *Pylance*, *Tailwind CSS IntelliSense*, *ESLint*, *SQLite Viewer*.

---

## 2. Tư Duy Tổng Thể & Kiến Trúc Dự Án (Mental Model)

Đừng nhảy ngay vào đọc từng file ngẫu nhiên! Hãy hình dung bức tranh tổng thể:

```text
+-------------------------------------------------------------------------------+
|                               FRONTEND (Vite + React)                         |
|                                                                               |
|  [LandingPage] <==== Auth Gate ====> [Header] (Logo, Filters, Tab Nav)        |
|                                              |                                |
|                        +---------------------+---------------------+          |
|                        |                                           |          |
|              [Tab 1: Swipe Deck]                         [Tab 2: Liked Dishes]|
|         (CardStack.jsx + SwipeCard.jsx)                 (LikedDishesView.jsx) |
|          - Infinite Deck (Prefetch ngầm)                 - 16 Nền Ẩm Thực     |
|          - Physics-based Drag & Drop                     - Bỏ thích tức thì   |
|          - Bấm Tim / Skip / Undo                         - Xem Công Thức      |
|                        \                                           /          |
|                         +-----------------+-----------------------+           |
|                                           |                                   |
|                                  [DishDetailModal.jsx]                        |
|                               (Nguyên liệu & Hướng dẫn)                       |
+-------------------------------------------|-----------------------------------+
                                            | HTTP (Vite Proxy: /api, /images)
                                            v
+-------------------------------------------------------------------------------+
|                               BACKEND (FastAPI)                               |
|                                                                               |
|  [API Routers]            /api/v1/auth    /api/v1/dishes    /api/v1/saved     |
|         |                        |               |                |           |
|  [Services]                      |         DishService    SavedDishService    |
|         |                        |               |                |           |
|  [Repositories]                  |            DishRepo      SavedDishRepo     |
|         |                        +---------------+----------------+           |
|         v                                        v                            |
|  [Database Models]                SQLAlchemy ORM (models.py)                  |
|         |                                        v                            |
|  [SQLite Storage]                yumyumpick.db (WAL Mode, 1.100 Món Ăn)       |
+-------------------------------------------------------------------------------+
```

### 3 Điểm mấu chốt trong thiết kế:
1. **Decoupled Architecture:** Frontend và Backend hoàn toàn độc lập. Giao tiếp qua REST API dạng JSON. Frontend chạy cổng `5173`, Backend chạy cổng `8000`. Vite proxy tự động chuyển tiếp request `/api` và `/images` sang Backend.
2. **Stateless Auth đơn giản:** Dự án sử dụng mô hình Session Token lưu trữ trong `localStorage`. Header gửi lên dạng `Authorization: Bearer <username>`.
3. **Database Pre-seeded:** Cơ sở dữ liệu SQLite `backend/yumyumpick.db` đã được chuẩn hóa sẵn với 15 quốc gia, 1.100 món ăn và ảnh thật lưu offline tại `backend/images/dishes/`.

---

## 3. Lộ Trình Đọc Code Chuẩn 5 Bước (Step-by-Step Reading Roadmap)

### Bước 0: Chạy và Trải Nghiệm Ứng Dụng (Run & Experience First)
> *"Không đọc code khi chưa biết người dùng nhìn thấy và tương tác với cái gì."*

1. **Khởi chạy Backend:**
   ```powershell
   cd backend
   .\venv\Scripts\activate
   uvicorn app.main:app --reload --port 8000
   ```
2. **Khởi chạy Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```
3. **Thực hiện một lượt trải nghiệm mẫu:**
   - Vào `http://localhost:5173` -> Đọc Landing Page -> Bấm "Bắt đầu khám phá".
   - Đăng nhập tài khoản test (hoặc đăng ký nick mới).
   - Thử kéo thẻ sang phải (Thích) hoặc sang trái (Bỏ qua).
   - Bấm vào biểu tượng Bộ Lọc -> Chọn món Hàn / Món Nhật, lọc độ khó -> Xác nhận.
   - Chuyển sang Tab "Món Đã Thích" -> Thử bấm vào một món để xem modal công thức nấu ăn -> Thử bấm nút Bỏ thích.

---

### Bước 1: Đọc CSDL & Models (Single Source of Truth)
Nơi dữ liệu hình thành quyết định toàn bộ logic của ứng dụng.

1. **Xem file cấu hình Database:**
   - File: `backend/app/db/database.py`
   - *Điểm cần chú ý:* Khởi tạo SQLite engine, thiết lập `connect_args={"check_same_thread": False}` và bật chế độ `PRAGMA journal_mode=WAL` (Write-Ahead Logging) giúp đọc/ghi song song mượt mà.
2. **Xem định nghĩa các Entity (Thực thể):**
   - File: `backend/app/models/models.py`
   - *Đọc theo thứ tự các Model:*
     - `User`: Chứa thông tin tài khoản đăng nhập.
     - `Cuisine`: Danh mục 15 quốc gia (Việt Nam, Hàn Quốc, Nhật Bản, Ý, v.v.).
     - `Dish`: Món ăn (tên, mô tả, ảnh, thời gian nấu, độ cay, độ khó `difficulty`, calories, khẩu phần).
     - `Ingredient` & `DishIngredient`: Danh sách nguyên liệu và mối quan hệ n-n (định lượng, đơn vị).
     - `CookingStep`: Các bước hướng dẫn chế biến theo số thứ tự (`step_number`).
     - `UserSavedDish`: Bảng lưu món yêu thích của từng User.
     - `SwipeHistory`: Lịch sử quẹt (Like/Pass) kèm timestamp để phục vụ thuật toán loại trừ món trong 7 ngày.

---

### Bước 2: Đọc Backend từ Dưới lên (Repo -> Service -> Schema -> API)
Backend áp dụng mô hình 3 tầng (**Layered Architecture**):

1. **Schemas (Data Transfer Objects - DTOs):**
   - Thư mục: `backend/app/schemas/`
   - Đọc `dish.py`, `auth.py`, `saved_dish.py`, `filter.py`.
   - *Mục đích:* Pydantic models quy định dữ liệu đầu vào (Request validation) và cấu trúc JSON trả về (Response serialization). Chú ý trường `difficulty` vừa được bổ sung vào `DishCardResponse`.
2. **Repositories (Data Access Layer):**
   - Thư mục: `backend/app/repositories/`
   - `dish_repo.py`: Các câu truy vấn SQLAlchemy vào bảng `Dish`, xử lý lọc theo cuisine, cay, thời gian, độ khó, và lấy danh sách ngẫu nhiên (`func.random()`).
   - `saved_dish_repo.py`: Thêm, xóa và lấy danh sách món đã lưu của user.
3. **Services (Business Logic Layer):**
   - Thư mục: `backend/app/services/`
   - `dish_service.py`: Xử lý logic nghiệp vụ cốt lõi:
     - Khử trùng lặp: loại trừ các món có trong `exclude_ids` và các món đã quẹt trong vòng 7 ngày gần nhất (`get_recent_swiped_dish_ids`).
     - Cung cấp dữ liệu thẻ quẹt (`get_swipe_cards`) và chi tiết công thức (`get_dish_detail`).
   - `saved_dish_service.py`: Xử lý lưu món, bỏ lưu món, và kiểm tra quyền sở hữu.
4. **API Routers & Entrypoint:**
   - Thư mục: `backend/app/api/`
   - `dishes.py`: Định nghĩa route `/api/v1/dishes/swipe`, `/api/v1/dishes/{id}`, `/api/v1/dishes/cuisines`.
   - `saved_dishes.py`: Định nghĩa route `/api/v1/saved-dishes` (GET, POST, DELETE).
   - `auth.py`: Đăng ký, đăng nhập, lấy session hiện tại.
   - `backend/app/main.py`: Điểm khởi chạy của FastAPI, cấu hình CORS Middleware, mount thư mục ảnh tĩnh `/images` và khai báo các routers.

---

### Bước 3: Đọc Frontend từ Gốc đến Ngọn (Entry -> State -> Components)

1. **Entrypoint & Cấu hình Styles:**
   - `frontend/index.html`: Cấu hình Font Google *Outfit*, tiêu đề và thẻ meta SEO.
   - `frontend/src/index.css`: Bảng màu thiết kế thương hiệu **Limón Flat Dark Brasserie**:
     - Nền tối: `--bg-primary: #1d0b0d`
     - Điểm nhấn vàng chanh: `--accent-yellow: #f7ea48`
     - Chữ sáng / kem: `--text-primary: #fcf9f0`, `--text-secondary: #dbe2dc`
   - `frontend/vite.config.js`: Cấu hình proxy chuyển tiếp `/api` và `/images` đến backend `localhost:8000`.
2. **Giao tiếp API & Quản lý Phiên (Services & Hooks):**
   - `frontend/src/services/api.js`: Module bọc toàn bộ HTTP calls. Chú ý hàm inject header `Authorization: Bearer <token>` tự động.
   - `frontend/src/hooks/useAuth.js`: Hook quản lý user hiện tại, đăng nhập, đăng xuất, lưu `token` vào `localStorage`.
   - `frontend/src/services/swipeHistory.js`: Lưu lịch sử quẹt phía client làm fallback.
3. **Bộ não điều phối trạng thái (State Orchestrator):**
   - `frontend/src/App.jsx`: Component quan trọng nhất điều phối:
     - `user`: Trạng thái đã đăng nhập hay chưa (nếu chưa -> hiển thị `LandingPage`).
     - `activeTab`: Chuyển đổi giữa `'swipe'` (Quẹt thẻ) và `'liked'` (Món đã thích).
     - `isFilterOpen`, `isAuthOpen`, `selectedDish`: Điều khiển đóng/mở các Modal.
     - `likedDishesCount`: Badge hiển thị số lượng món đã lưu trên Header.
4. **Các Components giao diện theo từng khu vực:**
   - **Thanh điều hướng:** `frontend/src/components/Header.jsx` (Logo click về Landing, nút đổi Theme, nút Bộ lọc, nút Tab Liked, avatar User).
   - **Trang giới thiệu:** `frontend/src/components/LandingPage.jsx` (Hero banner, tính năng nổi bật, bộ sưu tập quốc gia, Footer).
   - **Khu vực Quẹt Thẻ (Core UX):**
     - `CardStack.jsx`: Quản lý danh sách thẻ đang hiển thị. **Cơ chế Infinite Deck:** khi danh sách còn <= 3 thẻ, tự động gọi API lấy thêm 5 thẻ mới và append vào stack.
     - `SwipeCard.jsx`: Thẻ món ăn cá nhân. Sử dụng Framer Motion `motion.div`, kéo thả bằng cử chỉ chuột/cảm ứng, tự động tính toán góc xoay `rotate = x / 15`, hiển thị huy hiệu LIKE (xanh lá) hoặc NOPE (đỏ) khi kéo.
   - **Khu vực Món Đã Thích (Liked View):**
     - `LikedDishesView.jsx`: Hiển thị dạng lưới (grid) responsive. Có thanh lọc 16 quốc gia dạng pills, nút bỏ thích với optimistic UI, bấm vào card để mở công thức.
   - **Khu vực Chi tiết & Bộ Lọc (Modals):**
     - `DishDetailModal.jsx`: Modal công thức, danh sách nguyên liệu có Checkbox đánh dấu, các bước nấu ăn chi tiết kèm thời gian và mẹo nhỏ.
     - `FilterModal.jsx`: Modal chọn quốc gia và độ khó, lưu giữ state bộ lọc người dùng đã chọn.
     - `AuthModal.jsx`: Modal đăng nhập và đăng ký.

---

### Bước 4: Trace Luồng Thực Tế (Trace an End-to-End Feature)

Cách tốt nhất để chắc chắn bạn đã hiểu code là "lần theo vết" một luồng tương tác thực tế từ đầu đến cuối:

#### Kịch bản: Người dùng quẹt THÍCH một món ăn
1. **Giao diện (Frontend):** Người dùng vuốt thẻ sang phải hoặc bấm nút "Tim" trong `CardStack.jsx` -> Kích hoạt hàm `handleSwipe(dish, 'like')`.
2. **Animation:** `SwipeCard.jsx` chạy animation trôi dạt sang phải `x: 500` và biến mất khỏi DOM.
3. **Client Call:** `CardStack.jsx` gọi `apiService.saveDish(dish.id)`.
4. **Proxy:** Request `POST /api/v1/saved-dishes` với body `{ "dish_id": 123 }` được Vite proxy gửi tới `http://localhost:8000/api/v1/saved-dishes`.
5. **Backend Router:** `backend/app/api/saved_dishes.py` đón request, trích xuất User từ header Authorization (`get_current_user`).
6. **Backend Service:** `SavedDishService.save_dish` nhận yêu cầu, kiểm tra món đã được lưu trước đó chưa.
7. **Backend Repo & DB:** `SavedDishRepo.add_saved_dish` insert một dòng vào bảng `user_saved_dishes`, commit transaction SQLite.
8. **Phản hồi:** Backend trả về status `201 Created` kèm thông tin món ăn vừa lưu.
9. **Cập nhật State:** Frontend nhận kết quả, tăng số đếm `likedDishesCount` trên Header, thêm món vào mảng `likedDishes` trong `App.jsx`.
10. **Prefetch ngầm:** Nếu số thẻ còn lại trong `CardStack` <= 3, `CardStack.jsx` lập tức bắn request `apiService.getSwipeDishes({ exclude_ids: [...] })` để bổ sung thêm 5 thẻ mới vào đuôi.

---

## 4. Bảng Tra Cứu File Cốt Lõi (Key Files Cheat Sheet)

| Tên File / Thư Mục | Tầng | Trách Nhiệm Chính |
| :--- | :---: | :--- |
| `backend/app/models/models.py` | BE - Data | Định nghĩa toàn bộ cấu trúc bảng và quan hệ CSDL SQLite. |
| `backend/app/services/dish_service.py` | BE - Logic | Nghiệp vụ lọc món, thuật toán loại trừ 7 ngày và infinite feed. |
| `backend/app/api/dishes.py` | BE - API | Cung cấp endpoints quẹt thẻ, lọc và xem chi tiết món. |
| `backend/yumyumpick.db` | BE - DB | Tệp CSDL SQLite có sẵn 1.100 món ăn và 15 nền ẩm thực. |
| `frontend/src/App.jsx` | FE - State | Trái tim quản lý trạng thái, routing nội bộ và modal của web app. |
| `frontend/src/components/CardStack.jsx` | FE - UX | Quản lý ngăn xếp thẻ quẹt và cơ chế Infinite Deck ngầm. |
| `frontend/src/components/SwipeCard.jsx` | FE - Motion | Xử lý tương tác vật lý, cử chỉ vuốt chạm Framer Motion. |
| `frontend/src/components/LikedDishesView.jsx` | FE - View | Giao diện danh sách món đã thích, bộ lọc 16 quốc gia, bỏ thích. |
| `frontend/src/components/DishDetailModal.jsx` | FE - Modal | Hiển thị chi tiết công thức nấu, checkbox nguyên liệu. |
| `frontend/src/services/api.js` | FE - Network | Cầu nối gọi API giữa Frontend và Backend. |
| `frontend/src/index.css` | FE - Style | Khai báo toàn bộ màu sắc, typography chuẩn Limón Dark. |

---

## 5. Những Điểm Đặc Thù & Cạm Bẫy Cần Chú Ý (Gotchas & Highlights)

1. **Không chạy script seed dữ liệu khi khởi động:**
   - Tệp CSDL `backend/yumyumpick.db` đã được nhóm seed sẵn 1.100 món với đầy đủ thông tin dinh dưỡng, nguyên liệu và các bước nấu. **Không** cần tìm script seed hay migrate lại database khi mới bắt đầu.
2. **Đường dẫn API tương đối (Relative URLs):**
   - Frontend không hardcode `http://localhost:8000/api`. Thay vào đó, gọi `/api/v1/...` và dựa vào proxy cấu hình trong `frontend/vite.config.js`. Điều này giúp hệ thống hoạt động mượt mà cả trên máy cục bộ lẫn khi deploy qua Cloudflare Tunnel.
3. **Xử lý ảnh cục bộ (Offline-first Images):**
   - 100% hình ảnh món ăn được lưu trong `backend/images/dishes/` và được FastAPI phục vụ dưới dạng static files tại `/images/dishes/...`. Không phụ thuộc vào bất kỳ link ảnh online nào từ bên ngoài.
4. **Bộ lọc đa quốc gia trong LikedDishesView:**
   - Dữ liệu ẩm thực có thể hiển thị bằng tiếng Việt (ví dụ: "Việt Nam", "Trung Quốc", "Hàn Quốc") hoặc tiếng Anh trong DB. Thành phần `LikedDishesView.jsx` sử dụng bảng từ điển ánh xạ song ngữ `CUISINE_MAP` để đảm bảo lọc chính xác cho cả 16 nút quốc gia.
5. **Cơ chế Infinite Deck:**
   - Framer Motion chỉ render tối đa 3 thẻ trên màn hình để giữ FPS ổn định ở mức 60. Các thẻ mới được fetch ngầm và xếp hàng đợi sẵn trong mảng thẻ của React state.

---

## 6. Bộ Câu Hỏi Tự Đánh Giá (Self-Check Quiz)

Sau khi đọc xong toàn bộ code theo hướng dẫn trên, bạn hãy tự trả lời 5 câu hỏi sau để kiểm tra mức độ nắm bắt của mình:

1. *Khi người dùng chưa đăng nhập, thành phần nào trên Frontend sẽ chặn người dùng vào màn hình quẹt thẻ và hiển thị trang nào?*
2. *Làm thế nào Backend ngăn không cho người dùng gặp lại những món ăn mà họ đã quẹt trong vòng 7 ngày qua?*
3. *Cơ chế Infinite Deck trong `CardStack.jsx` hoạt động như thế nào khi người dùng quẹt gần hết thẻ? Tham số nào được gửi lên API để tránh lấy lại các thẻ đang có trên màn hình?*
4. *Nếu muốn bổ sung thêm một trường thông tin mới cho món ăn (ví dụ: `rating_stars`), bạn cần sửa những file nào theo thứ tự từ Backend đến Frontend?*
5. *Tại sao ảnh món ăn hiển thị được trên Frontend với đường dẫn `/images/dishes/...` trong khi ảnh nằm ở thư mục `backend/images/dishes/`?*

---

> 💡 **Mẹo:** Đọc code kèm việc mở công cụ **DevTools (Network Tab)** trên trình duyệt và bật **Terminal log của FastAPI** để quan sát từng request đi qua hệ thống theo thời gian thực. Chúc bạn làm chủ codebase YumYumPick thật nhanh chóng và hào hứng!
