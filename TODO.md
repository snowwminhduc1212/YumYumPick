# YumYumPick — Project TODO & Action Plan (5-Day Plan)

> The "Tinder For Food" Web App — Random dish recommendation via swipe cards, rescuing users from the dilemma of *"What should I eat today?"*  
> **Streamlined 5-day delivery:** Localhost execution • SQLite Database • Simple User Auth • No Admin UI • Responsive Mobile & PC.

---

## 1. Feature Checklist

- [x] **Intuitive Tinder-style Dish Swipe Interface (with Description Intro):**
  - **Comprehensive card face:** High-resolution dish photos, bilingual dish names (Vietnamese & English), metric badges (cooking time, calories, spiciness level, cuisine country), and a concise **introductory description (`short_description`)** giving immediate insight into the dish's flavor profile.
  - Swipe Right (LIKE): Likes the dish and saves it directly to the user's account in SQLite.
  - Swipe Left (SKIP): Discards the suggestion and immediately reveals the next dish.
  - Supports both mobile touch gestures and desktop PC mouse drag or keyboard shortcuts (`←`, `→`).
  - Animated stamp badges: Green "YUMMY" on right drag, Red "NOPE" on left drag.
  - Floating action buttons: Dedicated Skip button (`X`) and Like button (Heart).

- [x] **Streamlined User Authentication (Simple User Auth):**
  - Frictionless signup and signin without email verification, OTP, or password resets.
  - Sign Up: Enter `username`, `password`, `full_name` -> creates user record in SQLite `users` table.
  - Log In: Enter `username`, `password` -> validates credentials -> returns user session.
  - Session persistence: Saves active session (`user_id`, `username`) in `localStorage` so page reloads (F5) preserve logged-in state.
  - Log Out: Clears session token from `localStorage` and redirects to Landing Page.

- [x] **Liked Dishes Collection & Interactive Recipe Details:**
  - View all dishes saved by the user with real-time badge count on the Header.
  - Persistent storage in SQLite via `POST /api/v1/saved-dishes/{user_id}` and deletion via `DELETE /api/v1/saved-dishes/{user_id}/{dish_id}`.
  - Click any saved dish to open the comprehensive recipe modal (responsive two-column Limón Brasserie layout):
    - **Interactive Ingredient Checklist:** Each ingredient has an interactive checkbox `[ ]` to check off prepared items, with dynamic preparation progress bar.
    - Standard 3-step cooking instructions (Prep -> Cook -> Plate & Serve).
    - Chef culinary tips (`tips`).
    - Multi-layer image fallback mechanism (Local SQLite asset -> Unsplash fallback -> Limón placeholder).

- [x] **Quick Filter System:**
  - Filter by cuisine country: Vietnam, Japan, Korea, Thailand, Italy, and 10 additional world cuisines.
  - Filter by cooking time: Quick (< 20 mins), Elaborate (>= 20 mins), or All.
  - Filter by spiciness: Mild / Non-spicy, Spicy (Levels 1-3), or All.
  - Filter by difficulty: Easy, Medium, Advanced.

- [x] **7-Day Swipe Exclusion Mechanism:**
  - Tracks swiped dishes (both LIKE and SKIP) in `localStorage` (`yumyum_swiped_history: { [dish_id]: timestamp }`).
  - Automatically identifies dishes swiped within the last 7 days and sends `exclude_ids` to Backend API `GET /api/v1/dishes/random`.
  - Automatically prunes records older than 7 days to reclaim storage and reintroduce dishes over time.
  - Gracefully handles empty results (`[]`) when all available dishes for active filters have been viewed.

- [x] **Brand Landing Page & Logo Navigation:**
  - Built `LandingPage.jsx`: Eye-catching hero banner, product tagline ("Tinder for Food - What should I eat today?"), 3-step process overview (Filter -> Swipe -> Cook), featured dish showcase, and primary CTA ("Start Swiping / Log In").
  - Universal Navigation: Clicking the brand logo on the Header / Navbar at any time navigates immediately to the Landing Page.

- [x] **Mandatory Login Flow (Auth Gate):**
  - Unauthenticated visitors landing on the site remain on the **Landing Page**.
  - Disables guest swiping to ensure saved collections and 7-day exclusion histories remain bound to user accounts.
  - Clicking "Start Swiping" CTA or the Swipe Deck tab automatically prompts the `AuthModal` (Login / Sign Up).
  - Successful authentication immediately redirects the user into the active Swipe Deck.
  - Clicking Log Out clears the session and returns directly to the Landing Page.

