import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/api';

const AuthContext = createContext(null);

const normalizeUser = (userData) => {
  if (!userData) return null;

  const id = userData.id || userData._id || userData.userId || null;
  return {
    ...userData,
    id,
    _id: userData._id || id,
    role: userData.role || 'Attendee',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      const parsedUser = normalizeUser(JSON.parse(savedUser));
      setUser(parsedUser);
      localStorage.setItem('userId', parsedUser?._id || parsedUser?.id || '');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const signup = async (formData) => {
    try {
      const res = await axios.post('/auth/signup', formData);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed!'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      const normalizedUser = normalizeUser(userData);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('userId', normalizedUser?._id || normalizedUser?.id || '');

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(normalizedUser);
      return { success: true, user: normalizedUser };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Invalid credentials!' };
    }
  };

  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);