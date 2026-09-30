import { useState } from 'react';

const SESSION_KEY = 'yumyum_session';

// Đọc phiên đã lưu NGAY lúc khởi tạo (không chờ useEffect)
// → App biết đã đăng nhập hay chưa ngay từ lần vẽ đầu tiên
function readSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(readSession);

  const login = (userData) => {
    // userData: { id, username, full_name } — đúng theo AuthResponse.user
    const session = { id: userData.id, username: userData.username, full_name: userData.full_name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, isLoading: false, login, logout };
}