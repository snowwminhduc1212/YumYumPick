import { AnimatePresence, motion } from 'framer-motion';

function AuthModal({ isOpen, onClose }) {
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
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 w-80 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
              AuthModal
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
              Code thật Ngày 2
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200"
            >
              Đóng
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;