# 11. Giải Phẫu Chi Tiết Từng Dòng Code & Từng Function Frontend (Frontend Line-by-Line Code & Function Breakdown)

> **Tài liệu đặc tả chi tiết 100% từng component, từng hook, từng service, từng function, từng state và từng dòng lệnh của toàn bộ Frontend**  
> **Dự án:** YumYumPick ("Tinder for Food")  
> **Ngôn ngữ & Công nghệ:** React 19.2.8, Vite 8.3.0, Tailwind CSS v4, Framer Motion 13.3.0, Lucide React  

---

## 📑 Mục Lục Các File Frontend

1. [`frontend/src/config/api.js`](#1-frontendsrcconfigapijs-cấu-hình-tiền-tố-api)
2. [`frontend/src/hooks/useAuth.js`](#2-frontendshrchooksuseauthjs-quản-lý-phiên-đăng-nhập)
3. [`frontend/src/hooks/useFilterMetadata.js`](#3-frontendshrchooksusefiltermetadatajs-nạp-danh-mục-lọc)
4. [`frontend/src/services/api.js`](#4-frontendssrcservicesapijs-client-giao-tiếp-mạng)
5. [`frontend/src/components/SwipeCard.jsx`](#5-frontendshrccomponentsswipecardjsx-vật-lý-kéo-thả-thẻ)
6. [`frontend/src/components/CardStack.jsx`](#6-frontendshrccomponentscardstackjsx-ảo-hóa-ngăn-xếp-3-thẻ)
7. [`frontend/src/components/DishDetailModal.jsx`](#7-frontendshrccomponentsdishdetailmodaljsx-checklist-nguyên-liệu--tiến-độ)
8. [`frontend/src/components/LikedDishesView.jsx`](#8-frontendshrccomponentslikeddishesviewjsx-quản-lý-món-đã-thích)
9. [`frontend/src/components/FilterModal.jsx`](#9-frontendshrccomponentsfiltermodaljsx-bộ-lọc-đa-tiêu-chí)
10. [`frontend/src/components/AuthModal.jsx`](#10-frontendshrccomponentsauthmodaljsx-modal-đăng-nhập--đăng-ký)
11. [`frontend/src/components/LandingPage.jsx`](#11-frontendshrccomponentslandingpagejsx-trang-chủ-nhận-diện-thương-hiệu)
12. [`frontend/src/App.jsx`](#12-frontendshrcappjsx-động-cơ-điều-phối-trạng-thái-trung-tâm)

---

## 1. `frontend/src/config/api.js` (Cấu Hình Tiền Tố API)

```javascript
1: // Để trống = dùng đường dẫn tương đối (/api/..., /images/...)
2: // → Vite proxy tự chuyển sang backend 127.0.0.1:8000 (xem vite.config.js)
3: export const API_BASE_URL = '';
4: export const API_PREFIX = `${API_BASE_URL}/api/v1`;
```
- **Dòng 3:** `API_BASE_URL = ''`: Khai báo chuỗi rỗng để tất cả request sử dụng đường dẫn tương đối. Khi chạy trong môi trường phát triển, Vite Proxy sẽ chặn các request này và chuyển tiếp sang `http://127.0.0.1:8000`. Khi đóng gói production, server tĩnh (Nginx/Caddy) cũng sẽ xử lý theo cơ chế tương tự mà không cần sửa code.
- **Dòng 4:** `API_PREFIX`: Ghép thành tiền tố chuẩn `/api/v1` cho toàn bộ các endpoint nghiệp vụ.

---

## 2. `frontend/src/hooks/useAuth.js` (Quản Lý Phiên Đăng Nhập)

```javascript
1: import { useState } from 'react';
2: 
3: const SESSION_KEY = 'yumyum_session';
```
- Khởi tạo key lưu trữ cố định `yumyum_session` trong `localStorage` của trình duyệt.

```javascript
7: function readSession() {
8:   try {
9:     const saved = localStorage.getItem(SESSION_KEY);
10:     return saved ? JSON.parse(saved) : null;
11:   } catch {
12:     localStorage.removeItem(SESSION_KEY);
13:     return null;
14:   }
15: }
```
- **Hàm `readSession()` (Khởi tạo đồng bộ):**
  - Đọc chuỗi JSON từ `localStorage`. Nếu có và parse thành công, trả về object user `{id, username, full_name}`.
  - Nếu dữ liệu bị hỏng (parse error), tự động xóa key hỏng và trả về `null`.
  - **Tác dụng cốt lõi:** Chạy ngay khi khởi tạo React state `useState(readSession)`, ngăn chặn triệt để hiện tượng nháy màn hình (Flicker) từ giao diện khách sang giao diện đã đăng nhập.

```javascript
17: export function useAuth() {
18:   const [user, setUser] = useState(readSession);
19: 
20:   const login = (userData) => {
21:     const session = { id: userData.id, username: userData.username, full_name: userData.full_name };
22:     localStorage.setItem(SESSION_KEY, JSON.stringify(session));
23:     setUser(session);
24:   };
25: 
26:   const logout = () => {
27:     localStorage.removeItem(SESSION_KEY);
28:     setUser(null);
29:   };
30: 
31:   return { user, isLoading: false, login, logout };
32: }
```
- **`login(userData)`:** Nhận payload từ backend, lưu vào `localStorage` và cập nhật state `user`.
- **`logout()`:** Xóa token khỏi `localStorage` và set state `user = null`.

---

## 3. `frontend/src/hooks/useFilterMetadata.js` (Nạp Danh Mục Lọc)

```javascript
4: export function useFilterMetadata() {
5:   const [metadata, setMetadata] = useState(null);
6:   const [isLoading, setIsLoading] = useState(true);
7:   const [error, setError] = useState('');
8: 
9:   useEffect(() => {
10:     fetch(`${API_PREFIX}/dishes/filters/metadata`)
11:       .then((res) => {
12:         if (!res.ok) throw new Error('Không tải được bộ lọc');
13:         return res.json();
14:       })
15:       .then((data) => setMetadata(data))
16:       .catch((err) => setError(err.message))
17:       .finally(() => setIsLoading(false));
18:   }, []);
19: 
20:   return { metadata, isLoading, error };
21: }
```
- Tự động gọi API `GET /api/v1/dishes/filters/metadata` ngay khi ứng dụng khởi chạy một lần duy nhất (`[]`).
- Trả về danh sách 15 quốc gia kèm emoji cờ, danh sách độ khó, độ cay và thời gian nấu cho `FilterModal`.

---

## 4. `frontend/src/services/api.js` (Client Giao Tiếp Mạng)

### 4.1. Hàm Chuẩn Hóa Dữ Liệu (DTO Normalizers):
- **`normalizeSavedDish(item)` (Dòng 14-31):**
  - Chuyển đổi linh hoạt giữa các định dạng backend trả về: lấy `item.dish_id || item.id`, gán giá trị mặc định cho `cook_time_minutes = 25`, `difficulty = 'Dễ'`, `spicy_level = 0`.
- **`normalizeDishDetail(item)` (Dòng 36-55):**
  - Đảm bảo các mảng `ingredients` và `steps` luôn là mảng rỗng `[]` nếu backend trả về `null`.

### 4.2. Các Phương Thức Của Đối Tượng `api`:

#### Function `getSavedDishes(userId = 1)`:
- Gửi HTTP `GET /api/v1/saved-dishes/${userId}`.
- Kiểm tra `response.ok`. Nếu lỗi, log console và trả về mảng rỗng `[]` (chế độ bảo vệ phòng thủ).
- Chạy `data.map(normalizeSavedDish)` và trả về mảng các món đã thích.

#### Function `getRandomDishes(params = {})`:
- Khởi tạo `URLSearchParams()`.
- Gắn các tham số: `limit`, `cuisine` (bỏ qua nếu là 'Tất cả'), `spicy_level`, `max_time`, `difficulty`, `exclude_ids`, `user_id`.
- Gửi HTTP `GET /api/v1/dishes/random?{query}`.
- Chuẩn hóa các thuộc tính thẻ quẹt và trả về danh sách thẻ.

#### Function `saveDish(userId = 1, dishId)`:
- Gửi HTTP `POST /api/v1/saved-dishes/` kèm body JSON `{ user_id, dish_id }`.
- Nếu server trả về `409 Conflict` (đã lưu trước đó), hàm vẫn coi là thành công và trả về `{ success: true, alreadySaved: true }`.

#### Function `unsaveDish(userId = 1, dishId)`:
- Gửi HTTP `DELETE /api/v1/saved-dishes/${userId}/${dishId}` để hủy thích món ăn.

#### Function `getDishDetail(dishId)`:
- Gửi HTTP `GET /api/v1/dishes/${dishId}` để lấy công thức chi tiết, sau đó gọi `normalizeDishDetail(data)`.

#### Function `skipDish(userId = 1, dishId)`:
- Gửi HTTP `POST /api/v1/dishes/skip` với body `{ user_id, dish_id }` để lưu mốc thời gian bỏ qua món vào CSDL máy chủ (loại trừ 7 ngày).

#### Function `clearUserSkips(userId = 1)`:
- Gửi HTTP `DELETE /api/v1/dishes/skip/${userId}` để xóa toàn bộ lịch sử quẹt trái của người dùng.

---

## 5. `frontend/src/components/SwipeCard.jsx` (Vật Lý Kéo Thả Thẻ)

### Giải thích từng dòng logic:
```javascript
46: export default function SwipeCard({ dish, isFront, onSwipe }) {
47:   const x = useMotionValue(0)
```
- `x`: Biến trạng thái chuyển động của Framer Motion theo dõi tọa độ ngang tính theo pixel.

```javascript
50:   const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18])
53:   const likeOpacity = useTransform(x, [20, 100], [0, 1])
54:   const nopeOpacity = useTransform(x, [-20, -100], [0, 1])
```
- `rotate`: Khi kéo sang trái `-250px`, thẻ nghiêng góc `-18°`. Khi kéo sang phải `+250px`, thẻ nghiêng `+18°`.
- `likeOpacity`: Khi kéo sang phải từ `20px` đến `100px`, độ mờ con dấu **YUMMY!** tăng dần từ `0` lên `1`.
- `nopeOpacity`: Khi kéo sang trái từ `-20px` đến `-100px`, độ mờ con dấu **NOPE** tăng dần từ `0` lên `1`.

```javascript
57:   const handleDragEnd = (event, info) => {
58:     const offset = info.offset.x
59:     const velocity = info.velocity.x
60: 
61:     if (offset > 120 || velocity > 500) {
62:       onSwipe('right', dish)
63:     } else if (offset < -120 || velocity < -500) {
64:       onSwipe('left', dish)
65:     }
66:   }
```
- **Quyết định cử chỉ quẹt:**
  - Nếu kéo quá `120px` hoặc vung tay nhanh với vận tốc $> 500\text{px/s}$ $\to$ Phát tín hiệu quẹt phải `onSwipe('right', dish)`.
  - Nếu kéo quá `-120px` hoặc vận tốc $<-500\text{px/s}$ $\to$ Phát tín hiệu quẹt trái `onSwipe('left', dish)`.

```javascript
78:   return (
79:     <motion.div
80:       style={{
81:         x: isFront ? x : 0,
82:         rotate: isFront ? rotate : 0,
83:         zIndex: isFront ? 10 : 0,
84:       }}
85:       drag={isFront ? 'x' : false}
86:       dragConstraints={{ left: 0, right: 0 }}
87:       dragElastic={0.7}
88:       onDragEnd={handleDragEnd}
```
- `drag={isFront ? 'x' : false}`: **Chỉ duy nhất thẻ trên cùng (`isFront === true`) mới được phép kéo thả**, các thẻ bên dưới bị khóa cứng cử chỉ để tránh lag và xung đột tương tác.
- `dragElastic={0.7}`: Độ đàn hồi kéo giãn tự nhiên khi kéo vượt giới hạn.

---

## 6. `frontend/src/components/CardStack.jsx` (Ảo Hóa Ngăn Xếp 3 Thẻ)

### 6.1. Đồng bộ danh sách thẻ (Dòng 23-48):
- Khi prop `initialDishes` thay đổi:
  - Nếu là danh sách hoàn toàn mới (ví dụ người dùng đổi bộ lọc) $\to$ Thay thế toàn bộ mảng `setDishes(initialDishes)`.
  - Nếu là các thẻ được nạp ngầm (Prefetch) $\to$ Chỉ lọc các thẻ chưa có trong RAM và nối vào đuôi mảng `[...prevDishes, ...newItems]`.

### 6.2. Kỹ thuật Asset Pre-buffering (Dòng 50-61):
- Khi mảng có $> 3$ thẻ, component dùng `new Image()` tải trước hình ảnh của thẻ thứ 3 đến thẻ thứ 7 vào Disk Cache của trình duyệt để sẵn sàng hiển thị tức thì.

### 6.3. Cơ chế kích hoạt Prefetch (Dòng 63-68):
- Khi `dishes.length <= 3`, tự động gọi callback `onPrefetch(dishes)` để yêu cầu `App.jsx` nạp tiếp mẻ 10 thẻ mới từ server.

### 6.4. Xử lý Quẹt Thẻ `handleSwipe` (Dòng 71-97):
- Cập nhật hướng bay của thẻ `setExitDirection(direction)`.
- Loại bỏ thẻ vừa quẹt khỏi state cục bộ `setDishes(...)`.
- Bắn sự kiện lên cha: `onCardSwiped(dish)`, `onLike(dish)` hoặc `onSkip(dish)`.

### 6.5. Bắt phím tắt bàn phím PC (Dòng 106-123):
- Lắng nghe `window.addEventListener("keydown")`:
  - Bỏ qua nếu người dùng đang gõ trong ô `INPUT` hoặc `TEXTAREA`.
  - Phím mũi tên trái `ArrowLeft` $\to$ Quẹt trái (Skip).
  - Phím mũi tên phải `ArrowRight` $\to$ Quẹt phải (Like).

### 6.6. Ảo hóa render DOM (Dòng 127-167):
- Sử dụng `dishes.slice(0, 3).map(...)` để **chỉ render đúng 3 thẻ trên cây DOM**.
- Hiệu ứng biến đổi theo vị trí index:
  - Thẻ 0: Scale `1.0`, Y `0px`, Opacity `1.0`.
  - Thẻ 1: Scale `0.95`, Y `12px`, Opacity `0.8`.
  - Thẻ 2: Scale `0.90`, Y `24px`, Opacity `0.6`.
- Hiệu ứng thoát `exit`: Bay sang trái `-400px` hoặc sang phải `+400px` trong `0.25s`.
- Khi quẹt hết thẻ: Hiển thị Empty State đẹp mắt kèm nút chuyển sang xem món đã lưu hoặc đổi bộ lọc.

---

## 7. `frontend/src/components/DishDetailModal.jsx` (Checklist Nguyên Liệu & Tiến Độ)

### 7.1. Quản lý trạng thái:
- `activeTab`: Chuyển giữa `'ingredients'` (nguyên liệu) và `'steps'` (hướng dẫn nấu).
- `checkedIngredients`: Lưu trạng thái `{ [idx]: true/false }` các ô checkbox nguyên liệu đã được người dùng tích chọn.
- `useEffect` lắng nghe phím `Escape` để đóng modal và khóa cuộn trang `document.body.style.overflow = 'hidden'`.

### 7.2. Thanh tiến độ hoàn thành % (Progress Bar):
```javascript
85:   const ingredientsList = dish.ingredients || []
86:   const totalIngredients = ingredientsList.length
87:   const checkedCount = Object.values(checkedIngredients).filter(Boolean).length
88:   const progressPercent = totalIngredients > 0 ? Math.round((checkedCount / totalIngredients) * 100) : 0
```
- Tính tỷ lệ phần trăm nguyên liệu đã chuẩn bị.
- Hiển thị thanh tiến độ sinh động bằng CSS `style={{ width: `${progressPercent}%` }}` kèm màu vàng neon `#f7ea48`.
- Nút "Chọn tất cả" / "Bỏ chọn tất cả" cho phép tích nhanh toàn bộ nguyên liệu.

### 7.3. Chi tiết các bước nấu:
- Render tuần tự các bước 1, 2, 3, 4, 5 với tiêu đề phương pháp nấu và nội dung hướng dẫn căn chỉnh lửa, nhiệt độ.
- Khung Bí Quyết Vàng của đầu bếp (`tips`) với biểu tượng `Sparkles`.

---

## 8. `frontend/src/components/LikedDishesView.jsx` (Quản Lý Món Đã Thích)

### 8.1. Thuật toán tìm kiếm tiếng Việt không dấu (Dòng 82-90):
```javascript
function removeVietnameseDiacritics(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase()
    .trim()
}
```
- Chuẩn hóa văn bản NFD, xóa bỏ toàn bộ dấu thanh và dấu mũ tiếng Việt. Giúp người dùng gõ "bun bo hue" hay "bún bò huế" đều tìm kiếm chính xác 100%.

### 8.2. Lọc kép (Search Query + Cuisine Filter):
- Hook `useMemo` lọc danh sách món đã lưu dựa trên cả từ khóa tìm kiếm (so khớp tên tiếng Việt và tên tiếng Anh) và chip quốc gia đang chọn.

### 8.3. Thao tác hủy thích & xem chi tiết:
- Nhấp vào thẻ: Kích hoạt `onSelectDish(dish)` để mở Modal công thức.
- Nút thùng rác `Trash2`: Có `e.stopPropagation()` để ngăn sự kiện mở modal, gọi `onRemoveDish(dishId)` để xóa khỏi CSDL và cập nhật state tức thì.

---

## 9. `frontend/src/components/FilterModal.jsx` (Bộ Lọc Đa Tiêu Chí)

- Hiển thị lưới 15 quốc gia kèm emoji cờ, 4 cấp độ cay (ớt 🌶️), 4 khoảng thời gian nấu, và 3 mức độ khó.
- Nhấn chọn để cập nhật state bộ lọc tạm thời.
- Khi nhấn **"Áp Dụng Bộ Lọc"**: Gọi `onApplyFilter(filters)` gửi dữ liệu về `App.jsx` để nạp lại mẻ thẻ quẹt mới và đóng modal.

---

## 10. `frontend/src/components/AuthModal.jsx` (Modal Đăng Nhập / Đăng Ký)

- Tab switcher chuyển đổi giữa Đăng Nhập và Đăng Ký.
- Client validation kiểm tra độ dài username $\ge 3$, password $\ge 6$, full_name không rỗng.
- Gọi API `POST /api/v1/auth/login` hoặc `POST /api/v1/auth/signup`.
- Khi thành công: Gọi callback `onLoginSuccess(res.user)`, tự động lưu session và chuyển sang màn hình quẹt thẻ.

---

## 11. `frontend/src/components/LandingPage.jsx` (Trang Chủ Nhận Diện Thương Hiệu)

- **Ảnh nền Collage:** Lưới các món ăn thực tế hiển thị mờ ảo ở lớp nền (`opacity-[0.12]`).
- **Thẻ xem trước tự động (Auto 4s):** `setInterval` mỗi 4 giây tự động đổi sang món tiếp theo với hiệu ứng trượt Framer Motion mượt mà.
- **Showcase ẩm thực 7 quốc gia:** Nạp động 3 món của từng quốc gia kèm cơ chế bộ nhớ đệm `showcaseCache` ở phía client để không gọi lại API khi chuyển tab.
- Nút CTA **"Bắt Đầu Khám Phá"** kích hoạt luồng kiểm tra đăng nhập và dẫn vào ứng dụng.

---

## 12. `frontend/src/App.jsx` (Động Cơ Điều Phối Trạng Thái Trung Tâm)

### Phân tích toàn bộ state và luồng thực thi:

```javascript
13: function App() {
14:   const { user, login, logout } = useAuth()
15:   const currentUserId = user?.id || 1
16:   const [authOpen, setAuthOpen] = useState(false)
17:   const [filterOpen, setFilterOpen] = useState(false)
18:   const { metadata } = useFilterMetadata();
```
- Lấy thông tin user đăng nhập. Nếu chưa có, tạm gán ID fallback là 1. Quản lý trạng thái đóng/mở của `AuthModal` và `FilterModal`.

```javascript
25:   const [currentView, setCurrentView] = useState(() => {
26:     const saved = sessionStorage.getItem('yumyum_view')
27:     if (saved && user) return saved
28:     return user ? 'swipe' : 'landing'
29:   })
```
- Xác định màn hình hiển thị: Nếu chưa đăng nhập thì mặc định là `'landing'`. Nếu đã đăng nhập thì khôi phục view từ `sessionStorage` (hoặc mặc định là `'swipe'`).

```javascript
45:   const fetchRandomDishes = async (filters = activeFilters) => { ... }
73:   const handlePrefetchDishes = async (remainingDishes) => { ... }
```
- Nạp thẻ ban đầu và nạp ngầm khi số thẻ $\le 3$.

```javascript
121:   const handleCardSwiped = (swipedDish) => {
122:     const swipedId = swipedDish.id || swipedDish.dish_id
123:     setSwipeDishes((prev) => prev.filter((d) => (d.id || d.dish_id) !== swipedId))
124:   }
```
- Loại bỏ thẻ vừa quẹt khỏi RAM ngay lập tức để giải phóng bộ nhớ.

```javascript
192:   const handleLikeDish = async (dish) => {
193:     const dishId = dish.id || dish.dish_id
194:     const isAlreadyLiked = likedDishes.some((d) => (d.id || d.dish_id) === dishId)
195:     if (!isAlreadyLiked) {
196:       setLikedDishes((prev) => [dish, ...prev])
197:       await api.saveDish(currentUserId, dishId)
198:     }
199:   }
```
- Lưu món khi quẹt phải: Cập nhật state lạc quan (Optimistic UI) đưa món lên đầu danh sách `likedDishes`, sau đó gửi API lưu vào SQLite.

```javascript
203:   const handleSkipDish = async (dish) => {
204:     const dishId = dish.id || dish.dish_id
205:     if (dishId) {
206:       await api.skipDish(currentUserId, dishId)
207:     }
208:   }
```
- Ghi nhận quẹt trái vào server để kích hoạt quy tắc loại trừ 7 ngày.

```javascript
246:       {currentView !== 'landing' && (
247:         <header className="sticky top-0 z-40 bg-[#1d0b0d] border-b ...">
```
- Thanh Navbar dính trên cùng (Sticky Header) với Logo thương hiệu, các nút chuyển đổi màn hình (Quẹt Thẻ, Đã Lưu kèm số đếm), nút mở Bộ Lọc, và nút Đăng Nhập / Đăng Xuất.
