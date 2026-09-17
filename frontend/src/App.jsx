import React from 'react'
import CardStack from './components/CardStack'
import { MOCK_DISHES } from './data/mockDishes'
import { UtensilsCrossed } from 'lucide-react'

function App() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen w-full py-4 px-2 transition-colors">
      {/* HEADER ĐƠN GIẢN */}
      <header className="flex flex-col items-center gap-1 mb-2 select-none">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warm-cream font-heading">
            YumYum<span className="text-orange-500">Pick</span>
          </h1>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Quẹt phải để CHỌN • Quẹt trái để BỎ QUA
        </p>
      </header>

      {/* SWIPE DECK WORKSPACE */}
      <section className="flex flex-1 items-center justify-center w-full my-auto">
        <CardStack initialDishes={MOCK_DISHES} />
      </section>

      {/* FOOTER HƯỚNG DẪN TEST */}
      <footer className="mt-2 text-center text-[11px] text-stone-400 dark:text-stone-600 select-none">
        Nhánh: <span className="font-mono text-orange-500">feature/fe-swipe-deck</span> • Dữ liệu mẫu Ngày 1 ({MOCK_DISHES.length} món)
      </footer>
    </main>
  )
}

export default App
