# 📝 YumYumPick — Project TODO & Requirements

> Ứng dụng "Tinder For Food" — Random món ăn hộ bạn, giải cứu câu hỏi kinh điển *"Hôm nay ăn gì?"*

---

## 🎯 Feature Checklist (Danh Sách Tính Năng)

- [ ] **Giao diện quẹt thẻ món ăn (Tinder-style Swipe):**
  - Quẹt phải (👉 / ❤️): Chọn món, tự động lưu món & toàn bộ công thức chi tiết vào bộ sưu tập.
  - Quẹt trái (👈 / ❌): Bỏ qua món ăn và chuyển ngay sang món gợi ý tiếp theo.
  - Hỗ trợ cả thao tác cảm ứng vuốt (touch) và nút bấm vật lý (Skip, Like, Undo).

- [ ] **Phần Tap để xem giới thiệu món ăn (Dish Intro Preview):**
  - Nhấp nhẹ (Tap / Click) trực tiếp vào thẻ món ăn hoặc nút ℹ️:
    - Mở nhanh Bottom Sheet / Modal giới thiệu tổng quan món ăn.
    - Xem câu chuyện, nguồn gốc ẩm thực, vùng miền, độ cay, lượng calo ước tính, thời gian chế biến.
    - Tóm tắt các nguyên liệu chủ đạo giúp người dùng cân nhắc trước khi quyết định quẹt.
    - Hỗ trợ nút thao tác nhanh: Bỏ qua (❌) hoặc Chọn & Lưu món (❤️) ngay trong Drawer.

- [ ] **Save công thức, món ăn để xem chi tiết sau khi đã quẹt:**
  - Khi quẹt phải: Toàn bộ thông tin món ăn kèm **công thức nấu chi tiết** được lưu trữ an toàn vào `LocalStorage` (`YYP_SAVED_DISHES`).
  - Dữ liệu được bảo toàn khi reload trang hoặc khi người dùng offline.

- [ ] **Xem chi tiết & Lịch sử món đã chọn (Saved Collection & Full Recipe Viewer):**
  - Bấm icon Bộ sưu tập trên Navbar để xem danh sách các món đã quẹt phải.
  - Bấm vào bất kỳ món nào đã lưu để mở xem **Công thức nấu chi tiết đầy đủ**:
    - Danh sách nguyên liệu kèm checkbox tương tác (tiện lợi khi kiểm tra đồ trong tủ lạnh hoặc đi chợ).
    - Hướng dẫn chế biến từng bước (Step-by-step: Sơ chế $\rightarrow$ Nấu $\rightarrow$ Trình bày) có căn thời gian cụ thể.
    - Mẹo vặt và bí quyết đầu bếp (Chef's Tips).
    - Quản lý trạng thái: Đánh dấu đã nấu xong hoặc bỏ lưu.

- [ ] **Tính năng Xuất Danh Sách Đi Chợ (Smart Grocery List):**
  - Tự động tổng hợp nguyên liệu của các món đã chọn thành một danh sách đi chợ hoàn chỉnh.
  - Nút sao chép (Copy to Clipboard) để gửi nhanh qua Zalo / Messenger.

- [ ] **Bộ lọc món ăn thông minh (Smart Filters):**
  - Lọc theo nền ẩm thực / quốc gia: 🇻🇳 Việt Nam, 🇯🇵 Nhật Bản, 🇰🇷 Hàn Quốc, 🇹🇭 Thái Lan, 🇮🇹 Ý...
  - Lọc theo bữa ăn: Sáng, Trưa, Tối, Ăn vặt.
  - Lọc theo thời gian nấu: Dưới 20 phút, 20-45 phút, Mọi thời gian.
  - Lọc theo khẩu vị: Cay / Không cay, Ăn chay (Vegetarian).

- [ ] **Responsive Web Design:**
  - Hoạt động mượt mà trên cả Mobile Web (giao diện thẻ toàn màn hình) và Desktop PC.

---

## 🍲 Data Curation (Dữ Liệu Món Ăn)

- [ ] Thu thập 60+ món ăn phổ biến, bình dân và nổi tiếng từ các nền ẩm thực hàng đầu (Việt Nam, Hàn Quốc, Nhật Bản, Thái Lan, Ý...).
- [ ] Định dạng dữ liệu chuẩn JSON gồm: ID, tên tiếng Việt/Anh, ảnh WebP sắc nét, `short_description` (dành cho phần tap giới thiệu), `ingredients` (định lượng, đơn vị, phân loại), `steps` (hướng dẫn chi tiết), và `tips`.

---

## 🛠️ Tech Stack & Deployment

- **Frontend:** React (Vite) + Framer Motion (cử chỉ vuốt/tap) + Tailwind CSS + Lucide Icons.
- **Backend:** Python FastAPI + Pydantic v2 + Uvicorn.
- **Client Storage:** `LocalStorage` (lưu trữ danh sách món đã quẹt & công thức chi tiết offline).
- **Deployment:** Vercel (Frontend & CDN), Render / Railway (Backend FastAPI).

---

## 👥 Team Structure (6 Thành Viên)

1. **Member 1 (Tech Lead & Coordinator):** Quản lý Git, review code, điều phối tiến độ.
2. **Member 2 (Frontend Lead):** Xây dựng Swipe Deck bằng Framer Motion, xử lý cử chỉ Tap xem giới thiệu vs Drag quẹt thẻ.
3. **Member 3 (Frontend Dev):** Phát triển Modal lọc, Drawer giới thiệu & công thức chi tiết, lưu trữ LocalStorage, xuất danh sách đi chợ.
4. **Member 4 (Backend Lead):** Xây dựng FastAPI server, Pydantic schemas, thuật toán random & bộ lọc món ăn.
5. **Member 5 (Data & Content Specialist):** Thu thập 60+ món ăn, công thức chuẩn, ảnh WebP tối ưu.
6. **Member 6 (DevOps & QA):** Cấu hình CI/CD Vercel, viết Postman collection, kiểm thử chéo trình duyệt & mobile.