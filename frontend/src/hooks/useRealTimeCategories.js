import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { categoryKeys } from './useCategories';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeCategories = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const forceRefetch = () => {
    queryClient.cancelQueries({ queryKey: categoryKeys.all });
    queryClient.cancelQueries({ queryKey: categoryKeys.statistics() });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: categoryKeys.statistics(), refetchType: 'all' });
    }, 50);
  };

  useEffect(() => {
    const channel = echo.channel('product-categories');
    channelRef.current = channel;

    channel.listen('.category.created', (e) => {
      forceRefetch();
      showSuccess('Kategori Baru', `Kategori "${e.category?.name || 'Baru'}" berhasil ditambahkan`);
    });

    channel.listen('.category.updated', (e) => {
      forceRefetch();
      if (e.category?.id) {
        queryClient.cancelQueries({ queryKey: categoryKeys.detail(e.category.id) });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.detail(e.category.id), refetchType: 'all' });
        }, 50);
      }
      showSuccess('Kategori Diperbarui', `Data kategori "${e.category?.name || 'Tersebut'}" telah diubah`);
    });

    channel.listen('.category.deleted', (e) => {
      forceRefetch();
      showSuccess('Kategori Dihapus', `Kategori "${e.categoryName || 'Tersebut'}" berhasil dihapus`);
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('product-categories');
      }
    };
  }, [queryClient, showSuccess]);
};