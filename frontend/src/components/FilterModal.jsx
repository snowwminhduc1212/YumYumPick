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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-sans text-warm-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-black-olive rounded-[1px] border border-sage-mist p-6 w-80 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-warm-cream uppercase tracking-wider mb-5">
              Bộ lọc
            </h2>

            {/* Quốc gia */}
            <div className="mb-5">
              <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                Quốc gia
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCuisine(null)}
                  className={`px-3 py-1.5 rounded-[1px] text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                    cuisine === null
                      ? 'bg-lemon-zest text-black-olive border-lemon-zest'
                      : 'bg-transparent text-sage-mist border-sage-mist/50 hover:border-pure-white hover:text-pure-white'
                  }`}
                >
                  Tất cả
                </button>
                {metadata.cuisines.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCuisine(c.id)}
                    className={`px-3 py-1.5 rounded-[1px] text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                      cuisine === c.id
                        ? 'bg-lemon-zest text-black-olive border-lemon-zest'
                        : 'bg-transparent text-sage-mist border-sage-mist/50 hover:border-pure-white hover:text-pure-white'
                    }`}
                  >
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Độ cay */}
            <div className="mb-5">
              <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                Độ cay
              </p>
              <div className="flex flex-wrap gap-2">
                {metadata.spicy_levels.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSpicyLevel(s.value)}
                    className={`px-3 py-1.5 rounded-[1px] text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                      spicyLevel === s.value
                        ? 'bg-lemon-zest text-black-olive border-lemon-zest'
                        : 'bg-transparent text-sage-mist border-sage-mist/50 hover:border-pure-white hover:text-pure-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thời gian nấu */}
            <div className="mb-8">
              <p className="text-xs font-bold text-lemon-zest mb-3 uppercase tracking-widest">
                Thời gian nấu
              </p>
              <div className="flex flex-wrap gap-2">
                {metadata.time_ranges.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setMaxTime(t.value)}
                    className={`px-3 py-1.5 rounded-[1px] text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                      maxTime === t.value
                        ? 'bg-lemon-zest text-black-olive border-lemon-zest'
                        : 'bg-transparent text-sage-mist border-sage-mist/50 hover:border-pure-white hover:text-pure-white'
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
                className="flex-1 py-2.5 rounded-[1px] bg-transparent border-[1.5px] border-sage-mist/50 hover:border-pure-white text-sage-mist hover:text-pure-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
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