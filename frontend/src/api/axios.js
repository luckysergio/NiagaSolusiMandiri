import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const clearAuthAndRedirect = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout')
    ) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { access_token } = response.data.data;

      localStorage.setItem('access_token', access_token);

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;