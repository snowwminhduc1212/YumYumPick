# YumYumPick Dish Image Crawler

Bộ công cụ thu thập và kiểm tra hình ảnh món ăn thực tế (100% Real Photography) cho YumYumPick, loại bỏ triệt để ảnh AI render, vector minh họa và ảnh stock giả lập.

---

## 📁 Cấu Trúc Thư Mục

```text
crawler/
├── config.py             # Cấu hình đường dẫn, danh sách chặn Stock/AI, whitelist blog uy tín
├── crawl_dish_images.py  # Script chính: tìm kiếm, tải, tối ưu ảnh JPEG, cập nhật DB & mock data
├── verify_dataset.py     # Script kiểm tra, audit toàn bộ dataset và ảnh trên đĩa
├── requirements.txt      # Thư viện phụ thuộc (ddgs, requests, Pillow)
└── README.md             # Hướng dẫn sử dụng
```

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Kích hoạt môi trường ảo Python
```powershell
# Tại thư mục gốc dự án D:\LT\YunYumPick:
.\.venv\Scripts\Activate.ps1
```

### 2. Cài đặt thư viện phụ thuộc (nếu chưa có)
```powershell
pip install -r crawler/requirements.txt
```

### 3. Kiểm tra tình trạng dữ liệu hiện tại (Audit)
Chạy script kiểm tra để xem số lượng món, tính toàn vẹn của tệp ảnh, độ độc nhất (hash MD5) và nguồn ảnh:
```powershell
python crawler/verify_dataset.py
```

### 4. Thu thập hoặc làm mới ảnh món ăn

- **Chạy tự động kiểm tra và tải ảnh cho những món còn thiếu hoặc bị đánh dấu AI/Stock:**
  ```powershell
  python crawler/crawl_dish_images.py
  ```

- **Tùy chọn số luồng song song (mặc định 3 luồng):**
  ```powershell
  python crawler/crawl_dish_images.py --workers 4
  ```

- **Tải hoặc làm mới ảnh cho một món cụ thể theo mã ID:**
  ```powershell
  python crawler/crawl_dish_images.py --dish-id dish_vn_004
  ```

- **Chỉ đồng bộ Database sang `dishes_seed.json` và `mockDishes.js` (không tải thêm ảnh):**
  ```powershell
  python crawler/crawl_dish_images.py --sync-only
  ```

- **Bắt buộc tải lại toàn bộ 1.100 món ăn:**
  ```powershell
  python crawler/crawl_dish_images.py --force-all
  ```

### 5. Thu thập & Nâng cấp toàn diện công thức nấu ăn chi tiết (1.100 món):
Để làm mới hoặc tái tạo công thức chi tiết 5 bước chuẩn đầu bếp (từ cách chọn mua, sơ chế, khử mùi, tẩm ướp sốt gốc, kiểm soát lửa, nêm nếm, dấu hiệu nhận biết khi chín đạt chuẩn đến trình bày thưởng thức):
```powershell
python crawler/crawl_and_refine_recipes.py
```
*Script sẽ tự động cập nhật và đồng bộ đồng thời vào:*
1. SQLite Database: `backend/yumyumpick.db` (`ingredients`, `cooking_steps`, `dishes.tips`).
2. Seed JSON: `backend/app/data/dishes_seed.json` (1.100 món có đầy đủ `ingredients` và `steps`).
3. Frontend Mock: `frontend/src/data/mockDishes.js` (1.100 món đầy đủ công thức phục vụ fallback/offline).

---

## 🛡️ Cơ Chế Lọc & Chống Ảnh AI / Ảnh Stock Giả Lập

1. **Loại trừ nền tảng Stock & AI:**
   - Chặn tuyệt đối các tên miền: `freepik`, `vecteezy`, `ftcdn` (Adobe Stock), `dreamstime`, `alamy`, `shutterstock`, `istock`, `pinimg` (Pinterest), `koala.sh`, `midjourney`, `dall-e`, `craiyon`, `unsplash`, `pexels`...
2. **Loại trừ mạng lưới Blog AI rác (AI Recipe Farms):**
   - Tự động nhận diện và chặn các website sinh nội dung tự động bằng regex (`recipesby...`, `<name>recipe(s).com`, `dishrise`, v.v.).
3. **Ưu tiên nguồn ảnh thực tế:**
   - Tìm kiếm công thức nấu ăn và video ẩm thực từ các đầu bếp, blog ẩm thực lâu năm (`thewoksoflife`, `recipetineats`, `beyondkimchee`, `marionskitchen`, `recipesfromitaly`, `dienmayxanh`, `bepmina`, YouTube cooking frames).
4. **Xử lý & Tối ưu hóa:**
   - Ảnh được chuẩn hóa sang định dạng `.jpg` (RGB, Quality 90), kích thước tối thiểu từ 250x250px và dung lượng hợp lý.
