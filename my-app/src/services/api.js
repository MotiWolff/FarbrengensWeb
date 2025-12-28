import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor - Token:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Interceptor - Final headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
