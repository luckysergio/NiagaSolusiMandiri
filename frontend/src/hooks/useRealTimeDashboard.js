import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { dashboardKeys } from '../hooks/useDashboard';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeDashboard = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const optimisticPrepend = (parentKey, newItem) => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.findAll({ queryKey: parentKey });

    queries.forEach((query) => {
      if (query.state.data) {
        queryClient.setQueryData(query.queryKey, (oldData) => {
          if (!oldData) return oldData;

          const existingData = oldData.data?.data || [];
          
          const isDuplicate = existingData.some(
            (item) => item.id === newItem.id
          );

          if (isDuplicate) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [newItem, ...existingData],
              meta: {
                ...oldData.data?.meta,
                total: (oldData.data?.meta?.total || 0) + 1,
              },
            },
          };
        });
      }
    });
  };

  useEffect(() => {
    const channel = echo.channel('dashboard');
    channelRef.current = channel;

    channel.listen('.stats.updated', (e) => {
      queryClient.setQueryData(dashboardKeys.stats(), e.stats);
    });

    channel.listen('.login-log.created', (e) => {
      optimisticPrepend(dashboardKeys.loginLogs(), e.loginLog);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.loginLogs(),
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.stats(),
        refetchType: 'all',
      });

      if (e.loginLog.status === 'success') {
        showSuccess(
          'Login Baru',
          `${e.loginLog.user?.name || e.loginLog.email} berhasil login`
        );
      }
    });

    channel.listen('.activity-log.created', (e) => {
      optimisticPrepend(dashboardKeys.activityLogs(), e.activityLog);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.activityLogs(),
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.stats(),
        refetchType: 'all',
      });

      showSuccess(
        '📝 Aktivitas Baru',
        `${e.activityLog.user?.name || 'System'} - ${e.activityLog.action}`
      );
    });

    channel.listen('.blocked-ip.created', (e) => {
      optimisticPrepend(dashboardKeys.blockedIps(), e.blockedIp);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.blockedIps(),
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.stats(),
        refetchType: 'all',
      });

      showSuccess(
        '⚠️ IP Diblokir',
        `IP ${e.blockedIp.ip_address} telah diblokir`
      );
    });

    channel.listen('.security-alert.created', (e) => {
      optimisticPrepend(dashboardKeys.securityAlerts(), e.securityAlert);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.securityAlerts(),
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.stats(),
        refetchType: 'all',
      });

      const severityEmoji = {
        critical: '🚨',
        high: '⚠️',
        medium: '⚡',
        low: 'ℹ️',
      };

      showSuccess(
        `${severityEmoji[e.securityAlert.severity] || '⚠️'} Alert Keamanan`,
        `${e.securityAlert.type?.replace(/_/g, ' ')} - ${e.securityAlert.severity}`
      );
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('dashboard');
      }
    };
  }, [queryClient, showSuccess]);
};