import axiosInstance from './axios';

export const profileApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/user/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/user/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosInstance.post('/user/change-password', data);
    return response.data;
  },
};