import axiosInstance from './axios';

export const categoryApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/admin/product-categories', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/admin/product-categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/admin/product-categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/product-categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/product-categories/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/admin/product-categories/${id}/toggle-active`);
    return response.data;
  },

  getDropdown: async () => {
    const response = await axiosInstance.get('/admin/product-categories/dropdown');
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosInstance.get('/admin/product-categories/statistics');
    return response.data;
  },

  getNextSortOrder: async () => {
    const response = await axiosInstance.get('/admin/product-categories/next-sort-order');
    return response.data;
  },
};