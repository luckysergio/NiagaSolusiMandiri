import axiosInstance from './axios';

export const supplierApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/admin/suppliers', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/admin/suppliers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/admin/suppliers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/suppliers/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/admin/suppliers/${id}/toggle-active`);
    return response.data;
  },

  getDropdown: async () => {
    const response = await axiosInstance.get('/admin/suppliers/dropdown');
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosInstance.get('/admin/suppliers/statistics');
    return response.data;
  },
};