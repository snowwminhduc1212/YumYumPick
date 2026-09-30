import React, { useState, useEffect, useRef, useCallback } from 'react'
import { api } from './services/api'
import LikedDishesView from './components/LikedDishesView'
import DishDetailModal from './components/DishDetailModal'
import AuthModal from './components/AuthModal'
import FilterModal from './components/FilterModal'
import CardStack from './components/CardStack'
import { useAuth } from './hooks/useAuth'
import { UtensilsCrossed, Heart, Layers, SlidersHorizontal, LogIn, LogOut } from 'lucide-react'
import { useFilterMetadata } from './hooks/useFilterMetadata';
import LandingPage from './components/LandingPage'

function App() {
  const { user, login, logout } = useAuth()
  const currentUserId = user?.id || 1
  const [authOpen, setAuthOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const { metadata } = useFilterMetadata();

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.removeItem('yumyum_theme')
  }, [])

  const [currentView, setCurrentView] = useState(() => {
    const saved = sessionStorage.getItem('yumyum_view')
    if (saved && user) return saved
    return user ? 'swipe' : 'landing'
  })
  const [likedDishes, setLikedDishes] = useState([])
  const [isLoadingLiked, setIsLoadingLiked] = useState(true)

  const changeView = useCallback((view) => {
    setCurrentView(view)
    sessionStorage.setItem('yumyum_view', view)
  }, [])

  const [swipeDishes, setSwipeDishes] = useState([])
  const [activeFilters, setActiveFilters] = useState({})

  // Flag kiểm soát tiến trình nạp ngầm (Infinite Prefetching)
  const isPrefetchingRef = useRef(false)
  const hasMoreRef = useRef(true)

  const fetchRandomDishes = async (filters = activeFilters) => {
    hasMoreRef.current = true
    try {
      const dishes = await api.getRandomDishes({
        ...filters,
        user_id: currentUserId,
      })

      if (dishes && dishes.length > 0) {
        setSwipeDishes(dishes)
        // Asset Pre-buffering: Tải trước hình ảnh cho 3 thẻ đầu tiên
        dishes.slice(0, 3).forEach((d) => {
          const src = d.image || d.image_url
          if (src) {
            const img = new Image()
            img.src = src
          }
        })
      } else {
        setSwipeDishes([])
        hasMoreRef.current = false
      }
    } catch (err) {
      console.error('[App] Failed to fetch random dishes:', err)
    }
  }

  // Cơ chế Infinite Deck: Tự động tải ngầm mẻ 10 món tiếp theo khi ngăn xếp còn <= 3 thẻ
  const handlePrefetchDishes = async (remainingDishes) => {
    if (isPrefetchingRef.current || !hasMoreRef.current) return
    isPrefetchingRef.current = true

    try {
      const remainingIds = (remainingDishes || []).map((d) => d.id || d.dish_id).filter(Boolean)
      const currentDeckIds = swipeDishes.map((d) => d.id || d.dish_id).filter(Boolean)
      const deckExcludedIds = Array.from(new Set([...remainingIds, ...currentDeckIds]))

      const nextDishes = await api.getRandomDishes({
        ...activeFilters,
        user_id: currentUserId,
        limit: 10,
        exclude_ids: deckExcludedIds.length > 0 ? deckExcludedIds.join(',') : undefined
      })

      const cleanNew = (nextDishes || []).filter(
        (dish) => !deckExcludedIds.includes(dish.id || dish.dish_id)
      )

      if (cleanNew && cleanNew.length > 0) {
        // Preload hình ảnh của mẻ mới nạp
        cleanNew.slice(0, 3).forEach((d) => {
          const src = d.image || d.image_url
          if (src) {
            const img = new Image()
            img.src = src
          }
        })

        // Nối mẻ mới vào đuôi danh sách thẻ hiện tại
        setSwipeDishes((prev) => {
          const existingIds = new Set(prev.map((d) => d.id || d.dish_id))
          const trulyNew = cleanNew.filter((d) => !existingIds.has(d.id || d.dish_id))
          return [...prev, ...trulyNew]
        })
      } else {
        hasMoreRef.current = false
      }
    } catch (err) {
      console.warn('[App] Prefetch error:', err)
    } finally {
      isPrefetchingRef.current = false
    }
  }

  const handleRefreshDeck = async () => {
    hasMoreRef.current = true
    isPrefetchingRef.current = false

    try {
      // Đặt lại các món đã bỏ qua để cho phép quẹt lại từ đầu
      await api.clearSkips(currentUserId)

      const nextDishes = await api.getRandomDishes({
        ...activeFilters,
        user_id: currentUserId,
      })

      if (nextDishes && nextDishes.length > 0) {
        setSwipeDishes(nextDishes)
      } else {
        setSwipeDishes([])
      }
    } catch (err) {
      console.error('[App] Failed to refresh dishes:', err)
    }
  }

  // Remove card from RAM immediately upon swipe
  const handleCardSwiped = (swipedDish) => {
    const swipedId = swipedDish.id || swipedDish.dish_id
    setSwipeDishes((prev) => prev.filter((d) => (d.id || d.dish_id) !== swipedId))
  }

  const [selectedDish, setSelectedDish] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const fetchSavedDishes = useCallback(async (userId = currentUserId) => {
    if (!userId) return
    setIsLoadingLiked(true)
    try {
      const dishes = await api.getSavedDishes(userId)
      setLikedDishes(dishes || [])
    } catch (err) {
      console.error('[App] Failed to load saved dishes:', err)
      setLikedDishes([])
    } finally {
      setIsLoadingLiked(false)
    }
  }, [currentUserId])

  // Tải danh sách món đã lưu và khởi tạo bộ thẻ khi currentUserId thay đổi (hoặc khi F5)
  useEffect(() => {
    fetchSavedDishes(currentUserId)
    fetchRandomDishes(activeFilters)
  }, [currentUserId, fetchSavedDishes])

  // Tự động tải lại danh sách đã lưu từ DB mỗi khi chuyển sang tab 'liked'
  useEffect(() => {
    if (currentView === 'liked') {
      fetchSavedDishes(currentUserId)
    }
  }, [currentView, currentUserId, fetchSavedDishes])

  const handleOpenDetail = async (dish) => {
    setSelectedDish(dish)
    setIsModalOpen(true)

    const dishId = dish.id || dish.dish_id
    if (dishId) {
      setIsLoadingDetail(true)
      try {
        const fullDetail = await api.getDishDetail(dishId)
        if (fullDetail) {
          setSelectedDish(fullDetail)
        }
      } catch (err) {
        console.error('[App] Failed to fetch dish detail:', err)
      } finally {
        setIsLoadingDetail(false)
      }
    }
  }

  const handleCloseDetail = () => {
    setIsModalOpen(false)
  }

  const handleRemoveLiked = async (dishId) => {
    setLikedDishes((prev) => prev.filter((d) => (d.id || d.dish_id) !== dishId))
    if ((selectedDish?.id || selectedDish?.dish_id) === dishId) {
      setSelectedDish(null)
      setIsModalOpen(false)
    }

    await api.unsaveDish(currentUserId, dishId)
  }

  // Swiping right is strictly additive (saves to SQLite if not already saved)
  const handleLikeDish = async (dish) => {
    const dishId = dish.id || dish.dish_id
    const isAlreadyLiked = likedDishes.some((d) => (d.id || d.dish_id) === dishId)

    if (!isAlreadyLiked) {
      setLikedDishes((prev) => [dish, ...prev])
      await api.saveDish(currentUserId, dishId)
    }
  }

  // Swiping left saves to SQLite with 7-day exclusion TTL
  const handleSkipDish = async (dish) => {
    const dishId = dish.id || dish.dish_id
    if (dishId) {
      await api.skipDish(currentUserId, dishId)
    }
  }

  // Heart toggle inside DishDetailModal
  const handleToggleLike = async (dish) => {
    const dishId = dish.id || dish.dish_id
    const isAlreadyLiked = likedDishes.some((d) => (d.id || d.dish_id) === dishId)

    if (isAlreadyLiked) {
      await handleRemoveLiked(dishId)
    } else {
      setLikedDishes((prev) => [dish, ...prev])
      await api.saveDish(currentUserId, dishId)
    }
  }

  const isCurrentDishLiked = selectedDish
    ? likedDishes.some((d) => (d.id || d.dish_id) === (selectedDish.id || selectedDish.dish_id))
    : false

  const handleRequestSwipe = () => {
    if (!user) {
      setAuthOpen(true)
    } else {
      changeView('swipe')
      setSwipeDishes((prev) => {
        const savedIds = new Set(likedDishes.map((d) => d.id || d.dish_id))
        const remaining = prev.filter((d) => !savedIds.has(d.id || d.dish_id))
        if (remaining.length <= 3) {
          fetchRandomDishes(activeFilters)
        }
        return remaining
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1d0b0d] text-[#fcf9f0] transition-colors font-sans">
      {/* GLOBAL NAVBAR — chỉ hiện khi KHÔNG ở Landing Page */}
      {currentView !== 'landing' && (
        <header className="sticky top-0 z-40 bg-[#1d0b0d] border-b border-[#dbe2dc]/15 py-2.5 sm:py-3 px-3 sm:px-8 flex items-center justify-between gap-2">
          <div
            onClick={() => changeView(user ? 'swipe' : 'landing')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[1px] bg-[#f7ea48] flex items-center justify-center text-[#1d0b0d] font-bold">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-[0.06em] uppercase font-heading leading-tight text-[#fcf9f0]">
                YumYum<span className="text-[#f7ea48]">Pick</span>
              </h1>
              <p className="hidden sm:block text-[10px] text-[#dbe2dc]/60 font-mono tracking-widest uppercase">
                Tinder for Food
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-[#1d0b0d] p-1 rounded-[1px] border border-[#dbe2dc]/25 shrink-0">
            <button
              onClick={handleRequestSwipe}
              className={`p-2 sm:px-3.5 sm:py-1.5 rounded-[1px] text-xs font-bold uppercase tracking-[0.04em] transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'swipe'
                  ? 'bg-[#f7ea48] text-[#1d0b0d]'
                  : 'text-[#dbe2dc]/70 hover:text-[#fcf9f0]'
              }`}
              title="Quẹt Thẻ"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quẹt Thẻ</span>
            </button>

            <button
              onClick={() => changeView('liked')}
              className={`p-2 sm:px-3.5 sm:py-1.5 rounded-[1px] text-xs font-bold uppercase tracking-[0.04em] transition-all flex items-center gap-1.5 cursor-pointer relative ${
                currentView === 'liked'
                  ? 'bg-[#f7ea48] text-[#1d0b0d]'
                  : 'text-[#dbe2dc]/70 hover:text-[#fcf9f0]'
              }`}
              title="Món Đã Lưu"
            >
              <Heart className={`w-3.5 h-3.5 ${likedDishes.length > 0 ? (currentView === 'liked' ? 'fill-[#1d0b0d]' : 'fill-[#f7ea48] text-[#f7ea48]') : ''}`} />
              <span className="hidden sm:inline">Đã Lưu</span>
              {likedDishes.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-[1px] text-[10px] font-mono font-bold ${
                  currentView === 'liked' ? 'bg-[#1d0b0d] text-[#f7ea48]' : 'bg-[#f7ea48] text-[#1d0b0d]'
                }`}>
                  {likedDishes.length}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setFilterOpen(true)}
              className="p-2.5 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/25 hover:border-[#f7ea48] hover:text-[#f7ea48] text-[#fcf9f0] transition-colors cursor-pointer"
              title="Mở bộ lọc món ăn"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {user ? (
              <button
                onClick={() => {
                  logout()
                  setLikedDishes([])
                  sessionStorage.removeItem('yumyum_view')
                  changeView('landing')
                }}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/25 hover:border-rose-500 hover:text-rose-400 text-xs font-mono text-[#fcf9f0] transition-colors cursor-pointer"
                title={`Đăng xuất (${user.username})`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline max-w-[80px] truncate">{user.username}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-xs font-bold uppercase tracking-[0.04em] transition-transform active:scale-95 cursor-pointer"
                title="Đăng nhập / Đăng ký (Luân & Ánh Dương)"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </header>
      )}

      {/* MAIN VIEW AREA */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <LandingPage onStart={handleRequestSwipe} />
        ) : currentView === 'liked' ? (
          <LikedDishesView
            likedDishes={likedDishes}
            isLoading={isLoadingLiked}
            onSelectDish={handleOpenDetail}
            onRemoveDish={handleRemoveLiked}
            onBackToSwipe={handleRequestSwipe}
          />
        ) : (
          <section className="flex flex-1 items-center justify-center w-full my-auto py-8 relative">
            <CardStack
              initialDishes={swipeDishes}
              onLike={handleLikeDish}
              onSkip={handleSkipDish}
              onRefresh={handleRefreshDeck}
              onCardSwiped={handleCardSwiped}
              onPrefetch={handlePrefetchDishes}
            />
          </section>
        )}
      </main>

      <DishDetailModal
        key={selectedDish?.id || 'dish-detail-modal'}
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        isLiked={isCurrentDishLiked}
        onToggleLike={handleToggleLike}
        isLoadingDetail={isLoadingDetail}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(userData) => {
          login(userData)
          fetchSavedDishes(userData.id)
          changeView('swipe')
        }}
      />
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        metadata={metadata}
        initialFilters={activeFilters}
        onApplyFilter={(filters) => {
          setActiveFilters(filters)
          hasMoreRef.current = true
          fetchRandomDishes(filters)
        }}
      />
    </div>
  )
}

export default App