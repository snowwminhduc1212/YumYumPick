import { useState, useEffect } from 'react';

const SESSION_KEY = 'yumyum_session';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

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

  return { user, isLoading, login, logout };
}