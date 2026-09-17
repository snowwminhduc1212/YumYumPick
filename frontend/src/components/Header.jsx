import { UtensilsCrossed, SlidersHorizontal, LogOut, LogIn } from 'lucide-react';

function Header({ user, onOpenAuth, onOpenFilter, onLogout }) {
  return (
    <header className="flex flex-col items-center gap-1 mb-2 select-none w-full">
      <div className="flex items-center justify-between w-full max-w-md px-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-heading">
            YumYum<span className="text-orange-500">Pick</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFilter}
            className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            aria-label="Bộ lọc"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-600 dark:text-stone-300" />
          </button>

          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm font-medium text-stone-700 dark:text-stone-200"
            >
              <LogOut className="w-4 h-4" />
              {user.username}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-medium text-white shadow-md shadow-orange-500/30"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
        Quẹt phải để CHỌN • Quẹt trái để BỎ QUA
      </p>
    </header>
  );
}

export default Header;