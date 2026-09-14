# 🍔 YumYumPick — "Tinder For Food" (Quẹt Là Măm)

<div align="center">

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![React](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

**Nền tảng gợi ý món ăn ngẫu nhiên theo cơ chế quẹt thẻ (Tinder-style Swipe)**  
*Giải cứu câu hỏi kinh điển: "Hôm nay ăn gì?" trong tích tắc 30 giây!*

</div>

---

## 📖 1. Giới Thiệu Dự Án (About YumYumPick)

**YumYumPick** ra đời nhằm chấm dứt hội chứng *"Tê liệt quyết định" (Decision Paralysis)* khi chọn món ăn hàng ngày. Thay vì phải đọc những danh sách thực đơn dài vô tận, người dùng chỉ cần tập trung vào **một món ăn tại một thời điểm** và đưa ra quyết định trực giác:

- 👆 **Nhấp vào thẻ (Tap / ℹ️):** Mở nhanh bảng **Giới thiệu món ăn** (Dish Intro): khám phá nguồn gốc xuất xứ, hương vị đặc trưng, thời gian chế biến, lượng calo và tóm tắt nguyên liệu chính để cân nhắc trước khi quẹt.
- 👉 **Quẹt Phải (Swipe Right / ❤️):** Chọn món này! Tự động lưu món ăn và công thức nấu chi tiết vào tài khoản cá nhân trên CSDL SQLite.
- 📖 **Xem chi tiết công thức sau khi quẹt:** Mở bộ sưu tập món đã lưu để xem toàn bộ công thức chuẩn (danh sách nguyên liệu có checkbox tiện kiểm tra tủ lạnh/đi chợ, hướng dẫn nấu từng bước 1-2-3 và mẹo nhỏ từ đầu bếp).
- 👈 **Quẹt Trái (Swipe Left / ❌):** Bỏ qua món ăn này và ngay lập tức xem gợi ý tiếp theo.
- 🛒 **Xuất Danh Sách Đi Chợ (Smart Grocery List):** Tự động tổng hợp nguyên liệu của tất cả các món đã lưu để sao chép nhanh gửi qua Zalo/Messenger.
- 👤 **Đăng ký & Đăng nhập siêu đơn giản:** Chỉ cần nhập `username` & `password` để tạo tài khoản hoặc đăng nhập, không cần xác minh email/OTP phức tạp.
- 📱💻 **Responsive toàn diện:** Trải nghiệm mượt mà trên cả điện thoại (Mobile web full touch) và máy tính (Desktop PC kèm phím tắt `←`, `→`, `Space`).
- 🗄️ **Quản lý dữ liệu qua SQLite:** Không cần giao diện Admin CMS cồng kềnh, nhóm tự quản lý món ăn và dữ liệu trực tiếp thông qua file CSDL SQLite hoặc script Python.

---

## 💡 2. Giải Đáp Các Quyết Định Kiến Trúc Mới

### 2.1. Bỏ phần Deploy & Bỏ Admin CMS
- **Bỏ Deploy (Cloud/CI/CD):** Chuyển 100% về chạy Localhost (`npm run dev` + `uvicorn`). Giảm thiểu toàn bộ rủi ro về cấu hình port, SSL, CORS cloud, chi phí hosting và lỗi deploy.
- **Bỏ Admin CMS UI:** Mọi dữ liệu món ăn được quản trị trực tiếp thông qua file CSDL **SQLite** (dùng công cụ trực quan miễn phí như **DB Browser for SQLite**, DBeaver hoặc chạy script seed Python). Tiết kiệm ít nhất 40% thời gian code giao diện và API quản trị.

### 2.2. Vai trò của `LocalStorage` (Có cần bỏ không?)
- **Trong bản cũ:** Không có tài khoản người dùng, nên LocalStorage phải gánh toàn bộ dữ liệu món đã lưu và lịch sử quẹt.
- **Trong bản mới (Đã có SQLite & User Auth):**
  - Món đã lưu (Saved Dishes) được lưu trữ bền vững trong bảng `user_saved_dishes` trên CSDL SQLite thông qua API Backend.
  - **LocalStorage vẫn giữ lại nhưng với vai trò tối giản:** Chỉ dùng để lưu **phiên đăng nhập** (`user_id`, `username`) để khi người dùng F5 hoặc tải lại trang thì không bị bắt đăng nhập lại. Ngoài ra có thể làm bộ đệm tạm thời cho khách chưa đăng nhập (Guest mode).
  - Không cần lưu trữ các cấu trúc dữ liệu cồng kềnh trong LocalStorage nữa!

### 2.3. Responsive UI cho cả PC và Điện Thoại
- **Mobile Web (<= 640px):** Giao diện thẻ quẹt full màn hình (100vw/100vh), hỗ trợ thao tác vuốt cảm ứng đa điểm bằng ngón tay cái, cụm nút bấm nổi phía dưới màn hình, modal mở dạng Bottom Sheet kéo từ đáy lên.
- **Desktop PC (>= 1024px):** Giao diện hiển thị dạng khung điện thoại chuẩn hoặc bố cục 2 cột cân đối:
  - Khung giữa: Thẻ quẹt kích thước cố định trực quan ($420\text{px} \times 600\text{px}$), hỗ trợ phím mũi tên bàn phím (`←` để Skip, `→` để Like, `Space` để xem chi tiết).
  - Khung bên: Thanh điều hướng hoặc panel mở rộng xem nhanh danh sách món đã lưu mà không bị tràn màn hình.

---

## 🛠️ 3. Công Nghệ Sử Dụng (Tech Stack Tinh Gọn)

```mermaid
flowchart LR
    subgraph Client["Frontend (Chạy Local: Port 5173)"]
        React["React.js (Vite)"]
        Framer["Framer Motion (Swipe Physics)"]
        Tailwind["Tailwind CSS (Responsive PC/Mobile)"]
        AuthUI["Simple Auth Modal (Login/Signup)"]
        LS[("LocalStorage (Session User Info)")]
    end

    subgraph Server["Backend (Chạy Local: Port 8000)"]
        FastAPI["Python FastAPI"]
        Pydantic["Pydantic v2"]
        SQLAlchemy["SQLAlchemy 2.0 ORM"]
        Uvicorn["Uvicorn Local Server"]
    end

    subgraph Database["Local Database"]
        SQLite[("SQLite 3 Database\n(File: yumyumpick.db)")]
        DBBrowser["Quản lý trực tiếp bằng\nDB Browser for SQLite"]
    end

    Client <-->|REST API (JSON / CORS)| Server
    Server <-->|Local File Access| SQLite
    DBBrowser -.->|Truy vấn & Sửa data| SQLite
```

| Tầng | Công Nghệ | Mô Tả & Nhiệm Vụ |
|---|---|---|
| **Frontend** | **React (Vite) + Tailwind CSS** | Giao diện Responsive (PC & Mobile), nhẹ, load tức thì. |
| **Motion/Gesture** | **Framer Motion** | Hiệu ứng quẹt thẻ Tinder mượt mà 60 FPS, stamp Like/Skip. |
| **Backend** | **Python FastAPI + Uvicorn** | RESTful API hiệu năng cao, tự sinh Swagger UI tại `/docs`. |
| **Database** | **SQLite 3 + SQLAlchemy** | CSDL cục bộ lưu trong 1 file `yumyumpick.db`, không cần cài đặt server. |
| **Auth** | **Simple Auth** | Đăng ký & đăng nhập đơn giản bằng username/password, không cần OTP/Email. |
| **DB GUI Tool** | **DB Browser for SQLite** | Công cụ xem và sửa dữ liệu trực quan thay thế cho trang Admin. |

---

## 🚀 4. Hướng Dẫn Cài Đặt & Chạy Thử (Quickstart Guide)

### Bước 1: Khởi chạy Backend & SQLite DB

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Khởi tạo môi trường ảo Python
python -m venv venv

# 3. Kích hoạt môi trường ảo
# Trên Windows:
venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

# 4. Cài đặt các thư viện cần thiết (rất nhẹ)
pip install -r requirements.txt

# 5. Khởi tạo CSDL SQLite và nạp dữ liệu món ăn mẫu (Chỉ chạy 1 lần)
python -m app.db.seed_sqlite

# 6. Chạy server FastAPI
uvicorn app.main:app --reload --port 8000
```
> Server hoạt động tại: `http://localhost:8000`  
> Tài liệu Swagger UI để test API: `http://localhost:8000/docs`

### Bước 2: Khởi chạy Frontend (React + Vite)

```bash
# Mở một cửa sổ Terminal mới
cd frontend

# Cài đặt thư viện giao diện
npm install

# Chạy ứng dụng giao diện
npm run dev
```
> Ứng dụng giao diện mở tại: `http://localhost:5173`

---

## 👥 5. Phân Chia Task Làm Việc Song Song (Parallel Work Breakdown)

Để các thành viên trong nhóm làm việc độc lập mà **không bị phụ thuộc (block) lẫn nhau**, kiến trúc đã được module hóa với **API Contract định sẵn**:

```mermaid
flowchart TD
    Kickoff["🎯 Ngày 1: Chốt Schema SQLite & API Contract"] --> FE1["🎨 Thành viên 1:\nFrontend Swipe & Responsive"]
    Kickoff --> FE2["📱 Thành viên 2:\nFrontend Modals, Auth & Recipe"]
    Kickoff --> BE["⚙️ Thành viên 3:\nBackend FastAPI, Auth & SQLite"]
    Kickoff --> DATA["🍱 Thành viên 4:\nData Collection, Seed & Testing"]

    FE1 --> Merge["🚀 Ngày 4-5: Ghép Tích Hợp E2E & Demo"]
    FE2 --> Merge
    BE --> Merge
    DATA --> Merge
```

| Vai Trò | Nhiệm Vụ Cốt Lõi (Làm Song Song) | Deliverables |
|---|---|---|
| **Thành viên 1 (Frontend Swipe Lead)** | Xây dựng cơ chế quẹt thẻ bằng Framer Motion, stamp Like/Skip, xử lý phím tắt PC (`←`, `→`), responsive khung thẻ cho cả Mobile và Desktop. | `SwipeCard.jsx`, `CardStack.jsx`, Responsive layout |
| **Thành viên 2 (Frontend Feature Dev)** | Xây dựng Modal Đăng ký/Đăng nhập đơn giản, Modal Bộ lọc, Drawer giới thiệu món ăn, Màn hình danh sách món đã lưu kèm checkbox nguyên liệu và nút xuất danh sách đi chợ. | `AuthModal.jsx`, `FilterModal.jsx`, `DishDrawer.jsx`, `SavedList.jsx` |
| **Thành viên 3 (Backend & SQLite Lead)** | Xây dựng FastAPI server, kết nối SQLite qua SQLAlchemy, viết API Đăng ký/Đăng nhập đơn giản, API lấy món ăn ngẫu nhiên/lọc, API lưu/xóa món yêu thích. | `app/api/auth.py`, `app/api/dishes.py`, `app/db/session.py` |
| **Thành viên 4 (Data & Testing Specialist)** | Thu thập 40-50 món ăn chuẩn (ảnh đẹp, nguyên liệu, bước nấu, calo, độ cay), viết script `seed_sqlite.py` nạp vào SQLite, kiểm thử tính năng trên PC & Mobile. | `dishes_seed.json`, `seed_sqlite.py`, Test checklist |

---

## 📅 6. Kế Hoạch Triển Khai 5 Ngày (5-Day Crash Plan)

- **Ngày 1 (Foundation & Schema):** Chốt định dạng dữ liệu (API Contract), khởi tạo cấu trúc thư mục Frontend & Backend, dựng bảng SQLite và nạp 10 món mẫu đầu tiên.
- **Ngày 2 (Core Features in Parallel):**
  - Backend: Viết xong API Auth (Login/Signup) và API Random/Filter món.
  - Frontend 1: Xây dựng xong bộ thẻ quẹt Framer Motion + Responsive khung thẻ.
  - Frontend 2: Xây dựng xong UI Login/Signup + Modal Bộ lọc.
  - Data Specialist: Hoàn thiện dữ liệu 40+ món ăn kèm link ảnh chất lượng.
- **Ngày 3 (Integration & Recipe Details):**
  - Frontend kết nối API Backend (Quẹt phải gọi API lưu món vào SQLite).
  - Hoàn thiện Drawer giới thiệu món và Màn hình chi tiết công thức nấu.
  - Kiểm tra giao diện trên cả điện thoại (F12 Mobile view) và PC.
- **Ngày 4 (Advanced Features & Grocery List):**
  - Hoàn thiện tính năng Tạo danh sách đi chợ (Smart Grocery List) từ các món đã lưu.
  - Kiểm thử toàn trình (E2E): Đăng ký $\rightarrow$ Đăng nhập $\rightarrow$ Lọc $\rightarrow$ Quẹt $\rightarrow$ Lưu $\rightarrow$ Xem công thức $\rightarrow$ Đi chợ.
- **Ngày 5 (Polish, Bug Fixing & Demo):**
  - Tinh chỉnh hiệu ứng mượt mà, sửa các lỗi nhỏ (edge cases).
  - Nạp đầy đủ bộ dữ liệu 50 món ăn.
  - Chuẩn bị slide và kịch bản demo sản phẩm.

---

## 📚 7. Danh Mục Tài Liệu Chi Tiết

Mọi tài liệu chi tiết của dự án nằm trong thư mục [`docs/`](./docs/README.md):
- [**00. Master Project Overview**](./docs/00_PROJECT_OVERVIEW.md): Tổng quan hệ thống sau khi tinh giản.
- [**01. Project Charter & Scope**](./docs/01_PROJECT_CHARTER_AND_SCOPE.md): Phạm vi MVP 5 ngày, tiêu chuẩn hoàn thành.
- [**02. System Architecture & Design**](./docs/02_SYSTEM_ARCHITECTURE_AND_DESIGN.md): Thiết kế phân tầng, API RESTful, SQLite schema, Responsive PC/Mobile.
- [**03. User Flow & UI/UX Spec**](./docs/03_USER_FLOW_AND_UIUX_SPEC.md): Luồng người dùng, quy chuẩn vật lý quẹt thẻ, đặc tả Responsive.
- [**04. Team Roles & RACI Matrix**](./docs/04_TEAM_ROLES_AND_RACI.md): Phân công 4 vai trò làm việc song song không bị nghẽn.
- [**05. Git Workflow & Collaboration Rules**](./docs/05_GIT_WORKFLOW_AND_COLLABORATION_RULES.md): Quy chuẩn nhánh Git, Conventional Commits.
- [**06. Sprint Roadmap & Actionable Checklist**](./docs/06_SPRINT_ROADMAP_AND_TODO_PER_ROLE.md): Lộ trình 5 ngày chi tiết từng giờ, checklist theo từng vai trò.
- [**07. Data Schema, SQLite & Seeds**](./docs/07_DATA_SCHEMA_AND_SEEDS.md): Cấu trúc SQLite DDL, bảng users, quy trình chuẩn bị data và script seed.
