// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // Increased to 60 seconds for Render free tier cold starts
});

// Attach JWT token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('eStageToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler — redirect to login on 401 (if not already there)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('eStageToken');
      localStorage.removeItem('eStageUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
