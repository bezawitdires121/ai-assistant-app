/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL || https://nova-ai-backend-sene.onrender.com/api;

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
    const { data } = await axios.post(`${BASE_URL}/api/auth/signup`, { name, email, password });
    setUser(data);
    localStorage.setItem('nova_user', JSON.stringify(data));
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
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