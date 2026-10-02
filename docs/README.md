# YumYumPick — Trung Tâm Tài Liệu Kỹ Thuật

Chào mừng bạn đến với kho tài liệu chuẩn kỹ thuật của **YumYumPick** — Nền tảng gợi ý món ăn thông minh theo cơ chế quẹt thẻ (Tinder for Food).

---

## 1. Bản Đồ Hệ Thống Tài Liệu (Master Documentation Map)

Hệ thống tài liệu bao gồm **15 chuyên đề chuẩn mực**, phân tách rõ ràng từ khâu lập kế hoạch, đặc tả kiến trúc, giải phẫu chi tiết 100% mã nguồn từng tầng cho đến đánh giá hệ thống và lộ trình mở rộng quy mô:

| Mã Số | Tài Liệu Chuyên Đề | Nội Dung Trọng Tâm | Đối Tượng Quan Tâm |
|:---:|:---|:---|:---|
| **00** | [**Master Project Overview**](./00_PROJECT_OVERVIEW.md) | Tổng quan hệ thống, ý tưởng "Tinder for Food", kiến trúc 2 tầng cục bộ, giải đáp lý do ra đời. | Toàn bộ Team, Khách xem |
| **01** | [**Project Charter & Scope**](./01_PROJECT_CHARTER_AND_SCOPE.md) | Phạm vi dự án, các tính năng giữ lại và lược bỏ, tiêu chuẩn nghiệm thu (DoD - Definition of Done). | Toàn bộ Team |
| **02** | [**System Architecture & Design**](./02_SYSTEM_ARCHITECTURE_AND_DESIGN.md) | Sơ đồ phân tầng FastAPI + SQLite, đặc tả RESTful API, thiết kế Responsive PC vs Mobile. | Tech Lead, Backend, Frontend |
| **03** | [**User Flow & UI/UX Spec**](./03_USER_FLOW_AND_UIUX_SPEC.md) | Luồng người dùng, luồng đăng nhập bắt buộc, thông số cử chỉ vật lý quẹt thẻ Framer Motion. | Frontend Devs, QA Tester |
| **04** | [**Team Roles & RACI Matrix**](./04_TEAM_ROLES_AND_RACI.md) | Phân chia công việc song song cho 6 thành viên, ma trận trách nhiệm RACI không bị tắc nghẽn. | Toàn bộ thành viên |
| **05** | [**Git Workflow & Collab Rules**](./05_GIT_WORKFLOW_AND_COLLABORATION_RULES.md) | Quy tắc phân nhánh Git, Conventional Commits, quy trình mở Pull Request và review chéo mã nguồn. | Toàn bộ thành viên |
| **06** | [**Sprint Roadmap & TODO Per Role**](./06_SPRINT_ROADMAP_AND_TODO_PER_ROLE.md) | Lộ trình chi tiết từng ngày, checklist công việc độc lập cho từng thành viên trong nhóm. | Toàn bộ thành viên |
| **07** | [**Data Schema, SQLite & Seeds**](./07_DATA_SCHEMA_AND_SEEDS.md) | Thiết kế CSDL SQLite DDL, bảng users, danh mục món ăn và kho lưu trữ ảnh cục bộ offline. | Backend, Data Specialist |
| **08** | [**Core Features Specification**](./08_CORE_FEATURES_SPEC.md) | Đặc tả 3 tính năng cốt lõi: Quẹt Tinder, Lọc đa tiêu chí, Món đã thích & Chi tiết công thức nấu. | Toàn bộ Team |
| **09** | [**Technical Architecture Deep-Dive**](./09_TECHNICAL_ARCHITECTURE_DEEP_DIVE.md) | **Phân tích kiến trúc chuyên sâu: Clean Architecture 3 lớp, SQLite WAL Mode, Framer Motion Physics, Thuật toán 7 ngày.** | **Tech Lead, Backend, Frontend** |
| **10** | [**Code Deep-Dive Backend (Line-by-Line)**](./10_LINE_BY_LINE_CODE_BACKEND.md) | **Giải phẫu chi tiết 100% từng dòng code & từng function Backend: database.py, models.py, repos, services, api routers.** | **Backend Engineers, Architect** |
| **11** | [**Code Deep-Dive Frontend (Line-by-Line)**](./11_LINE_BY_LINE_CODE_FRONTEND.md) | **Giải phẫu chi tiết 100% từng dòng code & từng function Frontend: App.jsx, CardStack, SwipeCard, DishDetailModal, api.js.** | **Frontend Engineers, UI/UX** |
| **12** | [**System Evaluation & Scalability Roadmap**](./12_SYSTEM_EVALUATION_AND_SCALABILITY_ROADMAP.md) | **Đánh giá hệ thống SWOT, phân tích đánh đổi kỹ thuật (Trade-offs) và lộ trình mở rộng quy mô (PostgreSQL, Redis, Docker).** | **Tech Lead, Architect** |
| **13** | [**Comprehensive System Architecture, Code & Flows**](./13_COMPREHENSIVE_SYSTEM_ARCHITECTURE_CODE_AND_FLOWS.md) | **Tài liệu tối cao tổng hợp toàn diện: Sơ đồ kiến trúc, giải thích toàn bộ code Backend & Frontend, 8 luồng E2E & cạm bẫy.** | **Toàn bộ Team, Hội đồng phản biện** |
| **Guide** | [**Codebase Reading Guide**](./CODEBASE_READING_GUIDE.md) | **Cẩm nang hướng dẫn đọc hiểu toàn bộ mã nguồn cho người mới: lộ trình 5 bước, kiến trúc, luồng E2E & cạm bẫy.** | **Newcomers, Onboarding Devs** |

