# 📝 YumYumPick — Project TODO & Action Plan (5-Day Plan)

> Ứng dụng "Tinder For Food" — Random món ăn theo phong cách quẹt thẻ, giải cứu câu hỏi *"Hôm nay ăn gì?"*  
> **Phiên bản rút gọn hoàn thành trong 5 ngày:** Chạy Localhost • CSDL SQLite • Simple User Auth • Không Admin UI • Responsive Mobile & PC.

---

## 🎯 1. Feature Checklist (Danh Sách Tính Năng)

- [ ] **Giao diện quẹt thẻ món ăn (Tinder-style Swipe):**
  - Quẹt phải (👉 / ❤️): Chọn món, gọi API lưu món & công thức chi tiết vào tài khoản người dùng trên SQLite.
  - Quẹt trái (👈 / ❌): Bỏ qua món ăn và chuyển ngay sang món gợi ý tiếp theo.
  - Hỗ trợ cả thao tác cảm ứng vuốt (touch trên điện thoại) và kéo chuột hoặc phím tắt bàn phím (`←`, `→` trên PC).
  - Stamp hiệu ứng Like ("YUMMY") màu xanh và Skip ("NOPE") màu đỏ nổi bật khi kéo.

- [ ] **Phần Tap để xem giới thiệu món ăn (Dish Intro Drawer):**
  - Chạm nhẹ (Tap) vào thẻ hoặc bấm nút ℹ️:
    - Mở nhanh Bottom Sheet / Drawer hiển thị giới thiệu ngắn, xuất xứ văn hóa, lượng calo, thời gian nấu, độ cay.
    - Tóm tắt các nguyên liệu chính để người dùng cân nhắc trước khi quyết định quẹt.
    - Nút thao tác nhanh ngay trong drawer: Bỏ qua (❌) hoặc Chọn món (❤️).

- [ ] **Đăng Ký & Đăng Nhập Đơn Giản (Simple User Auth):**
  - Không cần email verification, OTP, quên mật khẩu phức tạp.
  - Đăng ký: Nhập `username`, `password`, `full_name` $\rightarrow$ tạo ngay bản ghi trong bảng `users` của SQLite.
  - Đăng nhập: Nhập `username`, `password` $\rightarrow$ xác thực khớp dữ liệu $\rightarrow$ trả về thông tin user.
  - Lưu phiên đăng nhập đơn giản vào `localStorage` (chỉ lưu `user_id` và `username`) để tải lại trang (F5) không bị mất session.
  - Nút Đăng xuất: Xóa key phiên khỏi `localStorage`.

- [ ] **Bộ Sưu Tập Món Đã Lưu & Xem Chi Tiết Công Thức (Saved Dishes & Full Recipe):**
  - Lưu trữ trực tiếp trên SQLite thông qua API `POST /api/v1/saved-dishes`.
  - Mở xem danh sách các món người dùng đã quẹt phải.
  - Xem chi tiết công thức nấu chuẩn:
    - Danh sách nguyên liệu kèm **checkbox tương tác** (tiện lợi khi kiểm tra đồ trong tủ lạnh hoặc đi chợ).
    - Hướng dẫn chế biến từng bước (Step 1, 2, 3...) rõ ràng.
    - Mẹo vặt từ đầu bếp (`tips`).
    - Nút bỏ lưu món ăn khỏi danh sách.

- [ ] **Tính Năng Xuất Danh Sách Đi Chợ Thông Minh (Smart Grocery List):**
  - Tự động gộp toàn bộ nguyên liệu từ các món đã lưu thành một danh sách mua sắm tập trung.
  - Nút sao chép 1 chạm (Copy to Clipboard) để gửi nhanh qua Zalo / Messenger.

- [ ] **Bộ Lọc Món Ăn Thông Minh (Smart Filters):**
  - Lọc theo nền ẩm thực / quốc gia: 🇻🇳 Việt Nam, 🇯🇵 Nhật Bản, 🇰🇷 Hàn Quốc, 🇹🇭 Thái Lan, 🇮🇹 Ý...
  - Lọc theo thời gian nấu: Dưới 20 phút, 20-45 phút, Mọi thời gian.
  - Lọc theo độ cay: Không cay, Cay nhẹ, Cay nhiều.

- [ ] **Giao Diện Responsive Toàn Diện (Mobile + PC):**
  - **Mobile:** Tràn viền (100vw), vuốt chạm ngón tay cái, drawer từ đáy lên.
  - **Desktop PC:** Khung thẻ căn giữa màn hình ($420\text{px} \times 600\text{px}$), hỗ trợ phím mũi tên bàn phím (`←` Skip, `→` Like, `Space` Info), bố cục 2 cột tiện theo dõi công thức.

