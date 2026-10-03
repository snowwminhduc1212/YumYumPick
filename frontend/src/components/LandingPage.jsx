import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  Filter,
  Layers,
  ChefHat,
  ArrowRight,
  Sparkles,
  Clock,
  Flame,
  Globe2,
  ExternalLink
} from 'lucide-react';
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

// Cờ biểu tượng quốc gia
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
  'Đông Nam Á': '🇸🇬',
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

function LandingPage({ onStart, onSelectDish }) {
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

  // Mỗi 4 giây đổi sang món tiếp theo
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
  const hasCachedDishes = !!showcaseCache[activeCuisine];
  const isShowcaseLoading = !hasCachedDishes || isLoadingShowcase;
  const showcaseDishes = showcaseCache[activeCuisine] || [];

  return (
    <div className="relative flex-1 flex flex-col bg-black-olive text-warm-cream overflow-hidden font-sans">

      {/* BACKGROUND FOOD COLLAGE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 h-full opacity-10">
          {bgImages.concat(bgImages).slice(0, 24).map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-sage-mist/10">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black-olive via-black-olive/85 to-black-olive" />
      </div>

      {/* MINI NAV — logo căn giữa */}
      <nav className="relative z-10 flex items-center justify-center px-4 sm:px-10 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[1px] bg-lemon-zest flex items-center justify-center text-black-olive font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-neon font-heading text-warm-cream">
            YumYum<span className="text-lemon-zest">Pick</span>
          </span>
        </div>
      </nav>

      {/* HERO SPLIT */}
      <section className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 px-6 sm:px-10 py-10 sm:py-16 max-w-6xl mx-auto w-full">
        {/* LEFT: TEXT */}
        <div className="flex-1 flex flex-col items-start text-left">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-[1px] border border-lemon-zest/40 bg-forest-ink/20 text-lemon-zest text-[10px] font-bold uppercase tracking-neon mb-6">
            <Sparkles className="w-3.5 h-3.5" /> 1100+ món ăn đang chờ bạn
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-neon font-heading mb-5 text-warm-cream">
            Hết ý tưởng?<br />
            <span className="text-lemon-zest">Quẹt là ra món</span>
          </h1>

          <p className="text-sm sm:text-base text-sage-mist/75 leading-relaxed mb-8 max-w-lg tracking-wide">
            YumYumPick giải quyết câu hỏi muôn thuở "Hôm nay ăn gì?" —
            chỉ cần lọc theo sở thích, quẹt phải để lưu món yêu thích, và khám phá công thức nấu nướng chi tiết ngay lập tức.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-6 py-3.5 rounded-[1px] bg-lemon-zest hover:bg-pure-white text-black-olive text-xs font-extrabold uppercase tracking-neon transition-all active:scale-95 shadow-lg shadow-lemon-zest/10 cursor-pointer"
            >
              <span>Bắt đầu quẹt ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('showcase')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-[1px] bg-black-olive border border-sage-mist/30 hover:border-lemon-zest hover:text-lemon-zest text-warm-cream text-xs font-bold uppercase tracking-stenciled transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Khám phá 15+ quốc gia</span>
            </button>
          </div>
        </div>

        {/* RIGHT: ANIMATED SWIPE DEMO (Limón Brutalist Card Style) */}
        <div className="flex-1 flex items-center justify-center relative w-full max-w-sm">
          <div className="relative w-64 h-92 sm:w-72 sm:h-[400px]">
            {/* Background stacked card dummy */}
            <div className="absolute inset-0 rounded-[1px] bg-black-olive border border-sage-mist/15 translate-y-3 scale-95" />

            {/* Foreground animated card */}
            <motion.div
              className="absolute inset-0 rounded-[1px] overflow-hidden border border-sage-mist/20 bg-black-olive shadow-2xl flex flex-col justify-between"
              animate={{
                x: [0, 0, 40, 0, -40, 0],
                rotate: [0, 0, 8, 0, -8, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {activeDish ? (
                <>
                  <div className="relative w-full h-3/5 overflow-hidden bg-black-olive border-b border-sage-mist/20">
                    <img
                      key={activeDish.id}
                      src={toImageUrl(activeDish.image)}
                      alt={activeDish.name}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />

                    {/* Flag badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-[1px] bg-black-olive text-warm-cream border border-sage-mist/20 text-[10px] font-semibold uppercase tracking-stenciled">
                      <span className="text-xs">{CUISINE_FLAGS[activeDish.cuisine] || '🌏'}</span>
                      <span>{cuisineName(activeDish.cuisine)}</span>
                    </div>

                    {/* YUMMY STAMP (Quẹt sang PHẢI) */}
                    <motion.div
                      className="absolute top-5 left-5 -rotate-12 border-2 border-lemon-zest text-lemon-zest font-extrabold text-lg sm:text-xl px-3 py-1 rounded-[1px] uppercase tracking-neon bg-black-olive pointer-events-none z-10"
                      animate={{ opacity: [0, 0, 1, 0, 0, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      YUMMY! ❤️
                    </motion.div>

                    {/* NOPE STAMP (Quẹt sang TRÁI - bg-red-500) */}
                    <motion.div
                      className="absolute top-5 right-5 rotate-12 border-2 border-red-500 bg-red-500 text-white font-extrabold text-lg sm:text-xl px-3 py-1 rounded-[1px] uppercase tracking-neon pointer-events-none z-10 shadow-md shadow-red-500/20"
                      animate={{ opacity: [0, 0, 0, 0, 1, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      NOPE! ✘
                    </motion.div>
                  </div>

                  {/* Card bottom details */}
                  <div className="p-4 bg-black-olive flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-bold tracking-neon leading-tight text-warm-cream line-clamp-1 font-heading">
                        {activeDish.name}
                      </h3>
                      {activeDish.english_name && (
                        <p className="text-[10px] text-sage-mist/70 font-medium tracking-stenciled uppercase truncate mt-1">
                          {activeDish.english_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1.5 text-[10px] text-warm-cream uppercase tracking-wide font-semibold mt-2 pt-2 border-t border-sage-mist/20">
                      {activeDish.cook_time_minutes != null && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-[1px] border border-sage-mist/20 bg-forest-ink/30">
                          <Clock className="w-3 h-3 text-lemon-zest" />
                          <span>{activeDish.cook_time_minutes}p</span>
                        </div>
                      )}
                      {activeDish.calories_approx != null && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-[1px] border border-sage-mist/20 bg-forest-ink/30">
                          <Flame className="w-3 h-3 text-lemon-zest" />
                          <span>{activeDish.calories_approx} kcal</span>
                        </div>
                      )}
                      {activeDish.spicy_level != null && (
                        <div className="px-2 py-1 rounded-[1px] border border-sage-mist/20 bg-forest-ink/30">
                          <span>{SPICY_LABELS[activeDish.spicy_level] || 'Không cay'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sage-mist/30">
                  <UtensilsCrossed className="w-12 h-12" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CUISINE SHOWCASE */}
      <section id="showcase" className="relative z-10 px-6 sm:px-10 py-16 border-t border-sage-mist/20 bg-black-olive">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-neon text-lemon-zest mb-2 font-heading">
              Khám phá ẩm thực thế giới
            </h2>
            <p className="text-sm text-sage-mist/70 tracking-wide max-w-xl">
              Mỗi nền ẩm thực là một bản giao hưởng hương vị — chọn quốc gia để xem các món ăn tiêu biểu hoặc bấm vào món để xem công thức nấu
            </p>
          </div>

          {/* Tabs quốc gia */}
          <div className="flex gap-6 sm:gap-10 overflow-x-auto pb-4 mb-8 sm:justify-center no-scrollbar">
            {SHOWCASE_CUISINES.map((id) => {
              const isActive = id === activeCuisine;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCuisine(id)}
                  className="relative shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <span
                    className={`text-lg sm:text-2xl font-extrabold font-heading whitespace-nowrap transition-colors ${
                      isActive ? 'text-warm-cream' : 'text-sage-mist/40 group-hover:text-sage-mist/80'
                    }`}
                  >
                    <span className="mr-1.5 text-base">{CUISINE_FLAGS[id] || '🌏'}</span>
                    {cuisineName(id)}
                  </span>
                  <span
                    className={`w-2 h-0.5 rounded-[1px] transition-colors ${
                      isActive ? 'bg-lemon-zest' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Danh sách món */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 min-h-[440px]">
            {isShowcaseLoading
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse rounded-[1px] border border-sage-mist/20 p-4 bg-black-olive flex flex-col justify-between min-h-[420px]">
                    <div>
                      <div className="aspect-[4/3] rounded-[1px] bg-sage-mist/10 mb-4" />
                      <div className="h-4 w-2/3 bg-sage-mist/20 mb-2 rounded-[1px]" />
                      <div className="h-3 w-1/3 bg-sage-mist/15 mb-3 rounded-[1px]" />
                      <div className="h-3 w-full bg-sage-mist/10 mb-2 rounded-[1px]" />
                      <div className="h-3 w-4/5 bg-sage-mist/10 rounded-[1px]" />
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-sage-mist/15">
                      <div className="h-5 w-16 bg-sage-mist/10 rounded-[1px]" />
                      <div className="h-5 w-20 bg-sage-mist/10 rounded-[1px]" />
                    </div>
                  </div>
                ))
              : showcaseDishes.map((dish) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSelectDish?.(dish)}
                    className="group cursor-pointer rounded-[1px] border border-sage-mist/20 hover:border-lemon-zest p-4 bg-black-olive transition-all flex flex-col justify-between min-h-[420px]"
                  >
                    <div>
                      <div className="aspect-[4/3] overflow-hidden rounded-[1px] bg-black-olive border border-sage-mist/10 mb-4 relative">
                        <img
                          src={toImageUrl(dish.image)}
                          alt={dish.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-[1px] bg-black-olive/90 text-lemon-zest border border-lemon-zest text-[10px] font-bold uppercase tracking-stenciled flex items-center gap-1">
                          <span>Xem chi tiết</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>

                      <h3 className="text-base font-extrabold uppercase tracking-stenciled line-clamp-1 mb-1 text-warm-cream group-hover:text-lemon-zest transition-colors font-heading">
                        {dish.name}
                      </h3>
                      {dish.english_name && (
                        <p className="text-xs italic text-sage-mist/50 line-clamp-1 mb-2">
                          {dish.english_name}
                        </p>
                      )}
                      <p className="text-xs text-sage-mist/70 leading-relaxed line-clamp-2 mb-4 tracking-wide">
                        {dish.short_description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-sage-mist/15 text-[10px] font-mono uppercase tracking-wide text-warm-cream">
                      {dish.cook_time_minutes != null && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-[1px] bg-forest-ink/30 border border-sage-mist/20">
                          <Clock className="w-3 h-3 text-lemon-zest" /> {dish.cook_time_minutes}p
                        </span>
                      )}
                      {dish.spicy_level != null && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-[1px] bg-forest-ink/30 border border-sage-mist/20">
                          <Flame className="w-3 h-3 text-lemon-zest" /> {SPICY_LABELS[dish.spicy_level] || ''}
                        </span>
                      )}
                      {dish.calories_approx != null && (
                        <span className="px-2 py-1 rounded-[1px] bg-forest-ink/30 border border-sage-mist/20">
                          {dish.calories_approx} kcal
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
          </div>

          {!isShowcaseLoading && showcaseDishes.length === 0 && (
            <p className="text-center text-sm text-sage-mist/50 mt-6">Chưa tải được món cho quốc gia này</p>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 px-6 sm:px-10 py-16 border-t border-sage-mist/20 bg-black-olive">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-neon text-lemon-zest mb-2 font-heading">
              Quy trình trải nghiệm
            </h2>
            <p className="text-sm text-sage-mist/70 tracking-wide">
              Cách YumYumPick giúp bạn tìm ra bữa ăn ưng ý chỉ trong 3 bước đơn giản
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="rounded-[1px] border border-sage-mist/20 p-6 bg-black-olive flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-[1px] border border-lemon-zest/40 bg-forest-ink/20 flex items-center justify-center text-lemon-zest">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-stenciled font-heading text-warm-cream">
                1. Lọc theo gu
              </h3>
              <p className="text-xs text-sage-mist/70 leading-relaxed tracking-wide">
                Lọc nhanh theo quốc gia, độ cay, thời gian chế biến hay hàm lượng calo phù hợp với nhu cầu của bạn.
              </p>
            </div>

            <div className="rounded-[1px] border border-sage-mist/20 p-6 bg-black-olive flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-[1px] border border-lemon-zest/40 bg-forest-ink/20 flex items-center justify-center text-lemon-zest">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-stenciled font-heading text-warm-cream">
                2. Quẹt thẻ Tinder
              </h3>
              <p className="text-xs text-sage-mist/70 leading-relaxed tracking-wide">
                Vuốt phải để lưu món yêu thích vào thực đơn, vuốt trái để bỏ qua. Thao tác mượt mà, trực quan.
              </p>
            </div>

            <div className="rounded-[1px] border border-sage-mist/20 p-6 bg-black-olive flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-[1px] border border-lemon-zest/40 bg-forest-ink/20 flex items-center justify-center text-lemon-zest">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-stenciled font-heading text-warm-cream">
                3. Nấu theo công thức
              </h3>
              <p className="text-xs text-sage-mist/70 leading-relaxed tracking-wide">
                Xem chi tiết nguyên liệu, định lượng, từng bước hướng dẫn và bí quyết từ đầu bếp để tự tin vào bếp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="relative z-10 px-6 sm:px-10 py-16 border-t border-sage-mist/20 bg-black-olive">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xs font-bold uppercase tracking-neon text-lemon-zest mb-3 font-heading">
            Sứ mệnh của YumYumPick
          </h2>
          <p className="text-lg sm:text-2xl font-bold font-heading leading-snug mb-4 text-warm-cream tracking-wide">
            Biến việc chọn món ăn hàng ngày thành một trải nghiệm thú vị,
            không còn là gánh nặng suy nghĩ
          </p>
          <p className="text-sm text-sage-mist/75 leading-relaxed tracking-wide mb-8">
            YumYumPick kết hợp trải nghiệm quẹt thẻ quen thuộc với kho dữ liệu phong phú hơn 1100 món ăn từ 15+ nền ẩm thực đặc sắc trên thế giới. Dù bạn muốn một bữa tối lãng mạn, bữa trưa văn phòng nhanh gọn hay thử nghiệm một món mới lạ cuối tuần, YumYumPick luôn có sẵn gợi ý hoàn hảo cho bạn.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[1px] bg-lemon-zest hover:bg-pure-white text-black-olive text-xs font-extrabold uppercase tracking-neon transition-all active:scale-95 shadow-lg shadow-lemon-zest/10 cursor-pointer"
          >
            <span>Trải nghiệm ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-sage-mist/20 bg-black-olive px-6 sm:px-10 pt-12 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[1px] bg-lemon-zest flex items-center justify-center text-black-olive">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-neon font-heading">
                YumYum<span className="text-lemon-zest">Pick</span>
              </span>
            </div>
            <p className="text-xs text-sage-mist/60 leading-relaxed tracking-wide">
              Tinder for Food — quẹt để tìm món, nấu để thưởng thức. Không còn băn khoăn "Hôm nay ăn gì?"
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-neon text-lemon-zest mb-4 font-heading">
                Khám phá
              </h4>
              <ul className="space-y-2 text-xs text-sage-mist/60">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('showcase')}
                    className="hover:text-warm-cream transition-colors cursor-pointer"
                  >
                    Ẩm thực thế giới
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-warm-cream transition-colors cursor-pointer"
                  >
                    Cách thức hoạt động
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('mission')}
                    className="hover:text-warm-cream transition-colors cursor-pointer"
                  >
                    Sứ mệnh
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-neon text-lemon-zest mb-4 font-heading">
                Ẩm thực
              </h4>
              <ul className="space-y-2 text-xs text-sage-mist/60">
                {['Vietnam', 'Korea', 'Japan', 'Thailand', 'Italy'].map((id) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCuisine(id);
                        scrollToSection('showcase');
                      }}
                      className="hover:text-warm-cream transition-colors cursor-pointer"
                    >
                      {cuisineName(id)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-sage-mist/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-sage-mist/40 font-mono">
          <span>YumYumPick — Limón Flat Design System</span>
          <span>1100+ món ăn · 15 nền ẩm thực</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;