import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { API_PREFIX } from '../config/api';

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setFullName('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const endpoint = mode === 'login' ? 'login' : 'signup';
    const body =
      mode === 'login'
        ? { username, password }
        : { username, password, full_name: fullName };

    try {
      const res = await fetch(`${API_PREFIX}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend trả {"detail": "..."} khi lỗi
        setError(data.detail || 'Có lỗi xảy ra, thử lại sau.');
        setIsSubmitting(false);
        return;
      }

      // data.user = { id, username, full_name }
      onLoginSuccess(data.user);
      resetForm();
      onClose();
    } catch (err) {
      setError('Không kết nối được server. Kiểm tra backend đã chạy chưa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 w-80 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tab switch */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                  mode === 'login' ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                  mode === 'signup' ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                }`}
              >
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent text-sm"
              />

              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent text-sm"
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent text-sm"
              />

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;