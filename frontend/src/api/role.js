import axiosInstance from './axios';

export const roleApi = {
  getRoles: async ({ page = 1, perPage = 10, ...filters } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ),
    });
    const response = await axiosInstance.get(`/admin/roles?${params}`);
    return response.data;
  },

  getRole: async (id) => {
    const response = await axiosInstance.get(`/admin/roles/${id}`);
    return response.data;
  },

  createRole: async (data) => {
    const response = await axiosInstance.post('/admin/roles', data);
    return response.data;
  },

  updateRole: async (id, data) => {
    const response = await axiosInstance.put(`/admin/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id) => {
    const response = await axiosInstance.delete(`/admin/roles/${id}`);
    return response.data;
  },

  getRolesDropdown: async () => {
    const response = await axiosInstance.get('/admin/roles/dropdown');
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosInstance.get('/admin/roles/statistics');
    return response.data;
  },
};