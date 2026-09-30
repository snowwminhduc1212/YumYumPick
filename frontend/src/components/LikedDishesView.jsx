import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartCrack,
  Search,
  Trash2,
  Clock,
  Flame,
  ArrowLeft,
  Utensils,
  ArrowRight
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
  'Ý': '🇮🇹',
  China: '🇨🇳',
  'Trung Quốc': '🇨🇳',
  France: '🇫🇷',
  'Pháp': '🇫🇷',
  Mexico: '🇲🇽',
  India: '🇮🇳',
  'Ấn Độ': '🇮🇳',
  USA: '🇺🇸',
  'Mỹ': '🇺🇸',
  Spain: '🇪🇸',
  'Tây Ban Nha': '🇪🇸',
  Greece: '🇬🇷',
  'Hy Lạp': '🇬🇷',
  Germany: '🇩🇪',
  'Đức': '🇩🇪',
  Turkey: '🇹🇷',
  'Thổ Nhĩ Kỳ': '🇹🇷',
  'Southeast Asia': '🇸🇬',
  'Đông Nam Á': '🇸🇬'
}

const CUISINE_MAP = {
  'Việt Nam': ['viet', 'việt'],
  'Hàn Quốc': ['korea', 'hàn'],
  'Nhật Bản': ['japan', 'nhật'],
  'Thái Lan': ['thai', 'thái'],
  'Ý': ['ital', 'ý'],
  'Trung Quốc': ['china', 'chinese', 'trung'],
  'Pháp': ['franc', 'french', 'pháp'],
  'Mexico': ['mexic'],
  'Ấn Độ': ['india', 'ấn'],
  'Mỹ': ['usa', 'us', 'mỹ', 'america'],
  'Tây Ban Nha': ['spain', 'spanish', 'tây ban nha'],
  'Hy Lạp': ['gree', 'hy lạp'],
  'Đức': ['german', 'đức'],
  'Thổ Nhĩ Kỳ': ['turk', 'thổ'],
  'Đông Nam Á': ['southeast asia', 'đông nam á']
}

function getCuisineFlag(cuisine) {
  if (!cuisine) return '🌏'
  if (CUISINE_FLAGS[cuisine]) return CUISINE_FLAGS[cuisine]
  const lower = cuisine.toLowerCase().trim()
  for (const [key, flag] of Object.entries(CUISINE_FLAGS)) {
    if (key.toLowerCase() === lower) return flag
  }
  return '🌏'
}

const CUISINE_FILTERS = [
  'Tất cả', 'Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Thái Lan', 'Ý',
  'Trung Quốc', 'Pháp', 'Mexico', 'Ấn Độ', 'Mỹ', 'Tây Ban Nha',
  'Hy Lạp', 'Đức', 'Thổ Nhĩ Kỳ', 'Đông Nam Á'
]

// Chuẩn hóa văn bản tiếng Việt để tìm kiếm không phân biệt có dấu / không dấu
function removeVietnameseDiacritics(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase()
    .trim()
}

