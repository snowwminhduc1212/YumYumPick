import React from 'react'
import { MOCK_DISHES } from './data/mockDishes'
import { UtensilsCrossed } from 'lucide-react'

function App() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen w-full py-4 px-2 bg-[#FFFDF9] dark:bg-[#121214] transition-colors">
      {/* HEADER ĐƠN GIẢN */}
      <header className="flex flex-col items-center gap-1 mb-2 select-none">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-heading">
            YumYum<span className="text-orange-500">Pick</span>
          </h1>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Quẹt phải để CHỌN • Quẹt trái để BỎ QUA
        </p>
      </header>

      {/* SWIPE DECK WORKSPACE (Day 1 Placeholder) */}
      <section className="flex-1 flex flex-col items-center justify-center w-full my-auto text-center">
        <h2 className="text-xl text-stone-700 dark:text-stone-300 font-semibold">Canvas Ngày 1 sẵn sàng!</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Dữ liệu mẫu đã có: {MOCK_DISHES.length} món.</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">Hãy bắt đầu tạo SwipeCard và CardStack (Nhiệm vụ Ngày 2).</p>
      </section>

    </main>
  )
}

export default App
