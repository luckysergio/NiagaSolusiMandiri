import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { dashboardKeys } from '../hooks/useDashboard';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeDashboard = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  useEffect(() => {
    const channel = echo.channel('dashboard');
    channelRef.current = channel;

    channel.listen('.stats.updated', (e) => {
      console.log('📊 Stats updated:', e.stats);

      queryClient.setQueryData(dashboardKeys.stats(), e.stats);
    });

    channel.listen('.login-log.created', (e) => {
      console.log('🔐 Login log created:', e.loginLog);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.loginLogs(),
        refetchType: 'all',
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
      console.log('📝 Activity log created:', e.activityLog);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.activityLogs(),
        refetchType: 'all',
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
      console.log('🚫 Blocked IP created:', e.blockedIp);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.blockedIps(),
        refetchType: 'all',
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
      console.log('⚠️ Security alert created:', e.securityAlert);

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.securityAlerts(),
        refetchType: 'all',
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

    echo.connector.pusher.connection.bind('connected', () => {
      console.log('✅ Pusher connected');
    });

    echo.connector.pusher.connection.bind('disconnected', () => {
      console.log('❌ Pusher disconnected');
    });

    echo.connector.pusher.connection.bind('error', (err) => {
      console.error('⚠️ Pusher error:', err);
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('dashboard');
      }
    };
  }, [queryClient, showSuccess]);
};