- [ ] **Quản Lý Dữ Liệu Qua SQLite (Không Admin CMS):**
  - Quản lý thêm/sửa/xóa món ăn trực tiếp qua file `yumyumpick.db` bằng công cụ **DB Browser for SQLite** hoặc chạy script Python `seed_sqlite.py`.
  - Không cần xây dựng trang Admin UI, giảm bớt hàng chục API và form phức tạp.

---

## 🍲 2. Chuẩn Bị Dữ Liệu (Data Preparation Checklist)

- [x] **Quy chuẩn dữ liệu (Data Taxonomy & Schema):**
  - Đã định nghĩa file JSON chuẩn `backend/app/data/dishes_seed.json` gồm đầy đủ các trường: `id`, `name`, `english_name`, `cuisine`, `cook_time_minutes`, `prep_time_minutes`, `difficulty`, `spicy_level`, `calories_approx`, `image`, `short_description`, `ingredients` (name, amount, unit, category), `steps` (step_number, title, description), `tips`.
- [x] **Thu thập & Chuẩn hóa dữ liệu 45 món ăn hoàn chỉnh (100% Sẵn Sàng):**
  - [x] 15 món Việt Nam (Phở bò, Cơm tấm, Bún chả, Bánh mì chảo, Bún bò Huế, Gỏi cuốn, Canh chua, Bánh xèo, Bò kho, Chả giò, Cá kho tộ, Cơm chiên Dương Châu, Hủ tiếu Nam Vang, Bún riêu, Gà kho gừng).
  - [x] 8 món Hàn Quốc (Bibimbap, Canh kim chi, Tokbokki, Thịt bò Bulgogi, Miến xào Japchae, Gà sốt cay Yangnyeom, Canh rong biển Miyeok-guk, Trứng hấp Gyeran-jjim).
  - [x] 8 món Nhật Bản (Mì Ramen xá xíu, Cơm cà ri bò, Cơm bò Gyudon, Mì Udon bò, Trứng cuộn Tamagoyaki, Cơm lươn Unadon, Bánh xèo Okonomiyaki, Gà chiên Karaage).
  - [x] 7 món Thái Lan (Pad Thai, Tom Yum Goong, Heo xào Pad Krapow, Gỏi đu đủ Som Tum, Cà ri xanh gà, Cơm chiên trái thơm, Súp gà Tom Kha Gai).
  - [x] 7 món Âu / Ý (Mì Ý Bolognese, Carbonara, Pizza Margherita, Beefsteak sốt tiêu, Salad cá ngừ, Súp bí đỏ kem tươi, Mì Ý hải sản Pescatora).
- [x] **Bộ công cụ tự động hóa & Kiểm tra dữ liệu:**
  - [x] Script `backend/app/db/validate_data.py`: Kiểm tra 45/45 món hợp lệ 100%, 227 nguyên liệu, 135 bước chế biến.
  - [x] Script `backend/app/db/seed_sqlite.py`: Tự động tạo bảng từ `schema.sql` và nạp toàn bộ 45 món ăn vào file `backend/yumyumpick.db` cùng tài khoản test (`demo` / `123`).
  - [x] File CSDL `backend/yumyumpick.db` đã được khởi tạo và sẵn sàng sử dụng ngay!

---

## 📅 3. Kế Hoạch Triển Khai 5 Ngày (Parallel 5-Day Sprint)

