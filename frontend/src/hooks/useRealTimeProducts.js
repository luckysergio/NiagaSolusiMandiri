import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { echo } from '../lib/echo';
import { productKeys } from './useProducts';
import { useModal } from '../contexts/ModalContext';

export const useRealTimeProducts = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useModal();
  const channelRef = useRef(null);

  const forceRefetch = () => {
    queryClient.cancelQueries({ queryKey: productKeys.all });

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: productKeys.all, refetchType: 'all' });
    }, 50);
  };

  useEffect(() => {
    const channel = echo.channel('products');
    channelRef.current = channel;

    channel.listen('.product.created', (e) => {
      forceRefetch();
      showSuccess('Produk Baru', `Produk "${e.product?.name || 'Baru'}" berhasil ditambahkan`);
    });

    channel.listen('.product.updated', (e) => {
      forceRefetch();
      if (e.product?.id) {
        queryClient.cancelQueries({ queryKey: productKeys.detail(e.product.id) });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: productKeys.detail(e.product.id), refetchType: 'all' });
        }, 50);
      }
      showSuccess('Produk Diperbarui', `Data produk "${e.product?.name || 'Tersebut'}" telah diubah`);
    });

    channel.listen('.product.deleted', (e) => {
      forceRefetch();
      showSuccess('Produk Dihapus', `Produk "${e.productName || 'Tersebut'}" (${e.productCode || ''}) berhasil dihapus`);
    });

    return () => {
      if (channelRef.current) {
        echo.leaveChannel('products');
      }
    };
  }, [queryClient, showSuccess]);
};