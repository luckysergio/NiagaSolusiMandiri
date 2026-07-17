import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { transactionKeys, dashboardPrefix } from './useTransactions';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeTransactions = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const forceRefetch = () => {
    queryClient.cancelQueries({ queryKey: transactionKeys.all });
    queryClient.cancelQueries({ queryKey: dashboardPrefix });
    
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: dashboardPrefix, refetchType: 'all' });
    }, 50);
  };

  useEffect(() => {
    const channel = echo.channel('transactions');
    channelRef.current = channel;

    channel.listen('.transaction.created', (e) => {
      forceRefetch();
      showSuccess('Transaksi Baru', `Transaksi "${e.transaction?.invoice || 'Baru'}" berhasil ditambahkan`);
    });

    channel.listen('.transaction.updated', (e) => {
      forceRefetch();
      if (e.transaction?.id) {
        queryClient.cancelQueries({ queryKey: transactionKeys.detail(e.transaction.id) });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: transactionKeys.detail(e.transaction.id), refetchType: 'all' });
        }, 50);
      }
      showSuccess('Transaksi Diperbarui', `Data transaksi "${e.transaction?.invoice || 'Tersebut'}" telah diubah`);
    });

    channel.listen('.transaction.deleted', (e) => {
      forceRefetch();
      showSuccess('Transaksi Dihapus', `Transaksi "${e.invoice || 'Tersebut'}" berhasil dihapus`);
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('transactions');
      }
    };
  }, [queryClient, showSuccess]);
};