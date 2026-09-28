import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Clock, Flame, Sparkles } from 'lucide-react'

// Country flag mapping helper
const CUISINE_FLAGS = {
  'Vietnam': '🇻🇳',
  'Việt Nam': '🇻🇳',
  'Korea': '🇰🇷',
  'Hàn Quốc': '🇰🇷',
  'Japan': '🇯🇵',
  'Nhật Bản': '🇯🇵',
  'Thailand': '🇹🇭',
  'Thái Lan': '🇹🇭',
  'Italy': '🇮🇹',
  'Ý': '🇮🇹',
  'China': '🇨🇳',
  'Trung Quốc': '🇨🇳',
  'France': '🇫🇷',
  'Pháp': '🇫🇷',
  'Mexico': '🇲🇽',
  'India': '🇮🇳',
  'Ấn Độ': '🇮🇳',
  'USA': '🇺🇸',
  'Mỹ': '🇺🇸',
  'Spain': '🇪🇸',
  'Tây Ban Nha': '🇪🇸',
  'Greece': '🇬🇷',
  'Hy Lạp': '🇬🇷',
  'Germany': '🇩🇪',
  'Đức': '🇩🇪',
  'Turkey': '🇹🇷',
  'Thổ Nhĩ Kỳ': '🇹🇷',
  'Southeast Asia': '🇸🇬',
  'Đông Nam Á': '🇸🇬',
  'Western': '🌍',
  'Phương Tây': '🌍'
}

/**
 * Component SwipeCard: Thẻ món ăn hỗ trợ kéo thả (Framer Motion)
 * Tuân thủ quy chuẩn cử chỉ Tinder:
 * - rotate = x / 15
 * - Ngưỡng quẹt: |x| > 120px
 * - Stamp YUMMY! (phải) và NOPE (trái)
 */
export default function SwipeCard({ dish, isFront, onSwipe }) {
  const x = useMotionValue(0)

  // Góc nghiêng động theo độ kéo x: rotate = x / 15
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18])

  // Độ mờ của Stamp phản hồi theo độ kéo x
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1])

  // Xử lý khi người dùng thả tay / buông chuột
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    // Kéo sang phải > 120px hoặc vung tay nhanh sang phải
    if (offset > 120 || velocity > 500) {
      onSwipe('right', dish)
    }
    // Kéo sang trái < -120px hoặc vung tay nhanh sang trái
    else if (offset < -120 || velocity < -500) {
      onSwipe('left', dish)
    }
  }

  // Cấp độ cay thành các biểu tượng ớt
  const renderSpicy = (level) => {
    if (!level || level === 0) return 'Không cay'
    return '🌶️'.repeat(level)
  }

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 10 : 0,
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={isFront ? { cursor: 'grabbing' } : undefined}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-full rounded-none overflow-hidden bg-black-olive border border-sage-mist flex flex-col justify-between">

        {/* 1. ẢNH MÓN ĂN */}
        <div className="relative w-full h-3/5 overflow-hidden bg-black-olive border-b border-sage-mist/20">
          <img
            src={dish.image_url || dish.image}
            alt={dish.name}
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              // Fallback nếu ảnh không tải được
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
            }}
          />

          {/* Huy hiệu Quốc gia góc trên */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] bg-black-olive text-warm-cream border border-sage-mist text-[10px] font-semibold uppercase tracking-stenciled">
            <span className="text-xs">{CUISINE_FLAGS[dish.cuisine] || '🌏'}</span>
            <span>{dish.cuisine}</span>
          </div>

          {/* STAMP YUMMY! (Hiện khi kéo sang PHẢI) */}
          {isFront && (
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 -rotate-12 border-[3px] border-lemon-zest text-lemon-zest font-extrabold text-2xl md:text-3xl px-4 py-1.5 rounded-[1px] uppercase tracking-neon bg-black-olive pointer-events-none"
            >
              YUMMY! ❤️
            </motion.div>
          )}

          {/* STAMP NOPE (Hiện khi kéo sang TRÁI) */}
          {isFront && (
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-6 right-6 rotate-12 border-[3px] border-pure-white text-pure-white font-extrabold text-2xl md:text-3xl px-4 py-1.5 rounded-[1px] uppercase tracking-neon bg-black-olive pointer-events-none"
            >
              NOPE! ✘
            </motion.div>
          )}

          {/* Tên món nằm trên phần chân ảnh (nền solid flat) */}
          <div className="absolute bottom-0 left-0 right-0 bg-black-olive p-4 border-t border-sage-mist">
            <h2 className="text-[28px] font-bold tracking-neon leading-none text-warm-cream">
              {dish.name}
            </h2>
            <p className="text-[11px] text-sage-mist font-medium tracking-stenciled uppercase truncate mt-2">
              {dish.english_name}
            </p>
          </div>
        </div>

        {/* 2. HUY HIỆU THÔNG SỐ (BADGES) */}
        <div className="p-5 flex flex-col justify-between flex-1 gap-3">
          <div className="flex items-center justify-between gap-1.5 text-[11px] text-warm-cream uppercase tracking-wider font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] border border-sage-mist/20 bg-forest-ink/30">
              <Clock className="w-3.5 h-3.5 text-lemon-zest" />
              <span>{dish.cook_time_minutes}p</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] border border-sage-mist/20 bg-forest-ink/30">
              <Flame className="w-3.5 h-3.5 text-lemon-zest" />
              <span>{dish.calories_approx} kcal</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] border border-sage-mist/20 bg-forest-ink/30">
              <span>{renderSpicy(dish.spicy_level)}</span>
            </div>
          </div>

          {/* 3. DESCRIPTION INTRO */}
          <div className="p-4 rounded-[1px] bg-black-olive border border-sage-mist/10 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-lemon-zest uppercase tracking-stenciled mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hương vị</span>
            </div>
            <p className="text-sm leading-relaxed text-sage-mist/90">
              {dish.short_description}
            </p>
          </div>

          {/* 4. ĐỘ KHÓ — dòng cuối thẻ, cùng kiểu màn Đã Lưu */}
          {dish.difficulty && (
            <div className="pt-3 border-t border-sage-mist/15 text-[11px] font-mono uppercase tracking-widest text-sage-mist">
              Độ khó: {dish.difficulty}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  )
}