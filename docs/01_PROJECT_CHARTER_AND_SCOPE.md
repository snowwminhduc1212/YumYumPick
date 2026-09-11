# 🎯 01. Project Charter & Scope Document

## 1. Tổng Quan & Bối Cảnh Dự Án (Project Overview)

- **Tên dự án:** YumYumPick
- **Slogan:** *"Quẹt mượt mà — Chọn món ngon không cần đắn đo"*
- **Mã dự án:** `YYP`
- **Loại hình sản phẩm:** Web Application (Mobile-first Responsive Web App)
- **Thời gian thực hiện:** 4 tuần (4 Sprints)

### 1.1. Vấn Đề Thực Tế (Problem Statement)
"Trưa nay ăn gì?", "Tối nay ăn gì?" là câu hỏi muôn thuở gây tốn kém thời gian và năng lượng tinh thần cho hàng triệu người mỗi ngày (hội chứng "Decision Paralysis" - tê liệt quyết định):
- Thực đơn quá nhiều nhưng không biết chọn gì.
- Muốn tự nấu nhưng mở tủ lạnh ra chỉ có vài nguyên liệu và không biết làm món gì phù hợp.
- Cần đổi khẩu vị sang món Hàn, Nhật, Thái, Âu... nhưng không nhớ tên món hoặc sợ cách nấu quá phức tạp.
- Các app giao đồ ăn truyền thống cung cấp danh sách dài vô tận, gây ngợp thị giác và khó lựa chọn nhanh.

### 1.2. Giải Pháp Của YumYumPick (Solution Statement)
YumYumPick đơn giản hóa triệt để quyết định ăn uống thông qua cơ chế **Tinder-style Card Swiping (quẹt thẻ ngẫu nhiên)** kết hợp lưu trữ công thức tiện lợi:
1. **Một món tại một thời điểm:** Giúp não bộ tập trung 100% vào hình ảnh bắt mắt của món ăn.
2. **Thao tác tức thì & Trực quan (Fast Decisive UX):**
   - **Nhấp nhẹ vào Thẻ (Tap / Click):** Mở nhanh bảng **Giới thiệu món ăn** (Dish Intro): nguồn gốc, hương vị đặc trưng, thời gian chế biến, lượng calo và tóm tắt nguyên liệu chính để người dùng cân nhắc trước khi quyết định.
   - **Quẹt Phải (Right Swipe / Like / ❤️):** Quyết định chọn món này! Tự động **lưu toàn bộ món ăn và công thức nấu chi tiết** vào bộ sưu tập cá nhân trên `LocalStorage` để người dùng vào xem chi tiết sau khi quẹt xong.
   - **Quẹt Trái (Left Swipe / Skip / ❌):** Không ưng món này, bỏ qua và chuyển sang món tiếp theo.
3. **Bộ lọc thông minh (Smart Filters):** Lọc theo quốc gia (Việt, Hàn, Nhật, Thái, Ý...), vùng miền, mức độ cay, nguyên liệu sẵn có trong tủ lạnh.
4. **Xem chi tiết & Đi chợ sau khi quẹt:** Mở bộ sưu tập món đã lưu để xem đầy đủ công thức (nguyên liệu có checkbox, các bước nấu 1-2-3, mẹo đầu bếp) và tự động xuất danh sách đi chợ gửi qua Zalo/Messenger.
5. **Không bắt buộc đăng ký phức tạp:** Sử dụng `LocalStorage` giúp người dùng mở web là quẹt được ngay, dữ liệu lưu trữ tức thì và riêng tư trên thiết bị.

---

## 2. Đối Tượng Sử Dụng (Target Audience & Personas)

### Persona 1: "Sinh viên / Dân văn phòng bận rộn" (Nguyễn Minh, 22 tuổi)
- **Hành vi:** Đến giờ nghỉ trưa luôn hỏi đồng nghiệp "Ăn gì bây giờ?", lướt app 30 phút vẫn chưa chốt được.
- **Nhu cầu:** Cần một gợi ý nhanh trong vòng 30 giây, hình ảnh hấp dẫn, có tên quán hoặc cách làm đơn giản.

### Persona 2: "Người thích tự nấu ăn tại nhà" (Trần Linh, 25 tuổi)
- **Hành vi:** Đi làm về mở tủ lạnh còn một ít trứng, cà chua, thịt bò nhưng không biết nấu món gì lạ miệng.
- **Nhu cầu:** Nhập/chọn nguyên liệu sẵn có, quẹt vài thẻ để chọn ra món nấu được ngay kèm công thức chi tiết.

