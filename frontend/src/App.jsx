import React, { useState, useEffect } from 'react'
import { MOCK_DISHES } from './data/mockDishes'
import LikedDishesView from './components/LikedDishesView'
import DishDetailModal from './components/DishDetailModal'
import AuthModal from './components/AuthModal'
import FilterModal from './components/FilterModal'
import { useAuth } from './hooks/useAuth'
import { UtensilsCrossed, Heart, Layers, SlidersHorizontal, LogIn, LogOut } from 'lucide-react'

function App() {
  const { user, logout } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  // Ensure any previous data-theme attribute is cleared
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.removeItem('yumyum_theme')
  }, [])

  // Current view: 'swipe' | 'liked'
  const [currentView, setCurrentView] = useState('liked')
  // Liked dishes state, pre-populated with first 5 dishes for immediate preview
  const [likedDishes, setLikedDishes] = useState(MOCK_DISHES.slice(0, 5))
  // Active dish for DishDetailModal
  const [selectedDish, setSelectedDish] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenDetail = (dish) => {
    setSelectedDish(dish)
    setIsModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsModalOpen(false)
  }

  const handleRemoveLiked = (dishId) => {
    setLikedDishes((prev) => prev.filter((d) => d.id !== dishId))
    if (selectedDish?.id === dishId) {
      setSelectedDish(null)
      setIsModalOpen(false)
    }
  }

  const handleToggleLike = (dish) => {
    const isAlreadyLiked = likedDishes.some((d) => d.id === dish.id)
    if (isAlreadyLiked) {
      handleRemoveLiked(dish.id)
    } else {
      setLikedDishes((prev) => [dish, ...prev])
    }
  }

  const isCurrentDishLiked = selectedDish
    ? likedDishes.some((d) => d.id === selectedDish.id)
    : false

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1d0b0d] text-[#fcf9f0] transition-colors font-sans">
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#1d0b0d]/95 backdrop-blur-md border-b border-[#dbe2dc]/15 py-3 px-4 sm:px-8 flex items-center justify-between">
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
            onSelectDish={handleOpenDetail}
            onRemoveDish={handleRemoveLiked}
            onBackToSwipe={() => setCurrentView('swipe')}
          />
        ) : (
          /* Khu vực Quẹt Thẻ (Quang Huy) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-[1px] border border-[#dbe2dc]/30 bg-[#1d0b0d] text-[#f7ea48] flex items-center justify-center mb-5 shadow-sm">
              <Layers className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold font-heading tracking-[0.06em] uppercase mb-2 text-[#fcf9f0]">
              Khu Vực Quẹt Thẻ (Swipe Deck)
            </h2>
            <p className="text-xs sm:text-sm text-[#dbe2dc]/70 mb-8 leading-relaxed tracking-[0.02em]">
              Khu vực vuốt thẻ Tinder ẩm thực do <strong>Quang Huy</strong> xây dựng. 
              Các bộ lọc quốc gia, độ cay do <strong>Luân</strong> quản lý.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                className="px-5 py-2.5 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/30 hover:border-[#f7ea48] text-[#fcf9f0] text-xs font-bold uppercase tracking-[0.04em] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Xem bộ lọc (Luân)</span>
              </button>

              <button
                onClick={() => setCurrentView('liked')}
                className="px-5 py-2.5 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-xs font-bold uppercase tracking-[0.04em] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 fill-[#1d0b0d]" />
                <span>Xem món đã thích ({likedDishes.length})</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* RECIPE DETAIL MODAL (Tùng Dương) */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        isLiked={isCurrentDishLiked}
        onToggleLike={handleToggleLike}
      />

      {/* AUTH & FILTER MODALS (Luân) */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}

export default App
