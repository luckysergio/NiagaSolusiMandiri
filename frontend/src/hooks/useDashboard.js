import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export const dashboardKeys = {
  all: ['admin', 'dashboard'],

  stats: () => [...dashboardKeys.all, 'stats'],

  loginLogs: () => [...dashboardKeys.all, 'loginLogs'],
  loginLogList: (filters) => [...dashboardKeys.loginLogs(), 'list', filters],
  loginLogDetail: (id) => [...dashboardKeys.loginLogs(), 'detail', id],

  activityLogs: () => [...dashboardKeys.all, 'activityLogs'],
  activityLogList: (filters) => [...dashboardKeys.activityLogs(), 'list', filters],
  activityLogDetail: (id) => [...dashboardKeys.activityLogs(), 'detail', id],

  blockedIps: () => [...dashboardKeys.all, 'blockedIps'],
  blockedIpList: (filters) => [...dashboardKeys.blockedIps(), 'list', filters],
  blockedIpDetail: (id) => [...dashboardKeys.blockedIps(), 'detail', id],

  securityAlerts: () => [...dashboardKeys.all, 'securityAlerts'],
  securityAlertList: (filters) => [...dashboardKeys.securityAlerts(), 'list', filters],
  securityAlertDetail: (id) => [...dashboardKeys.securityAlerts(), 'detail', id],
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
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
    });
  };

  const useLoginLogs = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.loginLogList({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getLoginLogs({ page, ...filters });
        return response;
      },
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
    });
  };

  const useLoginLog = (id) => {
    return useQuery({
      queryKey: dashboardKeys.loginLogDetail(id),
      queryFn: async () => {
        const response = await dashboardApi.getLoginLog(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useActivityLogs = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.activityLogList({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getActivityLogs({ page, ...filters });
        return response;
      },
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
    });
  };

  const useActivityLog = (id) => {
    return useQuery({
      queryKey: dashboardKeys.activityLogDetail(id),
      queryFn: async () => {
        const response = await dashboardApi.getActivityLog(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useBlockedIps = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.blockedIpList({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getBlockedIps({ page, ...filters });
        return response;
      },
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
    });
  };

  const useBlockedIp = (id) => {
    return useQuery({
      queryKey: dashboardKeys.blockedIpDetail(id),
      queryFn: async () => {
        const response = await dashboardApi.getBlockedIp(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useSecurityAlerts = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: dashboardKeys.securityAlertList({ page, ...filters }),
      queryFn: async () => {
        const response = await dashboardApi.getSecurityAlerts({ page, ...filters });
        return response;
      },
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
    });
  };

  const useSecurityAlert = (id) => {
    return useQuery({
      queryKey: dashboardKeys.securityAlertDetail(id),
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