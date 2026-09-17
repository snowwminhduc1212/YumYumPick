import { useState } from 'react';

const SESSION_KEY = 'yumyum_session';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);

  const login = (userData) => {
    const session = { user_id: userData.user_id, username: userData.username };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, isLoading, login, logout };
}