export default function LikedDishesView({
  likedDishes = [],
  isLoading = false,
  onSelectDish,
  onRemoveDish,
  onBackToSwipe
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('Tất cả')

  // Filter dishes by search keyword (hỗ trợ cả có dấu và không dấu) and cuisine
  const filteredDishes = useMemo(() => {
    const cleanQuery = removeVietnameseDiacritics(searchQuery)

    return likedDishes.filter((dish) => {
      let matchSearch = true
      if (cleanQuery) {
        const cleanName = removeVietnameseDiacritics(dish.name)
        const cleanEnglishName = removeVietnameseDiacritics(dish.english_name)
        const cleanCuisine = removeVietnameseDiacritics(dish.cuisine)
        const cleanDesc = removeVietnameseDiacritics(dish.short_description)

        matchSearch =
          cleanName.includes(cleanQuery) ||
          cleanEnglishName.includes(cleanQuery) ||
          cleanCuisine.includes(cleanQuery) ||
          cleanDesc.includes(cleanQuery)
      }

      let matchCuisine = true
      if (selectedCuisine !== 'Tất cả') {
        const rawCuisine = dish.cuisine || dish.cuisine_id || ''
        const c = rawCuisine.toLowerCase().trim()
        const keywords = CUISINE_MAP[selectedCuisine]
        if (keywords) {
          matchCuisine = keywords.some((kw) => kw === 'us' ? (c === 'us' || c === 'usa') : c.includes(kw))
        } else {
          matchCuisine = c.includes(selectedCuisine.toLowerCase())
        }
      }

      return matchSearch && matchCuisine
    })
  }, [likedDishes, searchQuery, selectedCuisine])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col flex-1 text-[#fcf9f0] transition-colors font-sans">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#dbe2dc]/15 mb-8">
        <div className="flex items-start gap-4">
          {onBackToSwipe && (
            <button
              onClick={onBackToSwipe}
              className="p-2.5 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/30 hover:border-[#f7ea48] hover:text-[#f7ea48] text-[#fcf9f0] transition-colors cursor-pointer active:scale-95"
              title="Quay lại quẹt thẻ"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.06em] uppercase font-heading text-[#fcf9f0]">
                Món Ăn Đã Lưu
              </h1>
              <span className="px-2.5 py-0.5 rounded-[1px] border border-[#f7ea48]/60 bg-[#f7ea48]/10 text-[#f7ea48] font-mono text-xs font-semibold tracking-wider">
                {likedDishes.length} MÓN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#dbe2dc]/70 mt-1 tracking-[0.02em]">
              Bộ sưu tập ẩm thực yêu thích tuyển chọn của bạn
            </p>
          </div>
        </div>

        {/* Back to Swipe button */}
        {onBackToSwipe && (
          <button
            onClick={onBackToSwipe}
            className="self-start sm:self-auto px-5 py-2.5 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-xs font-bold tracking-[0.04em] uppercase transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Khám phá thêm</span>
          </button>
        )}
      </div>

      {/* Search Bar & Cuisine Filter Chips */}
      {likedDishes.length > 0 && (
        <div className="flex flex-col gap-4 mb-8">
          {/* Search input & Active Match Summary */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#dbe2dc]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm theo tên món, nguyên liệu, phong vị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-14 py-2.5 rounded-[1px] bg-[#1d0b0d]/70 border border-[#dbe2dc]/25 text-sm text-[#fcf9f0] placeholder-[#dbe2dc]/40 focus:outline-none focus:border-[#f7ea48] focus:ring-1 focus:ring-[#f7ea48] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#dbe2dc]/60 hover:text-[#f7ea48] absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer uppercase tracking-wider font-semibold px-1 py-0.5"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Results count & Quick reset button */}
            {(searchQuery.trim() !== '' || selectedCuisine !== 'Tất cả') && (
              <div className="flex items-center gap-2 text-xs text-[#dbe2dc]/70">
                <span>
                  Tìm thấy <strong className="text-[#f7ea48]">{filteredDishes.length}</strong> món
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCuisine('Tất cả')
                  }}
                  className="text-[#f7ea48] hover:underline uppercase text-[10px] tracking-wider font-bold cursor-pointer"
                >
                  [Đặt lại]
                </button>
              </div>
            )}
          </div>

          {/* Filter Pills row: Dedicated horizontal scrollable row with proper spacing */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2.5 pt-0.5 no-scrollbar w-full border-b border-[#dbe2dc]/10">
            {CUISINE_FILTERS.map((cuisine) => {
              const isActive = selectedCuisine === cuisine
              return (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3.5 py-2 rounded-[1px] text-xs font-semibold tracking-[0.04em] uppercase whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-[#f7ea48] text-[#1d0b0d] border border-[#f7ea48]'
                      : 'bg-[#1d0b0d]/50 text-[#fcf9f0]/80 border border-[#dbe2dc]/25 hover:border-[#f7ea48] hover:text-[#f7ea48]'
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-[#1d0b0d] border border-[#dbe2dc]/15 animate-pulse flex flex-col"
            >
              <div className="aspect-[16/10] w-full bg-[#dbe2dc]/10" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-[#dbe2dc]/15 w-3/4 rounded-[1px]" />
                <div className="h-3 bg-[#dbe2dc]/10 w-1/2 rounded-[1px]" />
                <div className="h-10 bg-[#dbe2dc]/10 w-full rounded-[1px] mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : likedDishes.length === 0 ? (
        // Empty State: No dishes liked yet
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#1d0b0d]/40 rounded-[1px] border border-dashed border-[#dbe2dc]/20 my-auto"
        >
          <div className="w-16 h-16 rounded-[1px] border border-[#dbe2dc]/30 flex items-center justify-center text-[#f7ea48] mb-5 bg-[#1d0b0d]">
            <HeartCrack className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold tracking-[0.06em] uppercase text-[#fcf9f0] mb-2 font-heading">
            Chưa Có Món Ăn Nào Được Lưu
          </h3>
          <p className="text-sm text-[#dbe2dc]/70 max-w-md mb-8 leading-relaxed tracking-[0.02em]">
            Hãy trở về khu vực quẹt thẻ và vuốt phải <span className="font-semibold text-[#f7ea48]">CHỌN</span> các món ăn hấp dẫn để lưu công thức vào thực đơn của bạn.
          </p>
          {onBackToSwipe && (
            <button
              onClick={onBackToSwipe}
              className="px-6 py-3 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-xs font-bold tracking-[0.04em] uppercase transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              <span>Khám phá món ngon ngay</span>
            </button>
          )}
        </motion.div>
      ) : filteredDishes.length === 0 ? (
        // Search no results state
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
          <p className="text-sm text-[#dbe2dc]/70 tracking-[0.02em]">
            {searchQuery && selectedCuisine !== 'Tất cả'
              ? `Không tìm thấy món ăn nào thuộc "${selectedCuisine}" phù hợp với từ khóa "${searchQuery}".`
              : searchQuery
              ? `Không tìm thấy món ăn nào phù hợp với từ khóa "${searchQuery}".`
              : `Chưa có món ăn nào thuộc nền ẩm thực "${selectedCuisine}" trong danh sách đã lưu.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCuisine('Tất cả')
            }}
            className="mt-3 text-xs text-[#f7ea48] font-bold tracking-[0.04em] uppercase hover:underline cursor-pointer"
          >
            Đặt lại bộ lọc & tìm kiếm
          </button>
        </div>
      ) : (
        // Grid of Liked Dishes (Editorial Limón Brasserie 3-Column Grid)
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                onClick={() => onSelectDish?.(dish)}
                className="group relative bg-[#1d0b0d] rounded-[0px] overflow-hidden border border-[#dbe2dc]/20 hover:border-[#f7ea48]/80 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Full-bleed Food Image Tile (No card chrome, flat editorial) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  <img
                    src={dish.image_url || dish.image || '/images/hero.png'}
                    alt={dish.name}
                    onError={(e) => {
                      if (dish.image_url && e.currentTarget.src !== dish.image_url) {
                        e.currentTarget.src = dish.image_url
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Cuisine Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/30 text-[#fcf9f0] text-[10px] font-medium tracking-wider uppercase flex items-center gap-1.5">
                    <span>{getCuisineFlag(dish.cuisine || dish.cuisine_id)}</span>
                    <span>{dish.cuisine || dish.cuisine_id}</span>
                  </span>

                  {/* Delete / Unlike Button */}
                  {onRemoveDish && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveDish(dish.id)
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-[1px] bg-[#1d0b0d] hover:bg-rose-900 border border-[#dbe2dc]/20 text-[#fcf9f0] flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                      title="Bỏ thích món này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Badges on bottom image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[#fcf9f0] text-xs">
                    <span className="flex items-center gap-1 font-mono text-[11px] bg-[#1d0b0d] px-2 py-0.5 rounded-[1px] border border-[#dbe2dc]/15">
                      <Clock className="w-3 h-3 text-[#f7ea48]" />
                      {dish.cook_time_minutes} PHÚT
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] bg-[#1d0b0d] px-2 py-0.5 rounded-[1px] border border-[#dbe2dc]/15 text-[#f7ea48]">
                      <Flame className="w-3 h-3 fill-[#f7ea48] text-[#f7ea48]" />
                      {dish.spicy_level === 0 ? 'KHÔNG CAY' : `CAY CẤP ${dish.spicy_level}`}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-[0.03em] text-[#fcf9f0] group-hover:text-[#f7ea48] transition-colors line-clamp-1 font-heading uppercase">
                      {dish.name}
                    </h3>
                    {dish.english_name && (
                      <p className="text-xs text-[#dbe2dc]/60 italic line-clamp-1 mt-0.5 tracking-wide">
                        {dish.english_name}
                      </p>
                    )}
                    {dish.short_description && (
                      <p className="text-xs text-[#dbe2dc]/80 line-clamp-2 mt-2.5 leading-relaxed tracking-[0.01em]">
                        {dish.short_description}
                      </p>
                    )}
                  </div>

                  {/* Action row with Limón Ghost Link Button */}
                  <div className="pt-3 border-t border-[#dbe2dc]/15 flex items-center justify-between">
                    <span className="text-xs font-mono tracking-wider uppercase text-[#dbe2dc]/60">
                      ĐỘ KHÓ: {dish.difficulty || 'DỄ'}
                    </span>
                    <span className="text-xs font-bold tracking-[0.04em] uppercase text-[#f7ea48] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Xem công thức</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
