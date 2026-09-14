# 08. Đặc Tả Tính Năng Cốt Lõi (Core Features Specification)

Tài liệu này định nghĩa chính xác và tinh gọn **bộ tính năng cốt lõi (Core Features)** của ứng dụng **YumYumPick**. Mọi tính năng đều tập trung vào trải nghiệm quẹt món trực quan, quyết định nhanh chóng và xem chi tiết công thức nấu ăn chuẩn xác để hoàn thành xuất sắc đồ án trong 5 ngày.

---

## 1. Triết Lý Sản Phẩm: Tối Giản & Trọng Tâm (Lean Product Vision)

> **"Làm ít đi, nhưng làm thật mượt mà."**  
> YumYumPick giải quyết duy nhất một bài toán: **"Trưa nay / Tối nay ăn gì?"**  
> Người dùng chỉ cần làm 3 việc: **Lọc sơ bộ $\rightarrow$ Quẹt chọn món trên thẻ (đã có sẵn mô tả giới thiệu) $\rightarrow$ Vào danh sách đã quẹt để xem chi tiết công thức nấu ăn.**

```mermaid
flowchart LR
    A["1. Lọc Sơ Bộ\n(Quốc gia / Độ cay / Thời gian)"] --> B["2. Quẹt Thẻ Món Ăn\n(Có ảnh, tên, badges & mô tả intro\nTrái: Bỏ qua / Phải: Thích)"]
    B --> C["3. Danh Sách Đã Quẹt\n(Xem chi tiết công thức\nCheckbox nguyên liệu + 3 bước nấu)"]
```

---

## 2. Danh Sách 3 Tính Năng Cốt Lõi (In-Scope Core Features)

---

### Feature 1: Cơ Chế Quẹt Thẻ Món Ăn Phong Cách Tinder (Swipe Card Deck)

* **Mục đích:** Giúp người dùng đưa ra quyết định ăn uống nhanh chóng trong vòng 30 giây thông qua thị giác và tóm tắt giới thiệu trực tiếp trên mặt thẻ.
* **Nội dung trên mặt thẻ (Card Content):**
  - **Hình ảnh món ăn:** Kích thước lớn, góc bo tròn hiện đại, sắc nét (load 100% từ kho ảnh offline cục bộ `images/dishes/<id>.jpg`).
  - **Tên món ăn:** Tên tiếng Việt in đậm, cỡ chữ lớn, dễ đọc; kèm tên tiếng Anh/phiên âm nhỏ thanh lịch bên dưới.
  - **Đoạn giới thiệu ngắn (Description Intro / Short Description):** 
    - Hiển thị 2-3 câu giới thiệu súc tích về hương vị đặc trưng, nguồn gốc hoặc cảm giác món ăn mang lại (lấy từ trường `short_description` trong CSDL SQLite).
    - **Ý nghĩa:** Người dùng đọc ngay trên mặt thẻ để biết món này cay hay thanh, chua ngọt hay đậm đà, từ đó quyết định chính xác **quẹt Trái (Bỏ qua)** hay **quẹt Phải (Thích)** mà không cần mở thêm bất kỳ drawer hay màn hình phụ nào.
  - **Thông số nhanh dạng huy hiệu (Badges):**
    - Thời gian chế biến: `20'`
    - Mức calo ước tính: `480 kcal`
    - Mức độ cay: `Cấp 1` hoặc `Không cay`
    - Quốc gia ẩm thực: `Việt Nam`, `Hàn Quốc`, `Nhật Bản`, `Thái Lan`, `Ý`
* **Cơ chế cử chỉ quẹt (Swipe Gestures):**
  - **Quẹt sang Phải (Swipe Right / Thích):**
    - Thẻ bay sang phải kèm hiệu ứng stamp **"YUMMY!"** màu xanh lá tươi sáng.
    - Gọi API tự động ghi nhận món ăn vào bảng món đã lưu trong CSDL SQLite cho tài khoản hiện tại.
    - Cập nhật số lượng món đã thích trên Header.
  - **Quẹt sang Trái (Swipe Left / Bỏ qua):**
    - Thẻ bay sang trái kèm hiệu ứng stamp **"NOPE"** màu đỏ cam.
    - Bỏ qua món ăn và tự động đẩy thẻ tiếp theo lên vị trí chính.
