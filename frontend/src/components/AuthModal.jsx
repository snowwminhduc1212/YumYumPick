import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { API_PREFIX } from '../config/api';

// Tên hiển thị tiếng Việt cho từng trường
const FIELD_LABELS = {
  username: 'Username',
  password: 'Mật khẩu',
  full_name: 'Họ và tên',
};

// Dịch 1 lỗi validation (422) của FastAPI sang tiếng Việt
function translateValidationError(err) {
  // Lỗi từ field_validator của backend: đã có sẵn câu tiếng Việt, chỉ bỏ tiền tố
  if (err.type === 'value_error' && typeof err.msg === 'string') {
    return err.msg.replace(/^Value error,\s*/, '');
  }

  const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : '';
  const label = FIELD_LABELS[field] || field || 'Dữ liệu';
  const ctx = err.ctx || {};

  switch (err.type) {
    case 'string_too_short':
      return `${label} phải có ít nhất ${ctx.min_length} ký tự`;
    case 'string_too_long':
      return `${label} không được vượt quá ${ctx.max_length} ký tự`;
    case 'missing':
      return `Thiếu ${label}`;
    default:
      return `${label}: ${err.msg}`;
  }
}

// FastAPI trả detail dạng chuỗi (400/401) hoặc mảng object (422 validation)
function extractErrorMessage(detail) {
  if (!detail) return 'Có lỗi xảy ra, thử lại sau.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map(translateValidationError).join('. ');
  }
  return 'Có lỗi xảy ra, thử lại sau.';
}

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setConfirmPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra nhập lại mật khẩu ngay tại frontend, không gửi lên backend
    if (isSignup && password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setIsSubmitting(true);

    // Backend lưu username dạng chữ thường khi đăng ký → gửi chữ thường cho cả login
    const normalizedUsername = username.trim().toLowerCase();

    const endpoint = isSignup ? 'signup' : 'login';
    const body = isSignup
      ? { username: normalizedUsername, password, full_name: fullName.trim() }
      : { username: normalizedUsername, password };

    try {
      const res = await fetch(`${API_PREFIX}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(extractErrorMessage(data.detail));
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

  const inputClass =
    'px-3 py-2.5 rounded-[1px] border border-sage-mist bg-black-olive text-warm-cream focus:outline-none focus:border-lemon-zest text-sm transition-colors';

  // Viền đỏ ở ô nhập lại khi đã gõ mà chưa khớp
  const confirmMismatch = isSignup && confirmPassword.length > 0 && confirmPassword !== password;

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
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-[1px] text-xs font-bold uppercase tracking-wider transition-colors border ${
                  !isSignup ? 'bg-lemon-zest text-black-olive border-lemon-zest' : 'bg-transparent text-sage-mist border-sage-mist/50 hover:text-pure-white hover:border-pure-white'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 rounded-[1px] text-xs font-bold uppercase tracking-wider transition-colors border ${
                  isSignup ? 'bg-lemon-zest text-black-olive border-lemon-zest' : 'bg-transparent text-sage-mist border-sage-mist/50 hover:text-pure-white hover:border-pure-white'
                }`}
              >
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder={isSignup ? 'Username (3–20 ký tự, chữ/số/_ )' : 'Username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="username"
                className={inputClass}
              />

              {isSignup && (
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="name"
                  className={inputClass}
                />
              )}

              <input
                type="password"
                placeholder={isSignup ? 'Mật khẩu (tối thiểu 6 ký tự)' : 'Mật khẩu'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className={inputClass}
              />

              {isSignup && (
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  className={`${inputClass} ${confirmMismatch ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              )}

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-[1px] bg-lemon-zest hover:bg-pure-white text-black-olive text-sm font-extrabold uppercase tracking-[0.04em] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Đang xử lý...' : isSignup ? 'Đăng ký' : 'Đăng nhập'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;