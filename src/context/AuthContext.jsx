import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('applyai_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('applyai_token', data.token);
      localStorage.setItem('applyai_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Login failed' };
    } finally { setLoading(false); }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('applyai_token', data.token);
      localStorage.setItem('applyai_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Signup failed' };
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('applyai_token');
    localStorage.removeItem('applyai_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
