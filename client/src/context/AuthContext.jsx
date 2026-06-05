/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Production: Use environment variable or hardcode production URL
const PRODUCTION_URL = 'https://nova-ai-backend-sene.onrender.com/api';
const BASE_URL = (() => {
  // Try environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Check if running on Vercel (production)
  if (typeof window !== 'undefined' && window.location.hostname === 'nova-ai-chatbot-2026.vercel.app') {
    return PRODUCTION_URL;
  }
  // Fallback
  return PRODUCTION_URL;
})();

console.log('[AuthContext] Using BASE_URL:', BASE_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  try {
    const stored = localStorage.getItem('nova_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.token && parsed._id) {
        setUser(parsed);
      } else {
        localStorage.removeItem('nova_user');
      }
    }
  } catch {
    localStorage.removeItem('nova_user');
  }
  setLoading(false);
}, []);

  const signup = async (name, email, password) => {
    const url = `${BASE_URL}/auth/signup`;
    console.log('[AUTH] Signup request to:', url);
    const { data } = await axios.post(url, { name, email, password });
    setUser(data);
    localStorage.setItem('nova_user', JSON.stringify(data));
    return data;
  };

  const login = async (email, password) => {
    const url = `${BASE_URL}/auth/login`;
    console.log('[AUTH] Login request to:', url);
    const { data } = await axios.post(url, { email, password });
    setUser(data);
    localStorage.setItem('nova_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_sessions');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
