# YumYumPick — Project TODO & Action Plan (5-Day Plan)

> Ứng dụng "Tinder For Food" — Random món ăn theo phong cách quẹt thẻ, giải cứu câu hỏi *"Hôm nay ăn gì?"*  
> **Phiên bản rút gọn hoàn thành trong 5 ngày:** Chạy Localhost • CSDL SQLite • Simple User Auth • Không Admin UI • Responsive Mobile & PC.

---

## 1. Feature Checklist (Danh Sách Tính Năng)

- [x] **Giao diện quẹt thẻ món ăn trực quan (Tinder-style Swipe with Intro):**
  - **Mặt thẻ tích hợp đầy đủ thông tin:** Ảnh món lớn sắc nét, tên món (Việt & Anh), huy hiệu thông số (thời gian, calo, độ cay, quốc gia) và **đoạn mô tả giới thiệu (description intro / `short_description`)** giúp người dùng hiểu ngay hương vị đặc trưng để quyết định quẹt trái hay quẹt phải.
  - Quẹt phải (LIKE): Thích món, gọi API lưu món vào CSDL SQLite cho tài khoản người dùng.
  - Quẹt trái (SKIP): Bỏ qua món ăn và chuyển ngay sang món gợi ý tiếp theo.
  - Hỗ trợ cả thao tác cảm ứng vuốt (touch trên điện thoại) và kéo chuột hoặc phím tắt bàn phím (`←`, `→` trên PC).
  - Stamp hiệu ứng Like ("YUMMY") màu xanh và Skip ("NOPE") màu đỏ nổi bật khi kéo.
  - Cụm nút bấm trợ năng: Nút Bỏ qua (SKIP) và Nút Thích (LIKE).

- [x] **Đăng Ký & Đăng Nhập Đơn Giản (Simple User Auth):**
  - Không cần email verification, OTP, quên mật khẩu phức tạp.
  - Đăng ký: Nhập `username`, `password`, `full_name` $\rightarrow$ tạo ngay bản ghi trong bảng `users` của SQLite.
  - Đăng nhập: Nhập `username`, `password` $\rightarrow$ xác thực khớp dữ liệu $\rightarrow$ trả về thông tin user.
  - Lưu phiên đăng nhập đơn giản vào `localStorage` (chỉ lưu `user_id` và `username`) để tải lại trang (F5) không bị mất session.
  - Nút Đăng xuất: Xóa key phiên khỏi `localStorage`.

- [x] **Bộ Sưu Tập Món Đã Lưu & Xem Chi Tiết Công Thức (Liked Dishes & Details):**
  - Vào phần đã quẹt chỉ để xem chi tiết công thức nấu ăn của các món đã chọn.
  - Lưu trữ trực tiếp trên SQLite thông qua API `POST /api/v1/saved-dishes/{user_id}` và xóa qua `DELETE /api/v1/saved-dishes/{user_id}/{dish_id}`.
  - Mở xem danh sách các món người dùng đã quẹt phải (kèm nút xóa/bỏ thích, badge số lượng tự động cập nhật).
  - Bấm vào món để mở màn hình xem chi tiết công thức (giao diện 2 cột Limón Brasserie responsive):
    - **Danh sách nguyên liệu có Checkbox tương tác:** Mỗi nguyên liệu có ô checkbox `[ ]` để tích chọn đánh dấu đã chuẩn bị/đã có khi nấu ăn (thanh tiến độ % động).
    - Hướng dẫn chế biến chuẩn 3 bước (Sơ chế $\rightarrow$ Nấu $\rightarrow$ Trình bày).
    - Khung mẹo vặt từ đầu bếp (`tips`).
    - Cơ chế fallback ảnh 2 tầng (ảnh offline SQLite $\rightarrow$ Unsplash online $\rightarrow$ banner placeholder Limón).

- [x] **Bộ Lọc Món Ăn Nhanh (Quick Filters):**
  - Lọc theo nền ẩm thực / quốc gia: Việt Nam, Nhật Bản, Hàn Quốc, Thái Lan, Ý...
  - Lọc theo thời gian nấu: Dưới 20 phút, Kỳ công (>= 20 phút), Tất cả.
  - Lọc theo độ cay: Không cay, Có cay (Cấp 1-3), Tất cả.