- [x] **Infinite Deck — Seamless Background Prefetching (Lag-Free & Zero-Latency):**
  - Optimal resource management: Avoids loading hundreds of dishes at once to protect DOM performance and RAM.
  - **Background Prefetching:** When the remaining cards in `CardStack.jsx` drop to `<= 3`, the Frontend silently queries the API for 10 more dishes (`limit=10&exclude_ids=...`) and appends them to the queue.
  - Users can swipe infinitely without hitting an empty screen, maintaining a silky-smooth 60 FPS (Framer Motion renders at most 3 layered cards on screen).
  - Background image preloading (Asset Pre-buffering) eliminates blank image flicker.

- [x] **Official Brand Identity & Logo:**
  - Replaced temporary placeholder icons with the official YumYumPick vector brand logo.
  - Synchronized across the Header / Navbar, browser Favicon, and Landing Page Hero.

- [x] **Italian Cuisine Flag Mapping Fix:**
  - Updated `CUISINE_FLAGS` dictionary in `SwipeCard.jsx` to map `'Italy': '🇮🇹'` and `'Ý': '🇮🇹'` so Italian dishes (Pizza Margherita, Pasta Bolognese, Carbonara, Risotto) correctly display the Italian flag 🇮🇹 instead of falling back to the generic globe `🌏`.

---

## 2. Data Preparation Checklist

- [x] **Data Taxonomy & Schema Specification:**
  - Standardized JSON seed dataset `backend/app/data/dishes_seed.json` with complete fields: `id`, `name`, `english_name`, `cuisine`, `cook_time_minutes`, `prep_time_minutes`, `difficulty`, `spicy_level`, `calories_approx`, `image`, `short_description`, `ingredients` (name, amount, unit, category), `steps` (step_number, title, description), and `tips`.
- [x] **Curation of 1,100 Real-Food Dishes with Offline Photography (100% Complete):**
  - [x] **Vietnamese Cuisine:** Pho, Broken Rice with Grilled Pork Chop, Bun Cha, Sizzling Pan Bread, Bun Bo Hue, Fresh Spring Rolls, Sweet & Sour Fish Soup, Banh Xeo, Beef Stew, Egg Rolls, Claypot Caramelized Fish, and 100+ local authentic regional specialties.
  - [x] **Korean Cuisine:** Bibimbap, Kimchi Jjigae, Tteokbokki, Beef Bulgogi, Japchae, Yangnyeom Fried Chicken, Seaweed Soup, Samgyeopsal, Jajangmyeon, Jjamppong, Galbitang, and traditional banchan.
  - [x] **Japanese Cuisine:** Chashu Ramen, Beef Curry Rice, Gyudon, Beef Teriyaki Udon, Tamagoyaki, Unadon, Okonomiyaki, Karaage, Tonkatsu, Oyakodon, Salmon Sushi, Cold Soba, Takoyaki, and Gyoza.
  - [x] **Thai Cuisine:** Shrimp Pad Thai, Tom Yum Goong, Pad Krapow, Som Tum Papaya Salad, Green Chicken Curry, Pineapple Fried Rice, Tom Kha Gai, Mango Sticky Rice, Massaman Curry, and Khao Soi.
  - [x] **Italian & European Cuisine:** Pasta Bolognese, Carbonara, Pizza Margherita, Black Pepper Beef Tenderloin, Minestrone, Truffle Risotto, Arrabbiata, Lasagna, French Onion Soup, and Chicken Piccata.
  - [x] **10 Additional World Cuisines:** Chinese, Mexican, Indian, French, Spanish, American, Mediterranean, German, British, and Southeast Asian specialties.
- [x] **Pre-seeded Database & Offline Assets:**
  - [x] **Pre-seeded SQLite Database:** `backend/yumyumpick.db` (1,100 dishes, ingredients, cooking steps, WAL configuration, test accounts `demo`/`123`).
  - [x] **Offline High-Res Image Cache:** `backend/images/dishes/<id>.jpg` served locally through FastAPI static mounting.
  - [x] **Master Seed Dataset:** `backend/app/data/dishes_seed.json`.
  - [x] **Helper Script Cleanup:** Pruned redundant temporary scrapers and scripts to keep the production repository clean and lean.

---

## 3. 5-Day Parallel Sprint Plan

