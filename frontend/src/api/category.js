import axiosInstance from './axios';

export const categoryApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/admin/product-categories', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/product-categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axiosInstance.post('/admin/product-categories', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/admin/product-categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/product-categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  toggleActive: async (id) => {
    try {
      const response = await axiosInstance.patch(`/admin/product-categories/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDropdown: async () => {
    try {
      const response = await axiosInstance.get('/admin/product-categories/dropdown');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await axiosInstance.get('/admin/product-categories/statistics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};