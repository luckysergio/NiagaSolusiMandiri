import axiosInstance from './axios';

export const authApi = {
  login: async (credentials, recaptchaToken) => {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        recaptcha_token: recaptchaToken,
      };

      const response = await axiosInstance.post('/auth/login', payload);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error;
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan saat login');
      }
    }
  },

  me: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refresh: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};