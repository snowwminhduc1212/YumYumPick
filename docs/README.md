# 📚 YumYumPick — Trung Tâm Tài Liệu Dự Án (Documentation Hub)

Chào mừng bạn đến với kho tài liệu chuẩn kỹ thuật và quy trình vận hành của **YumYumPick** — Nền tảng gợi ý món ăn ngẫu nhiên theo cơ chế quẹt thẻ (Tinder for Food) được thiết kế cho đội ngũ 6 thành viên phát triển chuyên nghiệp.

---

## 🗺️ Bản Đồ Tài Liệu (Documentation Map)

Hệ thống tài liệu được phân tách theo các tiêu chuẩn công nghiệp (Software Engineering Best Practices) giúp các thành viên dễ dàng tra cứu, định hướng và cộng tác:

| # | Tài Liệu | Nội Dung Chính | Đối Tượng Quan Tâm |
|---|---|---|---|
| **01** | [**Project Charter & Scope**](./01_PROJECT_CHARTER_AND_SCOPE.md) | Tầm nhìn, bài toán thực tế, phạm vi MVP & tính năng tương lai, tiêu chí thành công (KPIs). | Toàn bộ Team, PO/Lead |
| **02** | [**System Architecture & Design**](./02_SYSTEM_ARCHITECTURE_AND_DESIGN.md) | Kiến trúc hệ thống, Tech Stack (React + FastAPI), RESTful API spec, Data flow, LocalStorage sync. | Tech Lead, BE, FE, DevOps |
| **03** | [**User Flow & UI/UX Spec**](./03_USER_FLOW_AND_UIUX_SPEC.md) | Trải nghiệm người dùng, cơ chế quẹt thẻ (Tinder swipe), bộ lọc, xem chi tiết công thức, responsive. | Frontend Devs, UI/UX, QA |
| **04** | [**Team Roles & RACI Matrix**](./04_TEAM_ROLES_AND_RACI.md) | Phân chia trách nhiệm chi tiết cho 6 vị trí, ma trận trách nhiệm RACI rõ ràng, chuẩn công ty công nghệ. | Toàn bộ 6 thành viên |
| **05** | [**Git Workflow & Collab Rules**](./05_GIT_WORKFLOW_AND_COLLABORATION_RULES.md) | Chiến lược nhánh (Git Flow), Conventional Commits, quy tắc Pull Request, review chéo & giải quyết conflict. | Toàn bộ 6 thành viên |
| **06** | [**Sprint Roadmap & TODO Per Role**](./06_SPRINT_ROADMAP_AND_TODO_PER_ROLE.md) | Kế hoạch các Sprint (0 → 3), danh sách TODO cụ thể cho từng cá nhân, Definition of Done (DoD). | Toàn bộ 6 thành viên, PM/Lead |
| **07** | [**Data Schema & Food Seeds**](./07_DATA_SCHEMA_AND_SEEDS.md) | Cấu trúc dữ liệu JSON món ăn, hướng dẫn thu thập hình ảnh, công thức mẫu đa quốc gia (VN, JP, KR, TH, IT). | Backend, Data Collector |

---

## ⚡ Tóm Tắt Nhanh Về Dự Án (Quick Executive Summary)

- **Tên dự án:** YumYumPick ("Quẹt là măm - Không lăn tăn nghĩ món")
- **Ý tưởng cốt lõi:** Lấy cảm hứng từ cơ chế quẹt thẻ tương tác của Tinder. Người dùng nhấp (Tap) nhẹ vào thẻ để xem nhanh bảng **giới thiệu món ăn** (xuất xứ, hương vị, calo, tóm tắt nguyên liệu), quẹt sang **Phải (Right / ❤️)** để chọn và tự động lưu toàn bộ công thức chi tiết vào `LocalStorage` để xem lại cách nấu và danh sách đi chợ sau khi đã quẹt xong, hoặc quẹt sang **Trái (Left / ❌)** để bỏ qua và nhận gợi ý tiếp theo.
- **Tech Stack:**
  - **Frontend:** React (Vite / Next.js), Tailwind CSS, Framer Motion (xử lý vật lý quẹt thẻ), Lucide Icons.
  - **Backend:** Python FastAPI, Pydantic, Uvicorn.
  - **Storage:** Client-side LocalStorage (quản lý món đã lưu, lịch sử không cần đăng nhập phức tạp) + Static/JSON Data & SQLite trên FastAPI.
  - **Deployment:** Vercel (Frontend & Serverless API / Proxy) hoặc kết hợp Render/Railway cho FastAPI.
- **Quy mô đội ngũ:** 6 kỹ sư phần mềm (Tech Lead/Fullstack, 2 Frontend, 2 Backend/Data, 1 DevOps/QA).

---

## 🚀 Nguyên Tắc Làm Việc Nhóm "Professional Company Standard"

1. **Giao tiếp minh bạch & chủ động (Transparent & Async Communication):**
   - Mọi thảo luận về tính năng hoặc kiến trúc đều được ghi lại trên GitHub Issues hoặc Pull Request.
   - Tránh "làm ngầm" mà không đồng bộ với đồng đội.
2. **Không commit trực tiếp vào `main` hoặc `develop`:**
   - 100% code phải đi qua `feature/*` hoặc `fix/*` branch và mở Pull Request.
   - Ít nhất 1 phê duyệt (Approve) từ thành viên khác trước khi Merge.
3. **Tuân thủ quy chuẩn Code & Commit:**
   - Commit messages theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/).
   - Format code trước khi commit (Prettier/ESLint cho React, Black/Ruff cho Python).
4. **Definition of Done (DoD):**
   - Tính năng chỉ được coi là hoàn thành khi đã test chạy ổn định, responsive trên mobile/pc, không có console log thừa, và tài liệu liên quan được cập nhật.