### Persona 3: "Nhóm bạn / Cặp đôi hay tranh cãi khi đi ăn"
- **Hành vi:** Đưa ra ý kiến gì đối phương cũng bảo "Gì cũng được" nhưng thực tế lại không chịu.
- **Nhu cầu:** Truyền tay nhau chiếc điện thoại để quẹt, món nào được quẹt phải thì ăn món đó.

---

## 3. Phạm Vi Dự Án (Project Scope)

```mermaid
graph TD
    A["YumYumPick Ecosystem"] --> B["MVP (Giai đoạn 1 - Scope Hiện Tại)"]
    A --> C["Phase 2 (Tương Lai)"]
    A --> D["Out of Scope (Không Làm)"]

    B --> B1["Tinder-style Swipe UI"]
    B --> B2["Random & Filter Engine (Quốc gia, Nguyên liệu)"]
    B --> B3["Recipe & Ingredient Modal"]
    B --> B4["Saved Dishes & History (LocalStorage)"]
    B --> B5["Mobile & Desktop Responsive"]

    C --> C1["Đăng nhập tài khoản (Google / Email)"]
    C --> C2["Tạo phòng Room Swipe chung cho cặp đôi (WebSocket)"]
    C --> C3["AI gợi ý công thức từ ảnh chụp tủ lạnh"]
    C --> C4["Tích hợp đặt món qua GrabFood/ShopeeFood link"]

    D --> D1["Tự xây dựng hệ thống thanh toán"]
    D --> D2["Tự mở dịch vụ giao đồ ăn logistics"]
    D --> D3["Native App iOS/Android riêng biệt trên App Store"]
```

### 3.1. Trong Phạm Vi MVP (In-Scope for Current Release)
1. **Tinder Card Swiping:**
   - Card trực quan: Hình ảnh chất lượng cao, tên món, quốc gia/ẩm thực, thời gian nấu, độ khó.
   - Thao tác quẹt cảm ứng trên điện thoại (touch gesture) và chuột trên máy tính (drag & drop / phím mũi tên).
   - Hiệu ứng quẹt mượt mà (smooth animation) kèm phản hồi thị giác (Icon Like màu xanh lá, Skip màu đỏ).
2. **Random & Recommendation API (FastAPI):**
   - API trả về danh sách món ăn ngẫu nhiên đã được xáo trộn (shuffle) không trùng lặp trong một phiên quẹt.
   - Bộ lọc theo: Quốc gia (Việt Nam, Nhật Bản, Hàn Quốc, Thái Lan, Ý, Trung Quốc, Âu Mỹ), độ cay, loại bữa ăn (Sáng, Trưa, Tối, Ăn vặt), nguyên liệu chính (Thịt bò, Gà, Hải sản, Rau củ/Chay).
3. **Giới Thiệu Món Ăn Khi Tap Thẻ (Tap Dish Intro Drawer):**
   - Tap nhẹ vào thẻ hoặc bấm nút "ℹ️": Mở nhanh Bottom Sheet hiển thị giới thiệu tổng quan, xuất xứ văn hóa, độ cay, calo và tóm tắt nguyên liệu chính để người dùng tham khảo trước khi quẹt.
   - Hỗ trợ nút thao tác nhanh ngay trong drawer (Chọn món ❤️ hoặc Bỏ qua ❌).
