import React, { useState } from 'react'
import { MOCK_DISHES } from './data/mockDishes'
import LikedDishesView from './components/LikedDishesView'
import DishDetailModal from './components/DishDetailModal'
import { UtensilsCrossed, Heart, Layers } from 'lucide-react'

function App() {
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
    <div className="flex flex-col min-h-screen w-full bg-[#FFFDF9] dark:bg-[#121214] text-stone-900 dark:text-stone-100 transition-colors font-sans">
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1C1C20]/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 py-3 px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('swipe')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight font-heading leading-tight">
              YumYum<span className="text-orange-500">Pick</span>
            </h1>
            <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase">
              Tinder for Food
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900/80 p-1 rounded-xl border border-stone-200/70 dark:border-stone-800">
          <button
            onClick={() => setCurrentView('swipe')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'swipe'
                ? 'bg-white dark:bg-stone-800 text-orange-500 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quẹt Thẻ</span>
          </button>

          <button
            onClick={() => setCurrentView('liked')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
              currentView === 'liked'
                ? 'bg-white dark:bg-stone-800 text-orange-500 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${likedDishes.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Đã Lưu</span>
            {likedDishes.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {likedDishes.length}
              </span>
            )}
          </button>
        </nav>
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
          /* Placeholder for Quang Huy's Swipe Deck */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center mb-4 shadow-md">
              <Layers className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold font-heading mb-1">
              Khu Vực Quẹt Thẻ (Swipe Deck)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
              Phần vuốt thẻ với Framer Motion & Spring Physics do Quang Huy đảm nhiệm.
              Nhấn nút bên dưới để chuyển sang màn hình danh sách món đã thích của bạn.
            </p>

            <button
              onClick={() => setCurrentView('liked')}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Xem danh sách món đã thích ({likedDishes.length})</span>
            </button>
          </div>
        )}
      </main>

      {/* RECIPE DETAIL MODAL */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        isLiked={isCurrentDishLiked}
        onToggleLike={handleToggleLike}
      />
    </div>
  )
}

export default App
