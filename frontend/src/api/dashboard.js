import axiosInstance from './axios';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  getLoginLogs: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    const response = await axiosInstance.get(`/admin/login-logs?${params}`);
    return response.data;
  },

  getLoginLogDetail: async (id) => {
    const response = await axiosInstance.get(`/admin/login-logs/${id}`);
    return response.data;
  },

  getActivityLogs: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    const response = await axiosInstance.get(`/admin/activity-logs?${params}`);
    return response.data;
  },

  getActivityLogDetail: async (id) => {
    const response = await axiosInstance.get(`/admin/activity-logs/${id}`);
    return response.data;
  },

  getBlockedIps: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    const response = await axiosInstance.get(`/admin/blocked-ips?${params}`);
    return response.data;
  },

  getBlockedIpDetail: async (id) => {
    const response = await axiosInstance.get(`/admin/blocked-ips/${id}`);
    return response.data;
  },

  getSecurityAlerts: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    const response = await axiosInstance.get(`/admin/security-alerts?${params}`);
    return response.data;
  },

  getSecurityAlertDetail: async (id) => {
    const response = await axiosInstance.get(`/admin/security-alerts/${id}`);
    return response.data;
  },
};