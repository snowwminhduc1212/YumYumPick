import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function FilterModal({ isOpen, onClose, metadata, onApplyFilter, initialFilters = {} }) {
  const [cuisine, setCuisine] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [spicyLevel, setSpicyLevel] = useState(null);
  const [maxTime, setMaxTime] = useState(null);

  // Mỗi khi mở modal: hiện lại đúng bộ lọc đang áp dụng (không reset về "Tất cả")
  useEffect(() => {
    if (isOpen) {
      setCuisine(initialFilters.cuisine ?? null);
      setDifficulty(initialFilters.difficulty ?? null);
      setSpicyLevel(initialFilters.spicy_level ?? null);
      setMaxTime(initialFilters.max_time ?? null);
    }
  }, [isOpen, initialFilters]);

  const handleReset = () => {
    setCuisine(null);
    setDifficulty(null);
    setSpicyLevel(null);
    setMaxTime(null);
  };

  const handleApply = () => {
    onApplyFilter({
      cuisine,
      difficulty,
      spicy_level: spicyLevel,
      max_time: maxTime,
    });
    onClose();
  };

  if (!metadata) return null; // chưa tải xong metadata thì không render nội dung filter

  const hasSelection =
    cuisine !== null || difficulty !== null || spicyLevel !== null || maxTime !== null;

  const chipClass = (isActive) =>
    `px-3 py-1.5 rounded-[1px] text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
      isActive
        ? 'bg-lemon-zest text-black-olive border-lemon-zest'
        : 'bg-transparent text-sage-mist border-sage-mist/50 hover:border-pure-white hover:text-pure-white'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-sans text-warm-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-black-olive rounded-[1px] border border-sage-mist w-[90vw] max-w-80 max-h-[85vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — cố định, không cuộn */}
            <div className="p-6 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-warm-cream uppercase tracking-wider">
                Bộ lọc
              </h2>
              {hasSelection && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-bold uppercase tracking-widest text-sage-mist hover:text-lemon-zest transition-colors cursor-pointer"
                >
                  Đặt lại
                </button>
              )}
            </div>

            {/* Vùng filter — CHỈ phần này cuộn */}
            <div className="flex-1 overflow-y-auto px-6">
              {/* Quốc gia */}
              <div className="mb-5">
                <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                  Quốc gia
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setCuisine(null)} className={chipClass(cuisine === null)}>
                    Tất cả
                  </button>
                  {metadata.cuisines.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCuisine(c.id)}
                      className={chipClass(cuisine === c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Độ khó */}
              {metadata.difficulties?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                    Độ khó
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metadata.difficulties.map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setDifficulty(d.value)}
                        className={chipClass(difficulty === d.value)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Độ cay */}
              <div className="mb-5">
                <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                  Độ cay
                </p>
                <div className="flex flex-wrap gap-2">
                  {metadata.spicy_levels.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSpicyLevel(s.value)}
                      className={chipClass(spicyLevel === s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thời gian nấu */}
              <div className="mb-6">
                <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                  Thời gian nấu
                </p>
                <div className="flex flex-wrap gap-2">
                  {metadata.time_ranges.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setMaxTime(t.value)}
                      className={chipClass(maxTime === t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer — LUÔN hiện, không bị cuộn mất */}
            <div className="p-6 pt-4 border-t border-sage-mist/30 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-[1px] bg-transparent border-[1.5px] border-sage-mist/50 hover:border-pure-white text-sage-mist hover:text-pure-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2.5 rounded-[1px] border-[1.5px] border-lemon-zest bg-lemon-zest hover:bg-pure-white hover:border-pure-white text-black-olive text-xs font-extrabold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Áp dụng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FilterModal;