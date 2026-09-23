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
import { swipeHistory } from './services/swipeHistory';
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

  const [currentView, setCurrentView] = useState('landing')
  const [likedDishes, setLikedDishes] = useState([])
  const [isLoadingLiked, setIsLoadingLiked] = useState(true)

  const [swipeDishes, setSwipeDishes] = useState(MOCK_DISHES)
  const [activeFilters, setActiveFilters] = useState({})

  const fetchRandomDishes = async (filters = {}) => {
    try {
      const excludedIds = swipeHistory.getExcludedDishIds()
      const dishes = await api.getRandomDishes({
        ...filters,
        exclude_ids: excludedIds.length > 0 ? excludedIds.join(',') : undefined
      })

      if (dishes && dishes.length > 0) {
        setSwipeDishes(dishes)
      } else {
        if (excludedIds.length > 0 && !filters.cuisine && !filters.spicy_level && !filters.max_time) {
          swipeHistory.clearHistory()
          const fresh = await api.getRandomDishes(filters)
          setSwipeDishes(fresh || [])
        } else {
          setSwipeDishes([])
        }
      }
    } catch (err) {
      console.error('[App] Failed to fetch random dishes:', err)
    }
  }

  const handleRefreshDeck = async () => {
    const excludedIds = swipeHistory.getExcludedDishIds()
    try {
      const nextDishes = await api.getRandomDishes({
        ...activeFilters,
        exclude_ids: excludedIds.length > 0 ? excludedIds.join(',') : undefined
      })

      if (nextDishes && nextDishes.length > 0) {
        setSwipeDishes(nextDishes)
      } else {
        swipeHistory.clearHistory()
        const fresh = await api.getRandomDishes(activeFilters)
        setSwipeDishes(fresh || [])
      }
    } catch (err) {
      console.error('[App] Failed to refresh dishes:', err)
    }
  }

  useEffect(() => {
    fetchRandomDishes()
  }, [])

  const [selectedDish, setSelectedDish] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

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
      setCurrentView('swipe')
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1d0b0d] text-[#fcf9f0] transition-colors font-sans">
      {/* GLOBAL NAVBAR — chỉ hiện khi KHÔNG ở Landing Page */}
      {currentView !== 'landing' && (
        <header className="sticky top-0 z-40 bg-[#1d0b0d] border-b border-[#dbe2dc]/15 py-2.5 sm:py-3 px-3 sm:px-8 flex items-center justify-between gap-2">
          <div
            onClick={() => setCurrentView('landing')}
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
              onClick={() => setCurrentView('liked')}
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
              title="Mở bộ lọc món ăn (Luân)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {user ? (
              <button
                onClick={() => {
                  logout()
                  setCurrentView('landing')
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
              onLike={handleToggleLike}
              onRefresh={handleRefreshDeck}
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
          setCurrentView('swipe')
        }}
      />
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        metadata={metadata}
        onApplyFilter={(filters) => {
          setActiveFilters(filters)
          fetchRandomDishes(filters)
        }}
      />
    </div>
  )
}

export default App