- [x] **Giao Diện Responsive Toàn Diện (Mobile + PC):**
  - **Mobile:** Tràn viền (100vw), vuốt chạm ngón tay cái mượt mà.
  - **Desktop PC:** Khung thẻ căn giữa màn hình ($420\text{px} \times 600\text{px}$), hỗ trợ phím mũi tên bàn phím (`←` Skip, `→` Like).

- [x] **Quản Lý Dữ Liệu Qua SQLite (Không Admin CMS):**
  - Quản lý thêm/sửa/xóa món ăn trực tiếp qua file `yumyumpick.db` bằng công cụ **DB Browser for SQLite** hoặc chạy script Python `seed_sqlite.py`.
  - Không cần xây dựng trang Admin UI, giảm bớt hàng chục API và form phức tạp.

---

## 2. Chuẩn Bị Dữ Liệu (Data Preparation Checklist)

- [x] **Quy chuẩn dữ liệu (Data Taxonomy & Schema):**
  - Đã định nghĩa file JSON chuẩn `backend/app/data/dishes_seed.json` gồm đầy đủ các trường: `id`, `name`, `english_name`, `cuisine`, `cook_time_minutes`, `prep_time_minutes`, `difficulty`, `spicy_level`, `calories_approx`, `image`, `short_description`, `ingredients` (name, amount, unit, category), `steps` (step_number, title, description), `tips`.
- [x] **Thu thập & Chuẩn hóa dữ liệu 100 món ăn hoàn chỉnh kèm ảnh (100% Sẵn Sàng):**
  - [x] **30 món Việt Nam:** Phở bò, Cơm tấm sườn bì chả, Bún chả, Bánh mì chảo, Bún bò Huế, Gỏi cuốn, Canh chua cá lóc, Bánh xèo, Bò kho, Chả giò, Cá kho tộ, Cơm chiên Dương Châu, Hủ tiếu Nam Vang, Bún riêu, Gà kho gừng, Bánh cuốn nóng, Mì Quảng, Bún đậu mắm tôm, Thịt kho tàu hột vịt, Canh khổ qua nhồi thịt, Sườn xào chua ngọt, Bánh canh cua, Lẩu Thái hải sản, Bánh canh chả cá Nha Trang, Nem nướng Nha Trang, Cháo sườn quẩy giòn, Bò lúc lắc, Cơm gà Hội An, Vịt nấu chao, Xôi xéo ruốc gà.
  - [x] **20 món Hàn Quốc:** Cơm trộn Bibimbap, Canh kim chi, Tokbokki, Bò Bulgogi, Miến xào Japchae, Gà sốt cay Yangnyeom, Canh rong biển, Trứng hấp thố, Thịt nướng Samgyeopsal, Mì tương đen Jajangmyeon, Mì cay Jjamppong, Canh sườn bò Galbitang, Bánh xèo kim chi, Canh đậu non Sundubu, Cơm cuộn Kimbap, Gà hầm sâm Samgyetang, Lẩu quân đội Budae Jjigae, Chả cá xiên Eomuk, Cơm chiên kim chi, Mì lạnh Naengmyeon.
  - [x] **18 món Nhật Bản:** Mì Ramen xá xíu, Cơm cà ri bò, Cơm bò Gyudon, Mì Udon bò Teriyaki, Trứng cuộn Tamagoyaki, Cơm lươn Unadon, Bánh xèo Okonomiyaki, Gà chiên Karaage, Thịt heo chiên xù Tonkatsu, Cơm gà trứng Oyakodon, Sushi cá hồi bơ, Mì Soba lạnh, Bánh bạch tuộc Takoyaki, Mì Udon nước Niku Udon, Há cảo Gyoza, Tôm chiên xù Tempura, Súp Miso đậu hũ, Bò nướng Teriyaki.
  - [x] **16 món Thái Lan:** Pad Thai tôm, Tom Yum Goong, Heo băm Pad Krapow, Gỏi đu đủ Som Tum, Cà ri xanh gà, Cơm chiên trái thơm, Súp gà Tom Kha Gai, Xôi xoài cốt dừa, Cà ri đỏ vịt quay, Cà ri Massaman bò, Mì cà ri giòn Khao Soi, Cá chẽm hấp chanh ớt, Gỏi miến Yum Woon Sen, Thịt xiên nướng Moo Ping, Cua xào cà ri trứng, Canh sườn cay núi lửa Laeng Saeb.
  - [x] **16 món Ý / Âu:** Mì Ý Bolognese, Carbonara, Pizza Margherita, Beefsteak sốt tiêu, Salad cá ngừ, Súp bí đỏ kem tươi, Mì Ý hải sản Pescatora, Pizza hải sản sốt Pesto, Cơm Ý Risotto nấm Truffle, Mì ống cay Arrabbiata, Lasagna bò phô mai, Súp hành tây Pháp, Gà áp chảo bơ chanh Piccata, Sandwich gà nướng Panini, Salad Caesar gà nướng, Cánh gà nướng mật ong Rosemary.
