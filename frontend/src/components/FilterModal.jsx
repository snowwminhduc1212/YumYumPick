import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function FilterModal({ isOpen, onClose, metadata, onApplyFilter }) {
  const [cuisine, setCuisine] = useState(null);
  const [spicyLevel, setSpicyLevel] = useState(null);
  const [maxTime, setMaxTime] = useState(null);

  // Reset lại lựa chọn mỗi khi mở modal (tránh giữ filter cũ gây rối)
  useEffect(() => {
    if (isOpen) {
      setCuisine(null);
      setSpicyLevel(null);
      setMaxTime(null);
    }
  }, [isOpen]);

  const handleApply = () => {
    onApplyFilter({ cuisine, spicy_level: spicyLevel, max_time: maxTime });
    onClose();
  };

  if (!metadata) return null; // chưa tải xong metadata thì không render nội dung filter

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 w-80 shadow-xl max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              Bộ lọc
            </h2>

            {/* Quốc gia */}
            <div className="mb-4">
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase">
                Quốc gia
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCuisine(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    cuisine === null
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Tất cả
                </button>
                {metadata.cuisines.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCuisine(c.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      cuisine === c.id
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Độ cay */}
            <div className="mb-4">
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase">
                Độ cay
              </p>
              <div className="flex flex-wrap gap-2">
                {metadata.spicy_levels.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSpicyLevel(s.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      spicyLevel === s.value
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thời gian nấu */}
            <div className="mb-6">
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase">
                Thời gian nấu
              </p>
              <div className="flex flex-wrap gap-2">
                {metadata.time_ranges.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setMaxTime(t.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      maxTime === t.value
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-sm font-bold"
              >
                Đóng
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold"
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