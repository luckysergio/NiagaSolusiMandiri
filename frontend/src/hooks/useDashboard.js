import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export const dashboardKeys = {
  all: ['admin', 'dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
  loginLogs: (filters) => [...dashboardKeys.all, 'loginLogs', filters],
  loginLog: (id) => [...dashboardKeys.all, 'loginLog', id],
  activityLogs: (filters) => [...dashboardKeys.all, 'activityLogs', filters],
  activityLog: (id) => [...dashboardKeys.all, 'activityLog', id],
  blockedIps: (filters) => [...dashboardKeys.all, 'blockedIps', filters],
  blockedIp: (id) => [...dashboardKeys.all, 'blockedIp', id],
  securityAlerts: (filters) => [...dashboardKeys.all, 'securityAlerts', filters],
  securityAlert: (id) => [...dashboardKeys.all, 'securityAlert', id],
};

export const useDashboard = () => {

  const useStats = () => {
    return useQuery({
      queryKey: dashboardKeys.stats(),
      queryFn: async () => {
        const response = await dashboardApi.getStats();
        return response.data;
      },
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60,
    });
  };

  const useLoginLogs = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.loginLogs({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getLoginLogs({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const useLoginLog = (id) => {
    return useQuery({
      queryKey: dashboardKeys.loginLog(id),
      queryFn: async () => {
        const response = await dashboardApi.getLoginLog(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useActivityLogs = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.activityLogs({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getActivityLogs({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const useActivityLog = (id) => {
    return useQuery({
      queryKey: dashboardKeys.activityLog(id),
      queryFn: async () => {
        const response = await dashboardApi.getActivityLog(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useBlockedIps = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.blockedIps({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getBlockedIps({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const useBlockedIp = (id) => {
    return useQuery({
      queryKey: dashboardKeys.blockedIp(id),
      queryFn: async () => {
        const response = await dashboardApi.getBlockedIp(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useSecurityAlerts = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.securityAlerts({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getSecurityAlerts({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const useSecurityAlert = (id) => {
    return useQuery({
      queryKey: dashboardKeys.securityAlert(id),
      queryFn: async () => {
        const response = await dashboardApi.getSecurityAlert(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  return {
    useStats,
    useLoginLogs,
    useLoginLog,
    useActivityLogs,
    useActivityLog,
    useBlockedIps,
    useBlockedIp,
    useSecurityAlerts,
    useSecurityAlert,
  };
};