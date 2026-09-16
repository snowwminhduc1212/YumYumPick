import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  HeartCrack,
  Search,
  Trash2,
  Clock,
  Flame,
  ArrowLeft,
  Utensils,
  BookOpen,
  ChefHat,
  Sparkles,
  Filter
} from 'lucide-react'

// Country flag mapping helper
const CUISINE_FLAGS = {
  Vietnam: '🇻🇳',
  'Việt Nam': '🇻🇳',
  Korea: '🇰🇷',
  'Hàn Quốc': '🇰🇷',
  Japan: '🇯🇵',
  'Nhật Bản': '🇯🇵',
  Thailand: '🇹🇭',
  'Thái Lan': '🇹🇭',
  Italy: '🇮🇹',
  'Ý': '🇮🇹'
}

const CUISINE_FILTERS = ['Tất cả', 'Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Thái Lan', 'Ý']

export default function LikedDishesView({
  likedDishes = [],
  onSelectDish,
  onRemoveDish,
  onBackToSwipe
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('Tất cả')

  // Filter dishes by search keyword and cuisine
  const filteredDishes = useMemo(() => {
    return likedDishes.filter((dish) => {
      const matchSearch =
        dish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.english_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())

      let matchCuisine = true
      if (selectedCuisine !== 'Tất cả') {
        const c = dish.cuisine?.toLowerCase()
        if (selectedCuisine === 'Việt Nam') matchCuisine = c.includes('viet') || c.includes('việt')
        else if (selectedCuisine === 'Hàn Quốc') matchCuisine = c.includes('korea') || c.includes('hàn')
        else if (selectedCuisine === 'Nhật Bản') matchCuisine = c.includes('japan') || c.includes('nhật')
        else if (selectedCuisine === 'Thái Lan') matchCuisine = c.includes('thai') || c.includes('thái')
        else if (selectedCuisine === 'Ý') matchCuisine = c.includes('ital') || c.includes('ý')
      }

      return matchSearch && matchCuisine
    })
  }, [likedDishes, searchQuery, selectedCuisine])

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col min-h-screen">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {onBackToSwipe && (
            <button
              onClick={onBackToSwipe}
              className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-orange-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors shadow-sm cursor-pointer active:scale-90"
              title="Quay lại quẹt thẻ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-heading">
                Món Ăn Đã Lưu
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold text-xs">
                {likedDishes.length} món
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Bộ sưu tập ẩm thực yêu thích của bạn để nấu bất kỳ lúc nào
            </p>
          </div>
        </div>

        {/* Back to Swipe button for quick access */}
        {onBackToSwipe && (
          <button
            onClick={onBackToSwipe}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Quẹt thêm món</span>
          </button>
        )}
      </div>

      {/* Search Bar & Cuisine Filter Chips */}
      {likedDishes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên món, nguyên liệu, quốc gia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-stone-400 hover:text-stone-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {CUISINE_FILTERS.map((cuisine) => {
              const isActive = selectedCuisine === cuisine
              return (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                      : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {cuisine}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* CONTENT AREA: GRID OR EMPTY STATE */}
      {likedDishes.length === 0 ? (
        // Empty State: No dishes liked yet
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-stone-800/40 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 my-auto"
        >
          <div className="w-20 h-20 rounded-3xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-500 mb-4 shadow-inner">
            <HeartCrack className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-2 font-heading">
            Chưa có món ăn nào được lưu!
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed">
            Hãy quay lại màn hình chính và quẹt phải <span className="font-semibold text-emerald-600">YUMMY</span> các món ăn hấp dẫn để lưu công thức vào đây nhé!
          </p>
          {onBackToSwipe && (
            <button
              onClick={onBackToSwipe}
              className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Bắt đầu khám phá món ngon</span>
            </button>
          )}
        </motion.div>
      ) : filteredDishes.length === 0 ? (
        // Search no results state
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Không tìm thấy món nào phù hợp với từ khóa "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCuisine('Tất cả')
            }}
            className="mt-3 text-xs text-orange-500 font-bold hover:underline cursor-pointer"
          >
            Xóa bộ lọc & tìm kiếm
          </button>
        </div>
      ) : (
        // Grid of Liked Dishes
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectDish?.(dish)}
                className="group relative bg-white dark:bg-[#1E1E22] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/40 transition-all cursor-pointer flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                  <img
                    src={dish.image_url || dish.image || '/images/hero.png'}
                    alt={dish.name}
                    onError={(e) => {
                      if (dish.image_url && e.currentTarget.src !== dish.image_url) {
                        e.currentTarget.src = dish.image_url
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Cuisine Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1">
                    <span>{CUISINE_FLAGS[dish.cuisine] || '🌏'}</span>
                    <span>{dish.cuisine}</span>
                  </span>

                  {/* Delete / Unlike Button */}
                  {onRemoveDish && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveDish(dish.id)
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm active:scale-90 cursor-pointer"
                      title="Bỏ thích món này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Badges on bottom image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {dish.cook_time_minutes} phút
                    </span>
                    <span className="flex items-center gap-1 font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg text-amber-300">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {dish.spicy_level === 0 ? 'Không cay' : `Cay cấp ${dish.spicy_level}`}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-orange-500 transition-colors line-clamp-1 font-heading">
                      {dish.name}
                    </h3>
                    {dish.english_name && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic line-clamp-1 mt-0.5">
                        {dish.english_name}
                      </p>
                    )}
                    {dish.short_description && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mt-2 leading-relaxed">
                        {dish.short_description}
                      </p>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      {dish.difficulty || 'Dễ nấu'}
                    </span>
                    <span className="text-xs font-bold text-orange-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Xem công thức</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
