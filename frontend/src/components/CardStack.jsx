import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, RotateCcw, Sparkles } from "lucide-react";
import SwipeCard from "./SwipeCard";
import { swipeHistory } from "../services/swipeHistory";

/**
 * Component CardStack:
 * Quản lý ngăn xếp thẻ (tối đa 3 thẻ xếp lớp)
 * Hỗ trợ quẹt kéo chuột/touch, phím tắt PC (←, →) và cụm nút bấm nổi
 */
export default function CardStack({
  initialDishes = [],
  onLike,
  onRefresh,
  onCardSwiped,
  onPrefetch
}) {
  const [dishes, setDishes] = useState(initialDishes);
  const [exitDirection, setExitDirection] = useState("right");

  // Đồng bộ state khi danh sách thẻ thay đổi hoặc có thẻ mới được prefetch từ App.jsx
  useEffect(() => {
    setDishes((prevDishes) => {
      if (!initialDishes || initialDishes.length === 0) {
        return [];
      }
      const prevIds = new Set(prevDishes.map((d) => d.id || d.dish_id));
      const isCompletelyNew =
        prevDishes.length === 0 ||
        !initialDishes.some((d) => prevIds.has(d.id || d.dish_id));

      // Nếu là danh sách mới (do đổi bộ lọc hoặc bấm Quay lại từ đầu)
      if (isCompletelyNew) {
        return initialDishes;
      }

      // Nếu là các thẻ mới được nạp ngầm (prefetch) từ server, nối tiếp vào đuôi
      const newItems = initialDishes.filter(
        (d) => !prevIds.has(d.id || d.dish_id)
      );
      if (newItems.length > 0) {
        return [...prevDishes, ...newItems];
      }
      return prevDishes;
    });
  }, [initialDishes]);

  // Asset Pre-buffering: Tải trước hình ảnh của các thẻ tiếp theo trong hàng đợi
  useEffect(() => {
    if (dishes.length > 3) {
      dishes.slice(3, 7).forEach((dish) => {
        const src = dish.image || dish.image_url;
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    }
  }, [dishes]);

  // Kiểm tra ngưỡng Watermark: khi số thẻ còn lại <= 3, tự động gọi prefetch ngầm
  useEffect(() => {
    if (dishes.length > 0 && dishes.length <= 3 && onPrefetch) {
      onPrefetch(dishes);
    }
  }, [dishes, onPrefetch]);

  // Xử lý khi quẹt thẻ (direction: 'left' | 'right')
  const handleSwipe = useCallback((direction, dish) => {
    setExitDirection(direction);

    // Lưu vào lịch sử đã lướt qua (1 tuần không gặp lại)
    if (dish?.id) {
      swipeHistory.recordSwipe(dish.id);
    }

    // Loại bỏ thẻ trên cùng khỏi danh sách local và kiểm tra prefetch ngay
    setDishes((prev) => {
      const remaining = prev.filter((item) => item.id !== dish.id);
      if (remaining.length <= 3 && onPrefetch) {
        onPrefetch(remaining);
      }
      return remaining;
    });

    // Thông báo cho App.jsx để cập nhật danh sách thẻ trong RAM
    if (onCardSwiped) {
      onCardSwiped(dish);
    }

    // Nếu quẹt phải (LIKE), gọi hàm onLike để gửi API lưu món
    if (direction === "right" && onLike) {
      onLike(dish);
    }
  }, [onLike, onCardSwiped, onPrefetch]);

  // Xử lý nút bấm thủ công (bấm nút Skip hoặc Like)
  const handleButtonClick = useCallback((direction) => {
    if (dishes.length === 0) return;
    const topDish = dishes[0];
    handleSwipe(direction, topDish);
  }, [dishes, handleSwipe]);

  // Khôi phục lại toàn bộ thẻ khi hết
  const handleReset = () => {
    if (onRefresh) {
      onRefresh(); // Fetch danh sách ngẫu nhiên mới
    } else {
      setDishes(initialDishes);
    }
  };

  // Bắt sự kiện phím tắt bàn phím PC (←: Skip, →: Like)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (dishes.length === 0) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleButtonClick("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleButtonClick("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dishes, handleButtonClick]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-full px-4 select-none">
      {/* 1. KHUNG THẺ QUẸT (420px x 560px) */}
      <div className="relative w-full h-[540px] max-w-[390px] md:max-w-[420px] flex items-center justify-center">
        <AnimatePresence custom={exitDirection}>
          {dishes.length > 0 ? (
            dishes.slice(0, 3).map((dish, index) => {
              const isFront = index === 0;

              return (
                <motion.div
                  key={dish.id}
                  custom={exitDirection}
                  variants={{
                    initial: { scale: 0.9, y: 24, opacity: 0 },
                    animate: {
                      scale: 1 - index * 0.05, // Thẻ sau nhỏ dần 0.95, 0.90
                      y: index * 12, // Thẻ sau lùi xuống 12px, 24px
                      opacity: 1 - index * 0.2, // Thẻ sau mờ hơn
                      zIndex: 10 - index,
                    },
                    exit: (direction) => ({
                      x: direction === "left" ? -400 : 400,
                      opacity: 0,
                      scale: 0.85,
                      transition: { duration: 0.25 },
                    }),
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="absolute inset-0"
                >
                  <SwipeCard
                    dish={dish}
                    isFront={isFront}
                    onSwipe={handleSwipe}
                  />
                </motion.div>
              );
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
                Bạn đã lướt qua toàn bộ thực đơn. Hãy quay lại từ đầu để cân
                nhắc nhé.
              </p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-[1px] bg-lemon-zest hover:bg-white text-black-olive font-bold transition-colors uppercase tracking-neon"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                {/*RotateCcw là iconcó hình lấp lánh*/}
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
              onClick={() => handleButtonClick("left")}
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
              onClick={() => handleButtonClick("right")}
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
  );
}
