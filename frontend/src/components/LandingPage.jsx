import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Filter, Layers, ChefHat, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { API_BASE_URL } from '../config/api';

const toImageUrl = (img) => {
  if (!img) return null;
  return img.startsWith('http') ? img : `${API_BASE_URL}${img}`;
};

function LandingPage({ onStart }) {
  const [previewDishes, setPreviewDishes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Lấy 10 món ngẫu nhiên: dùng cho ảnh nền + card demo
  useEffect(() => {
    let mounted = true;
    api.getRandomDishes({ limit: 10 }).then((dishes) => {
      if (mounted && Array.isArray(dishes)) {
        setPreviewDishes(dishes.filter((d) => d.image));
      }
    });
    return () => { mounted = false; };
  }, []);

  // Mỗi 4 giây (khớp 1 vòng animation) đổi sang món tiếp theo
  useEffect(() => {
    if (previewDishes.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % previewDishes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [previewDishes]);

  const activeDish = previewDishes[activeIndex];
  const bgImages = previewDishes.map((d) => toImageUrl(d.image)).filter(Boolean);

  return (
    <div className="relative flex-1 flex flex-col bg-[#1d0b0d] text-[#fcf9f0] overflow-hidden">

      {/* BACKGROUND FOOD COLLAGE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 h-full opacity-[0.12]">
          {bgImages.concat(bgImages).slice(0, 24).map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-[#dbe2dc]/10">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d0b0d] via-[#1d0b0d]/85 to-[#1d0b0d]" />
      </div>

      {/* MINI NAV — logo căn giữa */}
      <nav className="relative z-10 flex items-center justify-center px-4 sm:px-10 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[1px] bg-[#f7ea48] flex items-center justify-center text-[#1d0b0d]">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-wider">
            YumYum<span className="text-[#f7ea48]">Pick</span>
          </span>
        </div>
      </nav>

      {/* HERO SPLIT */}
      <section className="relative z-10 flex-1 flex flex-col lg:flex-row items-center gap-10 px-6 sm:px-10 py-10 max-w-6xl mx-auto w-full">
        {/* LEFT: TEXT */}
        <div className="flex-1 flex flex-col items-start text-left">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#f7ea48]/40 text-[#f7ea48] text-[10px] font-bold uppercase tracking-widest mb-5">
            <Sparkles className="w-3 h-3" /> 1100+ món ăn đang chờ bạn
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight font-heading mb-4">
            Hết ý tưởng?<br />
            <span className="text-[#f7ea48]">Quẹt là ra món</span>
          </h1>

          <p className="text-sm sm:text-base text-[#dbe2dc]/75 leading-relaxed mb-8 max-w-md">
            YumYumPick giúp bạn thoát khỏi câu hỏi muôn đời "Hôm nay ăn gì?" —
            chỉ cần lọc theo sở thích, quẹt để chọn, và có ngay công thức nấu chi tiết.
          </p>

          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-3 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-sm font-extrabold uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-[#f7ea48]/10"
          >
            <span>Bắt đầu quẹt ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* RIGHT: ANIMATED SWIPE DEMO */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-64 h-80 sm:w-72 sm:h-96">
            <div className="absolute inset-0 rounded-2xl bg-[#2a1315] border border-[#dbe2dc]/15 translate-y-3 scale-95" />

            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-[#dbe2dc]/20 shadow-2xl bg-[#2a1315]"
              animate={{
                x: [0, 0, 40, 0, -40, 0],
                rotate: [0, 0, 8, 0, -8, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {activeDish ? (
                <>
                  <img
                    key={activeDish.id}
                    src={toImageUrl(activeDish.image)}
                    alt={activeDish.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-sm font-bold text-white line-clamp-1">{activeDish.name}</p>
                    <p className="text-[10px] text-white/70 uppercase tracking-wide">
                      {activeDish.cuisine}
                      {activeDish.cook_time_minutes ? ` · ${activeDish.cook_time_minutes} phút` : ''}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#dbe2dc]/30">
                  <UtensilsCrossed className="w-12 h-12" />
                </div>
              )}

              <motion.div
                className="absolute top-6 right-6 px-3 py-1 rounded-[1px] border-2 border-emerald-400 text-emerald-400 text-xs font-extrabold uppercase tracking-widest rotate-12"
                animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                Yummy
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative z-10 px-6 sm:px-10 py-14 border-t border-[#dbe2dc]/10 bg-[#1d0b0d]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#f7ea48] mb-3">Sứ mệnh của chúng tôi</h2>
          <p className="text-lg sm:text-2xl font-bold font-heading leading-snug mb-4">
            Biến việc chọn món ăn hàng ngày thành một trải nghiệm thú vị,
            không còn là gánh nặng phải suy nghĩ
          </p>
          <p className="text-sm text-[#dbe2dc]/70 leading-relaxed">
            YumYumPick ra đời để giải quyết câu hỏi tưởng chừng đơn giản nhưng gây đau đầu mỗi ngày:
            "Hôm nay ăn gì?". Chúng tôi kết hợp trải nghiệm quẹt thẻ quen thuộc với dữ liệu ẩm thực
            phong phú từ hơn 15 nền ẩm thực trên thế giới, giúp bạn tìm ra món ăn phù hợp chỉ trong vài giây -
            kèm công thức nấu chi tiết để bạn tự tay vào bếp
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 px-6 py-14 border-t border-[#dbe2dc]/10">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-[#dbe2dc]/60 mb-10">
          Cách thức hoạt động
        </h2>

        <div className="flex flex-col sm:flex-row gap-8 max-w-3xl mx-auto">
          <div className="flex-1 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-[1px] border border-[#dbe2dc]/25 flex items-center justify-center text-[#f7ea48]">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wide">1. Lọc</h3>
            <p className="text-xs text-[#dbe2dc]/70 leading-relaxed">
              Chọn quốc gia, độ cay, thời gian nấu theo ý muốn.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-[1px] border border-[#dbe2dc]/25 flex items-center justify-center text-[#f7ea48]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wide">2. Quẹt</h3>
            <p className="text-xs text-[#dbe2dc]/70 leading-relaxed">
              Vuốt phải để lưu món yêu thích, vuốt trái để bỏ qua.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-[1px] border border-[#dbe2dc]/25 flex items-center justify-center text-[#f7ea48]">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wide">3. Nấu</h3>
            <p className="text-xs text-[#dbe2dc]/70 leading-relaxed">
              Xem công thức chi tiết, nguyên liệu và mẹo từ đầu bếp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;