```
        DAY 1                   DAY 2                   DAY 3                   DAY 4                   DAY 5
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Setup & Schema  │    │ Parallel Coding  │    │  API Integration │    │  Liked & Recipe  │    │  Testing & Demo  │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│• Finalize Schema │    │• BE: Auth & Dish │    │• Wire FE to BE   │    │• Liked dishes    │    │• Regression Test │
│• SQLite WAL DDL  │    │• FE1: Card+Intro │    │• SQLite save     │    │  list & unlike   │• Bug fixing      │
│• Init FE & BE    │    │• FE2: Liked/Recip│    │• Responsive view │    │• Checkbox steps  │• Slides & Demo   │
│• Seed sample data│    │• FE3: Auth/Filter│    │• PC shortcuts    │    │  & chef tips     │  rehearsals      │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Day 1: Environment Setup & API Contracts
- [x] **Minh Đức (Lead, Data & QA):** Handed off SQLite DB `yumyumpick.db` (1,100 dishes, offline images) and technical specs; facilitated API Contract finalization.
- [x] **Ánh Dương (Backend 1):** Configured FastAPI server, CORS rules, static `/images` mounting; provided mock data contracts.
- [x] **Đăng Huy (Backend 2):** Initialized SQLAlchemy ORM models (`Dish`, `Ingredient`, `CookingStep`, `UserSavedDish`) connecting to `backend/yumyumpick.db`.
- [x] **Quang Huy (Frontend 1):** Initialized React project (Vite + Tailwind CSS + Framer Motion); setup component architecture and swipe card container.
- [x] **Tùng Dương (Frontend 2):** Scaffolding dish detail and collection views: `LikedDishesView.jsx` and `DishDetailModal.jsx`.
- [x] **Luân (Frontend 3 & Pitching Lead):** Built application layout, Header/Navbar, and `localStorage` session state; prepared presentation outline (12-15 slides).

### Day 2: Parallel Independent Coding
- [ ] **Minh Đức:** Facilitated Daily Standup at 09:00; developed cross-platform Test Matrix (20 Test Cases) for PC and Mobile.
- [x] **Ánh Dương:** Built `POST /api/v1/auth/signup` and `POST /api/v1/auth/login` connected to SQLite.
- [x] **Đăng Huy:** Built `GET /api/v1/dishes/random` (supporting cuisine, spiciness, cook time, and `exclude_ids`) and `GET /api/v1/dishes/{dish_id}`.
- [x] **Quang Huy:** Completed `SwipeCard.jsx` & `CardStack.jsx` with Framer Motion (rendering photos, badges, description intro, gesture dragging, YUMMY/NOPE stamps, spring physics).
- [x] **Tùng Dương:** Built `LikedDishesView.jsx` (grid view, unlike action) and `DishDetailModal.jsx` (interactive ingredient checklist, cooking steps, chef tips).
- [x] **Luân:** Built `AuthModal.jsx` and `FilterModal.jsx`; drafted slide deck incorporating culinary photography.

### Day 3: API Integration & Cross-Platform Responsive Layouts
- [x] **Minh Đức:** Facilitated Daily Standup at 09:00; supervised API integration between Frontend and Backend; verified SQLite data integrity.
- [x] **Ánh Dương + Luân:** Integrated `AuthModal.jsx` with Simple Auth API; verified session restoration on page reload (F5).
- [x] **Đăng Huy + Quang Huy:** Connected random dish query API with swipe cards and wired `POST /api/v1/saved-dishes` on right-swipes (LIKE).
- [x] **Quang Huy:** Refined responsive layouts: full-width touch-friendly interface on mobile and centered 420x600px deck with arrow keys on desktop PC.
- [x] **Luân:** Integrated `FilterModal.jsx` with backend query parameters; completed technical architecture and data slides.
- [x] **Tùng Dương:** Integrated `LikedDishesView.jsx` with `GET /api/v1/saved-dishes/{user_id}` to retrieve saved dishes from SQLite (with skeleton loading states).

### Day 4: Liked Collection, Recipe Details, 7-Day Exclusion & UX Polish
- [ ] **Minh Đức:** Executed comprehensive cross-device QA testing on PC and physical mobile devices over LAN; audited 7-day exclusion mechanism (`exclude_ids`).
- [x] **Đăng Huy:** Completed `GET /api/v1/saved-dishes/{user_id}`, `DELETE /api/v1/saved-dishes/{user_id}/{dish_id}`, and filter metadata API; optimized query indexing.
- [x] **Ánh Dương:** Optimized SQLite concurrency with WAL mode to prevent file locking; ensured static image response latency under 50ms; secured Auth Gate redirects.
- [x] **Quang Huy:** Bound desktop keyboard shortcuts (`←` Skip, `→` Like) with input typing guards; floating action buttons; prepared Infinite Deck prefetching and Italy flag `🇮🇹`.
- [x] **Tùng Dương:** Completed `LikedDishesView.jsx` (16-country filter pill bar, instant unlike) and `DishDetailModal.jsx` (interactive ingredient preparation checklist, cooking steps, chef tips, multi-tier image fallback).
- [x] **Luân:** Polished Header, Filter Modal, and Auth Modal UI/UX; built Landing Page and Auth Gate flow (mandatory login, logo click navigation); updated official brand logo.
- [x] **Minh Đức + Core FE:** Finalized rolling 7-day exclusion window in `swipeHistory.js` and `localStorage`.

### Day 5: Comprehensive QA, Infinite Deck, Final Rehearsals & Reporting
- [x] **Luân:** Polished `LandingPage.jsx`, wired Header Logo navigation to Landing Page, applied official brand identity, and verified Auth Gate flow.
- [x] **Quang Huy:** Implemented Infinite Deck background prefetching in `CardStack.jsx` and `App.jsx` (auto-fetching 10 dishes when <= 3 cards remain) and updated Italy flag mapping.
- [ ] **Minh Đức:** Execute 20 regression test cases to verify 0 defects; validate product against Definition of Done (DoD) criteria.
- [ ] **Whole Team (Minh Đức, Ánh Dương, Đăng Huy, Quang Huy, Tùng Dương, Luân):** Complete smooth end-to-end integration walkthrough:
  - Visitor lands on Landing Page -> Click Start -> Sign Up / Log In -> Infinite Swipe Deck -> 7-day exclusion -> Filter modification -> Save dish -> View Recipe Details -> Click Logo to return home.
- [ ] **Luân:** Compile defense Q&A Cheat Sheet; present project report with completed slide deck.
- [ ] **Whole Team:** Ready for project defense and presentation!

---

## 4. Named Team Roles & Ownership (6 Members)

1. **Minh Đức — Project Lead, Data Architect & QA Lead:**
   - 5-day sprint coordination, Daily Standups.
   - Managing 1,100 dishes, 1,100 offline images, and SQLite DB `yumyumpick.db`.
   - Comprehensive cross-device quality assurance across PC and mobile over LAN.
   - Verifying 7-day exclusion logic (`exclude_ids`) and Auth Gate flow.
2. **Ánh Dương — Backend Engineer 1:**
   - FastAPI server configuration, CORS, and static `/images` mounting.
   - Building Simple Auth APIs (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`).
   - Mock data contracts for frontend decoupling.
   - Concurrency lock optimization for SQLite WAL mode.