```
       NGÀY 1                  NGÀY 2                  NGÀY 3                  NGÀY 4                  NGÀY 5
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Setup & Schema  │    │ Parallel Coding  │    │  API Integration │    │ Recipe & Grocery │    │  Testing & Demo  │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│• Chốt Contract   │    │• BE: Auth & Dish │    │• Ghép nối FE-BE  │    │• Danh sách món   │    │• Test chéo PC/Mob│
│• SQLite DDL      │    │• FE1: Swipe Deck │    │• Quẹt lưu SQLite │    │  đã lưu & Checkbox│• Fix bug & Polish│
│• Khởi tạo FE, BE │    │• FE2: Auth/Filter│    │• Drawer Giới thiệ│    │• Smart Grocery   │    │• Slide & Kịch bản│
│• Nạp 10 món mẫu  │    │• DATA: 40 món    │    │• Test Responsive │    │• Kiểm thử luồng  │    │  Demo            │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Ngày 1: Setup Môi Trường & Chốt API Contract
- [ ] **Cả team:** Thống nhất API Contract (JSON format các endpoint).
- [ ] **Backend Lead:** Khởi tạo FastAPI + SQLAlchemy kết nối file SQLite `yumyumpick.db`. Tạo bảng theo DDL schema.
- [ ] **Frontend 1 & 2:** Khởi tạo project React (Vite + Tailwind CSS + Framer Motion).
- [ ] **Data Lead:** Soạn thảo 10 món ăn mẫu đầu tiên vào file `dishes_seed.json`.

### Ngày 2: Code Song Song Độc Lập
- [ ] **Backend Lead:**
  - [ ] Viết API `POST /api/v1/auth/signup` và `POST /api/v1/auth/login`.
  - [ ] Viết API `GET /api/v1/dishes/random` (hỗ trợ lọc theo cuisine, max_time, spicy_level).
- [ ] **Frontend 1 (Swipe Engine):**
  - [ ] Xây dựng `SwipeCard.jsx` và `CardStack.jsx` bằng Framer Motion.
  - [ ] Xử lý kéo thả quẹt trái/phải, hiển thị Stamp Like/Skip.
  - [ ] Bắt sự kiện phím mũi tên PC (`←`, `→`).
- [ ] **Frontend 2 (Modals & Auth UI):**
  - [ ] Xây dựng `AuthModal.jsx` (Form Đăng nhập / Đăng ký đơn giản).
  - [ ] Xây dựng `FilterModal.jsx` (Bộ lọc ẩm thực, thời gian, độ cay).
- [ ] **Data Lead:** Thu thập đủ 40 món ăn hoàn chỉnh còn lại.

### Ngày 3: Tích Hợp API & Hoàn Thiện Responsive
- [ ] **Frontend 1 + Backend:** Kết nối API lấy danh sách thẻ ngẫu nhiên và gọi API `POST /api/v1/saved-dishes` khi quẹt phải.
- [ ] **Frontend 2:** Xây dựng `DishIntroDrawer.jsx` (tap thẻ mở xem giới thiệu, xuất xứ, calo, nguyên liệu).
- [ ] **Frontend 1 + 2:** Kiểm tra và tinh chỉnh Responsive: Mobile full viền vuốt mượt, Desktop PC thẻ căn giữa kèm phím tắt.
- [ ] **Data Lead:** Viết script `seed_sqlite.py` nạp toàn bộ 40-50 món vào SQLite.

### Ngày 4: Công Thức Chi Tiết & Danh Sách Đi Chợ
- [ ] **Frontend 2 + Backend:**
  - [ ] Xây dựng màn hình/modal `SavedDishesModal.jsx` hiển thị danh sách món đã lưu từ SQLite.
  - [ ] Component `FullRecipeView.jsx`: Hiển thị chi tiết nguyên liệu có checkbox tích chọn, các bước nấu 1-2-3 và mẹo đầu bếp.
  - [ ] Chức năng `Smart Grocery List`: Tự động gộp nguyên liệu của các món đã chọn, nút Copy to Clipboard gửi Zalo.
- [ ] **Backend Lead:** Viết API `GET /api/v1/saved-dishes/{user_id}` và `DELETE /api/v1/saved-dishes/{dish_id}`.
- [ ] **Data Lead:** Hỗ trợ kiểm thử, kiểm tra ảnh hiển thị đúng tỉ lệ, nội dung không bị lỗi font.

### Ngày 5: Kiểm Thử Toàn Diện, Tối Ưu & Demo
- [ ] **Cả team:** Chạy kiểm thử End-to-End:
  - Đăng ký user mới $\rightarrow$ Đăng nhập $\rightarrow$ Đổi bộ lọc $\rightarrow$ Quẹt thẻ $\rightarrow$ Xem giới thiệu $\rightarrow$ Lưu món $\rightarrow$ Xem công thức $\rightarrow$ Tích checkbox đi chợ $\rightarrow$ Copy danh sách.
- [ ] Kiểm thử Responsive trên điện thoại thật (kết nối cùng Wi-Fi qua địa chỉ IP LAN).
- [ ] Sửa các lỗi vụn vặt về layout và animation.
- [ ] Chuẩn bị kịch bản trình chiếu demo 5 phút.

---

## 👥 4. Phân Chia Vai Trò Song Song (4 Vị Trí)

1. **Member 1 (Frontend Swipe & Layout Lead):** Chịu trách nhiệm bộ quẹt thẻ Framer Motion, stamp, phím tắt PC, bố cục Responsive PC và Mobile.
2. **Member 2 (Frontend Features & Auth Dev):** Chịu trách nhiệm Form Đăng ký/Đăng nhập, Modal Lọc, Drawer giới thiệu món, Màn hình công thức & xuất danh sách đi chợ.
3. **Member 3 (Backend & SQLite Engineer):** Chịu trách nhiệm FastAPI, CSDL SQLite, API Auth đơn giản, API món ăn, API món đã lưu.
4. **Member 4 (Data Specialist & QA Tester):** Chịu trách nhiệm biên tập 40-50 món ăn JSON, ảnh Unsplash, script seed SQLite, kiểm thử tính năng trên PC và Mobile.