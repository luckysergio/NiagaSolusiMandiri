import axiosInstance from './axios';

export const productTypeApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/admin/product-types', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/admin/product-types/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await axiosInstance.post('/admin/product-types', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await axiosInstance.post(`/admin/product-types/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/product-types/${id}`);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await axiosInstance.patch(`/admin/product-types/${id}/toggle-active`);
    return response.data;
  },

  getDropdown: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axiosInstance.get('/admin/product-types/dropdown', { params });
    return response.data;
  },

  getStatistics: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axiosInstance.get('/admin/product-types/statistics', { params });
    return response.data;
  },

  getNextSortOrder: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axiosInstance.get('/admin/product-types/next-sort-order', { params });
    return response.data;
  },
};