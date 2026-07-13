import axiosInstance from './axios';

export const transactionApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/admin/transactions', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/admin/transactions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/admin/transactions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/transactions/${id}`);
    return response.data;
  },

  changeStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/admin/transactions/${id}/change-status`, { status });
    return response.data;
  },

  getDropdown: async (status = null) => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get('/admin/transactions/dropdown', { params });
    return response.data;
  },

  getStatistics: async (startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await axiosInstance.get('/admin/transactions/statistics', { params });
    return response.data;
  },

  exportExcel: async (params = {}) => {
    const response = await axiosInstance.get('/admin/transactions/export-excel', {
      params,
      responseType: 'blob',
    });
    return response;
  },
};