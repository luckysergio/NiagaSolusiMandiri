import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { userKeys } from './useUserManagement';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeUsers = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const forceRefetchAll = () => {
    queryClient.cancelQueries({ queryKey: userKeys.all });
    queryClient.cancelQueries({ queryKey: userKeys.statistics() });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: userKeys.all, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: userKeys.statistics(), refetchType: 'all' });
    }, 100);
  };

  useEffect(() => {
    const channel = echo.channel('users');
    channelRef.current = channel;

    channel.listen('.user.created', (e) => {
      forceRefetchAll();
      showSuccess('User Baru', `User "${e.user?.name || 'Baru'}" berhasil ditambahkan`);
    });

    channel.listen('.user.updated', (e) => {
      queryClient.cancelQueries({ queryKey: userKeys.all });
      queryClient.cancelQueries({ queryKey: userKeys.statistics() });
      if (e.user?.id) {
        queryClient.cancelQueries({ queryKey: userKeys.detail(e.user.id) });
      }

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: userKeys.all, refetchType: 'all' });
        queryClient.invalidateQueries({ queryKey: userKeys.statistics(), refetchType: 'all' });
        if (e.user?.id) {
          queryClient.invalidateQueries({ queryKey: userKeys.detail(e.user.id), refetchType: 'all' });
        }
      }, 100);

      showSuccess('User Diperbarui', `Data user "${e.user?.name || 'Tersebut'}" telah diubah`);
    });

    channel.listen('.user.deleted', (e) => {
      forceRefetchAll();
      showSuccess('User Dihapus', `User "${e.userName || 'Tersebut'}" berhasil dihapus`);
    });

    channel.listen('.user.status.changed', (e) => {
      forceRefetchAll();
      if (e.user?.id) {
        queryClient.cancelQueries({ queryKey: userKeys.detail(e.user.id) });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: userKeys.detail(e.user.id), refetchType: 'all' });
        }, 100);
      }

      const actionMessages = {
        activate: `User "${e.user?.name || 'Tersebut'}" berhasil diaktifkan`,
        deactivate: `User "${e.user?.name || 'Tersebut'}" berhasil dinonaktifkan`,
        force_logout: `User "${e.user?.name || 'Tersebut'}" berhasil dipaksa logout`,
        reset_lock: `Lock user "${e.user?.name || 'Tersebut'}" berhasil direset`,
      };

      showSuccess('Status Berubah', actionMessages[e.action] || 'Status user berhasil diubah');
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('users');
      }
    };
  }, [queryClient, showSuccess]);
};