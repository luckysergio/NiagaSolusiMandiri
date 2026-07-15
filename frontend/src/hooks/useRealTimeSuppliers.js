import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { supplierKeys } from './useSuppliers';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeSuppliers = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const forceRefetch = () => {
    queryClient.cancelQueries({ queryKey: supplierKeys.all });
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all, refetchType: 'all' });
    }, 50);
  };

  useEffect(() => {
    const channel = echo.channel('suppliers');
    channelRef.current = channel;

    channel.listen('.supplier.created', (e) => {
      forceRefetch();
      showSuccess('Supplier Baru', `Supplier "${e.supplier?.name || 'Baru'}" berhasil ditambahkan`);
    });

    channel.listen('.supplier.updated', (e) => {
      forceRefetch();
      if (e.supplier?.id) {
        queryClient.cancelQueries({ queryKey: supplierKeys.detail(e.supplier.id) });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: supplierKeys.detail(e.supplier.id), refetchType: 'all' });
        }, 50);
      }
      showSuccess('Supplier Diperbarui', `Data supplier "${e.supplier?.name || 'Tersebut'}" telah diubah`);
    });

    channel.listen('.supplier.deleted', (e) => {
      forceRefetch();
      showSuccess('Supplier Dihapus', `Supplier "${e.supplierName || 'Tersebut'}" berhasil dihapus`);
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('suppliers');
      }
    };
  }, [queryClient, showSuccess]);
};