- [x] **Dữ Liệu & Hình Ảnh Sẵn Sàng (Ready-to-use - Không Giữ Code File Thừa):**
  - [x] **CSDL SQLite nạp sẵn:** `backend/yumyumpick.db` (100 món, 495 nguyên liệu, 300 bước nấu, user test `demo`/`123`).
  - [x] **Kho 100 ảnh offline:** `backend/images/dishes/<id>.jpg` (tổng ~15MB, đường dẫn cục bộ `/images/dishes/...`).
  - [x] **File dữ liệu JSON chuẩn:** `backend/app/data/dishes_seed.json`.
  - [x] **Loại bỏ toàn bộ code phụ trợ:** Đã xóa toàn bộ script helper (`download_images.py`, `seed_sqlite.py`, `validate_data.py`, `schema.sql`) để repository tinh giản 100%, chỉ giữ DB và Images phục vụ các thành viên code theo kế hoạch 5 ngày.

---

## 3. Kế Hoạch Triển Khai 5 Ngày (Parallel 5-Day Sprint)

```
       NGÀY 1                  NGÀY 2                  NGÀY 3                  NGÀY 4                  NGÀY 5
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Setup & Schema  │    │ Parallel Coding  │    │  API Integration │    │  Liked & Recipe  │    │  Testing & Demo  │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│• Chốt Contract   │    │• BE: Auth & Dish │    │• Ghép nối FE-BE  │    │• Danh sách món   │    │• Test chéo PC/Mob│
│• SQLite DDL      │    │• FE1: Card+Intro │    │• Quẹt lưu SQLite │    │  đã lưu & nút xóa│• Fix bug & Polish│
│• Khởi tạo FE, BE │    │• FE2: Liked/Recip│    │• Thẻ kèm Intro   │    │• Checkbox nguyên │• Slide & Kịch bản│
│• Nạp 10 món mẫu  │    │• FE3: Auth/Filter│    │• Test Responsive │    │  liệu + 3 bước   │  Demo            │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Ngày 1: Setup Môi Trường & Chốt API Contract
- [ ] **Minh Đức (Lead, Data & QA):** Bàn giao CSDL SQLite `yumyumpick.db` (đầy đủ 100 món, 100 ảnh offline) và tài liệu đặc tả cho cả nhóm; chủ trì chốt API Contract.
- [X] **Ánh Dương (Backend 1):** Setup FastAPI, CORS, Static Files mount `/images`; cung cấp Mock Data JSON cho Frontend.
- [x] **Đăng Huy (Backend 2):** Khởi tạo ORM Models (`Dish`, `Ingredient`, `CookingStep`, `UserSavedDish`) kết nối `backend/yumyumpick.db`.
- [x] **Quang Huy (Frontend 1):** Khởi tạo project React (Vite + Tailwind CSS + Framer Motion); setup thư viện và khung thẻ quẹt.
- [X] **Tùng Dương (Frontend 2):** Khởi tạo cấu trúc các component chi tiết món ăn: `LikedDishesView.jsx` và `DishDetailModal.jsx`.
- [X] **Luân (Frontend 3 & Pitching Lead):** Xây dựng Layout tổng thể ứng dụng, Navbar/Header và state quản lý phiên `localStorage`; lên dàn ý Slide PowerPoint (12 - 15 slides).

### Ngày 2: Code Song Song Độc Lập
- [ ] **Minh Đức:** Điều phối Daily Sync 09:00; xây dựng bộ kịch bản kiểm thử (Test Matrix 20 Test Cases) cho PC và Mobile.
- [X] **Ánh Dương:** Viết API `POST /api/v1/auth/signup` và `POST /api/v1/auth/login` (kết nối trực tiếp CSDL SQLite).
- [x] **Đăng Huy:** Viết API `GET /api/v1/dishes/random` (hỗ trợ lọc ẩm thực, độ cay, thời gian, loại trừ món đã xem) và `GET /api/v1/dishes/{dish_id}`.
- [x] **Quang Huy:** Hoàn thiện `SwipeCard.jsx` & `CardStack.jsx` bằng Framer Motion (hiển thị ảnh, tên, badges và description intro trên thẻ; cử chỉ kéo chuột/vuốt ngón tay, stamp YUMMY/NOPE, spring physics, empty state).
- [X] **Tùng Dương:** Xây dựng `LikedDishesView.jsx` (danh sách món đã thích, nút xóa) và `DishDetailModal.jsx` (Checkbox tương tác nguyên liệu, 3 bước nấu, mẹo bếp).
- [X] **Luân:** Xây dựng `AuthModal.jsx` (Đăng nhập/Đăng ký lưu `localStorage`) và `FilterModal.jsx` (Lọc theo quốc gia, độ cay, thời gian nấu); thiết kế các slide PowerPoint đầu tiên với kho ảnh ẩm thực.

### Ngày 3: Tích Hợp API & Bố Cục Responsive PC/Mobile
- [ ] **Minh Đức:** Điều phối Daily Sync 09:00; giám sát việc kết nối API giữa FE và BE; kiểm tra dữ liệu ghi nhận vào SQLite.
- [ ] **Ánh Dương + Luân:** Ghép nối `AuthModal.jsx` với Simple Auth API; kiểm tra tự khôi phục phiên đăng nhập khi F5.
- [x] **Đăng Huy + Quang Huy:** Kết nối API lấy danh sách thẻ ngẫu nhiên (kèm `short_description`) và gọi `POST /api/v1/saved-dishes` khi quẹt phải (LIKE).
- [x] **Quang Huy:** Tinh chỉnh Responsive: Mobile full viền vuốt chạm mượt; Desktop PC khung thẻ $420 \times 600$px căn giữa màn hình.
- [x] **Luân:** Ghép nối `FilterModal.jsx` với API của Đăng Huy để lọc sơ bộ theo quốc gia, độ cay, thời gian; hoàn thiện slide kiến trúc kỹ thuật và dữ liệu.
- [x] **Tùng Dương:** Đã hoàn thành ghép nối `LikedDishesView.jsx` với API `GET /api/v1/saved-dishes/{user_id}` để lấy danh sách món đã lưu từ CSDL SQLite (kèm skeleton loader).
 
### Ngày 4: Danh Sách Đã Thích, Chi Tiết Công Thức & Phím Tắt PC
- [ ] **Minh Đức:** Thực hiện kiểm thử toàn diện trên PC và Mobile thật qua mạng LAN; phân loại và giao bug cho FE/BE fix.
- [x] **Đăng Huy:** Hoàn thiện API `GET /api/v1/saved-dishes/{user_id}`, `DELETE /api/v1/saved-dishes/{user_id}/{dish_id}` và metadata bộ lọc.
- [ ] **Ánh Dương:** Tối ưu hóa truy vấn SQLite, cấu hình chống khóa file (concurrency lock); kiểm tra tốc độ tải ảnh tĩnh dưới 50ms.
- [x] **Quang Huy:** Bắt sự kiện phím tắt bàn phím PC (`←` Bỏ qua, `→` Thích) và cụm nút bấm nổi (Nút Bỏ qua, Nút Thích).
- [x] **Tùng Dương:** Hoàn thiện `LikedDishesView.jsx` (danh sách món đã thích, gọi API xóa) và `DishDetailModal.jsx` (Xem chi tiết công thức: Checkbox tương tác nguyên liệu + 3 bước nấu + mẹo đầu bếp, fallback ảnh 2 lớp, tối ưu header responsive mobile).
- [x] **Luân:** Tinh chỉnh UI/UX cho Header, Filter Modal và Auth Modal; soạn kịch bản thuyết trình chi tiết (Storytelling 10-12 phút), kịch bản Live Demo từng bước và video dự phòng.

### Ngày 5: Kiểm Thử Toàn Diện, Tổng Duyệt & Báo Cáo
- [ ] **Minh Đức:** Chạy Regression Test toàn bộ 20 Test Cases đảm bảo 0 bug; nghiệm thu sản phẩm cuối theo tiêu chí DoD.
- [ ] **Cả team (Minh Đức, Ánh Dương, Đăng Huy, Quang Huy, Tùng Dương, Luân):** Chạy kiểm thử End-to-End trơn tru:
  - Đăng ký user $\rightarrow$ Đăng nhập $\rightarrow$ Đổi bộ lọc $\rightarrow$ Quẹt thẻ $\rightarrow$ Lưu món $\rightarrow$ Xem danh sách đã thích $\rightarrow$ Xem chi tiết công thức.
- [ ] **Luân:** Soạn bộ câu hỏi phản biện (Q&A Cheat Sheet); đại diện nhóm thuyết trình báo cáo đồ án với bộ Slide hoàn thiện.
- [ ] **Cả team:** Sẵn sàng bảo vệ đồ án đạt kết quả xuất sắc!

---

## 4. Phân Chia Vai Trò Đích Danh (6 Thành Viên)

1. **Minh Đức — Project Lead, Quản Trị Data & Kiểm Định (QA Lead):**
   - Điều phối sprint 5 ngày, Daily Sync 10 phút.
   - Quản trị kho 100 món ăn, 100 ảnh offline, CSDL SQLite `yumyumpick.db`.
   - Kiểm định chất lượng toàn diện (Test Matrix) trên PC và Mobile thật qua mạng LAN.
2. **Ánh Dương — Backend Engineer 1:**
   - Setup FastAPI Server, CORS, Mount static `/images`.
   - Xây dựng Simple Auth API (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`).
   - Cung cấp Mock Data JSON cho Frontend.
