import React, { useState, useEffect } from 'react'
import { api } from './services/api'
import LikedDishesView from './components/LikedDishesView'
import DishDetailModal from './components/DishDetailModal'
import AuthModal from './components/AuthModal'
import FilterModal from './components/FilterModal'
import CardStack from './components/CardStack'
import { MOCK_DISHES } from './data/mockDishes'
import { useAuth } from './hooks/useAuth'
import { UtensilsCrossed, Heart, Layers, SlidersHorizontal, LogIn, LogOut } from 'lucide-react'
import { useFilterMetadata } from './hooks/useFilterMetadata';

function App() {
  const { user, login, logout } = useAuth()
  // If not logged in, default to demo user id = 1 in SQLite database
  const currentUserId = user?.id || 1
  const [authOpen, setAuthOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const { metadata } = useFilterMetadata();


  // Ensure any previous data-theme attribute is cleared
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.removeItem('yumyum_theme')
  }, [])

  // Current view: 'swipe' | 'liked'
  const [currentView, setCurrentView] = useState('liked')
  // Liked dishes state from SQLite backend
  const [likedDishes, setLikedDishes] = useState([])
  const [isLoadingLiked, setIsLoadingLiked] = useState(true)

  // Active dish for DishDetailModal
  const [selectedDish, setSelectedDish] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  // Fetch saved dishes on initial load or whenever user session changes
  useEffect(() => {
    let isMounted = true

    api.getSavedDishes(currentUserId)
      .then((dishes) => {
        if (isMounted) {
          setLikedDishes(dishes)
          setIsLoadingLiked(false)
        }
      })
      .catch((err) => {
        console.error('[App] Failed to load saved dishes:', err)
        if (isMounted) {
          setIsLoadingLiked(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentUserId])

  const handleOpenDetail = async (dish) => {
    // Immediately open modal with existing dish preview
    setSelectedDish(dish)
    setIsModalOpen(true)

    // Fetch complete recipe details (ingredients, steps, tips) from SQLite DB
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
    // Optimistic UI update
    setLikedDishes((prev) => prev.filter((d) => (d.id || d.dish_id) !== dishId))
    if ((selectedDish?.id || selectedDish?.dish_id) === dishId) {
      setSelectedDish(null)
      setIsModalOpen(false)
    }

    // Call DELETE API in background
    await api.unsaveDish(currentUserId, dishId)
  }

  const handleToggleLike = async (dish) => {
    const dishId = dish.id || dish.dish_id
    const isAlreadyLiked = likedDishes.some((d) => (d.id || d.dish_id) === dishId)

    if (isAlreadyLiked) {
      await handleRemoveLiked(dishId)
    } else {
      // Optimistic UI update
      setLikedDishes((prev) => [dish, ...prev])
      await api.saveDish(currentUserId, dishId)
    }
  }

  const isCurrentDishLiked = selectedDish
    ? likedDishes.some((d) => (d.id || d.dish_id) === (selectedDish.id || selectedDish.dish_id))
    : false

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1d0b0d] text-[#fcf9f0] transition-colors font-sans">
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#1d0b0d] border-b border-[#dbe2dc]/15 py-3 px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('swipe')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-[1px] bg-[#f7ea48] flex items-center justify-center text-[#1d0b0d] font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-[0.06em] uppercase font-heading leading-tight text-[#fcf9f0]">
              YumYum<span className="text-[#f7ea48]">Pick</span>
            </h1>
            <p className="text-[10px] text-[#dbe2dc]/60 font-mono tracking-widest uppercase">
              Tinder for Food
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#1d0b0d] p-1 rounded-[1px] border border-[#dbe2dc]/25">
          <button
            onClick={() => setCurrentView('swipe')}
            className={`px-3.5 py-1.5 rounded-[1px] text-xs font-bold uppercase tracking-[0.04em] transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'swipe'
                ? 'bg-[#f7ea48] text-[#1d0b0d]'
                : 'text-[#dbe2dc]/70 hover:text-[#fcf9f0]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quẹt Thẻ</span>
          </button>

          <button
            onClick={() => setCurrentView('liked')}
            className={`px-3.5 py-1.5 rounded-[1px] text-xs font-bold uppercase tracking-[0.04em] transition-all flex items-center gap-1.5 cursor-pointer relative ${
              currentView === 'liked'
                ? 'bg-[#f7ea48] text-[#1d0b0d]'
                : 'text-[#dbe2dc]/70 hover:text-[#fcf9f0]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${likedDishes.length > 0 ? (currentView === 'liked' ? 'fill-[#1d0b0d]' : 'fill-[#f7ea48] text-[#f7ea48]') : ''}`} />
            <span>Đã Lưu</span>
            {likedDishes.length > 0 && (
              <span className={`ml-0.5 px-1.5 py-0.2 rounded-[1px] text-[10px] font-mono font-bold ${
                currentView === 'liked' ? 'bg-[#1d0b0d] text-[#f7ea48]' : 'bg-[#f7ea48] text-[#1d0b0d]'
              }`}>
                {likedDishes.length}
              </span>
            )}
          </button>
        </nav>

        {/* Auth + Filter controls (Tích hợp công việc của Luân) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/25 hover:border-[#f7ea48] hover:text-[#f7ea48] text-[#fcf9f0] transition-colors cursor-pointer"
            title="Mở bộ lọc món ăn (Luân)"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/25 hover:border-rose-500 hover:text-rose-400 text-xs font-mono text-[#fcf9f0] transition-colors cursor-pointer"
              title="Đăng xuất tài khoản"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{user.username}</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-xs font-bold uppercase tracking-[0.04em] transition-transform active:scale-95 cursor-pointer"
              title="Đăng nhập / Đăng ký (Luân & Ánh Dương)"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 flex flex-col">
        {currentView === 'liked' ? (
          <LikedDishesView
            likedDishes={likedDishes}
            isLoading={isLoadingLiked}
            onSelectDish={handleOpenDetail}
            onRemoveDish={handleRemoveLiked}
            onBackToSwipe={() => setCurrentView('swipe')}
          />
        ) : (
          /* Khu vực Quẹt Thẻ (Quang Huy) */
          <section className="flex flex-1 items-center justify-center w-full my-auto py-8 relative">
            <CardStack initialDishes={MOCK_DISHES} />
          </section>
        )}
      </main>

      {/* RECIPE DETAIL MODAL (Tùng Dương) */}
      <DishDetailModal
        key={selectedDish?.id || 'dish-detail-modal'}
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        isLiked={isCurrentDishLiked}
        onToggleLike={handleToggleLike}
        isLoadingDetail={isLoadingDetail}
      />

           {/* AUTH & FILTER MODALS (Luân) */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={login}
      />
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        metadata={metadata}
        onApplyFilter={(filters) => console.log('Filter áp dụng:', filters)}
      />
    </div>
  )
}

export default App
