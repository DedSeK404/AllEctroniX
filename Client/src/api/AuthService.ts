import apiClient from './Client';

export const registerUser = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  if (response.data.access_token) {
    // Save token to localStorage for session persistence
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};