* **Hỗ trợ đa phương thức điều khiển:**
  - **Mobile:** Vuốt ngón tay cảm ứng tự nhiên mượt mà (Touch Drag với hiệu ứng vật lý nhún của Framer Motion).
  - **Desktop PC:** Kéo chuột hoặc ấn phím mũi tên bàn phím (`←` để Bỏ qua, `→` để Thích).
  - **Nút bấm trợ năng:** Cụm 2 nút tròn nổi bật bên dưới thẻ: nút tròn Bỏ qua và nút tròn Thích & Lưu.
* **Trạng thái hết thẻ (Empty State):** Khi quẹt hết danh sách món ăn, hiển thị thông báo nhẹ nhàng: *"Bạn đã duyệt hết món ăn!"* kèm nút *"Quẹt lại từ đầu"*.

---

### Feature 2: Bộ Lọc Món Ăn Sơ Bộ (Basic Quick Filter)

* **Mục đích:** Thu hẹp nhanh danh sách món gợi ý trước khi bắt đầu quẹt thẻ, tránh gợi ý các món không hợp khẩu vị hôm nay.
* **Mô tả giao diện & Tương tác:**
  - Nút bấm biểu tượng Bộ lọc trên thanh Header góc phải.
  - Bấm vào mở Modal/Popup nhỏ gọn, trực quan:
    1. **Quốc gia / Nền ẩm thực:** 5 chip lựa chọn: `Tất cả` | `Việt Nam` | `Hàn Quốc` | `Nhật Bản` | `Thái Lan` | `Ý`.
    2. **Độ cay:** `Tất cả` | `Không cay (Cấp 0)` | `Có cay (Cấp 1-3)`.
    3. **Thời gian nấu:** `Tất cả` | `Nấu nhanh (< 20 phút)` | `Kỳ công (>= 20 phút)`.
  - **Nút "Áp dụng bộ lọc":** Đóng popup và tải lại danh sách thẻ quẹt tương ứng từ CSDL SQLite.
  - **Nút "Đặt lại":** Quay về mặc định ngẫu nhiên toàn bộ 100 món.

---

### Feature 3: Danh Sách Món Đã Quẹt & Xem Chi Tiết Công Thức (Liked Dishes & Full Recipe Details)

* **Mục đích:** Vào phần đã quẹt chỉ để xem chi tiết công thức nấu ăn của các món người dùng đã lựa chọn.
* **Mô tả giao diện & Tương tác:**
  - Nút bấm Món Đã Lưu trên thanh Header kèm số đếm (ví dụ: `5`).
  - **Phần 1: Màn hình Danh sách món đã lưu (Liked Dishes List):**
    - Hiển thị danh sách các món đã thích dưới dạng lưới hoặc danh sách thẻ gọn gàng.
    - Mỗi item gồm: Ảnh thu nhỏ, tên món ăn (Việt & Anh), quốc gia, thời gian nấu.
    - Nút Xóa: Bấm vào để xóa/bỏ thích món ăn khỏi CSDL SQLite nếu không muốn nấu nữa.
    - **Bấm vào bất kỳ món nào $\rightarrow$ Mở màn hình xem chi tiết công thức.**
  - **Phần 2: Xem chi tiết công thức nấu ăn (Dish Detail Recipe View):**
    - **Header:** Ảnh món ăn sắc nét + Tên món + Câu chuyện giới thiệu chi tiết (`short_description`).
    - **Danh Sách Nguyên Liệu kèm Checkbox tương tác (Interactive Ingredients Checklist):**
      - Mỗi nguyên liệu hiển thị kèm một ô **Checkbox tương tác** `[ ]` (ví dụ: `[ ] Thịt bò nạc: 300g`, `[ ] Bánh phở tươi: 500g`, `[ ] Hành lá & ngò gai: 1 ít`).
      - Người dùng bấm tích chọn vào checkbox để đánh dấu nguyên liệu đã chuẩn bị hoặc đã có trong bếp (chữ gạch ngang mờ nhẹ trực quan).
      - Tương tác mượt mà trong giao diện, hỗ trợ người nấu kiểm tra đồ cực kỳ tiện lợi khi vào bếp.
    - **Hướng dẫn chế biến chuẩn mực 3 bước (Cooking Steps):**
      - **Bước 1 — Sơ chế nguyên liệu:** Rửa, cắt thái, ướp gia vị chuẩn định lượng.
      - **Bước 2 — Chế biến nhiệt:** Nấu nước dùng, kho, xào, chiên, nướng đúng thời gian và kỹ thuật.
      - **Bước 3 — Trình bày & Thưởng thức:** Xếp ra tô/đĩa, trang trí rau thơm, dùng nóng chuẩn vị.
    - **Khung Mẹo đầu bếp (`tips`):** Hộp ghi chú viền vàng nổi bật chia sẻ bí quyết thực tế giúp món ăn ngon chuẩn vị nhà hàng.

