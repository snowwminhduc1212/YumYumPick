import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Filter, Layers, ChefHat, ArrowRight, Sparkles, Clock, Flame } from 'lucide-react';
import { api } from '../services/api';
import { API_BASE_URL } from '../config/api';

// Mã quốc gia (theo backend) → tên tiếng Việt
const CUISINE_LABELS = {
  Vietnam: 'Việt Nam',
  Korea: 'Hàn Quốc',
  Japan: 'Nhật Bản',
  Thailand: 'Thái Lan',
  Italy: 'Ý',
  China: 'Trung Quốc',
  France: 'Pháp',
  Mexico: 'Mexico',
  India: 'Ấn Độ',
  USA: 'Mỹ',
  Spain: 'Tây Ban Nha',
  Greece: 'Hy Lạp',
  Germany: 'Đức',
  Turkey: 'Thổ Nhĩ Kỳ',
  'Southeast Asia': 'Đông Nam Á',
};

// Các tab hiển thị ở phần "Khám phá ẩm thực"
const SHOWCASE_CUISINES = ['Vietnam', 'Korea', 'Japan', 'Thailand', 'Italy', 'France', 'Mexico'];

const SPICY_LABELS = ['Không cay', 'Cay nhẹ', 'Cay vừa', 'Cay nhiều'];

const toImageUrl = (img) => {
  if (!img) return null;
  return img.startsWith('http') ? img : `${API_BASE_URL}${img}`;
};

const cuisineName = (id) => CUISINE_LABELS[id] || id;

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

function LandingPage({ onStart }) {
  const [previewDishes, setPreviewDishes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Showcase theo quốc gia
  const [activeCuisine, setActiveCuisine] = useState(SHOWCASE_CUISINES[0]);
  const [showcaseCache, setShowcaseCache] = useState({});
  const [isLoadingShowcase, setIsLoadingShowcase] = useState(false);

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

  // Tải 3 món của quốc gia đang chọn (có cache, bấm lại tab cũ không gọi API nữa)
  useEffect(() => {
    if (showcaseCache[activeCuisine]) return;
    let mounted = true;
    setIsLoadingShowcase(true);
    api.getRandomDishes({ cuisine: activeCuisine, limit: 3 })
      .then((dishes) => {
        if (mounted) {
          setShowcaseCache((prev) => ({
            ...prev,
            [activeCuisine]: Array.isArray(dishes) ? dishes : [],
          }));
        }
      })
      .finally(() => {
        if (mounted) setIsLoadingShowcase(false);
      });
    return () => { mounted = false; };
  }, [activeCuisine, showcaseCache]);

  const activeDish = previewDishes[activeIndex];
  const bgImages = previewDishes.map((d) => toImageUrl(d.image)).filter(Boolean);
  const showcaseDishes = showcaseCache[activeCuisine] || [];

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
                      {cuisineName(activeDish.cuisine)}
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

      {/* CUISINE SHOWCASE */}
      <section id="showcase" className="relative z-10 px-6 sm:px-10 py-16 border-t border-[#dbe2dc]/10 bg-[#1d0b0d]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-[#f7ea48] mb-3">
            Khám phá ẩm thực thế giới
          </h2>
          <p className="text-center text-sm text-[#dbe2dc]/60 mb-10">
            Mỗi nền ẩm thực một câu chuyện - chọn một quốc gia để xem thử vài món tiêu biểu
          </p>

          {/* Tabs quốc gia */}
          <div className="flex gap-6 sm:gap-10 overflow-x-auto pb-4 mb-8 sm:justify-center">
            {SHOWCASE_CUISINES.map((id) => {
              const isActive = id === activeCuisine;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCuisine(id)}
                  className="relative shrink-0 flex flex-col items-center gap-2 cursor-pointer"
                >
                  <span
                    className={`text-xl sm:text-3xl font-extrabold font-heading whitespace-nowrap transition-colors ${
                      isActive ? 'text-[#fcf9f0]' : 'text-[#dbe2dc]/30 hover:text-[#dbe2dc]/60'
                    }`}
                  >
                    {cuisineName(id)}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-[#f7ea48]' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Danh sách món */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {isLoadingShowcase && showcaseDishes.length === 0
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] rounded-xl bg-[#2a1315] mb-4" />
                    <div className="h-4 w-2/3 bg-[#2a1315] mb-2" />
                    <div className="h-3 w-full bg-[#2a1315]" />
                  </div>
                ))
              : showcaseDishes.map((dish) => (
                  <div key={dish.id} className="group">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#2a1315] mb-4">
                      <img
                        src={toImageUrl(dish.image)}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <h3 className="text-base font-extrabold uppercase tracking-wide line-clamp-1 mb-1">
                      {dish.name}
                    </h3>
                    {dish.english_name && (
                      <p className="text-xs italic text-[#dbe2dc]/50 line-clamp-1 mb-2">{dish.english_name}</p>
                    )}
                    <p className="text-sm text-[#dbe2dc]/70 leading-relaxed line-clamp-3 mb-3">
                      {dish.short_description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-wide text-[#dbe2dc]/50">
                      {dish.cook_time_minutes != null && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {dish.cook_time_minutes} phút
                        </span>
                      )}
                      {dish.spicy_level != null && (
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" /> {SPICY_LABELS[dish.spicy_level] || ''}
                        </span>
                      )}
                      {dish.calories_approx != null && <span>{dish.calories_approx} kcal</span>}
                    </div>
                  </div>
                ))}
          </div>

          {!isLoadingShowcase && showcaseDishes.length === 0 && (
            <p className="text-center text-sm text-[#dbe2dc]/50">Chưa tải được món cho quốc gia này</p>
          )}
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="relative z-10 px-6 sm:px-10 py-14 border-t border-[#dbe2dc]/10 bg-[#1d0b0d]">
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

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#dbe2dc]/10 bg-[#150809] px-6 sm:px-10 pt-12 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[1px] bg-[#f7ea48] flex items-center justify-center text-[#1d0b0d]">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider">
                YumYum<span className="text-[#f7ea48]">Pick</span>
              </span>
            </div>
            <p className="text-sm text-[#dbe2dc]/60 leading-relaxed">
              Tinder for Food - quẹt để tìm món, nấu để thưởng thức. Không còn phải hỏi "Hôm nay ăn gì?"
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f7ea48] mb-4">Khám phá</h4>
              <ul className="space-y-2 text-sm text-[#dbe2dc]/60">
                <li>
                  <button type="button" onClick={() => scrollToSection('showcase')} className="hover:text-[#fcf9f0] transition-colors cursor-pointer">
                    Ẩm thực thế giới
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('mission')} className="hover:text-[#fcf9f0] transition-colors cursor-pointer">
                    Sứ mệnh
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:text-[#fcf9f0] transition-colors cursor-pointer">
                    Cách hoạt động
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f7ea48] mb-4">Ẩm thực</h4>
              <ul className="space-y-2 text-sm text-[#dbe2dc]/60">
                {['Vietnam', 'Korea', 'Japan', 'Thailand', 'Italy'].map((id) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCuisine(id);
                        scrollToSection('showcase');
                      }}
                      className="hover:text-[#fcf9f0] transition-colors cursor-pointer"
                    >
                      {cuisineName(id)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#dbe2dc]/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#dbe2dc]/40">
          <span>YumYumPick - sản phẩm của nhóm 1</span>
          <span>1100+ món ăn - 15 nền ẩm thực</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;