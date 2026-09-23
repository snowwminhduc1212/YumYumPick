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
    } catch {
      setError('Không kết nối được server. Kiểm tra backend đã chạy chưa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-sans text-warm-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-black-olive rounded-[1px] border border-sage-mist p-6 w-80"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tab switch */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-[1px] text-xs font-bold uppercase tracking-wider transition-colors border ${
                  mode === 'login' ? 'bg-lemon-zest text-black-olive border-lemon-zest' : 'bg-transparent text-sage-mist border-sage-mist/50 hover:text-pure-white hover:border-pure-white'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 rounded-[1px] text-xs font-bold uppercase tracking-wider transition-colors border ${
                  mode === 'signup' ? 'bg-lemon-zest text-black-olive border-lemon-zest' : 'bg-transparent text-sage-mist border-sage-mist/50 hover:text-pure-white hover:border-pure-white'
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
                disabled={isSubmitting}
                className="px-3 py-2.5 rounded-[1px] border border-sage-mist bg-black-olive text-warm-cream focus:outline-none focus:border-lemon-zest text-sm transition-colors"
              />

              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="px-3 py-2.5 rounded-[1px] border border-sage-mist bg-black-olive text-warm-cream focus:outline-none focus:border-lemon-zest text-sm transition-colors"
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="px-3 py-2.5 rounded-[1px] border border-sage-mist bg-black-olive text-warm-cream focus:outline-none focus:border-lemon-zest text-sm transition-colors"
              />

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-[1px] bg-lemon-zest hover:bg-pure-white text-black-olive text-sm font-extrabold uppercase tracking-[0.04em] disabled:opacity-50 transition-colors"
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