---

### Tính Năng Bổ Trợ: Đăng Nhập / Đăng Ký Đơn Giản (Simple Auth)

* Biểu mẫu tài khoản đơn giản: Chỉ cần nhập `username` và `password` để tạo tài khoản hoặc đăng nhập.
* Mục đích duy nhất: Lưu trữ danh sách món đã quẹt theo từng người dùng vào bảng `user_saved_dishes` trong CSDL SQLite.
* Lưu `user_id` và `username` vào `localStorage` để duy trì trạng thái đăng nhập khi người dùng tải lại trang (F5).

---

## 3. Phân Bổ Triển Khai Cho Đội Ngũ 6 Thành Viên (Task Mapping)

* **Quang Huy (Frontend 1 — Swipe Card Deck):**
  - Chịu trách nhiệm chính **Feature 1 (Swipe Card Deck)**:
    - Xây dựng component `SwipeCard.jsx` và `CardStack.jsx` bằng Framer Motion.
    - Hiển thị đầy đủ ảnh, tên món, huy hiệu thông số và **đoạn giới thiệu ngắn (`short_description`)** ngay trên mặt thẻ.
    - Tối ưu hiệu ứng stamp YUMMY/NOPE, cử chỉ vuốt chạm trên Mobile và phím tắt bàn phím `←`, `→` trên PC.
* **Tùng Dương (Frontend 2 — Liked Dishes & Detail Recipe View):**
  - Chịu trách nhiệm chính **Feature 3 (Liked Dishes & Detail Recipe View)**:
    - Xây dựng `LikedDishesView.jsx`: Giao diện danh sách món đã thích (kèm nút xóa món).
    - Xây dựng `DishDetailModal.jsx`: Màn hình/modal chi tiết công thức nấu ăn (**Checkbox tương tác trong danh sách nguyên liệu** + Hướng dẫn 3 bước nấu + Khung Mẹo đầu bếp).
* **Luân (Frontend 3 & Pitching Lead):**
  - Chịu trách nhiệm **Feature 2 (Filter Modal) & App Shell / Auth UI**:
    - Xây dựng Header/Navbar, bố cục khung ứng dụng và quản lý state phiên `localStorage`.
    - Xây dựng `FilterModal.jsx`: Popup chọn lọc quốc gia, độ cay, thời gian nấu.
    - Xây dựng `AuthModal.jsx`: Biểu mẫu Đăng ký/Đăng nhập đơn giản.
  - Phụ trách thiết kế bộ Slide PowerPoint báo cáo đồ án (12-15 slide) và Kịch bản Thuyết trình/Demo 10 phút.
* **Ánh Dương (Backend 1):**
  - Khởi tạo FastAPI Server, CORS, Static Files mount `/images/dishes/` phục vụ ảnh offline.
  - Xây dựng Simple Auth API (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`).
* **Đăng Huy (Backend 2):**
  - Xây dựng Dishes API (`GET /api/v1/dishes/random`) hỗ trợ lọc theo quốc gia, độ cay, thời gian nấu và trả về đầy đủ `short_description`.
  - Xây dựng Saved Dishes API (`POST`, `GET`, `DELETE /api/v1/saved-dishes/{user_id}`) kết nối SQLite.
* **Minh Đức (Lead, Data, QA):**
  - Cung cấp và bảo toàn kho dữ liệu 100 món, 100 ảnh offline, CSDL SQLite `yumyumpick.db`.
  - Điều phối tiến độ 5 ngày, kiểm thử End-to-End toàn bộ tính năng trên PC và Mobile thật.
