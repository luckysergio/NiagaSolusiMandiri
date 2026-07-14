import axiosInstance from './axios';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  getTransactionChart: async (period = 'monthly') => {
    const response = await axiosInstance.get(`/admin/dashboard/transaction-chart?period=${period}`);
    return response.data;
  },

  getTopProducts: async (limit = 5) => {
    const response = await axiosInstance.get(`/admin/dashboard/top-products?limit=${limit}`);
    return response.data;
  },

  getRecentTransactions: async (limit = 5) => {
    const response = await axiosInstance.get(`/admin/dashboard/recent-transactions?limit=${limit}`);
    return response.data;
  },

  getLoginLogs: async ({ page = 1, perPage = 20, ...filters } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ),
    });
    const response = await axiosInstance.get(`/admin/login-logs?${params}`);
    return response.data;
  },

  getLoginLog: async (id) => {
    const response = await axiosInstance.get(`/admin/login-logs/${id}`);
    return response.data;
  },

  getActivityLogs: async ({ page = 1, perPage = 20, ...filters } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ),
    });
    const response = await axiosInstance.get(`/admin/activity-logs?${params}`);
    return response.data;
  },

  getActivityLog: async (id) => {
    const response = await axiosInstance.get(`/admin/activity-logs/${id}`);
    return response.data;
  },

  getBlockedIps: async ({ page = 1, perPage = 20, ...filters } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ),
    });
    const response = await axiosInstance.get(`/admin/blocked-ips?${params}`);
    return response.data;
  },

  getBlockedIp: async (id) => {
    const response = await axiosInstance.get(`/admin/blocked-ips/${id}`);
    return response.data;
  },

  getSecurityAlerts: async ({ page = 1, perPage = 20, ...filters } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      ),
    });
    const response = await axiosInstance.get(`/admin/security-alerts?${params}`);
    return response.data;
  },

  getSecurityAlert: async (id) => {
    const response = await axiosInstance.get(`/admin/security-alerts/${id}`);
    return response.data;
  },
};