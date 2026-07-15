import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { productTypeKeys } from './useProductTypes';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeProductTypes = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const forceRefetch = () => {
    queryClient.cancelQueries({ queryKey: productTypeKeys.all });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: productTypeKeys.all, refetchType: 'all' });
    }, 50);
  };

  useEffect(() => {
    const channel = echo.channel('product-types');
    channelRef.current = channel;

    channel.listen('.product-type.created', (e) => {
      forceRefetch();
      showSuccess('Jenis Produk Baru', `Jenis produk "${e.productType?.name || 'Baru'}" berhasil ditambahkan`);
    });

    channel.listen('.product-type.updated', (e) => {
      forceRefetch();
      if (e.productType?.id) {
        queryClient.cancelQueries({ queryKey: productTypeKeys.detail(e.productType.id) });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: productTypeKeys.detail(e.productType.id), refetchType: 'all' });
        }, 50);
      }
      showSuccess('Jenis Produk Diperbarui', `Data jenis produk "${e.productType?.name || 'Tersebut'}" telah diubah`);
    });

    channel.listen('.product-type.deleted', (e) => {
      forceRefetch();
      showSuccess('Jenis Produk Dihapus', `Jenis produk "${e.productTypeName || 'Tersebut'}" berhasil dihapus`);
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('product-types');
      }
    };
  }, [queryClient, showSuccess]);
};