4. **Lưu Trữ & Xem Chi Tiết Công Thức Sau Khi Quẹt (Saved Dishes & Full Recipe):**
   - Khi quẹt phải: Tự động lưu toàn bộ dữ liệu món ăn và công thức chi tiết vào `LocalStorage` của trình duyệt.
   - Màn hình "Món Đã Lưu": Xem danh sách các món đã quẹt chọn. Bấm vào bất kỳ món nào để mở chi tiết công thức:
     - Danh sách nguyên liệu kèm checkbox tương tác (tiện cho đi chợ / kiểm tra tủ lạnh).
     - Hướng dẫn chế biến chi tiết từng bước (Step 1, Step 2, Step 3...).
     - Mẹo & bí quyết đầu bếp (Chef's Tips).
     - Tính năng "Xuất danh sách đi chợ" (Smart Grocery List) gộp nguyên liệu gửi qua Zalo/Messenger.
     - Đánh dấu đã nấu hoặc xóa món.
5. **Giao Diện Responsive Toàn Diện (Mobile-First):**
   - Tối ưu hoàn hảo cho kích thước màn hình điện thoại (375px - 430px) và máy tính bảng / PC (1024px+).
6. **Bộ Dữ Liệu Ban Đầu (Seed Data):**
   - Tối thiểu 50-100 món ăn phong phú, hình ảnh đẹp mắt, định dạng chuẩn JSON.

### 3.2. Ngoài Phạm Vi (Out of Scope)
- Không làm ứng dụng Native tải từ App Store/Google Play (tập trung Web App chuẩn PWA).
- Không làm cổng thanh toán, ví điện tử.
- Không xây dựng chuỗi cung ứng shipper hay đặt món trực tiếp.

---

## 4. Yêu Cầu Chức Năng & Phi Chức Năng (Requirements Specification)

### 4.1. Yêu Cầu Chức Năng (Functional Requirements - FR)
- **FR-01 (Quẹt thẻ):** Người dùng có thể quẹt trái (Skip) hoặc quẹt phải (Pick) thẻ món ăn. Có hỗ trợ nút bấm vật lý (nút ❌ và nút ❤️) để người dùng không cần dùng cử chỉ kéo chuột.
- **FR-02 (Tap xem giới thiệu món ăn):** Người dùng nhấp/tap vào thẻ hoặc nút "ℹ️" để mở drawer giới thiệu nhanh món ăn (câu chuyện, xuất xứ, thời gian, calo, độ cay, tóm tắt nguyên liệu).
- **FR-03 (Lưu công thức chi tiết sau khi quẹt):** Mọi món quẹt phải tự động lưu toàn bộ công thức chi tiết vào `LocalStorage`. Người dùng có thể mở bộ sưu tập đã lưu để xem lại chi tiết nguyên liệu (có checkbox), các bước nấu, và mẹo vặt bất cứ lúc nào.
- **FR-04 (Bộ lọc tìm kiếm):** Người dùng có thể chọn 1 hoặc nhiều tiêu chí lọc (quốc gia, độ cay, bữa ăn, thời gian). Khi áp dụng bộ lọc, danh sách thẻ được tải mới theo tiêu chí đã chọn.
- **FR-05 (Undo thao tác):** Cho phép hoàn tác (Undo) lại 1 thẻ gần nhất nếu vô tình quẹt nhầm.
- **FR-06 (Export danh sách đi chợ):** Tính năng tổng hợp nguyên liệu của các món đã chọn thành danh sách mua sắm (Grocery checklist) để gửi qua tin nhắn.

### 4.2. Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)
- **NFR-01 (Hiệu năng quẹt - Performance):** Tốc độ khung hình khi quẹt thẻ đạt tối thiểu 60 FPS trên thiết bị di động tầm trung. Không giật lag khi render thẻ tiếp theo.
- **NFR-02 (Thời gian phản hồi API - Latency):** Endpoint lấy danh sách món ăn từ FastAPI phản hồi dưới **200ms**.
- **NFR-03 (Khả năng tương thích - Compatibility):** Hoạt động tốt trên Chrome, Safari iOS, Edge, Firefox trên cả iOS, Android, macOS và Windows.
- **NFR-04 (Kích thước hình ảnh - Asset Optimization):** Toàn bộ hình ảnh món ăn được tối ưu định dạng WebP, dung lượng dưới 150KB/ảnh để tải trang cực nhanh.
- **NFR-05 (Độ tin cậy & Offline tolerance):** Trường hợp mất kết nối mạng tạm thời, ứng dụng vẫn hiển thị được các món đã lưu từ LocalStorage.

---

## 5. Tiêu Chí Nghiệm Thu & Chỉ Số Thành Công (KPIs)

| Chỉ Số (Metric) | Mục Tiêu Nghiệm Thu | Cách Đo Lường |
|---|---|---|
| **Lighthouse Performance** | $\ge 90$ điểm trên Mobile | Google Lighthouse Audit |
| **First Contentful Paint (FCP)** | $< 1.5$ giây | Web Vitals / Vercel Analytics |
| **Dung lượng Data khởi tạo** | $\ge 60$ món ăn đa dạng | Đếm bản ghi trong data seed |
| **Tỷ lệ Crash / Lỗi UI Swipe** | $0$ lỗi kẹt thẻ khi quẹt liên tục | Kịch bản kiểm thử tự động & QA test |
| **Thời gian ra quyết định món** | Giảm thời gian chọn món xuống $< 2$ phút | Phỏng vấn người dùng thử nghiệm |
