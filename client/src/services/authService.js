import axios from 'axios';

const API_URL = '/api/users';

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  throw new Error('Login failed'); // Add error throwing

};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.user;
};