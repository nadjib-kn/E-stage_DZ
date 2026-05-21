// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

// Helper to ensure uploaded files resolve to the backend server
const normalizeUser = (user) => {
  if (!user) return user;
  const normalized = { ...user };
  if (normalized.avatar && normalized.avatar.startsWith('/uploads/')) {
    normalized.avatar = `${API_URL}${normalized.avatar}`;
  }
  if (normalized.resumeUrl && normalized.resumeUrl.startsWith('/uploads/')) {
    normalized.resumeUrl = `${API_URL}${normalized.resumeUrl}`;
  }
  return normalized;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore user from localStorage and validate token
  useEffect(() => {
    const savedUser = localStorage.getItem('eStageUser');
    const savedToken = localStorage.getItem('eStageToken');
    if (savedUser && savedToken) {
      setCurrentUser(normalizeUser(JSON.parse(savedUser)));
    }
    setIsLoading(false);
  }, []);

  // SIGN IN
  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('/api/auth/login', { email, password });
      const { token, user } = data.data;
      const normalizedUser = normalizeUser(user);
      localStorage.setItem('eStageToken', token);
      localStorage.setItem('eStageUser', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);
      return { success: true, role: normalizedUser.role };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // SIGN IN WITH GOOGLE
  const loginWithGoogle = async (tokenData) => {
    try {
      // support both credential (id_token) and access_token
      const { data } = await apiClient.post('/api/auth/google', tokenData);
      const { token, user } = data.data;
      const normalizedUser = normalizeUser(user);
      localStorage.setItem('eStageToken', token);
      localStorage.setItem('eStageUser', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);
      return { success: true, role: normalizedUser.role };
    } catch (error) {
      const message = error.response?.data?.message || 'Google Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // SIGN UP
  const register = async (role, name, email, password) => {
    try {
      const body = { role, email, password };
      if (role === 'student') {
        const parts = name.trim().split(' ');
        body.firstName = parts[0] || name;
        body.lastName = parts.slice(1).join(' ') || '';
      } else {
        body.companyName = name;
      }
      const { data } = await apiClient.post('/api/auth/register', body);
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  // FORGOT PASSWORD — sends reset email
  const forgotPassword = async (email) => {
    try {
      const { data } = await apiClient.post('/api/auth/forgot-password', { email });
      return { success: true, message: data.message || 'Reset link sent. Please check your inbox.' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      return { success: false, message };
    }
  };

  // RESET PASSWORD
  const resetPassword = async (token, newPassword) => {
    try {
      const { data } = await apiClient.post('/api/auth/reset-password', { token, newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
      return { success: false, message };
    }
  };

  // SIGN OUT
  const logout = async () => {
    try { await apiClient.post('/api/auth/logout'); } catch (_) {}
    localStorage.removeItem('eStageToken');
    localStorage.removeItem('eStageUser');
    setCurrentUser(null);
  };

  // UPDATE LOCAL USER STATE (called after profile edits)
  const updateUser = (data) => {
    const updated = normalizeUser({ ...currentUser, ...data });
    setCurrentUser(updated);
    localStorage.setItem('eStageUser', JSON.stringify(updated));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginWithGoogle, register, logout, updateUser, forgotPassword, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);