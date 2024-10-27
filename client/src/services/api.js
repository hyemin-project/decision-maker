import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request config:', config);  // Add this line for debugging
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default {
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      console.log('Signup API response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error.response ? error.response.data : error.message);
      return null;
    }
  },

  async saveResult(resultData) {
    const response = await api.post('/results', resultData);
    return response.data;
  },

  async getDecisionHistory() {
    try {
      const response = await api.get('/decisions');
      return response.data;
    } catch (error) {
      console.error('Error fetching decision history:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};