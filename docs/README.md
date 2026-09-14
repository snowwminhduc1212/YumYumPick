# 📚 YumYumPick — Trung Tâm Tài Liệu Kỹ Thuật (5-Day Plan)

Chào mừng bạn đến với kho tài liệu chuẩn kỹ thuật của **YumYumPick** — Nền tảng gợi ý món ăn ngẫu nhiên theo cơ chế quẹt thẻ (Tinder for Food), được tối ưu hóa cho đội ngũ thực hiện song song và hoàn thành trong **5 ngày**.

---

## 🗺️ Bản Đồ Tài Liệu (Documentation Map)

Toàn bộ hệ thống tài liệu được cập nhật đồng bộ theo kiến trúc mới: **Chạy Localhost • CSDL SQLite • Simple User Auth • Không Admin UI • Responsive Mobile & PC**:

| # | Tài Liệu | Nội Dung Cốt Lõi | Đối Tượng Quan Tâm |
|---|---|---|---|
| **00** | [**Master Project Overview**](./00_PROJECT_OVERVIEW.md) | Tổng quan hệ thống sau tinh giản, ý tưởng "Tinder for Food", kiến trúc 2 tầng cục bộ, giải đáp kiến trúc. | Toàn bộ Team, Khách xem |
| **01** | [**Project Charter & Scope**](./01_PROJECT_CHARTER_AND_SCOPE.md) | Phạm vi MVP 5 ngày, các hạng mục giữ lại và cắt giảm (bỏ deploy, bỏ admin), tiêu chí nghiệm thu (DoD). | Toàn bộ Team |
| **02** | [**System Architecture & Design**](./02_SYSTEM_ARCHITECTURE_AND_DESIGN.md) | Sơ đồ phân tầng FastAPI + SQLite, đặc tả RESTful API, vai trò tối giản của LocalStorage, thiết kế Responsive PC/Mobile. | Tech Lead, Backend, Frontend |
| **03** | [**User Flow & UI/UX Spec**](./03_USER_FLOW_AND_UIUX_SPEC.md) | Luồng người dùng, luồng đăng ký/đăng nhập đơn giản, thông số vật lý quẹt thẻ Framer Motion, quy chuẩn PC vs Mobile. | Frontend Devs, QA Tester |
| **04** | [**Team Roles & RACI Matrix**](./04_TEAM_ROLES_AND_RACI.md) | Phân chia công việc song song cho 4 vai trò, ma trận RACI độc lập không bị chặn (no blockers). | Toàn bộ thành viên |
| **05** | [**Git Workflow & Collab Rules**](./05_GIT_WORKFLOW_AND_COLLABORATION_RULES.md) | Quy tắc phân nhánh Git, Conventional Commits, quy trình mở Pull Request và review chéo. | Toàn bộ thành viên |
| **06** | [**Sprint Roadmap & TODO Per Role**](./06_SPRINT_ROADMAP_AND_TODO_PER_ROLE.md) | Lộ trình chi tiết từng ngày từ Ngày 1 đến Ngày 5, checklist cụ thể cho từng thành viên. | Toàn bộ thành viên |
| **07** | [**Data Schema, SQLite & Seeds**](./07_DATA_SCHEMA_AND_SEEDS.md) | Thiết kế CSDL SQLite DDL, bảng users, quy trình chuẩn bị data món ăn, file seed JSON và script Python `seed_sqlite.py`. | Backend, Data Specialist |

---

## ⚡ Tóm Tắt Nhanh Về Dự Án (Executive Summary)

- **Tên dự án:** YumYumPick ("Quẹt là măm - Không lăn tăn nghĩ món")
- **Ý tưởng cốt lõi:** Lấy cảm hứng từ cơ chế quẹt thẻ của Tinder. Người dùng nhấp (Tap) nhẹ vào thẻ để xem nhanh bảng **giới thiệu món ăn** (xuất xứ, calo, tóm tắt nguyên liệu), quẹt sang **Phải (Right / ❤️)** để chọn và lưu món vào CSDL SQLite để xem lại công thức và xuất danh sách đi chợ, hoặc quẹt sang **Trái (Left / ❌)** để bỏ qua.
- **Tech Stack Tinh Gọn:**
  - **Frontend:** React 18 (Vite), Tailwind CSS (Responsive PC/Mobile), Framer Motion (xử lý quẹt thẻ 60 FPS), Lucide React.
  - **Backend:** Python FastAPI, SQLAlchemy 2.0 ORM, Pydantic v2, Uvicorn server cục bộ.
  - **Database:** SQLite 3 (CSDL quan hệ lưu trong 1 file `yumyumpick.db`), quản lý trực tiếp bằng công cụ GUI **DB Browser for SQLite**.
  - **Client Storage:** `LocalStorage` chỉ đóng vai trò lưu phiên đăng nhập (`user_id`, `username`) để không bị mất khi F5 trang.
- **Quy mô đội ngũ:** 4 vai trò làm việc song song (Frontend Swipe Lead, Frontend Features Lead, Backend & SQLite Lead, Data & QA Specialist).
