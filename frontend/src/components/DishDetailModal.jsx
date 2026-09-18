import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Heart,
  Clock,
  Flame,
  Sparkles,
  Check,
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
  onToggleLike,
  isLoadingDetail = false
}) {
  const [activeTab, setActiveTab] = useState('ingredients') // 'ingredients' | 'steps'
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [imageError, setImageError] = useState(false)

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

  const displayImage = !imageError && (dish.image_url || dish.image)
    ? (dish.image_url || dish.image)
    : '/images/hero.png'

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
          className="fixed inset-0 bg-black/95"
        />

        {/* Modal Window: Limón Brasserie Aesthetic with 1px border & radius */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-[#1d0b0d] text-[#fcf9f0] rounded-[1px] border border-[#dbe2dc]/30 overflow-hidden z-10 max-h-[94vh] lg:h-[88vh] flex flex-col lg:flex-row font-sans"
        >
          {/* ================= LEFT COLUMN: DISH HERO & OVERVIEW ================= */}
          <div className="w-full lg:w-[46%] xl:w-[42%] flex flex-col shrink-0 lg:border-r border-[#dbe2dc]/15 lg:overflow-y-auto">
            {/* Hero Image Section */}
            <div className="relative h-52 sm:h-64 lg:h-72 xl:h-80 w-full overflow-hidden bg-black/80 shrink-0">
              <img
                src={displayImage}
                alt={dish.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />

              {/* Mobile-only Close Button */}
              <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 w-9 h-9 rounded-[1px] bg-[#1d0b0d]/70 hover:bg-[#1d0b0d] border border-[#dbe2dc]/30 text-[#fcf9f0] flex items-center justify-center transition-colors cursor-pointer active:scale-95 z-20"
                title="Đóng (Esc)"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Favorite / Like Button */}
              {onToggleLike && (
                <button
                  onClick={() => onToggleLike(dish)}
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-[1px] border flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer z-20 ${
                    isLiked
                      ? 'bg-[#f7ea48] text-[#1d0b0d] border-[#f7ea48]'
                      : 'bg-[#1d0b0d]/90 border-[#dbe2dc]/30 text-[#fcf9f0] hover:border-[#f7ea48]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#1d0b0d]' : ''}`} />
                  <span>{isLiked ? 'Đã thích' : 'Lưu món'}</span>
                </button>
              )}

              {/* Dish Title & Badges on Hero Bottom */}
              <div className="absolute bottom-4 left-5 right-5 text-[#fcf9f0]">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[1px] bg-[#1d0b0d]/90 border border-[#dbe2dc]/20 text-[#f7ea48] text-xs font-medium uppercase tracking-wider font-mono">
                    <span>{CUISINE_FLAGS[dish.cuisine] || '🌏'}</span>
                    <span>{dish.cuisine}</span>
                  </span>
                  {dish.region && (
                    <span className="px-2 py-0.5 rounded-[1px] bg-[#1d0b0d]/80 border border-[#dbe2dc]/20 text-[#dbe2dc]/80 text-xs font-mono uppercase tracking-wider">
                      {dish.region}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[1px] bg-[#1d0b0d]/90 border border-[#dbe2dc]/20 text-[#f7ea48] text-xs font-mono uppercase tracking-wider">
                    <Flame className="w-3 h-3 fill-[#f7ea48] text-[#f7ea48]" />
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
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-[0.06em] uppercase text-[#fcf9f0] bg-[#1d0b0d] inline-block px-1">
                  {dish.name}
                </h2>
                {dish.english_name && (
                  <p className="text-xs sm:text-sm text-[#dbe2dc]/70 font-light italic line-clamp-1 mt-0.5 tracking-wide">
                    {dish.english_name}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-4 divide-x divide-[#dbe2dc]/15 bg-[#1d0b0d] py-3.5 px-3 border-b border-[#dbe2dc]/15 shrink-0 text-center font-mono">
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-[#dbe2dc]/60 text-[11px] uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-[#f7ea48]" /> Nấu
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#fcf9f0] mt-0.5">
                  {dish.cook_time_minutes}P
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-[#dbe2dc]/60 text-[11px] uppercase tracking-wider">
                  <Apple className="w-3 h-3 text-[#f7ea48]" /> Chuẩn bị
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#fcf9f0] mt-0.5">
                  {dish.prep_time_minutes || 15}P
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-[#dbe2dc]/60 text-[11px] uppercase tracking-wider">
                  <Gauge className="w-3 h-3 text-[#f7ea48]" /> Độ khó
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#fcf9f0] mt-0.5 uppercase">
                  {dish.difficulty || 'Dễ'}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-[#dbe2dc]/60 text-[11px] uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-[#f7ea48]" /> Calo
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#fcf9f0] mt-0.5">
                  {dish.calories_approx || 450} KCAL
                </span>
              </div>
            </div>

            {/* Short Description */}
            {dish.short_description && (
              <div className="p-5 text-xs sm:text-sm text-[#dbe2dc]/85 leading-relaxed tracking-[0.01em]">
                <p className="border-l-2 border-[#f7ea48] pl-3 italic text-[#fcf9f0]/90">
                  {dish.short_description}
                </p>
              </div>
            )}

            {/* Chef Tips Highlight (Desktop Left Column Extra) */}
            {dish.tips && (
              <div className="hidden lg:block p-5 mt-auto border-t border-[#dbe2dc]/15 bg-[#103b15]/15">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-[1px] bg-[#f7ea48]/20 border border-[#f7ea48] text-[#f7ea48] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-[#f7ea48] uppercase tracking-[0.05em] font-mono mb-1">
                      Mẹo ẩm thực Limón
                    </h4>
                    <p className="text-xs text-[#dbe2dc]/85 leading-relaxed">
                      {dish.tips}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT COLUMN: NGUYÊN LIỆU & CÁCH NẤU (VÀ CÁC MỤC MỞ RỘNG) ================= */}
          <div className="w-full lg:w-[54%] xl:w-[58%] flex flex-col flex-1 min-h-0 bg-[#1d0b0d]">
            {/* Header: Tab Switcher & Desktop Close Button */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-[#dbe2dc]/15 shrink-0">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-[0.04em] relative transition-colors cursor-pointer ${
                    activeTab === 'ingredients'
                      ? 'text-[#f7ea48]'
                      : 'text-[#dbe2dc]/60 hover:text-[#fcf9f0]'
                  }`}
                >
                  <span>Nguyên liệu ({totalIngredients})</span>
                  {activeTab === 'ingredients' && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f7ea48]"
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('steps')}
                  className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-[0.04em] relative transition-colors cursor-pointer ${
                    activeTab === 'steps'
                      ? 'text-[#f7ea48]'
                      : 'text-[#dbe2dc]/60 hover:text-[#fcf9f0]'
                  }`}
                >
                  <span>Cách nấu ({stepsList.length} bước)</span>
                  {activeTab === 'steps' && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f7ea48]"
                    />
                  )}
                </button>
              </div>

              {/* Desktop Close Button (Clean & Top-Right) */}
              <button
                onClick={onClose}
                className="hidden lg:flex w-8 h-8 rounded-[1px] bg-[#1d0b0d] hover:bg-[#1d0b0d]/80 border border-[#dbe2dc]/30 text-[#fcf9f0] hover:border-[#f7ea48] hover:text-[#f7ea48] items-center justify-center transition-colors cursor-pointer active:scale-95"
                title="Đóng (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body for Right Column */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {isLoadingDetail ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-2 border-[#f7ea48] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-mono uppercase tracking-widest text-[#dbe2dc]/70">
                    Đang tải công thức từ CSDL...
                  </p>
                </div>
              ) : (
                <>
                  {/* TAB 1: INGREDIENTS WITH INTERACTIVE CHECKBOXES */}
                  {activeTab === 'ingredients' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {/* Progress bar & Toggle All */}
                      <div className="flex items-center justify-between gap-4 bg-[#1d0b0d]/70 p-3.5 rounded-[1px] border border-[#dbe2dc]/20">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-mono text-[#dbe2dc]/80 mb-1.5 uppercase tracking-wider">
                        <span>Đã chuẩn bị:</span>
                        <span className="font-bold text-[#f7ea48]">
                          {checkedCount}/{totalIngredients} ({progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#dbe2dc]/15 h-1.5 rounded-[1px] overflow-hidden">
                        <motion.div
                          className="h-full bg-[#f7ea48]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.25 }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={toggleAllIngredients}
                      className="text-xs px-3 py-1.5 bg-[#1d0b0d] hover:border-[#f7ea48] text-[#fcf9f0] rounded-[1px] border border-[#dbe2dc]/30 font-mono tracking-wider uppercase transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
                    >
                      {checkedCount === totalIngredients ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                    </button>
                  </div>

                  {/* Checkbox List */}
                  <div className="divide-y divide-[#dbe2dc]/10">
                    {ingredientsList.map((item, idx) => {
                      const isChecked = !!checkedIngredients[idx]
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleIngredient(idx)}
                          className={`flex items-center justify-between py-3 px-3 rounded-[1px] cursor-pointer select-none transition-all ${
                            isChecked
                              ? 'bg-[#103b15]/20 text-[#dbe2dc]/40 line-through'
                              : 'hover:bg-[#dbe2dc]/5 text-[#fcf9f0]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-4 h-4 rounded-[1px] flex items-center justify-center border transition-all ${
                                isChecked
                                  ? 'bg-[#f7ea48] border-[#f7ea48] text-[#1d0b0d]'
                                  : 'border-[#dbe2dc]/40 bg-transparent'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={`text-sm tracking-[0.01em] ${isChecked ? 'line-through opacity-60' : 'font-medium'}`}>
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[1px] bg-[#1d0b0d] border border-[#dbe2dc]/20 text-[#dbe2dc]/80">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {stepsList.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-[1px] bg-[#1d0b0d]/60 border border-[#dbe2dc]/20 hover:border-[#f7ea48]/50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-[1px] bg-[#f7ea48] text-[#1d0b0d] font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                        {step.step_number || idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-bold tracking-[0.03em] uppercase text-[#fcf9f0]">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#dbe2dc]/80 leading-relaxed tracking-[0.01em]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* CHEF TIPS CALLOUT (Mobile View or Tab Footer) */}
              {dish.tips && (
                <div className="lg:hidden p-4 rounded-[1px] bg-[#103b15]/20 border border-[#f7ea48]/40 flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-[1px] bg-[#f7ea48]/20 border border-[#f7ea48] text-[#f7ea48] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#f7ea48] uppercase tracking-[0.04em] mb-1 font-mono">
                      Bí quyết đầu bếp
                    </h4>
                    <p className="text-xs text-[#fcf9f0]/90 leading-relaxed tracking-[0.01em]">
                      {dish.tips}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

            {/* Footer Action Button */}
            <div className="p-4 bg-[#1d0b0d] border-t border-[#dbe2dc]/15 flex items-center justify-end shrink-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-[1px] border border-[#dbe2dc]/30 hover:border-[#f7ea48] hover:text-[#f7ea48] text-[#fcf9f0] text-xs font-bold tracking-[0.04em] uppercase transition-colors cursor-pointer"
              >
                Đóng công thức
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
