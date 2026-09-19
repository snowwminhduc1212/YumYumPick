import React, { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Heart, RotateCcw, Sparkles } from 'lucide-react'
import SwipeCard from './SwipeCard'

/**
 * Component CardStack:
 * Quản lý ngăn xếp thẻ (tối đa 3 thẻ xếp lớp)
 * Hỗ trợ quẹt kéo chuột/touch, phím tắt PC (←, →) và cụm nút bấm nổi
 */
export default function CardStack({ initialDishes = [], onLike, onSkip, onRefresh }) {
  const [dishes, setDishes] = useState(initialDishes)
  const [history, setHistory] = useState([]) // Lưu lịch sử quẹt để phục vụ test

  // Đồng bộ danh sách thẻ khi initialDishes thay đổi từ API hoặc khi đổi bộ lọc
  useEffect(() => {
    if (initialDishes && initialDishes.length > 0) {
      setDishes(initialDishes)
    }
  }, [initialDishes])

  // Xử lý khi quẹt thẻ (direction: 'left' | 'right')
  const handleSwipe = useCallback((direction, dish) => {
    // Ghi nhận lịch sử
    setHistory((prev) => [{ dish, direction, time: new Date() }, ...prev])

    // Gọi callback tương ứng để lưu CSDL khi Like hoặc Skip
    if (direction === 'right' && onLike) {
      onLike(dish)
    } else if (direction === 'left' && onSkip) {
      onSkip(dish)
    }

    // Loại bỏ thẻ trên cùng khỏi danh sách
    setDishes((prev) => prev.filter((item) => (item.id || item.dish_id) !== (dish.id || dish.dish_id)))
  }, [onLike, onSkip])

  // Xử lý nút bấm thủ công (bấm nút Skip hoặc Like)
  const handleButtonClick = (direction) => {
    if (dishes.length === 0) return
    const topDish = dishes[0]
    handleSwipe(direction, topDish)
  }

  // Khôi phục lại toàn bộ thẻ khi hết
  const handleReset = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      setDishes(initialDishes)
    }
    setHistory([])
  }

  // Bắt sự kiện phím tắt bàn phím PC (←: Skip, →: Like)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (dishes.length === 0) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleButtonClick('left')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleButtonClick('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dishes])

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-full px-4 select-none">
      
      {/* 1. KHUNG THẺ QUẸT (420px x 560px) */}
      <div className="relative w-full h-[540px] max-w-[390px] md:max-w-[420px] flex items-center justify-center">
        <AnimatePresence>
          {dishes.length > 0 ? (
            dishes.slice(0, 3).map((dish, index) => {
              const isFront = index === 0

              return (
                <motion.div
                  key={dish.id}
                  initial={{ scale: 0.9, y: 24, opacity: 0 }}
                  animate={{
                    scale: 1 - index * 0.05, // Thẻ sau nhỏ dần 0.95, 0.90
                    y: index * 12,           // Thẻ sau lùi xuống 12px, 24px
                    opacity: 1 - index * 0.2,// Thẻ sau mờ hơn
                    zIndex: 10 - index,
                  }}
                  exit={{
                    x: history[0]?.direction === 'left' ? -400 : 400,
                    opacity: 0,
                    scale: 0.85,
                    transition: { duration: 0.25 },
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="absolute inset-0"
                >
                  <SwipeCard
                    dish={dish}
                    isFront={isFront}
                    onSwipe={handleSwipe}
                  />
                </motion.div>
              )
            })
          ) : (
            /* EMPTY STATE KHI QUẸT HẾT THẺ */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center p-8 bg-black-olive rounded-[1px] border border-sage-mist/50 w-full h-[400px]"
            >
              <div className="w-16 h-16 rounded-[1px] bg-forest-ink flex items-center justify-center text-lemon-zest mb-5 border border-sage-mist/50">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-warm-cream mb-2 tracking-stenciled uppercase">
                Hết món rồi!
              </h3>
              <p className="text-sm text-sage-mist mb-8 max-w-xs leading-relaxed">
                Bạn đã lướt qua toàn bộ thực đơn. Hãy quay lại từ đầu để cân nhắc nhé.
              </p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-[1px] bg-lemon-zest hover:bg-white text-black-olive font-bold transition-colors uppercase tracking-neon"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                <span>Quay Lại TỪ ĐẦU</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CỤM NÚT BẤM NỔI BỔ TRỢ (SKIP & LIKE) */}
      {dishes.length > 0 && (
        <div className="flex items-center justify-center gap-10 mt-6">
          {/* Nút Bỏ qua (SKIP) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => handleButtonClick('left')}
              className="w-16 h-16 rounded-[1px] bg-black-olive border-[1.5px] border-sage-mist/50 text-pure-white flex items-center justify-center hover:bg-pure-white hover:text-black-olive transition-all active:scale-90"
              aria-label="Bỏ qua"
            >
              <X className="w-7 h-7 stroke-[2.5]" />
            </button>
            <span className="text-[10px] font-medium text-sage-mist/60 uppercase tracking-stenciled hidden md:inline">
              [←] Skip
            </span>
          </div>

          {/* Nút Thích (LIKE) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => handleButtonClick('right')}
              className="w-16 h-16 rounded-[1px] bg-lemon-zest border-[1.5px] border-lemon-zest text-black-olive flex items-center justify-center hover:bg-pure-white hover:border-pure-white transition-all active:scale-90"
              aria-label="Thích món này"
            >
              <Heart className="w-7 h-7 fill-black-olive stroke-black-olive" />
            </button>
            <span className="text-[10px] font-medium text-sage-mist/60 uppercase tracking-stenciled hidden md:inline">
              [→] Like
            </span>
          </div>
        </div>
      )}

    </div>
  )
}