3. **Đăng Huy — Backend Engineer 2:** *(100% Completed)*
   - [x] Built Dishes Core API (`GET /api/v1/dishes/random`, 15-cuisine filter, spiciness, cook time, difficulty, `exclude_ids`).
   - [x] Built Saved Dishes API (`POST`, `GET`, `DELETE` with SQLite persistence).
   - [x] Optimized random queries to power Infinite Deck prefetching batches.
4. **Quang Huy — Frontend Engineer 1 (Swipe Deck & Motion):**
   - Built Framer Motion Swipe Deck (`SwipeCard.jsx`, `CardStack.jsx`, stamp badges, spring physics).
   - Card face integration with photography, metadata badges, and description intro.
   - Built **Infinite Deck**: background auto-prefetching when <= 3 cards remain (keeping DOM light and swiping uninterrupted).
   - Updated Italian flag mapping to **🇮🇹** in `SwipeCard.jsx`.
   - Optimized responsive desktop PC keyboard navigation and mobile touch gestures.
5. **Tùng Dương — Frontend Engineer 2 (Liked Dishes & Recipe Detail):**
   - Built `LikedDishesView.jsx` (saved dish grid, 16-country filter pill bar, instant unlike).
   - Built `DishDetailModal.jsx` (recipe view with interactive ingredient checklist, cooking steps, and chef tips).
   - Ensured unified Italian flag `🇮🇹` across saved cards and recipe modal.
6. **Luân — Frontend Engineer 3 & Pitching Lead (App Shell, Filter, Auth & Presentation):**
   - Built application layout, Header/Navbar, `AuthModal.jsx` (`localStorage` session), and `FilterModal.jsx` (cuisine & difficulty filters).
   - Built **Landing Page** and wired universal Logo click navigation.
   - Built **Auth Gate**: Mandatory authentication before entering the swipe deck.
   - Integrated official YumYumPick brand logo across Header, Favicon, and Landing Page.
   - Designed 12-15 slide presentation deck and prepared live demo script.
