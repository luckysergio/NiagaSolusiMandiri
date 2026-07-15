import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../api/transaction';
import { useModal } from '../contexts/ModalContext';

export const transactionKeys = {
  all: ['admin', 'transactions'],
  lists: () => [...transactionKeys.all, 'list'],
  list: (filters) => [...transactionKeys.lists(), filters],
  details: () => [...transactionKeys.all, 'detail'],
  detail: (id) => [...transactionKeys.details(), id],
  dropdown: (status) => [...transactionKeys.all, 'dropdown', status],
  statistics: (startDate, endDate) => [...transactionKeys.all, 'statistics', startDate, endDate],
};

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useTransactionsList = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: transactionKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await transactionApi.getAll({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      // ✅ PERBAIKAN: Dari 0 menjadi 1 menit agar harmonis dengan WebSocket
      staleTime: 1000 * 60, 
      gcTime: 1000 * 60 * 5,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    });
  };

  const useTransaction = (id) => {
    return useQuery({
      queryKey: transactionKeys.detail(id),
      queryFn: async () => {
        const response = await transactionApi.getById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60,
    });
  };

  const useDropdown = (status = null) => {
    return useQuery({
      queryKey: transactionKeys.dropdown(status),
      queryFn: async () => {
        const response = await transactionApi.getDropdown(status);
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = (startDate = null, endDate = null) => {
    return useQuery({
      queryKey: transactionKeys.statistics(startDate, endDate),
      queryFn: async () => {
        const response = await transactionApi.getStatistics(startDate, endDate);
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const invalidateTransactions = async () => {
    await queryClient.invalidateQueries({
      queryKey: transactionKeys.all,
      refetchType: 'all',
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => transactionApi.create(data),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Transaksi berhasil ditambahkan');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal menambahkan transaksi';
      showError('Gagal', message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => transactionApi.update(id, data),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Transaksi berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui transaksi';
      showError('Gagal', message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => transactionApi.delete(id),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Transaksi berhasil dihapus');
    },
    onError: (error) => {
      const message = error.response?.data?.errors?.id?.[0]
        || error.response?.data?.message
        || 'Gagal menghapus transaksi';
      showError('Gagal', message);
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }) => transactionApi.changeStatus(id, status),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Status transaksi berhasil diubah');
    },
    onError: (error) => {
      const message = error.response?.data?.errors?.status?.[0]
        || error.response?.data?.message
        || 'Gagal mengubah status';
      showError('Gagal', message);
    },
  });

  const handleDelete = (transaction) => {
    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus transaksi "${transaction.invoice}"?`,
      () => {
        deleteMutation.mutate(transaction.id);
      }
    );
  };

  const handleChangeStatus = (transaction, newStatus) => {
    changeStatusMutation.mutate({ id: transaction.id, status: newStatus });
  };

  const handleCreate = async (data) => {
    return createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id, data) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    changeStatusMutation.isPending;

  return {
    useTransactionsList,
    useTransaction,
    useDropdown,
    useStatistics,

    handleDelete,
    handleChangeStatus,
    handleCreate,
    handleUpdate,

    isMutating,
    invalidateTransactions,

    createMutation,
    updateMutation,
    deleteMutation,
    changeStatusMutation,
  };
};