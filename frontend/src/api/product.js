import axiosInstance from './axios';

export const productApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/admin/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/admin/products/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/admin/products', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/admin/products/${id}/toggle-active`);
    return response.data;
  },

  toggleFeatured: async (id) => {
    const response = await axiosInstance.patch(`/admin/products/${id}/toggle-featured`);
    return response.data;
  },

  getDropdown: async (params = {}) => {
    const response = await axiosInstance.get('/admin/products/dropdown', { params });
    return response.data;
  },

  getStatistics: async (params = {}) => {
    const response = await axiosInstance.get('/admin/products/statistics', { params });
    return response.data;
  },

  getNextSortOrder: async (typeId = null) => {
    const params = typeId ? { product_type_id: typeId } : {};
    const response = await axiosInstance.get('/admin/products/next-sort-order', { params });
    return response.data;
  },

  generateCode: async (prefix = 'PRD') => {
    const response = await axiosInstance.get('/admin/products/generate-code', {
      params: { prefix },
    });
    return response.data;
  },
};