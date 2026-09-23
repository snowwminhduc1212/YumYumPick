import { UtensilsCrossed, Filter, Layers, ChefHat, ArrowRight } from 'lucide-react';

function LandingPage({ onStart }) {
  return (
    <div className="flex-1 flex flex-col bg-[#1d0b0d] text-[#fcf9f0]">
      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-20 h-20 rounded-[1px] bg-[#f7ea48] flex items-center justify-center text-[#1d0b0d] mb-6 shadow-lg">
          <UtensilsCrossed className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[0.04em] uppercase font-heading mb-3">
          YumYum<span className="text-[#f7ea48]">Pick</span>
        </h1>

        <p className="text-sm sm:text-lg text-[#dbe2dc]/80 font-medium tracking-wide mb-2">
          Tinder for Food
        </p>

        <p className="text-lg sm:text-2xl font-bold text-[#f7ea48] mb-10">
          Hôm nay ăn gì?
        </p>

        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-3 rounded-[1px] bg-[#f7ea48] hover:bg-[#e4d73f] text-[#1d0b0d] text-sm font-extrabold uppercase tracking-widest transition-transform active:scale-95 shadow-md"
        >
          <span>START NOWWW</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* HOW IT WORKS — 3 STEPS */}
      <section className="px-6 py-12 border-t border-[#dbe2dc]/15">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-[#dbe2dc]/60 mb-8">
          Cách thức hoạt động
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 max-w-3xl mx-auto">
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