3. **Đăng Huy — Backend Engineer 2:**
   - Xây dựng Dishes Core API (`GET /api/v1/dishes/random`, bộ lọc quốc gia, độ cay, thời gian nấu, loại trừ món đã quẹt).
   - Xây dựng Saved Dishes API (`POST`, `GET`, `DELETE` món đã lưu vào CSDL SQLite).
4. **Quang Huy — Frontend Engineer 1 (Swipe Deck & Motion):**
   - Xây dựng Swipe Deck Framer Motion (`SwipeCard.jsx`, `CardStack.jsx`, Stamp YUMMY/NOPE, spring physics).
   - Tích hợp ảnh, tên món, huy hiệu và description intro trực tiếp lên mặt thẻ quẹt.
   - Tối ưu Responsive PC (khung $420 \times 600$px, phím tắt `←`, `→`) và Mobile touch gestures.
5. **Tùng Dương — Frontend Engineer 2 (Liked Dishes & Recipe Detail):**
   - Xây dựng `LikedDishesView.jsx` (danh sách món đã thích kèm nút xóa).
   - Xây dựng `DishDetailModal.jsx` (xem chi tiết công thức với checkbox tương tác nguyên liệu, 3 bước nấu và mẹo đầu bếp).
6. **Luân — Frontend Engineer 3 & Pitching Lead (App Shell, Filter, Auth & Presentation):**
   - Xây dựng Layout tổng thể, Header/Navbar, `AuthModal.jsx` (session `localStorage`), `FilterModal.jsx` (bộ lọc 5 nước, độ cay, thời gian).
   - Thiết kế bộ Slide PowerPoint báo cáo đồ án chuyên nghiệp (12 - 15 slides, phong cách ẩm thực hiện đại).
   - Soạn Kịch bản Thuyết trình lôi cuốn (Storytelling 10-12 phút).
   - Lập kịch bản Live Demo chi tiết và chuẩn bị video demo dự phòng.
   - Biên soạn bộ câu hỏi - câu trả lời phản biện (Q&A Cheat Sheet) cho buổi bảo vệ.
