import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Heart,
  Clock,
  Flame,
  ChefHat,
  Sparkles,
  Check,
  RotateCcw,
  Utensils,
  Gauge,
  Apple
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

export default function DishDetailModal({
  dish,
  isOpen,
  onClose,
  isLiked = true,
  onToggleLike
}) {
  const [activeTab, setActiveTab] = useState('ingredients') // 'ingredients' | 'steps'
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [imgSrc, setImgSrc] = useState('')

  // Sync image and reset checked ingredients when dish changes
  useEffect(() => {
    if (dish) {
      setImgSrc(dish.image_url || dish.image || '/images/hero.png')
      setCheckedIngredients({})
      setActiveTab('ingredients')
    }
  }, [dish])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen || !dish) return null

  const ingredientsList = dish.ingredients || []
  const stepsList = dish.steps || []
  const totalIngredients = ingredientsList.length
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length
  const progressPercent = totalIngredients > 0 ? Math.round((checkedCount / totalIngredients) * 100) : 0

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const toggleAllIngredients = () => {
    if (checkedCount === totalIngredients) {
      setCheckedIngredients({})
    } else {
      const all = {}
      ingredientsList.forEach((_, idx) => {
        all[idx] = true
      })
      setCheckedIngredients(all)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1C1C20] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col border border-orange-100 dark:border-stone-800"
        >
          {/* Top Hero Section */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
            <img
              src={imgSrc}
              alt={dish.name}
              onError={() => {
                if (dish.image_url && imgSrc !== dish.image_url) {
                  setImgSrc(dish.image_url)
                }
              }}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite / Like Button */}
            {onToggleLike && (
              <button
                onClick={() => onToggleLike(dish)}
                className={`absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all active:scale-90 cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/40 hover:bg-black/60 text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                <span>{isLiked ? 'Đã thích' : 'Lưu món'}</span>
              </button>
            )}

            {/* Dish Title & Country on Hero */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/90 text-white text-xs font-semibold backdrop-blur-sm">
                  <span>{CUISINE_FLAGS[dish.cuisine] || '🌏'}</span>
                  <span>{dish.cuisine}</span>
                </span>
                {dish.region && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white/90 text-xs backdrop-blur-sm">
                    {dish.region}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-amber-300 text-xs backdrop-blur-sm">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>
                    {dish.spicy_level === 0
                      ? 'Không cay'
                      : dish.spicy_level === 1
                      ? 'Cay nhẹ'
                      : dish.spicy_level === 2
                      ? 'Cay vừa'
                      : 'Rất cay'}
                  </span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight drop-shadow-md">
                {dish.name}
              </h2>
              {dish.english_name && (
                <p className="text-xs sm:text-sm text-stone-200 font-light line-clamp-1 italic mt-0.5">
                  {dish.english_name}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 divide-x divide-stone-200 dark:divide-stone-800 bg-orange-50/60 dark:bg-stone-900/60 py-3 px-2 border-b border-stone-200 dark:border-stone-800 shrink-0 text-center">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-orange-500" /> Nấu
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                {dish.cook_time_minutes}p
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-xs">
                <Apple className="w-3.5 h-3.5 text-green-500" /> Chuẩn bị
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                {dish.prep_time_minutes || 15}p
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-xs">
                <Gauge className="w-3.5 h-3.5 text-blue-500" /> Độ khó
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                {dish.difficulty || 'Dễ'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-xs">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Calo
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                {dish.calories_approx || 450} kcal
              </span>
            </div>
          </div>

          {/* Short Description */}
          {dish.short_description && (
            <div className="px-5 pt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed shrink-0">
              {dish.short_description}
            </div>
          )}

          {/* Interactive Tab Switcher */}
          <div className="flex items-center px-5 pt-3 pb-1 border-b border-stone-200 dark:border-stone-800 shrink-0 gap-6">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2 text-sm font-bold relative transition-colors cursor-pointer ${
                activeTab === 'ingredients'
                  ? 'text-orange-500'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>Nguyên liệu ({totalIngredients})</span>
              {activeTab === 'ingredients' && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('steps')}
              className={`pb-2 text-sm font-bold relative transition-colors cursor-pointer ${
                activeTab === 'steps'
                  ? 'text-orange-500'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>Cách nấu ({stepsList.length} bước)</span>
              {activeTab === 'steps' && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* TAB 1: INGREDIENTS WITH INTERACTIVE CHECKBOXES */}
            {activeTab === 'ingredients' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Progress bar & Toggle All */}
                <div className="flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200/70 dark:border-stone-800">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                      <span>Đã chuẩn bị nguyên liệu:</span>
                      <span className="font-bold text-orange-500">
                        {checkedCount}/{totalIngredients} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={toggleAllIngredients}
                    className="text-xs px-2.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-orange-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg border border-stone-300 dark:border-stone-700 font-medium transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
                  >
                    {checkedCount === totalIngredients ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                  </button>
                </div>

                {/* Checkbox List */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800/80">
                  {ingredientsList.map((item, idx) => {
                    const isChecked = !!checkedIngredients[idx]
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-orange-50/50 dark:bg-orange-950/20 text-stone-400 line-through'
                            : 'hover:bg-stone-50 dark:hover:bg-stone-900/60 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={`text-sm ${isChecked ? 'line-through opacity-70' : 'font-medium'}`}>
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {item.amount} {item.unit}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 2: COOKING STEPS */}
            {activeTab === 'steps' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {stepsList.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 hover:border-orange-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-md shadow-orange-500/20">
                      {step.step_number || idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CHEF TIPS CALLOUT */}
            {dish.tips && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-0.5">
                    Bí quyết của đầu bếp
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {dish.tips}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Button */}
          <div className="p-4 bg-stone-50 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                alert(`Bắt đầu nấu món "${dish.name}"! Chúc bạn có một bữa ăn thật ngon miệng! 🍜✨`)
              }}
              className="flex-2 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Nấu món này ngay</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
