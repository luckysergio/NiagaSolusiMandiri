import axiosInstance from './axios';

export const userApi = {
  getUsers: async ({ page = 1, perPage = 20, ...filters } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ),
    });
    const response = await axiosInstance.get(`/admin/users?${params}`);
    return response.data;
  },

  getUser: async (id) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await axiosInstance.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  activateUser: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/deactivate`);
    return response.data;
  },

  forceLogout: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/force-logout`);
    return response.data;
  },

  resetLock: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/reset-lock`);
    return response.data;
  },

  getRolesDropdown: async () => {
    const response = await axiosInstance.get('/admin/roles/dropdown');
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosInstance.get('/admin/users/statistics');
    return response.data;
  },
};