---

## 2. Tóm Tắt Nhanh Về Dự Án (Executive Summary)

- **Tên dự án:** YumYumPick (*"Quẹt là măm – Không lăn tăn nghĩ món"*)
- **Ý tưởng cốt lõi:** Lấy cảm hứng từ cơ chế tương tác trực quan của Tinder để xóa bỏ hội chứng **Tê liệt phân tích (Analysis Paralysis)** trong việc lựa chọn món ăn hàng ngày:
  1. **Landing Page Nhận Diện Thương Hiệu:** Giới thiệu định vị sản phẩm, Showcase 7 quốc gia, Collage ảnh nền động, bấm logo ở bất kỳ đâu đều quay về trang chủ.
  2. **Bắt Buộc Đăng Nhập:** Khách vào trang web bấm khám phá sẽ được yêu cầu đăng nhập để cá nhân hóa danh sách món và lưu vết lịch sử trên CSDL.
  3. **Quẹt Thẻ Tinder 60 FPS:** Ngăn xếp ảo hóa 3 thẻ (Stack Windowing), kéo thả theo góc nghiêng vật lý thực tế `rotate = x / 15`, phím tắt PC `[←]` Skip, `[→]` Like.
  4. **Nạp Thẻ Ngầm Vô Tận (Infinite Prefetching):** Khi số thẻ còn lại $\le 3$, hệ thống tự động tải thêm mẻ 10 món tiếp theo, đảm bảo quẹt liên tục không gián đoạn.
  5. **Lọc Đa Chiều:** Lọc theo 15 quốc gia, 4 cấp độ cay, 4 mốc thời gian nấu, 3 mức độ khó.
  6. **Khử Trùng Lặp 7 Ngày:** Thuật toán Rolling Window TTL lưu trên SQLite (`user_skipped_dishes` và `user_saved_dishes`) ngăn không cho món đã quẹt xuất hiện lại trong vòng 1 tuần, đồng bộ trên mọi thiết bị.
  7. **Chi Tiết Công Thức Chuẩn Bản Xứ:** Danh sách nguyên liệu có Checkbox tương tác kèm thanh tiến độ chuẩn bị (Progress Bar %) + 5 bước nấu chuẩn ẩm thực + bí quyết riêng từ đầu bếp.
- **Dữ Liệu Đỉnh Cao (100% Real Food & Offline):**
  - **1.100 món ăn** thuộc 15 nền văn hóa ẩm thực thế giới.
  - **1.100 tệp ảnh JPG thực tế** lưu trực tiếp tại [`backend/images/dishes/`](../backend/images/dishes) (0% ảnh AI render, 0% ảnh stock giả lập).
  - Tích hợp lớp `CachedStaticFiles` với header `Cache-Control: public, max-age=86400`, tải ảnh tức thì từ disk cache trình duyệt với mã 304 Not Modified.
- **Tech Stack Tinh Gọn & Hiện Đại:**
  - **Frontend:** React 19 (Vite 8), Tailwind CSS v4, Framer Motion 13, Lucide React Icons.
  - **Backend:** Python FastAPI, SQLAlchemy 2.0 ORM Typed Mappings, Pydantic v2, SQLite WAL Mode (Write-Ahead Logging).
  - **Cơ sở dữ liệu:** SQLite 3 ([`backend/yumyumpick.db`](../backend/yumyumpick.db) ~7.6 MB) với chỉ mục B-Tree và quan hệ ràng buộc toàn vẹn.
